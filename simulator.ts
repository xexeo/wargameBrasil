import {defaultRules,type ScenarioRules} from "./scenario.js";
import {
  createGame,
  attack,
  endTurn,
  objectives,
  elevation,
  canCaptureObjective,
  type Game,
  type Side,
} from "./engine.js";
import { activationOrder,takeAIAction } from "./ai.js";

export type Strategy = "strong" | "weak" | "tactical";
export type Stance = "aggressive" | "defensive";
export interface SimulationOptions {
  seed: number;
  strategy?: Strategy;
  stance?: Stance;
  record?: boolean;
  setup?: (game: Game) => void;
  rules?:Partial<ScenarioRules>;
}
export interface MatchResult {
  generator: "Mulberry32";
  seed: number;
  winner: Side;
  round: number;
  score: number;
  reason: "elimination" | "points" | "time" | "maneuver";
  summitOccupied: boolean;
  attacks: number;
  uphillAttacks: number;
  history: Game[];
}
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    // Mulberry32 mixes adjacent seeds; a plain LCG correlated their first dice.
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
// No DOM, storage, timer or visual dependency. Both sides use exactly the same policy.
export function simulate(options: SimulationOptions): MatchResult {
  const game = createGame({...defaultRules,...options.rules});
  options.setup?.(game);
  const random = seededRandom(options.seed),
    history: Game[] = [];
  let attacks = 0,
    uphillAttacks = 0,
    turns = 0;
  while (!game.winner) {
    if (++turns > 22)
      throw new Error("Partida não terminou no limite previsto.");
    for(const id of activationOrder(game)){
      const result=takeAIAction(game,id,options.strategy??'tactical',options.stance??'aggressive',random);
      if(result?.attack){attacks++;if(result.uphill)uphillAttacks++;}
      if(game.winner)break;
    }
    if (!game.winner) endTurn(game);
    if (options.record) history.push(structuredClone(game));
  }
  const eliminated =
    !game.units.some((u) => u.side === "br") ||
    !game.units.some((u) => u.side === "de");
  return {
    generator: "Mulberry32",
    seed: options.seed,
    winner: game.winner,
    round: game.finishedRound??Math.min(game.round, 10),
    score: game.score,
    reason:game.winner==='br'?'points':!game.units.some(u=>u.side==='br'&&canCaptureObjective(u))?'maneuver':eliminated?'elimination':'time',
    summitOccupied: game.units.some(
      (u) =>
        u.side === "br" && canCaptureObjective(u) && u.q === objectives[0].q && u.r === objectives[0].r,
    ),
    attacks,
    uphillAttacks,
    history,
  };
}
export function tournament(
  count: number,
  firstSeed = 1,
  options: Omit<SimulationOptions, "seed" | "record"> = {},
) {
  if (!Number.isInteger(count) || count < 1 || count > 100000)
    throw new Error("Número de partidas inválido.");
  const results = Array.from({ length: count }, (_, i) =>
    simulate({ ...options, seed: firstSeed + i }),
  );
  const br = results.filter((r) => r.winner === "br").length;
  const p = br / count,
    z = 1.96,
    den = 1 + (z * z) / count,
    center = (p + (z * z) / (2 * count)) / den,
    half =
      (z * Math.sqrt((p * (1 - p)) / count + (z * z) / (4 * count * count))) /
      den;
  return {
    generator: "Mulberry32",
    count,
    firstSeed,
    lastSeed: firstSeed + count - 1,
    strategy: options.strategy ?? "tactical",
    stance: options.stance ?? "aggressive",
    wins: { br, de: count - br },
    brRate: p,
    interval95: [center - half, center + half],
    meanRound: results.reduce((n, r) => n + r.round, 0) / count,
    reasons: {
      elimination: results.filter((r) => r.reason === "elimination").length,
      points: results.filter((r) => r.reason === "points").length,
      time: results.filter((r) => r.reason === "time").length,
      maneuver:results.filter(r=>r.reason==='maneuver').length,
    },
    brSummitAtEnd: results.filter((r) => r.summitOccupied).length,
  };
}
