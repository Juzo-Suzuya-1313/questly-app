import { useState, useEffect } from "react";
import { mockQuizzes } from "@/data/mockQuizzes";
import { Quiz, UserAnswer, QuizResult as QuizResultType } from "@/types/quiz";
import { QuizCard } from "@/components/QuizCard";
import { QuizQuestion } from "@/components/QuizQuestion";
import { QuizProgress } from "@/components/QuizProgress";
import { QuizResult } from "@/components/QuizResult";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle, Brain } from "lucide-react";
import { toast } from "sonner";

type ViewState = "home" | "quiz" | "result";

const Index = () => {
  const [view, setView] = useState<ViewState>("home");
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(undefined);

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

  const handleStartQuiz = (quizId: string) => {
    const quiz = mockQuizzes.find((q) => q.id === quizId);
    if (quiz) {
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setResult(null);
      setView("quiz");
      toast.success("Quiz started! Good luck!");
    }
  };

  const handleSelectOption = (optionId: string) => {
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

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    if (answers.length < currentQuiz.questions.length) {
      toast.error("Please answer all questions before submitting!");
      return;
    }

    let score = 0;
    const correctAnswers = currentQuiz.questions.map((q) => ({
      questionId: q.id,
      correctOptionId: q.correctOptionId,
    }));

    answers.forEach((answer) => {
      const question = currentQuiz.questions.find((q) => q.id === answer.questionId);
      if (question && answer.selectedOptionId === question.correctOptionId) {
        score++;
      }
    });

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
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QuizMaster Pro
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your knowledge with our engaging quizzes. Track your progress and improve your skills!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleStartQuiz} />
            ))}
          </div>
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
