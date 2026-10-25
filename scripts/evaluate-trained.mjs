import {saveRun,fingerprint} from './simulation-store.mjs';
import { pretrained } from "../dist/pretrained.js";
import { trainEpisode } from "../dist/learning.js";
import { writeFile } from "node:fs/promises";
const initialSources=await fingerprint();

const games=[];
const count = 300,
  wins = { br: 0, de: 0 };
for (let i = 1; i <= count; i++) {
  const copy = structuredClone(pretrained);
  const g = trainEpisode(copy, 90000 + i, 0);
  wins[g.winner]++;
  games.push({seed:90000+i,winner:g.winner,round:g.finishedRound??g.round,score:g.score,remainingUnits:g.units.map(u=>({id:u.id,hp:u.hp,q:u.q,r:u.r}))});
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
await saveRun('avaliacao-veterana',{'resultados.json':report,'dados-brutos.json':games,'analise.md':`# Avaliação da Veterana\n\n${count} partidas com sementes separadas do treino: ${wins.br} vitórias FEB e ${wins.de} alemãs. ${report.note}\n`},{expectedSources:initialSources,provenance:{count,seeds:report.seeds}});
console.log(report);
