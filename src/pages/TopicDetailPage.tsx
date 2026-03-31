import { useParams, Link } from "react-router-dom";
import { useFirebaseData } from "@/hooks/useFirebase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Presentation, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Topic, Note } from "@/lib/types";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { Skeleton } from "@/components/ui/skeleton";

function SlideViewer({ slides }: { slides: { title: string; content: string; image?: string }[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-gradient-card border border-border min-h-[350px] flex flex-col">
        {/* Slide image */}
        {slides[current].image && (
          <div className="w-full h-48 overflow-hidden rounded-t-xl">
            <img
              src={slides[current].image}
              alt={slides[current].title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div className="p-8 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-heading font-bold mb-4 text-gradient">{slides[current].title}</h3>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{slides[current].content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? "bg-primary scale-125" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
        <Button variant="outline" size="sm" disabled={current === slides.length - 1} onClick={() => setCurrent(current + 1)}>
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
      <div className="whitespace-pre-wrap leading-relaxed">{note.content}</div>
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
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72 mb-8" />
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
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
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-16 md:py-20">
        <GridPattern />
        <FloatingShape type="cube" className="top-10 right-[5%]" delay={0} />
        <FloatingShape type="sphere" className="bottom-20 left-[8%]" delay={1.5} />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            to={`/subjects/${subjectId}/units/${unitId}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Topics
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-heading">{topic.name}</h1>
                <p className="text-muted-foreground">{topic.description}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[300px_1fr] gap-8">
            {/* Notes sidebar */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Notes ({notes.length})
              </h3>
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes available.</p>
              ) : (
                notes.map(([key, note]) => (
                  <motion.button
                    key={key}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedNote(key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      selectedNote === key
                        ? "border-primary bg-secondary shadow-card"
                        : "border-border hover:border-primary/50 bg-gradient-card"
                    }`}
                  >
                    {note.type === "ppt" ? (
                      <Presentation className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block">{note.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">{note.type}</span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Note content */}
            <div className="min-h-[500px]">
              {activeNote ? (
                <motion.div
                  key={selectedNote}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-gradient-card p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    {activeNote.type === "ppt" ? (
                      <Presentation className="w-5 h-5 text-primary" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary" />
                    )}
                    <h2 className="text-2xl font-heading font-semibold">{activeNote.title}</h2>
                  </div>
                  <NoteViewer note={activeNote} />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground rounded-2xl border-2 border-dashed border-border p-12">
                  <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-heading">Select a note to view</p>
                  <p className="text-sm mt-1">Choose from the sidebar to start reading</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 CodeSpire. Built with passion for learning.</p>
        </div>
      </footer>
    </div>
  );
}
