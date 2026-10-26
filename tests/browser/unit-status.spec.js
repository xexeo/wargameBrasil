import {test,expect} from '@playwright/test';
test('double-click inspection reports the current damage, movement, effective attack and conditions in both languages',async({page})=>{
 await page.goto('/');
 await page.evaluate(async()=>{
  const {createGame}=await import('/dist/engine.js'),game=createGame();
  Object.assign(game.units.find(u=>u.id==='b1'),{hp:2,mp:1,atk:4,def:3,fired:true,suppressed:true,reorganizing:true,reactionSpent:true});
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,mode:'local',localSide:'br',ai:'tactical',stance:'defensive'}));
 });
 await page.reload();await page.locator('#begin').click();await page.locator('[data-id="b1"]').dblclick();
 const state=page.locator('.unit-current-state');
 const value=label=>state.locator('dt').filter({hasText:label}).locator('xpath=following-sibling::dd[1]');
 await expect(value('Coesão atual')).toHaveText('2/3 PV');await expect(value('Dano acumulado')).toHaveText('1 PV');
 await expect(value('Movimento restante')).toHaveText('1/3 PM');await expect(value('Ataque efetivo')).toHaveText('3,5 (base 4 − penalidade 0,5)');
 await expect(value('Defesa base')).toHaveText('3');await expect(value('Já disparou')).toHaveText('sim');
 await expect(value('Pode mover nesta fase')).toHaveText('não');
 for(const label of ['Suprimida','Reorganizando','Reação gasta'])await expect(value(label)).toHaveText('sim');
 await page.evaluate(()=>{const select=document.querySelector('#language');select.value='en-US';select.dispatchEvent(new Event('change'));});
 await expect(state).toContainText('Current unit status');await expect(value('Current cohesion')).toHaveText('2/3 HP');
 await expect(value('Effective attack')).toHaveText('3.5 (base 4 − penalty 0.5)');
 await expect(value('Can move in this phase')).toHaveText('no');await expect(value('Suppressed')).toHaveText('yes');
 await expect(state).toContainText('base defense is not a single final defense value');
});
