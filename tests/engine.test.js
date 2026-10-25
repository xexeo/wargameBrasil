import { aiAction } from "../dist/ai.js";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  reachable,
  move,
  attack,
  endTurn,
  movementCost,
  defenseBonus,
  lineOfSight,
} from "../dist/engine.js";
test("subida custa movimento e a altura protege o defensor", () => {
  assert.equal(movementCost({ q: 3, r: 5 }, { q: 3, r: 4 }), 2);
  assert.equal(movementCost({ q: 3, r: 4 }, { q: 3, r: 5 }), 1);
  assert.equal(defenseBonus({ q: 5, r: 2 }, { q: 5, r: 1 }), 2);
});
test("movimento respeita alcance, ocupação e pontos restantes", () => {
  const s = createGame(),
    u = s.units[0];
  assert.equal(move(s, u.id, 3, 6), false);
  assert.equal(move(s, u.id, 1, 5), true);
  assert.equal(u.mp, 2);
  assert.equal(move(s, u.id, 8, 0), false);
  assert.ok(!reachable(s, u).has("3,6"));
});
test("combate, contra-ataque e limite de um ataque", () => {
  const s = createGame();
  s.units = s.units.slice(0, 2);
  s.units[1].side = "de";
  Object.assign(s.units[0], { q: 3, r: 5, atk: 1 });
  Object.assign(s.units[1], { q: 3, r: 4, def: 6 });
  const result = attack(s, "b1", "b2", () => 0);
  assert.equal(result.damage, 0);
  assert.equal(result.counter, 1);
  assert.equal(s.units[0].hp, 2);
  assert.equal(s.units[0].mp, 0);
  assert.equal(attack(s, "b1", "b2"), null);
});
test("mata bloqueia a linha de visão", () => {
  assert.equal(lineOfSight({ q: 1, r: 2 }, { q: 3, r: 2 }), false);
  assert.equal(lineOfSight({ q: 3, r: 5 }, { q: 5, r: 5 }), true);
});
test("pontuação apenas depois do turno inimigo e vitória com 8 pontos", () => {
  const s = createGame();
  Object.assign(s.units[0], { q: 5, r: 1 });
  s.units = s.units.filter((u) => u.id !== "g1");
  s.score = 6;
  endTurn(s);
  assert.equal(s.score, 6);
  endTurn(s);
  assert.equal(s.score, 8);
  assert.equal(s.winner, "br");
});
test("campanhas completas terminam com movimentos legais para todas as IAs", () => {
  for (const mode of ["strong", "weak", "tactical"])
    for (const stance of ["aggressive", "defensive"]) {
      const s = createGame();
      let turns = 0;
      while (!s.winner && turns++ < 22) {
        for (const id of s.units
          .filter((u) => u.side === s.turn)
          .map((u) => u.id)) {
          const action = aiAction(s, id, mode, stance);
          if (action) attack(s, action.attacker, action.target, () => 0.5);
        }
        const occupied = s.units.map((u) => `${u.q},${u.r}`);
        assert.equal(new Set(occupied).size, occupied.length);
        endTurn(s);
      }
      assert.ok(s.winner);
    }
});
