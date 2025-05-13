
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EcgAnimation } from "@/components/EcgAnimation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(name, email, password, role);
      
      if (success) {
        toast.success("Registration successful!");
        
        // Navigate based on role
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
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
          <p className="text-gray-500">Create an account to access learning resources</p>
          
          <div className="my-6">
            <EcgAnimation />
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {role === "admin" && (
                  <p className="text-xs text-amber-600 mt-1">
                    Note: Admin accounts require an email containing "admin"
                  </p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-center w-full">
              Already have an account?{" "}
              <a 
                onClick={() => navigate("/login")}
                className="text-ecg-primary hover:underline cursor-pointer"
              >
                Login here
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

export default Register;
