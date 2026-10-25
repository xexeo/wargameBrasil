import { test } from "node:test";
import assert from "node:assert/strict";
import {
  geography,
  geographicCell,
  altitude,
  terrainLevel,
} from "../dist/geography.js";
test("tabuleiro ancora o cume real e contém 81 amostras geográficas válidas", () => {
  assert.equal(geography.cells.length, 81);
  const peak = geographicCell(5, 1);
  assert.ok(Math.abs(peak.latitude - 44.2206238) < 1e-7);
  assert.ok(Math.abs(peak.longitude - 10.95377) < 1e-7);
  assert.ok(Math.abs(altitude(5, 1) - 977) < 25);
  assert.equal(terrainLevel(5, 1), 4);
  for (const c of geography.cells) {
    assert.ok(Number.isFinite(c.altitude));
    assert.ok(["plain", "forest", "road"].includes(c.terrain));
    assert.ok(terrainLevel(c.q, c.r) >= 1 && terrainLevel(c.q, c.r) <= 4);
  }
});
test("base mantém feições reais e classifica tanto matas como caminhos", () => {
  assert.ok(geography.roads.length > 0);
  assert.ok(geography.woods.length > 0);
  assert.ok(geography.settlements.some((p) => p.name === "Abetaia"));
  assert.ok(geography.cells.some((c) => c.terrain === "forest"));
  assert.ok(geography.cells.some((c) => c.terrain === "road"));
});
