import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, RotateCcw, Code, Terminal, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { Skeleton } from "@/components/ui/skeleton";
import { runPlaygroundCode } from "@/lib/playgroundRuntime";
import { useSiteContent, useFirebaseData } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";
import { InlineCodeEditor } from "@/components/playground/InlineCodeEditor";
import { ContentBlockImage } from "@/components/ContentBlockImage";
import { SiteFooter } from "@/components/SiteFooter";

const fallbackLanguageDefaults: Record<string, { code: string; lang: string; icon: string; title: string; helper: string }> = {
  python: {
    lang: "python",
    icon: "🐍",
    title: "Python Workspace",
    helper: "Instant script editing with Python-style starter code.",
    code: `# Python Playground 🐍
print("Hello, CodeSpire!")

for i in range(5):
    print(f"Count: {i}")

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(f"Factorial of 10 = {factorial(10)}")`,
  },
  c: {
    lang: "c",
    icon: "⚡",
    title: "C Compiler View",
    helper: "Switch to C and get starter code instantly without reloading.",
    code: `// C Playground ⚡
#include <stdio.h>

int main() {
    printf("Hello, CodeSpire!\\n");

    for (int i = 0; i < 5; i++) {
        printf("Count: %d\\n", i);
    }

    int n = 10, fact = 1;
    for (int i = 1; i <= n; i++) {
        fact *= i;
    }
    printf("Factorial of %d = %d\\n", n, fact);

    return 0;
}`,
  },
  sql: {
    lang: "sql",
    icon: "🗄️",
    title: "SQL Query Console",
    helper: "Run structured query examples with a built-in editor surface.",
    code: `-- SQL Playground 🗄️
SELECT 'Hello, CodeSpire!' AS greeting;
SELECT 10 * 2 AS doubled_value;`,
  },
};

export default function PlaygroundPage() {
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState(fallbackLanguageDefaults.python.code);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data: siteContentData, loading } = useSiteContent();
  const content = (siteContentData ?? defaultSiteContent).pages.playground;

  const languageDefaults = useMemo(() => {
    const remoteExamples = content.examples ?? {};

    return {
      python: { ...fallbackLanguageDefaults.python, ...(remoteExamples.python ?? {}) },
      c: { ...fallbackLanguageDefaults.c, ...(remoteExamples.c ?? {}) },
      sql: { ...fallbackLanguageDefaults.sql, ...(remoteExamples.sql ?? {}) },
    };
  }, [content.examples]);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(languageDefaults[lang].code);
    setOutput("");
  };

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput(content.runningOutput || "Executing your code...");
    try {
      const result = await runPlaygroundCode(selectedLang, code);
      setOutput(result);
    } catch (err: any) {
      setOutput(`Error: ${err.message || content.executionError || "Execution failed."}`);
    }
    setRunning(false);
  }, [selectedLang, code, content.runningOutput, content.executionError]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-16">
      <section className="relative overflow-hidden py-16 md:py-20">
        <GridPattern />
        <FloatingShape type="cube" className="top-10 right-[10%]" delay={0} />
        <FloatingShape type="sphere" className="bottom-10 left-[5%]" delay={2} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Terminal className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-heading">
                  <span className="text-gradient">{content.title}</span>
                </h1>
                <p className="text-muted-foreground">{content.description}</p>
              </div>
            </div>
            <p className="text-sm text-primary bg-secondary border border-border rounded-xl px-4 py-3 max-w-3xl">
              ✨ {content.localNotice}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start mb-6">
            <div className="flex gap-2 flex-wrap">
              {Object.entries(languageDefaults).map(([lang, config]) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all flex items-center gap-2 border ${
                    selectedLang === lang
                      ? "bg-gradient-primary text-primary-foreground shadow-glow border-primary/30"
                      : "bg-secondary text-secondary-foreground hover:bg-muted border-border"
                  }`}
                >
                  <span>{config.icon}</span>
                  {lang}
                </button>
              ))}
            </div>

            <ContentBlockImage
              src={content.sideImage || "/content/code-lab.svg"}
              alt="Playground preview"
              aspectRatio={4 / 3}
              overlayLabel={languageDefaults[selectedLang].title}
            />
          </div>

          {loading && !siteContentData ? (
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/50">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Code className="w-4 h-4" />
                      <span className="capitalize font-medium">{selectedLang}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{languageDefaults[selectedLang].helper}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
                      {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCode(languageDefaults[selectedLang].code);
                        setOutput("");
                      }}
                      className="h-8"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRun}
                      disabled={running}
                      className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-8 px-4"
                    >
                      {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      {content.runLabel}
                    </Button>
                  </div>
                </div>

                <InlineCodeEditor language={selectedLang as "python" | "c" | "sql"} value={code} onChange={setCode} />
              </div>

              <div className="rounded-xl border border-border overflow-hidden bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-medium">{content.outputTitle}</span>
                  </div>
                  {running ? (
                    <span className="flex items-center gap-1.5 text-xs text-primary">
                      <Loader2 className="w-3 h-3 animate-spin" /> {content.runningLabel}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="w-3 h-3" /> AI execution
                    </span>
                  )}
                </div>
                <pre className="h-[450px] overflow-auto p-4 font-mono text-sm whitespace-pre-wrap leading-6">
                  {output ? <span className="text-foreground">{output}</span> : <span className="text-muted-foreground">{content.emptyOutput}</span>}
                </pre>
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid md:grid-cols-3 gap-4"
          >
            {Object.entries(languageDefaults).map(([lang, tip], i) => (
              <div key={i} className="p-4 rounded-xl bg-gradient-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tip.icon}</span>
                  <h4 className="font-heading font-semibold text-sm capitalize">{lang}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{tip.helper}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
