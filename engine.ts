export type Side = "br" | "de";
export type UnitType = "infantry" | "armor" | "artillery";
export interface Unit {
  id: string;
  side: Side;
  q: number;
  r: number;
  name: string;
  type: UnitType;
  atk: number;
  def: number;
  hp: number;
  mp: number;
  fired: boolean;
}
export interface Game {
  round: number;
  turn: Side;
  score: number;
  winner: Side | null;
  units: Unit[];
  log: string[];
}
export interface Cell {
  q: number;
  r: number;
}
// Prepared positions are scenario abstractions, not surveyed bunker locations.
export const fortifications = [{q:5,r:1,level:1},{q:3,r:3,level:1}];
export function fortification(q:number,r:number):number{return fortifications.find(f=>f.q===q&&f.r===r)?.level??0;}
export const COLS = 9,
  ROWS = 8,
  LIMIT = 10;
export const key = (q, r) => `${q},${r}`;
export const inside = (q, r) => q >= 0 && r >= 0 && q < COLS && r < ROWS;
export const distance = (a, b) =>
  (Math.abs(a.q - b.q) +
    Math.abs(a.r - b.r) +
    Math.abs(a.q + a.r - b.q - b.r)) /
  2;
export const neighbors = (q, r) =>
  [
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
  if (objectives.some((o) => o.q === q && o.r === r)) return "hill";
  if (
    ["2,2", "3,1", "4,2", "6,2", "7,1", "5,4", "1,4", "7,4"].includes(key(q, r))
  )
    return "forest";
  if (["2,5", "3,5", "4,5", "5,5", "6,5"].includes(key(q, r))) return "road";
  return "plain";
}
// Relative terrain levels: a tactical abstraction, not surveyed heights.
export function elevation(q: number, r: number): number {
  if (q === 5 && r === 1) return 4;
  if (r <= 2) return 3;
  if (r <= 4) return 2;
  return 1;
}
export const clock = (round: number) => {
  const minutes = 360 + (Math.min(round, 11) - 1) * 72;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
};
export function movementCost(from: Cell, to: Cell): number {
  return (
    (terrain(to.q, to.r) === "forest" ? 2 : 1) +
    Math.max(0, elevation(to.q, to.r) - elevation(from.q, from.r))
  );
}
export const cost = (q, r) =>
  ["hill", "forest"].includes(terrain(q, r)) ? 2 : 1;
export function lineOfSight(a: Cell, b: Cell): boolean {
  const n = distance(a, b);
  if (n <= 1) return true;
  for (let i = 1; i < n; i++) {
    const t = i / n,
      x = a.q + (b.q - a.q) * t,
      z = a.r + (b.r - a.r) * t,
      y = -x - z;
    let rx = Math.round(x),
      ry = Math.round(y),
      rz = Math.round(z);
    const dx = Math.abs(rx - x),
      dy = Math.abs(ry - y),
      dz = Math.abs(rz - z);
    if (dx > dy && dx > dz) rx = -ry - rz;
    else if (dy > dz) ry = -rx - rz;
    else rz = -rx - ry;
    const sight =
      elevation(a.q, a.r) + (elevation(b.q, b.r) - elevation(a.q, a.r)) * t;
    if (elevation(rx, rz) > sight || terrain(rx, rz) === "forest") return false;
  }
  return true;
}
export function defenseBonus(a: Cell, b: Cell): number {
  return (
    Math.max(["hill", "forest"].includes(terrain(b.q, b.r)) ? 1 : 0,fortification(b.q,b.r)) +
    (elevation(b.q, b.r) > elevation(a.q, a.r) ? 1 : 0)
  );
}

const make = (
  id: string,
  side: Side,
  q: number,
  r: number,
  name: string,
  type: UnitType,
  atk: number,
  def: number,
): Unit => ({
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
export function createGame(): Game {
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
export function reachable(s: Game, u: Unit) {
  const result = new Map([[key(u.q, u.r), 0]]),
    pending = [[u.q, u.r, 0]];
  while (pending.length) {
    pending.sort((a, b) => a[2] - b[2]);
    const [q, r, spent] = pending.shift()!;
    for (const [nq, nr] of neighbors(q, r)) {
      const n = spent + movementCost({ q, r }, { q: nq, r: nr }),
        k = key(nq, nr);
      if (
        n > u.mp ||
        s.units.some((v) => v.id !== u.id && v.q === nq && v.r === nr)
      )
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
export function canAttack(u: Unit, v: Unit) {
  return (
    u.side !== v.side &&
    !u.fired &&
    distance(u, v) <= (u.type === "artillery" ? 2 : 1) &&
    lineOfSight(u, v)
  );
}
export function move(s: Game, id: string, q: number, r: number) {
  const u = s.units.find((v) => v.id === id);
  if (!u || u.side !== s.turn || s.winner) return false;
  const n = reachable(s, u).get(key(q, r));
  if (n === undefined) return false;
  u.q = q;
  u.r = r;
  u.mp -= n;
  return true;
}
export function attack(s: Game, id: string, target: string, rng = Math.random) {
  const u = s.units.find((v) => v.id === id),
    v = s.units.find((v) => v.id === target);
  if (!u || !v || s.winner || u.side !== s.turn || !canAttack(u, v))
    return null;
  const cover = defenseBonus(u, v);
  const barrage =
    u.side === "br" && u.type === "artillery" && s.round === 10 ? 1 : 0;
  const die = 1 + Math.floor(rng() * 6),
    power = u.atk + barrage + (u.hp - 3) * 0.5 + die - v.def - cover;
  const damage = power >= 5 ? 2 : power >= 1 ? 1 : 0;
  v.hp -= damage;
  u.fired = true;
  u.mp = 0;
  let counter = 0;
  if (v.hp > 0 && distance(u, v) === 1 && power <= 0) {
    u.hp--;
    counter = 1;
  }
  s.log.unshift(
    `${u.name} → ${v.name}: dado ${die}${barrage ? " + barragem" : ""}, ${damage} dano${counter ? ", contra-ataque: 1 dano" : ""}.`,
  );
  s.units = s.units.filter((v) => v.hp > 0);
  checkWinner(s);
  return { die, damage, counter };
}
export function checkWinner(s: Game) {
  if (!s.units.some((u) => u.side === "br")) s.winner = "de";
  else if (!s.units.some((u) => u.side === "de") || s.score >= 8)
    s.winner = "br";
  else if (s.round > LIMIT) s.winner = s.score >= 8 ? "br" : "de";
  return s.winner;
}
export function endTurn(s: Game) {
  if (s.winner) return;
  if (s.turn === "br") s.turn = "de";
  else {
    const points = objectives.reduce(
      (sum, o) =>
        sum +
        (s.units.some((u) => u.side === "br" && u.q === o.q && u.r === o.r)
          ? o.points
          : 0),
      0,
    );
    s.score += points;
    s.log.unshift(`Fim da rodada ${s.round}: +${points} pontos para a FEB.`);
    s.round++;
    if (s.round === 10)
      s.log.unshift(
        "16:48 · Concentração de artilharia: ataques da bateria FEB recebem +1 nesta rodada.",
      );
    s.turn = "br";
  }
  for (const u of s.units.filter((u) => u.side === s.turn)) {
    u.mp = u.type === "armor" ? 4 : 3;
    u.fired = false;
  }
  checkWinner(s);
}
