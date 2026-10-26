import assert from 'node:assert/strict';
import {fingerprint,saveRun} from './simulation-store.mjs';
import {createGame,endTurn,battleLosses} from '../dist/engine.js';
import {activationOrder,takeAIAction} from '../dist/ai.js';
import {policies} from '../dist/learning.js';
import {seededRandom} from '../dist/simulator.js';
import {fixedModels} from '../dist/fixed-models.js';
import {chooseFixedPolicy,policyFromKey} from '../dist/fixed-learning.js';
import {fixedTrainingConfig} from '../dist/fixed-training.js';

const initialSources=await fingerprint(),snapshot=JSON.stringify(fixedModels);
for(const side of ['br','de'])assert.equal(fixedModels[side].episodes,fixedTrainingConfig.episodesPerSide,'Train and rebuild the fixed models before evaluation.');
const count=fixedTrainingConfig.evaluationGamesPerOpponent;
const wilson=(wins,total)=>{const p=wins/total,z=1.96,d=1+z*z/total,c=(p+z*z/(2*total))/d,h=z*Math.sqrt(p*(1-p)/total+z*z/(4*total*total))/d;return [c-h,c+h];};
function match(br,de,seed){
 const game=createGame(),dice=seededRandom(seed),policyTurns={br:{},de:{}};let turns=0;
 while(!game.winner){
  assert.ok(++turns<=22,'Game exceeded turn limit');
  const side=game.turn,controller=side==='br'?br:de,policy=controller==='fixed'?chooseFixedPolicy(game,side):policyFromKey(controller),key=`${policy.strategy}/${policy.stance}`;
  policyTurns[side][key]=(policyTurns[side][key]??0)+1;
  for(const id of activationOrder(game,side)){takeAIAction(game,id,policy.strategy,policy.stance,dice);if(game.winner)break;}
  if(!game.winner)endTurn(game);
 }
 return {seed,controllers:{br,de},winner:game.winner,round:game.finishedRound??game.round,score:game.score,reason:game.victoryReason,losses:battleLosses(game),policyTurns,remainingUnits:game.units.map(({id,hp,q,r})=>({id,hp,q,r}))};
}
function summary(games,side){const wins=games.filter(game=>game.winner===side).length;return {side,count:games.length,wins,rate:wins/games.length,interval95:wilson(wins,games.length),meanRound:games.reduce((sum,game)=>sum+game.round,0)/games.length,meanScore:games.reduce((sum,game)=>sum+game.score,0)/games.length};}
const cells=[];
for(const [sideIndex,side] of ['br','de'].entries())for(const [policyIndex,opponent] of policies.entries()){
 const firstSeed=fixedTrainingConfig.evaluationFirstSeed+sideIndex*10000+policyIndex*1000;
 const games=Array.from({length:count},(_,index)=>match(side==='br'?'fixed':opponent,side==='de'?'fixed':opponent,firstSeed+index));
 cells.push({side,opponent,seeds:[firstSeed,firstSeed+count-1],...summary(games,side),games});
 console.log(`${side.toUpperCase()} fixed vs ${opponent}: ${cells.at(-1).wins}/${count}`);
}
const headFirstSeed=fixedTrainingConfig.evaluationFirstSeed+50000,headGames=Array.from({length:fixedTrainingConfig.evaluationHeadToHeadGames},(_,index)=>match('fixed','fixed',headFirstSeed+index));
const headToHead={seeds:[headFirstSeed,headFirstSeed+headGames.length-1],br:summary(headGames,'br'),de:summary(headGames,'de'),games:headGames};
assert.equal(JSON.stringify(fixedModels),snapshot,'Evaluation must not alter fixed weights.');
const overall=Object.fromEntries(['br','de'].map(side=>[side,summary(cells.filter(cell=>cell.side===side).flatMap(cell=>cell.games),side)]));
const report={protocol:'Held-out seeds outside both training intervals; deterministic greedy inference, no exploration, no updates. Each side faces all six fixed opposing policies; separate fixed-vs-fixed games.',config:fixedTrainingConfig,models:Object.fromEntries(Object.entries(fixedModels).map(([side,{q,...metadata}])=>[side,{...metadata,states:Object.keys(q).length}])),overall,cells,headToHead,totalGames:cells.length*count+headGames.length,note:'Side win rates reflect scenario asymmetry and this opponent portfolio. They do not establish the strongest AI or improvement over another learner.'};
const pct=value=>(value*100).toFixed(1)+'%',range=interval=>interval.map(pct).join('–');
const analysis=`# Avaliação independente das IAs fixas por lado\n\n${report.totalGames} partidas com sementes separadas do treino; epsilon de inferência zero, sem atualizar pesos. Cada modelo enfrenta seis combinações fixas de estratégia/postura.\n\n| Modelo | Adversário | Vitórias | Taxa | IC 95% de Wilson | Rodada média |\n| --- | --- | --- | --- | --- | --- |\n${cells.map(cell=>`| ${cell.side==='br'?'FEB':'Alemanha'} | ${cell.opponent} | ${cell.wins}/${cell.count} | ${pct(cell.rate)} | ${range(cell.interval95)} | ${cell.meanRound.toFixed(2)} |`).join('\n')}\n\nNo portfólio completo: FEB ${overall.br.wins}/${overall.br.count} (${pct(overall.br.rate)}); Alemanha ${overall.de.wins}/${overall.de.count} (${pct(overall.de.rate)}). São lados e adversários diferentes; comparar essas porcentagens diretamente não mede superioridade do modelo.\n\n## Confronto entre os dois modelos fixos\n\nFEB: ${headToHead.br.wins}/${headToHead.br.count} (${pct(headToHead.br.rate)}, IC 95% ${range(headToHead.br.interval95)}). Alemanha: ${headToHead.de.wins}/${headToHead.de.count}.\n\nAs taxas refletem o cenário assimétrico e este conjunto de adversários. Não demonstram que os modelos sejam os mais fortes ou melhores que a Veterana online. O relatório e os dados brutos registram parâmetros, sementes, escolhas e perdas por partida.\n`;
const directory=await saveRun('avaliacao-ias-fixas',{'dados-brutos.json':report,'resultados.json':{...report,cells:cells.map(({games,...cell})=>cell),headToHead:{...headToHead,games:undefined}},'analise.md':analysis},{expectedSources:initialSources,provenance:{heldOut:true,totalGames:report.totalGames,seeds:{portfolio:cells.map(cell=>cell.seeds),headToHead:headToHead.seeds}}});
console.log(`Fixed evaluation saved: ${directory}`);
