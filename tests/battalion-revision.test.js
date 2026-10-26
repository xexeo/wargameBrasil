import{test}from'node:test';import assert from'node:assert/strict';
import{createGame,missionForecast,endTurn,objectives,move,movementExposure,advance,attack,operationResult,canCaptureObjective,distance,key,travelCostsTo}from'../dist/engine.js';
import{aiAction,takeAIAction,chooseTarget}from'../dist/ai.js';import{validGame,decodeTurn,encodeTurn}from'../dist/exchange.js';

test('projeção distingue pontos, ritmo e prazo sem prometer uma chegada segura',()=>{
 const s=createGame();let f=missionForecast(s);assert.equal(f.missing,8);assert.equal(f.remaining,10);assert.equal(f.income,0);assert.equal(f.roundsAtCurrentIncome,null);assert.equal(f.lastSummitOnlyRound,7);
 s.units=s.units.filter(u=>u.id!=='g1');Object.assign(s.units[0],objectives[0]);f=missionForecast(s);assert.equal(f.income,2);assert.equal(f.roundsAtCurrentIncome,4);assert.equal(f.earliestSummitRound,1);
 s.round=10;assert.equal(missionForecast(s).pointsPossible,false);s.score=6;assert.equal(missionForecast(s).pointsPossible,true);
});

test('destino exposto usa reação válida no percurso e respeita supressão',()=>{
 const s=createGame();s.units=s.units.filter(u=>['b1','g1'].includes(u.id));const[br,de]=s.units;Object.assign(br,{q:5,r:3});Object.assign(de,{q:5,r:2});
 const risk=movementExposure(s,br,4,3);assert.ok(risk.defenders.includes('g1'));const copy=structuredClone(s);advance(copy,'b1',4,3,()=>.999);assert.ok(copy.log.some(l=>l.includes('Fogo defensivo')));
 de.suppressed=true;assert.equal(movementExposure(s,br,4,3),null);de.suppressed=false;de.reactionSpent=true;assert.equal(movementExposure(s,br,4,3),null);
});

test('todos os modos progridem ao cume quando não existem inimigos, inclusive defensivos',()=>{
 for(const mode of['strong','weak','tactical']){const s=createGame();s.units=s.units.filter(u=>u.id==='b1');Object.assign(s.units[0],{q:3,r:3});const before=travelCostsTo(objectives[0],s.rules.ascentStepCost,3,!!s.rules.minimumStep).get(key(3,3));aiAction(s,'b1',mode,'defensive');const u=s.units[0];assert.ok(travelCostsTo(objectives[0],s.rules.ascentStepCost,3,!!s.rules.minimumStep).get(key(u.q,u.r))<before,mode);}
});

test('ocupante brasileiro e defensor tático não abandonam o cume para perseguir alvo',()=>{
 const br=createGame();br.units=br.units.filter(u=>u.id!=='g1');Object.assign(br.units[0],objectives[0]);aiAction(br,'b1','tactical','aggressive');assert.deepEqual({q:br.units[0].q,r:br.units[0].r},{q:5,r:1});
 const de=createGame();de.turn='de';const guard=de.units.find(u=>u.id==='g1');aiAction(de,'g1','tactical','defensive');assert.equal(guard.q,5);assert.equal(guard.r,1);
});

test('fim diferencia cume tardio, falta do cume e defesa eliminada sem alterar vencedor',()=>{
 const s=createGame();s.winner='de';s.finishedRound=10;s.units=s.units.filter(u=>u.side==='br');assert.match(operationResult(s).title,/Defesa eliminada/);
 Object.assign(s.units[0],objectives[0]);assert.match(operationResult(s).title,/Conquista tardia/);assert.equal(s.winner,'de');
});

test('regra de cume no prazo é opcional e só vale no fechamento final',()=>{
 for(const enabled of[false,true]){const s=createGame();s.rules.summitAtDeadlineWins=enabled;s.units=s.units.filter(u=>u.id!=='g1');Object.assign(s.units[0],objectives[0]);s.round=10;s.turn='de';endTurn(s);assert.equal(s.score,2);assert.equal(s.winner,enabled?'br':'de');if(enabled)assert.match(operationResult(s).title,/limite/);}
});

test('retirada experimental é legal, sem recuperar PV, compromete ativação e preserva intercâmbio',()=>{
 const s=createGame();s.rules.retreatOnLoss=true;const gun=s.units.find(u=>u.id==='b5'),target=s.units.find(u=>u.id==='g3');Object.assign(gun,{q:5,r:4});target.hp=2;const before={q:target.q,r:target.r};
 attack(s,gun.id,target.id,()=>0);assert.equal(target.hp,1);assert.ok(distance(target,gun)>distance(before,gun));assert.equal(target.reorganizing,true);assert.equal(validGame(s),true);assert.deepEqual(decodeTurn(encodeTurn(s)).units,s.units);endTurn(s);assert.equal(target.mp,0);assert.equal(target.fired,true);assert.equal(target.reorganizing,false);
});

test('retirada bloqueada não atravessa peças e perdas fatais continuam removendo a unidade',async()=>{
 const{neighbors,defenseBonus}=await import('../dist/engine.js');
 for(const fatal of[false,true]){const s=createGame();s.rules.retreatOnLoss=true;const gun=s.units.find(u=>u.id==='b5'),target=s.units.find(u=>u.id==='g3');Object.assign(gun,{q:4,r:4});target.hp=2;
 const others=s.units.filter(u=>u.id!==gun.id&&u.id!==target.id);neighbors(target.q,target.r).forEach(([q,r],i)=>Object.assign(others[i],{q,r}));s.units=[gun,target,...others.slice(0,6)];const before={q:target.q,r:target.r};gun.atk=fatal?12:target.def+defenseBonus(gun,target);
 attack(s,gun.id,target.id,()=>0);if(fatal)assert.equal(s.units.some(u=>u.id===target.id),false);else{assert.equal(target.hp,1);assert.deepEqual({q:target.q,r:target.r},before);assert.equal(target.reorganizing,undefined);}}
});

test('reação que provoca retirada interrompe assalto e a reorganização cobra a próxima ativação',()=>{
 const s=createGame();s.rules.retreatOnLoss=true;s.units=s.units.filter(u=>['b1','g1'].includes(u.id));const[br,de]=s.units;Object.assign(br,{q:5,r:3,hp:2});Object.assign(de,{q:5,r:2});
 const result=attack(s,br.id,de.id,()=>.999);assert.equal(result.interrupted,true);assert.equal(br.reorganizing,true);assert.equal(br.hp,1);
 endTurn(s);endTurn(s);assert.equal(br.mp,0);assert.equal(br.fired,true);endTurn(s);endTurn(s);assert.equal(br.mp,3);assert.equal(br.fired,false);
});


test('defesa tática divide interceptação da infantaria e contrabateria sem alterar IAs básicas',()=>{
 const s=createGame();s.units=s.units.filter(u=>['b1','b5','g2','g5'].includes(u.id));Object.assign(s.units.find(u=>u.id==='b1'),{q:3,r:5});Object.assign(s.units.find(u=>u.id==='b5'),{q:3,r:6});const foot=s.units.find(u=>u.id==='g2'),gun=s.units.find(u=>u.id==='g5');
 assert.equal(chooseTarget(s,foot,'tactical').id,'b1');assert.equal(chooseTarget(s,gun,'tactical').id,'b5');assert.equal(chooseTarget(s,foot,'strong').id,'b5');assert.equal(chooseTarget(s,foot,'weak').id,'b5');
});


test('instrução do motor e regra final preservam a exigência antiga em partidas salvas',async()=>{
 const{missionInstruction}=await import('../dist/engine.js');const current=createGame();assert.match(missionInstruction(current),/antecipar/);assert.match(missionInstruction(current),/cume basta/);
 delete current.rules.summitAtDeadlineWins;delete current.rules.retreatOnLoss;assert.doesNotMatch(missionInstruction(current),/cume basta/);current.units=current.units.filter(u=>u.id!=='g1');Object.assign(current.units[0],objectives[0]);current.round=10;current.turn='de';endTurn(current);assert.equal(current.winner,'de');assert.equal(validGame(current),true);
});

test('conquista sem meta de pontos no fechamento final tem grau custoso e eficiência limitada',async()=>{
 const{victoryAssessment}=await import('../dist/engine.js');const s=createGame();s.units=s.units.filter(u=>u.id!=='g1');Object.assign(s.units[0],objectives[0]);s.round=10;s.turn='de';endTurn(s);assert.equal(s.winner,'br');assert.equal(s.finishedRound,10);assert.equal(victoryAssessment(s).grade,'Vitória custosa');assert.equal(victoryAssessment(s).efficiency,44);assert.match(operationResult(s).title,/Vitória custosa/);
});
