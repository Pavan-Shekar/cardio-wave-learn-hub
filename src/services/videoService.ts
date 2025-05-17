
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
  getVideos: (): Video[] => {
    return getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
  },
  
  getVideoById: (id: string): Video | null => {
    const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
    return videos.find(video => video.id === id) || null;
  },
  
  createVideo: (video: Omit<Video, 'id'>): Video => {
    const newVideo: Video = {
      ...video,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
    videos.push(newVideo);
    setInStorage(VIDEO_STORAGE_KEY, videos);
    return newVideo;
  },
  
  updateVideo: (video: Video): Video => {
    const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
    const index = videos.findIndex(v => v.id === video.id);
    if (index !== -1) {
      videos[index] = video;
      setInStorage(VIDEO_STORAGE_KEY, videos);
    }
    return video;
  },
  
  deleteVideo: (id: string): void => {
    const videos = getFromStorage<Video[]>(VIDEO_STORAGE_KEY);
    const filtered = videos.filter(video => video.id !== id);
    setInStorage(VIDEO_STORAGE_KEY, filtered);
  }
};
