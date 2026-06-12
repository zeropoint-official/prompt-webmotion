import fs from "node:fs";
import path from "node:path";

export function readPrompt(promptFile: string): string {
  const filePath = path.join(
    process.cwd(),
    "content",
    "prompts",
    `${promptFile}.txt`
  );
  return fs.readFileSync(filePath, "utf-8").trim();
}
