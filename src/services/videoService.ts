
import { initializeStorage, getFromStorage, setInStorage } from './baseService';
import { supabase } from "@/integrations/supabase/client";

const VIDEO_STORAGE_KEY = 'ecgVideos';

export interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  thumbnail?: string;
  category: string;
}

// Define initial mock videos
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

// Initialize videos
initializeStorage(VIDEO_STORAGE_KEY, mockVideos);

export const videoService = {
  getVideos: async (): Promise<Video[]> => {
    try {
      // Try to get videos from Supabase
      const { data, error } = await supabase
        .from('videos')
        .select('*');
      
      if (error || !data || data.length === 0) {
        // Fallback to localStorage if Supabase fails or has no data
        console.log("Falling back to localStorage for videos");
        return getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      }
      
      return data as Video[];
    } catch (error) {
      console.error("Error fetching videos:", error);
      // Fallback to localStorage
      return getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
    }
  },
  
  getVideoById: async (id: string): Promise<Video | null> => {
    try {
      // Try to get video from Supabase
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        // Fallback to localStorage
        console.log("Falling back to localStorage for video");
        const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
        return videos.find(video => video.id === id) || null;
      }
      
      return data as Video;
    } catch (error) {
      console.error("Error fetching video by id:", error);
      // Fallback to localStorage
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      return videos.find(video => video.id === id) || null;
    }
  },
  
  createVideo: async (video: Omit<Video, 'id'>): Promise<Video> => {
    try {
      const newVideo: Video = {
        ...video,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      // Try to create video in Supabase
      const { data, error } = await supabase
        .from('videos')
        .insert(newVideo)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage for offline support
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      videos.push(newVideo);
      setInStorage(VIDEO_STORAGE_KEY, videos);
      
      return data as Video;
    } catch (error) {
      console.error("Error creating video, using localStorage only:", error);
      // Fallback to localStorage only
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      const newVideo: Video = {
        ...video,
        id: Math.random().toString(36).substr(2, 9)
      };
      videos.push(newVideo);
      setInStorage(VIDEO_STORAGE_KEY, videos);
      return newVideo;
    }
  },
  
  updateVideo: async (video: Video): Promise<Video> => {
    try {
      // Try to update video in Supabase
      const { data, error } = await supabase
        .from('videos')
        .update(video)
        .eq('id', video.id)
        .select()
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      const index = videos.findIndex(v => v.id === video.id);
      if (index !== -1) {
        videos[index] = video;
        setInStorage(VIDEO_STORAGE_KEY, videos);
      }
      
      return data as Video;
    } catch (error) {
      console.error("Error updating video, using localStorage only:", error);
      // Fallback to localStorage only
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      const index = videos.findIndex(v => v.id === video.id);
      if (index !== -1) {
        videos[index] = video;
        setInStorage(VIDEO_STORAGE_KEY, videos);
      }
      return video;
    }
  },
  
  deleteVideo: async (id: string): Promise<void> => {
    try {
      // Try to delete video from Supabase
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Also update localStorage
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      const filtered = videos.filter(video => video.id !== id);
      setInStorage(VIDEO_STORAGE_KEY, filtered);
    } catch (error) {
      console.error("Error deleting video, using localStorage only:", error);
      // Fallback to localStorage only
      const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
      const filtered = videos.filter(video => video.id !== id);
      setInStorage(VIDEO_STORAGE_KEY, filtered);
    }
  }
};
