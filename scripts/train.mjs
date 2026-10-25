import {saveRun} from './simulation-store.mjs';
import { emptyLearning, trainEpisode } from "../dist/learning.js";
import { writeFile } from "node:fs/promises";
const count = Number(process.argv[2] ?? 2000);
if (!Number.isInteger(count) || count < 1 || count > 100000)
  throw new Error("Quantidade de treino inválida.");
const table = emptyLearning(),
  wins = { br: 0, de: 0 };
const start = performance.now(), games=[];
for (let i = 1; i <= count; i++) {
  const g = trainEpisode(table, 50000 + i, 0.3 - (0.2 * i) / count);
  wins[g.winner]++;
  games.push({seed:50000+i,winner:g.winner,round:g.finishedRound??g.round,score:g.score,remainingUnits:g.units.map(u=>({id:u.id,hp:u.hp,q:u.q,r:u.r}))});
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
await saveRun('treinamento',{'resultados.json':report,'dados-brutos.json':games,'tabela-aprendida.json':table,'analise.md':`# Treinamento da IA\n\n${report.episodes} partidas de treino, ${report.updates} atualizações. Não é avaliação independente. Resultados individuais e tabela aprendida estão nesta pasta.\n`},{provenance:{count,seeds:report.seeds,training:true}});
console.log(report);
