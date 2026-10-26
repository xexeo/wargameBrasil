import {clickNavigation} from './navigation.js';
import { test, expect } from "@playwright/test";
test("narrativa, mapa, movimento, zoom e turno do computador", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("dialog")).toBeVisible();
  await page.getByText("Assumir o comando").click();
  await expect(page.locator("#map .unit")).toHaveCount(10);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  await page.locator('[data-id="b1"]').click();
  await page.locator('[data-q="1"][data-r="6"]').click();
  await expect(page.locator("#unitInfo")).toContainText("Movimento 2");
  await expect(page.locator('#actionMove')).toHaveCount(0);
  await expect(page.locator('#actionAttack')).toHaveCount(0);
  await page.locator("#ideal").click();
  await expect(page.locator("#resetZoom")).not.toHaveText("100%");
  await page.locator("#fit").click();
  const sizes = await page.locator("#map").evaluate((el) => ({
    map: el.getBoundingClientRect().width,
    parent: el.parentElement.clientWidth,
  }));
  expect(sizes.map).toBeLessThanOrEqual(sizes.parent + 1);
  await page.locator("#end").click();
  await expect(page.locator("#round")).toHaveText("2 / 10", { timeout: 10000 });
  await expect(page.locator("#end")).toBeEnabled();
  await clickNavigation(page,"rules");
  await expect(page.locator("#modalBody")).toContainText("altura");
  await expect(page.locator("#modalBody")).toContainText("Bolinhas de coesão");
  await expect(page.locator("#modalBody")).toContainText("Retângulo com X");
  await page.locator("#close").click();
  await page.locator("#weatherInfo").click();
  await expect(page.locator("#modalBody")).toContainText(
    "reconstrução regional ERA5",
  );
  await expect(page.locator("#modalBody")).toContainText("25 km");
  await page.locator("#close").click();
  await clickNavigation(page,"briefing");
  await expect(page.locator("#modalBody")).toContainText("Sua missão");
  await expect(page.locator("#round")).toHaveText("2 / 10");
  await page.locator("#close").click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#newTop").click();
  await expect(page.locator("#round")).toHaveText("1 / 10");
  expect(errors).toEqual([]);
});
test("aprendizado persiste ao recarregar e duplo toque amplia peça", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#begin").click();
  await page.locator('[data-id="b1"]').dblclick();
  await expect(page.locator(".bigpiece")).toBeVisible();
  await page.locator("#close").click();
  await page.locator("#ai").selectOption("learning");
  await page.locator("#end").click();
  await expect(page.locator("#round")).toHaveText("2 / 10");
  const value = await page.evaluate(() =>
    localStorage.getItem("monte-castelo-learning-v1"),
  );
  expect(value).toBeTruthy();
  const memory = JSON.parse(value);
  expect(Object.keys(memory.q).length).toBeGreaterThan(0);
  await page.reload();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("monte-castelo-learning-v1"),
    ),
  ).toBe(value);
});

test("autoria mostra logo oficial e licença integral", async ({ page }) => {
  await page.goto("/");
  await page.locator("#begin").click();
  await clickNavigation(page,"credits");
  await expect(page.locator("#modalBody")).toContainText("Geraldo Xexéo");
  await expect(page.locator("#modalBody")).toContainText("CC BY-NC-SA 4.0");
  expect(
    await page
      .locator('img[alt="Logo oficial do LUDES"]')
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  ).toBeTruthy();
  await page.locator("summary").click();
  await expect(page.locator(".license-text")).toContainText(
    "Attribution-NonCommercial-ShareAlike",
  );
});

test("arquivo standalone funciona com todos os recursos embutidos", async ({
  page,
}) => {
  const errors = [];
  const blocked = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/*", (route) => {
    if (
      route.request().isNavigationRequest() &&
      route.request().url().endsWith("/jogo.html")
    )
      return route.continue();
    blocked.push(route.request().url());
    return route.abort();
  });
  await page.goto("/jogo.html");
  await page.locator("#begin").click();
  await expect(page.locator(".unit")).toHaveCount(10);
  expect(
    await page.locator("#gameLogo").evaluate((img) => img.naturalWidth > 0),
  ).toBeTruthy();
  await clickNavigation(page,"credits");
  expect(
    await page
      .locator('img[alt="Logo oficial do LUDES"]')
      .evaluate((img) => img.naturalWidth > 0),
  ).toBeTruthy();
  await page.locator("summary").click();
  await expect(page.locator(".license-text")).toContainText("Creative Commons");
  expect(errors).toEqual([]);
  expect(blocked).toEqual([]);
});

test("IA especial vem treinada, persiste e permite exportar experiência", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#begin").click();
  await page.locator("#ai").selectOption("trained");
  await page.locator("#end").click();
  await expect(page.locator("#round")).toHaveText("2 / 10");
  const initialUpdates = JSON.parse(
    await page.evaluate(() => localStorage.getItem("monte-castelo-trained-v1")),
  ).updates;
  await page.locator("#end").click();
  await expect(page.locator("#round")).toHaveText("3 / 10");
  const saved = JSON.parse(
    await page.evaluate(() => localStorage.getItem("monte-castelo-trained-v1")),
  );
  expect(saved.episodes).toBeGreaterThanOrEqual(2000);
  expect(saved.updates).toBeGreaterThan(initialUpdates);
  await page.locator("#memory").click();
  const download = page.waitForEvent("download");
  await page.locator("#exportMemory").click();
  expect((await download).suggestedFilename()).toContain("experiencia");
  await page.reload();
  expect(
    JSON.parse(
      await page.evaluate(() =>
        localStorage.getItem("monte-castelo-trained-v1"),
      ),
    ),
  ).toEqual(saved);
});

test("partida retoma movimento salvo após fechar a página", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#begin").click();
  await page.locator('[data-id="b1"]').click();
  await page.locator('[data-q="1"][data-r="6"]').click();
  await page.reload();
  await expect(page.locator("#modalBody")).toContainText("OPERAÇÃO SALVA");
  await page.locator("#begin").click();
  await page.locator('[data-id="b1"]').click();
  await expect(page.locator("#unitInfo")).toContainText("Movimento 2");
});

test("humano x humano recebe turno alemão e permite mover e atacar", async ({
  page,
}) => {
  const { createGame, endTurn } = await import("../../dist/engine.js");
  const { encodeTurn } = await import("../../dist/exchange.js");
  const state = createGame();
  state.units.find(u=>u.id==='b4').r=6;
  endTurn(state);
  await page.goto("/#turn=" + encodeTurn(state));
  await page.locator("#begin").click();
  await expect(page.locator("#yourSide")).toContainText("DEFESA ALEMÃ");
  await page.locator('[data-id="g5"]').click();
  await page.locator('[data-q="7"][data-r="3"]').click();

  await page.locator('[data-id="b4"]').click();
  await expect(page.locator("#log")).toContainText("dado");
  await page.locator("#end").click();
  await expect(page.locator("#modalBody")).toContainText("Passe o comando");
  await page.locator("#close").click();
  await expect(page.locator("#end")).toBeDisabled();
  await expect(page.locator("#shareTurn")).toBeEnabled();
});

test("autojogo completo pela interface chega ao fim usando a mesma IA", async ({
  page,
}) => {
  test.setTimeout(60000);
  const { aiAction,activationOrder,selectAttackTarget } = await import("../../dist/ai.js");
  await page.addInitScript(() => {
    let n = 42;
    Math.random = () => {
      n = (Math.imul(1664525, n) + 1013904223) >>> 0;
      return n / 4294967296;
    };
  });
  await page.goto("/");
  await page.locator("#begin").click();
  await page.locator("#stance").selectOption("aggressive");
  const state = async () =>
    JSON.parse(
      await page.evaluate(() =>
        localStorage.getItem("monte-castelo-session-v1"),
      ),
    ).game;
  for (let turn = 0; turn < 10; turn++) {
    let game = await state();
    if (game.winner) break;
    for(const id of activationOrder(game,"br")) {
      game = await state();
      if (game.winner) break;
      let source = game.units.find((u) => u.id === id);
      if (!source) continue;
      const selectActor=async()=>{if(!await page.locator(`[data-id="${id}"]`).evaluate(el=>el.classList.contains('selected')))await page.locator(`[data-id="${id}"]`).click();};
      await selectActor();
      const initialTarget=selectAttackTarget(game,source,"tactical");
      if(initialTarget)await page.locator(`[data-id="${initialTarget.id}"]`).click();
      game=await state();
      source=game.units.find(u=>u.id===id);
      if(game.winner)break;
      if(!source)continue;
      const planned=structuredClone(game);
      aiAction(planned,id,"tactical","aggressive");
      const destination=planned.units.find(u=>u.id===id);
      if(destination&&(source.q!==destination.q||source.r!==destination.r)) {
        await selectActor();
        await page.locator(`polygon[data-q="${destination.q}"][data-r="${destination.r}"]`).click();
      }
      const current=await state();
      if(current.winner)break;
      const actor=current.units.find(u=>u.id===id);
      const target=actor?selectAttackTarget(current,actor,"tactical"):null;
      if(target) { await selectActor(); await page.locator(`[data-id="${target.id}"]`).click(); }

    }
    game = await state();
    if (game.winner) break;
    const round = game.round;
    await page.locator("#end").click();
    await expect
      .poll(
        async () => {
          const next = await state();
          return !!next.winner || next.round > round;
        },
        { timeout: 10000 },
      )
      .toBeTruthy();
  }
  const final = await state();
  expect(["br", "de"]).toContain(final.winner);
  await expect(page.locator("#modalBody")).toContainText("FIM DA OPERAÇÃO");
  console.log(
    `Autojogo na interface: ${final.winner}, rodada ${final.round}, ${final.score} pontos.`,
  );
});

test('forças mostram escalão e níveis e a seleção oferece movimento e ataque juntos',async({page})=>{await page.goto('/');await page.locator('#begin').click();await page.locator('#forces').click();await expect(page.locator('#modalBody')).toContainText('ESCALA');await expect(page.locator('.roster-table tbody tr')).toHaveCount(10);await expect(page.locator('#modalBody')).toContainText('batalhões');await expect(page.locator('#modalBody')).toContainText('T3');await page.locator('#close').click();await page.locator('[data-id="b4"]').click();await expect(page.locator('#unitInfo')).toContainText('Armas coletivas agregadas');await expect(page.locator('#unitInfo')).toContainText('Movimento 2/2');await expect(page.locator('#unitInfo')).toContainText('não ocupa objetivos');await expect(page.locator('polygon.reach').first()).toBeVisible();await page.locator('[data-id="b5"]').click();await expect(page.locator('#unitInfo')).toContainText('Movimento 1/1');});

test('seleção direta destaca movimento e ataque sem botões de modo',async({page})=>{const {createGame}=await import('../../dist/engine.js');const game=createGame();Object.assign(game.units.find(u=>u.id==='b5'),{q:2,r:6});await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);await page.goto('/');await page.locator('#begin').click();await page.locator('[data-id="b5"]').click();await expect(page.locator('polygon.reach').first()).toBeVisible();await expect(page.locator('[data-id="g2"] .attack-bar')).toHaveCount(1);await expect(page.locator('#actionMove,#actionAttack')).toHaveCount(0);await page.locator('[data-id="g2"]').click();await expect(page.locator('#log')).toContainText('dado');await expect(page.locator('#unitInfo')).toContainText('já atacou');});

test('missão distingue meta acumulada de rendimento por rodada',async({page})=>{
 await page.goto('/');await expect(page.locator('#modalBody')).toContainText('8 pontos');await page.locator('#begin').click();
 await expect(page.locator('#score')).toHaveText('0 / 8');
 await expect(page.locator('#missionDetail')).toContainText('até 4 pontos por rodada');
 await expect(page.locator('#goals')).toContainText('+2/rodada');
 await clickNavigation(page,"rules");await expect(page.locator('#modalBody')).toContainText('4 pontos por rodada, não o limite do placar');
});

test('meta de partida salva aparece igual no placar, missão, narrativa e regras',async({page})=>{
 const{createGame}=await import('../../dist/engine.js');const game=createGame();game.rules.targetScore=6;
 await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);
 await page.goto('/');await page.locator('#begin').click();await expect(page.locator('#score')).toHaveText('0 / 6');await expect(page.locator('#missionDetail')).toContainText('Acumule 6 pontos');
 await clickNavigation(page,"briefing");await expect(page.locator('#modalBody')).toContainText('6 pontos');await page.locator('#close').click();await clickNavigation(page,"rules");await expect(page.locator('#modalBody')).toContainText('Acumule 6 pontos');
});

test('projeção da missão mostra pontos, ritmo e prazo sem mover a peça',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();await expect(page.locator('#missionForecast')).toContainText('Faltam 8 pontos');await expect(page.locator('#missionForecast')).toContainText('+0/rodada');await expect(page.locator('#missionForecast')).toContainText('10 fechamento');await expect(page.locator('#missionForecast')).toContainText('rodada 7');await expect(page.locator('#missionForecast')).toContainText('ignorando bloqueios e fogo');
});

test('percurso exposto é laranja e supressão remove aviso de reação',async({page})=>{
 const{createGame}=await import('../../dist/engine.js');const game=createGame();game.units=game.units.filter(u=>['b1','g1'].includes(u.id));Object.assign(game.units[0],{q:5,r:3});Object.assign(game.units[1],{q:5,r:2});
 await page.addInitScript(g=>{if(!localStorage.getItem('monte-castelo-session-v1'))localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'}));},game);await page.goto('/');await page.locator('#begin').click();await page.locator('[data-id="b1"]').click();await expect(page.locator('polygon[data-q="4"][data-r="3"]')).toHaveClass(/exposed-reach/);await expect(page.locator('#actionHint')).toContainText('borda tracejada');
 game.units[1].suppressed=true;await page.evaluate(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);await page.reload();await page.locator('#begin').click();await page.locator('[data-id="b1"]').click();await expect(page.locator('polygon.exposed-reach')).toHaveCount(0);
});


test('objetivos têm estrela vermelha central sob as peças e sem interceptar toques',async({page})=>{
  await page.goto('/');await page.locator('#begin').click();
  await expect(page.locator('.objective-star')).toHaveCount(3);
  const stars=await page.locator('.objective-star').evaluateAll(nodes=>nodes.map(el=>{
    const [q,r]=el.dataset.objective.split(',').map(Number),points=el.getAttribute('points').split(' ').map(p=>p.split(',').map(Number));
    return {radius:Math.max(...points.map(([x,y])=>Math.hypot(x-(65+q*64+r*32),y-(63+r*56)))),x:points.reduce((n,p)=>n+p[0],0)/10,y:points.reduce((n,p)=>n+p[1],0)/10,expectedX:65+q*64+r*32,expectedY:63+r*56,fill:el.getAttribute('fill'),pointer:el.getAttribute('pointer-events'),beforeUnits:!!(el.compareDocumentPosition(document.querySelector('.unit'))&Node.DOCUMENT_POSITION_FOLLOWING)};
  }));
  for(const star of stars){expect(star.radius).toBeLessThanOrEqual(11);expect(star.radius).toBeGreaterThanOrEqual(9);expect(star.x).toBeCloseTo(star.expectedX,5);expect(star.y).toBeCloseTo(star.expectedY,5);expect(star.fill).toBe('var(--ui-objective)');expect(star.pointer).toBe('none');expect(star.beforeUnits).toBeTruthy();}
});

test('encerrar turno fica no mapa durante zoom e rolagem inclusive no celular',async({page})=>{
  await page.goto('/');await page.locator('#begin').click();
  await expect(page.locator('.battlefield #end')).toHaveCount(1);
  await page.locator('#zoom').fill('2');await page.locator('#zoom').dispatchEvent('input');
  await page.locator('#viewport').evaluate(el=>{el.scrollLeft=300;el.scrollTop=250;});
  await page.locator('#viewport').evaluate(el=>el.scrollIntoView({block:'center'}));
  const positions=await page.evaluate(()=>{const button=document.querySelector('#end').getBoundingClientRect(),bar=document.querySelector('.map-turn-bar').getBoundingClientRect(),viewport=document.querySelector('#viewport');return {button:{top:button.top,bottom:button.bottom,height:button.height},bar:{top:bar.top,bottom:bar.bottom},height:innerHeight,scroll:viewport.scrollLeft,sticky:getComputedStyle(document.querySelector('.map-turn-bar')).position};});
  expect(positions.sticky).toBe('sticky');expect(positions.scroll).toBeGreaterThan(0);expect(positions.button.height).toBeGreaterThanOrEqual(48);expect(positions.button.top).toBeGreaterThanOrEqual(0);expect(positions.button.bottom).toBeLessThanOrEqual(positions.height);await expect(page.locator('#end')).toBeEnabled();
});

test('computador FEB inicia sozinho e humano alemão retoma seu lado',async({page})=>{
  await page.goto('/');await page.locator('#begin').click();
  await page.locator('#gameMode').selectOption('computer-br');
  await expect(page.locator('#modalBody')).toContainText('peças em carvão');
  await page.locator('#begin').click();
  await expect(page.locator('#yourSide')).toContainText('DEFESA ALEMÃ');
  await expect(page.locator('#end')).toBeEnabled({timeout:10000});
  const getState=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')));
  expect((await getState()).game.turn).toBe('de');
  await page.reload();await page.locator('#begin').click();
  await expect(page.locator('#end')).toBeEnabled();expect((await getState()).game.turn).toBe('de');
  await page.locator('#end').click();await expect(page.locator('#round')).toHaveText('2 / 10');await expect(page.locator('#end')).toBeEnabled({timeout:10000});expect((await getState()).game.turn).toBe('de');
});

test('dois humanos no aparelho alternam lados sem IA nem envio',async({page})=>{
  await page.goto('/');await page.locator('#begin').click();await page.locator('#gameMode').selectOption('local');await page.locator('#begin').click();
  await expect(page.locator('#ai')).toBeDisabled();await page.locator('#end').click();
  await expect(page.locator('#phase')).toHaveText('Vez da DEFESA ALEMÃ');await expect(page.locator('#end')).toBeEnabled();await expect(page.locator('dialog')).not.toBeVisible();
  await page.locator('[data-id="g5"]').click();await expect(page.locator('polygon.reach').first()).toBeVisible();
  await page.locator('#end').click();await expect(page.locator('#phase')).toHaveText('Vez da FEB');await expect(page.locator('#round')).toHaveText('2 / 10');await expect(page.locator('dialog')).not.toBeVisible();
  await page.reload();await page.locator('#begin').click();await expect(page.locator('#gameMode')).toHaveValue('local');await expect(page.locator('#end')).toBeEnabled();
});

test('atirar antes de mover preserva PM e permite só um tiro',async({page})=>{
  const {createGame}=await import('../../dist/engine.js');const game=createGame();Object.assign(game.units.find(u=>u.id==='b5'),{q:2,r:6});
  await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);
  await page.goto('/');await page.locator('#begin').click();await page.locator('[data-id="b5"]').click();
  await page.locator('[data-id="g2"]').click();await expect(page.locator('#actionHint')).toContainText('ainda pode mover');await expect(page.locator('#unitInfo')).toContainText('Movimento 1/1');await expect(page.locator('.attack-bar')).toHaveCount(0);await expect(page.locator('polygon.reach').first()).toBeVisible();
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).game);
  await page.locator('polygon.reach').first().click();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')).game),actor=after.units.find(u=>u.id==='b5');
  expect(actor.fired).toBeTruthy();expect(actor.mp).toBeLessThan(before.units.find(u=>u.id==='b5').mp);expect(after.log.filter(l=>l.includes('dado')).length).toBe(before.log.filter(l=>l.includes('dado')).length);await expect(page.locator('.attack-bar')).toHaveCount(0);
});

test('apoio Sampaio explica infantaria agregada, armas e alcance de cenário',async({page})=>{
  await page.goto('/');await page.locator('#begin').click();await page.locator('[data-id="b4"]').dblclick();
  await expect(page.locator('#modalBody')).toContainText('ramo de infantaria');await expect(page.locator('#modalBody')).toContainText('81 e 60 mm');await expect(page.locator('#modalBody')).toContainText('360 m');await expect(page.locator('#modalBody')).toContainText('quarto batalhão');await expect(page.locator('#modalBody a')).toHaveAttribute('href',/museuvirtualdafeb/);
});


test('turno salvo do computador FEB continua sem repetir peça já ativada',async({page})=>{
  const {createGame}=await import('../../dist/engine.js');const game=createGame();
  await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer-br',localSide:'de',ai:'tactical',stance:'aggressive',aiProgress:{side:'br',completed:['b1'],chosen:'tactical',stance:'aggressive',mode:'tactical',before:0,oldScore:0}})),game);
  await page.goto('/');await page.locator('#begin').click();await expect(page.locator('#end')).toBeEnabled({timeout:10000});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')));
  expect(saved.game.turn).toBe('de');expect(saved.aiProgress).toBeNull();
  const actor=saved.game.units.find(u=>u.id==='b1');expect([actor.q,actor.r,actor.mp,actor.fired]).toEqual([1,7,3,false]);
});

test('trocar de modo cancela turno do computador que ainda está em execução',async({page})=>{
  await page.goto('/');await page.locator('#begin').click();await page.locator('#gameMode').selectOption('computer-br');await page.locator('#begin').click();
  await page.locator('#gameMode').selectOption('local');await page.locator('#begin').click();
  await expect(page.locator('#phase')).toHaveText('Vez da FEB');await page.waitForTimeout(1500);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')));
  expect(saved.mode).toBe('local');expect(saved.game.turn).toBe('br');expect(saved.game.round).toBe(1);expect(saved.game.log.filter(l=>l.includes('dado'))).toHaveLength(0);await expect(page.locator('#end')).toBeEnabled();
});

test('partida salva sem defensores encerra imediatamente e compara perdas dos dois lados',async({page})=>{
  const {createGame}=await import('../../dist/engine.js');const game=createGame();game.units=game.units.filter(u=>u.side==='br');game.units.find(u=>u.id==='b1').hp=2;
  await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);
  await page.goto('/');await expect(page.locator('#modalBody')).toContainText('FIM DA OPERAÇÃO');await expect(page.locator('.loss-comparison:not(.historical-losses)')).toContainText('Alemanha');await expect(page.locator('.loss-comparison:not(.historical-losses)')).toContainText('5/5');await expect(page.locator('.loss-comparison:not(.historical-losses)')).toContainText('1/15');await expect(page.locator('#end')).toBeDisabled();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('monte-castelo-session-v1')));expect(saved.game.winner).toBe('br');
});


test('popup final mantém perdas da partida e omite comparação histórica sem dados confirmados',async({page})=>{
  const {createGame}=await import('../../dist/engine.js');const game=createGame();game.units=game.units.filter(u=>u.side==='br');
  await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);
  await page.goto('/');await expect(page.locator('#modalBody')).toContainText('FIM DA OPERAÇÃO');
  await expect(page.locator('.historical-losses,.historical-context,.historical-sources')).toHaveCount(0);
  await expect(page.locator('.loss-comparison')).toContainText('Alemanha');
  await expect(page.locator('.loss-comparison')).toContainText('Coesão');
  await expect(page.locator('#modalBody')).not.toContainText('414');
});
