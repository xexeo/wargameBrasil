// Run only with --capture on the approved 0.9.3 commit to replace the reference.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {simulate} from '../dist/simulator.js';
import {createGame} from '../dist/engine.js';
const digest=value=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
export async function battalionReference(){
 const models={};for(const file of ['fixed-models.ts','pretrained.ts'])models[file]=digest(await readFile(new URL('../'+file,import.meta.url),'utf8'));
 const games=[];
 for(const strategy of ['strong','weak','tactical'])for(const stance of ['aggressive','defensive'])for(let seed=4201;seed<=4220;seed++){
  const result=simulate({seed,strategy,stance,record:true});
  games.push({seed,strategy,stance,digest:digest(result),winner:result.winner,round:result.round,score:result.score});
 }
 return {models,initialState:digest(createGame()),games};
}
export const fixture=new URL('../tests/fixtures/battalion-0.9.3.json',import.meta.url);
if(process.argv[1]===new URL(import.meta.url).pathname&&process.argv.includes('--capture')){
 const baseline='45293642c438f9078c607a57869b2291223401ff';
 assert.equal(execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),baseline,'Capture only the approved baseline, never a later implementation.');
 for(const file of ['engine.ts','ai.ts','scenario.ts','troops.ts','geography.ts','geography-data.ts','learning.ts','fixed-learning.ts','fixed-models.ts','pretrained.ts','simulator.ts'])assert.equal(await readFile(file,'utf8'),execFileSync('git',['show',`${baseline}:${file}`],{encoding:'utf8'}));
 await writeFile(fixture,JSON.stringify({schema:1,baseline,generator:'SHA-256 of JSON-serialized complete MatchResult, including every recorded state and log',...await battalionReference()},null,2)+'\n');
 console.log('Captured 120 full battalion histories and the original models.');
}
