import { test } from "node:test";
import assert from "node:assert/strict";
import { simulate, tournament } from "../dist/simulator.js";
test("autojogo reproduz a mesma partida com a mesma semente sem navegador", () => {
  const a = simulate({ seed: 42, record: true }),
    b = simulate({ seed: 42, record: true });
  assert.deepEqual(a, b);
  assert.ok(a.winner);
  assert.ok(a.history.length > 0);
  assert.ok(a.attacks > 0);
  assert.ok(a.round <= 10);
});
test("torneio contabiliza ambos os lados e registra intervalo de incerteza", () => {
  const t = tournament(30, 1001);
  assert.equal(t.wins.br + t.wins.de, 30);
  assert.equal(
    Object.values(t.reasons).reduce((a, b) => a + b, 0),
    30,
  );
  assert.ok(t.interval95[0] <= t.brRate && t.interval95[1] >= t.brRate);
});

test("sementes consecutivas distribuem o primeiro dado pelas seis faces", async () => {
  const { seededRandom } = await import("../dist/simulator.js");
  const faces = [0, 0, 0, 0, 0, 0];
  for (let seed = 1; seed <= 600; seed++) {
    const r = seededRandom(seed)();
    assert.ok(r >= 0 && r < 1);
    faces[Math.floor(r * 6)]++;
  }
  for (const count of faces)
    assert.ok(
      count > 60 && count < 140,
      `Distribuição inicial desequilibrada: ${faces}`,
    );
});
