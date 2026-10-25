// Only confirmed daily counts belong in this comparison. Unknown is not zero.
export interface HistoricalSideLosses {
 label:string;killed:number|null;wounded:number|null;prisoners:number|null;withdrawn:number|null;withdrawalRecorded:boolean|null;note:string;
}
export const historicalLosses:{scope:string;sides:{br:HistoricalSideLosses;de:HistoricalSideLosses};sources:{label:string;url:string}[];context:{label:string;total:number;killed:number;wounded:number;missing:number;scopeNote:string;url:string}[]}={
 scope:'Ataque final a Monte Castelo, 21 de fevereiro de 1945',
 sides:{
  br:{label:'FEB',killed:null,wounded:null,prisoners:null,withdrawn:null,withdrawalRecorded:null,note:'Não foram confirmadas contagens separadas dessas categorias para o dia 21 nas fontes acessíveis. Não usar totais de vários ataques ou de toda a campanha como se fossem deste dia.'},
  de:{label:'Defesa alemã',killed:null,wounded:null,prisoners:null,withdrawn:null,withdrawalRecorded:true,note:'Fisher, p. 431, registra retirada alemã e resistência final de pequena retaguarda. Não quantifica os retirados. A BBC informa que o número de alemães mortos na tomada não é conhecido com precisão.'},
 },
 sources:[
  {label:'U.S. Army, Fisher, Cassino to the Alps, capítulo XXIV, p. 431 (reprodução HyperWar)',url:'https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/USA-MTO-Cassino-24.html'},
  {label:'BBC News Brasil, 20/02/2025 — totais e limites das contagens',url:'https://www.bbc.com/portuguese/articles/c3d8v1jmyryo'},
  {label:'Pesquisa de fontes, acesso a Mascarenhas e escopos dos números',url:'https://github.com/xexeo/wargameBrasil/blob/main/docs/PESQUISA_MASCARENHAS_BAIXAS.md'},
 ],
 context:[{label:'Total do 1º Regimento de Infantaria citado pela BBC',total:414,killed:74,wounded:319,missing:21,scopeNote:'A BBC atribui o total ao Relatório Final de Operações, mas o período e a página não foram confirmados no documento primário. Este total não é apresentado como baixas do ataque de 21/02. Desaparecidos não são prisioneiros confirmados.',url:'https://www.bbc.com/portuguese/articles/c3d8v1jmyryo'}],
};
