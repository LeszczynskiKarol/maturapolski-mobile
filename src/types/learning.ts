// src/types/learning.ts
export interface Exercise {
  id: string;
  type:
    | "CLOSED_SINGLE"
    | "CLOSED_MULTIPLE"
    | "SHORT_ANSWER"
    | "SYNTHESIS_NOTE"
    | "ESSAY";
  category: "LANGUAGE_USE" | "HISTORICAL_LITERARY" | "WRITING";
  epoch?: string;
  difficulty: number;
  points: number;
  question: string;
  content: any;
  correctAnswer?: any;
  tags: string[];
  metadata?: any;
}

export interface SessionStats {
  completed: number;
  correct: number;
  streak: number;
  maxStreak: number;
  points: number;
  timeSpent: number;
}

export interface SessionFilters {
  type?: string;
  category?: string;
  epoch?: string;
  difficulty?: number[];
}

export interface LearningSession {
  id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "PAUSED";
  filters?: SessionFilters;
  completedExercises?: Array<{ id: string; score: number }>;
}
