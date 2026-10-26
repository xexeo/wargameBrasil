import {clickNavigation} from './navigation.js';
import {test,expect} from '@playwright/test';
const portuguese=/\b(você|rodada|rodadas|infantaria|defesa|ataque|movimento|alcance|forças|níveis|operação|partida|pontos|perdas|mortos|feridos|prisioneiros|retirados|não|nuvens|experiência|arquivo|comanda|homenagem)\b/i;
async function english(page){
 await page.goto('/');await page.locator('#begin').click();await page.selectOption('#language','en-US');
 await expect(page.locator('html')).toHaveAttribute('lang','en-US');
}
async function noPortuguese(locator){expect(await locator.innerText()).not.toMatch(portuguese);}

test('Portuguese is explicit default; switching preserves game and learning, and English persists',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'language',{value:'en-US'});});
 await page.goto('/');await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
 await expect(page.locator('#begin')).toHaveText('Assumir o comando →');await page.locator('#begin').click();
 await page.locator('[data-id="b1"]').click();await page.locator('[data-q="1"][data-r="6"]').click();
 const snapshot=await page.evaluate(()=>({game:localStorage.getItem('monte-castelo-session-v1'),learning:localStorage.getItem('monte-castelo-learning-v1'),trained:localStorage.getItem('monte-castelo-trained-v1')}));
 await page.selectOption('#language','en-US');await expect(page.locator('#unitInfo')).toContainText('Movement 2');
 expect(await page.evaluate(()=>({game:localStorage.getItem('monte-castelo-session-v1'),learning:localStorage.getItem('monte-castelo-learning-v1'),trained:localStorage.getItem('monte-castelo-trained-v1')}))).toEqual(snapshot);
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','en-US');await expect(page.locator('#begin')).toHaveText('Resume operation →');
 await page.locator('#begin').click();await page.selectOption('#language','pt-BR');await expect(page.locator('#phase')).toHaveText('Sua vez de avançar');
 expect(await page.evaluate(()=>localStorage.getItem('monte-castelo-session-v1'))).toBe(snapshot.game);
});

test('all English popups, static controls, accessibility labels, and troop inspections are translated',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await english(page);
 await noPortuguese(page.locator('header'));await noPortuguese(page.locator('main'));
 for(const id of ['briefing','rules','history','credits','weatherInfo','mapSources','forces','memory','tribute']){
  await clickNavigation(page,id);await noPortuguese(page.locator('#modalBody'));
  const attrs=await page.locator('#modalBody [aria-label],#modalBody [alt]').evaluateAll(nodes=>nodes.flatMap(n=>[n.getAttribute('aria-label')||'',n.getAttribute('alt')||'']).join('\n'));
  expect(attrs).not.toMatch(portuguese);
  if(id==='tribute'){
   await expect(page.locator('#modalBody')).toContainText('6th Infantry Regiment');
   await expect(page.locator('#modalBody')).not.toContainText('Current emblem');
   await expect(page.locator('#modalBody')).not.toContainText('Ipiranga');
   expect(await page.locator('#modalBody img').evaluateAll(imgs=>imgs.length===2&&imgs.every(img=>img.complete&&img.naturalWidth>0))).toBeTruthy();
  }
  if(id==='credits'){await page.locator('#modalBody summary').click();await noPortuguese(page.locator('.license-text'));}
  await page.locator('#close').click();
 }
 for(const id of ['b1','b2','b3','b4','b5','g1','g2','g3','g4','g5']){
  await page.locator(`[data-id="${id}"]`).dispatchEvent('click');
  await noPortuguese(page.locator('#unitInfo'));
  await page.locator(`[data-id="${id}"]`).dispatchEvent('click');
  await expect(page.locator('.bigpiece')).toBeVisible();await noPortuguese(page.locator('#modalBody'));await page.locator('#close').click();
 }
 expect(errors).toEqual([]);
});

test('both computer sides, local play, remote file sharing, computer turn and logs use English',async({page})=>{
 await english(page);await page.locator('#end').click();await expect(page.locator('#round')).toHaveText('2 / 10');
 await noPortuguese(page.locator('#log'));await noPortuguese(page.locator('#phase'));await noPortuguese(page.locator('#learningStatus'));
 for(const mode of ['computer-br','local','remote','computer']){
  await page.selectOption('#gameMode',mode);await noPortuguese(page.locator('#modalBody'));await page.locator('#begin').click();
  if(mode==='computer-br')await expect(page.locator('#end')).toBeEnabled();
  await noPortuguese(page.locator('#yourSide'));await noPortuguese(page.locator('#phase'));
  if(mode==='remote'){
   await page.locator('#end').click();await expect(page.locator('#modalBody')).toContainText('This copy is open offline or at a local address.');await noPortuguese(page.locator('#modalBody'));await page.locator('#close').click();
  }
 }
});

test('English file errors and dialog controls survive language changes',async({page})=>{
 await english(page);await page.locator('#memory').click();
 await page.locator('#importMemory').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await expect(page.locator('#importResult')).toHaveText('Incompatible experience file.');
 await page.evaluate(()=>{const el=document.querySelector('#language');el.value='pt-BR';el.dispatchEvent(new Event('change'));});
 await expect(page.locator('#exportMemory')).toHaveText('Exportar experiência');
 expect(await page.locator('#exportMemory').evaluate(e=>typeof e.onclick)).toBe('function');
 await page.locator('#close').click();await page.selectOption('#language','en-US');
 await page.locator('#loadTurn').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{broken')});
 await expect(page.locator('#modalBody')).toContainText('The file does not contain valid JSON.');await noPortuguese(page.locator('#modalBody'));
});

test('English outcomes show only actual game losses without unsupported historical comparisons',async({page})=>{
 await english(page);
 await page.evaluate(async()=>{
  const {createGame}=await import('/dist/engine.js');const game=createGame();game.units=game.units.filter(u=>u.side==='br');
  game.log=['Fogo defensivo · Granadeiros — Castelo → I/1º RI — Franklin: dado 4, 1 dano.','Granadeiros — Castelo: retirada por perdas para 5-2; próxima ação comprometida, sem recuperar PV.'];
  localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game,localSide:'br',mode:'local',ai:'tactical',stance:'defensive'}));
 });
 await page.reload();await expect(page.locator('#modalBody')).toContainText('Victory by neutralization');await expect(page.locator('#modalBody')).toContainText('Monte Castelo is secured by the FEB.');await expect(page.locator('#phase')).toContainText('FEB victory');await noPortuguese(page.locator('#modalBody'));
 await expect(page.locator('.historical-losses,.historical-context')).toHaveCount(0);
 await expect(page.locator('.loss-comparison')).toContainText('German');
 await page.locator('#close').click();await noPortuguese(page.locator('#log'));await expect(page.locator('#log')).toContainText('withdrawal after losses');
});

test('every catalog entry has English text and the same parameter set',async({page})=>{
 await page.goto('/template.html');
 const entries=await page.evaluate(async()=>{const {translationCoverage}=await import('/dist/i18n.js');return translationCoverage();});
 expect(entries.length).toBeGreaterThan(150);
 expect(entries.filter(e=>!e.en.trim()||!e.parametersMatch)).toEqual([]);
});
