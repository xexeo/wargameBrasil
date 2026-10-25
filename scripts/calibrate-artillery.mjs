import{tournament}from'../dist/simulator.js';
import{writeFile}from'node:fs/promises';
const results=[];for(const range of[5,8,12])for(const supportRange of[2,3]){const r=tournament(250,1,{strategy:'tactical',stance:'aggressive',setup:g=>{for(const u of g.units){if(u.type==='artillery')u.range=range;if(u.id==='b4')u.range=supportRange;}}});results.push({range,supportRange,...r});console.log(range,supportRange,r.brRate);}await writeFile('docs/range-calibration.json',JSON.stringify(results,null,2));
