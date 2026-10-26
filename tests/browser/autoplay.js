import {expect} from '@playwright/test';
export async function autoplayUI(page,scale='battalion'){
  const { aiAction,activationOrder,selectAttackTarget } = await import("../../dist/ai.js");
  const {canCommand}=await import("../../dist/engine.js");
  await page.addInitScript(() => {
    let n = 42;
    Math.random = () => {
      n = (Math.imul(1664525, n) + 1013904223) >>> 0;
      return n / 4294967296;
    };
  });
  await page.goto("/");
  if(scale==='company')await page.locator("#openingScale").selectOption('company');
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
      if (!source||!canCommand(game,source)) continue;
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
    `Autojogo na interface: ${final.winner}, rodada ${final.finishedRound??final.round}, ${final.score} pontos.`,
  );
  return final;
}
