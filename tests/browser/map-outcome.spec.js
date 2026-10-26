import {test,expect} from '@playwright/test';

test('full map fills its viewport without empty strips and refits after resizing',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();await page.locator('#fit').click();
 const geometry=()=>page.evaluate(()=>{const map=document.querySelector('#map').getBoundingClientRect(),v=document.querySelector('#viewport');return {width:Math.abs(map.width-v.clientWidth),height:Math.abs(map.height-v.clientHeight),overflowX:v.scrollWidth-v.clientWidth,overflowY:v.scrollHeight-v.clientHeight};});
 await expect.poll(async()=>Object.values(await geometry()).every(n=>n<2)).toBeTruthy();
 const size=page.viewportSize();await page.setViewportSize({width:size.width-30,height:size.height});
 await expect.poll(async()=>Object.values(await geometry()).every(n=>n<2)).toBeTruthy();
 await page.locator('#ideal').click();await page.locator('#fit').click();
 await expect.poll(async()=>Object.values(await geometry()).every(n=>n<2)).toBeTruthy();
});

for(const scale of ['battalion','company'])for(const presence of ['infantry','support','empty'])test(`elimination secures the summit: ${scale}, ${presence}`,async({page})=>{
 await page.goto('/');await page.evaluate(async({scale,presence})=>{
  const {createGame,objectives}=await import('/dist/engine.js');const {defaultRules}=await import('/dist/scenario.js');const game=createGame({...defaultRules,scale});
  game.units=game.units.filter(u=>u.side==='br');
  if(presence!=='empty'){const unit=game.units.find(u=>presence==='infantry'?u.canCapture:!u.canCapture);unit.q=objectives[0].q;unit.r=objectives[0].r;}
  game.winner='br';game.victoryReason='elimination';game.finishedRound=4;game.round=4;game.summitSecured=false;
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,mode:'local',localSide:'br',ai:'tactical',stance:'defensive',rewarded:false,trainedUsed:false}));
 },{scale,presence});
 await page.reload();
 await expect(page.locator('#modalBody')).toContainText('Monte Castelo está assegurado pela FEB');
 await expect(page.locator('#missionForecast')).toContainText('Monte Castelo está assegurado pela FEB');
 await expect(page.locator('#modalBody')).toContainText('dispensa ocupar o hexágono do cume e completar a meta de pontos');
 await expect(page.locator('#modalBody')).not.toContainText('O cume não foi ocupado');
 await expect(page.locator('#modalBody')).toContainText(`Peças FEB fora de combate: 0/${scale==='company'?11:5}`);
 await expect(page.locator('#modalBody')).toContainText(`Coesão perdida: 0/${scale==='company'?33:15}`);
 await page.evaluate(()=>{const select=document.querySelector('#language');select.value='en-US';select.dispatchEvent(new Event('change'));});
 await expect(page.locator('#modalBody')).toContainText('Monte Castelo is secured by the FEB');
 await expect(page.locator('#missionForecast')).toContainText('Monte Castelo is secured by the FEB');
 await expect(page.locator('#modalBody')).toContainText('requires neither moving a counter onto the summit hex nor reaching the point target');
 await expect(page.locator('#modalBody')).not.toContainText('The summit was not occupied');
 await expect(page.locator('#modalBody')).toContainText(`FEB counters out of action: 0/${scale==='company'?11:5}`);
 await expect(page.locator('#modalBody')).toContainText(`Cohesion lost: 0/${scale==='company'?33:15}`);
});
