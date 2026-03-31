import { useState } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Play, Loader2, RotateCcw, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const languageDefaults: Record<string, { code: string; lang: string }> = {
  python: {
    lang: "python",
    code: `# Python Playground 🐍\nprint("Hello, CodeSpire!")\n\n# Try writing your code here\nfor i in range(5):\n    print(f"Count: {i}")`,
  },
  c: {
    lang: "c",
    code: `// C Playground\n#include <stdio.h>\n\nint main() {\n    printf("Hello, CodeSpire!\\n");\n    return 0;\n}`,
  },
  sql: {
    lang: "sql",
    code: `-- SQL Playground\nSELECT 'Hello, CodeSpire!' AS greeting;\n\n-- Try your queries here\nSELECT 1 + 1 AS result;`,
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

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    setCode(languageDefaults[lang].code);
    setOutput("");
  };

  const handleRun = async () => {
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
      const data = await res.json();
      setOutput(data.run?.output || data.run?.stderr || "No output");
    } catch {
      setOutput("Error: Could not connect to the execution server. Please try again.");
    }
    setRunning(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold font-heading mb-2">
            <span className="text-gradient">Code Playground</span>
          </h1>
          <p className="text-muted-foreground">Write, run, and experiment with code</p>
        </motion.div>

        {/* Language Tabs */}
        <div className="flex gap-2 mb-4">
          {Object.keys(languageDefaults).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLangChange(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                selectedLang === lang
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Editor */}
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Code className="w-4 h-4" />
                <span className="capitalize">{selectedLang}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCode(languageDefaults[selectedLang].code)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleRun}
                  disabled={running}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  Run
                </Button>
              </div>
            </div>
            <Editor
              height="400px"
              language={languageDefaults[selectedLang].lang}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Output */}
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <div className="px-4 py-2 border-b border-border bg-muted/50">
              <span className="text-sm text-muted-foreground">Output</span>
            </div>
            <pre className="p-4 h-[400px] overflow-auto font-mono text-sm text-foreground">
              {output || "Run your code to see output here..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
