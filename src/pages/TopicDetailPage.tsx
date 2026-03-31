import { useParams, Link } from "react-router-dom";
import { useFirebaseData } from "@/hooks/useFirebase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, FileText, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Topic, Note } from "@/lib/types";

function SlideViewer({ slides }: { slides: { title: string; content: string }[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-card border border-border p-8 min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-4 text-gradient">{slides[current].title}</h3>
            <p className="text-foreground whitespace-pre-wrap">{slides[current].content}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {current + 1} / {slides.length}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={current === slides.length - 1}
          onClick={() => setCurrent(current + 1)}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function NoteViewer({ note }: { note: Note }) {
  if (note.type === "ppt" && note.slides && note.slides.length > 0) {
    return <SlideViewer slides={note.slides} />;
  }

  return (
    <div className="prose prose-sm max-w-none text-foreground">
      <div className="whitespace-pre-wrap">{note.content}</div>
    </div>
  );
}

export default function TopicDetailPage() {
  const { subjectId, unitId, topicId } = useParams();
  const { data: topic, loading } = useFirebaseData<Topic>(
    `subjects/${subjectId}/units/${unitId}/topics/${topicId}`
  );
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Topic not found.</p>
      </div>
    );
  }

  const notes = topic.notes ? Object.entries(topic.notes) : [];
  const activeNote = selectedNote ? topic.notes?.[selectedNote] : null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link
          to={`/subjects/${subjectId}/units/${unitId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Topics
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">{topic.name}</h1>
          <p className="text-muted-foreground">{topic.description}</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Notes sidebar */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes available.</p>
            ) : (
              notes.map(([key, note]) => (
                <button
                  key={key}
                  onClick={() => setSelectedNote(key)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${
                    selectedNote === key
                      ? "border-primary bg-secondary shadow-card"
                      : "border-border hover:border-primary/50 bg-gradient-card"
                  }`}
                >
                  {note.type === "ppt" ? (
                    <Presentation className="w-4 h-4 text-primary flex-shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate">{note.title}</span>
                </button>
              ))
            )}
          </div>

          {/* Note content */}
          <div className="min-h-[400px]">
            {activeNote ? (
              <motion.div
                key={selectedNote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-gradient-card p-6"
              >
                <h2 className="text-xl font-heading font-semibold mb-4">{activeNote.title}</h2>
                <NoteViewer note={activeNote} />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a note to view its content</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
