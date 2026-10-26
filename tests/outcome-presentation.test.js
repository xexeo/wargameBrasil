import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,objectives} from '../dist/engine.js';
import {operationPresentation} from '../dist/outcome-presentation.js';

test('elimination outcome reports actual final summit occupancy even before round closure',()=>{
 const game=createGame();game.units=game.units.filter(u=>u.side==='br');game.winner='br';game.victoryReason='elimination';game.summitSecured=false;
 Object.assign(game.units.find(u=>u.id==='b1'),{q:objectives[0].q,r:objectives[0].r});
 const before=JSON.stringify(game),result=operationPresentation(game);
 assert.match(result.detail,/cume está ocupado pela infantaria brasileira/);
 assert.doesNotMatch(result.detail,/não foi ocupado/);assert.equal(JSON.stringify(game),before);
});

test('support on the summit differs from infantry occupation, and earlier occupation is not denied',()=>{
 const game=createGame();game.units=game.units.filter(u=>u.side==='br');game.winner='br';game.victoryReason='elimination';game.summitSecured=true;
 assert.match(operationPresentation(game).detail,/No encerramento, o cume está sem peça brasileira/);
 assert.doesNotMatch(operationPresentation(game).detail,/não foi ocupado/);
 Object.assign(game.units.find(u=>u.id==='b5'),{q:objectives[0].q,r:objectives[0].r});
 assert.match(operationPresentation(game).detail,/há apoio brasileiro no cume; apoio não assegura objetivos/);
});
