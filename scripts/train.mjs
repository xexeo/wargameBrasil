import { emptyLearning, trainEpisode } from "../dist/learning.js";
import { writeFile } from "node:fs/promises";
const count = Number(process.argv[2] ?? 2000);
if (!Number.isInteger(count) || count < 1 || count > 100000)
  throw new Error("Quantidade de treino inválida.");
const table = emptyLearning(),
  wins = { br: 0, de: 0 };
const start = performance.now();
for (let i = 1; i <= count; i++) {
  const g = trainEpisode(table, 50000 + i, 0.3 - (0.2 * i) / count);
  wins[g.winner]++;
  if (i % 500 === 0) console.log(`Treino: ${i}/${count} partidas`);
}
await writeFile(
  "pretrained.ts",
  `import type {LearningTable} from './learning.js';\n// Treino reproduzível: sementes 50001 a ${50000 + count}.\nexport const pretrained:LearningTable=${JSON.stringify(table)};\n`,
);
const report = {
  generator: "Mulberry32",
  episodes: table.episodes,
  updates: table.updates,
  states: Object.keys(table.q).length,
  seeds: [50001, 50000 + count],
  trainingWins: wins,
  seconds: (performance.now() - start) / 1000,
  note: "Resultados durante exploração; não equivalem a avaliação independente.",
};
await writeFile(
  "docs/training-report.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(report);
