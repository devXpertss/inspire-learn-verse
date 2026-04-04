import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Video, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { ContentBlockImage } from "@/components/ContentBlockImage";
import { useSiteContent } from "@/hooks/useFirebase";
import { useFirebaseData } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { SiteFooter } from "@/components/SiteFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface VideoLecture {
  id?: string;
  title: string;
  description: string;
  category?: string;
  thumbnail?: string;
  videoUrl: string;
  duration?: string;
  instructor?: string;
}

export default function VideoLecturesPage() {
  const { data: videos, loading } = useFirebaseData<Record<string, VideoLecture>>("videoLectures");
  const { data: siteContentData } = useSiteContent();
  const siteContent = siteContentData ?? defaultSiteContent;
  const pageContent = (siteContent.pages as any)?.videoLectures ?? {
    badge: "Watch & Learn",
    title: "Video Lectures",
    description: "Watch tutorial videos and lectures to boost your understanding.",
    emptyTitle: "No Video Lectures Yet",
    emptyDescription: "Upload video lecture data to Firebase to see them here.",
    watchLabel: "Watch Now",
  };

  const [activeVideo, setActiveVideo] = useState<VideoLecture | null>(null);

  const videoList = videos ? Object.values(videos) : [];
  const categories = [...new Set(videoList.map((v) => v.category || "General"))];

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-20 md:py-28">
        <GridPattern />
        <FloatingShape type="hexagon" className="top-20 right-[10%]" delay={0} />
        <FloatingShape type="sphere" className="bottom-20 left-[5%]" delay={2} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Video className="w-4 h-4 mr-2" />
              {pageContent.badge}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              <span className="text-gradient">{pageContent.title}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{pageContent.description}</p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : videoList.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-3">{pageContent.emptyTitle}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">{pageContent.emptyDescription}</p>
            </motion.div>
          ) : (
            <>
              {categories.map((category) => (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-bold font-heading mb-6">
                    <span className="text-gradient">{category}</span>
                  </h2>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {videoList
                      .filter((v) => (v.category || "General") === category)
                      .map((video, index) => (
                        <motion.div
                          key={video.id || index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          whileHover={{ y: -6 }}
                          className="group overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-all duration-300 hover:shadow-glow"
                        >
                          <div className="relative cursor-pointer" onClick={() => setActiveVideo(video)}>
                            <ContentBlockImage
                              src={video.thumbnail}
                              alt={video.title}
                              aspectRatio={16 / 9}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                                <Play className="w-8 h-8 text-primary-foreground ml-1" />
                              </div>
                            </div>
                            {video.duration && (
                              <span className="absolute bottom-3 right-3 text-xs bg-background/90 text-foreground px-2 py-1 rounded-md font-mono border border-border">
                                {video.duration}
                              </span>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-semibold font-heading mb-2 line-clamp-2">{video.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>
                            {video.instructor && (
                              <p className="text-xs text-primary font-medium mb-3">🎓 {video.instructor}</p>
                            )}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setActiveVideo(video)}
                                className="bg-gradient-primary text-primary-foreground hover:opacity-90 flex-1"
                              >
                                <Play className="w-4 h-4 mr-1" /> {pageContent.watchLabel}
                              </Button>
                              {video.videoUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  asChild
                                >
                                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Fullscreen Video Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-lg font-bold font-heading">{activeVideo.title}</h2>
              {activeVideo.instructor && (
                <p className="text-sm text-muted-foreground">🎓 {activeVideo.instructor}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveVideo(null)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            {activeVideo.videoUrl ? (
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full max-w-5xl aspect-video rounded-xl border border-border"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            ) : (
              <p className="text-muted-foreground">No video URL provided for this lecture.</p>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
