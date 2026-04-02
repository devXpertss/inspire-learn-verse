import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Presentation, ArrowRight, Download, Maximize2, X } from "lucide-react";
import { FloatingShape, GridPattern, FloatingParticles } from "@/components/FloatingElements";
import { Button } from "@/components/ui/button";
import { SkeletonList } from "@/components/SkeletonCard";
import { usePresentations, useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { SiteFooter } from "@/components/SiteFooter";
import type { Presentation as PresentationType } from "@/lib/types";

function getPresentationEmbedUrl(presentation: PresentationType) {
  if (presentation.embedUrl) return presentation.embedUrl;
  if (presentation.fileUrl) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(presentation.fileUrl)}`;
  }
  return null;
}

export default function PresentationsPage() {
  const { data: presentations, loading } = usePresentations();
  const { data: siteContentData } = useSiteContent();
  const content = (siteContentData ?? defaultSiteContent).pages.presentations;
  const list = useMemo(() => (presentations ? Object.entries(presentations) : []), [presentations]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && presentations?.[hash]) setActiveKey(hash);
  }, [presentations]);

  const activePresentation = activeKey ? presentations?.[activeKey] : list[0]?.[1];
  const activeEmbedUrl = activePresentation ? getPresentationEmbedUrl(activePresentation) : null;

  return (
    <div className="min-h-screen pt-16">
      {/* Fullscreen overlay */}
      {fullscreen && activeEmbedUrl && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <h2 className="font-heading font-bold text-lg">{activePresentation?.title}</h2>
            <Button variant="ghost" size="sm" onClick={() => setFullscreen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <iframe
            src={activeEmbedUrl}
            title="Fullscreen Presentation"
            className="flex-1 w-full bg-card"
          />
        </div>
      )}

      <section className="relative overflow-hidden py-20 md:py-28">
        <GridPattern />
        <FloatingParticles />
        <FloatingShape type="ring" className="top-16 right-[8%]" delay={0} />
        <FloatingShape type="cube" className="bottom-10 left-[8%]" delay={2} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <Presentation className="w-4 h-4" />
              {content.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-heading mb-4">
              <span className="text-gradient">{content.title}</span>
            </h1>
            <p className="text-lg text-muted-foreground">{content.description}</p>
          </motion.div>

          {loading ? (
            <SkeletonList count={4} />
          ) : list.length === 0 ? (
            <div className="text-center py-20">
              <Presentation className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-heading font-semibold mb-2">{content.emptyTitle}</h3>
              <p className="text-muted-foreground text-sm">{content.emptyDescription}</p>
            </div>
          ) : (
            <div className="grid xl:grid-cols-[340px_1fr] gap-8 items-start">
              <div className="space-y-4">
                {list.map(([key, presentation], index) => (
                  <motion.button
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setActiveKey(key);
                      window.history.replaceState(null, "", `#${key}`);
                    }}
                    className={`w-full text-left rounded-2xl overflow-hidden border transition-all ${activeKey === key || (!activeKey && index === 0)
                      ? "border-primary shadow-glow bg-secondary"
                      : "border-border bg-gradient-card shadow-card hover:border-primary/40"
                    }`}
                  >
                    {presentation.thumbnail || presentation.image ? (
                      <img
                        src={presentation.thumbnail || presentation.image}
                        alt={presentation.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{presentation.category || "Presentation"}</p>
                      <h3 className="font-heading text-lg font-semibold mb-2">{presentation.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{presentation.description}</p>
                      <div className="inline-flex items-center text-sm text-primary font-medium mt-4">
                        {content.openLabel} <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="rounded-3xl border border-border bg-gradient-card shadow-card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-b border-border">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{content.viewerTitle}</p>
                    <h2 className="text-2xl font-heading font-bold">{activePresentation?.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{activePresentation?.description}</p>
                  </div>
                  <div className="flex gap-2">
                    {activeEmbedUrl && (
                      <Button variant="outline" onClick={() => setFullscreen(true)}>
                        <Maximize2 className="w-4 h-4 mr-2" /> Full Screen
                      </Button>
                    )}
                    {activePresentation?.fileUrl && (
                      <a href={activePresentation.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> {content.downloadFile}</Button>
                      </a>
                    )}
                  </div>
                </div>

                {activeEmbedUrl ? (
                  <iframe
                    src={activeEmbedUrl}
                    title={content.iframeTitle}
                    className="w-full min-h-[720px] bg-card"
                  />
                ) : (
                  <div className="min-h-[520px] flex items-center justify-center p-10 text-center text-muted-foreground">
                    {content.noEmbed}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
