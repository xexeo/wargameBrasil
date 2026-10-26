import { operationResult } from './engine.js';
// Neutralizing the entire defense secures the mission without a final hex move.
// This explains the existing victory rule; it does not move counters or add points.
export function operationPresentation(game) {
    const result = operationResult(game);
    if (game.winner !== 'br' || game.units.some(u => u.side === 'de'))
        return result;
    return { ...result, detail: 'Não restam peças alemãs em combate. Monte Castelo está assegurado pela FEB. A vitória por neutralização dispensa ocupar o hexágono do cume e completar a meta de pontos. Peças fora de combate não equivalem a todos os soldados mortos.' };
}
//# sourceMappingURL=outcome-presentation.js.map