
import { supabaseService } from './supabaseService';

export interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  category: string;
}

export const videoService = {
  getVideos: async (): Promise<Video[]> => {
    return await supabaseService.getVideos();
  },
  
  getVideoById: async (id: string): Promise<Video | null> => {
    return await supabaseService.getVideoById(id);
  },
  
  createVideo: async (video: Omit<Video, 'id'>): Promise<Video | null> => {
    return await supabaseService.createVideo(video);
  },
  
  updateVideo: async (video: Video): Promise<Video | null> => {
    return await supabaseService.updateVideo(video);
  },
  
  deleteVideo: async (id: string): Promise<boolean> => {
    return await supabaseService.deleteVideo(id);
  }
};
