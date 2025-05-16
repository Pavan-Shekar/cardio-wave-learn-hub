
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";

export const useAuthRedirect = (requiredRole?: 'student' | 'admin' | null) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login with message
    if (!isAuthenticated) {
      toast.error("Please login to access this page");
      navigate('/login');
      return;
    }

    // If role is required but user doesn't have it
    if (requiredRole && currentUser?.role !== requiredRole) {
      toast.error(`You need ${requiredRole} access for this page`);
      
      // Redirect based on user's actual role
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else if (currentUser?.role === 'student') {
        navigate('/student');
      } else {
        // If no recognized role, send to login
        navigate('/login');
      }
      return;
    }
  }, [isAuthenticated, currentUser, requiredRole, navigate]);

  return { currentUser, isAuthenticated };
};
