import {type Game,type Side,objectives,canCaptureObjective,createGame,attack,endTurn} from './engine.js';
import {activationOrder,takeAIAction} from './ai.js';
import {seededRandom} from './simulator.js';

export const policies=['strong/aggressive','strong/defensive','weak/aggressive','weak/defensive','tactical/aggressive','tactical/defensive'] as const;
export interface LearningTable {schema:1;episodes:number;updates:number;q:Record<string,number[]>}
export interface PendingExperience {state:string;action:number;utility:number}
export type LearningContext=Partial<Record<Side,PendingExperience>>;
export const emptyLearning=():LearningTable=>({schema:1,episodes:0,updates:0,q:{}});
export function validLearning(value:unknown):value is LearningTable {
 const t=value as LearningTable;
 return !!t&&t.schema===1&&Number.isSafeInteger(t.episodes)&&t.episodes>=0&&Number.isSafeInteger(t.updates)&&t.updates>=0&&!!t.q&&typeof t.q==='object'&&Object.keys(t.q).length<10000&&Object.values(t.q).every(row=>Array.isArray(row)&&row.length===6&&row.every(v=>Number.isFinite(v)&&Math.abs(v)<100000));
}
export function learningState(g:Game,side:Side):string {
 const hp=(s:Side)=>g.units.filter(u=>u.side===s).reduce((n,u)=>n+u.hp,0);
 const advantage=hp(side)-hp(side==='br'?'de':'br');
 const owned=objectives.filter(o=>g.units.some(u=>u.side===side&&canCaptureObjective(u)&&u.q===o.q&&u.r===o.r)).length;
 const summit=g.units.some(u=>u.side===side&&canCaptureObjective(u)&&u.q===5&&u.r===1)?1:0;
 return `${side}:${Math.min(2,Math.floor((g.round-1)/4))}:${advantage< -2?'behind':advantage>2?'ahead':'equal'}:${Math.min(2,Math.floor(g.score/3))}:${owned}:${summit}`;
}
function utility(g:Game,side:Side):number {
 const hp=g.units.reduce((n,u)=>n+(u.side===side?u.hp:-u.hp),0);
 const brControl=objectives.reduce((n,o)=>n+(g.units.some(u=>u.side==='br'&&canCaptureObjective(u)&&u.q===o.q&&u.r===o.r)?o.points:0),0);
 return hp*.6+(side==='br'?1:-1)*(g.score*.7+brControl*.4);
}
function values(t:LearningTable,state:string){return t.q[state]??(t.q[state]=[0,0,0,0,0,0]);}
function update(t:LearningTable,experience:PendingExperience,g:Game,side:Side,terminal:boolean){
 const reward=utility(g,side)-experience.utility+(terminal?(g.winner===side?12:-12):0);
 const next=terminal?0:Math.max(...values(t,learningState(g,side)));
 const row=values(t,experience.state);
 row[experience.action]+=.18*(reward+.9*next-row[experience.action]);
 t.updates++;
}
export function beginLearningTurn(t:LearningTable,context:LearningContext,g:Game,side:Side,rng=Math.random,epsilon=.08){
 const prev=context[side];if(prev)update(t,prev,g,side,false);
 const state=learningState(g,side),row=values(t,state),best=Math.max(...row);
 const candidates=row.map((v,i)=>v===best?i:-1).filter(i=>i>=0);
 const action=rng()<epsilon?Math.floor(rng()*6):candidates[Math.floor(rng()*candidates.length)];
 context[side]={state,action,utility:utility(g,side)};
 const[strategy,stance]=policies[action].split('/');
 return {strategy,stance};
}
export function finishLearningEpisode(t:LearningTable,context:LearningContext,g:Game){
 if(!g.winner)return;
 for(const side of ['br','de'] as const){const pending=context[side];if(pending)update(t,pending,g,side,true);delete context[side];}
 t.episodes++;
}
export function trainEpisode(t:LearningTable,seed:number,epsilon=.2):Game {
 const g=createGame(),rng=seededRandom(seed),context:LearningContext={};
 while(!g.winner){const side=g.turn,policy=beginLearningTurn(t,context,g,side,rng,epsilon);
  for(const id of activationOrder(g,side)){takeAIAction(g,id,policy.strategy,policy.stance,rng);if(g.winner)break;}
  if(!g.winner)endTurn(g);
 }
 finishLearningEpisode(t,context,g);return g;
}
