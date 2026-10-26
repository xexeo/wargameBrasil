import {test,expect} from '@playwright/test';
async function fixture(page,kind){
 await page.addInitScript(()=>{Math.random=()=>0;});
 await page.goto('/');
 await page.evaluate(async kind=>{
  const {createGame}=await import('/dist/engine.js'),game=createGame();
  game.units=game.units.filter(u=>['b1','g1'].includes(u.id));const [br,de]=game.units;
  if(kind==='counter'){
   game.rules.opportunityFire=false;Object.assign(br,{q:3,r:5,atk:1});Object.assign(de,{q:3,r:4,def:6});
  }else{
   Object.assign(br,{q:5,r:3,atk:1,def:3});Object.assign(de,{q:5,r:2,atk:3,def:6});
  }
  if(kind==='computer')game.turn='de';
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,localSide:'br',mode:kind==='computer'?'computer':'local',ai:'tactical',stance:'defensive',rewarded:false,trainedUsed:false}));
 },kind);
 await page.reload();await page.locator('#begin').click();
}

test('attack and counterattack are queued separately, survive rerender and never capture input',async({page})=>{
 await fixture(page,'counter');
 await page.locator('[data-id="b1"]').click();await page.locator('[data-id="g1"]').click();
 const shot=page.locator('.combat-effect[data-combat-kind="attack"]');
 await expect(shot).toHaveAttribute('data-from','3,5');await expect(shot).toHaveAttribute('data-to','3,4');
 await expect(shot).toHaveAttribute('data-damage','0');await expect(shot).toContainText('Sem perda de coesão');
 await expect(shot).toHaveCSS('pointer-events','none');await expect(shot.locator('.combat-trace')).toHaveCSS('pointer-events','none');
 // A language change rerenders the board; it must not replay or duplicate the shot.
 await page.evaluate(()=>{const select=document.querySelector('#language');select.value='en-US';select.dispatchEvent(new Event('change'));});
 await expect(page.locator('.combat-effect')).toHaveCount(1);
 await expect(page.locator('.combat-effect[data-combat-kind="counterattack"]')).toContainText('Counterattack');
 await expect(page.locator('.combat-effect')).toHaveAttribute('data-from','3,4');
 await expect(page.locator('.combat-effect')).toHaveAttribute('data-to','3,5');
 await expect(page.locator('.combat-effect')).toHaveAttribute('data-damage','1');
 await expect(page.locator('#combatAnnouncement')).toContainText('Counterattack · −1 HP');
 await expect(page.locator('.combat-effect')).toHaveCount(0,{timeout:2500});
 // Completed effects do not replay when the board rerenders.
 await page.selectOption('#language','pt-BR');await expect(page.locator('.combat-effect')).toHaveCount(0);
 await expect(page.locator('#combatAnnouncement')).toContainText('Contra-ataque · −1 PV');
});

test('moving under fire shows the actual intermediate impact hex and clears effects for a new operation',async({page},testInfo)=>{
 await fixture(page,'move');
 await page.locator('[data-id="b1"]').click();await page.locator('[data-q="3"][data-r="4"]').click();
 const shot=page.locator('.combat-effect');
 await expect(shot).toHaveAttribute('data-combat-kind','defensive-fire');
 await expect(shot).toHaveAttribute('data-from','5,2');await expect(shot).toHaveAttribute('data-to','4,4');
 await expect(shot).toContainText('Fogo defensivo');
 await page.locator('.battlefield').screenshot({path:`/tmp/monte-fire-${testInfo.project.name}.png`});
 const unit=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).game.units.find(u=>u.id==='b1'));
 expect({q:unit.q,r:unit.r}).toEqual({q:3,r:4});
 page.once('dialog',dialog=>dialog.accept());await page.locator('#newTop').click();
 await expect(page.locator('.combat-effect')).toHaveCount(0);await expect(page.locator('#combatAnnouncement')).toHaveText('');
});

test('computer fire is visible and reduced motion removes animations without hiding its meaning',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await fixture(page,'computer');
 await expect(page.locator('.combat-effect')).toHaveCount(1);
 await expect(page.locator('.combat-effect')).toContainText('Ataque');
 await expect(page.locator('.combat-burst')).toHaveCSS('animation-name','none');
 await expect(page.locator('.combat-trace')).toHaveCSS('animation-name','none');
 await expect(page.locator('#end')).toBeEnabled();
 await expect(page.locator('#combatAnnouncement')).toContainText('Ataque');
});
