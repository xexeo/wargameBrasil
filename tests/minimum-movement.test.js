import {test}from'node:test';import assert from'node:assert/strict';
import{verifyAllMovement}from'../scripts/verify-movement.mjs';
import{createGame,advance,maximumMovement,elevation,neighbors,unitMovementCost}from'../dist/engine.js';import{defaultRules}from'../dist/scenario.js';
test('every profile, origin and destination obeys minimum movement, partial budgets and blocking',()=>{const{summary:s}=verifyAllMovement();assert.equal(s.profiles,29);assert.equal(s.origins,29*81);assert.equal(s.destinations,29*81*81);assert.ok(s.oneLevelClimbs>0);assert.ok(s.steepClimbs>0);assert.equal(s.longTermPairs,s.destinations);});
test('old saves without the new flag also receive the movement correction',()=>{
 const s=createGame();delete s.rules.minimumStep;const gun=s.units.find(u=>u.id==='g5');s.units=[gun];s.turn='de';let found;
 for(let q=0;q<9&&!found;q++)for(let r=0;r<9&&!found;r++)for(const[nq,nr]of neighbors(q,r))if(elevation(nq,nr)===elevation(q,r)+1){found={q,r,nq,nr};break;}
 Object.assign(gun,{q:found.q,r:found.r});assert.equal(unitMovementCost(s,gun,gun,{q:found.nq,r:found.nr}),maximumMovement(gun));assert.equal(advance(s,gun.id,found.nq,found.nr,()=>0),true);assert.equal(gun.mp,0);
});
