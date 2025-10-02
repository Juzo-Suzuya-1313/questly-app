import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select(`
          *,
          questions:questions(
            *,
            options:options(*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(quiz => ({
        ...quiz,
        questions: quiz.questions.map(q => ({
          ...q,
          options: q.options.sort((a, b) => a.order_index - b.order_index)
        })).sort((a, b) => a.order_index - b.order_index)
      }));
    },
  });
};
