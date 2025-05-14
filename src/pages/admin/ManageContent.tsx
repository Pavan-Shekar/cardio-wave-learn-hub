
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { articleService, Article, quizService, Quiz, videoService, Video } from "@/services";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FileText, Edit, FileX } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Manage Users", href: "/admin/users" },
  { title: "Manage Content", href: "/admin/content" },
];

const ManageContent = () => {
  const [articles, setArticles] = useState<Article[]>(articleService.getArticles());
  const [videos, setVideos] = useState<Video[]>(videoService.getVideos());
  const [quizzes, setQuizzes] = useState<Quiz[]>(quizService.getQuizzes());

  // Protect this route for admins only
  useAuthRedirect("admin");

  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      articleService.deleteArticle(id);
      setArticles(articleService.getArticles());
      toast.success("Article deleted successfully");
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Admin Portal">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Content</h1>
        <p className="text-gray-500">Create and manage educational content</p>
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="mb-6">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Articles</CardTitle>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Article
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm border-b">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Author</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {articles.map(article => (
                      <tr key={article.id} className="text-sm">
                        <td className="py-3">{article.title}</td>
                        <td className="py-3">{article.author}</td>
                        <td className="py-3">{article.category}</td>
                        <td className="py-3">{new Date(article.date).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteArticle(article.id)}
                            >
                              <FileX className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-3 text-center text-sm text-gray-500">
                          No articles available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Videos</CardTitle>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm border-b">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">URL</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {videos.map(video => (
                      <tr key={video.id} className="text-sm">
                        <td className="py-3">{video.title}</td>
                        <td className="py-3">{video.category}</td>
                        <td className="py-3 truncate max-w-[200px]">{video.url}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileX className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {videos.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-sm text-gray-500">
                          No videos available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Quizzes</CardTitle>
                <Button size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Quiz
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm border-b">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Description</th>
                      <th className="pb-2 font-medium">Questions</th>
                      <th className="pb-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {quizzes.map(quiz => (
                      <tr key={quiz.id} className="text-sm">
                        <td className="py-3">{quiz.title}</td>
                        <td className="py-3 truncate max-w-[300px]">{quiz.description}</td>
                        <td className="py-3">{quiz.questions.length}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileX className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {quizzes.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-3 text-center text-sm text-gray-500">
                          No quizzes available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManageContent;
