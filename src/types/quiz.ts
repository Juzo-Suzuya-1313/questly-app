export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  duration?: number; // in seconds
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: UserAnswer[];
  correctAnswers: { questionId: string; correctOptionId: string }[];
}
