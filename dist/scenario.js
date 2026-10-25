// Design parameters, not historical measurements. Calibrate rules, not the map.
export const defaultRules = { roundLimit: 10, targetScore: 8, requireSummit: true, opportunityFire: true, highGroundRange: true, rangeHeightThreshold: 90 };
export const heightThreshold = 30;
export function validRules(value) {
    const r = value;
    return !!r && Number.isInteger(r.roundLimit) && r.roundLimit >= 6 && r.roundLimit <= 10 && Number.isInteger(r.targetScore) && r.targetScore >= 2 && r.targetScore <= 12 && typeof r.requireSummit === 'boolean' && typeof r.opportunityFire === 'boolean' && typeof r.highGroundRange === 'boolean' && (r.rangeHeightThreshold === undefined || (Number.isFinite(r.rangeHeightThreshold) && r.rangeHeightThreshold >= 30 && r.rangeHeightThreshold <= 150));
}
//# sourceMappingURL=scenario.js.map