import { Quiz } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileQuestion } from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quizId: string) => void;
}

export const QuizCard = ({ quiz, onStart }: QuizCardProps) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "No time limit";
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 animate-scale-in border-border/50 hover:border-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          {quiz.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {quiz.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileQuestion className="w-4 h-4" />
          <span>{quiz.questions.length} questions</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(quiz.duration)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onStart(quiz.id)}
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
          size="lg"
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};
