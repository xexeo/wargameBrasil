import {checkSimulations} from './simulation-store.mjs';
const result=await checkSimulations({prune:process.argv.includes('--prune')});
for(const invalid of result.invalid)console.log(`Simulação ${invalid.version} invalidada: ${invalid.changed.join(', ')}${process.argv.includes('--prune')?' — análise e dados removidos.':''}`);
if(result.invalid.length&&!process.argv.includes('--prune'))process.exitCode=1;
