/* CDN-based playground runtimes — no npm imports needed */

declare global {
  interface Window {
    loadPyodide?: (opts?: any) => Promise<any>;
    initSqlJs?: (opts?: any) => Promise<any>;
  }
}

/* ── helpers ── */

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

/* ── Python (Pyodide from CDN) ── */

let pyodideInstance: any = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  await loadScript("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
  if (!window.loadPyodide) throw new Error("Pyodide failed to load");
  pyodideInstance = await window.loadPyodide();
  return pyodideInstance;
}

async function runPython(code: string): Promise<string> {
  try {
    const py = await getPyodide();
    // redirect stdout
    await py.runPython(`import sys, io; sys.stdout = io.StringIO(); sys.stderr = io.StringIO()`);
    await py.runPython(code);
    const stdout: string = py.runPython(`sys.stdout.getvalue()`) || "";
    const stderr: string = py.runPython(`sys.stderr.getvalue()`) || "";
    if (stderr.trim()) return `Error:\n${stderr.trim()}`;
    return stdout.trim() || "Program executed successfully (no output)";
  } catch (e: any) {
    return `Error:\n${e.message || "Python execution failed."}`;
  }
}

/* ── SQL (sql.js from CDN) ── */

let sqlJsFactory: any = null;

async function getSqlJs() {
  if (sqlJsFactory) return sqlJsFactory;
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js");
  if (!window.initSqlJs) throw new Error("sql.js failed to load");
  sqlJsFactory = await window.initSqlJs({
    locateFile: () => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm",
  });
  return sqlJsFactory;
}

async function runSql(code: string): Promise<string> {
  try {
    const SQL = await getSqlJs();
    const db = new SQL.Database();
    try {
      const results = db.exec(code);
      if (results.length === 0) return "SQL executed successfully (no output)";
      return results
        .map((r: any) => {
          const header = r.columns.join(" | ");
          const divider = r.columns.map(() => "---").join(" | ");
          const rows = r.values.map((row: any[]) =>
            row.map((c) => String(c ?? "NULL")).join(" | ")
          );
          return [header, divider, ...rows].join("\n");
        })
        .join("\n\n");
    } finally {
      db.close();
    }
  } catch (e: any) {
    return `Error:\n${e.message || "SQL execution failed."}`;
  }
}

/* ── C (basic — uses Wandbox public API as fallback) ── */

async function runC(code: string): Promise<string> {
  try {
    const resp = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler: "gcc-head",
        code,
        options: "",
        stdin: "",
      }),
    });
    if (!resp.ok) throw new Error(`Compiler service returned ${resp.status}`);
    const data = await resp.json();
    if (data.compiler_error) return `Compile Error:\n${data.compiler_error}`;
    if (data.program_error) return `Runtime Error:\n${data.program_error}`;
    return (data.program_output || "").trim() || "Program executed successfully (no output)";
  } catch (e: any) {
    return `Error:\n${e.message || "C execution failed."}`;
  }
}

/* ── public API ── */

export async function runPlaygroundCode(language: string, code: string): Promise<string> {
  if (language === "python") return runPython(code);
  if (language === "sql") return runSql(code);
  if (language === "c") return runC(code);
  return "Unsupported language.";
}
