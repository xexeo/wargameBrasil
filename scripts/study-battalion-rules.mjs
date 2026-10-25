import{simulate}from'../dist/simulator.js';import{saveRun,fingerprint}from'./simulation-store.mjs';import{summarizeMatches}from'./simulation-statistics.mjs';
const initialSources=await fingerprint();

const count=250,firstSeed=300001,raw=[],rows=[];
for(const retreatOnLoss of[false,true])for(const summitAtDeadlineWins of[false,true]){
 const rules={retreatOnLoss,summitAtDeadlineWins},games=[];
 for(let i=0;i<count;i++){const result=simulate({seed:firstSeed+i,strategy:'tactical',stance:'aggressive',rules,record:true}),last=result.history.at(-1);const{history,...game}=result;games.push({...game,remainingUnits:last.units.map(u=>({id:u.id,side:u.side,hp:u.hp,q:u.q,r:u.r})),defenseEliminated:last.units.every(u=>u.side!=='de'),retreats:last.log.filter(l=>l.includes('retirada experimental')).length});}
 const summary={...rules,...summarizeMatches(games),emptyDefenseDefeats:games.filter(g=>g.winner==='de'&&g.defenseEliminated).length,summitDefeats:games.filter(g=>g.winner==='de'&&g.summitOccupied).length};raw.push({rules,games});rows.push(summary);console.log(summary);
}
let text='# Comparação de regras — batalhões\n\n250 sementes por configuração, mesma IA tática/agressiva nos dois lados. As1000 partidas não são avaliações humanas; candidatas não são história documentada.\n\n| Retirada | Cume suficiente no prazo | FEB/250 | Rodadas | Derrotas sem defensores | Derrotas no cume |\n| --- | --- | ---: | ---: | ---: | ---: |\n';
for(const r of rows)text+=`| ${r.retreatOnLoss?'sim':'não'} | ${r.summitAtDeadlineWins?'sim':'não'} | ${r.wins.br} | ${r.meanRound.toFixed(2)} | ${r.emptyDefenseDefeats} | ${r.summitDefeats} |\n`;
text+='\nA seleção deve considerar efeitos sobre manobra, conservação de tropas e objetivo, além da taxa de vitórias. Os padrões publicados permanecem os registrados em scenario.ts. [Dados individuais](dados-brutos.json) · [Resumo](resultados.json).\n';
await saveRun('estudo-regras-batalhoes',{'analise.md':text,'dados-brutos.json':raw,'resultados.json':rows},{expectedSources:initialSources,provenance:{count:1000,seeds:[firstSeed,firstSeed+count-1],candidates:true}});
