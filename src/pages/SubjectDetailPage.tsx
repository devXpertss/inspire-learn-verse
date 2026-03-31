import { useParams, Link } from "react-router-dom";
import { useFirebaseData } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import type { Subject } from "@/lib/types";

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const { data: subject, loading } = useFirebaseData<Subject>(`subjects/${subjectId}`);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Subject not found.</p>
      </div>
    );
  }

  const units = subject.units ? Object.entries(subject.units) : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Subjects
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="text-4xl mb-3">{subject.icon || "📚"}</div>
          <h1 className="text-4xl font-bold font-heading mb-2">{subject.name}</h1>
          <p className="text-muted-foreground">{subject.description}</p>
        </motion.div>

        <h2 className="text-xl font-heading font-semibold mb-6">Units</h2>

        {units.length === 0 ? (
          <p className="text-muted-foreground">No units available.</p>
        ) : (
          <div className="space-y-4">
            {units.map(([key, unit], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/subjects/${subjectId}/units/${key}`}
                  className="group flex items-center justify-between p-5 rounded-xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
                >
                  <div>
                    <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                      {unit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
