
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EcgAnimation } from "@/components/EcgAnimation";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-ecg-primary mb-6">
            ECG Education Portal
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master the science and art of ECG interpretation with our comprehensive educational resources, interactive quizzes, and engaging learning materials.
          </p>
          
          <div className="my-12 max-w-3xl mx-auto">
            <EcgAnimation />
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="text-white bg-blue-600 hover:bg-blue-700 px-8 rounded-full text-lg"
              variant="outline"
            >
              Sign In
            </Button>
            
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="text-white bg-blue-600 hover:bg-blue-700 px-8 rounded-full text-lg"
              variant="outline"
            >
              Register Now
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What You'll Learn
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-ecg-primary">
                  ECG Basics
                </CardTitle>
                <CardDescription>
                  Learn the fundamentals of electrocardiography
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Understand the electrical activity of the heart, ECG leads, and how to interpret normal ECG patterns.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-ecg-primary">
                  Advanced Interpretation
                </CardTitle>
                <CardDescription>
                  Identify complex patterns and abnormalities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Learn to recognize arrhythmias, blocks, ischemia, infarction, and other advanced ECG patterns.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-ecg-primary">
                  Clinical Application
                </CardTitle>
                <CardDescription>
                  Apply knowledge to real-world scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Develop the skills to use ECG findings in clinical decision-making and patient care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call-to-action Section */}
      <section className="py-16 px-4 bg-ecg-light">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-ecg-dark">
            Ready to Start Learning?
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students and medical professionals who have improved their ECG interpretation skills with our platform.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate("/register")}
            className="text-lg px-8 bg-ecg-primary hover:bg-ecg-secondary"
          >
            Create Free Account
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 bg-white border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 ECG Education Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
