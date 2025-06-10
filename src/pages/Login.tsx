import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EcgAnimation } from "@/components/EcgAnimation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser } = useAuth();
  
  // Check if user is already logged in
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Navigate based on role
      if (currentUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    }
  }, [isAuthenticated, currentUser, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      
      if (success) {
        toast.success("Login successful!");
        
        // Navigate based on role
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/student", { replace: true });
        }
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred during login.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ecg-primary mb-2">ECG Education Portal</h1>
          <p className="text-gray-500">Learn ECG interpretation with interactive resources</p>
          
          <div className="my-6">
            <EcgAnimation />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in to your account to access ECG learning materials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={role === "student" ? "default" : "outline"}
                    onClick={() => setRole("student")}
                    className="flex-1"
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant={role === "admin" ? "default" : "outline"}
                    onClick={() => setRole("admin")}
                    className="flex-1"
                  >
                    Administrator
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              Don't have an account?{" "}
              <a 
                onClick={() => navigate("/register")}
                className="text-ecg-primary hover:underline cursor-pointer"
              >
                Register here
              </a>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-gray-600"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
