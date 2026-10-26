import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {battalionReference,fixture} from '../scripts/battalion-reference.mjs';
test('battalion stays identical to approved 0.9.3 across 120 full histories and both model sources',async()=>{
 const baseline=JSON.parse(await readFile(fixture,'utf8'));
 assert.equal(baseline.baseline,'45293642c438f9078c607a57869b2291223401ff');
 const current=await battalionReference();
 assert.deepEqual(current.models,baseline.models,'Do not retrain or alter battalion models.');
 assert.equal(current.initialState,baseline.initialState,'Battalion setup or default rules changed.');
 assert.deepEqual(current.games,baseline.games,'A battalion trajectory changed; inspect states before proceeding.');
});
