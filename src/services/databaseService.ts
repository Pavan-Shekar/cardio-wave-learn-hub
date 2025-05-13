
// Mock database using localStorage

// Types
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  category: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  category: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  registeredDate: string;
}

// Initialize mock data if not already present
const initializeMockData = () => {
  // Check if data exists
  if (!localStorage.getItem('ecgArticles')) {
    const mockArticles: Article[] = [
      {
        id: '1',
        title: 'Understanding the Basics of ECG',
        content: 'An electrocardiogram (ECG) is a simple test that can be used to check your heart\'s rhythm and electrical activity...',
        author: 'Dr. Smith',
        date: '2023-01-15',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        category: 'Basics'
      },
      {
        id: '2',
        title: 'Interpreting ECG Waves',
        content: 'The typical ECG tracing of the cardiac cycle consists of a P wave, a QRS complex, and a T wave...',
        author: 'Dr. Johnson',
        date: '2023-02-10',
        imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
        category: 'Interpretation'
      },
      {
        id: '3',
        title: 'Common ECG Abnormalities',
        content: 'There are several common abnormalities that can be detected through ECG readings including arrhythmias...',
        author: 'Dr. Williams',
        date: '2023-03-05',
        imageUrl: 'https://images.unsplash.com/photo-1631815588090-d4bfb0699040?ixlib=rb-4.0.3&auto=format&fit=crop&w=1936&q=80',
        category: 'Abnormalities'
      },
    ];
    
    const mockVideos: Video[] = [
      {
        id: '1',
        title: 'ECG Interpretation Basics',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Learn the basics of ECG interpretation in this comprehensive tutorial.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        category: 'Tutorial'
      },
      {
        id: '2',
        title: 'ECG Rhythm Recognition',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Master the skill of recognizing different ECG rhythms.',
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
        category: 'Advanced'
      },
    ];
    
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
    
    const mockQuizResults: QuizResult[] = [];
    
    // Save mock data to localStorage
    localStorage.setItem('ecgArticles', JSON.stringify(mockArticles));
    localStorage.setItem('ecgVideos', JSON.stringify(mockVideos));
    localStorage.setItem('ecgQuizzes', JSON.stringify(mockQuizzes));
    localStorage.setItem('ecgQuizResults', JSON.stringify(mockQuizResults));
    localStorage.setItem('ecgUsers', JSON.stringify([])); // Empty users array
  }
};

// Initialize on service import
initializeMockData();

// Database service methods
export const databaseService = {
  // User methods
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('ecgUsers') || '[]');
  },
  
  getUserById: (id: string): User | null => {
    const users = databaseService.getUsers();
    return users.find(user => user.id === id) || null;
  },
  
  createUser: (user: Omit<User, 'id' | 'registeredDate'>): User => {
    const users = databaseService.getUsers();
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      registeredDate: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('ecgUsers', JSON.stringify(users));
    return newUser;
  },
  
  updateUser: (user: User): User => {
    const users = databaseService.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('ecgUsers', JSON.stringify(users));
    }
    return user;
  },
  
  deleteUser: (id: string): void => {
    const users = databaseService.getUsers();
    const filtered = users.filter(user => user.id !== id);
    localStorage.setItem('ecgUsers', JSON.stringify(filtered));
  },
  
  // Article methods
  getArticles: (): Article[] => {
    return JSON.parse(localStorage.getItem('ecgArticles') || '[]');
  },
  
  getArticleById: (id: string): Article | null => {
    const articles = databaseService.getArticles();
    return articles.find(article => article.id === id) || null;
  },
  
  createArticle: (article: Omit<Article, 'id' | 'date'>): Article => {
    const articles = databaseService.getArticles();
    const newArticle: Article = {
      ...article,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    articles.push(newArticle);
    localStorage.setItem('ecgArticles', JSON.stringify(articles));
    return newArticle;
  },
  
  updateArticle: (article: Article): Article => {
    const articles = databaseService.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      articles[index] = article;
      localStorage.setItem('ecgArticles', JSON.stringify(articles));
    }
    return article;
  },
  
  deleteArticle: (id: string): void => {
    const articles = databaseService.getArticles();
    const filtered = articles.filter(article => article.id !== id);
    localStorage.setItem('ecgArticles', JSON.stringify(filtered));
  },
  
  // Video methods
  getVideos: (): Video[] => {
    return JSON.parse(localStorage.getItem('ecgVideos') || '[]');
  },
  
  getVideoById: (id: string): Video | null => {
    const videos = databaseService.getVideos();
    return videos.find(video => video.id === id) || null;
  },
  
  // Quiz methods
  getQuizzes: (): Quiz[] => {
    return JSON.parse(localStorage.getItem('ecgQuizzes') || '[]');
  },
  
  getQuizById: (id: string): Quiz | null => {
    const quizzes = databaseService.getQuizzes();
    return quizzes.find(quiz => quiz.id === id) || null;
  },
  
  // Quiz results methods
  getQuizResults: (): QuizResult[] => {
    return JSON.parse(localStorage.getItem('ecgQuizResults') || '[]');
  },
  
  saveQuizResult: (result: Omit<QuizResult, 'date'>): QuizResult => {
    const results = databaseService.getQuizResults();
    const newResult: QuizResult = {
      ...result,
      date: new Date().toISOString()
    };
    results.push(newResult);
    localStorage.setItem('ecgQuizResults', JSON.stringify(results));
    return newResult;
  },
  
  getLeaderboard: (): { userId: string; userName: string; totalScore: number; quizzesTaken: number }[] => {
    const results = databaseService.getQuizResults();
    const users = databaseService.getUsers();
    
    // Group results by userId
    const userScores: Record<string, { totalScore: number; quizzesTaken: number }> = {};
    
    results.forEach(result => {
      if (!userScores[result.userId]) {
        userScores[result.userId] = { totalScore: 0, quizzesTaken: 0 };
      }
      userScores[result.userId].totalScore += result.score;
      userScores[result.userId].quizzesTaken += 1;
    });
    
    // Convert to array and add user names
    return Object.entries(userScores).map(([userId, stats]) => {
      const user = users.find(u => u.id === userId);
      return {
        userId,
        userName: user?.name || 'Unknown User',
        totalScore: stats.totalScore,
        quizzesTaken: stats.quizzesTaken
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }
};
