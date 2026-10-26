import {test,expect}from'@playwright/test';import{clickNavigation}from'./navigation.js';
for(const scale of ['battalion','company'])for(const side of ['br','de'])test(`${scale} ${side} artillery can climb one level into woods from an old save`,async({page})=>{
 await page.goto('/');const fixture=await page.evaluate(async({scale,side})=>{
  const{createGame,neighbors,elevation,terrain}=await import('/dist/engine.js'),{defaultRules}=await import('/dist/scenario.js');
  const game=createGame({...defaultRules,scale,opportunityFire:false});delete game.rules.minimumStep;game.turn=side;
  const gun=game.units.find(u=>u.side===side&&u.type==='artillery');let pair;
  for(let q=0;q<9&&!pair;q++)for(let r=0;r<9&&!pair;r++)for(const[nq,nr]of neighbors(q,r))if(elevation(nq,nr)===elevation(q,r)+1&&terrain(nq,nr)==='forest'&&!game.units.some(u=>u.id!==gun.id&&((u.q===q&&u.r===r)||(u.q===nq&&u.r===nr)))){pair={q,r,nq,nr};break;}
  if(!pair)throw Error('No free uphill woods fixture');Object.assign(gun,{q:pair.q,r:pair.r});localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,mode:'local',localSide:side,ai:'tactical',stance:'defensive'}));return{...pair,id:gun.id};
 },{scale,side});
 await page.reload();await page.locator('#begin').click();await page.locator(`[data-id="${fixture.id}"]`).click();const destination=page.locator(`polygon[data-q="${fixture.nq}"][data-r="${fixture.nr}"]`);await expect(destination).toHaveClass(/reach/);await destination.click();
 const gun=await page.evaluate(id=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).game.units.find(u=>u.id===id),fixture.id);expect([gun.q,gun.r,gun.mp]).toEqual([fixture.nq,fixture.nr,0]);await expect(page.locator('#heightMovement')).toContainText('mínimo 1 hex');
 await clickNavigation(page,'rules');await expect(page.locator('.terrain-example')).toContainText('Deslocamento mínimo');await page.evaluate(()=>{const el=document.querySelector('#language');el.value='en-US';el.dispatchEvent(new Event('change'));});await expect(page.locator('.terrain-example')).toContainText('Minimum movement');await expect(page.locator('.terrain-example')).toContainText('Climbing two or more levels keeps its full cost');
});
