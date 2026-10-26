import {writeFile,readFile} from 'node:fs/promises';
import {fingerprint,saveRun} from './simulation-store.mjs';
import {createGame,endTurn,battleLosses} from '../dist/engine.js';
import {defaultRules} from '../dist/scenario.js';
import {activationOrder,takeAIAction} from '../dist/ai.js';
import {policies,emptyLearning,trainEpisode} from '../dist/learning.js';
import {trainFixedSide,fixedTrainingConfig} from '../dist/fixed-training.js';
import {seededRandom} from '../dist/simulator.js';
const initialSources=await fingerprint(),results={};
// One predetermined study, then one training pass per scale. No search/retraining loop.
const study=[];
for(const config of [{id:'batalhoes',scale:'battalion'},{id:'companhias',scale:'company'},{id:'companhias-cobertura1',scale:'company',fortificationStrength:1},{id:'companhias-subida1',scale:'company',ascentStepCost:1}]){
 const games=[];
 for(const br of policies)for(const de of policies)for(let i=0;i<10;i++){
  const seed=3100001+i,game=createGame({...defaultRules,...config}),dice=seededRandom(seed);
  while(!game.winner){const[strategy,stance]=(game.turn==='br'?br:de).split('/');for(const id of activationOrder(game)){takeAIAction(game,id,strategy,stance,dice);if(game.winner)break;}if(!game.winner)endTurn(game);}
  games.push({seed,br,de,winner:game.winner,round:game.finishedRound,score:game.score,reason:game.victoryReason,losses:battleLosses(game)});
 }
 study.push({config,games,wins:games.filter(g=>g.winner==='br').length,total:games.length,meanRound:games.reduce((n,g)=>n+g.round,0)/games.length});console.log('Study',config.id,study.at(-1).wins,'/',games.length);
}
for(const scale of ['battalion','company']){
 const fixed={},online={table:emptyLearning(),games:[]};if(scale==='company')online.table.scale='company';
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
for(const scale of ['battalion','company']){
 const r=results[scale],models={br:r.fixed.br.model,de:r.fixed.de.model},company=scale==='company';
 await writeFile(company?'company-models.ts':'fixed-models.ts',`import type {Side} from './engine.js';\nimport type {FixedModel} from './fixed-learning.js';\n${freezeCode}// Generated once per scale by scripts/cycle-scales.mjs.\nexport const ${company?'companyFixedModels':'fixedModels'}:Readonly<Record<Side,FixedModel>>=freeze(${JSON.stringify(models)});\n`);
 await writeFile(company?'company-pretrained.ts':'pretrained.ts',`import type {LearningTable} from './learning.js';\n// Generated once per scale by scripts/cycle-scales.mjs.\nexport const ${company?'companyPretrained':'pretrained'}:LearningTable=${JSON.stringify(r.online.table)};\n`);
}
const finalSources=await fingerprint(),expectedSources={...initialSources};
for(const file of ['fixed-models.ts','pretrained.ts','company-models.ts','company-pretrained.ts'])expectedSources[file]=finalSources[file];
const pct=(w,n)=>(100*w/n).toFixed(1)+'%';
await saveRun('estudo-duas-escalas',{'dados-brutos.json':study,'protocolo.mjs':await readFile('scripts/cycle-scales.mjs','utf8'),'analise.md':`# Estudo único de duas escalas\n\n36 duplas ordenadas,10 jogos por dupla, mesmas sementes3100001–3100010 entre variantes. Dados correlacionados entre células/candidatos: agregados descritivos. Não é teste da dificuldade humana.\n\n| Candidato | Vitórias FEB | Taxa | Rodadas médias |\n| --- | --- | --- | --- |\n${study.map(r=>`| ${r.config.id} | ${r.wins}/${r.total} | ${pct(r.wins,r.total)} | ${r.meanRound.toFixed(2)} |`).join('\n')}\n\nEscolha: companhia mantém subida2 e cobertura2 compartilhadas com batalhão. A correção de deslocamento mínimo vale nas duas escalas: todo perfil alcança um vizinho livre subindo até um nível com seu orçamento completo. As variantes apenas medem sensibilidade dos parâmetros; não justificam mudar fatos históricos ou selecionar automaticamente a taxa mais próxima de50%. Não se adotou o resultado mais próximo de50% automaticamente. Um único ciclo, sem retreinos seletivos. Reserva de coesão adicional é controlada por uma companhia/batalhão por turno. Apoios ficam no mapa como no jogo original.\n`},{expectedSources,provenance:{seeds:[3100001,3100010],count:1440,selected:'companhias',trainingArtifactsOnlyChanged:true}});
for(const scale of ['battalion','company']){
 const r=results[scale],models={br:r.fixed.br.model,de:r.fixed.de.model};
 await saveRun('treino-'+(scale==='company'?'companhias':'batalhoes'),{
  'fixos-dados-brutos.json':{br:r.fixed.br.games,de:r.fixed.de.games},'fixos-modelos.json':models,'online-dados-brutos.json':r.online.games,'online-modelo.json':r.online.table,
  'analise.md':`# Treino ${scale}\n\nUma passagem:2.400 jogos para cada modelo fixo (FEB/Alemanha),400 por política adversária, e2.000 para a Veterana online. Hiperparâmetros fixos alpha0,18/gamma0,9/epsilon0,20; inferência fixa epsilon0. As tabelas e os dados individuais contêm sementes. Não transferir pesos entre escalas. Resultados durante exploração não são avaliação independente.\n\nO estado da companhia usa prefixo próprio e coesão relativa normalizada pela força inicial; batalhão mantém as chaves legadas. Modelos fixos são congelados recursivamente; a Veterana tem sua própria cópia no navegador. Recompile e avalie após este treino.\n`
 },{expectedSources,provenance:{scale,episodesFixedPerSide:2400,episodesOnline:2000,training:true}});
}
console.log('Single training cycle complete. Rebuild before held-out evaluation.');
