
import React, { useState, useEffect } from "react";
import { videoService, Video } from "@/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, FileX, Plus } from "lucide-react";

const VideosTab = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editVideo, setEditVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState<Omit<Video, 'id'>>({
    title: '',
    url: '',
    description: '',
    category: '',
    thumbnail: ''
  });
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);

  const fetchVideos = async () => {
    try {
      const fetchedVideos = await videoService.getVideos();
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDeleteVideo = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      const success = await videoService.deleteVideo(id);
      if (success) {
        await fetchVideos();
        toast.success("Video deleted successfully");
      } else {
        toast.error("Failed to delete video");
      }
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

  const handleSaveVideo = async () => {
    try {
      if (editVideo) {
        // Update existing video
        const updated = await videoService.updateVideo({
          ...editVideo,
          ...newVideo
        });
        if (updated) {
          toast.success("Video updated successfully");
        } else {
          toast.error("Failed to update video");
          return;
        }
      } else {
        // Create new video
        const created = await videoService.createVideo(newVideo);
        if (created) {
          toast.success("Video created successfully");
        } else {
          toast.error("Failed to create video");
          return;
        }
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
      
      // Refresh videos list
      await fetchVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error("Failed to save video");
    }
  };

  return (
    <>
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
          {loading ? (
            <div className="py-4 text-center">Loading videos...</div>
          ) : (
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
          )}
        </CardContent>
      </Card>

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
    </>
  );
};

export default VideosTab;
