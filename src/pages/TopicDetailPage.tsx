import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useFirebaseData } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, BookOpen, Download, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Topic, Note } from "@/lib/types";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { Skeleton } from "@/components/ui/skeleton";
import { useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { SiteFooter } from "@/components/SiteFooter";

function downloadNoteAsTxt(note: Note) {
  const blob = new Blob([note.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${note.title || "note"}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function TopicDetailPage() {
  const { subjectId, unitId, topicId } = useParams();
  const { data: topic, loading } = useFirebaseData<Topic>(
    `subjects/${subjectId}/units/${unitId}/topics/${topicId}`
  );
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const { data: siteContentData } = useSiteContent();
  const content = (siteContentData ?? defaultSiteContent).pages.topicDetail;

  const notes = useMemo(
    () => (topic?.notes ? Object.entries(topic.notes).filter(([, note]) => note.type !== "ppt") : []),
    [topic?.notes]
  );
  const activeNote = selectedNote ? topic?.notes?.[selectedNote] : null;
  const presentationCount = topic?.notes ? Object.values(topic.notes).filter((note) => note.type === "ppt").length : 0;

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
        <p className="text-muted-foreground">{content.notFound}</p>
      </div>
    );
  }

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
            <ArrowLeft className="w-4 h-4" /> {content.backLabel}
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
                {content.notesTitle} ({notes.length})
              </h3>
              {presentationCount > 0 && (
                <Link
                  to="/presentations"
                  className="flex items-center gap-2 p-4 mb-3 rounded-xl border border-border bg-secondary text-secondary-foreground"
                >
                  <Presentation className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{content.presentationsNotice.replace("{count}", String(presentationCount))}</span>
                </Link>
              )}
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">{content.noNotes}</p>
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
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block">{note.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">text</span>
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
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-heading font-semibold">{activeNote.title}</h2>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => downloadNoteAsTxt(activeNote)}>
                      <Download className="w-4 h-4 mr-2" /> {content.downloadLabel}
                    </Button>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <div className="whitespace-pre-wrap leading-relaxed">{activeNote.content}</div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground rounded-2xl border-2 border-dashed border-border p-12">
                  <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-heading">{content.selectTitle}</p>
                  <p className="text-sm mt-1">{content.selectDescription}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
