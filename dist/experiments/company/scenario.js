import { inside } from '../../engine.js';
/** Organization prototype only. It deliberately has no Game/Unit combat stats. */
export function createCompanyScenario() {
    const active = [], reserves = [];
    const battalions = ['I/1º RI', 'II/1º RI', 'III/1º RI'];
    battalions.forEach((battalion, index) => {
        ['A', 'B', 'C'].forEach((scenarioLabel, companyIndex) => {
            const company = {
                id: `br-company-${index + 1}-${scenarioLabel.toLowerCase()}`,
                side: 'br', role: 'rifle-company', echelon: 'company', battalion,
                scenarioLabel, organicSupport: 'integrated', historicalIdentification: 'unconfirmed',
            };
            if (companyIndex < 2)
                active.push({ ...company, q: 1 + index * 2 + companyIndex, r: 7 });
            else
                reserves.push(company);
        });
    });
    const germanPositions = [{ q: 5, r: 1 }, { q: 3, r: 3 }, { q: 6, r: 3 }, { q: 4, r: 1 }];
    germanPositions.forEach((position, index) => {
        if (!inside(position.q, position.r))
            throw new Error('Posição experimental fora do tabuleiro.');
        active.push({
            id: `de-detachment-${index + 1}`, side: 'de', role: 'defensive-detachment',
            echelon: 'unconfirmed', formation: '232ª DI · Heer',
            scenarioRole: index === 3 ? 'local-reserve' : 'prepared-position',
            historicalIdentification: 'unconfirmed', ...position,
        });
    });
    return {
        variant: 'company-experiment', stage: 'roster-only', active, reserves,
        support: ['br', 'de'].map(side => ({
            id: `${side}-off-map-artillery`, side, kind: 'artillery-support',
            location: 'off-map', rules: 'pending', historicalAllocation: 'unconfirmed',
        })),
        historicalDeployment: 'design-hypothesis',
    };
}
//# sourceMappingURL=scenario.js.map