
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { leaderboardService, LeaderboardEntry } from "@/services";
import { Trophy } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/student" },
  { title: "Articles", href: "/student/articles" },
  { title: "Videos", href: "/student/videos" },
  { title: "Quizzes", href: "/student/quizzes" },
  { title: "Leaderboard", href: "/student/leaderboard" },
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect this route
  useAuthRedirect("student");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await leaderboardService.getLeaderboard();
        console.log("Leaderboard data:", data);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
        </div>
        <p className="text-gray-500 mb-8">See how you rank among other students</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>
              Students ranked by total quiz scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p>Loading leaderboard...</p>
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm border-b">
                      <th className="pb-2 font-medium">Rank</th>
                      <th className="pb-2 font-medium">Student</th>
                      <th className="pb-2 font-medium text-right">Quizzes Taken</th>
                      <th className="pb-2 font-medium text-right">Total Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.userId} className={`text-sm ${index < 3 ? "font-medium" : ""}`}>
                        <td className="py-3">
                          <div className="flex items-center">
                            {index === 0 && (
                              <span className="text-lg mr-2">🥇</span>
                            )}
                            {index === 1 && (
                              <span className="text-lg mr-2">🥈</span>
                            )}
                            {index === 2 && (
                              <span className="text-lg mr-2">🥉</span>
                            )}
                            {index > 2 && (
                              <span className="text-sm font-medium text-gray-500 mr-2">#{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <div className={index < 3 ? "text-ecg-primary" : ""}>
                            {entry.username}
                          </div>
                        </td>
                        <td className="py-3 text-right">{entry.completedQuizzes}</td>
                        <td className="py-3 text-right font-medium">{entry.totalScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No quiz results available yet.</p>
                <p className="text-gray-500">Be the first to complete a quiz and appear on the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
