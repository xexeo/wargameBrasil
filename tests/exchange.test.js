import {test} from 'node:test';import assert from 'node:assert/strict';
import {createGame} from '../dist/engine.js';
import {encodeTurn,decodeTurn,validGame,publicTurnLink} from '../dist/exchange.js';
test('turno compartilhado preserva peças, idioma e estado sem backend',()=>{const game=createGame();assert.deepEqual(decodeTurn(encodeTurn(game)),game);assert.ok(publicTurnLink(game,'https://xexeo.github.io/wargameBrasil/').includes('#turn='));assert.equal(publicTurnLink(game,'file:///tmp/jogo.html'),null);assert.equal(publicTurnLink(game,'http://localhost:8000'),null);});
test('rejeita dados corrompidos, ocupação dupla e valores fora das regras',()=>{assert.throws(()=>decodeTurn('xxx'));const game=createGame();game.units[0].hp=99;assert.equal(validGame(game),false);game.units[0].hp=3;game.units[0].q=game.units[1].q;game.units[0].r=game.units[1].r;assert.equal(validGame(game),false);});
