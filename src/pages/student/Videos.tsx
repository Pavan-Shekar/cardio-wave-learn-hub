
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { videoService, Video } from "@/services";

const sidebarItems = [
  { title: "Dashboard", href: "/student" },
  { title: "Articles", href: "/student/articles" },
  { title: "Videos", href: "/student/videos" },
  { title: "Quizzes", href: "/student/quizzes" },
  { title: "Leaderboard", href: "/student/leaderboard" },
];

const Videos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Protect this route
  useAuthRedirect("student");
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const fetchedVideos = await videoService.getVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getYoutubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
        <div className="h-96 flex items-center justify-center">
          <p>Loading videos...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Educational Videos</h1>
        <p className="text-gray-500">Learn ECG interpretation through video tutorials</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={video.thumbnail || `https://img.youtube.com/vi/${getYoutubeVideoId(video.url)}/hqdefault.jpg`}
                  alt={video.title}
                  className="object-cover w-full"
                />
              </AspectRatio>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button variant="secondary" onClick={() => window.open(video.url, "_blank")}>
                  Play Video
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{video.title}</CardTitle>
              <CardDescription>{video.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2">{video.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(video.url, "_blank")}
              >
                Watch Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Videos;
