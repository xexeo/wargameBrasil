import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame,attack,advance,endTurn,movementRoute} from '../dist/engine.js';
import {activationOrder,takeAIAction} from '../dist/ai.js';
import {seededRandom} from '../dist/simulator.js';
const assault=()=>{const game=createGame();game.units=game.units.filter(u=>['b1','g1'].includes(u.id));Object.assign(game.units[0],{q:5,r:3,atk:1,def:3});Object.assign(game.units[1],{q:5,r:2,atk:3,def:6});return game;};

test('combat observers report real shot positions before withdrawal and elimination without persisting events',()=>{
 for(const fatal of [false,true]){
  const game=createGame(),gun=game.units.find(u=>u.id==='b5'),target=game.units.find(u=>u.id==='g3');
  Object.assign(gun,{q:5,r:4});target.hp=2;if(fatal)gun.atk=20;
  const impact={q:target.q,r:target.r},events=[];
  const result=attack(game,gun.id,target.id,()=>0,e=>events.push(e));
  assert.equal(events.length,1);assert.equal(events[0].kind,'attack');
  assert.deepEqual({q:events[0].to.q,r:events[0].to.r},impact);assert.equal(events[0].damage,result.damage);
  assert.equal(events[0].remainingHP,target.hp);assert.ok(Object.isFrozen(events[0]));assert.ok(Object.isFrozen(events[0].to));
  if(fatal)assert.equal(game.units.some(u=>u.id===target.id),false);else assert.notDeepEqual({q:target.q,r:target.r},impact);
  assert.equal(Object.hasOwn(game,'combatEvents'),false);assert.ok(!JSON.stringify(game).includes('remainingHP'));
 }
});

test('zero-loss shot and counterattack have separate events in actual order',()=>{
 const game=createGame();game.rules.opportunityFire=false;game.units=game.units.filter(u=>['b1','g1'].includes(u.id));
 const [br,de]=game.units;Object.assign(br,{q:3,r:5,atk:1});Object.assign(de,{q:3,r:4,def:6});
 const events=[];const result=attack(game,br.id,de.id,()=>0,e=>events.push(e));
 assert.deepEqual(events.map(e=>e.kind),['attack','counterattack']);assert.deepEqual(events.map(e=>e.damage),[0,1]);
 assert.equal(events[1].from.id,de.id);assert.equal(events[1].to.id,br.id);assert.equal(result.counter,1);
});

test('movement fire uses the intermediate hex and a fatal reaction stops subsequent attacks',()=>{
 const game=assault(),events=[];
 const route=movementRoute(game,game.units[0],3,4);assert.ok(route.length>1);
 assert.equal(advance(game,'b1',3,4,()=>.999,e=>events.push(e)),true);
 assert.equal(events.length,1);assert.equal(events[0].kind,'defensive-fire');
 assert.deepEqual({q:events[0].to.q,r:events[0].to.r},route[0]);
 const doomed=assault();doomed.units[0].hp=1;const fatal=[];attack(doomed,'b1','g1',()=>.999,e=>fatal.push(e));
 assert.deepEqual(fatal.map(e=>e.kind),['defensive-fire']);assert.equal(doomed.winner,'de');assert.equal(fatal[0].remainingHP,0);
});

test('observer collection and observer errors never change game state or random draws in seeded AI games',()=>{
 function play(seed,observe){const game=createGame(),random=seededRandom(seed);let draws=0,events=0;const dice=()=>{draws++;return random();};let turns=0;
  const observer=observe?()=>{events++;if(observe==='throw')throw Error('Presentation failure');}:undefined;
  while(!game.winner){assert.ok(++turns<=22);for(const id of activationOrder(game,game.turn)){takeAIAction(game,id,'tactical','defensive',dice,observer);if(game.winner)break;}if(!game.winner)endTurn(game);}
  return {game,draws,events};
 }
 for(const seed of [43,44,45,46,47,48]){
  const baseline=play(seed),collected=play(seed,true),failed=play(seed,'throw');
  assert.ok(collected.events>0);assert.equal(collected.draws,baseline.draws);assert.equal(failed.draws,baseline.draws);
  assert.deepEqual(collected.game,baseline.game);assert.deepEqual(failed.game,baseline.game);
 }
});
