// Re-export all services and types
export * from './userService';
export * from './articleService';
export * from './videoService';
export * from './quizService';
export * from './leaderboardService';

// Initialize mock data on service import
import { initializeStorage } from './baseService';

// Ensure all services are initialized
const initializeMockData = () => {
  // This function doesn't need to do anything as each service initializes its own data
  // But keeping it for backward compatibility
};

// Initialize on service import
initializeMockData();
