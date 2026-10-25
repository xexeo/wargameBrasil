import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCompanyScenario } from '../dist/experiments/company/scenario.js';
import { inside, createGame } from '../dist/engine.js';

test('companhias: três batalhões com duas companhias ativas e uma reserva cada', () => {
  const state = createCompanyScenario(), companies = [...state.active.filter(u => u.side === 'br'), ...state.reserves];
  assert.equal(companies.length, 9);
  for (const battalion of ['I/1º RI', 'II/1º RI', 'III/1º RI']) {
    const group = companies.filter(u => u.battalion === battalion);
    assert.deepEqual(group.map(u => u.scenarioLabel).sort(), ['A', 'B', 'C']);
    assert.equal(state.active.filter(u => u.battalion === battalion).length, 2);
    assert.equal(state.reserves.filter(u => u.battalion === battalion).length, 1);
    assert.ok(group.every(u => u.role === 'rifle-company' && u.organicSupport === 'integrated'));
  }
  assert.equal(state.stage, 'roster-only');
  assert.equal(state.historicalDeployment, 'design-hypothesis');
});

test('companhias: dez contadores legais no mapa e treze identidades no conjunto', () => {
  const state = createCompanyScenario(), roster = [...state.active, ...state.reserves];
  assert.equal(state.active.length, 10);
  assert.equal(state.active.filter(u => u.side === 'br').length, 6);
  assert.equal(state.active.filter(u => u.side === 'de').length, 4);
  assert.equal(state.reserves.length, 3);
  assert.equal(roster.length, 13);
  assert.equal(new Set(roster.map(u => u.id)).size, 13);
  assert.equal(new Set(state.active.map(u => `${u.q},${u.r}`)).size, 10);
  assert.ok(state.active.every(u => inside(u.q, u.r)));
  assert.ok(state.active.filter(u => u.side === 'de').every(u => u.echelon === 'unconfirmed'));
});

test('companhias: reservas e artilharia fora do mapa, sem fatores herdados dos batalhões', () => {
  const state = createCompanyScenario();
  assert.equal(state.support.length, 2);
  assert.deepEqual(state.support.map(s => s.side).sort(), ['br', 'de']);
  assert.ok([...state.reserves, ...state.support].every(u => !('q' in u) && !('r' in u)));
  assert.ok(state.support.every(s => s.location === 'off-map' && s.rules === 'pending'));
  assert.ok(state.active.every(u => !('atk' in u) && !('hp' in u)));
  assert.ok(state.support.every(s => !state.active.some(u => u.id === s.id)));
});

test('companhias: construtores independentes e cenário de batalhões preservado', () => {
  const first = createCompanyScenario(), second = createCompanyScenario(), base = createGame();
  first.active[0].q = 8;
  first.reserves.pop();
  first.support[0].id = 'changed';
  assert.equal(second.active[0].q, 1);
  assert.equal(second.reserves.length, 3);
  assert.equal(second.support[0].id, 'br-off-map-artillery');
  assert.equal(base.units.length, 10);
  assert.ok(!base.units.some(u => u.id.startsWith('br-company-')));
});
