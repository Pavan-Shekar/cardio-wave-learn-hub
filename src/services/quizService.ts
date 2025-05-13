
import { initializeStorage, getFromStorage, setInStorage } from './baseService';

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
  getQuizzes: (): Quiz[] => {
    return getFromStorage<Quiz[]>(QUIZ_STORAGE_KEY);
  },
  
  getQuizById: (id: string): Quiz | null => {
    const quizzes = quizService.getQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  },
  
  getQuizResults: (): QuizResult[] => {
    return getFromStorage<QuizResult[]>(QUIZ_RESULTS_KEY);
  },
  
  saveQuizResult: (result: Omit<QuizResult, 'date'>): QuizResult => {
    const results = quizService.getQuizResults();
    const newResult: QuizResult = {
      ...result,
      date: new Date().toISOString()
    };
    results.push(newResult);
    setInStorage(QUIZ_RESULTS_KEY, results);
    return newResult;
  }
};
