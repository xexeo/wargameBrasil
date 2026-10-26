import { companyFixedModels } from './company-models.js';
import { scaleOf } from './engine.js';
import { learningState, policies } from './learning.js';
import { fixedModels } from './fixed-models.js';
export function policyFromKey(key) {
    const [strategy, stance] = key.split('/');
    return { strategy, stance };
}
// Pure inference: no RNG, no storage, no new rows and no updates to the model.
export function choosePolicyFromFixedModel(game, model) {
    const row = model.q[learningState(game, model.side)];
    if (!row || row.length !== policies.length || !row.every(Number.isFinite))
        return policyFromKey(model.fallbackPolicy);
    let best = 0;
    for (let index = 1; index < row.length; index++)
        if (row[index] > row[best])
            best = index;
    return policyFromKey(model.policyKeys[best]);
}
export function chooseFixedPolicy(game, side) {
    const model = modelsForGame(game)[side];
    return model ? choosePolicyFromFixedModel(game, model) : policyFromKey(side === 'br' ? 'tactical/aggressive' : 'tactical/defensive');
}
export const modelsForGame = (game) => scaleOf(game) === 'company' ? companyFixedModels : fixedModels;
//# sourceMappingURL=fixed-learning.js.map