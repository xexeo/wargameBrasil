import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaultUISettings,validatedUISettings,winterUISettings} from '../dist/ui-settings.js';
test('appearance presets match the three reviewed palettes and remain independent',()=>{
 const expected={A:['#2166A3','#F4F0E5','#DED3BB','#C6B08D','#B79B77'],B:['#007B78','#F4F3EB','#DEDDD0','#C5C3AF','#ABA88B'],C:['#64489A','#F4EFE8','#E0D2C1','#C7B39C','#B59A7D']};
 for(const preset of ['A','B','C']){const settings=defaultUISettings(preset);assert.deepEqual(['br','terrain1','terrain2','terrain3','terrain4'].map(k=>settings.colors[k]),expected[preset]);assert.equal(settings.colors.de,'#252B31');assert.equal(settings.colors.page,'#FFFFFF');assert.deepEqual(validatedUISettings(settings),settings);}
 const custom=defaultUISettings();custom.colors.br='#123456';custom.numbers.starRadius=12;assert.equal(defaultUISettings().colors.br,'#2166A3');assert.equal(defaultUISettings().numbers.starRadius,10);
});
test('appearance validation rejects CSS injection, unsupported fonts and unsafe numeric values',()=>{
 for(const patch of [s=>s.colors.br='url(https://example.invalid)',s=>s.colors.text='#fff',s=>s.font='Arial;display:none',s=>s.numbers.uiScale=Infinity,s=>s.numbers.starRadius=100,s=>delete s.colors.road,s=>s.schema=2]){const settings=defaultUISettings();patch(settings);assert.equal(validatedUISettings(settings),null);}
 assert.equal(validatedUISettings(null),null);
});
test('winter appearance changes only its documented visual colors',()=>{
 const settings=defaultUISettings('C'),before=structuredClone(settings),winter=winterUISettings(settings);
 assert.deepEqual(settings,before);assert.equal(winter.preset,'custom');assert.equal(winter.colors.br,settings.colors.br);assert.equal(winter.colors.terrain1,'#ECE6D8');assert.equal(winter.colors.forest,'#59614F');assert.deepEqual(winter.numbers,settings.numbers);assert.ok(validatedUISettings(winter));
});
test('legacy appearance preferences keep custom colors and sizes when animation options are introduced',()=>{
 const legacy=defaultUISettings('B');legacy.colors.br='#123456';legacy.numbers.starRadius=12;delete legacy.animations;delete legacy.numbers.animationDuration;
 const migrated=validatedUISettings(legacy);assert.ok(migrated);assert.equal(migrated.colors.br,'#123456');assert.equal(migrated.numbers.starRadius,12);assert.equal(migrated.animations,true);assert.equal(migrated.numbers.animationDuration,650);
 const off={...migrated,animations:false,numbers:{...migrated.numbers,animationDuration:900}};assert.equal(validatedUISettings(off).animations,false);assert.equal(validatedUISettings(off).numbers.animationDuration,900);
 assert.equal(validatedUISettings({...migrated,animations:'false'}),null);assert.equal(validatedUISettings({...migrated,numbers:{...migrated.numbers,animationDuration:Infinity}}),null);
});
test('sound defaults to off, validates volume and migrates older preferences without losing custom values',()=>{
 const settings=defaultUISettings('C');assert.equal(settings.soundEnabled,false);assert.equal(settings.numbers.soundVolume,.35);
 settings.colors.br='#123456';delete settings.soundEnabled;delete settings.numbers.soundVolume;
 const migrated=validatedUISettings(settings);assert.ok(migrated);assert.equal(migrated.colors.br,'#123456');assert.equal(migrated.soundEnabled,false);assert.equal(migrated.numbers.soundVolume,.35);
 assert.equal(validatedUISettings({...migrated,soundEnabled:'yes'}),null);assert.equal(validatedUISettings({...migrated,numbers:{...migrated.numbers,soundVolume:1.1}}),null);assert.equal(validatedUISettings({...migrated,numbers:{...migrated.numbers,soundVolume:0}}).numbers.soundVolume,0);
});
