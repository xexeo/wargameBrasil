import {simulate} from '../dist/simulator.js';
import {writeFile} from 'node:fs/promises';
import {saveRun,fingerprint} from './simulation-store.mjs';
import {summarizeMatches,analysis} from './simulation-statistics.mjs';
const initialSources=await fingerprint();

const args=process.argv.slice(2),value=(key,fallback)=>{const i=args.indexOf(key);return i<0?fallback:args[i+1];};
const count=Number(value('--games','500')),seed=Number(value('--seed','1')),strategy=value('--strategy','tactical'),stance=value('--stance','aggressive');
if(!['strong','weak','tactical'].includes(strategy)||!['aggressive','defensive'].includes(stance)||!Number.isInteger(seed)||!Number.isInteger(count)||count<1||count>100000)throw Error('Opções de simulação inválidas.');
if(value('--output',null))throw Error('Resultados agora são guardados automaticamente por versão. Use --name para nomear a execução.');
const games=Array.from({length:count},(_,i)=>{const{history,...result}=simulate({seed:seed+i,strategy,stance});return result;});
const report={generator:'Mulberry32',firstSeed:seed,lastSeed:seed+count-1,strategy,stance,...summarizeMatches(games)};
const dir=await saveRun(value('--name',`autojogo-${strategy}-${stance}-${seed}-${count}`),{'resultados.json':report,'dados-brutos.json':games,'analise.md':analysis(report,'Autojogo sem interface')},{expectedSources:initialSources,provenance:{seeds:[seed,seed+count-1],strategy,stance,count}});
console.log(JSON.stringify(report,null,2));console.log(`Análise e dados: ${dir}`);
const replay=value('--replay',null);if(replay)await writeFile(replay,JSON.stringify(simulate({seed,strategy,stance,record:true}),null,2)+'\n');
