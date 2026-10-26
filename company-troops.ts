import type {TroopProfile} from './troops.js';
/** Scenario labels A/B/C describe organization, not verified company numbers. */
export function buildCompanyProfiles(base:readonly TroopProfile[],revision:1|2=2):TroopProfile[]{
 const companies:TroopProfile[]=[];
 for(let battalion=1;battalion<=3;battalion++)for(let company=0;company<3;company++){
  const parent=base.find(p=>p.id===`b${battalion}`)!,roman=['I','II','III'][battalion-1],letter=['A','B','C'][company];
  companies.push({...parent,id:`c-b${battalion}${letter.toLowerCase()}`,q:company===2?battalion*2-1:battalion*2-1+company,r:company===2?8:7,name:`${letter}/${roman}/1º RI`,echelon:'Companhia de fuzileiros',mark:'I',commandGroup:`br-${roman}`,formation:`${roman}/1º RI · Sampaio`,atk:revision===2?1:2,def:2,description:'Companhia de fuzileiros do 1º RI. A/B/C são etiquetas de cenário, não números históricos confirmados. Três companhias por batalhão seguem a organização conhecida; posição e prontidão iniciais são hipóteses. Armas orgânicas integram o perfil. Cada companhia move e ataca independentemente. Na escala companhia, cada disparo causa no máximo 1 PV; os 3 PV medem coesão relativa, não efetivos iguais aos de um batalhão.'});
 }
 for(const source of base.filter(p=>!['b1','b2','b3'].includes(p.id))){
  const p={...source,id:`c-${source.id}`};
  if(p.side==='br'){p.q=source.id==='b4'?6:2;p.r=8;p.atk=source.id==='b5'&&revision===2?3:source.atk-1;p.def=source.id==='b4'?1:source.def;}
  else if(p.type==='infantry'){p.atk=Math.max(1,p.atk-1);p.def=Math.max(1,p.def-1);p.echelon='Destacamento de cenário · referência companhia';}
  else p.atk=3;
  companies.push(p);
 }
 if(revision===2)for(const[id,q,r,name]of[['g1',6,1,'DE 1B — Castelo'],['g2',2,3,'DE 2B'],['g3',7,3,'DE 3B']] as const){
  const source=companies.find(p=>p.id===`c-${id}`)!;
  companies.push({...source,id:`c-${id}b`,q,r,name,description:'Destacamento defensivo de cenário, desdobrado de um núcleo alemão. Referência de escala companhia; posição, efetivo e identidade locais não confirmados. Não é uma companhia histórica numerada nem uma tropa de elite. Possui suas próprias ações.'});
 }
 return companies;
}
