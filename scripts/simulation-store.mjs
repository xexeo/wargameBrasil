import {readFile,writeFile,mkdir,readdir,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
export const simulationSources=['engine.ts','ai.ts','simulator.ts','learning.ts','geography.ts','geography-data.ts','troops.ts','scenario.ts','pretrained.ts','simple-learning.ts','scripts/round-robin.mjs','scripts/autoplay.mjs','scripts/train.mjs','scripts/evaluate-trained.mjs','scripts/calibrate-artillery.mjs','scripts/simulation-statistics.mjs','scripts/study-battalion-rules.mjs','fixed-learning.ts','fixed-training.ts','fixed-models.ts','scripts/train-fixed.mjs','scripts/evaluate-fixed.mjs'];
const versionPattern=/^0\.(?:1|9)\.\d+$/;
const newestFirst=(a,b)=>{const x=a.version.split(".").map(Number),y=b.version.split(".").map(Number);for(let i=0;i<3;i++)if(x[i]!==y[i])return y[i]-x[i];return 0;};
export async function fingerprint(project=process.cwd()){
 const hashes={};for(const file of simulationSources)hashes[file]=createHash('sha256').update(await readFile(join(project,file))).digest('hex');return hashes;
}
export async function saveRun(name,files,{version,project=process.cwd(),provenance={},expectedSources}={}){
 if(!/^[a-z0-9-]+$/.test(name))throw Error('Nome de simulação inválido.');
 version??=JSON.parse(await readFile(join(project,'version.json'),'utf8')).version;
 if(!versionPattern.test(version))throw Error('Versão inválida.');
 const now=await fingerprint(project);
 if(expectedSources&&Object.keys(now).some(f=>expectedSources[f]!==now[f]))throw Error('Programa mudou durante a simulação; resultados não foram arquivados. Execute novamente.');
 await checkSimulations({project,prune:true});
 const dir=join(project,'docs/simulacoes',version),sources=await fingerprint(project);
 await mkdir(dir,{recursive:true});
 let manifest={schema:1,version,sources,runs:{}};
 try{manifest=JSON.parse(await readFile(join(dir,'manifesto.json'),'utf8'));}catch{}
 const run=join(dir,name);await mkdir(run,{recursive:true});
 for(const[file,value]of Object.entries(files)){if(!/^[a-z0-9.-]+$/.test(file))throw Error('Arquivo inválido.');await writeFile(join(run,file),typeof value==='string'?value:JSON.stringify(value,null,2)+'\n');}
 manifest.runs[name]={...provenance,files:Object.keys(files)};
 await writeFile(join(dir,'manifesto.json'),JSON.stringify(manifest,null,2)+'\n');
 await checkSimulations({project,prune:true});return run;
}
export async function latestRun(name,project=process.cwd()){
 const {valid}=await checkSimulations({project,prune:true});
 const found=valid.filter(v=>v.runs.includes(name)).sort(newestFirst)[0];
 if(!found)throw Error(`Não há simulação válida de ${name}. Execute o simulador novamente.`);
 return join(project,'docs/simulacoes',found.version,name);
}
export async function checkSimulations({project=process.cwd(),prune=false}={}){
 const root=resolve(project,'docs/simulacoes'),valid=[],invalid=[];let dirs=[];
 try{dirs=await readdir(root,{withFileTypes:true});}catch{return{valid,invalid};}
 const current=await fingerprint(project);
 for(const d of dirs){if(!d.isDirectory()||!versionPattern.test(d.name))continue;
  let manifest;try{manifest=JSON.parse(await readFile(join(root,d.name,'manifesto.json'),'utf8'));}catch{throw Error(`Simulação ${d.name} sem manifesto válido; não é seguro apresentar os resultados.`);}
  const changed=Object.keys(current).filter(f=>manifest.sources?.[f]!==current[f]);
  if(changed.length){invalid.push({version:d.name,changed});if(prune)await rm(join(root,d.name),{recursive:true});}
  else valid.push({version:d.name,runs:Object.keys(manifest.runs)});
 }
 if(prune){const active=new Set(valid.flatMap(v=>v.runs.map(n=>`${v.version}/${n}`)));
  for(const file of['README.md','GUIA_DO_JOGO.md']){const path=join(project,file);let text;try{text=await readFile(path,'utf8');}catch{continue;}
   const cleaned=text.replace(/<!-- simulation:([^:]+):start -->[\s\S]*?<!-- simulation:\1:end -->\n?/g,(block,id)=>active.has(id)?block:'');
   if(cleaned!==text)await writeFile(path,cleaned);
  }
  const text='# Simulações válidas por versão\n\nCada pasta reúne análise, dados brutos por partida e manifesto com hashes do programa. O número identifica a versão executada; mudar apenas a versão não invalida resultados.\n\n'+(valid.length?valid.sort(newestFirst).map(v=>`- **${v.version}**: ${v.runs.map(n=>`[${n}](${v.version}/${n}/analise.md)`).join(' · ')} · [manifesto](${v.version}/manifesto.json)`).join('\n'):'Nenhuma simulação válida; execute novamente após mudanças nas regras ou IAs.')+'\n\n`npm run build` e o hook de commit verificam os hashes e removem as pastas incompatíveis, incluindo análises e dados brutos. Referências numéricas marcadas no README/guia também são removidas. O histórico do Git preserva os registros antigos. O aprendizado simples é compartilhado com o navegador em simple-learning.ts, incluído nos hashes. Mudanças exclusivamente na apresentação (app.ts, CSS, HTML), documentação ou metadados de versão não invalidam as simulações sem interface.\n';
  await writeFile(join(root,'README.md'),text);
 }
 return{valid,invalid};
}
