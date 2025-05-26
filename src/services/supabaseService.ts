
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image_url?: string;
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
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  date: string;
}

// Helper function to safely convert JSON to Questions array
const parseQuestions = (questionsJson: any): Question[] => {
  try {
    if (Array.isArray(questionsJson)) {
      return questionsJson as Question[];
    }
    if (typeof questionsJson === 'string') {
      return JSON.parse(questionsJson) as Question[];
    }
    return questionsJson || [];
  } catch (error) {
    console.error('Error parsing questions JSON:', error);
    return [];
  }
};

export const supabaseService = {
  // Profile methods
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return {
      ...data,
      role: data.role as "student" | "admin"
    };
  },

  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
    return (data || []).map(profile => ({
      ...profile,
      role: profile.role as "student" | "admin"
    }));
  },

  async updateProfile(profile: Partial<Profile> & { id: string }): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return {
      ...data,
      role: data.role as "student" | "admin"
    };
  },

  // Article methods
  async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
    return data || [];
  },

  async getArticleById(id: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }
    return data;
  },

  async createArticle(article: Omit<Article, 'id' | 'date'>): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating article:', error);
      return null;
    }
    return data;
  },

  async updateArticle(article: Article): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .update(article)
      .eq('id', article.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating article:', error);
      return null;
    }
    return data;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting article:', error);
      return false;
    }
    return true;
  },

  // Video methods
  async getVideos(): Promise<Video[]> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
    return data || [];
  },

  async getVideoById(id: string): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching video:', error);
      return null;
    }
    return data;
  },

  async createVideo(video: Omit<Video, 'id'>): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .insert(video)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating video:', error);
      return null;
    }
    return data;
  },

  async updateVideo(video: Video): Promise<Video | null> {
    const { data, error } = await supabase
      .from('videos')
      .update(video)
      .eq('id', video.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating video:', error);
      return null;
    }
    return data;
  },

  async deleteVideo(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting video:', error);
      return false;
    }
    return true;
  },

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
    return (data || []).map(quiz => ({
      ...quiz,
      questions: parseQuestions(quiz.questions)
    }));
  },

  async getQuizById(id: string): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
    return {
      ...data,
      questions: parseQuestions(data.questions)
    };
  },

  async createQuiz(quiz: Omit<Quiz, 'id'>): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .insert({
        ...quiz,
        questions: quiz.questions as any
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating quiz:', error);
      return null;
    }
    return {
      ...data,
      questions: parseQuestions(data.questions)
    };
  },

  async updateQuiz(quiz: Quiz): Promise<Quiz | null> {
    const { data, error } = await supabase
      .from('quizzes')
      .update({
        ...quiz,
        questions: quiz.questions as any
      })
      .eq('id', quiz.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating quiz:', error);
      return null;
    }
    return {
      ...data,
      questions: parseQuestions(data.questions)
    };
  },

  async deleteQuiz(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting quiz:', error);
      return false;
    }
    return true;
  },

  // Quiz result methods
  async getQuizResults(): Promise<QuizResult[]> {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching quiz results:', error);
      return [];
    }
    return data || [];
  },

  async saveQuizResult(result: Omit<QuizResult, 'id' | 'date'>): Promise<QuizResult | null> {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert(result)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving quiz result:', error);
      return null;
    }
    return data;
  }
};
