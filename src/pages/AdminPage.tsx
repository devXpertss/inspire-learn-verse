import { useEffect, useState, useCallback } from "react";
import { db, ref, set, onValue } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, BookOpen, Brain, Lock, LogOut, Eye, EyeOff, FileJson, Presentation,
  Save, Plus, Trash2, ChevronDown, ChevronRight,
} from "lucide-react";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "codespire2026";

/* ── Login ── */
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
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-2xl border border-border bg-gradient-card p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold font-heading mb-2"><span className="text-gradient">Admin Access</span></h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to manage content</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Username</label>
              <Input value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} placeholder="Enter username" autoFocus />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Enter password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive text-center">{error}</motion.p>}
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
              <Lock className="w-4 h-4 mr-2" /> Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Reusable field editors ── */
function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
        <span className="font-heading font-semibold text-sm">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 pt-0 space-y-3 border-t border-border">{children}</div>}
    </div>
  );
}

/* ── Block Editor for Site Content ── */
function SiteContentEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onValue(ref(db, "siteContent"), (snap) => {
      setData(snap.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const update = useCallback((path: string[], value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) {
        if (!obj[path[i]]) obj[path[i]] = {};
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await set(ref(db, "siteContent"), data);
      setMsg("Saved successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (e: any) {
      setMsg(`Error: ${e.message}`);
    }
    setSaving(false);
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;
  if (!data) return <p className="text-muted-foreground">No site content found. Upload JSON to Firebase first.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Edit every text, label, and URL on the website. Changes sync to Firebase.</p>
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save All
        </Button>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      {/* Brand */}
      <CollapsibleSection title="🏷️ Brand" defaultOpen>
        <FieldInput label="Site Name" value={data.brand?.name || ""} onChange={(v) => update(["brand", "name"], v)} />
        <FieldInput label="Logo URL" value={data.brand?.logoUrl || ""} onChange={(v) => update(["brand", "logoUrl"], v)} />
        <FieldInput label="Logo Alt Text" value={data.brand?.logoAlt || ""} onChange={(v) => update(["brand", "logoAlt"], v)} />
      </CollapsibleSection>

      {/* Navigation */}
      <CollapsibleSection title="🧭 Navigation">
        <FieldInput label="Search Placeholder" value={data.navigation?.searchPlaceholder || ""} onChange={(v) => update(["navigation", "searchPlaceholder"], v)} />
        {(data.navigation?.items || []).map((item: any, i: number) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1">
              <FieldInput label={`Nav ${i + 1} Label`} value={item.label} onChange={(v) => {
                const items = [...(data.navigation?.items || [])];
                items[i] = { ...items[i], label: v };
                update(["navigation", "items"], items);
              }} />
            </div>
            <div className="flex-1">
              <FieldInput label={`Nav ${i + 1} Path`} value={item.path} onChange={(v) => {
                const items = [...(data.navigation?.items || [])];
                items[i] = { ...items[i], path: v };
                update(["navigation", "items"], items);
              }} />
            </div>
          </div>
        ))}
      </CollapsibleSection>

      {/* Footer */}
      <CollapsibleSection title="📄 Footer">
        <FieldTextarea label="Footer Description" value={data.footer?.description || ""} onChange={(v) => update(["footer", "description"], v)} />
        <FieldInput label="Copyright" value={data.footer?.copyright || ""} onChange={(v) => update(["footer", "copyright"], v)} />
      </CollapsibleSection>

      {/* Home Page */}
      <CollapsibleSection title="🏠 Home Page">
        <FieldInput label="Badge Text" value={data.home?.badge || ""} onChange={(v) => update(["home", "badge"], v)} />
        <FieldInput label="Title Prefix" value={data.home?.titlePrefix || ""} onChange={(v) => update(["home", "titlePrefix"], v)} />
        <FieldInput label="Title Accent" value={data.home?.titleAccent || ""} onChange={(v) => update(["home", "titleAccent"], v)} />
        <FieldTextarea label="Description" value={data.home?.description || ""} onChange={(v) => update(["home", "description"], v)} />
        <FieldInput label="Primary CTA" value={data.home?.primaryCta || ""} onChange={(v) => update(["home", "primaryCta"], v)} />
        <FieldInput label="Secondary CTA" value={data.home?.secondaryCta || ""} onChange={(v) => update(["home", "secondaryCta"], v)} />
        <FieldInput label="Features Title" value={data.home?.featuresTitle || ""} onChange={(v) => update(["home", "featuresTitle"], v)} />
        <FieldInput label="Features Accent" value={data.home?.featuresAccent || ""} onChange={(v) => update(["home", "featuresAccent"], v)} />
        <FieldTextarea label="Features Description" value={data.home?.featuresDescription || ""} onChange={(v) => update(["home", "featuresDescription"], v)} />
        <FieldInput label="Why Title" value={data.home?.whyTitle || ""} onChange={(v) => update(["home", "whyTitle"], v)} />
        <FieldInput label="Why Accent" value={data.home?.whyAccent || ""} onChange={(v) => update(["home", "whyAccent"], v)} />
        <FieldInput label="CTA Title" value={data.home?.ctaTitle || ""} onChange={(v) => update(["home", "ctaTitle"], v)} />
        <FieldTextarea label="CTA Description" value={data.home?.ctaDescription || ""} onChange={(v) => update(["home", "ctaDescription"], v)} />
      </CollapsibleSection>

      {/* Contact */}
      <CollapsibleSection title="📞 Contact Page">
        <FieldInput label="Badge" value={data.contact?.badge || ""} onChange={(v) => update(["contact", "badge"], v)} />
        <FieldInput label="Title Prefix" value={data.contact?.titlePrefix || ""} onChange={(v) => update(["contact", "titlePrefix"], v)} />
        <FieldInput label="Title Accent" value={data.contact?.titleAccent || ""} onChange={(v) => update(["contact", "titleAccent"], v)} />
        <FieldTextarea label="Description" value={data.contact?.description || ""} onChange={(v) => update(["contact", "description"], v)} />
        <FieldInput label="Form Title Prefix" value={data.contact?.formTitlePrefix || ""} onChange={(v) => update(["contact", "formTitlePrefix"], v)} />
        <FieldInput label="Form Title Accent" value={data.contact?.formTitleAccent || ""} onChange={(v) => update(["contact", "formTitleAccent"], v)} />
        <FieldInput label="Submit Label" value={data.contact?.submitLabel || ""} onChange={(v) => update(["contact", "submitLabel"], v)} />
        {(data.contact?.infoCards || []).map((card: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Contact Card {i + 1}</p>
            <FieldInput label="Icon" value={card.icon} onChange={(v) => {
              const cards = [...(data.contact?.infoCards || [])];
              cards[i] = { ...cards[i], icon: v };
              update(["contact", "infoCards"], cards);
            }} />
            <FieldInput label="Label" value={card.label} onChange={(v) => {
              const cards = [...(data.contact?.infoCards || [])];
              cards[i] = { ...cards[i], label: v };
              update(["contact", "infoCards"], cards);
            }} />
            <FieldInput label="Value" value={card.value} onChange={(v) => {
              const cards = [...(data.contact?.infoCards || [])];
              cards[i] = { ...cards[i], value: v };
              update(["contact", "infoCards"], cards);
            }} />
            <FieldInput label="Link (href)" value={card.href} onChange={(v) => {
              const cards = [...(data.contact?.infoCards || [])];
              cards[i] = { ...cards[i], href: v };
              update(["contact", "infoCards"], cards);
            }} />
          </div>
        ))}
        {(data.contact?.socials || []).map((s: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Social {i + 1}</p>
            <FieldInput label="Label" value={s.label} onChange={(v) => {
              const socials = [...(data.contact?.socials || [])];
              socials[i] = { ...socials[i], label: v };
              update(["contact", "socials"], socials);
            }} />
            <FieldInput label="Handle" value={s.handle} onChange={(v) => {
              const socials = [...(data.contact?.socials || [])];
              socials[i] = { ...socials[i], handle: v };
              update(["contact", "socials"], socials);
            }} />
            <FieldInput label="URL" value={s.href} onChange={(v) => {
              const socials = [...(data.contact?.socials || [])];
              socials[i] = { ...socials[i], href: v };
              update(["contact", "socials"], socials);
            }} />
          </div>
        ))}
      </CollapsibleSection>

      {/* Page Labels */}
      <CollapsibleSection title="📝 Page Labels">
        {data.pages && Object.entries(data.pages).map(([pageKey, pageData]: [string, any]) => (
          <div key={pageKey} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-primary capitalize">{pageKey}</p>
            {typeof pageData === "object" && Object.entries(pageData).map(([field, val]) => {
              if (typeof val === "string") {
                return (
                  <FieldInput key={field} label={field} value={val} onChange={(v) => update(["pages", pageKey, field], v)} />
                );
              }
              return null;
            })}
          </div>
        ))}
      </CollapsibleSection>

      {/* Search */}
      <CollapsibleSection title="🔍 Search">
        {data.search && Object.entries(data.search).map(([key, val]) => (
          typeof val === "string" ? <FieldInput key={key} label={key} value={val} onChange={(v) => update(["search", key], v)} /> : null
        ))}
      </CollapsibleSection>
    </div>
  );
}

/* ── Generic Record Editor (for subjects, presentations, quizzes) ── */
function RecordEditor({ path, title, description }: { path: string; title: string; description: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editJson, setEditJson] = useState("");

  useEffect(() => {
    const unsub = onValue(ref(db, path), (snap) => {
      setData(snap.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, [path]);

  const saveItem = async (key: string) => {
    setSaving(true);
    setMsg("");
    try {
      const parsed = JSON.parse(editJson);
      await set(ref(db, `${path}/${key}`), parsed);
      setMsg("Saved!");
      setEditKey(null);
      setTimeout(() => setMsg(""), 3000);
    } catch (e: any) {
      setMsg(`Error: ${e.message}`);
    }
    setSaving(false);
  };

  const deleteItem = async (key: string) => {
    if (!confirm(`Delete "${key}"?`)) return;
    await set(ref(db, `${path}/${key}`), null);
  };

  const addItem = async () => {
    const key = prompt("Enter a unique key for the new item:");
    if (!key) return;
    await set(ref(db, `${path}/${key}`), { id: key, name: "New Item", title: "New Item" });
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  const entries = Object.entries(data || {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={addItem} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      {entries.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No items yet. Click Add to create one.</p>
      ) : (
        entries.map(([key, val]: [string, any]) => (
          <div key={key} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-semibold">{val.name || val.title || key}</span>
                <span className="text-xs text-muted-foreground ml-2">({key})</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => {
                  if (editKey === key) { setEditKey(null); } else {
                    setEditKey(key);
                    setEditJson(JSON.stringify(val, null, 2));
                  }
                }}>
                  <FileJson className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteItem(key)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
            {/* Quick fields for common properties */}
            {editKey !== key && (
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {val.description && <p className="col-span-2 truncate">📝 {val.description}</p>}
                {val.icon && <p>Icon: {val.icon}</p>}
                {val.color && <p>Color: {val.color}</p>}
                {val.questions && <p>Questions: {Array.isArray(val.questions) ? val.questions.length : 0}</p>}
                {val.units && <p>Units: {Object.keys(val.units).length}</p>}
              </div>
            )}
            {editKey === key && (
              <div className="mt-3 space-y-2">
                <Textarea value={editJson} onChange={(e) => setEditJson(e.target.value)} rows={16} className="font-mono text-xs" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveItem(key)} disabled={saving} className="bg-gradient-primary text-primary-foreground">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />} Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditKey(null)}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ── Main Admin Page ── */
type Section = "siteContent" | "subjects" | "presentations" | "quizzes";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState<Section>("siteContent");

  const sections: Record<Section, { title: string; icon: any }> = {
    siteContent: { title: "Site Content", icon: FileJson },
    subjects: { title: "Subjects", icon: BookOpen },
    presentations: { title: "Presentations", icon: Presentation },
    quizzes: { title: "Quizzes", icon: Brain },
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
              <h1 className="text-4xl font-bold font-heading mb-2"><span className="text-gradient">Admin Panel</span></h1>
              <p className="text-muted-foreground">Manage your content — changes sync to Firebase in real-time</p>
            </div>
            <Button variant="outline" onClick={() => setAuthenticated(false)} className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </motion.div>

        <div className="flex gap-2 mb-8 flex-wrap">
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

        <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-card">
          {section === "siteContent" && <SiteContentEditor />}
          {section === "subjects" && (
            <RecordEditor path="subjects" title="Subjects" description="Add, edit, or remove subjects, units, topics, and notes." />
          )}
          {section === "presentations" && (
            <RecordEditor path="presentations" title="Presentations" description="Manage presentation decks with embed URLs and thumbnails." />
          )}
          {section === "quizzes" && (
            <RecordEditor path="quizzes" title="Quizzes" description="Manage quizzes, questions, answers, and explanations." />
          )}
        </div>
      </div>
    </div>
  );
}
