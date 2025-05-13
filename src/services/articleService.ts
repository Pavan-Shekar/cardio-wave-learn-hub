
import { initializeStorage, getFromStorage, setInStorage } from './baseService';

const ARTICLE_STORAGE_KEY = 'ecgArticles';

// Initialize with mock data if not present
export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  category: string;
}

// Define initial mock articles
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

// Initialize articles
initializeStorage(ARTICLE_STORAGE_KEY, mockArticles);

export const articleService = {
  getArticles: (): Article[] => {
    return getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
  },
  
  getArticleById: (id: string): Article | null => {
    const articles = articleService.getArticles();
    return articles.find(article => article.id === id) || null;
  },
  
  createArticle: (article: Omit<Article, 'id' | 'date'>): Article => {
    const articles = articleService.getArticles();
    const newArticle: Article = {
      ...article,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };
    articles.push(newArticle);
    setInStorage(ARTICLE_STORAGE_KEY, articles);
    return newArticle;
  },
  
  updateArticle: (article: Article): Article => {
    const articles = articleService.getArticles();
    const index = articles.findIndex(a => a.id === article.id);
    if (index !== -1) {
      articles[index] = article;
      setInStorage(ARTICLE_STORAGE_KEY, articles);
    }
    return article;
  },
  
  deleteArticle: (id: string): void => {
    const articles = articleService.getArticles();
    const filtered = articles.filter(article => article.id !== id);
    setInStorage(ARTICLE_STORAGE_KEY, filtered);
  }
};
