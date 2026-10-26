import type {Game,Side} from './engine.js';
import {learningState,policies} from './learning.js';
import {fixedModels} from './fixed-models.js';

export type FixedPolicyKey=typeof policies[number];
export interface FixedPolicy {strategy:string;stance:string}
export interface FixedParameters {
 alpha:number;gamma:number;epsilonTraining:number;epsilonInference:0;
 hpReward:number;scoreReward:number;controlReward:number;terminalReward:number;
}
export interface FixedModel {
 schema:1;side:Side;label:string;episodes:number;updates:number;
 generator:'Mulberry32';seeds:readonly [number,number];
 parameters:Readonly<FixedParameters>;
 policyKeys:readonly FixedPolicyKey[];opponents:readonly FixedPolicyKey[];
 fallbackPolicy:FixedPolicyKey;tieBreak:'first-policy';
 q:Readonly<Record<string,readonly number[]>>;
}
export function policyFromKey(key:FixedPolicyKey):FixedPolicy {
 const [strategy,stance]=key.split('/');return {strategy,stance};
}
// Pure inference: no RNG, no storage, no new rows and no updates to the model.
export function choosePolicyFromFixedModel(game:Game,model:FixedModel):FixedPolicy {
 const row=model.q[learningState(game,model.side)];
 if(!row || row.length!==policies.length || !row.every(Number.isFinite))return policyFromKey(model.fallbackPolicy);
 let best=0;
 for(let index=1;index<row.length;index++)if(row[index]>row[best])best=index;
 return policyFromKey(model.policyKeys[best]);
}
export function chooseFixedPolicy(game:Game,side:Side):FixedPolicy {
 return choosePolicyFromFixedModel(game,fixedModels[side]);
}
