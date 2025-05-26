
import React, { useState, useEffect } from "react";
import { quizService, Quiz } from "@/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, FileX, Plus } from "lucide-react";

const QuizzesTab = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const fetchedQuizzes = await quizService.getQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>All Quizzes</CardTitle>
          <Button size="sm" onClick={() => {
            // Quiz creation flow will be implemented in the next phase
            toast.info("Quiz creation will be implemented in the next phase");
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Quiz
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-4 text-center">Loading quizzes...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm border-b">
                  <th className="pb-2 font-medium">Title</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium">Questions</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quizzes.map(quiz => (
                  <tr key={quiz.id} className="text-sm">
                    <td className="py-3">{quiz.title}</td>
                    <td className="py-3 truncate max-w-[300px]">{quiz.description}</td>
                    <td className="py-3">{quiz.questions.length}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileX className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {quizzes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-3 text-center text-sm text-gray-500">
                      No quizzes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizzesTab;
