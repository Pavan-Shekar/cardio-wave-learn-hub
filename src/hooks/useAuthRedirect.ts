
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useAuthRedirect = (requiredRole?: 'student' | 'admin' | null) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If role is required but user doesn't have it
    if (requiredRole && currentUser?.role !== requiredRole) {
      if (currentUser?.role === 'admin') {
        navigate('/admin');
      } else if (currentUser?.role === 'student') {
        navigate('/student');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, currentUser, requiredRole, navigate]);

  return { currentUser, isAuthenticated };
};
