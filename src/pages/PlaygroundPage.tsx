import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Play, Loader2, RotateCcw, Code, Terminal, Copy, Check, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingShape, GridPattern } from "@/components/FloatingElements";
import { Skeleton } from "@/components/ui/skeleton";

const languageDefaults: Record<string, { code: string; lang: string; icon: string }> = {
  python: {
    lang: "python",
    icon: "🐍",
    code: `# Python Playground 🐍
print("Hello, CodeSpire!")

# Try writing your code here
for i in range(5):
    print(f"Count: {i}")

# Calculate factorial
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(f"Factorial of 10 = {factorial(10)}")`,
  },
  c: {
    lang: "c",
    icon: "⚡",
    code: `// C Playground ⚡
#include <stdio.h>

int main() {
    printf("Hello, CodeSpire!\\n");
    
    // Loop example
    for (int i = 0; i < 5; i++) {
        printf("Count: %d\\n", i);
    }
    
    // Factorial
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
    code: `-- SQL Playground 🗄️
SELECT 'Hello, CodeSpire!' AS greeting;

-- Create and query a table
CREATE TABLE students (id INTEGER, name TEXT, grade TEXT);
INSERT INTO students VALUES (1, 'Alice', 'A');
INSERT INTO students VALUES (2, 'Bob', 'B');
INSERT INTO students VALUES (3, 'Charlie', 'A');

SELECT * FROM students WHERE grade = 'A';
SELECT COUNT(*) as total_students FROM students;`,
  },
};

const PISTON_API = "https://emkc.org/api/v2/piston/execute";

const languageVersions: Record<string, { language: string; version: string }> = {
  python: { language: "python", version: "3.10.0" },
  c: { language: "c", version: "10.2.0" },
  sql: { language: "sqlite3", version: "3.36.0" },
};

export default function PlaygroundPage() {
  const [selectedLang, setSelectedLang] = useState("python");
  const [code, setCode] = useState(languageDefaults.python.code);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(languageDefaults[lang].code);
    setOutput("");
    setEditorLoaded(false);
  };

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput("");
    try {
      const config = languageVersions[selectedLang];
      const res = await fetch(PISTON_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          files: [{ content: code }],
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
      const data = await res.json();
      const runOutput = data.run?.output || data.run?.stderr || "";
      const compileOutput = data.compile?.stderr || "";
      setOutput(compileOutput ? `Compile Error:\n${compileOutput}` : runOutput || "Program executed successfully (no output)");
    } catch (err: any) {
      setOutput(`Error: ${err.message || "Could not connect to the execution server. Please try again."}`);
    }
    setRunning(false);
  }, [selectedLang, code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
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
                  <span className="text-gradient">Code Playground</span>
                </h1>
                <p className="text-muted-foreground">Write, run, and experiment with code in real-time</p>
              </div>
            </div>
          </motion.div>

          {/* Language Tabs */}
          <div className="flex gap-2 mb-6">
            {Object.entries(languageDefaults).map(([lang, config]) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all flex items-center gap-2 ${
                  selectedLang === lang
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                <span>{config.icon}</span>
                {lang}
              </button>
            ))}
          </div>

          <div className={`grid ${expanded ? "" : "lg:grid-cols-2"} gap-4`}>
            {/* Editor */}
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="w-4 h-4" />
                  <span className="capitalize font-medium">{selectedLang}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    v{languageVersions[selectedLang].version}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8">
                    {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setCode(languageDefaults[selectedLang].code); setOutput(""); }} className="h-8">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRun}
                    disabled={running}
                    className="bg-gradient-primary text-primary-foreground hover:opacity-90 h-8 px-4"
                  >
                    {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    Run
                  </Button>
                </div>
              </div>
              {!editorLoaded && (
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              )}
              <div className={editorLoaded ? "" : "h-0 overflow-hidden"}>
                <Editor
                  height={expanded ? "600px" : "450px"}
                  language={languageDefaults[selectedLang].lang}
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  onMount={() => setEditorLoaded(true)}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    lineNumbers: "on",
                    renderLineHighlight: "all",
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    formatOnPaste: true,
                  }}
                />
              </div>
            </div>

            {/* Output */}
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Output</span>
                </div>
                {running && (
                  <span className="flex items-center gap-1.5 text-xs text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" /> Running...
                  </span>
                )}
              </div>
              <pre className={`p-4 ${expanded ? "h-[600px]" : "h-[450px]"} overflow-auto font-mono text-sm whitespace-pre-wrap`}>
                {output ? (
                  <span className="text-foreground">{output}</span>
                ) : (
                  <span className="text-muted-foreground">
                    {running ? "Executing your code..." : "Click 'Run' to execute your code and see output here..."}
                  </span>
                )}
              </pre>
            </div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid md:grid-cols-3 gap-4"
          >
            {[
              { title: "Python 3.10", desc: "Full Python with standard library support", icon: "🐍" },
              { title: "GCC 10.2", desc: "Compile and run C programs with GCC", icon: "⚡" },
              { title: "SQLite 3.36", desc: "Run SQL queries with SQLite engine", icon: "🗄️" },
            ].map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-gradient-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tip.icon}</span>
                  <h4 className="font-heading font-semibold text-sm">{tip.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground">{tip.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 CodeSpire. Powered by Piston API for code execution.</p>
        </div>
      </footer>
    </div>
  );
}
