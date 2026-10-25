export const COLS = 9, ROWS = 8, LIMIT = 10;
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
    { q: 3, r: 3, name: "Esporão ocidental", points: 1 },
    { q: 6, r: 3, name: "Crista oriental", points: 1 },
];
export function terrain(q, r) {
    if (objectives.some((o) => o.q === q && o.r === r))
        return "hill";
    if (["2,2", "3,1", "4,2", "6,2", "7,1", "5,4", "1,4", "7,4"].includes(key(q, r)))
        return "forest";
    if (["2,5", "3,5", "4,5", "5,5", "6,5"].includes(key(q, r)))
        return "road";
    return "plain";
}
// Relative terrain levels: a tactical abstraction, not surveyed heights.
export function elevation(q, r) {
    if (q === 5 && r === 1)
        return 4;
    if (r <= 2)
        return 3;
    if (r <= 4)
        return 2;
    return 1;
}
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
        const sight = elevation(a.q, a.r) + (elevation(b.q, b.r) - elevation(a.q, a.r)) * t;
        if (elevation(rx, rz) > sight || terrain(rx, rz) === "forest")
            return false;
    }
    return true;
}
export function defenseBonus(a, b) {
    return ((["hill", "forest"].includes(terrain(b.q, b.r)) ? 1 : 0) +
        (elevation(b.q, b.r) > elevation(a.q, a.r) ? 1 : 0));
}
const make = (id, side, q, r, name, type, atk, def) => ({
    id,
    side,
    q,
    r,
    name,
    type,
    atk,
    def,
    hp: 3,
    mp: type === "armor" ? 4 : 3,
    fired: false,
});
export function createGame() {
    return {
        round: 1,
        turn: "br",
        score: 0,
        winner: null,
        units: [
            make("b1", "br", 1, 6, "Batalhão Franklin", "infantry", 3, 3),
            make("b2", "br", 3, 6, "Batalhão Uzeda", "infantry", 4, 3),
            make("b3", "br", 5, 6, "Batalhão Sizeno", "infantry", 3, 4),
            make("b4", "br", 6, 6, "Pelotão de apoio", "infantry", 4, 3),
            make("b5", "br", 2, 7, "Artilharia FEB", "artillery", 4, 2),
            make("g1", "de", 5, 1, "Defesa do Castelo", "infantry", 4, 4),
            make("g2", "de", 3, 3, "Guarnição da cota", "infantry", 3, 3),
            make("g3", "de", 6, 3, "Posto avançado", "infantry", 3, 3),
            make("g4", "de", 4, 1, "Reserva de montanha", "infantry", 4, 3),
            make("g5", "de", 7, 2, "Bateria de montanha", "artillery", 4, 2),
        ],
        log: ["21 de fevereiro de 1945. A FEB avança sobre Monte Castelo."],
    };
}
export function reachable(s, u) {
    const result = new Map([[key(u.q, u.r), 0]]), pending = [[u.q, u.r, 0]];
    while (pending.length) {
        pending.sort((a, b) => a[2] - b[2]);
        const [q, r, spent] = pending.shift();
        for (const [nq, nr] of neighbors(q, r)) {
            const n = spent + movementCost({ q, r }, { q: nq, r: nr }), k = key(nq, nr);
            if (n > u.mp ||
                s.units.some((v) => v.id !== u.id && v.q === nq && v.r === nr))
                continue;
            if (n < (result.get(k) ?? Infinity)) {
                result.set(k, n);
                pending.push([nq, nr, n]);
            }
        }
    }
    result.delete(key(u.q, u.r));
    return result;
}
export function canAttack(u, v) {
    return (u.side !== v.side &&
        !u.fired &&
        distance(u, v) <= (u.type === "artillery" ? 2 : 1) &&
        lineOfSight(u, v));
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
export function attack(s, id, target, rng = Math.random) {
    const u = s.units.find((v) => v.id === id), v = s.units.find((v) => v.id === target);
    if (!u || !v || s.winner || u.side !== s.turn || !canAttack(u, v))
        return null;
    const cover = defenseBonus(u, v);
    const barrage = u.side === "br" && u.type === "artillery" && s.round === 10 ? 1 : 0;
    const die = 1 + Math.floor(rng() * 6), power = u.atk + barrage + (u.hp - 3) * 0.5 + die - v.def - cover;
    const damage = power >= 5 ? 2 : power >= 1 ? 1 : 0;
    v.hp -= damage;
    u.fired = true;
    u.mp = 0;
    let counter = 0;
    if (v.hp > 0 && distance(u, v) === 1 && power <= 0) {
        u.hp--;
        counter = 1;
    }
    s.log.unshift(`${u.name} → ${v.name}: dado ${die}${barrage ? " + barragem" : ""}, ${damage} dano${counter ? ", contra-ataque: 1 dano" : ""}.`);
    s.units = s.units.filter((v) => v.hp > 0);
    checkWinner(s);
    return { die, damage, counter };
}
export function checkWinner(s) {
    if (!s.units.some((u) => u.side === "br"))
        s.winner = "de";
    else if (!s.units.some((u) => u.side === "de") || s.score >= 8)
        s.winner = "br";
    else if (s.round > LIMIT)
        s.winner = s.score >= 8 ? "br" : "de";
    return s.winner;
}
export function endTurn(s) {
    if (s.winner)
        return;
    if (s.turn === "br")
        s.turn = "de";
    else {
        const points = objectives.reduce((sum, o) => sum +
            (s.units.some((u) => u.side === "br" && u.q === o.q && u.r === o.r)
                ? o.points
                : 0), 0);
        s.score += points;
        s.log.unshift(`Fim da rodada ${s.round}: +${points} pontos para a FEB.`);
        s.round++;
        if (s.round === 10)
            s.log.unshift("16:48 · Concentração de artilharia: ataques da bateria FEB recebem +1 nesta rodada.");
        s.turn = "br";
    }
    for (const u of s.units.filter((u) => u.side === s.turn)) {
        u.mp = u.type === "armor" ? 4 : 3;
        u.fired = false;
    }
    checkWinner(s);
}
export function chooseTarget(s, u, mode) {
    const enemies = s.units.filter((v) => v.side !== u.side);
    return enemies.sort((a, b) => {
        const da = distance(u, a), db = distance(u, b);
        if (mode === "strong")
            return b.atk - a.atk || da - db;
        if (mode === "weak")
            return a.def - b.def || da - db;
        return a.hp + a.def * 0.3 + da * 0.7 - (b.hp + b.def * 0.3 + db * 0.7);
    })[0];
}
export function aiAction(s, id, mode = "tactical", stance = "defensive") {
    const u = s.units.find((v) => v.id === id);
    if (!u || s.winner || u.side !== s.turn)
        return null;
    const target = chooseTarget(s, u, mode);
    if (!target)
        return null;
    let cells = [
        { q: u.q, r: u.r, spent: 0 },
        ...Array.from(reachable(s, u), ([k, spent]) => {
            const [q, r] = k.split(",").map(Number);
            return { q, r, spent };
        }),
    ];
    const evaluate = (p) => {
        const virtual = { ...u, ...p };
        const d = distance(p, target), hill = objectives.find((o) => o.q === p.q && o.r === p.r);
        let value = -d * (stance === "aggressive" ? 2 : 1);
        if (canAttack(virtual, target))
            value += 6;
        if (stance === "defensive") {
            value += hill ? 6 : 0;
            value += ["hill", "forest"].includes(terrain(p.q, p.r)) ? 1.5 : 0;
        }
        if (mode === "tactical") {
            const threats = s.units
                .filter((v) => v.side !== u.side &&
                distance(p, v) <= (v.type === "artillery" ? 2 : 1))
                .reduce((n, v) => n + v.atk, 0);
            value -= threats * 0.35;
            value += hill ? 4 : 0;
            value +=
                s.units.filter((v) => v.side === u.side && v.id !== u.id && distance(p, v) === 1).length * 0.6;
            if (hill &&
                s.units.some((v) => v.side !== u.side && distance(v, hill) <= 2))
                value += 3;
        }
        return value - p.spent * 0.04;
    };
    cells.sort((a, b) => evaluate(b) - evaluate(a));
    const dest = cells[0];
    if (dest.spent)
        move(s, u.id, dest.q, dest.r);
    const inRange = s.units.filter((v) => canAttack(u, v));
    inRange.sort((a, b) => mode === "strong"
        ? b.atk - a.atk || distance(u, a) - distance(u, b)
        : mode === "weak"
            ? a.def - b.def || distance(u, a) - distance(u, b)
            : a.hp + a.def - (b.hp + b.def));
    return inRange[0] ? { attacker: u.id, target: inRange[0].id } : null;
}
//# sourceMappingURL=engine.js.map