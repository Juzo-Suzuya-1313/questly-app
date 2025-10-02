import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const QuizResult = ({ result, quiz, onRetake, onHome }) => {
  const percentage = (result.score / result.total) * 100;

  return (
    <Card className="shadow-glow border-primary/20 animate-fade-in">
      <CardHeader className="text-center space-y-6 pb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mx-auto shadow-glow animate-scale-in">
          <Trophy className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-4xl font-bold">Quiz Complete!</CardTitle>
          <p className="text-muted-foreground text-lg">
            You scored <span className="text-2xl font-bold text-primary">{result.score}</span> out of{" "}
            <span className="text-2xl font-bold text-primary">{result.total}</span>
          </p>
          <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {percentage.toFixed(0)}%
          </div>
        </div>
      </CardHeader>

      <Separator className="my-6" />

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Review Your Answers</h3>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = result.answers.find((a) => a.questionId === question.id);
              const isCorrect = userAnswer?.selectedOptionId === question.correct_option_id;
              const selectedOption = question.options.find((o) => o.id === userAnswer?.selectedOptionId);
              const correctOption = question.options.find((o) => o.id === question.correct_option_id);

              return (
                <Card
                  key={question.id}
                  className={`border-2 transition-all ${
                    isCorrect 
                      ? "border-green-500/50 bg-green-50 dark:bg-green-950/20" 
                      : "border-red-500/50 bg-red-50 dark:bg-red-950/20"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-base font-semibold">
                          Question {index + 1}
                        </CardTitle>
                        <p className="text-sm text-foreground/80 mt-1">{question.text}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-muted-foreground">Your answer:</p>
                      <p className={`font-medium ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                        {selectedOption?.text || "No answer selected"}
                      </p>
                    </div>
                    {!isCorrect && correctOption && (
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-muted-foreground">Correct answer:</p>
                        <p className="text-green-700 dark:text-green-400 font-medium">{correctOption.text}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
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
      </CardContent>
    </Card>
  );
};
