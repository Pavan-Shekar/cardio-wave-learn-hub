
import { supabaseService } from './supabaseService';

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
  category: string;
}

export const articleService = {
  getArticles: async (): Promise<Article[]> => {
    const articles = await supabaseService.getArticles();
    return articles.map(article => ({
      ...article,
      imageUrl: article.image_url
    }));
  },
  
  getArticleById: async (id: string): Promise<Article | null> => {
    const article = await supabaseService.getArticleById(id);
    if (!article) return null;
    return {
      ...article,
      imageUrl: article.image_url
    };
  },
  
  createArticle: async (article: Omit<Article, 'id' | 'date'>): Promise<Article | null> => {
    const newArticle = await supabaseService.createArticle({
      ...article,
      image_url: article.imageUrl
    });
    if (!newArticle) return null;
    return {
      ...newArticle,
      imageUrl: newArticle.image_url
    };
  },
  
  updateArticle: async (article: Article): Promise<Article | null> => {
    const updatedArticle = await supabaseService.updateArticle({
      ...article,
      image_url: article.imageUrl
    });
    if (!updatedArticle) return null;
    return {
      ...updatedArticle,
      imageUrl: updatedArticle.image_url
    };
  },
  
  deleteArticle: async (id: string): Promise<boolean> => {
    return await supabaseService.deleteArticle(id);
  }
};
