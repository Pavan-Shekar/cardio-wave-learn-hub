
import { getFromStorage } from './baseService';
import { quizService, QuizResult } from '.';
import { userService } from '.';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalScore: number;
  completedQuizzes: number;
}

export const leaderboardService = {
  getLeaderboard: (): LeaderboardEntry[] => {
    const quizResults = quizService.getQuizResults();
    const users = userService.getUsers();
    
    // Group results by user
    const userScores: { [userId: string]: { totalScore: number, completedQuizzes: number } } = {};
    
    quizResults.forEach(result => {
      if (!userScores[result.userId]) {
        userScores[result.userId] = {
          totalScore: 0,
          completedQuizzes: 0
        };
      }
      
      userScores[result.userId].totalScore += result.score;
      userScores[result.userId].completedQuizzes += 1;
    });
    
    // Convert to array and add usernames
    const leaderboard: LeaderboardEntry[] = Object.keys(userScores).map(userId => {
      const user = users.find(u => u.id === userId);
      return {
        userId,
        username: user ? user.name : 'Unknown User',
        totalScore: userScores[userId].totalScore,
        completedQuizzes: userScores[userId].completedQuizzes
      };
    });
    
    // Sort by score (highest first)
    return leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  }
};
