import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,access} from 'node:fs/promises';
import {join,dirname} from 'node:path';
import {tmpdir} from 'node:os';
import {saveRun,checkSimulations,latestRun,simulationSources} from '../scripts/simulation-store.mjs';
async function project(t){const root=await mkdtemp(join(tmpdir(),'monte-castelo-sim-'));t.after(()=>rm(root,{recursive:true,force:true}));for(const file of simulationSources){await mkdir(dirname(join(root,file)),{recursive:true});await writeFile(join(root,file),'initial');}await writeFile(join(root,'version.json'),JSON.stringify({version:'0.1.9'}));await writeFile(join(root,'README.md'),'Keep intro\n<!-- simulation:0.1.9/matriz:start -->\nOld statistics\n<!-- simulation:0.1.9/matriz:end -->\nKeep ending\n');return root;}

test('simulação guarda análise, dados e hashes por versão; metadados e CSS não invalidam',async t=>{
 const root=await project(t),dir=await saveRun('matriz',{'analise.md':'Analysis','dados-brutos.json':[{seed:1,winner:'br'}]},{project:root});
 assert.ok(dir.endsWith('/0.1.9/matriz'));assert.deepEqual(JSON.parse(await readFile(join(dir,'dados-brutos.json'),'utf8')),[{seed:1,winner:'br'}]);
 await writeFile(join(root,'version.json'),JSON.stringify({version:'0.1.10'}));await writeFile(join(root,'style.css'),'changed presentation');
 await writeFile(join(root,'app.ts'),'changed unit inspection popup only');
 const state=await checkSimulations({project:root,prune:true});assert.equal(state.valid.length,1);assert.equal(state.invalid.length,0);assert.equal(await latestRun('matriz',root),dir);
});

test('mudança de regras remove análise e dados incompatíveis e referências no README',async t=>{
 const root=await project(t),dir=await saveRun('matriz',{'analise.md':'Analysis','dados-brutos.json':[{seed:1,winner:'br'}]},{project:root});
 await writeFile(join(root,'engine.ts'),'changed rules');const preview=await checkSimulations({project:root});assert.equal(preview.invalid.length,1);await access(dir);
 const result=await checkSimulations({project:root,prune:true});assert.equal(result.invalid.length,1);assert.deepEqual(result.invalid[0].changed,['engine.ts']);await assert.rejects(access(dir));
 const readme=await readFile(join(root,'README.md'),'utf8');assert.ok(!readme.includes('Old statistics'));assert.ok(readme.includes('Keep intro'));assert.ok(readme.includes('Keep ending'));await assert.rejects(latestRun('matriz',root),/Não há simulação válida/);
});

test('arquivamento rejeita caminhos fora do diretório de resultados',async t=>{
 const root=await project(t);await assert.rejects(saveRun('../outside',{'analise.md':'x'},{project:root}),/Nome/);await assert.rejects(saveRun('matriz',{}, {project:root,version:'../../outside'}),/Versão/);
});

test('não arquiva resultados se o programa mudar durante a execução',async t=>{
 const{fingerprint}=await import('../scripts/simulation-store.mjs');const root=await project(t),initial=await fingerprint(root);await writeFile(join(root,'ai.ts'),'changed during run');
 await assert.rejects(saveRun('mixed-revision',{'analise.md':'stale','dados-brutos.json':[{seed:1}]},{project:root,expectedSources:initial}),/mudou durante/);await assert.rejects(access(join(root,'docs/simulacoes/0.1.9/mixed-revision')));
});

test('versão 0.9 sucede 0.1 mesmo quando o patch antigo é maior',async t=>{
 const root=await project(t);await saveRun('matriz',{'analise.md':'old'},{project:root,version:'0.1.99'});const current=await saveRun('matriz',{'analise.md':'new'},{project:root,version:'0.9.0'});assert.equal(await latestRun('matriz',root),current);
});
