export interface ScenarioRules {
 freeFireOrder?:boolean;
 retreatOnLoss?:boolean;
 summitAtDeadlineWins?:boolean;
 roundLimit:number;
 targetScore:number;
 requireSummit:boolean;
 opportunityFire:boolean;
 highGroundRange:boolean;
 rangeHeightThreshold:number;
}
// Design parameters, not historical measurements. Calibrate rules, not the map.
export const defaultRules:ScenarioRules={freeFireOrder:true,retreatOnLoss:true,summitAtDeadlineWins:true,roundLimit:10,targetScore:8,requireSummit:true,opportunityFire:true,highGroundRange:true,rangeHeightThreshold:90};
export const heightThreshold=30;
export function validRules(value:unknown):value is ScenarioRules {
 const r=value as ScenarioRules;return !!r&&Number.isInteger(r.roundLimit)&&r.roundLimit>=6&&r.roundLimit<=10&&Number.isInteger(r.targetScore)&&r.targetScore>=2&&r.targetScore<=12&&typeof r.requireSummit==='boolean'&&typeof r.opportunityFire==='boolean'&&typeof r.highGroundRange==='boolean'&&(r.freeFireOrder===undefined||typeof r.freeFireOrder==='boolean')&&(r.retreatOnLoss===undefined||typeof r.retreatOnLoss==='boolean')&&(r.summitAtDeadlineWins===undefined||typeof r.summitAtDeadlineWins==='boolean')&&(r.rangeHeightThreshold===undefined||(Number.isFinite(r.rangeHeightThreshold)&&r.rangeHeightThreshold>=30&&r.rangeHeightThreshold<=150));
}
