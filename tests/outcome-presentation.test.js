import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,objectives,operationResult} from '../dist/engine.js';
import {defaultRules} from '../dist/scenario.js';
import {operationPresentation} from '../dist/outcome-presentation.js';

for(const scale of ['battalion','company'])test(`${scale}: neutralizing the defense secures the summit with infantry, support or no counter there`,()=>{
 for(const presence of ['infantry','support','empty']){
  const game=createGame({...defaultRules,scale});game.units=game.units.filter(u=>u.side==='br');game.winner='br';game.victoryReason='elimination';game.summitSecured=false;
  if(presence!=='empty')Object.assign(game.units.find(u=>presence==='infantry'?u.canCapture:!u.canCapture),{q:objectives[0].q,r:objectives[0].r});
  const before=JSON.stringify(game),result=operationPresentation(game);
  assert.match(result.detail,/Monte Castelo está assegurado pela FEB/);
  assert.match(result.detail,/dispensa ocupar o hexágono do cume e completar a meta de pontos/);
  assert.doesNotMatch(result.detail,/não foi ocupado|sem peça brasileira|apoio não assegura/);
  assert.equal(JSON.stringify(game),before,'Reporting must not teleport units, inflate points or change historical saves.');
 }
});
test('unfinished games and victories with surviving defenders retain their normal explanation',()=>{
 const game=createGame();assert.deepEqual(operationPresentation(game),operationResult(game));
 game.winner='br';game.victoryReason='mission';assert.deepEqual(operationPresentation(game),operationResult(game));
 game.winner='de';game.victoryReason='deadline';assert.deepEqual(operationPresentation(game),operationResult(game));
});
