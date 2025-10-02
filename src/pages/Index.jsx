import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuizzes } from "@/hooks/useQuizzes";
import { supabase } from "@/integrations/supabase/client";
import { QuizCard } from "@/components/QuizCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { QuizProgress } from "@/components/QuizProgress";
import { QuizResult } from "@/components/QuizResult";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, Brain, Plus, LogOut, LogIn } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: quizzes, isLoading } = useQuizzes();
  
  const [view, setView] = useState("home");
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(undefined);

  useEffect(() => {
    if (view === "quiz" && currentQuiz?.duration) {
      setTimeRemaining(currentQuiz.duration);
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === undefined || prev <= 0) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [view, currentQuiz]);

  const handleStartQuiz = (quizId) => {
    const quiz = quizzes?.find((q) => q.id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setResult(null);
      setView("quiz");
      toast.success("Quiz started! Good luck!");
    }
  };

  const handleSelectOption = (optionId) => {
    if (!currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const existingAnswerIndex = answers.findIndex(
      (a) => a.questionId === currentQuestion.id
    );

    if (existingAnswerIndex >= 0) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
      };
      setAnswers(newAnswers);
    } else {
      setAnswers([
        ...answers,
        { questionId: currentQuestion.id, selectedOptionId: optionId },
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    if (answers.length < currentQuiz.questions.length) {
      toast.error("Please answer all questions before submitting!");
      return;
    }

    let score = 0;
    const correctAnswers = currentQuiz.questions.map((q) => ({
      questionId: q.id,
      correctOptionId: q.correct_option_id,
    }));

    answers.forEach((answer) => {
      const question = currentQuiz.questions.find((q) => q.id === answer.questionId);
      if (question && answer.selectedOptionId === question.correct_option_id) {
        score++;
      }
    });

    if (user) {
      try {
        await supabase.from("quiz_results").insert({
          user_id: user.id,
          quiz_id: currentQuiz.id,
          score,
          total_questions: currentQuiz.questions.length,
        });
      } catch (error) {
        console.error("Error saving result:", error);
      }
    }

    setResult({
      score,
      total: currentQuiz.questions.length,
      answers,
      correctAnswers,
    });
    setView("result");
    toast.success("Quiz completed!");
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setView("quiz");
  };

  const handleGoHome = () => {
    setView("home");
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
  };

  const getCurrentAnswer = () => {
    if (!currentQuiz) return undefined;
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    return answers.find((a) => a.questionId === currentQuestion.id)?.selectedOptionId;
  };

  if (view === "home") {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-end gap-3 mb-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/create-quiz")}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Quiz
                </Button>
                <Button variant="ghost" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => navigate("/auth")} className="gap-2">
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-4 shadow-glow">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QuizMaster Pro
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Challenge yourself with engaging quizzes. Create your own or explore community quizzes!
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : quizzes && quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground text-lg">No quizzes available yet.</p>
              {user && (
                <Button onClick={() => navigate("/create-quiz")} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Quiz
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === "result" && result && currentQuiz) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <QuizResult
            result={result}
            quiz={currentQuiz}
            onRetake={handleRetakeQuiz}
            onHome={handleGoHome}
          />
        </div>
      </div>
    );
  }

  if (view === "quiz" && currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
    const currentAnswer = getCurrentAnswer();

    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4 animate-fade-in">
            <Button
              variant="ghost"
              onClick={handleGoHome}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <h1 className="text-3xl font-bold text-foreground">{currentQuiz.title}</h1>
            <QuizProgress
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={currentQuiz.questions.length}
              timeRemaining={timeRemaining}
            />
          </div>

          <QuizQuestion
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={currentQuiz.questions.length}
            selectedOptionId={currentAnswer}
            onSelectOption={handleSelectOption}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              size="lg"
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={!currentAnswer}
                size="lg"
                className="flex-1 bg-gradient-success hover:opacity-90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Quiz
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={!currentAnswer}
                size="lg"
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
