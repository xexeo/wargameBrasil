import { defaultRules } from './scenario.js';
import { relativeCohesion, createGame, endTurn, objectives, canCaptureObjective, battleLosses } from './engine.js';
import { activationOrder, takeAIAction } from './ai.js';
import { learningState, policies } from './learning.js';
import { seededRandom } from './simulator.js';
import { policyFromKey } from './fixed-learning.js';
export const fixedTrainingConfig = Object.freeze({
    episodesPerSide: 2400,
    firstSeed: Object.freeze({ br: 900001, de: 910001 }),
    evaluationFirstSeed: 1900001,
    evaluationGamesPerOpponent: 100,
    evaluationHeadToHeadGames: 100,
    parameters: Object.freeze({ alpha: .18, gamma: .9, epsilonTraining: .2, epsilonInference: 0, hpReward: .6, scoreReward: .7, controlReward: .4, terminalReward: 12 }),
});
function utility(game, side) {
    const p = fixedTrainingConfig.parameters;
    const hp = relativeCohesion(game, side) - relativeCohesion(game, side === 'br' ? 'de' : 'br');
    const control = objectives.reduce((sum, objective) => sum + (game.units.some(unit => unit.side === 'br' && canCaptureObjective(unit) && unit.q === objective.q && unit.r === objective.r) ? objective.points : 0), 0);
    return hp * p.hpReward + (side === 'br' ? 1 : -1) * (game.score * p.scoreReward + control * p.controlReward);
}
export function trainFixedSide(side, episodes = fixedTrainingConfig.episodesPerSide, firstSeed = fixedTrainingConfig.firstSeed[side], onProgress, scale = 'battalion') {
    if (!Number.isSafeInteger(episodes) || episodes < 1 || episodes > 100000 || !Number.isSafeInteger(firstSeed) || firstSeed < 0 || firstSeed + episodes > 0xffffffff)
        throw Error('Invalid fixed-model training configuration.');
    const p = fixedTrainingConfig.parameters, q = {}, games = [];
    const values = (state) => q[state] ?? (q[state] = Array(policies.length).fill(0));
    let updates = 0;
    const update = (previous, game, terminal) => {
        const reward = utility(game, side) - previous.utility + (terminal ? (game.winner === side ? p.terminalReward : -p.terminalReward) : 0);
        const next = terminal ? 0 : Math.max(...values(learningState(game, side)));
        const row = values(previous.state);
        row[previous.action] += p.alpha * (reward + p.gamma * next - row[previous.action]);
        updates++;
    };
    for (let episode = 0; episode < episodes; episode++) {
        const seed = firstSeed + episode, opponent = policies[episode % policies.length], game = createGame(scale === 'company' ? { ...defaultRules, scale } : undefined);
        const dice = seededRandom(seed), explore = seededRandom(seed ^ 0x51f15e), policyTurns = {};
        let previous, turns = 0;
        while (!game.winner) {
            if (++turns > 22)
                throw Error('Fixed-model training exceeded the game turn limit.');
            let chosen = opponent;
            if (game.turn === side) {
                if (previous)
                    update(previous, game, false);
                const state = learningState(game, side), row = values(state), best = Math.max(...row);
                const candidates = row.map((value, index) => value === best ? index : -1).filter(index => index >= 0);
                const action = explore() < p.epsilonTraining ? Math.floor(explore() * policies.length) : candidates[Math.floor(explore() * candidates.length)];
                previous = { state, action, utility: utility(game, side) };
                chosen = policies[action];
                policyTurns[chosen] = (policyTurns[chosen] ?? 0) + 1;
            }
            const policy = policyFromKey(chosen);
            for (const id of activationOrder(game, game.turn)) {
                takeAIAction(game, id, policy.strategy, policy.stance, dice);
                if (game.winner)
                    break;
            }
            if (!game.winner)
                endTurn(game);
        }
        if (previous)
            update(previous, game, true);
        games.push({ seed, learnerSide: side, opponent, winner: game.winner, round: game.finishedRound ?? game.round, score: game.score, reason: game.victoryReason, losses: battleLosses(game), policyTurns, remainingUnits: game.units.map(({ id, hp, q, r }) => ({ id, hp, q, r })) });
        onProgress?.(episode + 1);
    }
    const model = { schema: 1, side, label: side === 'br' ? 'FEB · aprendiz fixo' : 'Alemanha · aprendiz fixo', episodes, updates, generator: 'Mulberry32', seeds: [firstSeed, firstSeed + episodes - 1], parameters: { ...p }, policyKeys: [...policies], opponents: [...policies], fallbackPolicy: side === 'br' ? 'tactical/aggressive' : 'tactical/defensive', tieBreak: 'first-policy', q };
    return { model, games };
}
//# sourceMappingURL=fixed-training.js.map