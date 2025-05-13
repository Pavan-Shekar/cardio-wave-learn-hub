
import { initializeStorage, getFromStorage } from './baseService';

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
    const videos = videoService.getVideos();
    return videos.find(video => video.id === id) || null;
  }
};
