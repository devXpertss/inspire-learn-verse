import { useParams, Link } from "react-router-dom";
import { useFirebaseData } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, FileText } from "lucide-react";
import type { Unit } from "@/lib/types";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { SkeletonList } from "@/components/SkeletonCard";
import { useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { SiteFooter } from "@/components/SiteFooter";

export default function UnitDetailPage() {
  const { subjectId, unitId } = useParams();
  const { data: unit, loading } = useFirebaseData<Unit>(`subjects/${subjectId}/units/${unitId}`);
  const { data: siteContentData } = useSiteContent();
  const content = (siteContentData ?? defaultSiteContent).pages.unitDetail;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SkeletonList count={4} />
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">{content.notFound}</p>
      </div>
    );
  }

  const topics = unit.topics ? Object.entries(unit.topics) : [];

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-20 md:py-28">
        <GridPattern />
        <FloatingShape type="sphere" className="top-20 right-[10%]" delay={0} />
        <FloatingShape type="hexagon" className="bottom-20 left-[8%]" delay={1.5} />

        <div className="container mx-auto px-4 relative z-10">
          <Link to={`/subjects/${subjectId}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {content.backLabel}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold font-heading mb-3">{unit.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{unit.description}</p>
          </motion.div>

          <h2 className="text-2xl font-heading font-semibold mb-8">{content.topicsTitle}</h2>

          {topics.length === 0 ? (
            <p className="text-muted-foreground">{content.empty}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {topics.map(([key, topic], i) => {
                const noteCount = topic.notes ? Object.keys(topic.notes).length : 0;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/subjects/${subjectId}/units/${unitId}/topics/${key}`}
                      className="group block p-6 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-2"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all">
                          <FileText className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">
                            {topic.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">{noteCount} {content.notesSuffix}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{topic.description}</p>
                      <span className="inline-flex items-center text-sm text-primary font-medium">
                        {content.viewNotesLabel} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
