
import { initializeStorage, getFromStorage, setInStorage } from './baseService';
import { supabase } from "@/integrations/supabase/client";

const QUIZ_STORAGE_KEY = 'ecgQuizzes';
const QUIZ_RESULTS_KEY = 'ecgQuizResults';

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
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

// Define initial mock quizzes
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'ECG Basics Quiz',
    description: 'Test your knowledge of basic ECG concepts.',
    questions: [
      {
        id: '1',
        text: 'What does ECG stand for?',
        options: ['Electrocardiogram', 'Electroencephalogram', 'Electromyogram', 'Electronic Card Graph'],
        correctAnswer: 0
      },
      {
        id: '2',
        text: 'Which wave represents atrial depolarization?',
        options: ['P wave', 'QRS complex', 'T wave', 'U wave'],
        correctAnswer: 0
      },
      {
        id: '3',
        text: 'What does the T wave represent?',
        options: ['Atrial depolarization', 'Ventricular depolarization', 'Ventricular repolarization', 'Atrial repolarization'],
        correctAnswer: 2
      },
    ]
  },
  {
    id: '2',
    title: 'Advanced ECG Interpretation',
    description: 'Challenge your advanced ECG interpretation skills.',
    questions: [
      {
        id: '1',
        text: 'Which of the following is characteristic of ventricular tachycardia?',
        options: [
          'Regular rhythm with narrow QRS complexes',
          'Irregular rhythm with narrow QRS complexes',
          'Regular rhythm with wide QRS complexes',
          'Irregular rhythm with wide QRS complexes'
        ],
        correctAnswer: 2
      },
      {
        id: '2',
        text: 'What ECG finding is typical of acute pericarditis?',
        options: [
          'ST segment depression',
          'Widespread ST segment elevation',
          'Pathological Q waves',
          'Delta waves'
        ],
        correctAnswer: 1
      },
    ]
  }
];

// Initialize empty quiz results
const mockQuizResults: QuizResult[] = [];

// Initialize
initializeStorage(QUIZ_STORAGE_KEY, mockQuizzes);
initializeStorage(QUIZ_RESULTS_KEY, mockQuizResults);

export const quizService = {
  getQuizzes: async (): Promise<Quiz[]> => {
    try {
      // Try to get quizzes from Supabase
      const { data, error } = await supabase
        .from('quizzes')
        .select('*');
      
      if (error || !data || data.length === 0) {
        // Fallback to localStorage if Supabase fails or has no data
        console.log("Falling back to localStorage for quizzes");
        return getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      }
      
      return data as Quiz[];
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      // Fallback to localStorage
      return getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
    }
  },
  
  getQuizById: async (id: string): Promise<Quiz | null> => {
    try {
      // Try to get quiz from Supabase
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        // Fallback to localStorage
        console.log("Falling back to localStorage for quiz");
        const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
        return quizzes.find(quiz => quiz.id === id) || null;
      }
      
      return data as Quiz;
    } catch (error) {
      console.error("Error fetching quiz by id:", error);
      // Fallback to localStorage
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      return quizzes.find(quiz => quiz.id === id) || null;
    }
  },
  
  getQuizResults: async (): Promise<QuizResult[]> => {
    try {
      // Try to get quiz results from Supabase
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*');
      
      if (error || !data || data.length === 0) {
        // Fallback to localStorage
        return getFromStorage<QuizResult[]>(QUIZ_RESULTS_KEY);
      }
      
      return data as QuizResult[];
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      // Fallback to localStorage
      return getFromStorage<QuizResult[]>(QUIZ_RESULTS_KEY);
    }
  },
  
  saveQuizResult: async (result: Omit<QuizResult, 'date'>): Promise<QuizResult> => {
    try {
      const newResult: QuizResult = {
        ...result,
        date: new Date().toISOString()
      };
      
      // Try to save quiz result to Supabase
      const { data, error } = await supabase
        .from('quiz_results')
        .insert(newResult)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const results = getFromStorage<QuizResult[]>(QUIZ_RESULTS_KEY);
      results.push(newResult);
      setInStorage(QUIZ_RESULTS_KEY, results);
      
      return data as QuizResult;
    } catch (error) {
      console.error("Error saving quiz result, using localStorage only:", error);
      // Fallback to localStorage only
      const results = getFromStorage<QuizResult[]>(QUIZ_RESULTS_KEY);
      const newResult: QuizResult = {
        ...result,
        date: new Date().toISOString()
      };
      results.push(newResult);
      setInStorage(QUIZ_RESULTS_KEY, results);
      return newResult;
    }
  },
  
  createQuiz: async (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
    try {
      const newQuiz: Quiz = {
        ...quiz,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      // Try to create quiz in Supabase
      const { data, error } = await supabase
        .from('quizzes')
        .insert(newQuiz)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      quizzes.push(newQuiz);
      setInStorage(QUIZ_STORAGE_KEY, quizzes);
      
      return data as Quiz;
    } catch (error) {
      console.error("Error creating quiz, using localStorage only:", error);
      // Fallback to localStorage only
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      const newQuiz: Quiz = {
        ...quiz,
        id: Math.random().toString(36).substr(2, 9)
      };
      quizzes.push(newQuiz);
      setInStorage(QUIZ_STORAGE_KEY, quizzes);
      return newQuiz;
    }
  },
  
  updateQuiz: async (quiz: Quiz): Promise<Quiz> => {
    try {
      // Try to update quiz in Supabase
      const { data, error } = await supabase
        .from('quizzes')
        .update(quiz)
        .eq('id', quiz.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      const index = quizzes.findIndex(q => q.id === quiz.id);
      if (index !== -1) {
        quizzes[index] = quiz;
        setInStorage(QUIZ_STORAGE_KEY, quizzes);
      }
      
      return data as Quiz;
    } catch (error) {
      console.error("Error updating quiz, using localStorage only:", error);
      // Fallback to localStorage only
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      const index = quizzes.findIndex(q => q.id === quiz.id);
      if (index !== -1) {
        quizzes[index] = quiz;
        setInStorage(QUIZ_STORAGE_KEY, quizzes);
      }
      return quiz;
    }
  },
  
  deleteQuiz: async (id: string): Promise<void> => {
    try {
      // Try to delete quiz from Supabase
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      const filtered = quizzes.filter(quiz => quiz.id !== id);
      setInStorage(QUIZ_STORAGE_KEY, filtered);
    } catch (error) {
      console.error("Error deleting quiz, using localStorage only:", error);
      // Fallback to localStorage only
      const quizzes = getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
      const filtered = quizzes.filter(quiz => quiz.id !== id);
      setInStorage(QUIZ_STORAGE_KEY, filtered);
    }
  }
};
