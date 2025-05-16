
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticlesTab from "@/components/admin/ArticlesTab";
import VideosTab from "@/components/admin/VideosTab";
import QuizzesTab from "@/components/admin/QuizzesTab";

const sidebarItems = [
  { title: "Dashboard", href: "/admin" },
  { title: "Manage Users", href: "/admin/users" },
  { title: "Manage Content", href: "/admin/content" },
];

const ManageContent = () => {
  // Protect this route for admins only
  useAuthRedirect("admin");

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
          <ArticlesTab />
        </TabsContent>
        
        <TabsContent value="videos">
          <VideosTab />
        </TabsContent>
        
        <TabsContent value="quizzes">
          <QuizzesTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ManageContent;
