
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { articleService, Article, quizService, Quiz, videoService, Video } from "@/services";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Edit, FileX, X, Plus } from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Manage Users", href: "/admin/users" },
  { title: "Manage Content", href: "/admin/content" },
];

const ManageContent = () => {
  const [articles, setArticles] = useState<Article[]>(articleService.getArticles());
  const [videos, setVideos] = useState<Video[]>(videoService.getVideos());
  const [quizzes, setQuizzes] = useState<Quiz[]>(quizService.getQuizzes());
  
  // Form states
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<Omit<Article, 'id' | 'date'>>({
    title: '',
    content: '',
    author: '',
    category: '',
    imageUrl: ''
  });

  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState<Omit<Video, 'id'>>({
    title: '',
    url: '',
    description: '',
    category: '',
    thumbnail: ''
  });

  // Dialogs open states
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  
  // Protect this route for admins only
  useAuthRedirect("admin");

  // Article handlers
  const handleDeleteArticle = (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      articleService.deleteArticle(id);
      setArticles(articleService.getArticles());
      toast.success("Article deleted successfully");
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditArticle(article);
    setNewArticle({
      title: article.title,
      content: article.content,
      author: article.author,
      category: article.category,
      imageUrl: article.imageUrl
    });
    setArticleDialogOpen(true);
  };

  const handleSaveArticle = () => {
    try {
      if (editArticle) {
        // Update existing article
        articleService.updateArticle({
          ...editArticle,
          ...newArticle
        });
        toast.success("Article updated successfully");
      } else {
        // Create new article
        articleService.createArticle(newArticle);
        toast.success("Article created successfully");
      }
      
      // Reset form and close dialog
      setEditArticle(null);
      setNewArticle({
        title: '',
        content: '',
        author: '',
        category: '',
        imageUrl: ''
      });
      setArticleDialogOpen(false);
      
      // Refresh articles list
      setArticles(articleService.getArticles());
    } catch (error) {
      toast.error("Failed to save article");
      console.error(error);
    }
  };

  // Video handlers
  const handleDeleteVideo = (id: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      // Add deleteVideo method to videoService
      const filteredVideos = videos.filter(video => video.id !== id);
      localStorage.setItem('ecgVideos', JSON.stringify(filteredVideos));
      setVideos(filteredVideos);
      toast.success("Video deleted successfully");
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditVideo(video);
    setNewVideo({
      title: video.title,
      url: video.url,
      description: video.description || '',
      category: video.category,
      thumbnail: video.thumbnail || ''
    });
    setVideoDialogOpen(true);
  };

  const handleSaveVideo = () => {
    try {
      if (editVideo) {
        // Update existing video
        const updatedVideos = videos.map(video => 
          video.id === editVideo.id ? { ...video, ...newVideo } : video
        );
        localStorage.setItem('ecgVideos', JSON.stringify(updatedVideos));
        setVideos(updatedVideos);
        toast.success("Video updated successfully");
      } else {
        // Create new video
        const newVideoWithId = {
          ...newVideo,
          id: Math.random().toString(36).substr(2, 9)
        };
        const updatedVideos = [...videos, newVideoWithId];
        localStorage.setItem('ecgVideos', JSON.stringify(updatedVideos));
        setVideos(updatedVideos);
        toast.success("Video created successfully");
      }
      
      // Reset form and close dialog
      setEditVideo(null);
      setNewVideo({
        title: '',
        url: '',
        description: '',
        category: '',
        thumbnail: ''
      });
      setVideoDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save video");
      console.error(error);
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
                <Button size="sm" onClick={() => {
                  setEditArticle(null);
                  setNewArticle({
                    title: '',
                    content: '',
                    author: '',
                    category: '',
                    imageUrl: ''
                  });
                  setArticleDialogOpen(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditArticle(article)}
                            >
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
                <Button 
                  size="sm"
                  onClick={() => {
                    setEditVideo(null);
                    setNewVideo({
                      title: '',
                      url: '',
                      description: '',
                      category: '',
                      thumbnail: ''
                    });
                    setVideoDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditVideo(video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteVideo(video.id)}
                            >
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
                <Button size="sm" onClick={() => {
                  // Quiz creation flow will be implemented in the next phase
                  toast.info("Quiz creation will be implemented in the next phase");
                }}>
                  <Plus className="mr-2 h-4 w-4" />
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

      {/* Article Form Dialog */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editArticle ? 'Edit Article' : 'Create New Article'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the article. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">Author</Label>
              <Input
                id="author"
                value={newArticle.author}
                onChange={(e) => setNewArticle({...newArticle, author: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input
                id="category"
                value={newArticle.category}
                onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input
                id="imageUrl"
                value={newArticle.imageUrl || ''}
                onChange={(e) => setNewArticle({...newArticle, imageUrl: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right pt-2">Content</Label>
              <Textarea
                id="content"
                value={newArticle.content}
                onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                className="col-span-3"
                rows={10}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setArticleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveArticle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Form Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the video. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-title" className="text-right">Title</Label>
              <Input
                id="video-title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-url" className="text-right">Video URL</Label>
              <Input
                id="video-url"
                value={newVideo.url}
                onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-category" className="text-right">Category</Label>
              <Input
                id="video-category"
                value={newVideo.category}
                onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="video-thumbnail" className="text-right">Thumbnail URL</Label>
              <Input
                id="video-thumbnail"
                value={newVideo.thumbnail || ''}
                onChange={(e) => setNewVideo({...newVideo, thumbnail: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="video-description" className="text-right pt-2">Description</Label>
              <Textarea
                id="video-description"
                value={newVideo.description || ''}
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                className="col-span-3"
                rows={5}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVideoDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVideo}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ManageContent;
