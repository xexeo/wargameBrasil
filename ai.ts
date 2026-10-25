import {
  type Game,
  type Unit,
  distance,
  objectives,
  terrain,
  reachable,
  canAttack,
  attackRange,
  move,
} from "./engine.js";

export function chooseTarget(s: Game, u: Unit, mode: string) {
  const enemies = s.units.filter((v) => v.side !== u.side);
  return enemies.sort((a, b) => {
    const da = distance(u, a),
      db = distance(u, b);
    if (mode === "strong") return b.atk - a.atk || da - db;
    if (mode === "weak") return a.def - b.def || da - db;
    return a.hp + a.def * 0.3 + da * 0.7 - (b.hp + b.def * 0.3 + db * 0.7);
  })[0];
}
export function aiAction(
  s: Game,
  id: string,
  mode = "tactical",
  stance = "defensive",
) {
  const u = s.units.find((v) => v.id === id);
  if (!u || s.winner || u.side !== s.turn) return null;
  const target = chooseTarget(s, u, mode);
  if (!target) return null;
  let cells = [
    { q: u.q, r: u.r, spent: 0 },
    ...Array.from(reachable(s, u), ([k, spent]) => {
      const [q, r] = k.split(",").map(Number);
      return { q, r, spent };
    }),
  ];
  const evaluate = (p) => {
    const virtual = { ...u, ...p };
    const d = distance(p, target),
      hill = objectives.find((o) => o.q === p.q && o.r === p.r);
    let value = -d * (stance === "aggressive" ? 2 : 1);
    if (canAttack(virtual, target)) value += 6;
    if (stance === "defensive") {
      value += hill ? 6 : 0;
      value += ["hill", "forest"].includes(terrain(p.q, p.r)) ? 1.5 : 0;
    }
    if (mode === "tactical") {
      const threats = s.units
        .filter((v) => v.side !== u.side && distance(p, v) <= attackRange(v))
        .reduce((n, v) => n + v.atk, 0);
      value -= threats * 0.35;
      value += hill ? 4 : 0;
      value +=
        s.units.filter(
          (v) => v.side === u.side && v.id !== u.id && distance(p, v) === 1,
        ).length * 0.6;
      if (
        hill &&
        s.units.some((v) => v.side !== u.side && distance(v, hill) <= 2)
      )
        value += 3;
    }
    return value - p.spent * 0.04;
  };
  cells.sort((a, b) => evaluate(b) - evaluate(a));
  const dest = cells[0];
  if (dest.spent) move(s, u.id, dest.q, dest.r);
  const inRange = s.units.filter((v) => canAttack(u, v));
  inRange.sort((a, b) =>
    mode === "strong"
      ? b.atk - a.atk || distance(u, a) - distance(u, b)
      : mode === "weak"
        ? a.def - b.def || distance(u, a) - distance(u, b)
        : a.hp + a.def - (b.hp + b.def),
  );
  return inRange[0] ? { attacker: u.id, target: inRange[0].id } : null;
}
