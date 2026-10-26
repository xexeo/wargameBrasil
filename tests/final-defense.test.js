import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame,elevation,neighbors,movementCost,reachable,advance,defenseBonus,attack,missionForecast,objectives} from '../dist/engine.js';
import {validRules} from '../dist/scenario.js';
import {aiAction,selectAttackTarget} from '../dist/ai.js';

test('subida custa dois PM por nível e partidas legadas conservam custo um',()=>{
 const s=createGame();s.units=s.units.filter(u=>u.id==='b1');const u=s.units[0];
 let pair;for(let q=0;q<9&&!pair;q++)for(let r=0;r<9&&!pair;r++)for(const[nq,nr]of neighbors(q,r))if(elevation(nq,nr)===elevation(q,r)+1&&movementCost({q,r},{q:nq,r:nr},2)===3){pair=[q,r,nq,nr];break;}
 assert.ok(pair);const[q,r,nq,nr]=pair;Object.assign(u,{q,r});assert.equal(reachable(s,u).get(`${nq},${nr}`),3);assert.equal(advance(s,u.id,nq,nr),true);assert.equal(u.mp,0);
 Object.assign(u,{q,r,mp:3});delete s.rules.ascentStepCost;assert.equal(reachable(s,u).get(`${nq},${nr}`),2);assert.ok(validRules(s.rules));s.rules.ascentStepCost=3;assert.equal(validRules(s.rules),false);
});

test('abrigo protege quem ocupa sem alterar a defesa nominal ou acumular mata',()=>{
 for(const side of ['br','de']){const s=createGame();s.rules.opportunityFire=false;s.rules.retreatOnLoss=false;const occupant=s.units.find(u=>u.side===side&&u.type==='infantry'),gun=s.units.find(u=>u.side!==side&&u.type==='artillery');Object.assign(occupant,objectives[0]);Object.assign(gun,{q:5,r:2,atk:occupant.def+defenseBonus({q:5,r:2},occupant,2)-1});s.turn=gun.side;
 const nominal=occupant.def;assert.equal(defenseBonus(gun,occupant,2)-defenseBonus(gun,occupant,1),1);attack(s,gun.id,occupant.id,()=>0);assert.equal(occupant.def,nominal);assert.equal(occupant.hp,3);
 }
});

test('atirar não adia previsão de chegada quando movimento continua disponível',()=>{
 const s=createGame();s.units=s.units.filter(u=>u.id==='b1');const u=s.units[0];Object.assign(u,{q:5,r:2});const before=missionForecast(s);u.fired=true;assert.equal(missionForecast(s).earliestSummitRound,before.earliestSummitRound);
});

test('Estado-maior alemão guarda cume nas duas posturas e seleciona tiro por missão',()=>{
 for(const stance of ['aggressive','defensive']){const s=createGame();s.turn='de';const u=s.units.find(u=>u.id==='g1');aiAction(s,u.id,'tactical',stance);assert.equal(u.q,5);assert.equal(u.r,1);}
 const s=createGame();const gun=s.units.find(u=>u.id==='g5');Object.assign(gun,{q:3,r:6,range:9});const b=s.units.find(u=>u.id==='b1');Object.assign(b,{q:1,r:7});assert.equal(selectAttackTarget(s,gun,'tactical').id,'b5');
 Object.assign(b,objectives[0]);assert.equal(selectAttackTarget(s,gun,'tactical').id,'b1');
});
