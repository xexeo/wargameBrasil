import { distance, objectives, terrain, reachable, canAttack, attackRange, move, canCaptureObjective, advance, attack, hasHeightAdvantage, effectiveAttackRange, expectedReactionRisk, } from "./engine.js";
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
    const enemyTarget = chooseTarget(s, u, mode);
    if (!enemyTarget && canCaptureObjective(u) && u.q === objectives[0].q && u.r === objectives[0].r)
        return null;
    const freeObjective = objectives.find(o => !s.units.some(v => v.side === u.side && canCaptureObjective(v) && v.q === o.q && v.r === o.r));
    const target = enemyTarget ?? (freeObjective ? { ...u, ...freeObjective, id: 'objective', side: u.side === 'br' ? 'de' : 'br' } : undefined);
    if (!target)
        return null;
    let cells = [
        { q: u.q, r: u.r, spent: 0 },
        ...Array.from(reachable(s, u), ([k, spent]) => {
            const [q, r] = k.split(",").map(Number);
            return { q, r, spent };
        }),
    ];
    const fireSupport = !canCaptureObjective(u);
    const evaluate = (p) => {
        const virtual = { ...u, ...p };
        const d = distance(p, target), hill = !fireSupport && objectives.find((o) => o.q === p.q && o.r === p.r);
        let value = fireSupport ? -Math.abs(d - attackRange(u)) * 1.5 : -d * (stance === 'aggressive' ? 2 : 1);
        if (fireSupport && d === 1)
            value -= 4;
        if (fireSupport && objectives.some(o => o.q === p.q && o.r === p.r))
            value -= 4;
        if (enemyTarget && canAttack(virtual, target))
            value += 6;
        if (stance === "defensive") {
            value += hill ? 6 : 0;
            value += ["hill", "forest"].includes(terrain(p.q, p.r)) ? 1.5 : 0;
        }
        if (mode === "tactical") {
            if (p.spent > 0)
                value -= expectedReactionRisk(s, virtual);
            const threats = s.units
                .filter((v) => v.side !== u.side && distance(p, v) <= effectiveAttackRange(v, virtual))
                .reduce((n, v) => n + v.atk, 0);
            value -= threats * (fireSupport ? .7 : .35);
            value += hill ? 4 : 0;
            if (!fireSupport && u.side === 'br' && s.rules?.requireSummit) {
                value -= distance(p, objectives[0]) * .8;
                if (p.q === objectives[0].q && p.r === objectives[0].r)
                    value += 8;
            }
            value +=
                s.units.filter((v) => v.side === u.side && v.id !== u.id && distance(p, v) === 1).length * 0.6;
            if (hill &&
                s.units.some((v) => v.side !== u.side && distance(v, hill) <= 2))
                value += 3;
        }
        return value - p.spent * 0.04;
    };
    const ratings = new Map(cells.map(p => [`${p.q},${p.r}`, evaluate(p)]));
    cells.sort((a, b) => ratings.get(`${b.q},${b.r}`) - ratings.get(`${a.q},${a.r}`));
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
export function activationOrder(s, side = s.turn) { return s.units.filter(u => u.side === side).sort((a, b) => Number(canCaptureObjective(a)) - Number(canCaptureObjective(b)) || attackRange(b) - attackRange(a) || a.id.localeCompare(b.id)).map(u => u.id); }
export function takeAIAction(s, id, mode = 'tactical', stance = 'defensive', rng = Math.random) {
    const source = s.units.find(u => u.id === id);
    if (!source || s.winner)
        return null;
    const plan = structuredClone(s), intent = aiAction(plan, id, mode, stance), destination = plan.units.find(u => u.id === id);
    const moved = source.q !== destination.q || source.r !== destination.r;
    if (moved)
        advance(s, id, destination.q, destination.r, rng);
    if (s.winner || !s.units.some(u => u.id === id))
        return { moved, attack: null, uphill: false };
    const target = intent ? s.units.find(u => u.id === intent.target) : undefined, uphill = target ? hasHeightAdvantage(target, source) : false;
    const shot = intent ? attack(s, intent.attacker, intent.target, rng) : null;
    return { moved, attack: shot, uphill };
}
//# sourceMappingURL=ai.js.map