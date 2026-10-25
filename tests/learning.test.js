import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emptyLearning,trainEpisode,validLearning,learningState} from '../dist/learning.js';
import {createGame} from '../dist/engine.js';
test('IA especial aprende nos dois papéis e treinamento é reproduzível',()=>{const a=emptyLearning(),b=emptyLearning();for(let i=1;i<=20;i++){trainEpisode(a,i);trainEpisode(b,i);}assert.deepEqual(a,b);assert.equal(a.episodes,20);assert.ok(a.updates>20);assert.ok(Object.keys(a.q).some(k=>k.startsWith('br:')));assert.ok(Object.keys(a.q).some(k=>k.startsWith('de:')));assert.ok(Object.values(a.q).flat().some(v=>v!==0));assert.ok(validLearning(a));});
test('memórias inválidas são rejeitadas e estado distingue os lados',()=>{assert.equal(validLearning({schema:1,episodes:1,updates:1,q:{bad:[NaN]}}),false);assert.notEqual(learningState(createGame(),'br'),learningState(createGame(),'de'));});
