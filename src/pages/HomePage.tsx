import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Code,
  GraduationCap,
  Layers,
  Presentation,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShape, FloatingParticles, GridPattern } from "@/components/FloatingElements";
import { ContentBlockImage } from "@/components/ContentBlockImage";
import { useSiteContent, useSubjects } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { SiteFooter } from "@/components/SiteFooter";

const iconMap = {
  BookOpen,
  Brain,
  Code,
  Layers,
  Presentation,
  Target,
  Users,
};

export default function HomePage() {
  const { data: subjects } = useSubjects();
  const { data: siteContentData } = useSiteContent();
  const siteContent = siteContentData ?? defaultSiteContent;
  const home = (siteContent.home ?? defaultSiteContent.home) as any;
  const brand = siteContent.brand ?? defaultSiteContent.brand;
  const subjectCount = subjects ? Object.keys(subjects).length : 0;

  const stats = Array.isArray(home.stats) ? home.stats : defaultSiteContent.home.stats;
  const learningPaths = Array.isArray(home.learningPaths) ? home.learningPaths : defaultSiteContent.home.learningPaths;
  const features = Array.isArray(home.features) ? home.features : defaultSiteContent.home.features;
  const whyPoints = Array.isArray(home.whyPoints) ? home.whyPoints : defaultSiteContent.home.whyPoints;
  const testimonials = Array.isArray(home.testimonials) ? home.testimonials : defaultSiteContent.home.testimonials;

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-24 md:py-32">
        <GridPattern />
        <FloatingParticles />
        <FloatingShape type="hexagon" className="top-20 right-[10%]" delay={0} />
        <FloatingShape type="ring" className="top-56 left-[5%]" delay={2} />
        <FloatingShape type="cube" className="bottom-20 right-[20%]" delay={1} />
        <FloatingShape type="sphere" className="top-32 left-[25%]" delay={3} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground mb-8"
              >
                <Sparkles className="w-4 h-4" />
                {home.badge}
                <ArrowRight className="w-3 h-3" />
              </motion.div>

              <h1 className="mb-6 text-5xl font-bold font-heading leading-tight md:text-7xl">
                {home.titlePrefix} <span className="text-gradient">{home.titleAccent}</span>
              </h1>

              <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">{home.description}</p>

              <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                <Link to="/subjects">
                  <Button size="lg" className="bg-gradient-primary px-10 py-6 text-lg text-primary-foreground shadow-glow hover:opacity-90">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    {home.primaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/playground">
                  <Button size="lg" variant="outline" className="px-10 py-6 text-lg">
                    <Code className="mr-2 h-5 w-5" />
                    {home.secondaryCta}
                  </Button>
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-15 blur-xl" />
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <div className="h-3 w-3 rounded-full bg-accent/70" />
                    <div className="h-3 w-3 rounded-full bg-primary/40" />
                    <span className="ml-2 text-xs font-mono text-muted-foreground">{home.codePreviewLabel}</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap text-sm font-mono text-foreground">
                    <code>{home.codePreviewCode}</code>
                  </pre>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <ContentBlockImage
                src={home.heroImage || brand.logoUrl}
                alt="CodeSpire hero visual"
                aspectRatio={4 / 5}
                overlayLabel={brand.name}
                objectFit="contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat: any, index: number) => {
              const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? BookOpen;
              const dynamicValue = String(stat.label).toLowerCase().includes("subject") && subjectCount ? `${subjectCount}+` : stat.value;

              return (
                <motion.div
                  key={`${stat.label}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="font-heading text-3xl font-bold text-gradient md:text-5xl">{dynamicValue}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <FloatingShape type="ring" className="top-10 right-[8%]" delay={1} />
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold font-heading md:text-5xl">
              {home.learningPathsTitle} <span className="text-gradient">{home.learningPathsAccent}</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">{home.learningPathsDescription}</p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-4">
            {learningPaths.map((path: any, index: number) => (
              <motion.div
                key={`${path.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-all duration-300 hover:shadow-glow"
              >
                <ContentBlockImage src={path.image || home.heroImage || brand.logoUrl} alt={path.title} aspectRatio={16 / 10} overlayLabel={path.title} />
                <div className="p-6">
                  <span className="mb-3 block text-4xl">{path.icon}</span>
                  <h3 className="mb-2 text-lg font-bold font-heading">{path.title}</h3>
                  <p className="text-sm text-muted-foreground">{path.topics}</p>
                  <Link to="/subjects" className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    Start Path <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <GridPattern />
        <FloatingShape type="hexagon" className="top-20 left-[5%]" delay={2} />
        <FloatingShape type="sphere" className="bottom-20 right-[10%]" delay={0} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold font-heading md:text-5xl">
              {home.featuresTitle} <span className="text-gradient">{home.featuresAccent}</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">{home.featuresDescription}</p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature: any, index: number) => {
              const Icon = iconMap[feature.icon as keyof typeof iconMap] ?? Sparkles;
              return (
                <motion.div
                  key={`${feature.title}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
                >
                  <ContentBlockImage src={feature.image || home.heroImage || brand.logoUrl} alt={feature.title} aspectRatio={16 / 9} />
                  <div className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold font-heading">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="mb-6 text-3xl font-bold font-heading md:text-5xl">
                {home.whyTitle} <span className="text-gradient">{home.whyAccent}</span>
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">{home.whyDescription}</p>
              <div className="space-y-4">
                {whyPoints.map((point: string, index: number) => (
                  <motion.div
                    key={`${point}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground">{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <ContentBlockImage src={home.whyImage || home.heroImage || brand.logoUrl} alt="Why CodeSpire visual" aspectRatio={4 / 3} />
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
                    <Rocket className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-heading">Quick Start</h3>
                    <p className="text-sm text-muted-foreground">Get coding and reading in under 30 seconds</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-muted/50 p-4">
                    <Trophy className="mb-2 h-6 w-6 text-primary" />
                    <p className="text-2xl font-bold font-heading">{subjectCount || 4}+</p>
                    <p className="text-xs text-muted-foreground">Subjects Available</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4">
                    <Star className="mb-2 h-6 w-6 text-primary" />
                    <p className="text-2xl font-bold font-heading">4.9</p>
                    <p className="text-xs text-muted-foreground">User Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <FloatingShape type="cube" className="top-10 left-[8%]" delay={1} />
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold font-heading md:text-5xl">
              {home.testimonialsTitle} <span className="text-gradient">{home.testimonialsAccent}</span>
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">{home.testimonialsDescription}</p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {testimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="overflow-hidden rounded-2xl border border-border bg-gradient-card shadow-card"
              >
                <ContentBlockImage src={testimonial.image || home.heroImage || brand.logoUrl} alt={testimonial.name} aspectRatio={16 / 10} />
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold font-heading">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-sm italic text-muted-foreground">"{testimonial.quote}"</p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <FloatingShape type="ring" className="top-10 right-[15%]" delay={0} />
        <FloatingShape type="hexagon" className="bottom-10 left-[10%]" delay={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-border bg-card/80 p-8 shadow-card lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Zap className="mb-6 h-14 w-14 text-primary" />
              <h2 className="mb-4 text-4xl font-bold font-heading md:text-5xl">{home.ctaTitle}</h2>
              <p className="mb-8 max-w-xl text-lg text-muted-foreground">{home.ctaDescription}</p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/subjects">
                  <Button size="lg" className="bg-gradient-primary px-10 py-6 text-lg text-primary-foreground shadow-glow hover:opacity-90">
                    {home.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="px-10 py-6 text-lg">
                    {home.ctaSecondary}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <ContentBlockImage src={home.ctaImage || home.heroImage || brand.logoUrl} alt="Ready to start learning" aspectRatio={1} />
            </motion.div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
