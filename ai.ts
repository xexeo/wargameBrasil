import {type Game,type Unit,distance,objectives,terrain,reachable,canAttack,attackRange,move,canCaptureObjective,advance,attack,hasHeightAdvantage,effectiveAttackRange,expectedReactionRisk,travelCostsTo,key,roundLimit} from './engine.js';

export function chooseTarget(s:Game,u:Unit,mode:string){
 return s.units.filter(v=>v.side!==u.side).sort((a,b)=>{
  const da=distance(u,a),db=distance(u,b);
  if(mode==='tactical'&&u.side==='de'){
   // Infantry denies the maneuver that can take the summit; artillery performs
   // counterbattery fire unless an assault is already threatening the summit.
   if(u.type!=='artillery'){const priority=(v:Unit)=>(canCaptureObjective(v)?-6:0)+distance(v,objectives[0])*1.4+v.hp*.7+distance(u,v)*.6-v.atk*.4;return priority(a)-priority(b);}
   const urgent=(v:Unit)=>canCaptureObjective(v)&&distance(v,objectives[0])<=2?1:0;return urgent(b)-urgent(a)||b.atk-a.atk||da-db;
  }
  if(mode==='strong')return b.atk-a.atk||da-db;
  if(mode==='weak')return a.def-b.def||da-db;
  return (a.hp+a.def*.3+da*.7-a.atk*.4)-(b.hp+b.def*.3+db*.7-b.atk*.4);
 })[0];
}
function strategicGoal(s:Game,u:Unit){
 const available=objectives.filter(o=>!s.units.some(v=>v.id!==u.id&&v.side===u.side&&canCaptureObjective(v)&&v.q===o.q&&v.r===o.r));
 if(u.side==='br')return available.find(o=>o===objectives[0])??available.sort((a,b)=>distance(u,a)-distance(u,b))[0]??objectives[0];
 return available.sort((a,b)=>(distance(u,a)-(a===objectives[0]?2:0))-(distance(u,b)-(b===objectives[0]?2:0)))[0]??objectives[0];
}
export function aiAction(s:Game,id:string,mode='tactical',stance='defensive'){
 const u=s.units.find(v=>v.id===id);if(!u||s.winner||u.side!==s.turn)return null;
 const enemies=s.units.filter(v=>v.side!==u.side),enemy=chooseTarget(s,u,mode),support=!canCaptureObjective(u);
 if(!enemy&&support)return null;
 const goal=strategicGoal(s,u),travel=travelCostsTo(goal),mission=!!s.rules?.requireSummit;
 const onSummit=u.q===objectives[0].q&&u.r===objectives[0].r;
 const guardDuty=u.side==='de'&&(stance==='defensive'||s.round>=7||enemies.some(v=>canCaptureObjective(v)&&distance(v,objectives[0])<=2));
 const hold=!support&&onSummit&&(u.side==='br'||(mode==='tactical'&&guardDuty));
 const cells=[{q:u.q,r:u.r,spent:0},...(hold?[]:Array.from(reachable(s,u),([k,spent])=>{const[q,r]=k.split(',').map(Number);return{q,r,spent};}))];
 const urgency=mission&&u.side==='br'?Math.max(0,(s.round-4)/Math.max(1,roundLimit(s)-3)):0;
 const evaluate=p=>{
  const virtual={...u,...p},d=enemy?distance(p,enemy):0,hill=objectives.find(o=>o.q===p.q&&o.r===p.r),cost=travel.get(key(p.q,p.r))??1000;
  // With no enemy left, terrain bonuses must never prevent the mission march.
  if(!enemy)return -cost*10-p.spent*.01;
  let value=support?-Math.abs(d-attackRange(u))*1.5:-d*(stance==='aggressive'?2:1);
  if(support&&d===1)value-=4;
  if(support&&hill)value-=5;
  if(canAttack(virtual,enemy))value+=6;
  const missionHill=mission&&u.side==='br'?hill===goal:!!hill;
  if(stance==='defensive'){
   value+=!support&&missionHill?5:0;
   value+=['hill','forest'].includes(terrain(p.q,p.r))?1.5:0;
  }
  if(mode==='tactical'){
   if(p.spent>0)value-=expectedReactionRisk(s,virtual);
   const threats=enemies.filter(v=>distance(p,v)<=effectiveAttackRange(v,virtual)).reduce((n,v)=>n+v.atk,0);
   value-=threats*(support?.7:u.side==='de'&&stance==='aggressive'&&!guardDuty?.05:u.hp===1?.65:.3);
   if(!support){
    if(u.side==='br'&&mission){value-=cost*(1.6+urgency);if(hill===goal)value+=12;}
    else if(u.side==='de'){if(stance==='aggressive'&&!guardDuty){value-=cost*.15;}else{value-=cost*.8;if(hill===goal)value+=7;}}
    else if(hill)value+=4;
   }
   value+=s.units.filter(v=>v.side===u.side&&v.id!==id&&distance(p,v)===1).length*.6;
  }
  return value-p.spent*.04;
 };
 const ratings=new Map(cells.map(p=>[key(p.q,p.r),evaluate(p)]));cells.sort((a,b)=>ratings.get(key(b.q,b.r))!-ratings.get(key(a.q,a.r))!);
 if(cells[0].spent)move(s,id,cells[0].q,cells[0].r);
 const target=selectAttackTarget(s,u,mode);
 return target?{attacker:id,target:target.id}:null;
}
export function selectAttackTarget(s:Game,u:Unit,mode='tactical'):Unit|undefined{
 const targets=s.units.filter(v=>canAttack(u,v));
 targets.sort((a,b)=>mode==='strong'?b.atk-a.atk||distance(u,a)-distance(u,b):mode==='weak'?a.def-b.def||distance(u,a)-distance(u,b):(a.hp+a.def-a.atk*.5-(canCaptureObjective(a)?1:0))-(b.hp+b.def-b.atk*.5-(canCaptureObjective(b)?1:0)));
 return targets[0];
}

export function activationOrder(s:Game,side=s.turn):string[]{return s.units.filter(u=>u.side===side).sort((a,b)=>Number(canCaptureObjective(a))-Number(canCaptureObjective(b))||attackRange(b)-attackRange(a)||a.id.localeCompare(b.id)).map(u=>u.id);}
export function takeAIAction(s:Game,id:string,mode='tactical',stance='defensive',rng=Math.random){
 const source=s.units.find(u=>u.id===id);if(!source||s.winner||source.side!==s.turn)return null;
 const first=s.rules?.freeFireOrder?selectAttackTarget(s,source,mode):undefined;
 let shot:ReturnType<typeof attack>=null,uphill=first?hasHeightAdvantage(first,source):false;
 if(first)shot=attack(s,id,first.id,rng);
 if(s.winner||!s.units.some(u=>u.id===id))return{moved:false,attack:shot,uphill};
 const plan=structuredClone(s),intent=aiAction(plan,id,mode,stance),destination=plan.units.find(u=>u.id===id)!;
 const moved=source.q!==destination.q||source.r!==destination.r;if(moved)advance(s,id,destination.q,destination.r,rng);
 if(s.winner||!s.units.some(u=>u.id===id))return{moved,attack:shot,uphill};
 if(!first&&intent){const target=s.units.find(u=>u.id===intent.target);uphill=target?hasHeightAdvantage(target,source):false;shot=attack(s,intent.attacker,intent.target,rng);}
 return{moved,attack:shot,uphill};
}
