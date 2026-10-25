import { test } from "node:test";
import assert from "node:assert/strict";
import { weatherHours, weatherAt } from "../dist/weather.js";
test("relógio da batalha usa a hora italiana correta na série ERA5 arquivada", () => {
  assert.equal(weatherHours.length, 24);
  assert.equal(weatherAt(1).hour, 6);
  assert.equal(weatherAt(10).hour, 16);
  assert.equal(weatherAt(11).hour, 18);
  for (let round = 1; round <= 11; round++) {
    const weather = weatherAt(round);
    assert.ok(Number.isFinite(weather.temperature));
    assert.ok(weather.cloud >= 0 && weather.cloud <= 100);
    assert.ok(weather.precipitation >= 0);
  }
});
