import { useEffect, useState } from "react";
import { db, ref, set, onValue } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, BookOpen, Brain, Lock, LogOut, Eye, EyeOff, FileJson, Presentation,
} from "lucide-react";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";

type Section = "siteContent" | "subjects" | "presentations" | "quizzes";

// Hardcoded admin credentials (in production, use proper auth)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "codespire2026";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      <GridPattern />
      <FloatingShape type="hexagon" className="top-20 right-[10%]" delay={0} />
      <FloatingShape type="sphere" className="bottom-20 left-[10%]" delay={2} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2">
              <span className="text-gradient">Admin Access</span>
            </h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to manage content</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username</label>
              <Input
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(""); }}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
              <Lock className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function JsonEditor({ path, title, description }: { path: string; title: string; description: string }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onValue(ref(db, path), (snap) => {
      setValue(JSON.stringify(snap.val() ?? {}, null, 2));
      setLoading(false);
      setError(null);
    });
    return () => unsub();
  }, [path]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const parsed = JSON.parse(value || "{}");
      await set(ref(db, path), parsed);
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
    } finally {
      setSaving(false);
    }
  };

  const [loading, setLoading] = useState(true);
  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileJson className="w-4 h-4 mr-2" />} Save JSON
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} rows={24} className="font-mono text-xs" />
      <p className="text-xs text-muted-foreground">Edit the JSON and save it directly to Firebase. This controls the live website content.</p>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState<Section>("siteContent");

  const handleLogout = () => {
    setAuthenticated(false);
  };

  const sections: Record<Section, { title: string; description: string; icon: any; path: string }> = {
    siteContent: {
      title: "Site Content",
      description: "Edit every page label, navigation item, contact info, logo URL, search text, and footer content.",
      icon: FileJson,
      path: "siteContent",
    },
    subjects: {
      title: "Subjects",
      description: "Manage subjects, units, topics, and text notes stored in Firebase.",
      icon: BookOpen,
      path: "subjects",
    },
    presentations: {
      title: "Presentations",
      description: "Manage the separate PPT section, embed URLs, thumbnails, slide content, and downloadable files.",
      icon: Presentation,
      path: "presentations",
    },
    quizzes: {
      title: "Quizzes",
      description: "Manage quizzes, questions, answers, and explanations as raw JSON.",
      icon: Brain,
      path: "quizzes",
    },
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">
                <span className="text-gradient">Admin Panel</span>
              </h1>
              <p className="text-muted-foreground">Manage your content — changes sync to Firebase in real-time</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-8">
          {(Object.entries(sections) as [Section, { title: string; icon: any }][]).map(([key, item]) => {
            const Icon = item.icon;
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  section === key ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-secondary-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {item.title}
              </button>
            );
          })}
        </div>

        <JsonEditor
          path={sections[section].path}
          title={sections[section].title}
          description={sections[section].description}
        />
      </div>
    </div>
  );
}
