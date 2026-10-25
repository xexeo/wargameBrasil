import {simulate} from '../dist/simulator.js';
import {saveRun} from './simulation-store.mjs';
import {summarizeMatches} from './simulation-statistics.mjs';
const results=[],raw=[];
for(const range of[5,8,12])for(const supportRange of[2,3]){
 const games=Array.from({length:250},(_,i)=>{const{history,...game}=simulate({seed:i+1,strategy:'tactical',stance:'aggressive',setup:g=>{for(const u of g.units){if(u.type==='artillery')u.range=range;if(u.id==='b4')u.range=supportRange;}}});return game;});
 const summary={range,supportRange,...summarizeMatches(games)};results.push(summary);raw.push({range,supportRange,games});console.log(range,supportRange,summary.brRate);
}
await saveRun('calibracao-artilharia',{'resultados.json':results,'dados-brutos.json':raw,'analise.md':'# Calibração de alcance\n\nSeis configurações, 250 partidas por configuração. Não misturar candidatos com as regras publicadas. Resultados agregados e dados por partida estão nesta pasta.\n'},{provenance:{count:1500,seeds:[1,250],candidates:true}});
