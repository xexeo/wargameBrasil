import {test,expect} from '@playwright/test';
for(const winner of ['br','de'])test(`the ${winner} result has its own bilingual epilogue only at game end`,async({page})=>{
 await page.goto('/');await page.evaluate(async winner=>{
  const {createGame}=await import('/dist/engine.js'),game=createGame();game.units=game.units.filter(u=>u.side===winner);
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,mode:'local',localSide:'br',ai:'tactical',stance:'defensive',rewarded:false}));
 },winner);
 await page.reload();const epilogue=page.locator(`.victory-epilogue[data-epilogue="${winner}"]`);
 await expect(epilogue).toHaveCount(1);await expect(epilogue).toContainText(winner==='br'?'O que a vitória da FEB significou':'Hipótese a partir do resultado do jogo');
 const session=await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'));
 await page.evaluate(()=>{const select=document.querySelector('#language');select.value='en-US';select.dispatchEvent(new Event('change'));});
 await expect(epilogue).toContainText(winner==='br'?'What the FEB victory meant':'A hypothetical outcome based on this game');
 expect(await epilogue.innerText()).not.toMatch(/\b(vitória|alemã|brasileiro|história|hipótese|resultado)\b/i);
 expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'))).toBe(session);
 await expect(page.locator('.historical-losses')).toHaveCount(0);await page.locator('#closeBottom').click();await page.locator('#history').click();
 await expect(page.locator('.battle-history')).toBeVisible();await expect(page.locator('.victory-epilogue')).toHaveCount(0);
 await expect(page.locator('.battle-history')).not.toContainText('What the FEB victory meant');
});
