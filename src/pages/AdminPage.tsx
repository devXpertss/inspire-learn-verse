import { useState, useEffect } from "react";
import { db, ref, set, remove, onValue, push } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Trash2, Save, Loader2, ChevronDown, ChevronRight, Settings, BookOpen, Brain,
} from "lucide-react";
import type { Subject, Unit, Topic, Note, Quiz, QuizQuestion } from "@/lib/types";

type Section = "subjects" | "quizzes";

function AdminSubjects() {
  const [subjects, setSubjects] = useState<Record<string, Subject>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

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
    await set(newRef, {
      name: "New Subject",
      description: "Description",
      icon: "📚",
      color: "#7C3AED",
      units: {},
    });
  };

  const updateSubject = async (key: string, field: string, value: string) => {
    await set(ref(db, `subjects/${key}/${field}`), value);
  };

  const deleteSubject = async (key: string) => {
    if (confirm("Delete this subject?")) await remove(ref(db, `subjects/${key}`));
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

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold">Subjects</h2>
        <Button size="sm" onClick={addSubject} className="bg-gradient-primary text-primary-foreground">
          <Plus className="w-4 h-4 mr-1" /> Add Subject
        </Button>
      </div>

      {Object.entries(subjects).map(([sKey, subject]) => (
        <div key={sKey} className="border border-border rounded-xl overflow-hidden">
          <div
            className="flex items-center gap-3 p-4 bg-muted/50 cursor-pointer"
            onClick={() => toggle(sKey)}
          >
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
                <Input defaultValue={subject.description} onBlur={(e) => updateSubject(sKey, "description", e.target.value)} />
              </div>

              {/* Units */}
              <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Units</span>
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
                        <Input defaultValue={unit.description} placeholder="Description" onBlur={(e) => updateUnit(sKey, uKey, "description", e.target.value)} />

                        {/* Topics */}
                        <div className="pl-4 border-l-2 border-accent/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">Topics</span>
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
                                  <Input defaultValue={topic.description} placeholder="Description" onBlur={(e) => updateTopic(sKey, uKey, tKey, "description", e.target.value)} />

                                  {/* Notes */}
                                  <div className="pl-3 border-l-2 border-primary/10 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold">Notes</span>
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
                                            className="text-xs rounded-md border border-border bg-background px-2 py-1.5"
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
        <h2 className="text-lg font-heading font-semibold">Quizzes</h2>
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
              <Input defaultValue={quiz.title} placeholder="Quiz title" onBlur={(e) => updateQuiz(qKey, "title", e.target.value)} />

              <div className="space-y-3">
                {(quiz.questions || []).map((q, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">Q{idx + 1}</span>
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
                    <Input
                      defaultValue={q.explanation}
                      placeholder="Explanation (optional)"
                      className="text-xs"
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
  const [section, setSection] = useState<Section>("subjects");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold font-heading mb-2">
            <span className="text-gradient">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground">Manage your content — changes sync to Firebase in real-time</p>
        </motion.div>

        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSection("subjects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              section === "subjects" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Subjects
          </button>
          <button
            onClick={() => setSection("quizzes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
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
