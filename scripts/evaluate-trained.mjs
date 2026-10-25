import { pretrained } from "../dist/pretrained.js";
import { trainEpisode } from "../dist/learning.js";
import { writeFile } from "node:fs/promises";
const count = 300,
  wins = { br: 0, de: 0 };
for (let i = 1; i <= count; i++) {
  const copy = structuredClone(pretrained);
  const g = trainEpisode(copy, 90000 + i, 0);
  wins[g.winner]++;
}
const report = {
  generator: "Mulberry32",
  count,
  seeds: [90001, 90000 + count],
  wins,
  brRate: wins.br / count,
  trainingEpisodes: pretrained.episodes,
  note: "Mesma IA especial nos dois lados. Cada partida começa com a mesma tabela pré-treinada e permite atualização online dentro da partida; sementes separadas do treino.",
};
await writeFile(
  "docs/trained-evaluation.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(report);
