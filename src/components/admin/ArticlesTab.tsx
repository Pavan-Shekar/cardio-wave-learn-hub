
import React, { useState, useEffect } from "react";
import { articleService, Article } from "@/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, FileX, Plus } from "lucide-react";

const ArticlesTab = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [newArticle, setNewArticle] = useState<Omit<Article, 'id' | 'date'>>({
    title: '',
    content: '',
    author: '',
    category: '',
    imageUrl: ''
  });
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);

  const fetchArticles = async () => {
    try {
      const fetchedArticles = await articleService.getArticles();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const success = await articleService.deleteArticle(id);
      if (success) {
        await fetchArticles();
        toast.success("Article deleted successfully");
      } else {
        toast.error("Failed to delete article");
      }
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditArticle(article);
    setNewArticle({
      title: article.title,
      content: article.content,
      author: article.author,
      category: article.category,
      imageUrl: article.imageUrl || ''
    });
    setArticleDialogOpen(true);
  };

  const handleSaveArticle = async () => {
    try {
      if (editArticle) {
        // Update existing article
        const updated = await articleService.updateArticle({
          ...editArticle,
          ...newArticle
        });
        if (updated) {
          toast.success("Article updated successfully");
        } else {
          toast.error("Failed to update article");
          return;
        }
      } else {
        // Create new article
        const created = await articleService.createArticle(newArticle);
        if (created) {
          toast.success("Article created successfully");
        } else {
          toast.error("Failed to create article");
          return;
        }
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
      await fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error("Failed to save article");
    }
  };

  return (
    <>
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
          {loading ? (
            <div className="py-4 text-center">Loading articles...</div>
          ) : (
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
          )}
        </CardContent>
      </Card>

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
    </>
  );
};

export default ArticlesTab;
