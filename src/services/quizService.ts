
import { supabaseService } from './supabaseService';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export const quizService = {
  getQuizzes: async (): Promise<Quiz[]> => {
    return await supabaseService.getQuizzes();
  },
  
  getQuizById: async (id: string): Promise<Quiz | null> => {
    return await supabaseService.getQuizById(id);
  },
  
  getQuizResults: async (): Promise<QuizResult[]> => {
    const results = await supabaseService.getQuizResults();
    return results.map(result => ({
      id: result.id,
      userId: result.user_id,
      quizId: result.quiz_id,
      score: result.score,
      totalQuestions: result.total_questions,
      date: result.date
    }));
  },
  
  saveQuizResult: async (result: Omit<QuizResult, 'id' | 'date'>): Promise<QuizResult | null> => {
    const savedResult = await supabaseService.saveQuizResult({
      user_id: result.userId,
      quiz_id: result.quizId,
      score: result.score,
      total_questions: result.totalQuestions
    });
    if (!savedResult) return null;
    return {
      id: savedResult.id,
      userId: savedResult.user_id,
      quizId: savedResult.quiz_id,
      score: savedResult.score,
      totalQuestions: savedResult.total_questions,
      date: savedResult.date
    };
  },
  
  createQuiz: async (quiz: Omit<Quiz, 'id'>): Promise<Quiz | null> => {
    return await supabaseService.createQuiz(quiz);
  },
  
  updateQuiz: async (quiz: Quiz): Promise<Quiz | null> => {
    return await supabaseService.updateQuiz(quiz);
  },
  
  deleteQuiz: async (id: string): Promise<boolean> => {
    return await supabaseService.deleteQuiz(id);
  }
};
