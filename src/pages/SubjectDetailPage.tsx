import { useParams, Link } from "react-router-dom";
import { useFirebaseData, useSiteContent } from "@/hooks/useFirebase";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, Layers } from "lucide-react";
import type { Subject } from "@/lib/types";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { SkeletonList } from "@/components/SkeletonCard";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { ContentBlockImage } from "@/components/ContentBlockImage";
import { SiteFooter } from "@/components/SiteFooter";

export default function SubjectDetailPage() {
  const { subjectId } = useParams();
  const { data: subject, loading } = useFirebaseData<Subject>(`subjects/${subjectId}`);
  const { data: siteContentData } = useSiteContent();
  const siteContent = siteContentData ?? defaultSiteContent;
  const content = siteContent.pages.subjectDetail;
  const brand = siteContent.brand ?? defaultSiteContent.brand;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SkeletonList count={4} />
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">{content.notFound}</p>
      </div>
    );
  }

  const units = subject.units ? Object.entries(subject.units) : [];

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-20 md:py-28">
        <GridPattern />
        <FloatingShape type="cube" className="top-20 right-[8%]" delay={0} />
        <FloatingShape type="ring" className="bottom-10 left-[5%]" delay={2} />

        <div className="container mx-auto px-4 relative z-10">
          <Link to="/subjects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {content.backLabel}
          </Link>

          <div className="grid items-center gap-10 mb-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-6xl mb-4">{subject.icon || "📚"}</div>
              <h1 className="text-5xl md:text-6xl font-bold font-heading mb-3">{subject.name}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">{subject.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Layers className="w-4 h-4" /> {units.length} units
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <ContentBlockImage
                src={subject.image || brand.logoUrl}
                alt={subject.name}
                aspectRatio={4 / 3}
                overlayLabel={subject.name}
                objectFit="contain"
              />
            </motion.div>
          </div>

          <h2 className="text-2xl font-heading font-semibold mb-8">{content.unitsTitle}</h2>

          {units.length === 0 ? (
            <p className="text-muted-foreground">{content.empty}</p>
          ) : (
            <div className="space-y-4">
              {units.map(([key, unit], i) => {
                const topicCount = unit.topics ? Object.keys(unit.topics).length : 0;
                return (
                  <motion.div key={key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link
                      to={`/subjects/${subjectId}/units/${key}`}
                      className="group flex items-center justify-between p-6 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-24 shrink-0">
                          <ContentBlockImage
                            src={unit.image || subject.image || brand.logoUrl}
                            alt={unit.name}
                            aspectRatio={1}
                            objectFit="contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">{unit.name}</h3>
                          <p className="text-sm text-muted-foreground">{unit.description}</p>
                          <span className="text-xs text-muted-foreground mt-1 inline-block">{topicCount} topics</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
