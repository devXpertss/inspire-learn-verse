import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Code, Brain, Sparkles, ArrowRight, Zap, GraduationCap, Layers, Users, Trophy, Target, Rocket, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShape, FloatingParticles, GridPattern } from "@/components/FloatingElements";
import { useSubjects } from "@/hooks/useFirebase";

const features = [
  { icon: BookOpen, title: "Structured Notes", description: "Organized subjects, units, topics & detailed notes with PPT slides" },
  { icon: Code, title: "Code Playground", description: "Write & run Python, C, and SQL code directly in your browser" },
  { icon: Brain, title: "Interactive Quizzes", description: "Test your knowledge with subject-wise quizzes and instant feedback" },
  { icon: Layers, title: "Rich Presentations", description: "View study material as beautiful slide presentations" },
  { icon: Target, title: "Progress Tracking", description: "Track your learning journey and monitor topic completion" },
  { icon: Users, title: "Community Driven", description: "Content curated by educators and industry professionals" },
];

const stats = [
  { value: "50+", label: "Subjects", icon: BookOpen },
  { value: "500+", label: "Topics", icon: Target },
  { value: "1000+", label: "Notes", icon: Layers },
  { value: "200+", label: "Quizzes", icon: Brain },
];

const testimonials = [
  { name: "Priya S.", role: "CS Student", quote: "CodeSpire made learning DSA so much easier. The presentations are amazing!", avatar: "PS" },
  { name: "Alex M.", role: "Developer", quote: "The code playground is my go-to for quick practice sessions.", avatar: "AM" },
  { name: "Sarah K.", role: "Educator", quote: "I recommend CodeSpire to all my students. The content quality is top-notch.", avatar: "SK" },
];

const learningPaths = [
  { title: "Python Mastery", topics: 45, icon: "🐍", color: "from-green-500 to-emerald-600" },
  { title: "C Programming", topics: 38, icon: "⚡", color: "from-blue-500 to-cyan-600" },
  { title: "SQL & Databases", topics: 30, icon: "🗄️", color: "from-orange-500 to-amber-600" },
  { title: "Data Structures", topics: 52, icon: "🏗️", color: "from-purple-500 to-violet-600" },
];

export default function HomePage() {
  const { data: subjects } = useSubjects();
  const subjectCount = subjects ? Object.keys(subjects).length : 0;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 md:py-40">
        <GridPattern />
        <FloatingParticles />
        <FloatingShape type="hexagon" className="top-20 right-[10%]" delay={0} />
        <FloatingShape type="ring" className="top-60 left-[5%]" delay={2} />
        <FloatingShape type="cube" className="bottom-20 right-[20%]" delay={1} />
        <FloatingShape type="sphere" className="top-32 left-[25%]" delay={3} />
        <FloatingShape type="pyramid" className="bottom-40 left-[60%]" delay={4} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Your Ultimate Study Companion
              <ArrowRight className="w-3 h-3" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-bold font-heading leading-tight mb-8">
              Learn. Code.{" "}
              <span className="text-gradient">Inspire.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Master programming with structured notes, interactive code playgrounds,
              beautiful presentations, and challenging quizzes — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/subjects">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity px-10 py-6 text-lg">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/playground">
                <Button size="lg" variant="outline" className="px-10 py-6 text-lg">
                  <Code className="w-5 h-5 mr-2" />
                  Try Playground
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Code preview card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-24 max-w-4xl mx-auto"
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
                <pre className="text-sm font-mono text-foreground overflow-x-auto">
                  <code>{`# Welcome to CodeSpire Playground! 🚀
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

# Output: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3...`}</code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-3xl md:text-5xl font-bold text-gradient font-heading">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 relative overflow-hidden">
        <FloatingShape type="ring" className="top-10 right-[8%]" delay={1} />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              Popular <span className="text-gradient">Learning Paths</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Follow curated paths designed to take you from beginner to advanced
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {learningPaths.map((path, i) => (
              <motion.div
                key={path.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${path.color}`} />
                <div className="p-6">
                  <span className="text-4xl block mb-4">{path.icon}</span>
                  <h3 className="font-heading font-bold text-lg mb-2">{path.title}</h3>
                  <p className="text-sm text-muted-foreground">{path.topics} topics covered</p>
                  <Link to="/subjects" className="inline-flex items-center text-sm text-primary font-medium mt-4">
                    Start Path <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative overflow-hidden">
        <GridPattern />
        <FloatingShape type="hexagon" className="top-20 left-[5%]" delay={2} />
        <FloatingShape type="sphere" className="bottom-20 right-[10%]" delay={0} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              Everything You Need to <span className="text-gradient">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comprehensive tools designed to accelerate your learning journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative p-7 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why CodeSpire */}
      <section className="py-24 border-y border-border relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                Why choose <span className="text-gradient">CodeSpire</span>?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                We believe learning to code should be accessible, engaging, and structured.
              </p>
              <div className="space-y-4">
                {[
                  "Curated content by industry experts",
                  "Interactive code execution in browser",
                  "Beautiful slide presentations for visual learning",
                  "Quiz system with instant feedback",
                  "Dark & light mode for comfortable studying",
                  "Firebase-powered for real-time updates",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-10" />
              <div className="relative glass rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <Rocket className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl">Quick Start</h3>
                    <p className="text-sm text-muted-foreground">Get coding in under 30 seconds</p>
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Trophy className="w-6 h-6 text-primary mb-2" />
                    <p className="text-2xl font-bold font-heading">{subjectCount || "4"}+</p>
                    <p className="text-xs text-muted-foreground">Subjects Available</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <Star className="w-6 h-6 text-primary mb-2" />
                    <p className="text-2xl font-bold font-heading">4.9</p>
                    <p className="text-xs text-muted-foreground">User Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        <FloatingShape type="cube" className="top-10 left-[8%]" delay={1} />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
              What Our <span className="text-gradient">Students Say</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Join thousands of learners who love CodeSpire</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-card border border-border shadow-card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <FloatingShape type="ring" className="top-10 right-[15%]" delay={0} />
        <FloatingShape type="hexagon" className="bottom-10 left-[10%]" delay={2} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Zap className="w-14 h-14 mx-auto mb-6 text-primary" />
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
              Dive into structured courses, practice coding, and test your knowledge. Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/subjects">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 px-10 py-6 text-lg">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="px-10 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://i.postimg.cc/YhzcMz8R/logo.png" alt="CodeSpire" className="w-8 h-8 rounded-lg object-cover" />
                <span className="font-heading text-xl font-bold text-gradient">CodeSpire</span>
              </div>
              <p className="text-sm text-muted-foreground">Your ultimate study companion for mastering programming.</p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-3">Learn</h4>
              <div className="space-y-2">
                <Link to="/subjects" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Subjects</Link>
                <Link to="/playground" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Playground</Link>
                <Link to="/quiz" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Quizzes</Link>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-3">Connect</h4>
              <div className="space-y-2">
                <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <a href="https://instagram.com/codespire" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Instagram</a>
                <a href="https://github.com/codespire" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-3">Resources</h4>
              <div className="space-y-2">
                <span className="block text-sm text-muted-foreground">Blog (Coming Soon)</span>
                <span className="block text-sm text-muted-foreground">Docs (Coming Soon)</span>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 CodeSpire. Built with passion for learning.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
