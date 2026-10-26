import {clickNavigation} from './navigation.js';
import {test,expect} from '@playwright/test';
const snapshot=page=>page.evaluate(()=>({session:localStorage.getItem('monte-castelo-session-v1'),simple:localStorage.getItem('monte-castelo-learning-v1'),veteran:localStorage.getItem('monte-castelo-trained-v1'),zoom:document.querySelector('#zoom').value,scrollLeft:document.querySelector('#viewport').scrollLeft,scrollTop:document.querySelector('#viewport').scrollTop}));
async function start(page){await page.goto('/');await page.locator('#begin').click();}
async function group(page,text){await page.locator('.appearance-group').filter({has:page.locator('summary',{hasText:text})}).locator('summary').click();}
test('three presets and individual colors, fonts and sizes preview immediately without changing game or zoom',async({page},info)=>{
 await start(page);await page.locator('[data-id="b1"]').click();await page.locator('[data-q="1"][data-r="6"]').click();
 await page.locator('#zoom').fill('1.2');await page.locator('#zoom').dispatchEvent('input');
 const before=await snapshot(page);await clickNavigation(page,"appearance");
 for(const [preset,color] of [['A','rgb(33, 102, 163)'],['B','rgb(0, 123, 120)'],['C','rgb(100, 72, 154)']]){
  await page.selectOption('#uiPreset',preset);await expect(page.locator('html')).toHaveAttribute('data-ui-preset',preset);
  await expect(page.locator('[data-id="b1"] .counter')).toHaveCSS('fill',color);
 }
 await group(page,'Peças e estados');await page.locator('#ui-hex-br').fill('#334477');
 await expect(page.locator('#uiPreset')).toHaveValue('custom');await expect(page.locator('[data-id="b1"] .counter')).toHaveCSS('fill','rgb(51, 68, 119)');
 await group(page,'Fontes e tamanhos');await page.selectOption('#uiFont','arial');await page.locator('#ui-number-starRadius').fill('12');await page.locator('#ui-number-counterScale').fill('1.1');
 expect(await snapshot(page)).toEqual(before);
 await page.locator('#closeBottom').click();
 await page.screenshot({path:`/tmp/monte-appearance-${info.project.name}.png`,fullPage:true});
 await page.reload();await page.locator('#begin').click();await clickNavigation(page,"appearance");await expect(page.locator('#ui-hex-br')).toHaveValue('#334477');
 await group(page,'Fontes e tamanhos');await expect(page.locator('#uiFont')).toHaveValue('arial');await expect(page.locator('#ui-number-starRadius')).toHaveValue('12');
 await page.evaluate(()=>{const el=document.querySelector('#language');el.value='en-US';el.dispatchEvent(new Event('change'));});
 await expect(page.locator('#appearanceSettings')).toContainText('Game appearance');await expect(page.locator('#appearanceSettings')).toContainText('Line widths');
 expect(await page.locator('#appearanceSettings').innerText()).not.toMatch(/\b(cores|fontes|terreno|peças|aparência|padrão|espessuras)\b/i);
 await page.locator('#uiReset').click();await expect(page.locator('#uiPreset')).toHaveValue('A');
 await page.locator('#uiWinter').click();await expect(page.locator('#uiPreset')).toHaveValue('custom');
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--ui-terrain1').trim())).toBe('#ECE6D8');
});

test('invalid saved appearance and invalid imported files fall back safely without replacing current preferences',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('monte-castelo-ui-v1',JSON.stringify({schema:1,preset:'C',font:'system',colors:{br:'url(javascript:bad)'},numbers:{starRadius:500}})));
 await start(page);await expect(page.locator('html')).toHaveAttribute('data-ui-preset','A');await clickNavigation(page,"appearance");
 await page.selectOption('#uiPreset','B');const before=await page.evaluate(()=>localStorage.getItem('monte-castelo-ui-v1'));
 await page.locator('#uiImport').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"schema":900}')});
 await expect(page.locator('#uiSettingsStatus')).toContainText('Arquivo de aparência inválido');
 expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-ui-v1'))).toBe(before);await expect(page.locator('#uiPreset')).toHaveValue('B');
});

test('every popup has a translated bottom close button and closing a FEB briefing starts its computer turn',async({page})=>{
 await start(page);
 for(const id of ['briefing','rules','history','credits','weatherInfo','mapSources','forces','memory','tribute','appearance']){
  await clickNavigation(page,id);await expect(page.locator('#closeBottom')).toHaveText('Fechar');await page.locator('#closeBottom').click();await expect(page.locator('#modal')).not.toBeVisible();
 }
 await page.selectOption('#language','en-US');await clickNavigation(page,"rules");await expect(page.locator('#closeBottom')).toHaveText('Close');await page.locator('#closeBottom').click();
 await page.selectOption('#gameMode','computer-br');await page.locator('#closeBottom').click();await expect(page.locator('#end')).toBeEnabled();
 await expect(page.locator('#phase')).toHaveText('Your turn to advance');
});

test('damage badge sits above the square, paints above labels, and the complete legend explains every map symbol',async({page})=>{
 await start(page);await page.evaluate(()=>{const state=JSON.parse(localStorage.getItem('monte-castelo-session-v1'));state.game.units.find(u=>u.id==='b1').hp=2;localStorage.setItem('monte-castelo-session-v1',JSON.stringify(state));});
 await page.reload();await page.locator('#begin').click();
 const badge=page.locator('[data-damage-unit="b1"]');await expect(badge).toContainText('−1');await expect(badge).toHaveAttribute('aria-label','Dano acumulado: 1 PV');
 const geometry=await page.evaluate(()=>{const badge=document.querySelector('[data-damage-unit="b1"]'),counter=document.querySelector('[data-id="b1"] .counter');return {badge:badge.getBoundingClientRect().bottom,counter:counter.getBoundingClientRect().top,after:!!(document.querySelector('.unit-condition-layer').compareDocumentPosition(document.querySelector('.unit'))&Node.DOCUMENT_POSITION_PRECEDING)};});
 expect(geometry.badge).toBeLessThan(geometry.counter);expect(geometry.after).toBeTruthy();
 await clickNavigation(page,"rules");if(!await page.locator('.symbol-legend').evaluate(el=>el.open))await page.locator('.symbol-legend summary').click();
 for(const text of ['II','AP','DEST','T1–T3','Bolinhas','suprimida','Curvas','Grupos de árvores','Fortificação','500 m','Fogo defensivo'])await expect(page.locator('.symbol-legend')).toContainText(text,{ignoreCase:true});
 await page.evaluate(()=>{const el=document.querySelector('#language');el.value='en-US';el.dispatchEvent(new Event('change'));});
 if(!await page.locator('.symbol-legend').evaluate(el=>el.open))await page.locator('.symbol-legend summary').click();await expect(page.locator('.symbol-legend')).toContainText('Complete symbol legend');
 expect(await page.locator('.symbol-legend').innerText()).not.toMatch(/\b(árvores|defensivo|fortificação|coesão|ataque)\b/i);
});

test('expanded history and opening context are complete in both languages and retain the current operation',async({page})=>{
 await page.goto('/');await expect(page.locator('.opening-context')).toContainText('meses de combate');
 await expect(page.locator('#begin')).toBeVisible();await page.locator('#closeBottom').click();
 const before=await snapshot(page);await clickNavigation(page,"history");
 await expect(page.locator('.battle-history')).toContainText('As tentativas anteriores e o inverno');
 await expect(page.locator('.history-sources')).toContainText('FGV CPDOC');
 await page.evaluate(()=>{const el=document.querySelector('#language');el.value='en-US';el.dispatchEvent(new Event('change'));});
 await expect(page.locator('.battle-history')).toContainText('February 21');
 expect(await page.locator('.battle-history').innerText()).not.toMatch(/\b(tentativas|inverno|subida|conquista|história|brasileiros)\b/i);
 await page.locator('#closeBottom').click();expect(await snapshot(page)).toEqual(before);
 await clickNavigation(page,"briefing");await expect(page.locator('.opening-context')).toContainText('Months of fighting');
 await expect(page.locator('#begin')).toHaveText('Take command →');
});

test('each army has its own configurable text and military symbol color',async({page})=>{
 await start(page);
 await expect(page.locator('[data-id="b1"] .symbol').first()).toHaveCSS('stroke','rgb(255, 255, 255)');
 await expect(page.locator('[data-id="g1"] .symbol').first()).toHaveCSS('stroke','rgb(255, 227, 161)');
 await clickNavigation(page,"appearance");await group(page,'Peças e estados');
 await page.locator('#ui-hex-deText').fill('#99CCFF');
 await expect(page.locator('[data-id="g1"] text').first()).toHaveCSS('fill','rgb(153, 204, 255)');
 await expect(page.locator('[data-id="g1"] .symbol').first()).toHaveCSS('stroke','rgb(153, 204, 255)');
 await expect(page.locator('[data-id="b1"] text').first()).toHaveCSS('fill','rgb(255, 255, 255)');
 await expect(page.locator('[data-id="g5"] .symbol circle')).toHaveCSS('fill','rgb(153, 204, 255)');
 await page.locator('#closeBottom').click();await page.reload();await page.locator('#begin').click();
 await expect(page.locator('[data-id="g1"] text').first()).toHaveCSS('fill','rgb(153, 204, 255)');
});
