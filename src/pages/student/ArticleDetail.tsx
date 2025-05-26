import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
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

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Protect this route
  useAuthRedirect("student");
  
  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        try {
          const fetchedArticle = await articleService.getArticleById(id);
          setArticle(fetchedArticle);
        } catch (error) {
          console.error('Error fetching article:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
        <div className="h-96 flex items-center justify-center">
          <p>Loading article...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="mb-8 text-gray-500">The article you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/student/articles")}>
            Back to Articles
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/student/articles")}
          className="mb-4"
        >
          ← Back to Articles
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
        
        <div className="flex items-center text-gray-500 text-sm mb-6">
          <span>By {article.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(article.date).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span className="bg-ecg-light text-ecg-primary px-2 py-0.5 rounded-full">
            {article.category}
          </span>
        </div>
        
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{article.content}</p>
          
          <p className="mt-4">
            The electrocardiogram (ECG) is an essential diagnostic tool in modern medicine. 
            It provides a graphical representation of the electrical activity of the heart over time, 
            captured by electrodes placed on the skin. These electrodes detect tiny electrical changes 
            resulting from cardiac muscle depolarization and repolarization during each heartbeat cycle.
          </p>
          
          <h2 className="text-xl font-bold mt-6 mb-3">Key Components of an ECG</h2>
          
          <p>
            A typical ECG consists of several distinct waves, each representing different phases of 
            the heart's electrical activity:
          </p>
          
          <ul className="list-disc pl-5 mt-3 space-y-2">
            <li>
              <strong>P wave:</strong> Represents atrial depolarization, when the electrical 
              impulse travels from the sinoatrial (SA) node through the atria.
            </li>
            <li>
              <strong>PR interval:</strong> The time between the beginning of the P wave and 
              the beginning of the QRS complex, representing the delay at the AV node.
            </li>
            <li>
              <strong>QRS complex:</strong> Represents ventricular depolarization, when the 
              electrical impulse spreads through the ventricles.
            </li>
            <li>
              <strong>ST segment:</strong> Represents the early phase of ventricular repolarization.
            </li>
            <li>
              <strong>T wave:</strong> Represents ventricular repolarization.
            </li>
            <li>
              <strong>QT interval:</strong> Represents the total time for ventricular depolarization 
              and repolarization.
            </li>
          </ul>
          
          <p className="mt-4">
            Understanding these components and their normal patterns is essential for 
            identifying abnormalities and diagnosing cardiac conditions.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleDetail;
