import { useSubjects } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Layers, GraduationCap } from "lucide-react";
import { FloatingShape, GridPattern, FloatingParticles } from "@/components/FloatingElements";
import { SkeletonList } from "@/components/SkeletonCard";

export default function SubjectsPage() {
  const { data: subjects, loading, error } = useSubjects();

  const subjectList = subjects ? Object.entries(subjects) : [];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <GridPattern />
        <FloatingParticles />
        <FloatingShape type="hexagon" className="top-20 right-[8%]" delay={0} />
        <FloatingShape type="sphere" className="bottom-10 left-[5%]" delay={2} />
        <FloatingShape type="ring" className="top-40 left-[20%]" delay={1} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6"
            >
              <GraduationCap className="w-4 h-4" />
              Browse All Courses
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-4">
              <span className="text-gradient">Subjects</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Choose a subject to dive deep into structured learning with notes, presentations, and quizzes
            </p>
          </motion.div>

          {loading ? (
            <SkeletonList count={6} />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Failed to load subjects. Make sure Firebase data is uploaded.</p>
            </div>
          ) : subjectList.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-heading font-semibold mb-2">No Subjects Yet</h3>
              <p className="text-muted-foreground text-sm">
                Upload the JSON data to your Firebase Realtime Database to see subjects here.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectList.map(([key, subject], i) => {
                const unitCount = subject.units ? Object.keys(subject.units).length : 0;
                let topicCount = 0;
                if (subject.units) {
                  Object.values(subject.units).forEach((u) => {
                    if (u.topics) topicCount += Object.keys(u.topics).length;
                  });
                }
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/subjects/${key}`}
                      className="group block p-7 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="text-5xl mb-5">{subject.icon || "📚"}</div>
                      <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-5 line-clamp-2">{subject.description}</p>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Layers className="w-3 h-3" /> {unitCount} units
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="w-3 h-3" /> {topicCount} topics
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-primary font-medium">
                        Explore Subject
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 CodeSpire. Built with passion for learning.</p>
        </div>
      </footer>
    </div>
  );
}
