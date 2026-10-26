import assert from 'node:assert/strict';
import {pathToFileURL}from'node:url';
import {readFile}from'node:fs/promises';
import {createGame,neighbors,elevation,terrain,maximumMovement,reachable,movementRoute,advance,unitMovementCost,travelCostsTo}from'../dist/engine.js';
import {profilesForScale}from'../dist/troops.js';import{defaultRules}from'../dist/scenario.js';
import{saveRun,fingerprint}from'./simulation-store.mjs';
const cellKey=(q,r)=>`${q},${r}`;
// Independent bounded path enumeration from the declared rules, not a call to
// the production route finder. Every on-board origin and destination is checked.
function reference(origin,allowance,budget=allowance){
 const best=new Map([[cellKey(origin.q,origin.r),0]]),queue=[{...origin,cost:0}];
 while(queue.length){const from=queue.shift();for(const[q,r]of neighbors(from.q,from.r)){
  const rise=elevation(q,r)-elevation(from.q,from.r),nominal=(terrain(q,r)==='forest'?2:1)+2*Math.max(0,rise),step=rise<=1?Math.min(nominal,allowance):nominal,cost=from.cost+step,k=cellKey(q,r);
  if(cost<=budget&&cost<(best.get(k)??Infinity)){best.set(k,cost);queue.push({q,r,cost});}
 }}return best;
}
export function verifyAllMovement(){
 const data=[],summary={profiles:0,origins:0,destinations:0,directEdges:0,oneLevelClimbs:0,steepClimbs:0,partialBudgets:0,blockedEntries:0,longTermPairs:0},started=performance.now();
 for(const scale of ['battalion','company'])for(const profile of profilesForScale(scale)){
  summary.profiles++;const original=createGame({...defaultRules,scale,opportunityFire:false}),unit=original.units.find(u=>u.id===profile.id),allowance=maximumMovement(unit);
  for(let q=0;q<9;q++)for(let r=0;r<9;r++){
   summary.origins++;const game={...original,turn:unit.side,units:[{...unit,q,r,mp:allowance}],log:[]},actor=game.units[0],expected=reference({q,r},allowance),actual=reachable(game,actor),costs=[];
   for(let tq=0;tq<9;tq++)for(let tr=0;tr<9;tr++){
    summary.destinations++;const k=cellKey(tq,tr),same=q===tq&&r===tr,want=same?undefined:expected.get(k);assert.equal(actual.get(k),want,`${profile.id} ${q},${r} -> ${k}`);costs.push(want??-1);
    const route=movementRoute(game,actor,tq,tr),copy={...game,units:[{...actor}],log:[]};assert.equal(advance(copy,actor.id,tq,tr,()=>0),want!==undefined);
    if(want!==undefined){assert.ok(route.length);assert.equal(copy.units[0].mp,allowance-want);assert.deepEqual([copy.units[0].q,copy.units[0].r],[tq,tr]);assert.equal(route.reduce((sum,to,i)=>sum+unitMovementCost(game,actor,i?route[i-1]:actor,to),0),want);}
    else{assert.equal(route.length,0);assert.equal(copy.units[0].mp,allowance);}
   }
   for(const[nq,nr]of neighbors(q,r)){
    summary.directEdges++;const rise=elevation(nq,nr)-elevation(q,r),step=unitMovementCost(game,actor,actor,{q:nq,r:nr});
    if(rise<=1){assert.ok(actual.has(cellKey(nq,nr)),`${profile.id} trapped at ${q},${r}`);if(rise===1)summary.oneLevelClimbs++;}
    else{summary.steepClimbs++;assert.ok(step>allowance);assert.equal(actual.has(cellKey(nq,nr)),false);}
    for(let budget=0;budget<allowance;budget++){
     summary.partialBudgets++;const partial={...actor,mp:budget},wants=reference({q,r},allowance,budget);assert.equal(reachable({...game,units:[partial]},partial).get(cellKey(nq,nr)),wants.get(cellKey(nq,nr)));if(step===allowance)assert.equal(wants.has(cellKey(nq,nr)),false);
    }
    for(const side of ['br','de']){summary.blockedEntries++;const blocked={...game,units:[{...actor},{...actor,id:'blocker',side,q:nq,r:nr}]};assert.equal(advance(blocked,actor.id,nq,nr,()=>0),false);assert.equal(blocked.units[0].mp,allowance);}
   }
   // Long-term reach, with a renewed allowance each turn and no occupied hexes.
   const seen=new Set([cellKey(q,r)]),todo=[{q,r}];while(todo.length){const from=todo.shift();for(const[nq,nr]of neighbors(from.q,from.r)){const k=cellKey(nq,nr);if(!seen.has(k)&&unitMovementCost(game,actor,from,{q:nq,r:nr})<=allowance){seen.add(k);todo.push({q:nq,r:nr});}}}
   assert.equal(seen.size,81,`${profile.id} has isolated terrain from ${q},${r}`);summary.longTermPairs+=seen.size;
   // AI distance estimates must recognize every legal immediate destination.
   for(const[nq,nr]of neighbors(q,r)){const reverse=travelCostsTo({q:nq,r:nr},2,allowance,true);if(actual.has(cellKey(nq,nr)))assert.ok(reverse.get(cellKey(q,r))<=allowance);}
   data.push({scale,id:profile.id,q,r,allowance,costs,longTermReachable:seen.size});
  }
 }
 return{summary:{...summary,seconds:(performance.now()-started)/1000},destinationIndex:'index=q*9+r; -1 means unavailable this turn, including the origin',data};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const sources=await fingerprint(),report=verifyAllMovement(),s=report.summary;
 await saveRun('movimento-exaustivo',{'dados-brutos.json':report,'protocolo.mjs':await readFile('scripts/verify-movement.mjs','utf8'),'analise.md':`# Verificação exaustiva de movimento\n\n${s.profiles} perfis nas duas escalas, ${s.origins} origens e ${s.destinations} combinações origem/destino. ${s.directEdges} passagens adjacentes; ${s.oneLevelClimbs} subidas de um nível; ${s.steepClimbs} subidas de dois ou mais níveis bloqueadas. ${s.partialBudgets} verificações de PM parciais e ${s.blockedEntries} entradas ocupadas testadas.\n\nTodos os perfis conseguem entrar em qualquer vizinho livre de mesmo nível, descida ou subida de um nível com orçamento completo. Gastam o custo nominal ou todo o seu movimento máximo quando esse custo é maior. A redução não usa o saldo restante, evitando várias subidas gratuitas. Desníveis maiores mantêm custo integral. Rotas, custo cobrado, prévia e distâncias da IA foram comparados.\n\nEm todos os ${s.longTermPairs} pares de origem/destino também existe rota ao longo de vários turnos, ignorando ocupação e fogo. Não significa chegar a todos os lugares numa rodada. Falhas de movimento não gastam PM. Aliados e inimigos bloqueiam entrada. Os dados contêm uma matriz de custos por perfil/origem; o protocolo está copiado nesta pasta. Tempo da execução${s.seconds.toFixed(2)}s neste ambiente.\n`},{expectedSources:sources,provenance:{exhaustive:true,summary:s}});console.log(report.summary);
}
