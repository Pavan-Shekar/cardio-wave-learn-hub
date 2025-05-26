
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { userService, articleService, quizService, videoService, User } from "@/services";

const sidebarItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Manage Users", href: "/admin/users" },
  { title: "Manage Content", href: "/admin/content" },
];

const AdminPortal = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Protect this route for admins only
  useAuthRedirect("admin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedArticles, fetchedVideos, fetchedQuizzes, fetchedUsers] = await Promise.all([
          articleService.getArticles(),
          videoService.getVideos(),
          quizService.getQuizzes(),
          userService.getUsers()
        ]);
        
        setArticles(fetchedArticles);
        setVideos(fetchedVideos);
        setQuizzes(fetchedQuizzes);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Admin Portal">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Admin Portal">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Manage the ECG Education Platform</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{users.filter(u => u.role === "student").length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{users.filter(u => u.role === "admin").length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{articles.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{quizzes.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newest registered users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm border-b">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Email</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.slice(0, 5).map(user => (
                    <tr key={user.id} className="text-sm">
                      <td className="py-3">{user.name}</td>
                      <td className="py-3">{user.email}</td>
                      <td className="py-3 capitalize">{user.role}</td>
                      <td className="py-3">{new Date(user.registeredDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-3 text-center text-sm text-gray-500">
                        No users registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/users")}>
              View All Users
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Manage educational content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Articles</span>
              <span className="text-sm bg-ecg-light text-ecg-primary px-2 py-0.5 rounded-full">
                {articles.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Videos</span>
              <span className="text-sm bg-ecg-light text-ecg-primary px-2 py-0.5 rounded-full">
                {videos.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Quizzes</span>
              <span className="text-sm bg-ecg-light text-ecg-primary px-2 py-0.5 rounded-full">
                {quizzes.length}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" onClick={() => navigate("/admin/content")}>
              Manage Content
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Database Status</span>
              <span className="text-sm text-green-500 font-medium">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Storage Usage</span>
              <span className="text-sm font-medium">32%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Last Backup</span>
              <span className="text-sm font-medium">Today, 03:45 AM</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View System Details
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminPortal;
