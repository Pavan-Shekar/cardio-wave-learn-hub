
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { articleService, Article } from "@/services";

const sidebarItems = [
  { title: "Dashboard", href: "/student" },
  { title: "Articles", href: "/student/articles" },
  { title: "Videos", href: "/student/videos" },
  { title: "Quizzes", href: "/student/quizzes" },
  { title: "Leaderboard", href: "/student/leaderboard" },
];

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Protect this route
  useAuthRedirect("student");
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const fetchedArticles = await articleService.getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
        <div className="h-96 flex items-center justify-center">
          <p>Loading articles...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Educational Articles</h1>
        <p className="text-gray-500">Expand your knowledge with in-depth ECG articles</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
            {article.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <CardDescription>
                By {article.author} • {new Date(article.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2">{article.content}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => navigate(`/student/articles/${article.id}`)}
              >
                Read More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Articles;
