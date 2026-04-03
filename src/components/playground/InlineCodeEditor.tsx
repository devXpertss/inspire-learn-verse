import { useMemo, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type PlaygroundLanguage = "python" | "c" | "sql";

interface InlineCodeEditorProps {
  language: PlaygroundLanguage;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const keywordMap: Record<PlaygroundLanguage, string[]> = {
  python: [
    "and", "as", "break", "class", "continue", "def", "elif", "else", "except", "False", "for", "from", "if", "import", "in", "is", "lambda", "None", "not", "or", "pass", "print", "return", "True", "try", "while", "with", "yield",
  ],
  c: [
    "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum", "extern", "float", "for", "if", "include", "int", "long", "main", "printf", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void", "while",
  ],
  sql: [
    "add", "alter", "and", "as", "avg", "between", "by", "count", "create", "delete", "desc", "distinct", "drop", "from", "group", "having", "in", "insert", "into", "join", "like", "limit", "max", "min", "not", "null", "on", "or", "order", "select", "set", "sum", "table", "update", "values", "where",
  ],
};

const themeClasses: Record<PlaygroundLanguage, string> = {
  python: "border-primary/40 bg-card",
  c: "border-accent/50 bg-card",
  sql: "border-secondary bg-card",
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function splitComment(line: string, language: PlaygroundLanguage) {
  const marker = language === "python" ? "#" : language === "sql" ? "--" : "//";
  const masked = line.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (match) => " ".repeat(match.length));
  const index = masked.indexOf(marker);

  if (index === -1) {
    return { code: line, comment: "" };
  }

  return {
    code: line.slice(0, index),
    comment: line.slice(index),
  };
}

function formatSegment(segment: string, language: PlaygroundLanguage) {
  const markers: string[] = [];
  let output = segment;

  const mark = (pattern: RegExp, className: string) => {
    output = output.replace(pattern, (match) => {
      const token = `___TOKEN_${markers.length}___`;
      markers.push(`<span class="${className}">${escapeHtml(match)}</span>`);
      return token;
    });
  };

  mark(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, "text-accent-foreground");
  mark(/\b\d+(?:\.\d+)?\b/g, "text-foreground font-semibold");

  const keywordPattern = new RegExp(`\\b(${keywordMap[language].join("|")})\\b`, language === "sql" ? "gi" : "g");
  mark(keywordPattern, "text-primary");

  let escaped = escapeHtml(output);
  markers.forEach((marker, index) => {
    escaped = escaped.replace(new RegExp(`___TOKEN_${index}___`, "g"), marker);
  });

  return escaped;
}

function highlightCode(code: string, language: PlaygroundLanguage) {
  return code
    .split("\n")
    .map((line) => {
      const { code: rawCode, comment } = splitComment(line, language);
      return `${formatSegment(rawCode, language)}${comment ? `<span class="text-muted-foreground italic">${escapeHtml(comment)}</span>` : ""}`;
    })
    .join("\n");
}

export function InlineCodeEditor({ language, value, onChange, className }: InlineCodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineNumbers = useMemo(() => Array.from({ length: Math.max(value.split("\n").length, 1) }, (_, index) => index + 1), [value]);
  const highlightedCode = useMemo(() => highlightCode(value || " ", language), [value, language]);

  const syncScroll = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (previewRef.current) {
      previewRef.current.scrollTop = textarea.scrollTop;
      previewRef.current.scrollLeft = textarea.scrollLeft;
    }

    if (gutterRef.current) {
      gutterRef.current.scrollTop = textarea.scrollTop;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;

    event.preventDefault();
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextValue = `${value.slice(0, start)}    ${value.slice(end)}`;

    onChange(nextValue);

    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.selectionStart = start + 4;
      textareaRef.current.selectionEnd = start + 4;
    });
  };

  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-card", themeClasses[language], className)}>
      <div className="grid grid-cols-[56px_minmax(0,1fr)]">
        <div className="border-r border-border bg-muted/40 px-2 py-4 text-right text-xs leading-6 text-muted-foreground">
          <div ref={gutterRef} className="max-h-[450px] overflow-hidden">
            {lineNumbers.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>

        <div className="relative h-[450px] bg-card">
          <div ref={previewRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-auto">
            <pre className="min-h-full whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6 text-foreground">
              <code dangerouslySetInnerHTML={{ __html: highlightedCode + "\n" }} />
            </pre>
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            spellCheck={false}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            className="absolute inset-0 resize-none overflow-auto border-0 bg-transparent p-4 font-mono text-sm leading-6 text-transparent caret-foreground outline-none placeholder:text-transparent"
          />
        </div>
      </div>
    </div>
  );
}
