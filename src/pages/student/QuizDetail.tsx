
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { quizService, Quiz } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const sidebarItems = [
  { title: "Dashboard", href: "/student" },
  { title: "Articles", href: "/student/articles" },
  { title: "Videos", href: "/student/videos" },
  { title: "Quizzes", href: "/student/quizzes" },
  { title: "Leaderboard", href: "/student/leaderboard" },
];

const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<number | null>>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  // Protect this route
  useAuthRedirect("student");
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (id) {
        try {
          const fetchedQuiz = await quizService.getQuizById(id);
          setQuiz(fetchedQuiz);
          
          if (fetchedQuiz) {
            // Initialize selected answers array with nulls
            setSelectedAnswers(new Array(fetchedQuiz.questions.length).fill(null));
          }
        } catch (error) {
          console.error('Error fetching quiz:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [id]);

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed
      calculateScore();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = async () => {
    if (!quiz || !currentUser) return;
    
    let correct = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    const total = quiz.questions.length;
    setScore({ correct, total });
    
    // Save quiz result
    try {
      await quizService.saveQuizResult({
        userId: currentUser.id,
        quizId: quiz.id,
        score: correct,
        totalQuestions: total,
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
    
    setQuizCompleted(true);
    toast.success("Quiz completed!");
  };

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
        <div className="h-96 flex items-center justify-center">
          <p>Loading quiz...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} title="Student Portal">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
          <p className="mb-8 text-gray-500">The quiz you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/student/quizzes")}>
            Back to Quizzes
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
          onClick={() => navigate("/student/quizzes")}
          className="mb-4"
        >
          ← Back to Quizzes
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
        
        <p className="text-gray-500 mb-8">{quiz.description}</p>
        
        {!quizCompleted ? (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Question {currentQuestion + 1} of {quiz.questions.length}</CardTitle>
              <CardDescription>Select the best answer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">
                  {quiz.questions[currentQuestion].text}
                </h3>
                
                <RadioGroup 
                  value={selectedAnswers[currentQuestion]?.toString() || ""}
                  onValueChange={(value) => handleSelectAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestion] === null}
              >
                {currentQuestion < quiz.questions.length - 1 ? "Next" : "Finish Quiz"}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
              <CardDescription>You've completed the {quiz.title} quiz</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <div className="mb-6">
                <p className="text-5xl font-bold text-ecg-primary">
                  {score.correct} / {score.total}
                </p>
                <p className="text-gray-500 mt-2">
                  Correct answers ({Math.round((score.correct / score.total) * 100)}%)
                </p>
              </div>
              
              <div className="mb-4">
                {score.correct === score.total ? (
                  <p className="font-medium text-green-500">Perfect score! Excellent work!</p>
                ) : score.correct >= score.total * 0.7 ? (
                  <p className="font-medium text-green-500">Great job! You're doing well.</p>
                ) : (
                  <p className="font-medium text-amber-500">Keep studying and try again!</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate("/student/quizzes")}>
                Back to Quizzes
              </Button>
              <Button onClick={() => navigate("/student/leaderboard")}>
                View Leaderboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QuizDetail;
