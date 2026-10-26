import {defaultRules} from '../dist/scenario.js';
import {saveRun,fingerprint} from './simulation-store.mjs';
// Browser policies, mirrored to let either side be evaluated; never modifies gameplay.
import { createGame, endTurn, canCaptureObjective, summitOccupied, victoryAssessment } from '../dist/engine.js';
import { activationOrder, takeAIAction } from '../dist/ai.js';
import { seededRandom, simulate } from '../dist/simulator.js';
import { beginLearningTurn, finishLearningEpisode, policies } from '../dist/learning.js';
import { chooseFixedPolicy } from '../dist/fixed-learning.js';
import { pretrained } from '../dist/pretrained.js';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const initialSources=await fingerprint();

const profiles=[
 {id:'CA',name:'Caçador agressivo',strategy:'strong',stance:'aggressive'},
 {id:'CD',name:'Caçador defensivo',strategy:'strong',stance:'defensive'},
 {id:'OA',name:'Oportunista agressivo',strategy:'weak',stance:'aggressive'},
 {id:'OD',name:'Oportunista defensivo',strategy:'weak',stance:'defensive'},
 {id:'EA',name:'Estado-maior agressivo',strategy:'tactical',stance:'aggressive'},
 {id:'ED',name:'Estado-maior defensivo',strategy:'tactical',stance:'defensive'},
 {id:'AP',name:'Aprendiz simples · memória inicial vazia',kind:'bandit'},
 {id:'FX',name:'Aprendiz fixo · modelo próprio de cada lado',kind:'fixed'},
 {id:'VE',name:'Veterana · tabela distribuída + aprendizado na partida',kind:'trained'},
];
const ownHP=(g,side)=>g.units.reduce((n,u)=>n+(u.side===side?u.hp:-u.hp),0);
function controller(profile,seed){return{profile,rng:seededRandom(seed),memory:{q:{},visits:{}},table:profile.kind==='trained'?structuredClone(pretrained):null,context:{},policy:null};}
// Same 20% exploration, random-sort tie break and update as app.ts. For FEB,
// HP and score rewards are mirrored; the browser supports AI on either side.
function banditUpdate(c,reward,terminal=false){if(!c.policy)return;const m=c.memory,prev=Number(m.q[c.policy])||0;m.q[c.policy]=prev+.2*(reward+(terminal?0:.85*Math.max(0,...Object.values(m.q).filter(Number.isFinite)))-prev);m.visits[c.policy]=(m.visits[c.policy]||0)+1;}
function choose(c,g,side){if(!c.profile.kind)return c.profile;
 if(c.profile.kind==='fixed')return chooseFixedPolicy(g,side);
 if(c.profile.kind==='trained')return beginLearningTurn(c.table,c.context,g,side,c.rng,.08);
 const m=c.memory;c.policy=c.rng()<.2?policies[Math.floor(c.rng()*policies.length)]:[...policies].sort((a,b)=>(Number(m.q[b])||0)-(Number(m.q[a])||0)||c.rng()-.5)[0];
 const[strategy,stance]=c.policy.split('/');return{strategy,stance};}
function match(br,de,seed){
 const game=createGame(rules),dice=seededRandom(seed),controls={br:controller(br,seed^0x51f15e),de:controller(de,seed^0x6d2b79f5)};
 const metrics={attacks:0,uphillAttacks:0,policyTurns:{br:{},de:{}},firstSummitRound:null,firstCaptureRound:null};let turns=0;
 while(!game.winner){assert.ok(++turns<=22,'Partida excedeu limite');const side=game.turn,c=controls[side],policy=choose(c,game,side),before=ownHP(game,side),oldScore=game.score;
  const k=`${policy.strategy}/${policy.stance}`;metrics.policyTurns[side][k]=(metrics.policyTurns[side][k]||0)+1;
  for(const id of activationOrder(game,side)){const result=takeAIAction(game,id,policy.strategy,policy.stance,dice);if(result?.attack){metrics.attacks++;if(result.uphill)metrics.uphillAttacks++;}if(summitOccupied(game)&&metrics.firstCaptureRound===null)metrics.firstCaptureRound=game.round;if(game.winner)break;}
  if(!game.winner)endTurn(game);
  if(game.summitSecured&&metrics.firstSummitRound===null)metrics.firstSummitRound=game.finishedRound??(game.turn==='br'?game.round-1:game.round);
  if(c.profile.kind==='bandit'&&!game.winner)banditUpdate(c,ownHP(game,side)-before+(side==='br'?1:-1)*(game.score-oldScore));
 }
 for(const side of['br','de']){const c=controls[side];if(c.profile.kind==='trained')finishLearningEpisode(c.table,c.context,game);if(c.profile.kind==='bandit')banditUpdate(c,game.winner===side?8:-8,true);}
 const losses={};for(const side of['br','de']){const units=game.units.filter(u=>u.side===side);losses[side]={units:5-units.length,cohesion:15-units.reduce((n,u)=>n+u.hp,0)};}
 return{seed,winner:game.winner,round:game.finishedRound,score:game.score,reason:game.victoryReason==='elimination'?'elimination':game.winner==='br'?(game.score>=(game.rules?.targetScore??8)?'mission':'lateSummit'):game.units.some(u=>u.side==='br'&&canCaptureObjective(u))?'deadline':'noManeuverInfantry',summit:summitOccupied(game),losses,grade:victoryAssessment(game).grade,...metrics};
}
function wilson(w,n){const p=w/n,z=1.96,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return[c-h,c+h];}
const count=Number(process.argv[2]??10),firstSeed=Number(process.argv[3]??200001);
const rules={...defaultRules,retreatOnLoss:process.argv.includes('--no-retreat')?false:process.argv.includes('--retreat')?true:!!defaultRules.retreatOnLoss,summitAtDeadlineWins:process.argv.includes('--strict-points')?false:process.argv.includes('--deadline-summit')?true:!!defaultRules.summitAtDeadlineWins};
const runName='matriz-ias'+(rules.retreatOnLoss!==!!defaultRules.retreatOnLoss?'-sem-retirada':'')+(rules.summitAtDeadlineWins!==!!defaultRules.summitAtDeadlineWins?'-pontos-obrigatorios':'');
if(!Number.isInteger(count)||count<1||count>1000||!Number.isInteger(firstSeed))throw Error('Use: node scripts/round-robin.mjs [partidas por dupla: 1–1000] [primeira semente]');
// Meaningful integration check: the fixed-policy runner must match the canonical
// simulator on the same random stream, including win, score and final round.
for(const profile of profiles.filter(p=>!p.kind))for(let i=0;i<3;i++){const seed=firstSeed+i,a=match(profile,profile,seed),b=simulate({seed,strategy:profile.strategy,stance:profile.stance,rules});assert.equal(a.winner,b.winner);assert.equal(a.score,b.score);assert.equal(a.round,b.round);}
const cells=[];for(const br of profiles)for(const de of profiles){const games=Array.from({length:count},(_,i)=>match(br,de,firstSeed+i)),wins=games.filter(g=>g.winner==='br').length;
 const mean=fn=>games.reduce((n,g)=>n+fn(g),0)/games.length;
 cells.push({br:br.id,de:de.id,count,wins:{br:wins,de:count-wins},brRate:wins/count,interval95:wilson(wins,count),meanRound:mean(g=>g.round),meanScore:mean(g=>g.score),meanLosses:{br:{units:mean(g=>g.losses.br.units),cohesion:mean(g=>g.losses.br.cohesion)},de:{units:mean(g=>g.losses.de.units),cohesion:mean(g=>g.losses.de.cohesion)}},reasons:Object.fromEntries(['elimination','mission','lateSummit','deadline','noManeuverInfantry'].map(r=>[r,games.filter(g=>g.reason===r).length])),games});
 console.log(`${br.id} × ${de.id}: FEB ${wins}/${count}`);
}
const hashes={};for(const f of['engine.ts','ai.ts','learning.ts','app.ts','troops.ts','scenario.ts','pretrained.ts','geography-data.ts'])hashes[f]=createHash('sha256').update(await readFile(f)).digest('hex');
const report={rules,createdAt:new Date().toISOString(),gameVersion:JSON.parse(await readFile('version.json','utf8')).version,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceHashes:hashes,generator:'Mulberry32',countPerPair:count,totalGames:cells.length*count,seeds:[firstSeed,firstSeed+count-1],policyRandomness:'Separate deterministic stream per controller and side; combat RNG shared stream per match.',memory:'Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.',profiles,cells};
const folder=await saveRun(runName,{'dados-brutos.json':report,'analise.md':`# Matriz de IAs\n\n${report.totalGames} partidas, ${count} por dupla. Execute node scripts/report-round-robin.mjs para a análise detalhada.\n`},{expectedSources:initialSources,provenance:{sourceCommit:report.sourceCommit,seeds:report.seeds,count:report.totalGames}});
console.log(`Resultados salvos em ${folder}`);
console.log(`Concluído: ${report.totalGames} partidas; invariantes do simulador verificadas para os seis perfis fixos.`);
