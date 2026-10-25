import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame,endTurn,objectives,objectivePointsPerRound,targetScore,attack,opportunityFire,effectiveAttackRange,victoryAssessment,advance,canAttack} from '../dist/engine.js';

test('três objetivos dão 4 por rodada; duas rodadas acumulam os 8 exigidos',()=>{
 const s=createGame();
 s.units=s.units.filter(u=>!['g1','g2','g3'].includes(u.id));
 objectives.forEach((o,i)=>Object.assign(s.units.find(u=>u.id===`b${i+1}`),o));
 assert.equal(objectivePointsPerRound(),4);assert.equal(targetScore(s),8);
 endTurn(s);assert.equal(s.score,0);
 endTurn(s);assert.equal(s.score,4);assert.equal(s.winner,null);
 endTurn(s);endTurn(s);assert.equal(s.score,8);assert.equal(s.winner,'br');assert.equal(s.finishedRound,2);
});

test('secundários acumulam pontos mas não substituem a tomada do cume',()=>{
 const s=createGame();s.score=8;s.turn='de';endTurn(s);assert.equal(s.winner,null);
});

const assault=()=>{const s=createGame();s.units=s.units.filter(u=>['b1','g1'].includes(u.id));Object.assign(s.units[0],{q:5,r:3,atk:1,def:3});Object.assign(s.units[1],{q:5,r:2,atk:3,def:6});return s;};

test('defensor elevado atira antes do assalto e não soma outro contra-ataque',()=>{
 const s=assault();let calls=0;const result=attack(s,'b1','g1',()=>{calls++;return calls===1?.999:0;});
 assert.equal(calls,2);assert.equal(result.counter,0);assert.equal(s.units[0].hp,2);assert.equal(s.units[1].reactionSpent,true);
 endTurn(s);assert.equal(s.units[1].mp,0);assert.equal(s.units[1].fired,true);
 endTurn(s);assert.equal(s.units[1].reactionSpent,false);
});

test('supressão impede reação e altura amplia só o tiro direto',()=>{
 const s=assault(),[br,de]=s.units;de.suppressed=true;
 assert.equal(opportunityFire(s,br.id,()=>.999),false);
 assert.equal(effectiveAttackRange(de,br),2);
 de.indirect=true;assert.equal(effectiveAttackRange(de,br),1);
});

test('grau de vitória penaliza demora e perdas sem alterar o vencedor',()=>{
 const early=createGame();early.winner='br';early.finishedRound=2;early.score=8;
 const late=structuredClone(early);late.finishedRound=9;late.units=late.units.filter(u=>u.id!=='b3');late.units[0].hp=1;
 assert.ok(victoryAssessment(early).efficiency>victoryAssessment(late).efficiency);
 assert.equal(late.winner,'br');
});


test('avanço resolve reação no caminho uma vez e uma baixa interrompe a rota',()=>{
 const s=assault();assert.equal(advance(s,'b1',4,3,()=>.999),true);assert.equal(s.units.find(u=>u.id==='b1').hp,2);
 assert.equal(opportunityFire(s,'b1',()=>.999),false);
 const doomed=assault();doomed.units[0].hp=1;assert.equal(advance(doomed,'b1',4,3,()=>.999),true);
 assert.equal(doomed.units.some(u=>u.id==='b1'),false);assert.equal(doomed.winner,'de');
});

test('grupo FEB consegue apoiar aproximação inicial com alcance abstrato cinco',()=>{
 const s=createGame(),gun=s.units.find(u=>u.id==='b5'),target=s.units.find(u=>u.id==='g2');
 assert.equal(gun.range,5);assert.equal(canAttack(gun,target),true);
 assert.equal(s.units.find(u=>u.id==='g5').range,5);
});
