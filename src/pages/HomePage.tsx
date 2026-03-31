import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Code, Brain, Sparkles, ArrowRight, Zap, GraduationCap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Structured Notes",
    description: "Organized subjects, units, topics & detailed notes with PPT slides",
  },
  {
    icon: Code,
    title: "Code Playground",
    description: "Write & run Python, C, and SQL code directly in your browser",
  },
  {
    icon: Brain,
    title: "Interactive Quizzes",
    description: "Test your knowledge with subject-wise quizzes and instant feedback",
  },
  {
    icon: Layers,
    title: "Rich Presentations",
    description: "View study material as beautiful slide presentations",
  },
];

const stats = [
  { value: "50+", label: "Subjects" },
  { value: "500+", label: "Topics" },
  { value: "1000+", label: "Notes" },
  { value: "200+", label: "Quizzes" },
];

function FloatingOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  return (
    <motion.div
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    />
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <FloatingOrb className="w-96 h-96 bg-primary -top-20 -left-20" delay={0} />
        <FloatingOrb className="w-72 h-72 bg-accent top-40 right-10" delay={2} />
        <FloatingOrb className="w-64 h-64 bg-primary bottom-0 left-1/3" delay={4} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Your Ultimate Study Companion
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight mb-6">
              Learn. Code.{" "}
              <span className="text-gradient">Inspire.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Master programming with structured notes, interactive code playgrounds,
              beautiful presentations, and challenging quizzes — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/subjects">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity px-8 text-base">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/playground">
                <Button size="lg" variant="outline" className="px-8 text-base">
                  <Code className="w-5 h-5 mr-2" />
                  Try Playground
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* 3D-like floating element */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 max-w-3xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-20 animate-pulse-glow" />
              <div className="relative glass rounded-2xl p-8 shadow-glow">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/40" />
                  <span className="text-xs text-muted-foreground ml-2 font-mono">playground.py</span>
                </div>
                <pre className="text-sm font-mono text-foreground">
                  <code>{`# Welcome to CodeSpire Playground! 🚀
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient font-heading">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Everything You Need to <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive tools designed to accelerate your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Zap className="w-12 h-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Dive into structured courses, practice coding, and test your knowledge.
            </p>
            <Link to="/subjects">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 px-8">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 CodeSpire. Built with passion for learning.</p>
        </div>
      </footer>
    </div>
  );
}
