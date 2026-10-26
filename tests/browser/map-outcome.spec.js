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

for(const [occupant,pt,en] of [
 ['b1','o cume está ocupado pela infantaria brasileira','Brazilian infantry occupies the summit'],
 ['b5','há apoio brasileiro no cume; apoio não assegura objetivos','Brazilian support is on the summit; support cannot secure objectives'],
])test(`elimination result distinguishes current summit presence for ${occupant}`,async({page})=>{
 await page.goto('/');await page.evaluate(async occupant=>{
  const {createGame,objectives}=await import('/dist/engine.js');const game=createGame();
  game.units=game.units.filter(u=>u.side==='br');const unit=game.units.find(u=>u.id===occupant);unit.q=objectives[0].q;unit.r=objectives[0].r;
  game.winner='br';game.victoryReason='elimination';game.finishedRound=4;game.round=4;game.summitSecured=false;
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,mode:'local',localSide:'br',ai:'tactical',stance:'defensive',rewarded:false,trainedUsed:false}));
 },occupant);
 await page.reload();await expect(page.locator('#modalBody')).toContainText(pt);
 await expect(page.locator('#modalBody')).not.toContainText('O cume não foi ocupado');
 await page.evaluate(()=>{const select=document.querySelector('#language');select.value='en-US';select.dispatchEvent(new Event('change'));});
 await expect(page.locator('#modalBody')).toContainText(en);
 await expect(page.locator('#modalBody')).not.toContainText('The summit was not occupied');
});
