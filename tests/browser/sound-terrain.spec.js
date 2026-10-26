import {test,expect} from '@playwright/test';
async function instrument(page){await page.addInitScript(()=>{
 const original=window.AudioContext;window.__soundStats={contexts:0,starts:0,stops:0};
 if(!original)return;
 window.AudioContext=class extends original{
  constructor(...args){super(...args);window.__soundStats.contexts++;window.__lastAudioContext=this;}
  createBufferSource(){const node=super.createBufferSource(),start=node.start.bind(node),stop=node.stop.bind(node);node.start=(...args)=>{window.__soundStats.starts++;return start(...args);};node.stop=(...args)=>{window.__soundStats.stops++;return stop(...args);};return node;}
  createOscillator(){const node=super.createOscillator(),start=node.start.bind(node),stop=node.stop.bind(node);node.start=(...args)=>{window.__soundStats.starts++;return start(...args);};node.stop=(...args)=>{window.__soundStats.stops++;return stop(...args);};return node;}
 };
});}
const memory=page=>page.evaluate(()=>({session:localStorage.getItem('monte-castelo-session-v1'),simple:localStorage.getItem('monte-castelo-learning-v1'),veteran:localStorage.getItem('monte-castelo-trained-v1')}));
test('sound starts off, unlocks on a user gesture, produces actual audio nodes, mutes and preserves game and learning',async({page})=>{
 await instrument(page);await page.goto('/');await page.locator('#begin').click();
 await expect(page.locator('#soundToggle')).toHaveText('Som: desligado');expect(await page.evaluate(()=>window.__soundStats.contexts)).toBe(0);
 const before=await memory(page);await page.locator('#soundToggle').click();await expect(page.locator('#soundToggle')).toHaveText('Som: ligado');await expect.poll(()=>page.evaluate(()=>window.__soundStats.contexts)).toBe(1);
 expect(await memory(page)).toEqual(before);await page.locator('#appearance').click();await page.locator('.appearance-group summary').filter({hasText:'Efeitos de combate'}).click();await expect(page.locator('#uiSound')).toBeChecked();await page.locator('#ui-number-soundVolume').fill('0.6');expect(await memory(page)).toEqual(before);await page.locator('#closeBottom').click();
 await page.locator('[data-id="b5"]').click();await page.locator('[data-id="g2"]').click();await expect.poll(()=>page.evaluate(()=>window.__soundStats.starts)).toBeGreaterThan(0);
 const stops=await page.evaluate(()=>window.__soundStats.stops),gameAfterShot=await memory(page);await page.locator('#soundToggle').click();await expect.poll(()=>page.evaluate(()=>window.__soundStats.stops)).toBeGreaterThan(stops);expect(await memory(page)).toEqual(gameAfterShot);
 await page.reload();await page.locator('#begin').click();await expect(page.locator('#soundToggle')).toHaveText('Som: desligado');await page.selectOption('#language','en-US');await expect(page.locator('#soundToggle')).toHaveText('Sound: off');await page.locator('#appearance').click();await page.locator('.appearance-group summary').filter({hasText:'Combat effects'}).click();await expect(page.locator('#uiSound')).not.toBeChecked();await expect(page.locator('#ui-number-soundVolume')).toHaveValue('0.6');await expect(page.locator('#appearanceSettings')).toContainText('Enable firing sounds');
});

test('terrain rules table gives movement, nonstacking cover, heights and automatic human reactions in both languages',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();await page.locator('#rules').click();
 const table=page.locator('.terrain-rules table');await expect(table.locator('thead th')).toHaveCount(4);await expect(table.locator('tbody tr')).toHaveCount(10);
 await expect(table).toContainText('Campo e estrada');await expect(table).toContainText('Não soma sua cobertura');await expect(table).toContainText('Defensor ≥30 m acima');await expect(table).toContainText('Atirador ≥90 m acima');await expect(table).toContainText('Não se aplica ao tiro indireto');await expect(page.locator('.terrain-example')).toContainText('3 PM');await expect(page.locator('.automatic-combat')).toContainText('Automático para humanos e computadores');
 const layout=await page.locator('.terrain-table-scroll').evaluate(element=>({visible:element.clientWidth,total:element.scrollWidth,body:document.querySelector('#modalBody').clientWidth}));expect(layout.visible).toBeLessThanOrEqual(layout.body);expect(layout.total).toBeGreaterThanOrEqual(layout.visible);
 await page.evaluate(()=>{const el=document.querySelector('#language');el.value='en-US';el.dispatchEvent(new Event('change'));});await expect(table).toContainText('Movement cost');await expect(table).toContainText('No extra cost');await expect(table).toContainText('do not ignore terrain defense');await expect(page.locator('.terrain-example')).toContainText('3 MP');await expect(page.locator('.automatic-combat')).toContainText('Automatic for humans and computers');expect(await page.locator('.terrain-rules').innerText()).not.toMatch(/\b(terreno|movimento|proteção|custo|subir|defensor|clima)\b/i);
});

test('sound synthesis does not consume combat randomness or change the resolved shot',async({page})=>{
 const results=[];
 for(const enabled of [false,true]){
  await page.goto('/');await page.evaluate(()=>localStorage.clear());await page.reload();await page.locator('#begin').click();
  await page.evaluate(()=>{window.__combatRandomCalls=0;Math.random=()=>{window.__combatRandomCalls++;return .5;};});
  if(enabled)await page.locator('#soundToggle').click();
  await page.locator('[data-id="b5"]').click();await page.locator('[data-id="g2"]').click();
  results.push(await page.evaluate(()=>({draws:window.__combatRandomCalls,game:JSON.parse(localStorage.getItem('monte-castelo-session-v1')).game})));
 }
 expect(results[0].draws).toBe(1);expect(results[1]).toEqual(results[0]);
});
