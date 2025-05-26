
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { articleService, quizService } from "@/services";

const sidebarItems = [
  { title: "Dashboard", href: "/student" },
  { title: "Articles", href: "/student/articles" },
  { title: "Videos", href: "/student/videos" },
  { title: "Quizzes", href: "/student/quizzes" },
  { title: "Leaderboard", href: "/student/leaderboard" },
];

const StudentPortal = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Protect this route for students only
  useAuthRedirect("student");
  
  const [articles, setArticles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesData = await articleService.getArticles();
        setArticles(articlesData.slice(0, 3)); // Get latest 3
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    const fetchQuizzes = async () => {
      try {
        const quizzesData = await quizService.getQuizzes();
        setQuizzes(quizzesData.slice(0, 3)); // Get latest 3
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchArticles();
    fetchQuizzes();
  }, []);

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentUser?.name}</h1>
        <p className="text-gray-500">Continue your ECG learning journey</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your learning and quiz scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">ECG Basics</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 rounded-full bg-ecg-primary" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Arrhythmias</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 rounded-full bg-ecg-primary" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Ischemia & Infarction</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 rounded-full bg-ecg-primary" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => navigate("/student/quizzes")}>
              Continue Learning
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">Yesterday</p>
                <p className="font-medium">Completed Quiz: ECG Basics</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm text-gray-500">3 days ago</p>
                <p className="font-medium">Read Article: Understanding ECG Waves</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">5 days ago</p>
                <p className="font-medium">Watched Video: ECG Interpretation Basics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Latest Articles</h2>
          <Button variant="link" onClick={() => navigate("/student/articles")}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map(article => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <CardDescription className="text-xs">
                  By {article.author} • {new Date(article.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2">{article.content}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/student/articles/${article.id}`)}
                >
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Quizzes</h2>
          <Button variant="link" onClick={() => navigate("/student/quizzes")}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quizzes.map(quiz => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
                <CardDescription className="text-xs">
                  {quiz.questions.length} questions
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-2">{quiz.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(`/student/quizzes/${quiz.id}`)}
                >
                  Take Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPortal;
