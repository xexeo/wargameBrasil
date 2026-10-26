import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from '../dist/engine.js';
import {learningState,policies} from '../dist/learning.js';
import {fixedModels} from '../dist/fixed-models.js';
import {chooseFixedPolicy,choosePolicyFromFixedModel} from '../dist/fixed-learning.js';
import {fixedTrainingConfig,trainFixedSide} from '../dist/fixed-training.js';

test('fixed models are trained separately with frozen documented parameters and six balanced opponents',()=>{
 for(const side of ['br','de']){
  const model=fixedModels[side];
  assert.equal(model.side,side);assert.equal(model.episodes,2400);assert.ok(model.updates>=model.episodes);
  assert.deepEqual(model.seeds,[fixedTrainingConfig.firstSeed[side],fixedTrainingConfig.firstSeed[side]+2399]);
  assert.deepEqual(model.parameters,{alpha:.18,gamma:.9,epsilonTraining:.2,epsilonInference:0,hpReward:.6,scoreReward:.7,controlReward:.4,terminalReward:12});
  assert.deepEqual(model.opponents,policies);assert.deepEqual(model.policyKeys,policies);
  assert.ok(Object.keys(model.q).length>0);assert.ok(Object.keys(model.q).every(state=>state.startsWith(side+':')));
  assert.ok(Object.isFrozen(model));assert.ok(Object.isFrozen(model.q));assert.ok(Object.isFrozen(model.parameters));assert.ok(Object.values(model.q).every(Object.isFrozen));
  assert.ok(Object.values(model.q).every(row=>row.length===6&&row.every(Number.isFinite)));
 }
 assert.notEqual(fixedModels.br.q,fixedModels.de.q);
 assert.ok(fixedModels.br.seeds[1]<fixedModels.de.seeds[0]);
 assert.ok(fixedModels.de.seeds[1]<fixedTrainingConfig.evaluationFirstSeed);
});

test('fixed inference is deterministic, calls no RNG and changes neither game nor weights even for an unseen state',()=>{
 const game=createGame(),beforeGame=JSON.stringify(game),beforeModels=JSON.stringify(fixedModels),originalRandom=Math.random;
 try{
  Math.random=()=>{throw Error('Frozen inference must not explore.');};
  for(const side of ['br','de']){
   const first=chooseFixedPolicy(game,side);
   for(let index=0;index<20;index++)assert.deepEqual(chooseFixedPolicy(game,side),first);
   const unseen={...fixedModels[side],q:{}};
   const [strategy,stance]=unseen.fallbackPolicy.split('/');
   assert.deepEqual(choosePolicyFromFixedModel(game,unseen),{strategy,stance});assert.deepEqual(unseen.q,{});
  }
 }finally{Math.random=originalRandom;}
 assert.equal(JSON.stringify(game),beforeGame);assert.equal(JSON.stringify(fixedModels),beforeModels);
 const row=Object.values(fixedModels.br.q)[0];assert.throws(()=>{row[0]=999;},TypeError);
});

test('fixed inference reads the requested side state and uses a stable first-policy tie break',()=>{
 const game=createGame(),brState=learningState(game,'br'),deState=learningState(game,'de');
 const q={[brState]:[7,7,0,0,0,0],[deState]:[0,0,0,9,0,0]};
 assert.deepEqual(choosePolicyFromFixedModel(game,{...fixedModels.br,q}),{strategy:'strong',stance:'aggressive'});
 assert.deepEqual(choosePolicyFromFixedModel(game,{...fixedModels.de,q}),{strategy:'weak',stance:'defensive'});
 for(const side of ['br','de'])assert.deepEqual(chooseFixedPolicy(game,side),choosePolicyFromFixedModel(game,fixedModels[side]));
});

test('small fixed-side training is reproducible and never shares or modifies shipped tables',()=>{
 const snapshot=JSON.stringify(fixedModels),first=trainFixedSide('br',6,101),repeat=trainFixedSide('br',6,101),german=trainFixedSide('de',6,201);
 assert.deepEqual(first,repeat);assert.equal(first.model.episodes,6);assert.equal(german.model.episodes,6);
 assert.deepEqual(first.games.map(game=>game.opponent),policies);assert.deepEqual(german.games.map(game=>game.opponent),policies);
 assert.ok(Object.keys(first.model.q).every(state=>state.startsWith('br:')));assert.ok(Object.keys(german.model.q).every(state=>state.startsWith('de:')));
 assert.notEqual(first.model.q,german.model.q);assert.equal(JSON.stringify(fixedModels),snapshot);
});
