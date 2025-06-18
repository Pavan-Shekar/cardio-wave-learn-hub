
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { supabaseService } from "@/services/supabaseService";
import { toast } from "sonner";

type UserRole = "student" | "admin" | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          // Wait a bit for the profile to be created by the trigger
          setTimeout(async () => {
            const profile = await supabaseService.getProfile(session.user.id);
            if (profile) {
              setCurrentUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole
              });
              setIsAuthenticated(true);
            } else {
              console.error('Profile not found for user:', session.user.id);
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          }, 1000);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        // The onAuthStateChange will handle setting the user
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Check if user has the correct role
        const profile = await supabaseService.getProfile(data.user.id);
        if (profile && profile.role !== role) {
          toast.error(`This email is registered as a ${profile.role}, not a ${role}`);
          await supabase.auth.signOut();
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login.");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      console.log('Starting registration with:', { name, email, role });
      
      // For demo: if role is admin, email must contain "admin"
      if (role === "admin" && !email.includes("admin")) {
        toast.error("Admin accounts must use an email containing 'admin'");
        return false;
      }

      // Basic validation
      if (!name.trim()) {
        toast.error("Name is required");
        return false;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: role || 'student'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        
        // Handle specific Supabase errors
        if (error.message.includes('User already registered')) {
          toast.error("An account with this email already exists. Please try logging in instead.");
        } else if (error.message.includes('Invalid email')) {
          toast.error("Please enter a valid email address.");
        } else if (error.message.includes('Password')) {
          toast.error("Password must be at least 6 characters long.");
        } else {
          toast.error(error.message || "Registration failed. Please try again.");
        }
        return false;
      }

      if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Check if email confirmation is required
        if (!data.session) {
          toast.success("Registration successful! Please check your email to verify your account.");
        } else {
          toast.success("Registration successful!");
        }
        return true;
      }

      toast.error("Registration failed. Please try again.");
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("An error occurred during registration.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
  };

  const isAdmin = currentUser?.role === "admin";
  const isStudent = currentUser?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
