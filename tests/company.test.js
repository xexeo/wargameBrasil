import {test} from 'node:test';import assert from 'node:assert/strict';
import {createGame,advance,attack,endTurn,canCommand,reachable,battleLosses,victoryAssessment,opportunityFire,relativeCohesion}from'../dist/engine.js';
import{defaultRules}from'../dist/scenario.js';import{profilesForScale}from'../dist/troops.js';
import{encodeTurn,decodeTurn,validGame}from'../dist/exchange.js';import{simulate}from'../dist/simulator.js';import{learningState}from'../dist/learning.js';
const company=()=>createGame({...defaultRules,scale:'company'});
test('two scales share the map and old saves default to ten battalion counters',()=>{
 const old=createGame(),s=company();assert.equal(old.units.length,10);assert.equal(s.units.length,19);assert.equal(s.units.filter(u=>u.side==='br'&&u.canCapture).length,9);assert.equal(new Set(s.units.map(u=>`${u.q},${u.r}`)).size,19);assert.ok(validGame(s));assert.deepEqual(decodeTurn(encodeTurn(s)),{...s,log:s.log.slice(0,12)});assert.equal(relativeCohesion(s,'br'),15);assert.equal(relativeCohesion(s,'de'),15);assert.equal(profilesForScale('company').length,19);assert.notEqual(learningState(s,'br'),learningState(old,'br'));
});
test('companies have independent movement and attacks within the same battalion',()=>{
 const s=company(),a=s.units.find(u=>u.id==='c-b1a'),b=s.units.find(u=>u.id==='c-b1b');s.rules.opportunityFire=false;
 assert.equal(advance(s,a.id,-1,-1),false);assert.equal(advance(s,a.id,1,6),true);assert.equal(canCommand(s,b),true);assert.ok(reachable(s,b).size>0);assert.equal(advance(s,b.id,2,6),true);assert.equal(s.commanded,undefined);
 const copy=decodeTurn(encodeTurn(s));assert.equal(canCommand(copy,copy.units.find(u=>u.id===b.id)),true);
});
test('a company reaction commits only that unit, not its sister companies',()=>{
 const s=company();s.turn='de';s.rules.retreatOnLoss=false;const a=s.units.find(u=>u.id==='c-b1a'),b=s.units.find(u=>u.id==='c-b1b'),de=s.units.find(u=>u.id==='c-g1');
 Object.assign(a,{q:5,r:2,hp:1,atk:1});Object.assign(b,{q:1,r:7});Object.assign(de,{q:5,r:3,atk:12});assert.equal(opportunityFire(s,de.id,()=>0),true);attack(s,de.id,a.id,()=>.99);endTurn(s);assert.equal(canCommand(s,b),true);assert.ok(b.mp>0);
});
test('company fire is capped at one HP while battalion fire retains two',()=>{
 for(const scale of ['battalion','company']){const s=createGame({...defaultRules,scale,opportunityFire:false,retreatOnLoss:false});const a=s.units.find(u=>u.side==='br'&&u.type==='infantry'),b=s.units.find(u=>u.side==='de');a.atk=12;Object.assign(b,{q:a.q,r:a.r-1});assert.equal(attack(s,a.id,b.id,()=>.99).damage,scale==='company'?1:2);}
});
test('old company saves retain their original force denominator and now move independently',()=>{
 const s=createGame({...defaultRules,scale:'company',companyRevision:1});delete s.rules.companyRevision;s.commanded={'br-I':'c-b1a'};assert.equal(s.units.length,16);assert.equal(battleLosses(s).de.initialUnits,5);assert.equal(canCommand(s,s.units.find(u=>u.id==='c-b1b')),true);assert.ok(validGame(s));
});
test('losses and efficiency use each scale’s initial force, never negative battalion denominators',()=>{
 const s=company();assert.equal(battleLosses(s).br.initialUnits,11);assert.equal(battleLosses(s).br.initialCohesion,33);assert.equal(victoryAssessment(s).lostUnits,0);s.units=s.units.filter(u=>u.id!=='c-b1a');assert.equal(battleLosses(s).br.removedUnits,1);assert.equal(victoryAssessment(s).lostCohesion,3);s.commanded={'br-I':'c-b2a'};assert.equal(validGame(s),false);
});
test('all six company policies finish legally under the shared headless engine',()=>{
 for(const strategy of ['strong','weak','tactical'])for(const stance of ['aggressive','defensive']){const r=simulate({seed:4177,strategy,stance,scale:'company',record:true});assert.ok(r.round<=10);assert.ok(['br','de'].includes(r.winner));for(const state of r.history){assert.ok(validGame(state));assert.ok(state.units.every(u=>u.mp>=0));}}
});

test('fixed learners select independent frozen models for each scale and side',async()=>{
 const{modelsForGame,chooseFixedPolicy}=await import('../dist/fixed-learning.js');const battalion=modelsForGame(createGame()),companies=modelsForGame(company());assert.notEqual(battalion,companies);
 for(const side of ['br','de']){const model=companies[side];assert.equal(model.episodes,2400);assert.equal(model.side,side);assert.ok(Object.isFrozen(model));assert.ok(Object.values(model.q).every(Object.isFrozen));assert.ok(Object.keys(model.q).every(k=>k.startsWith(`company2:${side}:`)));const s=company(),before=JSON.stringify(model);assert.deepEqual(chooseFixedPolicy(s,side),chooseFixedPolicy(s,side));assert.equal(JSON.stringify(model),before);assert.notEqual(model.q,battalion[side].q);}
});
