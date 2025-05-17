import { initializeStorage, getFromStorage, setInStorage } from './baseService';
import { supabase } from "@/integrations/supabase/client";

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

// Hybrid approach - we'll keep localStorage for fallback but try to use Supabase
export const articleService = {
  getArticles: async (): Promise<Article[]> => {
    try {
      // Try to get articles from Supabase
      const { data, error } = await supabase
        .from('articles')
        .select('*');
      
      if (error || !data || data.length === 0) {
        // Fallback to localStorage if Supabase fails or has no data
        console.log("Falling back to localStorage for articles");
        return getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      }
      
      return data as Article[];
    } catch (error) {
      console.error("Error fetching articles:", error);
      // Fallback to localStorage
      return getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
    }
  },
  
  getArticleById: async (id: string): Promise<Article | null> => {
    try {
      // Try to get article from Supabase
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        // Fallback to localStorage
        console.log("Falling back to localStorage for article");
        const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
        return articles.find(article => article.id === id) || null;
      }
      
      return data as Article;
    } catch (error) {
      console.error("Error fetching article by id:", error);
      // Fallback to localStorage
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      return articles.find(article => article.id === id) || null;
    }
  },
  
  createArticle: async (article: Omit<Article, 'id' | 'date'>): Promise<Article> => {
    try {
      const newArticle: Article = {
        ...article,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };
      
      // Try to create article in Supabase
      const { data, error } = await supabase
        .from('articles')
        .insert(newArticle)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage for offline support
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      articles.push(newArticle);
      setInStorage(ARTICLE_STORAGE_KEY, articles);
      
      return data as Article;
    } catch (error) {
      console.error("Error creating article, using localStorage only:", error);
      // Fallback to localStorage only
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      const newArticle: Article = {
        ...article,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
      };
      articles.push(newArticle);
      setInStorage(ARTICLE_STORAGE_KEY, articles);
      return newArticle;
    }
  },
  
  updateArticle: async (article: Article): Promise<Article> => {
    try {
      // Try to update article in Supabase
      const { data, error } = await supabase
        .from('articles')
        .update(article)
        .eq('id', article.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      const index = articles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        articles[index] = article;
        setInStorage(ARTICLE_STORAGE_KEY, articles);
      }
      
      return data as Article;
    } catch (error) {
      console.error("Error updating article, using localStorage only:", error);
      // Fallback to localStorage only
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      const index = articles.findIndex(a => a.id === article.id);
      if (index !== -1) {
        articles[index] = article;
        setInStorage(ARTICLE_STORAGE_KEY, articles);
      }
      return article;
    }
  },
  
  deleteArticle: async (id: string): Promise<void> => {
    try {
      // Try to delete article from Supabase
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      const filtered = articles.filter(article => article.id !== id);
      setInStorage(ARTICLE_STORAGE_KEY, filtered);
    } catch (error) {
      console.error("Error deleting article, using localStorage only:", error);
      // Fallback to localStorage only
      const articles = getFromStorage<Article[]>(ARTICLE_STORAGE_KEY);
      const filtered = articles.filter(article => article.id !== id);
      setInStorage(ARTICLE_STORAGE_KEY, filtered);
    }
  }
};
