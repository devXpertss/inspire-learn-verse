import { useState, useEffect } from "react";
import { db, ref, set, remove, onValue, push } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Trash2, Loader2, ChevronDown, ChevronRight, BookOpen, Brain, Lock, LogOut, Eye, EyeOff,
} from "lucide-react";
import type { Subject, Unit, Topic, Note, Quiz, QuizQuestion } from "@/lib/types";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";

type Section = "subjects" | "quizzes";

// Hardcoded admin credentials (in production, use proper auth)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "codespire2026";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <GridPattern />
      <FloatingShape type="hexagon" className="top-20 right-[10%]" delay={0} />
      <FloatingShape type="sphere" className="bottom-20 left-[10%]" delay={2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2">
              <span className="text-gradient">Admin Access</span>
            </h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to manage content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username</label>
              <Input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
              <Lock className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function AdminSubjects() {
  const [subjects, setSubjects] = useState<Record<string, Subject>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = onValue(ref(db, "subjects"), (snap) => {
      setSubjects(snap.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggle = (key: string) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const addSubject = async () => {
    const newRef = push(ref(db, "subjects"));
    await set(newRef, { name: "New Subject", description: "Description", icon: "📚", color: "#7C3AED", units: {} });
  };

  const updateSubject = async (key: string, field: string, value: string) => {
    await set(ref(db, `subjects/${key}/${field}`), value);
  };

  const deleteSubject = async (key: string) => {
    if (confirm("Delete this subject and all its content?")) await remove(ref(db, `subjects/${key}`));
  };

  const addUnit = async (subjectKey: string) => {
    const newRef = push(ref(db, `subjects/${subjectKey}/units`));
    await set(newRef, { name: "New Unit", description: "", topics: {} });
  };

  const updateUnit = async (sKey: string, uKey: string, field: string, value: string) => {
    await set(ref(db, `subjects/${sKey}/units/${uKey}/${field}`), value);
  };

  const deleteUnit = async (sKey: string, uKey: string) => {
    if (confirm("Delete this unit?")) await remove(ref(db, `subjects/${sKey}/units/${uKey}`));
  };

  const addTopic = async (sKey: string, uKey: string) => {
    const newRef = push(ref(db, `subjects/${sKey}/units/${uKey}/topics`));
    await set(newRef, { name: "New Topic", description: "", notes: {} });
  };

  const updateTopic = async (sKey: string, uKey: string, tKey: string, field: string, value: string) => {
    await set(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/${field}`), value);
  };

  const deleteTopic = async (sKey: string, uKey: string, tKey: string) => {
    if (confirm("Delete?")) await remove(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}`));
  };

  const addNote = async (sKey: string, uKey: string, tKey: string) => {
    const newRef = push(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/notes`));
    await set(newRef, { title: "New Note", content: "", type: "text" });
  };

  const updateNote = async (sKey: string, uKey: string, tKey: string, nKey: string, field: string, value: any) => {
    await set(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/notes/${nKey}/${field}`), value);
  };

  const deleteNote = async (sKey: string, uKey: string, tKey: string, nKey: string) => {
    if (confirm("Delete?")) await remove(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/notes/${nKey}`));
  };

  // Slide management
  const addSlide = async (sKey: string, uKey: string, tKey: string, nKey: string) => {
    const note = subjects[sKey]?.units?.[uKey]?.topics?.[tKey]?.notes?.[nKey];
    const slides = note?.slides || [];
    await set(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/notes/${nKey}/slides`), [
      ...slides,
      { title: "New Slide", content: "Slide content here" },
    ]);
  };

  const updateSlide = async (sKey: string, uKey: string, tKey: string, nKey: string, idx: number, field: string, value: string) => {
    await set(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/notes/${nKey}/slides/${idx}/${field}`), value);
  };

  const deleteSlide = async (sKey: string, uKey: string, tKey: string, nKey: string, idx: number) => {
    const note = subjects[sKey]?.units?.[uKey]?.topics?.[tKey]?.notes?.[nKey];
    const slides = [...(note?.slides || [])];
    slides.splice(idx, 1);
    await set(ref(db, `subjects/${sKey}/units/${uKey}/topics/${tKey}/notes/${nKey}/slides`), slides);
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold">Subjects ({Object.keys(subjects).length})</h2>
        <Button size="sm" onClick={addSubject} className="bg-gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Subject
        </Button>
      </div>

      {Object.entries(subjects).map(([sKey, subject]) => (
        <div key={sKey} className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 bg-muted/50 cursor-pointer" onClick={() => toggle(sKey)}>
            {expanded[sKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="text-xl">{subject.icon}</span>
            <span className="font-semibold flex-1">{subject.name}</span>
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteSubject(sKey); }}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          {expanded[sKey] && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <Input defaultValue={subject.name} onBlur={(e) => updateSubject(sKey, "name", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Icon (emoji)</label>
                  <Input defaultValue={subject.icon} onBlur={(e) => updateSubject(sKey, "icon", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Description</label>
                <Textarea defaultValue={subject.description} rows={2} onBlur={(e) => updateSubject(sKey, "description", e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Color</label>
                <Input defaultValue={subject.color} onBlur={(e) => updateSubject(sKey, "color", e.target.value)} />
              </div>

              {/* Units */}
              <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Units ({subject.units ? Object.keys(subject.units).length : 0})</span>
                  <Button size="sm" variant="outline" onClick={() => addUnit(sKey)}>
                    <Plus className="w-3 h-3 mr-1" /> Unit
                  </Button>
                </div>

                {subject.units && Object.entries(subject.units).map(([uKey, unit]) => (
                  <div key={uKey} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-muted/30 cursor-pointer" onClick={() => toggle(`${sKey}-${uKey}`)}>
                      {expanded[`${sKey}-${uKey}`] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      <span className="text-sm font-medium flex-1">{unit.name}</span>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteUnit(sKey, uKey); }}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>

                    {expanded[`${sKey}-${uKey}`] && (
                      <div className="p-3 space-y-3">
                        <Input defaultValue={unit.name} placeholder="Unit name" onBlur={(e) => updateUnit(sKey, uKey, "name", e.target.value)} />
                        <Textarea defaultValue={unit.description} placeholder="Description" rows={2} onBlur={(e) => updateUnit(sKey, uKey, "description", e.target.value)} />

                        {/* Topics */}
                        <div className="pl-4 border-l-2 border-accent/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">Topics ({unit.topics ? Object.keys(unit.topics).length : 0})</span>
                            <Button size="sm" variant="outline" onClick={() => addTopic(sKey, uKey)}>
                              <Plus className="w-3 h-3 mr-1" /> Topic
                            </Button>
                          </div>

                          {unit.topics && Object.entries(unit.topics).map(([tKey, topic]) => (
                            <div key={tKey} className="border border-border rounded-lg overflow-hidden">
                              <div className="flex items-center gap-2 p-2 bg-muted/20 cursor-pointer" onClick={() => toggle(`${sKey}-${uKey}-${tKey}`)}>
                                {expanded[`${sKey}-${uKey}-${tKey}`] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                <span className="text-xs font-medium flex-1">{topic.name}</span>
                                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteTopic(sKey, uKey, tKey); }}>
                                  <Trash2 className="w-3 h-3 text-destructive" />
                                </Button>
                              </div>

                              {expanded[`${sKey}-${uKey}-${tKey}`] && (
                                <div className="p-2 space-y-2">
                                  <Input defaultValue={topic.name} placeholder="Topic name" onBlur={(e) => updateTopic(sKey, uKey, tKey, "name", e.target.value)} />
                                  <Textarea defaultValue={topic.description} placeholder="Description" rows={2} onBlur={(e) => updateTopic(sKey, uKey, tKey, "description", e.target.value)} />

                                  {/* Notes */}
                                  <div className="pl-3 border-l-2 border-primary/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold">Notes ({topic.notes ? Object.keys(topic.notes).length : 0})</span>
                                      <Button size="sm" variant="outline" onClick={() => addNote(sKey, uKey, tKey)}>
                                        <Plus className="w-3 h-3 mr-1" /> Note
                                      </Button>
                                    </div>

                                    {topic.notes && Object.entries(topic.notes).map(([nKey, note]) => (
                                      <div key={nKey} className="border border-border rounded-lg p-2 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Input defaultValue={note.title} placeholder="Note title" className="text-xs" onBlur={(e) => updateNote(sKey, uKey, tKey, nKey, "title", e.target.value)} />
                                          <select
                                            defaultValue={note.type}
                                            onChange={(e) => updateNote(sKey, uKey, tKey, nKey, "type", e.target.value)}
                                            className="text-xs rounded-md border border-input bg-background px-2 py-1.5"
                                          >
                                            <option value="text">Text</option>
                                            <option value="ppt">PPT</option>
                                          </select>
                                          <Button size="sm" variant="ghost" onClick={() => deleteNote(sKey, uKey, tKey, nKey)}>
                                            <Trash2 className="w-3 h-3 text-destructive" />
                                          </Button>
                                        </div>
                                        <Textarea
                                          defaultValue={note.content}
                                          placeholder="Content"
                                          rows={3}
                                          className="text-xs"
                                          onBlur={(e) => updateNote(sKey, uKey, tKey, nKey, "content", e.target.value)}
                                        />

                                        {/* Slides management for PPT notes */}
                                        {note.type === "ppt" && (
                                          <div className="pl-2 border-l-2 border-accent/20 space-y-2 mt-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-semibold text-muted-foreground">Slides ({note.slides?.length || 0})</span>
                                              <Button size="sm" variant="outline" onClick={() => addSlide(sKey, uKey, tKey, nKey)}>
                                                <Plus className="w-3 h-3 mr-1" /> Slide
                                              </Button>
                                            </div>
                                            {note.slides?.map((slide, idx) => (
                                              <div key={idx} className="border border-border rounded p-2 space-y-1">
                                                <div className="flex items-center gap-1">
                                                  <span className="text-xs text-muted-foreground">S{idx + 1}</span>
                                                  <Input defaultValue={slide.title} placeholder="Slide title" className="text-xs" onBlur={(e) => updateSlide(sKey, uKey, tKey, nKey, idx, "title", e.target.value)} />
                                                  <Button size="sm" variant="ghost" onClick={() => deleteSlide(sKey, uKey, tKey, nKey, idx)}>
                                                    <Trash2 className="w-3 h-3 text-destructive" />
                                                  </Button>
                                                </div>
                                                <Textarea defaultValue={slide.content} placeholder="Slide content" rows={2} className="text-xs" onBlur={(e) => updateSlide(sKey, uKey, tKey, nKey, idx, "content", e.target.value)} />
                                                <Input defaultValue={slide.image || ""} placeholder="Image URL (optional)" className="text-xs" onBlur={(e) => updateSlide(sKey, uKey, tKey, nKey, idx, "image", e.target.value)} />
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = onValue(ref(db, "quizzes"), (snap) => {
      setQuizzes(snap.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggle = (key: string) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  const addQuiz = async () => {
    const newRef = push(ref(db, "quizzes"));
    await set(newRef, { title: "New Quiz", subjectId: "", questions: [] });
  };

  const deleteQuiz = async (key: string) => {
    if (confirm("Delete quiz?")) await remove(ref(db, `quizzes/${key}`));
  };

  const updateQuiz = async (key: string, field: string, value: any) => {
    await set(ref(db, `quizzes/${key}/${field}`), value);
  };

  const addQuestion = async (qKey: string) => {
    const quiz = quizzes[qKey];
    const questions = quiz.questions || [];
    const newQ: QuizQuestion = {
      id: `q${questions.length}`,
      question: "New question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "",
    };
    await set(ref(db, `quizzes/${qKey}/questions`), [...questions, newQ]);
  };

  const updateQuestion = async (qKey: string, idx: number, field: string, value: any) => {
    await set(ref(db, `quizzes/${qKey}/questions/${idx}/${field}`), value);
  };

  const deleteQuestion = async (qKey: string, idx: number) => {
    const questions = [...(quizzes[qKey].questions || [])];
    questions.splice(idx, 1);
    await set(ref(db, `quizzes/${qKey}/questions`), questions);
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold">Quizzes ({Object.keys(quizzes).length})</h2>
        <Button size="sm" onClick={addQuiz} className="bg-gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Quiz
        </Button>
      </div>

      {Object.entries(quizzes).map(([qKey, quiz]) => (
        <div key={qKey} className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 bg-muted/50 cursor-pointer" onClick={() => toggle(qKey)}>
            {expanded[qKey] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <span className="font-semibold flex-1">{quiz.title}</span>
            <span className="text-xs text-muted-foreground">{quiz.questions?.length || 0} Q</span>
            <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteQuiz(qKey); }}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>

          {expanded[qKey] && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Quiz Title</label>
                  <Input defaultValue={quiz.title} onBlur={(e) => updateQuiz(qKey, "title", e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Subject ID</label>
                  <Input defaultValue={quiz.subjectId || ""} onBlur={(e) => updateQuiz(qKey, "subjectId", e.target.value)} />
                </div>
              </div>

              <div className="space-y-3">
                {(quiz.questions || []).map((q, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Q{idx + 1}</span>
                      <Input defaultValue={q.question} className="text-sm flex-1" onBlur={(e) => updateQuestion(qKey, idx, "question", e.target.value)} />
                      <Button size="sm" variant="ghost" onClick={() => deleteQuestion(qKey, idx)}>
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </Button>
                    </div>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2 pl-6">
                        <input
                          type="radio"
                          name={`correct-${qKey}-${idx}`}
                          checked={q.correctAnswer === oIdx}
                          onChange={() => updateQuestion(qKey, idx, "correctAnswer", oIdx)}
                          className="accent-primary"
                        />
                        <Input
                          defaultValue={opt}
                          className="text-xs"
                          onBlur={(e) => {
                            const newOpts = [...q.options];
                            newOpts[oIdx] = e.target.value;
                            updateQuestion(qKey, idx, "options", newOpts);
                          }}
                        />
                      </div>
                    ))}
                    <Textarea
                      defaultValue={q.explanation}
                      placeholder="Explanation (optional)"
                      className="text-xs"
                      rows={2}
                      onBlur={(e) => updateQuestion(qKey, idx, "explanation", e.target.value)}
                    />
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => addQuestion(qKey)}>
                  <Plus className="w-3 h-3 mr-1" /> Add Question
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem("admin_auth") === "true"
  );
  const [section, setSection] = useState<Section>("subjects");

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">
                <span className="text-gradient">Admin Panel</span>
              </h1>
              <p className="text-muted-foreground">Manage your content — changes sync to Firebase in real-time</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSection("subjects")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              section === "subjects" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Subjects
          </button>
          <button
            onClick={() => setSection("quizzes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              section === "quizzes" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <Brain className="w-4 h-4" /> Quizzes
          </button>
        </div>

        {section === "subjects" ? <AdminSubjects /> : <AdminQuizzes />}
      </div>
    </div>
  );
}
