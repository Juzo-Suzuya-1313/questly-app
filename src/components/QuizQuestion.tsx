import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  showCorrectAnswer?: boolean;
}

export const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelectOption,
  showCorrectAnswer = false,
}: QuizQuestionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground font-medium">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {question.text}
        </h2>
      </div>

      <div className="grid gap-3 md:gap-4">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = showCorrectAnswer && option.id === question.correctOptionId;
          const isWrong = showCorrectAnswer && isSelected && option.id !== question.correctOptionId;

          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-[1.02]",
                isSelected && !showCorrectAnswer && "ring-2 ring-primary shadow-glow",
                isCorrect && "ring-2 ring-accent bg-accent/10",
                isWrong && "ring-2 ring-destructive bg-destructive/10",
                !isSelected && !showCorrectAnswer && "hover:border-primary/50"
              )}
              onClick={() => !showCorrectAnswer && onSelectOption(option.id)}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors",
                      isSelected && !showCorrectAnswer && "bg-primary text-primary-foreground",
                      isCorrect && "bg-accent text-accent-foreground",
                      isWrong && "bg-destructive text-destructive-foreground",
                      !isSelected && !showCorrectAnswer && "bg-muted text-muted-foreground"
                    )}
                  >
                    {String.fromCharCode(65 + question.options.indexOf(option))}
                  </div>
                  <p className="text-base md:text-lg font-medium text-foreground">
                    {option.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
