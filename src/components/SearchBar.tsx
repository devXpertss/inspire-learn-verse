import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, FileText, Brain, ArrowRight, Presentation, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSubjects, useQuizzes, usePresentations, useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";

interface SearchResult {
  type: "subject" | "unit" | "topic" | "note" | "quiz" | "presentation" | "page" | "contact";
  title: string;
  description: string;
  path: string;
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: subjects } = useSubjects();
  const { data: quizzes } = useQuizzes();
  const { data: presentations } = usePresentations();
  const { data: siteContentData } = useSiteContent();
  const siteContent = siteContentData ?? defaultSiteContent;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const res: SearchResult[] = [];

    if (subjects) {
      Object.entries(subjects).forEach(([sKey, subject]) => {
        if (subject.name.toLowerCase().includes(q) || subject.description.toLowerCase().includes(q)) {
          res.push({ type: "subject", title: subject.name, description: subject.description, path: `/subjects/${sKey}` });
        }
        if (subject.units) {
          Object.entries(subject.units).forEach(([uKey, unit]) => {
            if (unit.name.toLowerCase().includes(q) || unit.description?.toLowerCase().includes(q)) {
              res.push({ type: "unit", title: unit.name, description: `${subject.name} › ${unit.name}`, path: `/subjects/${sKey}/units/${uKey}` });
            }
            if (unit.topics) {
              Object.entries(unit.topics).forEach(([tKey, topic]) => {
                if (topic.name.toLowerCase().includes(q) || topic.description?.toLowerCase().includes(q)) {
                  res.push({ type: "topic", title: topic.name, description: `${subject.name} › ${unit.name} › ${topic.name}`, path: `/subjects/${sKey}/units/${uKey}/topics/${tKey}` });
                }
                if (topic.notes) {
                  Object.entries(topic.notes).forEach(([, note]) => {
                    if (note.title.toLowerCase().includes(q) || note.content?.toLowerCase().includes(q)) {
                      res.push({ type: "note", title: note.title, description: `Note in ${topic.name}`, path: `/subjects/${sKey}/units/${uKey}/topics/${tKey}` });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    if (quizzes) {
      Object.entries(quizzes).forEach(([, quiz]) => {
        if (quiz.title.toLowerCase().includes(q)) {
          res.push({ type: "quiz", title: quiz.title, description: `${quiz.questions?.length || 0} questions`, path: "/quiz" });
        }
      });
    }

    if (presentations) {
      Object.entries(presentations).forEach(([key, presentation]) => {
        if (
          presentation.title.toLowerCase().includes(q)
          || presentation.description?.toLowerCase().includes(q)
          || presentation.category?.toLowerCase().includes(q)
        ) {
          res.push({
            type: "presentation",
            title: presentation.title,
            description: presentation.description || presentation.category || "Presentation",
            path: `/presentations#${key}`,
          });
        }
      });
    }

    siteContent.navigation.items.forEach((item) => {
      if (item.label.toLowerCase().includes(q)) {
        res.push({ type: "page", title: item.label, description: "Website page", path: item.path });
      }
    });

    (siteContent.contact.infoCards || []).forEach((card: { label: string; value: string }) => {
      if (card.label.toLowerCase().includes(q) || card.value.toLowerCase().includes(q)) {
        res.push({ type: "contact", title: card.label, description: card.value, path: "/contact" });
      }
    });

    setResults(res.slice(0, 8));
  }, [query, subjects, quizzes, presentations, siteContent]);

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery("");
  };

  const iconMap = {
    subject: BookOpen,
    unit: BookOpen,
    topic: FileText,
    note: FileText,
    quiz: Brain,
    presentation: Presentation,
    page: BookOpen,
    contact: Mail,
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm hover:border-primary/50 transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{siteContent.search.buttonLabel}</span>
        <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
            >
              <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={siteContent.navigation.searchPlaceholder}
                    className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
                  />
                  {query && (
                    <button onClick={() => setQuery("")}>
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="max-h-80 overflow-y-auto py-2">
                    {results.map((r, i) => {
                      const Icon = iconMap[r.type];
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(r.path)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{r.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{r.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {query && results.length === 0 && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {siteContent.search.noResultsPrefix} "{query}"
                  </div>
                )}

                {!query && (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    {siteContent.search.emptyQuery}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
