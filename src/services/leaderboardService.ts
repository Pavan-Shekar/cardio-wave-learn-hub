
import { quizService } from './quizService';
import { userService } from './userService';

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalScore: number;
  quizzesTaken: number;
}

export const leaderboardService = {
  getLeaderboard: (): LeaderboardEntry[] => {
    const results = quizService.getQuizResults();
    const users = userService.getUsers();
    
    // Group results by userId
    const userScores: Record<string, { totalScore: number; quizzesTaken: number }> = {};
    
    results.forEach(result => {
      if (!userScores[result.userId]) {
        userScores[result.userId] = { totalScore: 0, quizzesTaken: 0 };
      }
      userScores[result.userId].totalScore += result.score;
      userScores[result.userId].quizzesTaken += 1;
    });
    
    // Convert to array and add user names
    return Object.entries(userScores).map(([userId, stats]) => {
      const user = users.find(u => u.id === userId);
      return {
        userId,
        userName: user?.name || 'Unknown User',
        totalScore: stats.totalScore,
        quizzesTaken: stats.quizzesTaken
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  }
};
