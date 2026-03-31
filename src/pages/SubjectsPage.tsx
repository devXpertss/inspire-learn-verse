import { useSubjects } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";

export default function SubjectsPage() {
  const { data: subjects, loading, error } = useSubjects();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load subjects. Make sure Firebase data is uploaded.</p>
      </div>
    );
  }

  const subjectList = subjects ? Object.entries(subjects) : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold font-heading mb-2">
            <span className="text-gradient">Subjects</span>
          </h1>
          <p className="text-muted-foreground">Choose a subject to start learning</p>
        </motion.div>

        {subjectList.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-heading font-semibold mb-2">No Subjects Yet</h3>
            <p className="text-muted-foreground text-sm">
              Upload the JSON data to your Firebase Realtime Database to see subjects here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectList.map(([key, subject], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/subjects/${key}`}
                  className="group block p-6 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-4xl mb-4">{subject.icon || "📚"}</div>
                  <h3 className="text-lg font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{subject.description}</p>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Explore
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
