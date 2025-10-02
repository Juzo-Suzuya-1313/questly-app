import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileQuestion } from "lucide-react";

export const QuizCard = ({ quiz, onStart }) => {
  const formatDuration = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes} min` : `${seconds} sec`;
  };

  return (
    <Card className="hover-scale cursor-pointer group border-primary/20 hover:border-primary/40 transition-all shadow-elegant hover:shadow-glow animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
          {quiz.title}
        </CardTitle>
        <CardDescription className="text-base line-clamp-2">
          {quiz.description || "Test your knowledge with this quiz"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4" />
            <span>{quiz.questions?.length || 0} Questions</span>
          </div>
          {quiz.duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(quiz.duration)}</span>
            </div>
          )}
        </div>
        <Button 
          onClick={() => onStart(quiz.id)}
          className="w-full bg-gradient-primary hover:opacity-90 group-hover:scale-105 transition-transform shadow-md"
          size="lg"
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
};
