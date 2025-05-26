
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { quizService, Quiz } from "@/services";
import { ListOrdered } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/student" },
  { title: "Articles", href: "/student/articles" },
  { title: "Videos", href: "/student/videos" },
  { title: "Quizzes", href: "/student/quizzes" },
  { title: "Leaderboard", href: "/student/leaderboard" },
];

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Protect this route
  useAuthRedirect("student");
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await quizService.getQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ECG Quizzes</h1>
        <p className="text-gray-500 mb-8">Test your knowledge with these interactive quizzes</p>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p>Loading quizzes...</p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListOrdered className="h-5 w-5 text-ecg-primary" />
                    {quiz.title}
                  </CardTitle>
                  <CardDescription>
                    {quiz.questions.length} questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
                    className="w-full"
                  >
                    Take Quiz
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No quizzes available at the moment.</p>
            <p className="text-gray-500">Please check back later.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Quizzes;
