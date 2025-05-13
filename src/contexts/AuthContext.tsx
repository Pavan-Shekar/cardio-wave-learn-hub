import React, { createContext, useState, useContext, useEffect } from "react";
import { userService } from "../services";

type UserRole = "student" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem("ecgUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // This is a mock authentication - in a real app, this would call an API
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!email || !password || !role) return false;
    
    // For demo: if role is admin, email must contain "admin"
    if (role === "admin" && !email.includes("admin")) {
      return false;
    }
    
    // Create a mock user
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
    };
    
    // Save user to localStorage
    localStorage.setItem("ecgUser", JSON.stringify(user));
    
    // Save user to our mock database
    const dbUser = userService.createUser({
      name: user.name,
      email: user.email,
      role: user.role as "student" | "admin", // Type assertion for the database
    });
    
    // Update state
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    return true;
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!name || !email || !password || !role) return false;
    
    // For demo: if role is admin, email must contain "admin"
    if (role === "admin" && !email.includes("admin")) {
      return false;
    }
    
    // Create a mock user
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    
    // Save user to localStorage
    localStorage.setItem("ecgUser", JSON.stringify(user));
    
    // Save user to our mock database
    const dbUser = userService.createUser({
      name: user.name,
      email: user.email,
      role: user.role as "student" | "admin", // Type assertion for the database
    });
    
    // Update state
    setCurrentUser(user);
    setIsAuthenticated(true);
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem("ecgUser");
    setCurrentUser(null);
    setIsAuthenticated(false);
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
