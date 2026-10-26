import {writeFile,readFile} from 'node:fs/promises';
import {fingerprint,saveRun} from './simulation-store.mjs';
import {createGame,endTurn,battleLosses} from '../dist/engine.js';
import {defaultRules} from '../dist/scenario.js';
import {activationOrder,takeAIAction} from '../dist/ai.js';
import {policies,emptyLearning,trainEpisode} from '../dist/learning.js';
import {trainFixedSide,fixedTrainingConfig} from '../dist/fixed-training.js';
import {seededRandom} from '../dist/simulator.js';
const initialSources=await fingerprint(),results={};
// One company-only training pass; battalion artifacts are preserved byte for byte.
for(const scale of ['company']){
 const fixed={},online={table:emptyLearning(),games:[]};if(scale==='company'){online.table.scale='company';online.table.companyRevision=2;}
 for(const side of ['br','de']){
  const seed=scale==='company'?(side==='br'?3300001:3310001):fixedTrainingConfig.firstSeed[side];
  fixed[side]=trainFixedSide(side,2400,seed,n=>{if(n%600===0)console.log(scale,side,n,'/2400');},scale);
 }
 for(let i=1;i<=2000;i++){
  const[strategy,stance]=policies[Math.floor(i/2)%policies.length].split('/');const opponent=i%7===0?undefined:{side:i%2===0?'br':'de',strategy,stance};
  const seed=(scale==='company'?3400000:50000)+i,game=trainEpisode(online.table,seed,.3-.2*i/2000,opponent,scale);
  online.games.push({seed,opponent:opponent??'self-play',winner:game.winner,round:game.finishedRound,score:game.score,reason:game.victoryReason,losses:battleLosses(game)});
 }
 results[scale]={fixed,online};
}
const freezeCode="function freeze<T>(value:T):T {if(value&&typeof value==='object'&&!Object.isFrozen(value)){for(const entry of Object.values(value))freeze(entry);Object.freeze(value);}return value;}\n";
for(const scale of ['company']){
 const r=results[scale],models={br:r.fixed.br.model,de:r.fixed.de.model},company=scale==='company';
 await writeFile(company?'company-models.ts':'fixed-models.ts',`import type {Side} from './engine.js';\nimport type {FixedModel} from './fixed-learning.js';\n${freezeCode}// Generated once per scale by scripts/train-companies.mjs.\nexport const ${company?'companyFixedModels':'fixedModels'}:Readonly<Record<Side,FixedModel>>=freeze(${JSON.stringify(models)});\n`);
 await writeFile(company?'company-pretrained.ts':'pretrained.ts',`import type {LearningTable} from './learning.js';\n// Generated once per scale by scripts/train-companies.mjs.\nexport const ${company?'companyPretrained':'pretrained'}:LearningTable=${JSON.stringify(r.online.table)};\n`);
}
const finalSources=await fingerprint(),expectedSources={...initialSources};
for(const file of ['company-models.ts','company-pretrained.ts'])expectedSources[file]=finalSources[file];
for(const file of ['fixed-models.ts','pretrained.ts'])if(finalSources[file]!==initialSources[file])throw Error('Battalion models changed.');
for(const scale of ['company']){
 const r=results[scale],models={br:r.fixed.br.model,de:r.fixed.de.model};
 await saveRun('treino-'+(scale==='company'?'companhias':'batalhoes'),{
  'fixos-dados-brutos.json':{br:r.fixed.br.games,de:r.fixed.de.games},'fixos-modelos.json':models,'online-dados-brutos.json':r.online.games,'online-modelo.json':r.online.table,
  'analise.md':`# Treino ${scale}\n\nUma passagem:2.400 jogos para cada modelo fixo (FEB/Alemanha),400 por política adversária, e2.000 para a Veterana online. Hiperparâmetros fixos alpha0,18/gamma0,9/epsilon0,20; inferência fixa epsilon0. As tabelas e os dados individuais contêm sementes. Não transferir pesos entre escalas. Resultados durante exploração não são avaliação independente.\n\nO estado da companhia usa prefixo próprio e coesão relativa normalizada pela força inicial; batalhão mantém as chaves legadas. Modelos fixos são congelados recursivamente; a Veterana tem sua própria cópia no navegador. Recompile e avalie após este treino.\n`
 },{expectedSources,provenance:{scale,episodesFixedPerSide:2400,episodesOnline:2000,training:true}});
}
console.log('Single training cycle complete. Rebuild before held-out evaluation.');
