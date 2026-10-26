import {autoplayUI}from'./autoplay.js';
import {test,expect} from '@playwright/test';import {clickNavigation}from'./navigation.js';
const session=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')));
async function company(page){await page.goto('/');await page.locator('#openingScale').selectOption('company');await expect(page.locator('.scale-notice')).toContainText('Escala companhia');await page.locator('#begin').click();}

test('one game offers both scales; company orders, identity, resume and English use shared UI',async({page},info)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await company(page);
 await expect(page.locator('.unit')).toHaveCount(19);await expect(page.locator('#unitScale')).toHaveValue('company');await expect(page.locator('[data-id="c-b1a"] .troop-mark')).toContainText('A/I');
 await page.locator('[data-id="c-b1a"]').click();await page.locator('[data-q="1"][data-r="6"]').click();await expect(page.locator('#scaleStatus')).toContainText('independentes');await page.locator('[data-id="c-b1b"]').click();await expect(page.locator('.hex.reach').first()).toBeVisible();await expect(page.locator('#actionHint')).not.toContainText('já está comprometido');
 await page.locator('.battlefield').screenshot({path:`/tmp/companies-${info.project.name}.png`});
 const before=(await session(page)).game;await page.reload();await page.locator('#begin').click();expect((await session(page)).game).toEqual(before);await expect(page.locator('[data-id="c-b1b"]')).not.toHaveClass(/command-locked/);
 await page.selectOption('#language','en-US');await clickNavigation(page,'rules');await expect(page.locator('.scale-notice')).toContainText('Each counter moves and attacks independently');await page.locator('#closeBottom').click();await page.locator('[data-id="c-b1a"]').dblclick();await expect(page.locator('#modalBody')).toContainText('Rifle company');expect(await page.locator('#modalBody').innerText()).not.toMatch(/\b(companhia|batalhão|comando|cenário|fuzileiros)\b/i);await page.locator('#closeBottom').click();await clickNavigation(page,'forces');await expect(page.locator('.roster-table tbody tr')).toHaveCount(19);await expect(page.locator('#modalBody')).toContainText('battalions or companies');await page.locator('#closeBottom').click();expect(errors).toEqual([]);
});

test('each scale has independent fixed models and persistent online memories',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();await page.evaluate(()=>{
  localStorage.setItem('monte-castelo-learning-v1',JSON.stringify({games:17,q:{'br:strong/aggressive':4},visits:{'br:strong/aggressive':1}}));
 });await page.reload();await page.locator('#begin').click();await page.selectOption('#unitScale','company');await page.locator('#begin').click();await page.selectOption('#ai','trained-fixed');await expect(page.locator('#learningStatus')).toContainText('2400');
 await clickNavigation(page,'memory');await expect(page.locator('#modalBody')).toContainText('2000');await page.locator('#closeBottom').click();
 const first=await page.evaluate(()=>localStorage.getItem('monte-castelo-learning-v1'));await page.selectOption('#unitScale','battalion');await page.locator('#begin').click();expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-learning-v1'))).toBe(first);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-learning-company2-v1')).games)).toBe(0);await expect(page.locator('.unit')).toHaveCount(10);
});

test('company turn sharing preserves commands, scale and all counters',async({page})=>{
 await company(page);await page.selectOption('#gameMode','remote');await page.locator('#begin').click();await page.locator('[data-id="c-b1a"]').click();await page.locator('[data-q="1"][data-r="6"]').click();
 const data=await session(page);await page.locator('#loadTurn').setInputFiles({name:'company-turn.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({schema:1,game:data.game}))});await expect(page.locator('#modalBody')).not.toContainText('incompatível');await page.locator('#closeBottom').click();await expect(page.locator('.unit')).toHaveCount(19);await expect(page.locator('#unitScale')).toHaveValue('company');expect((await session(page)).game.commanded).toEqual(data.game.commanded);
});


test('company game completes through shared human controls and the computer turn',async({page})=>{
 test.setTimeout(90000);const final=await autoplayUI(page,'company');expect(final.rules.scale).toBe('company');await expect(page.locator('#modalBody')).toContainText('FIM DA OPERAÇÃO');
});
