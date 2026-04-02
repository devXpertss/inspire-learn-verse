/* AI-powered code execution via Groq API */

const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const systemPrompts: Record<string, string> = {
  python: "You are a Python terminal. The user will provide Python code. You must ONLY return the exact output of that code as if it ran in a real Python interpreter. Do not explain anything. If there is an error, return the error message exactly as Python would show it. Do not add any extra text, markdown, or formatting.",
  c: "You are a C compiler and executor (GCC). The user will provide C code. You must ONLY return the exact output of that compiled and executed code. Do not explain anything. If there is a compile error or runtime error, return the error message exactly as GCC would show it. Do not add any extra text, markdown, or formatting.",
  sql: "You are a SQLite terminal. The user will provide SQL queries. You must ONLY return the exact output of those queries as if they ran in a real SQLite database. Format table output with column headers and aligned rows. Do not explain anything. If there is an error, return the error message exactly as SQLite would show it. Do not add any extra text, markdown, or formatting.",
};

export async function runPlaygroundCode(language: string, code: string): Promise<string> {
  const systemContent = systemPrompts[language];
  if (!systemContent) return "Unsupported language.";

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: code },
        ],
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return `Error: API returned ${response.status}\n${errorText}`;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No output returned.";
  } catch (err: any) {
    return `Error: ${err.message || "Failed to execute code."}`;
  }
}
