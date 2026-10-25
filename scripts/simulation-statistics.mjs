export function summarizeMatches(games){
 const count=games.length;if(!count)throw Error('Nenhuma partida.');
 const br=games.filter(g=>g.winner==='br').length,p=br/count,z=1.96,den=1+z*z/count,c=(p+z*z/(2*count))/den,h=z*Math.sqrt(p*(1-p)/count+z*z/(4*count*count))/den;
 return{count,wins:{br,de:count-br},brRate:p,interval95:[c-h,c+h],meanRound:games.reduce((n,g)=>n+g.round,0)/count,meanScore:games.reduce((n,g)=>n+g.score,0)/count,reasons:Object.fromEntries([...new Set(games.map(g=>g.reason).filter(Boolean))].map(reason=>[reason,games.filter(g=>g.reason===reason).length]))};
}
export function analysis(summary,title){return`# ${title}\n\n${summary.count} partidas. FEB: ${summary.wins.br} vitórias (${(summary.brRate*100).toFixed(1)}%); Alemanha: ${summary.wins.de}. Média: ${summary.meanRound.toFixed(2)} rodadas; ${summary.meanScore.toFixed(2)} pontos FEB.\n\n[Resultados agregados](resultados.json) · [Dados individuais por partida](dados-brutos.json). Tempo humano em minutos não foi medido. Os resultados valem para os hashes e parâmetros no manifesto da versão.\n`;}
