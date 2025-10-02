-- Create quizzes table
CREATE TABLE public.quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration integer, -- in seconds
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  correct_option_id text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create options table
CREATE TABLE public.options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_answers table to track quiz attempts
CREATE TABLE public.user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  selected_option_id uuid REFERENCES public.options(id) ON DELETE CASCADE NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE public.quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes (anyone can view, authenticated users can create)
CREATE POLICY "Anyone can view quizzes"
  ON public.quizzes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create quizzes"
  ON public.quizzes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quizzes"
  ON public.quizzes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quizzes"
  ON public.quizzes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for questions (anyone can view, creators can modify)
CREATE POLICY "Anyone can view questions"
  ON public.questions FOR SELECT
  USING (true);

CREATE POLICY "Quiz creators can create questions"
  ON public.questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE id = quiz_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Quiz creators can update questions"
  ON public.questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE id = quiz_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Quiz creators can delete questions"
  ON public.questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes
      WHERE id = quiz_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for options (anyone can view, question creators can modify)
CREATE POLICY "Anyone can view options"
  ON public.options FOR SELECT
  USING (true);

CREATE POLICY "Question creators can create options"
  ON public.options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.quizzes qz ON q.quiz_id = qz.id
      WHERE q.id = question_id AND qz.user_id = auth.uid()
    )
  );

CREATE POLICY "Question creators can update options"
  ON public.options FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.quizzes qz ON q.quiz_id = qz.id
      WHERE q.id = question_id AND qz.user_id = auth.uid()
    )
  );

CREATE POLICY "Question creators can delete options"
  ON public.options FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.questions q
      JOIN public.quizzes qz ON q.quiz_id = qz.id
      WHERE q.id = question_id AND qz.user_id = auth.uid()
    )
  );

-- RLS Policies for user_answers (users can only see/create their own)
CREATE POLICY "Users can view their own answers"
  ON public.user_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own answers"
  ON public.user_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quiz_results (users can only see/create their own)
CREATE POLICY "Users can view their own results"
  ON public.quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own results"
  ON public.quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX idx_options_question_id ON public.options(question_id);
CREATE INDEX idx_user_answers_user_id ON public.user_answers(user_id);
CREATE INDEX idx_user_answers_quiz_id ON public.user_answers(quiz_id);
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON public.quiz_results(quiz_id);