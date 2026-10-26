import {clickNavigation} from './navigation.js';
import {test,expect} from '@playwright/test';
async function setup(page,id,duration=650){
 await page.addInitScript(()=>{Math.random=()=>0;});await page.goto('/');await page.evaluate(async({id,duration})=>{
  const{createGame}=await import('/dist/engine.js'),game=createGame();const{defaultUISettings}=await import('/dist/ui-settings.js');const appearance=defaultUISettings();appearance.numbers.animationDuration=duration;localStorage.setItem('monte-castelo-ui-v1',JSON.stringify(appearance));game.rules.opportunityFire=false;Object.assign(game.units.find(u=>u.id===id),{q:5,r:4});Object.assign(game.units.find(u=>u.id==='g3'),{q:6,r:3});
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,mode:'local',localSide:'br',ai:'tactical',stance:'defensive'}));
 },{id,duration});await page.reload();await page.locator('#begin').click();
}
for(const[id,weapon]of[['b1','infantry'],['b4','mortar'],['b5','artillery']])test(`${weapon} firing has its own moving visual and leaves the resolved game independent`,async({page},info)=>{
 await setup(page,id,1000);await page.locator(`[data-id="${id}"]`).click();await page.locator('[data-id="g3"]').click();
 const effect=page.locator('.combat-effect');await expect(effect).toHaveAttribute('data-weapon',weapon);await expect(effect).toHaveAttribute('data-animated','true');
 if(weapon==='infantry')await expect(effect.locator('.combat-bullet')).toHaveCount(3);else{await expect(effect.locator('.combat-projectile')).toHaveCount(1);await expect(effect.locator('.combat-trace')).toHaveAttribute('d',/Q/);const start=await effect.locator('.combat-projectile').getAttribute('transform');await page.waitForTimeout(60);expect(await effect.locator('.combat-projectile').getAttribute('transform')).not.toBe(start);}
 const state=await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'));
 await page.locator('.battlefield').screenshot({path:`/tmp/monte-${weapon}-${info.project.name}.png`});
 await expect(effect).toHaveCount(0,{timeout:3500});expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'))).toBe(state);
});

test('animation off persists independently; shots still show a static impact and translated controls',async({page})=>{
 await setup(page,'b5');const before=await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'));
 await clickNavigation(page,"appearance");await page.locator('.appearance-group summary').filter({hasText:'Efeitos de combate'}).click();
 await page.locator('#uiAnimations').uncheck();await page.locator('#ui-number-animationDuration').fill('900');
 expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'))).toBe(before);await page.locator('#closeBottom').click();
 await page.reload();await page.locator('#begin').click();await page.locator('[data-id="b5"]').click();await page.locator('[data-id="g3"]').click();
 const effect=page.locator('.combat-effect');await expect(effect).toHaveAttribute('data-animated','false');await expect(effect.locator('.combat-impact')).toHaveCSS('visibility','visible');await expect(effect.locator('.combat-burst')).toHaveCSS('animation-name','none');
 await expect(page.locator('#combatAnnouncement')).not.toHaveText('');await expect(effect).toHaveCSS('--combat-duration','900ms');
 await expect(effect).toHaveCount(0,{timeout:2500});await page.selectOption('#language','en-US');await clickNavigation(page,"appearance");await page.locator('.appearance-group summary').filter({hasText:'Combat effects'}).click();await expect(page.locator('#uiAnimations')).not.toBeChecked();await expect(page.locator('#appearanceSettings')).toContainText('Animate firing');await expect(page.locator('#appearanceSettings')).toContainText('no specific caliber');
});

test('reduced motion overrides enabled weapon animation and preserves the static result',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await setup(page,'b4');await page.locator('[data-id="b4"]').click();await page.locator('[data-id="g3"]').click();
 const effect=page.locator('.combat-effect');await expect(effect).toHaveAttribute('data-weapon','mortar');await expect(effect).toHaveAttribute('data-animated','false');await expect(effect.locator('.combat-impact')).toHaveCSS('visibility','visible');await expect(effect.locator('.combat-projectile')).toHaveCSS('display','none');
});
