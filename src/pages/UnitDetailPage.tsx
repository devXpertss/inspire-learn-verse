import { useParams, Link } from "react-router-dom";
import { useFirebaseData } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import type { Unit } from "@/lib/types";

export default function UnitDetailPage() {
  const { subjectId, unitId } = useParams();
  const { data: unit, loading } = useFirebaseData<Unit>(`subjects/${subjectId}/units/${unitId}`);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">Unit not found.</p>
      </div>
    );
  }

  const topics = unit.topics ? Object.entries(unit.topics) : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to={`/subjects/${subjectId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Units
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl font-bold font-heading mb-2">{unit.name}</h1>
          <p className="text-muted-foreground">{unit.description}</p>
        </motion.div>

        <h2 className="text-xl font-heading font-semibold mb-6">Topics</h2>

        {topics.length === 0 ? (
          <p className="text-muted-foreground">No topics available.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {topics.map(([key, topic], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/subjects/${subjectId}/units/${unitId}/topics/${key}`}
                  className="group block p-5 rounded-xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
                >
                  <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                  <span className="inline-flex items-center text-sm text-primary font-medium">
                    View Notes <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
