import {profilesForScale,troopProfile} from './troops.js';
import {validRules} from "./scenario.js";
import {initialForce,inside,type Game} from './engine.js';
export function validGame(value:unknown):value is Game {
 const g=value as Game;
 if(!g||!Number.isInteger(g.round)||g.round<1||g.round>11||!['br','de'].includes(g.turn)||!Number.isInteger(g.score)||g.score<0||g.score>100||![null,'br','de'].includes(g.winner)||!Array.isArray(g.units)||g.units.length>(g.rules?.scale==='company'?profilesForScale('company',g.rules.companyRevision??1).length:10)||!Array.isArray(g.log)||g.log.length>400||!g.log.every(l=>typeof l==='string'&&l.length<1000))return false;
 if(g.rules!==undefined&&!validRules(g.rules))return false;
 if(g.finishedRound!==undefined&&(!Number.isInteger(g.finishedRound)||g.finishedRound<1||g.finishedRound>10))return false;
 if(g.victoryReason!==undefined&&!['elimination','mission','late-summit','no-infantry','deadline'].includes(g.victoryReason))return false;
 if(g.withdrawals!==undefined&&(!g.withdrawals||!['br','de'].every(side=>Number.isInteger(g.withdrawals![side])&&g.withdrawals![side]>=0&&g.withdrawals![side]<=initialForce(g,side as 'br'|'de'))))return false;
 if(g.summitSecured!==undefined&&typeof g.summitSecured!=='boolean')return false;
 for(const commands of [g.commanded,g.reactionCommands])if(commands!==undefined&&(!commands||typeof commands!=='object'||Array.isArray(commands)||Object.entries(commands).some(([group,id])=>!['br-I','br-II','br-III'].includes(group)||typeof id!=='string'||troopProfile(id)?.commandGroup!==group)))return false;
 const ids=new Set(),positions=new Set();
 for(const u of g.units){if(!u||typeof u.id!=='string'||u.id.length>20||ids.has(u.id)||typeof u.name!=='string'||u.name.length>100||!['br','de'].includes(u.side)||!['infantry','armor','artillery'].includes(u.type)||!Number.isInteger(u.q)||!Number.isInteger(u.r)||!inside(u.q,u.r)||positions.has(`${u.q},${u.r}`)||![u.hp,u.atk,u.def,u.mp].every(Number.isFinite)||u.hp<1||u.hp>3||u.atk<0||u.atk>12||u.def<0||u.def>12||u.mp<0||u.mp>8||typeof u.fired!=='boolean')return false;if((u.maxMp!==undefined&&(!Number.isInteger(u.maxMp)||u.maxMp<1||u.maxMp>4))||(u.range!==undefined&&(!Number.isInteger(u.range)||u.range<1||u.range>6))||(u.level!==undefined&&![1,2,3].includes(u.level))||(u.indirect!==undefined&&typeof u.indirect!=='boolean')||(u.canCapture!==undefined&&typeof u.canCapture!=='boolean')||(u.reorganizing!==undefined&&typeof u.reorganizing!=='boolean')||(u.reactionSpent!==undefined&&typeof u.reactionSpent!=='boolean')||(u.suppressed!==undefined&&typeof u.suppressed!=='boolean')||(u.heightRange!==undefined&&typeof u.heightRange!=='boolean')||(u.rangeHeightThreshold!==undefined&&(!Number.isFinite(u.rangeHeightThreshold)||u.rangeHeightThreshold<30||u.rangeHeightThreshold>150)))return false;ids.add(u.id);positions.add(`${u.q},${u.r}`);}
 return true;
}
export function encodeTurn(game:Game):string {
 const text=JSON.stringify({schema:1,game:{...game,log:game.log.slice(0,12)}});
 return btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
export function decodeTurn(encoded:string):Game {
 if(encoded.length>30000)throw new Error('Turno muito grande.');
 const raw=atob(encoded.replace(/-/g,'+').replace(/_/g,'/'));
 const value=JSON.parse(new TextDecoder().decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
 if(value.schema!==1||!validGame(value.game))throw new Error('Turno inválido ou incompatível.');
 return value.game;
}
export function publicTurnLink(game:Game,base:string):string|null {
 const url=new URL(base);
 if(!['http:','https:'].includes(url.protocol)||['localhost','127.0.0.1','0.0.0.0','[::1]'].includes(url.hostname)||url.hostname.endsWith('.localhost'))return null;
 url.search='';url.hash=`turn=${encodeTurn(game)}`;return url.href;
}
