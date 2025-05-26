
import { supabaseService } from './supabaseService';

export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalScore: number;
  completedQuizzes: number;
}

export const leaderboardService = {
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const [quizResults, profiles] = await Promise.all([
      supabaseService.getQuizResults(),
      supabaseService.getProfiles()
    ]);
    
    // Group results by user
    const userScores: { [userId: string]: { totalScore: number, completedQuizzes: number } } = {};
    
    quizResults.forEach(result => {
      if (!userScores[result.user_id]) {
        userScores[result.user_id] = {
          totalScore: 0,
          completedQuizzes: 0
        };
      }
      
      userScores[result.user_id].totalScore += result.score;
      userScores[result.user_id].completedQuizzes += 1;
    });
    
    // Convert to array and add usernames
    const leaderboard: LeaderboardEntry[] = Object.keys(userScores).map(userId => {
      const profile = profiles.find(p => p.id === userId);
      return {
        userId,
        username: profile ? profile.name : 'Unknown User',
        totalScore: userScores[userId].totalScore,
        completedQuizzes: userScores[userId].completedQuizzes
      };
    });
    
    // Sort by score (highest first)
    return leaderboard.sort((a, b) => b.totalScore - a.totalScore);
  }
};
