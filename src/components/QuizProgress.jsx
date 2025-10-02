import React from "react";
import { Progress } from "@/components/ui/progress";

export const QuizProgress = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
}) => {
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const formatTime = (seconds) => {
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
