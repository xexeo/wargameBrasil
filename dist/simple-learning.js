import { policies } from './learning.js';
// Keep the existing browser keys, including the original unprefixed German keys.
export function chooseSimplePolicy(memory, side, rng = Math.random) {
    const keys = policies.map(key => side === 'br' ? `br:${key}` : key);
    if (rng() < .2)
        return keys[Math.floor(rng() * keys.length)];
    return [...keys].sort((a, b) => (Number(memory.q[b]) || 0) - (Number(memory.q[a]) || 0) || rng() - .5)[0];
}
export function updateSimplePolicy(memory, policy, reward, terminal = false) {
    if (!policy)
        return false;
    const previous = Number(memory.q[policy]) || 0;
    const future = terminal ? 0 : .85 * Math.max(0, ...Object.entries(memory.q)
        .filter(([key, value]) => key.startsWith('br:') === policy.startsWith('br:') && Number.isFinite(value))
        .map(([, value]) => value));
    memory.q[policy] = previous + .2 * (reward + future - previous);
    memory.visits[policy] = (Number(memory.visits[policy]) || 0) + 1;
    return true;
}
//# sourceMappingURL=simple-learning.js.map