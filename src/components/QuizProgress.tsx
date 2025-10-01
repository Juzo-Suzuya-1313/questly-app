import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
}

export const QuizProgress = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
}: QuizProgressProps) => {
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground font-medium">
          Progress: {currentQuestion}/{totalQuestions}
        </span>
        {timeRemaining !== undefined && (
          <span className={`font-semibold ${timeRemaining < 60 ? 'text-destructive' : 'text-muted-foreground'}`}>
            Time: {formatTime(timeRemaining)}
          </span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
