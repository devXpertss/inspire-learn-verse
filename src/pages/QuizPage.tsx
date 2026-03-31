import { useState } from "react";
import { useQuizzes, useSubjects } from "@/hooks/useFirebase";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, Loader2, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quiz, QuizQuestion } from "@/lib/types";

function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quiz.questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= quiz.questions.length) {
      setFinished(true);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl font-bold text-gradient font-heading mb-2">{pct}%</div>
        <p className="text-muted-foreground mb-2">
          You scored {score} out of {quiz.questions.length}
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          {pct >= 80 ? "Excellent work! 🎉" : pct >= 50 ? "Good effort! Keep practicing." : "Keep studying and try again!"}
        </p>
        <Button onClick={handleRestart} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" /> Retry Quiz
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {quiz.questions.length}
        </span>
        <span className="text-sm font-medium text-primary">Score: {score}</span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-muted mb-8">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
        >
          <h3 className="text-xl font-heading font-semibold mb-6">{question.question}</h3>

          <div className="space-y-3 mb-6">
            {question.options.map((opt, idx) => {
              let optClass = "border-border bg-gradient-card hover:border-primary/50";
              if (showResult) {
                if (idx === question.correctAnswer) optClass = "border-primary bg-primary/10";
                else if (idx === selected) optClass = "border-destructive bg-destructive/10";
              } else if (idx === selected) {
                optClass = "border-primary bg-secondary";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${optClass}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                  {showResult && idx === question.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />
                  )}
                  {showResult && idx === selected && idx !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-destructive ml-auto flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {showResult && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-secondary border border-border mb-6"
            >
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Explanation:</span> {question.explanation}
              </p>
            </motion.div>
          )}

          {showResult && (
            <Button onClick={handleNext} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {currentQ + 1 >= quiz.questions.length ? "See Results" : "Next Question"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function QuizPage() {
  const { data: quizzes, loading } = useQuizzes();
  const { data: subjects } = useSubjects();
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const quizList = quizzes ? Object.entries(quizzes).map(([key, q]) => ({ ...q, id: key })) : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold font-heading mb-2">
            <span className="text-gradient">Quizzes</span>
          </h1>
          <p className="text-muted-foreground">Test your knowledge with interactive quizzes</p>
        </motion.div>

        {activeQuiz ? (
          <div>
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block"
            >
              ← Back to quizzes
            </button>
            <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
              <h2 className="text-2xl font-heading font-bold mb-6">{activeQuiz.title}</h2>
              <QuizRunner quiz={activeQuiz} />
            </div>
          </div>
        ) : quizList.length === 0 ? (
          <div className="text-center py-20">
            <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-heading font-semibold mb-2">No Quizzes Yet</h3>
            <p className="text-muted-foreground text-sm">Upload quiz data to Firebase to see quizzes here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quizList.map((quiz, i) => (
              <motion.button
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setActiveQuiz(quiz)}
                className="w-full text-left group p-5 rounded-xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
              >
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {quiz.questions?.length || 0} questions
                  {quiz.subjectId && subjects?.[quiz.subjectId] && ` • ${subjects[quiz.subjectId].name}`}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
