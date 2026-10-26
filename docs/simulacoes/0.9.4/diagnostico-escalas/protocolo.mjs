// Measurement only: consumes the same combat observer as the UI; changes no rules.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createGame,endTurn,reachable,summitOccupied,canCaptureObjective,isIndirect} from '../dist/engine.js';
import {activationOrder,takeAIAction} from '../dist/ai.js';
import {seededRandom,simulate} from '../dist/simulator.js';
import {chooseFixedPolicy} from '../dist/fixed-learning.js';
import {fingerprint,saveRun} from './simulation-store.mjs';

const count=Number(process.argv[2]??20),firstSeed=Number(process.argv[3]??7200001);
assert.ok(Number.isInteger(count)&&count>=1&&count<=1000);
assert.ok(Number.isSafeInteger(firstSeed)&&firstSeed>=0&&firstSeed+count<=0xffffffff);
const sources=await fingerprint(),protocol=await readFile(new URL(import.meta.url),'utf8');
const profiles=['strong','weak','tactical'].flatMap(strategy=>['aggressive','defensive'].map(stance=>({id:`${strategy}/${stance}`,strategy,stance})));
profiles.push({id:'fixed',fixed:true});
const games=[];
for(const scale of ['battalion','company'])for(const profile of profiles){
 const n=profile.fixed?Math.max(100,count):count;
 for(let i=0;i<n;i++){
  const seed=firstSeed+i,s=createGame({...(await import('../dist/scenario.js')).defaultRules,scale}),rng=seededRandom(seed),turns=[],events=[];
  let firstSummitRound=null,activations=0,attacks=0,uphillAttacks=0;
  while(!s.winner){
   assert.ok(turns.length<22,'Match exceeded its deadline');
   const side=s.turn,policy=profile.fixed?chooseFixedPolicy(s,side):profile;
   const t={round:s.round,side,policy:`${policy.strategy}/${policy.stance}`,eligibleMoves:0,occupancyBlocked:0,committed:0,movesAttempted:0,normalShots:0,defensiveShots:0,counters:0,directAgainstSuppressed:0,directShots:0,maxFocus:0,scoreBefore:s.score,events:[]};
   const focus={};
   for(const u of s.units.filter(u=>u.side===side)){
    if(u.mp<=0){t.committed++;continue;}
    t.eligibleMoves++;
    if(!reachable(s,u).size&&reachable({...s,units:[u]},u).size)t.occupancyBlocked++;
   }
   const observe=e=>{
    const source=s.units.find(u=>u.id===e.from.id),target=s.units.find(u=>u.id===e.to.id);
    const role=source?.type==='artillery'?'artillery':source&&isIndirect(source)?'support':'infantry';
    const event={round:t.round,turn:side,kind:e.kind,from:e.from.id,to:e.to.id,q:e.to.q,r:e.to.r,role,side:e.from.side,damage:e.damage,remainingHP:e.remainingHP,cohesionLost:Math.min(e.damage,Math.max(0,e.remainingHP+e.damage)),suppressedTarget:!!target?.suppressed};
    events.push(event);t.events.push(events.length-1);
    if(e.kind==='attack'){
     t.normalShots++;focus[e.to.id]=(focus[e.to.id]??0)+1;t.maxFocus=Math.max(t.maxFocus,focus[e.to.id]);
     if(source&&!isIndirect(source)){t.directShots++;if(target?.suppressed)t.directAgainstSuppressed++;}
    }else if(e.kind==='defensive-fire')t.defensiveShots++;else t.counters++;
   };
   for(const id of activationOrder(s,side)){
    activations++;const result=takeAIAction(s,id,policy.strategy,policy.stance,rng,observe);
    if(result?.moved)t.movesAttempted++;
    if(result?.attack){attacks++;if(result.uphill)uphillAttacks++;}
    if(summitOccupied(s)&&firstSummitRound===null)firstSummitRound=s.round;
    if(s.winner)break;
   }
   if(!s.winner)endTurn(s);
   t.scoreAfter=s.score;turns.push(t);
  }
  const result={scale,profile:profile.id,seed,winner:s.winner,round:s.finishedRound,reason:s.victoryReason,score:s.score,firstSummitRound,summitAtEnd:summitOccupied(s),withdrawals:s.withdrawals,activations,turns,events,remaining:s.units.map(u=>({id:u.id,side:u.side,hp:u.hp,canCapture:canCaptureObjective(u)}))};
  // Checks measurement against canonical execution for every fixed-policy profile.
  if(!profile.fixed&&i===0){const canonical=simulate({scale,seed,strategy:profile.strategy,stance:profile.stance});assert.equal(result.winner,canonical.winner);assert.equal(result.round,canonical.round);assert.equal(result.score,canonical.score);assert.equal(attacks,canonical.attacks);assert.equal(uphillAttacks,canonical.uphillAttacks);}
  assert.equal(events.filter(e=>e.kind==='attack').length,turns.reduce((n,t)=>n+t.normalShots,0));
  games.push(result);
 }
 console.log(`${scale} ${profile.id}: ${n} measured games`);
}
const mean=(xs,fn)=>xs.reduce((n,x)=>n+fn(x),0)/xs.length;
const pct=x=>(x*100).toFixed(1)+'%';
const rows=[],summaries=[];
for(const scale of ['battalion','company'])for(const profile of profiles){
 const xs=games.filter(g=>g.scale===scale&&g.profile===profile.id),ts=xs.flatMap(g=>g.turns),ev=xs.flatMap(g=>g.events),direct=ts.reduce((n,t)=>n+t.directShots,0),eligible=ts.reduce((n,t)=>n+t.eligibleMoves,0);
 const row={scale,profile:profile.id,n:xs.length,brWins:xs.filter(g=>g.winner==='br').length,elimination:xs.filter(g=>g.reason==='elimination').length,meanRound:mean(xs,g=>g.round),meanNormalShots:mean(xs,g=>g.events.filter(e=>e.kind==='attack').length),meanDefensiveShots:mean(xs,g=>g.events.filter(e=>e.kind==='defensive-fire').length),meanCounters:mean(xs,g=>g.events.filter(e=>e.kind==='counterattack').length),maxFocus:Math.max(...ts.map(t=>t.maxFocus)),directAgainstSuppressed:ts.reduce((n,t)=>n+t.directAgainstSuppressed,0),directShots:direct,occupancyBlocked:ts.reduce((n,t)=>n+t.occupancyBlocked,0),eligibleMoves:eligible,meanWithdrawals:mean(xs,g=>g.withdrawals.br+g.withdrawals.de)};
 row.roles=Object.fromEntries(['infantry','support','artillery'].map(role=>{const shots=ev.filter(e=>e.kind==='attack'&&e.role===role);return[role,{shots:shots.length,hits:shots.filter(e=>e.damage>0).length,cohesionLost:shots.reduce((n,e)=>n+e.cohesionLost,0)}];}));
 summaries.push(row);
 rows.push(`| ${scale==='company'?'Companhia':'Batalhão'} | ${profile.id} | ${row.n} | ${pct(row.brWins/row.n)} | ${pct(row.elimination/row.n)} | ${row.meanRound.toFixed(2)} | ${row.meanNormalShots.toFixed(1)} | ${row.meanDefensiveShots.toFixed(1)} | ${row.maxFocus} | ${direct?pct(row.directAgainstSuppressed/direct):'—'} |`);
}
const text=`# Diagnóstico de ações e fogo nas duas escalas\n\nReferência sem mudança de regras. Seis políticas iguais para ambos os lados, ${count} sementes por perfil; modelos fixos próprios de cada lado em pelo menos 100 confrontos por escala. Sementes começam em ${firstSeed}. Um perfil não equivale a um jogador humano. Os perfis não recebem pesos para produzir uma taxa agregada conveniente.\n\n| Escala | Política dos dois lados | Jogos | Vitórias FEB | Fim por eliminação | Rodada média | Disparos normais/jogo | Fogo defensivo/jogo | Máximo de tiros num alvo/turno | Tiro direto contra suprimido |\n| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${rows.join('\n')}\n\n## Definições e limites\n\n- Disparos vêm dos eventos reais do motor, incluindo reações durante movimento. Ativações ou tentativas interrompidas não são disparos. Contra-ataques estão separados nos dados.\n- Concentração conta tiros normais contra o mesmo ID em um turno de um lado, mesmo se o alvo recuou. É o máximo observado, não uma média.\n- Suprimido é o estado do alvo no evento de tiro direto, antes da retirada posterior. Não distingue supressão por apoio de supressão por reorganização; não demonstra causalmente o benefício do apoio.\n- Congestionamento conta peças com PM no início do turno sem destino legal ocupado, mas com destino ao remover as outras peças. Não é análise de todo bloqueio de rota ao longo do turno.\n- Função: artilharia pelo tipo; apoio pela propriedade de tiro indireto; demais infantaria. Coesão perdida efetiva exclui dano excedente ao PV restante; não equivale a baixas humanas.\n- Movimentos tentados são intenções retornadas pela IA; podem ser interrompidos por reação. Não se confundem com hexágonos efetivamente percorridos.\n- Políticas fixas dos seis perfis são comparadas ao simulador canônico na primeira semente de cada escala, verificando vencedor, rodada, pontuação e contagens. Os modelos FX escolhem políticas por lado/estado e não aprendem nesta medição.\n- Somente IA contra IA. Minutos humanos não foram medidos. Estas sementes são de diagnóstico e ficam excluídas da avaliação final reservada.\n\n## Arquivos\n\n[dados-brutos.json](dados-brutos.json): eventos, turnos, condições finais e sementes. [resumo.json](resumo.json): indicadores por perfil e função. [protocolo.mjs](protocolo.mjs): cópia da instrumentação utilizada; executar o original na raiz do projeto. O manifesto contém hashes do núcleo; os dados também contêm SHA-256 do protocolo.\n`;
const version=JSON.parse(await readFile('version.json','utf8')).version;
const folder=await saveRun('diagnostico-escalas',{'analise.md':text,'dados-brutos.json':{schema:1,version,createdAt:new Date().toISOString(),seeds:[firstSeed,firstSeed+Math.max(100,count)-1],protocolHash:createHash('sha256').update(protocol).digest('hex'),games},'resumo.json':summaries,'protocolo.mjs':protocol},{expectedSources:sources,provenance:{count:games.length,diagnosisOnly:true,seeds:[firstSeed,firstSeed+Math.max(100,count)-1]}});
console.log(folder);
