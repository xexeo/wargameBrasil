import { createGame, attack, endTurn, objectives, elevation } from "./engine.js";
import { aiAction } from "./ai.js";
export function seededRandom(seed) {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(1664525, state) + 1013904223) >>> 0;
        return state / 4294967296;
    };
}
// No DOM, storage, timer or visual dependency. Both sides use exactly the same policy.
export function simulate(options) {
    const game = createGame();
    options.setup?.(game);
    const random = seededRandom(options.seed), history = [];
    let attacks = 0, uphillAttacks = 0, turns = 0;
    while (!game.winner) {
        if (++turns > 22)
            throw new Error("Partida não terminou no limite previsto.");
        for (const id of game.units.filter(u => u.side === game.turn).map(u => u.id)) {
            const action = aiAction(game, id, options.strategy ?? "tactical", options.stance ?? "aggressive");
            if (action) {
                attacks++;
                const source = game.units.find(u => u.id === action.attacker);
                const target = game.units.find(u => u.id === action.target);
                // Track the exposure of assaulting units without imposing a historical result.
                if (elevation(target.q, target.r) > elevation(source.q, source.r))
                    uphillAttacks++;
                attack(game, action.attacker, action.target, random);
            }
            if (game.winner)
                break;
        }
        if (!game.winner)
            endTurn(game);
        if (options.record)
            history.push(structuredClone(game));
    }
    const eliminated = !game.units.some(u => u.side === "br") || !game.units.some(u => u.side === "de");
    return { seed: options.seed, winner: game.winner, round: Math.min(game.round, 10), score: game.score,
        reason: eliminated ? "elimination" : game.score >= 8 ? "points" : "time",
        summitOccupied: game.units.some(u => u.side === "br" && u.q === objectives[0].q && u.r === objectives[0].r),
        attacks, uphillAttacks, history };
}
export function tournament(count, firstSeed = 1, options = {}) {
    if (!Number.isInteger(count) || count < 1 || count > 100000)
        throw new Error("Número de partidas inválido.");
    const results = Array.from({ length: count }, (_, i) => simulate({ ...options, seed: firstSeed + i }));
    const br = results.filter(r => r.winner === "br").length;
    const p = br / count, z = 1.96, den = 1 + z * z / count, center = (p + z * z / (2 * count)) / den, half = z * Math.sqrt(p * (1 - p) / count + z * z / (4 * count * count)) / den;
    return { count, firstSeed, lastSeed: firstSeed + count - 1, strategy: options.strategy ?? "tactical", stance: options.stance ?? "aggressive", wins: { br, de: count - br }, brRate: p, interval95: [center - half, center + half], meanRound: results.reduce((n, r) => n + r.round, 0) / count, reasons: { elimination: results.filter(r => r.reason === 'elimination').length, points: results.filter(r => r.reason === 'points').length, time: results.filter(r => r.reason === 'time').length }, brSummitAtEnd: results.filter(r => r.summitOccupied).length };
}
//# sourceMappingURL=simulator.js.map