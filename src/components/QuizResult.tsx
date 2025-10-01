import { QuizResult as QuizResultType, Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Home } from "lucide-react";

interface QuizResultProps {
  result: QuizResultType;
  quiz: Quiz;
  onRetake: () => void;
  onHome: () => void;
}

export const QuizResult = ({ result, quiz, onRetake, onHome }: QuizResultProps) => {
  const percentage = (result.score / result.total) * 100;
  const passed = percentage >= 60;

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl mx-auto">
      <Card className="border-border/50 shadow-glow">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center animate-scale-in">
            <Trophy className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl md:text-4xl">
            {passed ? "Congratulations! 🎉" : "Good Try!"}
          </CardTitle>
          <CardDescription className="text-lg">
            You scored <span className="text-2xl font-bold text-primary">{result.score}</span> out of{" "}
            <span className="text-2xl font-bold">{result.total}</span>
          </CardDescription>
          <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {percentage.toFixed(0)}%
          </div>
        </CardHeader>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>See how you did on each question</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {quiz.questions.map((question, index) => {
            const userAnswer = result.answers.find(a => a.questionId === question.id);
            const isCorrect = userAnswer?.selectedOptionId === question.correctOptionId;
            const selectedOption = question.options.find(o => o.id === userAnswer?.selectedOptionId);
            const correctOption = question.options.find(o => o.id === question.correctOptionId);

            return (
              <Card key={question.id} className={isCorrect ? "border-accent/50" : "border-destructive/50"}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="font-medium text-foreground">
                        Question {index + 1}: {question.text}
                      </p>
                      <div className="text-sm space-y-1">
                        <p className={isCorrect ? "text-accent" : "text-destructive"}>
                          Your answer: <span className="font-medium">{selectedOption?.text}</span>
                        </p>
                        {!isCorrect && (
                          <p className="text-accent">
                            Correct answer: <span className="font-medium">{correctOption?.text}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={onRetake}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
        <Button
          onClick={onHome}
          size="lg"
          className="flex-1 bg-gradient-primary hover:opacity-90"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};
