import { defaultRules, heightThreshold } from "./scenario.js";
import { troopProfiles } from "./troops.js";
import { geographicTerrain, terrainLevel, altitude, geography } from "./geography.js";
// Prepared positions are scenario abstractions, not surveyed bunker locations.
export const fortifications = [
    { q: 5, r: 1, level: 1 },
    { q: 3, r: 3, level: 1 },
];
export function fortification(q, r) {
    return fortifications.find((f) => f.q === q && f.r === r)?.level ?? 0;
}
export const COLS = geography.columns, ROWS = geography.rows, LIMIT = 10;
export const key = (q, r) => `${q},${r}`;
export const inside = (q, r) => q >= 0 && r >= 0 && q < COLS && r < ROWS;
export const distance = (a, b) => (Math.abs(a.q - b.q) +
    Math.abs(a.r - b.r) +
    Math.abs(a.q + a.r - b.q - b.r)) /
    2;
export const neighbors = (q, r) => [
    [q + 1, r],
    [q - 1, r],
    [q, r + 1],
    [q, r - 1],
    [q + 1, r - 1],
    [q - 1, r + 1],
].filter(([q, r]) => inside(q, r));
export const objectives = [
    { q: 5, r: 1, name: "Monte Castelo", points: 2 },
    { q: 3, r: 3, name: "", points: 1 },
    { q: 6, r: 3, name: "", points: 1 },
];
// Geometry is sampled from Copernicus DEM; land cover/roads from a dated OSM snapshot.
export const terrain = (q, r) => geographicTerrain(q, r);
export const elevation = (q, r) => terrainLevel(q, r);
export { altitude };
export const clock = (round) => {
    const minutes = 360 + (Math.min(round, 11) - 1) * 72;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
};
export function movementCost(from, to) {
    return ((terrain(to.q, to.r) === "forest" ? 2 : 1) +
        Math.max(0, elevation(to.q, to.r) - elevation(from.q, from.r)));
}
export const cost = (q, r) => ["hill", "forest"].includes(terrain(q, r)) ? 2 : 1;
export function lineOfSight(a, b) {
    const n = distance(a, b);
    if (n <= 1)
        return true;
    for (let i = 1; i < n; i++) {
        const t = i / n, x = a.q + (b.q - a.q) * t, z = a.r + (b.r - a.r) * t, y = -x - z;
        let rx = Math.round(x), ry = Math.round(y), rz = Math.round(z);
        const dx = Math.abs(rx - x), dy = Math.abs(ry - y), dz = Math.abs(rz - z);
        if (dx > dy && dx > dz)
            rx = -ry - rz;
        else if (dy > dz)
            ry = -rx - rz;
        else
            rz = -rx - ry;
        const sight = altitude(a.q, a.r) + 2 + (altitude(b.q, b.r) - altitude(a.q, a.r)) * t;
        if (altitude(rx, rz) + (terrain(rx, rz) === 'forest' ? 15 : 0) > sight)
            return false;
    }
    return true;
}
export function defenseBonus(a, b) {
    return (Math.max(["hill", "forest"].includes(terrain(b.q, b.r)) ? 1 : 0, fortification(b.q, b.r)) + (hasHeightAdvantage(b, a) ? 1 : 0));
}
export const maximumMovement = (u) => u.maxMp ?? (u.type === 'armor' ? 4 : 3);
export const canCaptureObjective = (u) => u.canCapture ?? true;
export const objectivePointsPerRound = () => objectives.reduce((sum, o) => sum + o.points, 0);
export const targetScore = (s) => s.rules?.targetScore ?? 8;
export const roundLimit = (s) => s.rules?.roundLimit ?? LIMIT;
export const unitLevel = (u) => u.level ?? 2;
export function createGame(rules = defaultRules) {
    return { rules: { ...rules }, summitSecured: false, round: 1, turn: 'br', score: 0, winner: null,
        units: troopProfiles.map(p => ({ id: p.id, side: p.side, q: p.q, r: p.r, name: p.name, type: p.type, atk: p.atk, def: p.def, hp: 3, mp: p.mp, maxMp: p.mp, range: p.range, indirect: p.indirect, canCapture: p.canCapture, level: p.level, heightRange: rules.highGroundRange, rangeHeightThreshold: rules.rangeHeightThreshold, reactionSpent: false, suppressed: false, fired: false })),
        log: ['21 de fevereiro de 1945. Os batalhões do Sampaio avançam com apoio da artilharia.'] };
}
function movementSearch(s, u) {
    const costs = new Map([[key(u.q, u.r), 0]]), previous = new Map(), pending = [[u.q, u.r, 0]];
    while (pending.length) {
        pending.sort((a, b) => a[2] - b[2]);
        const [q, r, spent] = pending.shift();
        if (spent !== costs.get(key(q, r)))
            continue;
        for (const [nq, nr] of neighbors(q, r)) {
            const next = spent + movementCost({ q, r }, { q: nq, r: nr }), k = key(nq, nr);
            if (next > u.mp || s.units.some(v => v.id !== u.id && v.q === nq && v.r === nr))
                continue;
            if (next < (costs.get(k) ?? Infinity)) {
                costs.set(k, next);
                previous.set(k, key(q, r));
                pending.push([nq, nr, next]);
            }
        }
    }
    return { costs, previous };
}
export function reachable(s, u) { const { costs } = movementSearch(s, u); costs.delete(key(u.q, u.r)); return costs; }
export function movementRoute(s, u, q, r) { const { costs, previous } = movementSearch(s, u), origin = key(u.q, u.r); let current = key(q, r); if (!costs.has(current) || current === origin)
    return []; const path = []; while (current !== origin) {
    const [q, r] = current.split(',').map(Number);
    path.unshift({ q, r });
    current = previous.get(current);
} return path; }
export const attackRange = (u) => u.range ?? (u.type === "artillery" ? 3 : 1);
export const isIndirect = (u) => u.indirect ?? (u.type === 'artillery');
export const hasHeightAdvantage = (a, b) => altitude(a.q, a.r) - altitude(b.q, b.r) >= heightThreshold;
export const effectiveAttackRange = (u, v) => attackRange(u) + (!isIndirect(u) && u.heightRange && altitude(u.q, u.r) - altitude(v.q, v.r) >= (u.rangeHeightThreshold ?? 90) ? 1 : 0);
export function canAttack(u, v) {
    return (u.side !== v.side &&
        !u.fired &&
        distance(u, v) <= effectiveAttackRange(u, v) &&
        (isIndirect(u) || lineOfSight(u, v)));
}
export function move(s, id, q, r) {
    const u = s.units.find((v) => v.id === id);
    if (!u || u.side !== s.turn || s.winner)
        return false;
    const n = reachable(s, u).get(key(q, r));
    if (n === undefined)
        return false;
    u.q = q;
    u.r = r;
    u.mp -= n;
    return true;
}
function resolveCombat(s, u, v, rng, reaction = false) {
    const cover = defenseBonus(u, v), barrage = u.side === 'br' && u.type === 'artillery' && s.round === 10 ? 1 : 0;
    const die = 1 + Math.floor(rng() * 6), power = u.atk + barrage + (u.hp - 3) * .5 + die - v.def - cover;
    const previousHP = v.hp, hit = power >= 5 ? 2 : power >= 1 ? 1 : 0, damage = reaction ? Math.min(1, hit) : hit;
    v.hp -= damage;
    if (reaction) {
        u.reactionSpent = true;
        u.fired = true;
        u.mp = 0;
    }
    else {
        u.fired = true;
        u.mp = 0;
    }
    let counter = 0;
    if (!reaction && !v.reactionSpent && !v.suppressed && v.hp > 0 && distance(u, v) === 1 && power <= 0) {
        u.hp--;
        counter = 1;
        if (s.rules?.opportunityFire) {
            v.reactionSpent = true;
            v.fired = true;
            v.mp = 0;
        }
    }
    if (damage > 0 && isIndirect(u))
        v.suppressed = true;
    s.log.unshift(`${reaction ? 'Fogo defensivo · ' : ''}${u.name} → ${v.name}: dado ${die}${barrage ? ' + barragem' : ''}, ${damage} dano${counter ? ', contra-ataque: 1 dano' : ''}${damage > 0 && isIndirect(u) ? ' · reação suprimida' : ''}.`);
    if (s.rules?.retreatOnLoss && previousHP > 1 && v.hp === 1 && canCaptureObjective(v)) {
        const candidates = neighbors(v.q, v.r).map(([q, r]) => ({ q, r })).filter(p => distance(p, u) > distance(v, u) && !s.units.some(w => w.q === p.q && w.r === p.r)).sort((a, b) => distance(b, u) - distance(a, u) || altitude(a.q, a.r) - altitude(b.q, b.r) || a.r - b.r || a.q - b.q);
        if (candidates[0]) {
            v.q = candidates[0].q;
            v.r = candidates[0].r;
            v.mp = 0;
            v.fired = true;
            v.reactionSpent = true;
            v.suppressed = true;
            v.reorganizing = true;
            s.log.unshift(`${v.name}: retirada por perdas para ${v.q + 1}-${v.r + 1}; próxima ação comprometida, sem recuperar PV.`);
        }
    }
    s.units = s.units.filter(v => v.hp > 0);
    checkWinner(s);
    return { die, damage, counter };
}
function canReact(s, defender, target) { return !!s.rules?.opportunityFire && !defender.reactionSpent && !defender.suppressed && !defender.reorganizing && !isIndirect(defender) && hasHeightAdvantage(defender, target) && canAttack({ ...defender, fired: false }, target); }
export function opportunityFire(s, targetId, rng = Math.random) {
    if (s.winner)
        return false;
    const target = s.units.find(u => u.id === targetId);
    if (!target)
        return false;
    const defender = s.units.filter(u => u.side !== target.side && canReact(s, u, target)).sort((a, b) => b.atk - a.atk || distance(a, target) - distance(b, target) || a.id.localeCompare(b.id))[0];
    if (!defender)
        return false;
    resolveCombat(s, defender, target, rng, true);
    return true;
}
export function advance(s, id, q, r, rng = Math.random) {
    const u = s.units.find(v => v.id === id);
    if (!u || u.side !== s.turn || s.winner)
        return false;
    const route = movementRoute(s, u, q, r);
    if (!route.length)
        return false;
    let reacted = false;
    for (const cell of route) {
        u.mp -= movementCost(u, cell);
        u.q = cell.q;
        u.r = cell.r;
        if (!reacted)
            reacted = opportunityFire(s, id, rng);
        if (s.winner || !s.units.some(v => v.id === id) || u.q !== cell.q || u.r !== cell.r)
            break;
    }
    return true;
}
export function attack(s, id, target, rng = Math.random) {
    let u = s.units.find(v => v.id === id), v = s.units.find(v => v.id === target);
    if (!u || !v || s.winner || u.side !== s.turn || !canAttack(u, v))
        return null;
    if (!isIndirect(u) && canReact(s, v, u)) {
        resolveCombat(s, v, u, rng, true);
        u = s.units.find(v => v.id === id);
        if (!u || s.winner)
            return { die: 0, damage: 0, counter: 0, interrupted: true };
        v = s.units.find(v => v.id === target);
    }
    if (!canAttack(u, v))
        return { die: 0, damage: 0, counter: 0, interrupted: true };
    return resolveCombat(s, u, v, rng);
}
export const summitOccupied = (s) => s.units.some(u => u.side === 'br' && canCaptureObjective(u) && u.q === objectives[0].q && u.r === objectives[0].r);
export function checkWinner(s, completedRound) {
    if (s.winner)
        return s.winner;
    if (!s.units.some(u => u.side === 'br' && canCaptureObjective(u)))
        s.winner = 'de';
    else if (s.rules) {
        if (s.score >= targetScore(s) && (!s.rules.requireSummit || (s.summitSecured && summitOccupied(s))))
            s.winner = 'br';
        else if (s.round > roundLimit(s))
            s.winner = s.rules.summitAtDeadlineWins && s.summitSecured && summitOccupied(s) ? 'br' : 'de';
    }
    else if (!s.units.some(u => u.side === 'de') || s.score >= 8)
        s.winner = 'br';
    else if (s.round > LIMIT)
        s.winner = 'de';
    if (s.winner)
        s.finishedRound = completedRound ?? Math.min(s.round, roundLimit(s));
    return s.winner;
}
export function endTurn(s) {
    if (s.winner)
        return;
    const outgoing = s.turn;
    for (const u of s.units.filter(u => u.side === outgoing))
        u.reactionSpent = false;
    if (outgoing === 'br')
        s.turn = 'de';
    else {
        const points = objectives.reduce((n, o) => n + (s.units.some(u => u.side === 'br' && canCaptureObjective(u) && u.q === o.q && u.r === o.r) ? o.points : 0), 0);
        s.score += points;
        s.summitSecured = summitOccupied(s);
        s.log.unshift(`Fim da rodada ${s.round}: +${points} pontos para a FEB.`);
        s.round++;
        s.turn = 'br';
        if (s.round === 10)
            s.log.unshift('16:48 · Concentração de artilharia: ataques da bateria FEB recebem +1 nesta rodada.');
    }
    for (const u of s.units.filter(u => u.side === s.turn)) {
        u.mp = u.reactionSpent || u.reorganizing ? 0 : maximumMovement(u);
        u.fired = !!(u.reactionSpent || u.reorganizing);
        u.reorganizing = false;
        u.suppressed = false;
    }
    checkWinner(s, outgoing === 'de' ? s.round - 1 : undefined);
}
export function victoryAssessment(s) { const rounds = s.finishedRound ?? Math.min(s.round, roundLimit(s)), remaining = s.units.filter(u => u.side === 'br'), lostUnits = 5 - remaining.length, lostCohesion = 15 - remaining.reduce((n, u) => n + u.hp, 0), efficiency = Math.min(s.winner === 'br' && s.rules?.summitAtDeadlineWins && s.score < targetScore(s) ? 44 : 100, Math.max(0, Math.round(100 - (rounds - 1) * 3 - lostUnits * 8 - lostCohesion * 1.5))); return { rounds, lostUnits, lostCohesion, efficiency, grade: s.winner !== 'br' ? 'Defesa bem-sucedida' : efficiency >= 70 ? 'Vitória decisiva' : efficiency >= 45 ? 'Vitória tática' : efficiency >= 20 ? 'Vitória custosa' : 'Vitória pírrica' }; }
export function expectedReactionRisk(s, u) {
    let risk = 0;
    for (const v of s.units) {
        if (v.side === u.side || !canReact(s, v, u))
            continue;
        let damage = 0, kills = 0;
        for (let die = 1; die <= 6; die++) {
            const power = v.atk + (v.hp - 3) * .5 + die - u.def - defenseBonus(v, u), hit = power >= 1 ? 1 : 0;
            damage += hit;
            if (hit >= u.hp)
                kills++;
        }
        risk = Math.max(risk, damage / 6 * 4 + kills / 6 * 10);
    }
    return risk;
}
// Optimistic travel costs: terrain only, without occupied hexes or enemy fire.
export function travelCostsTo(target) {
    const costs = new Map([[key(target.q, target.r), 0]]), pending = [target];
    while (pending.length) {
        pending.sort((a, b) => costs.get(key(a.q, a.r)) - costs.get(key(b.q, b.r)));
        const cell = pending.shift(), base = costs.get(key(cell.q, cell.r));
        for (const [q, r] of neighbors(cell.q, cell.r)) {
            const step = movementCost({ q, r }, cell), n = base + step, k = key(q, r);
            if (n < (costs.get(k) ?? Infinity)) {
                costs.set(k, n);
                pending.push({ q, r });
            }
        }
    }
    return costs;
}
export const objectiveIncome = (s) => objectives.reduce((n, o) => n + (s.units.some(u => u.side === 'br' && canCaptureObjective(u) && u.q === o.q && u.r === o.r) ? o.points : 0), 0);
export function missionForecast(s) {
    const remaining = s.winner ? 0 : Math.max(0, roundLimit(s) - s.round + 1), missing = Math.max(0, targetScore(s) - s.score), income = objectiveIncome(s), costs = travelCostsTo(objectives[0]);
    const arrivals = s.units.filter(u => u.side === 'br' && canCaptureObjective(u)).map(u => { const cost = costs.get(key(u.q, u.r)) ?? Infinity, available = s.turn === 'br' && !u.fired ? u.mp : 0; return s.round + Math.ceil(Math.max(0, cost - available) / maximumMovement(u)); });
    const earliest = arrivals.length ? Math.min(...arrivals) : null;
    return { remaining, missing, income, roundsAtCurrentIncome: missing === 0 ? 0 : income ? Math.ceil(missing / income) : null, lastSummitOnlyRound: roundLimit(s) - Math.ceil(missing / objectives[0].points) + 1, earliestSummitRound: earliest, pointsPossible: missing <= remaining * objectivePointsPerRound(), summit: summitOccupied(s) };
}
export function movementExposure(s, u, q, r) {
    for (const cell of movementRoute(s, u, q, r)) {
        const virtual = { ...u, ...cell }, defenders = s.units.filter(v => v.side !== u.side && canReact(s, v, virtual)).sort((a, b) => b.atk - a.atk || distance(a, virtual) - distance(b, virtual) || a.id.localeCompare(b.id));
        if (defenders.length)
            return { ...cell, defenders: defenders.map(v => v.id) };
    }
    return null;
}
export function operationResult(s) {
    const occupied = summitOccupied(s), noDefenders = !s.units.some(u => u.side === 'de'), noInfantry = !s.units.some(u => u.side === 'br' && canCaptureObjective(u));
    if (!s.winner)
        return { title: 'Operação em andamento', detail: 'O cume e o prazo continuam sendo os objetivos.' };
    if (s.winner === 'br' && !s.rules && !occupied)
        return { title: 'Vitória pelas regras legadas', detail: 'A partida preservou a condição de eliminação de sua versão anterior.' };
    const late = !!s.rules?.summitAtDeadlineWins && s.score < targetScore(s);
    if (s.winner === 'br')
        return { title: late ? 'Vitória custosa — conquista no limite do prazo' : victoryAssessment(s).grade, detail: late ? 'O cume foi assegurado no fechamento final, sem completar a meta de pontos: vitória custosa pela conquista no prazo.' : 'A infantaria assegurou Monte Castelo e cumpriu a pontuação da missão.' };
    if (noInfantry)
        return { title: 'Infantaria de manobra esgotada', detail: 'Restou apoio ou a força saiu de combate; não há infantaria disponível para assegurar o cume.' };
    if (occupied)
        return { title: 'Conquista tardia — missão incompleta', detail: `A infantaria chegou ao cume, mas terminou com ${s.score}/${targetScore(s)} pontos. O prazo encerrou antes de completar a ocupação exigida.` };
    if (noDefenders)
        return { title: 'Defesa eliminada — objetivo não cumprido', detail: 'Os alemães saíram de combate, mas o cume não foi assegurado a tempo. Eliminar a defesa não substitui a missão territorial.' };
    return { title: 'Prazo encerrado — cume não assegurado', detail: s.score >= targetScore(s) ? 'Os pontos foram suficientes, mas faltou assegurar Monte Castelo.' : 'A defesa atrasou a FEB; faltaram cume e/ou pontos no prazo.' };
}
export function missionInstruction(s) {
    if (s.rules?.summitAtDeadlineWins)
        return `Assegure Monte Castelo até o fim da rodada ${roundLimit(s)}. Acumule ${targetScore(s)} pontos e segure o cume para antecipar a vitória. No último fechamento, o cume basta; sem a meta de pontos, a vitória é custosa.`;
    if (!s.rules)
        return `Acumule ${targetScore(s)} pontos ou elimine a defesa em até ${roundLimit(s)} rodadas, conforme as regras legadas desta partida.`;
    return `Acumule ${targetScore(s)} pontos${s.rules.requireSummit ? ' e assegure Monte Castelo com infantaria' : ''} até o fim da rodada ${roundLimit(s)}.`;
}
//# sourceMappingURL=engine.js.map