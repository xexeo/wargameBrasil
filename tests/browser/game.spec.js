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
  await page.locator("#rules").click();
  await expect(page.locator("#modalBody")).toContainText("altura");
  await expect(page.locator("#modalBody")).toContainText("Bolinhas douradas");
  await expect(page.locator("#modalBody")).toContainText("Retângulo com X");
  await page.locator("#close").click();
  await page.locator("#weatherInfo").click();
  await expect(page.locator("#modalBody")).toContainText(
    "reconstrução regional ERA5",
  );
  await expect(page.locator("#modalBody")).toContainText("25 km");
  await page.locator("#close").click();
  await page.locator("#briefing").click();
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
  await page.locator("#credits").click();
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
  await page.locator("#credits").click();
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
  const { aiAction,activationOrder } = await import("../../dist/ai.js");
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
      const source = game.units.find((u) => u.id === id);
      if (!source) continue;
      const planned = structuredClone(game),
        action = aiAction(planned, id, "tactical", "aggressive"),
        destination = planned.units.find((u) => u.id === id);
      await page.locator(`[data-id="${id}"]`).click();
      if (source.q !== destination.q || source.r !== destination.r)
        await page
          .locator(
            `polygon[data-q="${destination.q}"][data-r="${destination.r}"]`,
          )
          .click();
      const current=await state();
      if(current.winner)break;
      const {canAttack}=await import('../../dist/engine.js');
      const actor=current.units.find(u=>u.id===id),target=action?current.units.find(u=>u.id===action.target):null;
      if (action&&actor&&target&&canAttack(actor,target)) {

        await page.locator(`[data-id="${action.target}"]`).click();
      }
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
 await page.locator('#rules').click();await expect(page.locator('#modalBody')).toContainText('4 pontos por rodada, não o limite do placar');
});

test('meta de partida salva aparece igual no placar, missão, narrativa e regras',async({page})=>{
 const{createGame}=await import('../../dist/engine.js');const game=createGame();game.rules.targetScore=6;
 await page.addInitScript(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);
 await page.goto('/');await page.locator('#begin').click();await expect(page.locator('#score')).toHaveText('0 / 6');await expect(page.locator('#missionDetail')).toContainText('Acumule 6 pontos');
 await page.locator('#briefing').click();await expect(page.locator('#modalBody')).toContainText('6 pontos');await page.locator('#close').click();await page.locator('#rules').click();await expect(page.locator('#modalBody')).toContainText('Acumule 6 pontos');
});

test('projeção da missão mostra pontos, ritmo e prazo sem mover a peça',async({page})=>{
 await page.goto('/');await page.locator('#begin').click();await expect(page.locator('#missionForecast')).toContainText('Faltam 8 pontos');await expect(page.locator('#missionForecast')).toContainText('+0/rodada');await expect(page.locator('#missionForecast')).toContainText('10 fechamento');await expect(page.locator('#missionForecast')).toContainText('rodada 7');await expect(page.locator('#missionForecast')).toContainText('ignorando bloqueios e fogo');
});

test('percurso exposto é laranja e supressão remove aviso de reação',async({page})=>{
 const{createGame}=await import('../../dist/engine.js');const game=createGame();game.units=game.units.filter(u=>['b1','g1'].includes(u.id));Object.assign(game.units[0],{q:5,r:3});Object.assign(game.units[1],{q:5,r:2});
 await page.addInitScript(g=>{if(!localStorage.getItem('monte-castelo-session-v1'))localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'}));},game);await page.goto('/');await page.locator('#begin').click();await page.locator('[data-id="b1"]').click();await expect(page.locator('polygon[data-q="4"][data-r="3"]')).toHaveClass(/exposed-reach/);await expect(page.locator('#actionHint')).toContainText('borda laranja');
 game.units[1].suppressed=true;await page.evaluate(g=>localStorage.setItem('monte-castelo-session-v1',JSON.stringify({schema:1,game:g,mode:'computer',localSide:'br',ai:'tactical',stance:'defensive'})),game);await page.reload();await page.locator('#begin').click();await page.locator('[data-id="b1"]').click();await expect(page.locator('polygon.exposed-reach')).toHaveCount(0);
});
