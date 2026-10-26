import {createGame,endTurn,summitOccupied,battleLosses} from '../dist/engine.js';
import {activationOrder,takeAIAction} from '../dist/ai.js';
import {policies} from '../dist/learning.js';
import {seededRandom} from '../dist/simulator.js';
import {fingerprint,saveRun} from './simulation-store.mjs';
import {writeFile,readFile} from 'node:fs/promises';
const sources=await fingerprint(),count=Number(process.argv[2]??10),seedStart=Number(process.argv[3]??2200001);
const baselineRules={freeFireOrder:true,retreatOnLoss:true,summitAtDeadlineWins:true,roundLimit:10,targetScore:8,requireSummit:true,opportunityFire:true,highGroundRange:true,rangeHeightThreshold:90,ascentStepCost:1,fortificationStrength:1};
const baseline={b1:[3,3,1],b2:[3,3,1],b3:[3,3,1],b4:[3,2,2],b5:[5,1,5],g1:[3,3,1],g2:[3,3,1],g3:[3,3,1],g4:[2,2,1],g5:[4,1,5]};
const candidates=[
 {id:'base'}, {id:'subida-2',ascent:2}, {id:'alcance-infantaria-2',infRange:2}, {id:'fogos-alemaes-6',artyRange:6},
 {id:'posicoes-protegidas',fortDefense:1}, {id:'subida-e-infantaria',ascent:2,infRange:2},
 {id:'subida-e-artilharia',ascent:2,artyRange:6}, {id:'subida-e-protecao',ascent:2,fortDefense:1},
 {id:'alcances',infRange:2,artyRange:6}, {id:'subida-e-alcances',ascent:2,infRange:2,artyRange:6},
 {id:'objetivos-estritos',target:10,strict:true}, {id:'prazo-8-experimento',rounds:8},
 {id:'subida-protecao-fogos',ascent:2,fortDefense:1,artyRange:6}
];
const selected=process.env.STUDY_CANDIDATES?.split(',');const rows=[];
for(const candidate of candidates.filter(c=>!selected||selected.includes(c.id))){
 const games=[];
 for(const br of policies)for(const de of policies)for(let index=0;index<count;index++){
  const seed=seedStart+index,dice=seededRandom(seed),game=createGame({...baselineRules,ascentStepCost:candidate.ascent??1,fortificationStrength:1+(candidate.fortDefense??0),roundLimit:candidate.rounds??10,targetScore:candidate.target??8,summitAtDeadlineWins:!candidate.strict});
  for(const unit of game.units){[unit.atk,unit.def,unit.range]=baseline[unit.id];if(['g1','g2','g3'].includes(unit.id)&&candidate.infRange)unit.range=candidate.infRange;if(unit.id==='g5'&&candidate.artyRange)unit.range=candidate.artyRange;}
  let firstSummit=null,turns=0;
  while(!game.winner){if(++turns>22)throw Error('Turn limit');const [strategy,stance]=(game.turn==='br'?br:de).split('/');for(const id of activationOrder(game,game.turn)){takeAIAction(game,id,strategy,stance,dice);if(firstSummit===null&&summitOccupied(game))firstSummit=game.round;if(game.winner)break;}if(!game.winner)endTurn(game);}
  games.push({seed,br,de,winner:game.winner,round:game.finishedRound,score:game.score,reason:game.victoryReason,firstSummit,summit:summitOccupied(game),losses:battleLosses(game)});
 }
 const wins=games.filter(g=>g.winner==='br').length,round=games.reduce((s,g)=>s+g.round,0)/games.length;
 rows.push({candidate,games,wins,total:games.length,rate:wins/games.length,meanRound:round,eliminations:games.filter(g=>g.reason==='elimination').length,summitArrivals:games.filter(g=>g.firstSummit!==null).length});console.log(candidate.id,`${wins}/${games.length}`,round.toFixed(2));
}
const report={protocol:'Six policies per side, all36ordered pairs, common combat seeds. Exploratory design parameters; no human difficulty inference. Baseline roster and rules frozen explicitly in the runner.',baselineRules,baseline,seedStart,countPerPair:count,sources,rows};
const output=process.env.STUDY_OUTPUT??'/tmp/monte-study-final.json';await writeFile(output,JSON.stringify(report,null,2));
if(process.argv.includes('--archive')){const lines=rows.map(r=>`| ${r.candidate.id} | ${r.wins}/${r.total} | ${(r.rate*100).toFixed(1)}% | ${r.meanRound.toFixed(2)} | ${r.eliminations} | ${r.summitArrivals} |`).join('\n');await saveRun('estudo-final-defesa',{'dados-brutos.json':report,'protocolo.mjs':await readFile('scripts/study-final.mjs','utf8'),'analise.md':`# Estudo final de defesa e subida\n\nMesmas políticas e sementes em todos os candidatos. Parâmetros são hipóteses de jogo, não medições históricas.\n\n| Candidato | Vitórias FEB | Taxa | Rodada média | Eliminações | Chegadas ao cume |\n| --- | --- | --- | --- | --- | --- |\n${lines}\n\nO candidato de8rodadas é apenas diagnóstico; não foi escolhido como alteração da cronologia histórica. Exigência de objetivos pode não afetar vitórias por eliminação. Resultados de políticas automáticas não medem a dificuldade humana.\n`},{expectedSources:sources,provenance:{countPerPair:count,seedStart}});}
