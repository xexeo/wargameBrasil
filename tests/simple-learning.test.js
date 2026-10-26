import test from 'node:test';
import assert from 'node:assert/strict';
import {chooseSimplePolicy,updateSimplePolicy} from '../dist/simple-learning.js';

test('simple learner isolates Brazilian and legacy German experience when choosing and updating',()=>{
 const memory={q:{'br:weak/defensive':3,'strong/aggressive':100},visits:{}};
 assert.equal(chooseSimplePolicy(memory,'br',()=>.5),'br:weak/defensive');
 assert.equal(chooseSimplePolicy(memory,'de',()=>.5),'strong/aggressive');
 updateSimplePolicy(memory,'br:weak/defensive',1);
 assert.ok(Math.abs(memory.q['br:weak/defensive']-3.11)<1e-10);
 assert.equal(memory.q['strong/aggressive'],100);
 assert.equal(memory.visits['br:weak/defensive'],1);
});

test('simple learner terminal credit excludes future rewards and inference leaves memories unchanged',()=>{
 const memory={q:{'weak/aggressive':2,'br:strong/aggressive':999},visits:{}};
 const before=structuredClone(memory);
 assert.equal(chooseSimplePolicy(memory,'de',()=>.5),'weak/aggressive');
 assert.deepEqual(memory,before);
 updateSimplePolicy(memory,'weak/aggressive',-8,true);
 assert.equal(memory.q['weak/aggressive'],0);
 assert.equal(memory.q['br:strong/aggressive'],999);
 assert.equal(updateSimplePolicy(memory,null,8,true),false);
});
