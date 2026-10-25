import{test}from'node:test';import assert from'node:assert/strict';
import{createGame,advance,attack,canAttack,checkWinner,battleLosses,victoryAssessment,operationResult}from'../dist/engine.js';
import{validGame,encodeTurn,decodeTurn}from'../dist/exchange.js';import{takeAIAction}from'../dist/ai.js';

test('andar, atirar e continuar andando usa o mesmo orçamento e só um ataque',()=>{
 const s=createGame();s.rules.opportunityFire=false;const u=s.units.find(u=>u.id==='b1'),target=s.units.find(u=>u.id==='g2');Object.assign(target,{q:1,r:5});u.atk=12;
 assert.equal(advance(s,u.id,1,6,()=>0),true);assert.equal(u.mp,2);assert.ok(attack(s,u.id,target.id,()=>.99));assert.equal(u.mp,2);assert.equal(u.fired,true);assert.equal(advance(s,u.id,1,5,()=>0),true);assert.ok(u.mp>=0&&u.mp<2);
 const second=s.units.find(u=>u.id==='g3');Object.assign(second,{q:2,r:5});assert.equal(canAttack({...u,fired:false},second),true);assert.equal(attack(s,u.id,second.id,()=>.99),null);
});

test('atirar primeiro preserva movimento e legado continua encerrando movimento',()=>{
 for(const flag of[true,false,undefined]){const s=createGame();s.rules.freeFireOrder=flag;s.rules.opportunityFire=false;const u=s.units.find(u=>u.id==='b1'),target=s.units.find(u=>u.id==='g2');Object.assign(target,{q:1,r:6});u.atk=12;attack(s,u.id,target.id,()=>.99);assert.equal(u.mp,flag?3:0);if(flag)assert.equal(advance(s,u.id,1,6,()=>0),true);}
});

test('última peça alemã eliminada encerra imediatamente sem pontos ou cume',()=>{
 const s=createGame();s.rules.opportunityFire=false;s.units=s.units.filter(u=>['b1','g1'].includes(u.id));const[u,v]=s.units;Object.assign(u,{q:5,r:3,atk:12});Object.assign(v,{q:5,r:2,hp:1});attack(s,u.id,v.id,()=>.99);
 assert.equal(s.winner,'br');assert.equal(s.victoryReason,'elimination');assert.equal(s.score,0);assert.match(operationResult(s).title,/neutralização/);assert.ok(victoryAssessment(s).efficiency>44);assert.equal(advance(s,u.id,4,3),false);
});

test('última peça brasileira eliminada ou estado salvo sem alemães é detectado',()=>{
 const s=createGame();s.rules.opportunityFire=false;s.units=s.units.filter(u=>['b1','g1'].includes(u.id));const[br,de]=s.units;Object.assign(br,{q:5,r:3,hp:1});Object.assign(de,{q:5,r:2,atk:12});s.turn='de';attack(s,de.id,br.id,()=>.99);assert.equal(s.winner,'de');assert.equal(s.victoryReason,'elimination');
 const resumed=createGame();resumed.units=resumed.units.filter(u=>u.side==='br');assert.equal(checkWinner(resumed),'br');assert.equal(resumed.finishedRound,1);
});

test('IA pode disparar antes de reposicionar sem ganhar segundo disparo',()=>{
 const s=createGame();s.rules.opportunityFire=false;s.units=s.units.filter(u=>['b1','g1','g2'].includes(u.id));Object.assign(s.units[0],{q:3,r:4,atk:12});Object.assign(s.units.find(u=>u.id==='g2'),{q:3,r:3});const shot=takeAIAction(s,'b1','tactical','aggressive',()=>.99);assert.ok(shot.attack);assert.equal(s.units.find(u=>u.id==='b1').fired,true);assert.equal(s.log.filter(x=>x.includes(' → ')).length,1);
});

test('perdas são peças/coesão/recuos, sem conversão em pessoas e sem inventar recuos legados',()=>{
 const s=createGame();s.units=s.units.filter(u=>u.id!=='g4');s.units[0].hp=2;s.withdrawals={br:1,de:2};const losses=battleLosses(s);assert.equal(losses.br.lostCohesion,1);assert.equal(losses.de.removedUnits,1);assert.equal(losses.de.withdrawnUnits,2);assert.deepEqual(decodeTurn(encodeTurn(s)).withdrawals,s.withdrawals);delete s.withdrawals;assert.equal(battleLosses(s).br.withdrawnUnits,null);
 s.withdrawals={br:99,de:0};assert.equal(validGame(s),false);s.withdrawals={br:0,de:0};s.victoryReason='invalid';assert.equal(validGame(s),false);
});
