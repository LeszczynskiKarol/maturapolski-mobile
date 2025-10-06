// src/hooks/useLearningSession.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { Exercise, SessionStats, SessionFilters } from "../types/learning";
import * as SecureStore from "expo-secure-store";

const SESSION_LIMIT = 20;

export function useLearningSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [filters, setFilters] = useState<SessionFilters>({});
  const [completedExercises, setCompletedExercises] = useState<
    Array<{ id: string; score: number }>
  >([]);

  const [stats, setStats] = useState<SessionStats>({
    completed: 0,
    correct: 0,
    streak: 0,
    maxStreak: 0,
    points: 0,
    timeSpent: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionActive && !sessionComplete) {
      timerRef.current = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          timeSpent: prev.timeSpent + 1,
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionActive, sessionComplete]);

  const startSession = useCallback(async () => {
    try {
      setIsLoading(true);

      // Sprawdź token przed rozpoczęciem
      const token = await SecureStore.getItemAsync("authToken");
      console.log("Starting session, has token:", !!token);

      if (!token) {
        throw new Error("Brak tokenu autoryzacji. Zaloguj się ponownie.");
      }

      // Zamknij aktywne sesje
      try {
        const activeSessions = await api.get("/api/learning/active-sessions");
        for (const oldSession of activeSessions.data || []) {
          await api.post("/api/learning/session/complete", {
            sessionId: oldSession.id,
            stats: {
              completed: oldSession.completed || 0,
              correct: oldSession.correct || 0,
              streak: 0,
              maxStreak: oldSession.maxStreak || 0,
              points: oldSession.points || 0,
              timeSpent: 0,
            },
            completedExercises: oldSession.completedExercises || [],
          });
        }
      } catch (error) {
        console.log("No active sessions to close");
      }

      // Rozpocznij nową sesję
      const response = await api.post("/api/learning/session/start");
      const { sessionId: newSessionId } = response.data;

      console.log("Session started:", newSessionId);

      setSessionId(newSessionId);
      setSessionActive(true);
      setSessionComplete(false);
      setStats({
        completed: 0,
        correct: 0,
        streak: 0,
        maxStreak: 0,
        points: 0,
        timeSpent: 0,
      });
      setCompletedExercises([]);

      // Pobierz pierwsze zadanie
      await fetchNextExercise();
    } catch (error: any) {
      console.error("Failed to start session:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchNextExercise = useCallback(
    async (excludeId?: string) => {
      try {
        setIsLoading(true);

        if (Object.keys(filters).length > 0) {
          await api.post("/api/learning/session/filters", filters);
        }

        const response = await api.get("/api/learning/next", {
          params: { excludeId },
        });

        console.log("Fetched exercise:", response.data.id);

        setCurrentExercise(response.data);
        setAnswer(null);
        setShowFeedback(false);
        setSubmissionResult(null);
      } catch (error) {
        console.error("Failed to fetch exercise:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  const submitAnswer = useCallback(async () => {
    if (!currentExercise || !sessionId) return;

    try {
      setIsLoading(true);

      const response = await api.post(
        `/api/exercises/${currentExercise.id}/submit`,
        { answer }
      );

      const result = response.data;
      setSubmissionResult(result);

      await api.post("/api/learning/session/update-completed", {
        sessionId,
        exerciseId: currentExercise.id,
        score: result.score || 0,
      });

      const isCorrect = result.score > 0;
      setCompletedExercises((prev) => [
        ...prev,
        { id: currentExercise.id, score: result.score || 0 },
      ]);

      setStats((prev) => ({
        completed: prev.completed + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        streak: isCorrect ? prev.streak + 1 : 0,
        maxStreak: isCorrect
          ? Math.max(prev.maxStreak, prev.streak + 1)
          : prev.maxStreak,
        points: prev.points + (result.score || 0),
        timeSpent: prev.timeSpent,
      }));

      setShowFeedback(true);

      if (stats.completed + 1 >= SESSION_LIMIT) {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentExercise, sessionId, answer, stats.completed]);

  const skipExercise = useCallback(async () => {
    if (!currentExercise) return;
    await fetchNextExercise(currentExercise.id);
  }, [currentExercise, fetchNextExercise]);

  const nextExercise = useCallback(async () => {
    if (stats.completed >= SESSION_LIMIT) {
      setSessionComplete(true);
      return;
    }
    await fetchNextExercise();
  }, [stats.completed, fetchNextExercise]);

  const endSession = useCallback(async () => {
    if (!sessionId) return;

    try {
      await api.post("/api/learning/session/complete", {
        sessionId,
        stats,
        completedExercises,
      });

      setSessionId(null);
      setSessionActive(false);
      setCurrentExercise(null);
      setAnswer(null);
      setShowFeedback(false);
      setFilters({});
      setCompletedExercises([]);
      setStats({
        completed: 0,
        correct: 0,
        streak: 0,
        maxStreak: 0,
        points: 0,
        timeSpent: 0,
      });
    } catch (error) {
      console.error("Failed to end session:", error);
      throw error;
    }
  }, [sessionId, stats, completedExercises]);

  return {
    sessionId,
    sessionActive,
    currentExercise,
    isLoading,
    answer,
    showFeedback,
    submissionResult,
    sessionComplete,
    stats,
    filters,
    SESSION_LIMIT,
    setAnswer,
    setFilters,
    startSession,
    submitAnswer,
    skipExercise,
    nextExercise,
    endSession,
  };
}
