import { useEffect, useState, useCallback } from "react";
import { db, ref, set, onValue } from "@/lib/firebase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, BookOpen, Brain, Lock, LogOut, Eye, EyeOff, Presentation,
  Save, Plus, Trash2, ChevronDown, ChevronRight, Image, Video,
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
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows} />
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
      setMsg("✅ Saved successfully!");
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
        <p className="text-sm text-muted-foreground">Edit every text, label, and URL on the website.</p>
        <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save All
        </Button>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      <CollapsibleSection title="🏷️ Brand" defaultOpen>
        <FieldInput label="Site Name" value={data.brand?.name || ""} onChange={(v) => update(["brand", "name"], v)} />
        <FieldInput label="Logo URL" value={data.brand?.logoUrl || ""} onChange={(v) => update(["brand", "logoUrl"], v)} />
        <FieldInput label="Logo Alt Text" value={data.brand?.logoAlt || ""} onChange={(v) => update(["brand", "logoAlt"], v)} />
      </CollapsibleSection>

      <CollapsibleSection title="🧭 Navigation">
        <FieldInput label="Search Placeholder" value={data.navigation?.searchPlaceholder || ""} onChange={(v) => update(["navigation", "searchPlaceholder"], v)} />
        {(data.navigation?.items || []).map((item: any, i: number) => (
          <div key={i} className="flex gap-2 items-end">
            <div className="flex-1"><FieldInput label={`Nav ${i + 1} Label`} value={item.label} onChange={(v) => { const items = [...(data.navigation?.items || [])]; items[i] = { ...items[i], label: v }; update(["navigation", "items"], items); }} /></div>
            <div className="flex-1"><FieldInput label={`Nav ${i + 1} Path`} value={item.path} onChange={(v) => { const items = [...(data.navigation?.items || [])]; items[i] = { ...items[i], path: v }; update(["navigation", "items"], items); }} /></div>
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="📄 Footer">
        <FieldTextarea label="Footer Description" value={data.footer?.description || ""} onChange={(v) => update(["footer", "description"], v)} />
        <FieldInput label="Copyright" value={data.footer?.copyright || ""} onChange={(v) => update(["footer", "copyright"], v)} />
        <p className="text-xs font-semibold text-muted-foreground mt-4">CTA Link Button</p>
        <FieldInput label="Button Label" value={data.footer?.ctaButton?.label || ""} onChange={(v) => {
          const btn = { ...(data.footer?.ctaButton || { label: "", url: "", show: true }), label: v };
          update(["footer", "ctaButton"], btn);
        }} />
        <FieldInput label="Button URL" value={data.footer?.ctaButton?.url || ""} onChange={(v) => {
          const btn = { ...(data.footer?.ctaButton || { label: "", url: "", show: true }), url: v };
          update(["footer", "ctaButton"], btn);
        }} />
      </CollapsibleSection>

      <CollapsibleSection title="🏠 Home Page — Text">
        <FieldInput label="Badge Text" value={data.home?.badge || ""} onChange={(v) => update(["home", "badge"], v)} />
        <FieldInput label="Title Prefix" value={data.home?.titlePrefix || ""} onChange={(v) => update(["home", "titlePrefix"], v)} />
        <FieldInput label="Title Accent" value={data.home?.titleAccent || ""} onChange={(v) => update(["home", "titleAccent"], v)} />
        <FieldTextarea label="Description" value={data.home?.description || ""} onChange={(v) => update(["home", "description"], v)} />
        <FieldInput label="Primary CTA" value={data.home?.primaryCta || ""} onChange={(v) => update(["home", "primaryCta"], v)} />
        <FieldInput label="Secondary CTA" value={data.home?.secondaryCta || ""} onChange={(v) => update(["home", "secondaryCta"], v)} />
        <FieldInput label="Code Preview Label" value={data.home?.codePreviewLabel || ""} onChange={(v) => update(["home", "codePreviewLabel"], v)} />
        <FieldTextarea label="Code Preview Code" value={data.home?.codePreviewCode || ""} onChange={(v) => update(["home", "codePreviewCode"], v)} />
        <FieldInput label="Features Title" value={data.home?.featuresTitle || ""} onChange={(v) => update(["home", "featuresTitle"], v)} />
        <FieldInput label="Features Accent" value={data.home?.featuresAccent || ""} onChange={(v) => update(["home", "featuresAccent"], v)} />
        <FieldTextarea label="Features Description" value={data.home?.featuresDescription || ""} onChange={(v) => update(["home", "featuresDescription"], v)} />
        <FieldInput label="Why Title" value={data.home?.whyTitle || ""} onChange={(v) => update(["home", "whyTitle"], v)} />
        <FieldInput label="Why Accent" value={data.home?.whyAccent || ""} onChange={(v) => update(["home", "whyAccent"], v)} />
        <FieldTextarea label="Why Description" value={data.home?.whyDescription || ""} onChange={(v) => update(["home", "whyDescription"], v)} />
        <FieldInput label="CTA Title" value={data.home?.ctaTitle || ""} onChange={(v) => update(["home", "ctaTitle"], v)} />
        <FieldTextarea label="CTA Description" value={data.home?.ctaDescription || ""} onChange={(v) => update(["home", "ctaDescription"], v)} />
        <FieldInput label="CTA Primary" value={data.home?.ctaPrimary || ""} onChange={(v) => update(["home", "ctaPrimary"], v)} />
        <FieldInput label="CTA Secondary" value={data.home?.ctaSecondary || ""} onChange={(v) => update(["home", "ctaSecondary"], v)} />
        <FieldInput label="Testimonials Title" value={data.home?.testimonialsTitle || ""} onChange={(v) => update(["home", "testimonialsTitle"], v)} />
        <FieldInput label="Testimonials Accent" value={data.home?.testimonialsAccent || ""} onChange={(v) => update(["home", "testimonialsAccent"], v)} />
        <FieldInput label="Learning Paths Title" value={data.home?.learningPathsTitle || ""} onChange={(v) => update(["home", "learningPathsTitle"], v)} />
        <FieldInput label="Learning Paths Accent" value={data.home?.learningPathsAccent || ""} onChange={(v) => update(["home", "learningPathsAccent"], v)} />
      </CollapsibleSection>

      <CollapsibleSection title="🖼️ Home Page — Images">
        <FieldInput label="Hero Image" value={data.home?.heroImage || ""} onChange={(v) => update(["home", "heroImage"], v)} />
        <FieldInput label="Why Section Image" value={data.home?.whyImage || ""} onChange={(v) => update(["home", "whyImage"], v)} />
        <FieldInput label="CTA Section Image" value={data.home?.ctaImage || ""} onChange={(v) => update(["home", "ctaImage"], v)} />
        <p className="text-xs font-semibold text-muted-foreground mt-4">Learning Path Images</p>
        {(data.home?.learningPaths || []).map((lp: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-primary">{lp.title || `Path ${i + 1}`}</p>
            <FieldInput label="Title" value={lp.title || ""} onChange={(v) => { const paths = JSON.parse(JSON.stringify(data.home?.learningPaths || [])); paths[i] = { ...paths[i], title: v }; update(["home", "learningPaths"], paths); }} />
            <FieldInput label="Topics" value={lp.topics || ""} onChange={(v) => { const paths = JSON.parse(JSON.stringify(data.home?.learningPaths || [])); paths[i] = { ...paths[i], topics: v }; update(["home", "learningPaths"], paths); }} />
            <FieldInput label="Icon (emoji)" value={lp.icon || ""} onChange={(v) => { const paths = JSON.parse(JSON.stringify(data.home?.learningPaths || [])); paths[i] = { ...paths[i], icon: v }; update(["home", "learningPaths"], paths); }} />
            <FieldInput label="Image URL" value={lp.image || ""} onChange={(v) => { const paths = JSON.parse(JSON.stringify(data.home?.learningPaths || [])); paths[i] = { ...paths[i], image: v }; update(["home", "learningPaths"], paths); }} />
          </div>
        ))}
        <p className="text-xs font-semibold text-muted-foreground mt-4">Feature Card Images</p>
        {(data.home?.features || []).map((f: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-primary">{f.title || `Feature ${i + 1}`}</p>
            <FieldInput label="Title" value={f.title || ""} onChange={(v) => { const feats = JSON.parse(JSON.stringify(data.home?.features || [])); feats[i] = { ...feats[i], title: v }; update(["home", "features"], feats); }} />
            <FieldTextarea label="Description" value={f.description || ""} onChange={(v) => { const feats = JSON.parse(JSON.stringify(data.home?.features || [])); feats[i] = { ...feats[i], description: v }; update(["home", "features"], feats); }} />
            <FieldInput label="Icon" value={f.icon || ""} onChange={(v) => { const feats = JSON.parse(JSON.stringify(data.home?.features || [])); feats[i] = { ...feats[i], icon: v }; update(["home", "features"], feats); }} />
            <FieldInput label="Image URL" value={f.image || ""} onChange={(v) => { const feats = JSON.parse(JSON.stringify(data.home?.features || [])); feats[i] = { ...feats[i], image: v }; update(["home", "features"], feats); }} />
          </div>
        ))}
        <p className="text-xs font-semibold text-muted-foreground mt-4">Testimonial Images</p>
        {(data.home?.testimonials || []).map((t: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-primary">{t.name || `Testimonial ${i + 1}`}</p>
            <FieldInput label="Name" value={t.name || ""} onChange={(v) => { const ts = JSON.parse(JSON.stringify(data.home?.testimonials || [])); ts[i] = { ...ts[i], name: v }; update(["home", "testimonials"], ts); }} />
            <FieldInput label="Role" value={t.role || ""} onChange={(v) => { const ts = JSON.parse(JSON.stringify(data.home?.testimonials || [])); ts[i] = { ...ts[i], role: v }; update(["home", "testimonials"], ts); }} />
            <FieldTextarea label="Quote" value={t.quote || ""} onChange={(v) => { const ts = JSON.parse(JSON.stringify(data.home?.testimonials || [])); ts[i] = { ...ts[i], quote: v }; update(["home", "testimonials"], ts); }} />
            <FieldInput label="Avatar (initials)" value={t.avatar || ""} onChange={(v) => { const ts = JSON.parse(JSON.stringify(data.home?.testimonials || [])); ts[i] = { ...ts[i], avatar: v }; update(["home", "testimonials"], ts); }} />
            <FieldInput label="Image URL" value={t.image || ""} onChange={(v) => { const ts = JSON.parse(JSON.stringify(data.home?.testimonials || [])); ts[i] = { ...ts[i], image: v }; update(["home", "testimonials"], ts); }} />
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="📞 Contact Page">
        <FieldInput label="Badge" value={data.contact?.badge || ""} onChange={(v) => update(["contact", "badge"], v)} />
        <FieldInput label="Title Prefix" value={data.contact?.titlePrefix || ""} onChange={(v) => update(["contact", "titlePrefix"], v)} />
        <FieldInput label="Title Accent" value={data.contact?.titleAccent || ""} onChange={(v) => update(["contact", "titleAccent"], v)} />
        <FieldTextarea label="Description" value={data.contact?.description || ""} onChange={(v) => update(["contact", "description"], v)} />
        <FieldInput label="Hero Image" value={data.contact?.heroImage || ""} onChange={(v) => update(["contact", "heroImage"], v)} />
        <FieldInput label="CTA Image" value={data.contact?.ctaImage || ""} onChange={(v) => update(["contact", "ctaImage"], v)} />
        <FieldInput label="Form Title Prefix" value={data.contact?.formTitlePrefix || ""} onChange={(v) => update(["contact", "formTitlePrefix"], v)} />
        <FieldInput label="Form Title Accent" value={data.contact?.formTitleAccent || ""} onChange={(v) => update(["contact", "formTitleAccent"], v)} />
        <FieldInput label="Submit Label" value={data.contact?.submitLabel || ""} onChange={(v) => update(["contact", "submitLabel"], v)} />
        {(data.contact?.infoCards || []).map((card: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Contact Card {i + 1}</p>
            <FieldInput label="Icon" value={card.icon} onChange={(v) => { const cards = [...(data.contact?.infoCards || [])]; cards[i] = { ...cards[i], icon: v }; update(["contact", "infoCards"], cards); }} />
            <FieldInput label="Label" value={card.label} onChange={(v) => { const cards = [...(data.contact?.infoCards || [])]; cards[i] = { ...cards[i], label: v }; update(["contact", "infoCards"], cards); }} />
            <FieldInput label="Value" value={card.value} onChange={(v) => { const cards = [...(data.contact?.infoCards || [])]; cards[i] = { ...cards[i], value: v }; update(["contact", "infoCards"], cards); }} />
            <FieldInput label="Link (href)" value={card.href} onChange={(v) => { const cards = [...(data.contact?.infoCards || [])]; cards[i] = { ...cards[i], href: v }; update(["contact", "infoCards"], cards); }} />
            <FieldInput label="Image URL" value={card.image || ""} onChange={(v) => { const cards = [...(data.contact?.infoCards || [])]; cards[i] = { ...cards[i], image: v }; update(["contact", "infoCards"], cards); }} />
          </div>
        ))}
        {(data.contact?.socials || []).map((s: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">Social {i + 1}</p>
            <FieldInput label="Label" value={s.label} onChange={(v) => { const socials = [...(data.contact?.socials || [])]; socials[i] = { ...socials[i], label: v }; update(["contact", "socials"], socials); }} />
            <FieldInput label="Handle" value={s.handle} onChange={(v) => { const socials = [...(data.contact?.socials || [])]; socials[i] = { ...socials[i], handle: v }; update(["contact", "socials"], socials); }} />
            <FieldInput label="URL" value={s.href} onChange={(v) => { const socials = [...(data.contact?.socials || [])]; socials[i] = { ...socials[i], href: v }; update(["contact", "socials"], socials); }} />
            <FieldInput label="Image URL" value={s.image || ""} onChange={(v) => { const socials = [...(data.contact?.socials || [])]; socials[i] = { ...socials[i], image: v }; update(["contact", "socials"], socials); }} />
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="📝 Page Labels">
        {data.pages && Object.entries(data.pages).map(([pageKey, pageData]: [string, any]) => (
          <div key={pageKey} className="p-3 rounded-lg bg-muted/50 space-y-2">
            <p className="text-xs font-semibold text-primary capitalize">{pageKey}</p>
            {typeof pageData === "object" && Object.entries(pageData).map(([field, val]) => {
              if (typeof val === "string") {
                return <FieldInput key={field} label={field} value={val} onChange={(v) => update(["pages", pageKey, field], v)} />;
              }
              return null;
            })}
          </div>
        ))}
      </CollapsibleSection>

      <CollapsibleSection title="🔍 Search">
        {data.search && Object.entries(data.search).map(([key, val]) => (
          typeof val === "string" ? <FieldInput key={key} label={key} value={val} onChange={(v) => update(["search", key], v)} /> : null
        ))}
      </CollapsibleSection>
    </div>
  );
}

/* ── Subject Block Editor ── */
function SubjectBlockEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onValue(ref(db, "subjects"), (snap) => { setData(snap.val() || {}); setLoading(false); });
    return () => unsub();
  }, []);

  const save = async () => {
    setSaving(true);
    try { await set(ref(db, "subjects"), data); setMsg("✅ Saved!"); setTimeout(() => setMsg(""), 3000); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
    setSaving(false);
  };

  const updateField = (path: string[], value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) { if (!obj[path[i]]) obj[path[i]] = {}; obj = obj[path[i]]; }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const addSubject = () => {
    const key = prompt("Enter subject key (e.g. 'java'):");
    if (!key) return;
    updateField([key], { id: key, name: "New Subject", description: "Description here", icon: "📚", color: "purple", units: {} });
  };

  const deleteSubject = (key: string) => {
    if (!confirm(`Delete subject "${key}"?`)) return;
    setData((prev: any) => { const copy = { ...prev }; delete copy[key]; return copy; });
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage subjects, units, topics and notes with simple fields.</p>
        <div className="flex gap-2">
          <Button onClick={addSubject} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Subject</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
          </Button>
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      {Object.entries(data || {}).map(([subKey, subject]: [string, any]) => (
        <CollapsibleSection key={subKey} title={`📚 ${subject.name || subKey}`}>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => deleteSubject(subKey)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          <FieldInput label="Name" value={subject.name || ""} onChange={(v) => updateField([subKey, "name"], v)} />
          <FieldTextarea label="Description" value={subject.description || ""} onChange={(v) => updateField([subKey, "description"], v)} />
          <FieldInput label="Icon (emoji)" value={subject.icon || ""} onChange={(v) => updateField([subKey, "icon"], v)} />
          <FieldInput label="Color" value={subject.color || ""} onChange={(v) => updateField([subKey, "color"], v)} />
          <FieldInput label="Image URL" value={subject.image || ""} onChange={(v) => updateField([subKey, "image"], v)} />

          {/* Units */}
          {subject.units && Object.entries(subject.units).map(([unitKey, unit]: [string, any]) => (
            <CollapsibleSection key={unitKey} title={`📖 Unit: ${unit.name || unitKey}`}>
              <FieldInput label="Unit Name" value={unit.name || ""} onChange={(v) => updateField([subKey, "units", unitKey, "name"], v)} />
              <FieldTextarea label="Unit Description" value={unit.description || ""} onChange={(v) => updateField([subKey, "units", unitKey, "description"], v)} />
              <FieldInput label="Unit Image URL" value={unit.image || ""} onChange={(v) => updateField([subKey, "units", unitKey, "image"], v)} />
              <Button variant="ghost" size="sm" onClick={() => {
                const copy = JSON.parse(JSON.stringify(data));
                delete copy[subKey].units[unitKey];
                setData(copy);
              }}><Trash2 className="w-3 h-3 text-destructive mr-1" /> Delete Unit</Button>

              {/* Topics */}
              {unit.topics && Object.entries(unit.topics).map(([topicKey, topic]: [string, any]) => (
                <CollapsibleSection key={topicKey} title={`📝 Topic: ${topic.name || topicKey}`}>
                  <FieldInput label="Topic Name" value={topic.name || ""} onChange={(v) => updateField([subKey, "units", unitKey, "topics", topicKey, "name"], v)} />
                  <FieldTextarea label="Topic Description" value={topic.description || ""} onChange={(v) => updateField([subKey, "units", unitKey, "topics", topicKey, "description"], v)} />
                  <FieldInput label="Topic Image URL" value={topic.image || ""} onChange={(v) => updateField([subKey, "units", unitKey, "topics", topicKey, "image"], v)} />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const copy = JSON.parse(JSON.stringify(data));
                    delete copy[subKey].units[unitKey].topics[topicKey];
                    setData(copy);
                  }}><Trash2 className="w-3 h-3 text-destructive mr-1" /> Delete Topic</Button>

                  {/* Notes */}
                  {topic.notes && Object.entries(topic.notes).map(([noteKey, note]: [string, any]) => (
                    <div key={noteKey} className="p-3 rounded-lg bg-muted/30 space-y-2 border border-border/50">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-primary">📄 Note: {note.title || noteKey}</p>
                        <Button variant="ghost" size="sm" onClick={() => {
                          const copy = JSON.parse(JSON.stringify(data));
                          delete copy[subKey].units[unitKey].topics[topicKey].notes[noteKey];
                          setData(copy);
                        }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                      </div>
                      <FieldInput label="Note Title" value={note.title || ""} onChange={(v) => updateField([subKey, "units", unitKey, "topics", topicKey, "notes", noteKey, "title"], v)} />
                      <FieldTextarea label="Note Content" value={note.content || ""} onChange={(v) => updateField([subKey, "units", unitKey, "topics", topicKey, "notes", noteKey, "content"], v)} rows={6} />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => {
                    const key = prompt("Note key:");
                    if (!key) return;
                    updateField([subKey, "units", unitKey, "topics", topicKey, "notes", key], { id: key, title: "New Note", content: "", type: "text" });
                  }}><Plus className="w-3 h-3 mr-1" /> Add Note</Button>
                </CollapsibleSection>
              ))}
              <Button variant="outline" size="sm" onClick={() => {
                const key = prompt("Topic key:");
                if (!key) return;
                updateField([subKey, "units", unitKey, "topics", key], { id: key, name: "New Topic", description: "", notes: {} });
              }}><Plus className="w-3 h-3 mr-1" /> Add Topic</Button>
            </CollapsibleSection>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            const key = prompt("Unit key:");
            if (!key) return;
            updateField([subKey, "units", key], { id: key, name: "New Unit", description: "", topics: {} });
          }}><Plus className="w-3 h-3 mr-1" /> Add Unit</Button>
        </CollapsibleSection>
      ))}
    </div>
  );
}

/* ── Presentation Block Editor ── */
function PresentationBlockEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onValue(ref(db, "presentations"), (snap) => { setData(snap.val() || {}); setLoading(false); });
    return () => unsub();
  }, []);

  const save = async () => {
    setSaving(true);
    try { await set(ref(db, "presentations"), data); setMsg("✅ Saved!"); setTimeout(() => setMsg(""), 3000); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
    setSaving(false);
  };

  const updateField = (path: string[], value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) { if (!obj[path[i]]) obj[path[i]] = {}; obj = obj[path[i]]; }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const addPresentation = () => {
    const key = prompt("Presentation key:");
    if (!key) return;
    updateField([key], { id: key, title: "New Presentation", description: "", category: "General", embedUrl: "", fileUrl: "", thumbnail: "" });
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage presentations with thumbnails, embed URLs, and download links.</p>
        <div className="flex gap-2">
          <Button onClick={addPresentation} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
          </Button>
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      {Object.entries(data || {}).map(([key, pres]: [string, any]) => (
        <CollapsibleSection key={key} title={`🎞️ ${pres.title || key}`}>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => {
              if (!confirm(`Delete "${key}"?`)) return;
              setData((prev: any) => { const copy = { ...prev }; delete copy[key]; return copy; });
            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          <FieldInput label="Title" value={pres.title || ""} onChange={(v) => updateField([key, "title"], v)} />
          <FieldTextarea label="Description" value={pres.description || ""} onChange={(v) => updateField([key, "description"], v)} />
          <FieldInput label="Category" value={pres.category || ""} onChange={(v) => updateField([key, "category"], v)} />
          <FieldInput label="Thumbnail URL" value={pres.thumbnail || ""} onChange={(v) => updateField([key, "thumbnail"], v)} />
          <FieldInput label="Embed URL" value={pres.embedUrl || ""} onChange={(v) => updateField([key, "embedUrl"], v)} />
          <FieldInput label="File Download URL" value={pres.fileUrl || ""} onChange={(v) => updateField([key, "fileUrl"], v)} />
          {pres.thumbnail && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Preview:</p>
              <img src={pres.thumbnail} alt="thumb" className="h-24 rounded-lg object-cover border border-border" />
            </div>
          )}
        </CollapsibleSection>
      ))}
    </div>
  );
}

/* ── Quiz Block Editor ── */
function QuizBlockEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onValue(ref(db, "quizzes"), (snap) => { setData(snap.val() || {}); setLoading(false); });
    return () => unsub();
  }, []);

  const save = async () => {
    setSaving(true);
    try { await set(ref(db, "quizzes"), data); setMsg("✅ Saved!"); setTimeout(() => setMsg(""), 3000); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
    setSaving(false);
  };

  const updateField = (path: string[], value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) { if (!obj[path[i]]) obj[path[i]] = {}; obj = obj[path[i]]; }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const addQuiz = () => {
    const key = prompt("Quiz key:");
    if (!key) return;
    updateField([key], { id: key, title: "New Quiz", subjectId: "", questions: [] });
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage quizzes with questions, options, and explanations.</p>
        <div className="flex gap-2">
          <Button onClick={addQuiz} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Quiz</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
          </Button>
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      {Object.entries(data || {}).map(([quizKey, quiz]: [string, any]) => (
        <CollapsibleSection key={quizKey} title={`🧠 ${quiz.title || quizKey}`}>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => {
              if (!confirm(`Delete "${quizKey}"?`)) return;
              setData((prev: any) => { const copy = { ...prev }; delete copy[quizKey]; return copy; });
            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          <FieldInput label="Quiz Title" value={quiz.title || ""} onChange={(v) => updateField([quizKey, "title"], v)} />
          <FieldInput label="Subject ID" value={quiz.subjectId || ""} onChange={(v) => updateField([quizKey, "subjectId"], v)} />

          <p className="text-xs font-semibold text-muted-foreground mt-4">Questions</p>
          {(quiz.questions || []).map((q: any, qi: number) => (
            <div key={qi} className="p-3 rounded-lg bg-muted/30 space-y-2 border border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-primary">Question {qi + 1}</p>
                <Button variant="ghost" size="sm" onClick={() => {
                  const qs = [...(quiz.questions || [])];
                  qs.splice(qi, 1);
                  updateField([quizKey, "questions"], qs);
                }}><Trash2 className="w-3 h-3 text-destructive" /></Button>
              </div>
              <FieldTextarea label="Question" value={q.question || ""} onChange={(v) => {
                const qs = JSON.parse(JSON.stringify(quiz.questions || []));
                qs[qi] = { ...qs[qi], question: v };
                updateField([quizKey, "questions"], qs);
              }} rows={2} />
              {(q.options || []).map((opt: string, oi: number) => (
                <FieldInput key={oi} label={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={(v) => {
                  const qs = JSON.parse(JSON.stringify(quiz.questions || []));
                  qs[qi].options[oi] = v;
                  updateField([quizKey, "questions"], qs);
                }} />
              ))}
              <FieldInput label="Correct Answer (0-based index)" value={String(q.correctAnswer ?? 0)} onChange={(v) => {
                const qs = JSON.parse(JSON.stringify(quiz.questions || []));
                qs[qi].correctAnswer = parseInt(v) || 0;
                updateField([quizKey, "questions"], qs);
              }} />
              <FieldTextarea label="Explanation" value={q.explanation || ""} onChange={(v) => {
                const qs = JSON.parse(JSON.stringify(quiz.questions || []));
                qs[qi].explanation = v;
                updateField([quizKey, "questions"], qs);
              }} rows={2} />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => {
            const qs = [...(quiz.questions || [])];
            qs.push({ id: `q${qs.length + 1}`, question: "", options: ["", "", "", ""], correctAnswer: 0, explanation: "" });
            updateField([quizKey, "questions"], qs);
          }}><Plus className="w-3 h-3 mr-1" /> Add Question</Button>
        </CollapsibleSection>
      ))}
    </div>
  );
}

/* ── Video Lectures Block Editor ── */
function VideoBlockEditor() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onValue(ref(db, "videoLectures"), (snap) => { setData(snap.val() || {}); setLoading(false); });
    return () => unsub();
  }, []);

  const save = async () => {
    setSaving(true);
    try { await set(ref(db, "videoLectures"), data); setMsg("✅ Saved!"); setTimeout(() => setMsg(""), 3000); }
    catch (e: any) { setMsg(`Error: ${e.message}`); }
    setSaving(false);
  };

  const updateField = (path: string[], value: any) => {
    setData((prev: any) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) { if (!obj[path[i]]) obj[path[i]] = {}; obj = obj[path[i]]; }
      obj[path[path.length - 1]] = value;
      return copy;
    });
  };

  const addVideo = () => {
    const key = prompt("Video key (e.g. 'python-intro'):");
    if (!key) return;
    updateField([key], { id: key, title: "New Video Lecture", description: "", category: "General", videoUrl: "", thumbnail: "", duration: "", instructor: "" });
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Manage video lectures with thumbnails, URLs, and categories.</p>
        <div className="flex gap-2">
          <Button onClick={addVideo} variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Video</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Save
          </Button>
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.startsWith("Error") ? "text-destructive" : "text-primary"}`}>{msg}</p>}

      {Object.entries(data || {}).map(([key, vid]: [string, any]) => (
        <CollapsibleSection key={key} title={`🎬 ${vid.title || key}`}>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => {
              if (!confirm(`Delete "${key}"?`)) return;
              setData((prev: any) => { const copy = { ...prev }; delete copy[key]; return copy; });
            }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
          <FieldInput label="Title" value={vid.title || ""} onChange={(v) => updateField([key, "title"], v)} />
          <FieldTextarea label="Description" value={vid.description || ""} onChange={(v) => updateField([key, "description"], v)} />
          <FieldInput label="Category" value={vid.category || ""} onChange={(v) => updateField([key, "category"], v)} />
          <FieldInput label="Video URL (embed)" value={vid.videoUrl || ""} onChange={(v) => updateField([key, "videoUrl"], v)} />
          <FieldInput label="Thumbnail URL" value={vid.thumbnail || ""} onChange={(v) => updateField([key, "thumbnail"], v)} />
          <FieldInput label="Duration" value={vid.duration || ""} onChange={(v) => updateField([key, "duration"], v)} />
          <FieldInput label="Instructor" value={vid.instructor || ""} onChange={(v) => updateField([key, "instructor"], v)} />
          {vid.thumbnail && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">Preview:</p>
              <img src={vid.thumbnail} alt="thumb" className="h-24 rounded-lg object-cover border border-border" />
            </div>
          )}
        </CollapsibleSection>
      ))}
    </div>
  );
}

/* ── Main Admin Page ── */
type Section = "siteContent" | "subjects" | "presentations" | "quizzes" | "videos";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [section, setSection] = useState<Section>("siteContent");

  const sections: Record<Section, { title: string; icon: any }> = {
    siteContent: { title: "Site Content", icon: Image },
    subjects: { title: "Subjects", icon: BookOpen },
    presentations: { title: "Presentations", icon: Presentation },
    videos: { title: "Video Lectures", icon: Video },
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
          {section === "subjects" && <SubjectBlockEditor />}
          {section === "presentations" && <PresentationBlockEditor />}
          {section === "quizzes" && <QuizBlockEditor />}
          {section === "videos" && <VideoBlockEditor />}
        </div>
      </div>
    </div>
  );
}
