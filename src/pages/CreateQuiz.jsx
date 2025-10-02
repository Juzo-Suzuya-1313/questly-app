import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, Plus, Trash2, Save } from "lucide-react";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    duration: 300,
  });
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: [
        { text: "" },
        { text: "" },
      ],
      correctOptionIndex: 0,
    },
  ]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [{ text: "" }, { text: "" }],
        correctOptionIndex: 0,
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options.push({ text: "" });
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.filter((_, i) => i !== optionIndex);
    if (updated[questionIndex].correctOptionIndex >= updated[questionIndex].options.length) {
      updated[questionIndex].correctOptionIndex = updated[questionIndex].options.length - 1;
    }
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = value;
    setQuestions(updated);
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    updated[questionIndex].correctOptionIndex = optionIndex;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quiz.title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (questions.some(q => !q.text.trim() || q.options.some(o => !o.text.trim()))) {
      toast.error("Please fill in all questions and options");
      return;
    }

    setLoading(true);

    try {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          user_id: user.id,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        
        const { data: questionData, error: questionError } = await supabase
          .from("questions")
          .insert({
            quiz_id: quizData.id,
            text: question.text,
            correct_option_id: `temp_${i}`,
            order_index: i,
          })
          .select()
          .single();

        if (questionError) throw questionError;

        const optionsData = [];
        for (let j = 0; j < question.options.length; j++) {
          const { data: optionData, error: optionError } = await supabase
            .from("options")
            .insert({
              question_id: questionData.id,
              text: question.options[j].text,
              order_index: j,
            })
            .select()
            .single();

          if (optionError) throw optionError;
          optionsData.push(optionData);
        }

        const correctOptionId = optionsData[question.correctOptionIndex].id;
        const { error: updateError } = await supabase
          .from("questions")
          .update({ correct_option_id: correctOptionId })
          .eq("id", questionData.id);

        if (updateError) throw updateError;
      }

      toast.success("Quiz created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")} size="sm">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create New Quiz
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-elegant border-primary/10">
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={quiz.title}
                  onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={quiz.description}
                  onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration (seconds)</label>
                <Input
                  type="number"
                  value={quiz.duration}
                  onChange={(e) => setQuiz({ ...quiz, duration: parseInt(e.target.value) })}
                  min={60}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="shadow-elegant border-primary/10 animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question Text</label>
                  <Input
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                    placeholder="Enter question"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium block">Options</label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctOptionIndex === oIndex}
                        onChange={() => setCorrectOption(qIndex, oIndex)}
                        className="w-4 h-4 text-primary"
                      />
                      <Input
                        value={option.text}
                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        required
                        className="flex-1"
                      />
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(qIndex)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
