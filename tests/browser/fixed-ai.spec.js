import {test,expect} from '@playwright/test';
const personalMemory=page=>page.evaluate(()=>({
 simple:localStorage.getItem('monte-castelo-learning-v1'),
 veteran:localStorage.getItem('monte-castelo-trained-v1'),
}));

for(const side of ['br','de'])test(`fixed learner commands ${side} with its own frozen model and preserves personal learning`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.locator('#begin').click();
 await page.selectOption('#ai','trained-fixed');
 if(side==='br')await page.selectOption('#gameMode','computer-br');
 const expected=await page.evaluate(async side=>{
  const {chooseFixedPolicy}=await import('/dist/fixed-learning.js');
  const {endTurn}=await import('/dist/engine.js');
  const game=JSON.parse(localStorage.getItem('monte-castelo-session-v1')).game;
  if(side==='de')endTurn(game);
  return chooseFixedPolicy(game,side);
 },side);
 const memories=await personalMemory(page);
 if(side==='br')await page.locator('#begin').click();else await page.locator('#end').click();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).aiProgress?.mode)).toBe('trained-fixed');
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).aiProgress);
 expect(progress).toMatchObject({side,chosen:expected.strategy,stance:expected.stance});
 // Reload during the AI activation: fixed policy and checkpoint must resume intact.
 await page.reload();await expect(page.locator('#ai')).toHaveValue('trained-fixed');
 const resumed=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).aiProgress);
 expect(resumed).toMatchObject({side,chosen:expected.strategy,stance:expected.stance,mode:'trained-fixed'});
 await page.locator('#begin').click();
 await expect(page.locator('#end')).toBeEnabled();
 await expect(page.locator('#stance')).toBeDisabled();
 await expect(page.locator('#learningStatus')).toContainText('2400 partidas de treino');
 await expect(page.locator('#learningStatus')).toContainText('sem explorar nem alterar pesos');
 expect(await personalMemory(page)).toEqual(memories);
 await expect(page.locator('#ai')).toHaveValue('trained-fixed');
 expect(await personalMemory(page)).toEqual(memories);
 expect(errors).toEqual([]);
});

test('fixed model metadata and restored tribute photograph are available in Portuguese and American English',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();
 await page.locator('#memory').click();
 await expect(page.locator('.fixed-models')).toContainText('Dois aprendizes fixos, um por lado');
 await expect(page.locator('.fixed-models')).toContainText('2400 partidas de treino');
 await expect(page.locator('.fixed-models')).toContainText('900001–902400');
 await expect(page.locator('.fixed-models')).toContainText('910001–912400');
 await expect(page.locator('#exportMemory')).toBeVisible();
 await page.locator('#close').click();await page.locator('#tribute').click();
 await expect(page.locator('.tribute-portrait')).toContainText('restaurada digitalmente com auxílio de IA');
 const portrait=page.locator('.tribute-portrait img');
 await expect(portrait).toHaveAttribute('src',/^data:image\/png;base64,/);
 expect(await portrait.evaluate(img=>img.complete&&img.naturalWidth>300)).toBeTruthy();
 await page.locator('#close').click();await page.selectOption('#language','en-US');
 await expect(page.locator('#ai option[value="trained-fixed"]')).toHaveText('Fixed learner · per side');
 await page.locator('#memory').click();
 await expect(page.locator('.fixed-models')).toContainText('Two fixed learners, one for each side');
 await expect(page.locator('.fixed-models')).toContainText('Weights remain frozen');
 await expect(page.locator('.fixed-models')).not.toContainText('partidas');
 await page.locator('#close').click();await page.locator('#tribute').click();
 await expect(page.locator('.tribute-portrait')).toContainText('digitally restored with AI assistance');
 await expect(page.locator('.tribute-portrait img')).toHaveAttribute('alt','Restored portrait of Pedro Henrique de Figueiredo Bonorino');
});
