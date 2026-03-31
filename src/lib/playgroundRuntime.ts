import pyodideAsmJsUrl from "pyodide/pyodide.asm.js?url";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

let pyodidePromise: Promise<any> | null = null;
let sqlPromise: Promise<any> | null = null;
let clangPromise: Promise<any> | null = null;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const { loadPyodide } = await import("pyodide");
      const indexURL = pyodideAsmJsUrl.slice(0, pyodideAsmJsUrl.lastIndexOf("/") + 1);
      return loadPyodide({ indexURL });
    })();
  }
  return pyodidePromise;
}

async function getSqlJs() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const initSqlJs = (await import("sql.js")).default;
      return initSqlJs({ locateFile: () => sqlWasmUrl });
    })();
  }
  return sqlPromise;
}

async function getClangRuntime() {
  if (!clangPromise) {
    clangPromise = (async () => {
      const sdk = await import("@wasmer/sdk");
      await sdk.init();
      const clang = await sdk.Wasmer.fromRegistry("clang/clang");
      return { ...sdk, clang };
    })();
  }
  return clangPromise;
}

function formatSqlResults(results: Array<{ columns: string[]; values: Array<Array<string | number | null>> }>) {
  return results
    .map((result) => {
      const header = result.columns.join(" | ");
      const divider = result.columns.map(() => "---").join(" | ");
      const rows = result.values.map((row) => row.map((cell) => String(cell ?? "NULL")).join(" | "));
      return [header, divider, ...rows].join("\n");
    })
    .join("\n\n");
}

async function runPython(code: string) {
  const pyodide = await getPyodide();
  let stdout = "";
  let stderr = "";

  pyodide.setStdout({ batched: (message: string) => { stdout += `${message}\n`; } });
  pyodide.setStderr({ batched: (message: string) => { stderr += `${message}\n`; } });

  try {
    await pyodide.runPythonAsync(code);
    return stderr.trim() ? `Error:\n${stderr.trim()}` : stdout.trim() || "Program executed successfully (no output)";
  } catch (error: any) {
    return `Error:\n${stderr.trim() || error.message || "Python execution failed."}`;
  }
}

async function runSql(code: string) {
  const SQL = await getSqlJs();
  const db = new SQL.Database();

  try {
    const results = db.exec(code);
    return results.length > 0 ? formatSqlResults(results) : "SQL executed successfully (no output)";
  } catch (error: any) {
    return `Error:\n${error.message || "SQL execution failed."}`;
  } finally {
    db.close();
  }
}

async function runC(code: string) {
  try {
    const { Directory, Wasmer, clang } = await getClangRuntime();
    const project = new Directory();
    await project.writeFile("main.c", code);

    const compileProcess = await clang.entrypoint.run({
      args: ["/project/main.c", "-o", "/project/program.wasm"],
      mount: { "/project": project },
    });
    const compileResult = await compileProcess.wait();

    if (!compileResult.ok) {
      return `Compile Error:\n${(compileResult.stderr || compileResult.stdout || "Compilation failed.").trim()}`;
    }

    const wasmFile = await project.readFile("program.wasm");
    const program = await Wasmer.fromFile(wasmFile);
    const runtimeProcess = await program.entrypoint.run();
    const runtimeResult = await runtimeProcess.wait();

    if (!runtimeResult.ok && runtimeResult.stderr) {
      return `Runtime Error:\n${runtimeResult.stderr.trim()}`;
    }

    return `${runtimeResult.stdout || ""}${runtimeResult.stderr || ""}`.trim() || "Program executed successfully (no output)";
  } catch (error: any) {
    return `Error:\n${error.message || "C execution failed."}`;
  }
}

export async function runPlaygroundCode(language: string, code: string) {
  if (language === "python") return runPython(code);
  if (language === "sql") return runSql(code);
  if (language === "c") return runC(code);
  return "Unsupported language.";
}