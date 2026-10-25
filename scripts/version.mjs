import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

// Derive from the last commit so a failed commit attempt does not skip numbers.
let previous = "0.1.0";
try {
  previous = JSON.parse(execFileSync("git", ["show", "HEAD:version.json"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })).version;
} catch {}
if (!/^0\.1\.\d+$/.test(previous)) throw new Error("Versão anterior inválida.");
const version = `0.1.${Number(previous.split(".")[2]) + 1}`;
const now = new Date();
const metadata = {
  version,
  builtAt: now.toISOString(),
  timezone: "America/Sao_Paulo",
  displayDate: new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "medium", hour12: false }).format(now),
};
await writeFile("version.json", JSON.stringify(metadata, null, 2) + "\n");
await writeFile("version.ts", `// Atualizado automaticamente a cada commit.\nexport const release = ${JSON.stringify(metadata, null, 2)} as const;\n`);
for (const file of ["package.json", "package-lock.json"]) {
  const data = JSON.parse(await readFile(file, "utf8"));
  data.version = version;
  if (data.packages?.[""]) data.packages[""].version = version;
  await writeFile(file, JSON.stringify(data, null, 2) + "\n");
}
let readme = await readFile("README.md", "utf8");
const line = `<!-- release:start -->\n**Versão ${version} · ${metadata.displayDate} (Brasília)**\n<!-- release:end -->`;
readme = readme.includes("<!-- release:start -->") ? readme.replace(/<!-- release:start -->[\s\S]*?<!-- release:end -->/, line) : readme.replace("# Monte Castelo Vibed", `# Monte Castelo Vibed\n\n${line}`);
await writeFile("README.md", readme);
console.log(`Versão ${version} · ${metadata.displayDate} (Brasília)`);
