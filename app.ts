import { t, translateData, language, setLanguage, applyStaticTranslations, initializeStaticTranslations, localizedDate, translateRenderedMessage } from "./i18n.js";
import {tributeAssets} from "./tribute-assets.js";
import {createCombatEffects} from "./combat-effects.js";
import {tributePhoto} from "./tribute-photo.js";
import {chooseFixedPolicy} from "./fixed-learning.js";
import {fixedModels} from "./fixed-models.js";
import {chooseSimplePolicy,updateSimplePolicy} from "./simple-learning.js";
import {officialMap} from "./official-map.js";
import {troopProfiles,troopProfile,troopLevels} from "./troops.js";
import { geography, altitude } from "./geography.js";
import { weatherAt, weatherHours, weatherQuery } from "./weather.js";
import { type Side } from "./engine.js";
import {
  validGame,
  encodeTurn,
  decodeTurn,
  publicTurnLink,
} from "./exchange.js";
import { pretrained } from "./pretrained.js";
import {
  beginLearningTurn,
  finishLearningEpisode,
  validLearning,
  type LearningContext,
  type LearningTable,
} from "./learning.js";
import { browserStore } from "./persistence.js";
import { activationOrder,takeAIAction } from "./ai.js";
import { release } from "./version.js";
import { ludesLogo, historicalMap } from "./assets-data.js";
import { licenseText } from "./license-text.js";
import {
  COLS,
  ROWS,
  LIMIT,
  key,
  objectives,
  terrain,
  fortification,
  elevation,
  clock,
  createGame,
  reachable,
  canAttack,
  attackRange,
  maximumMovement,
  advance,
  targetScore,
  objectivePointsPerRound,
  roundLimit,
  victoryAssessment,
  missionForecast,
  missionInstruction,
  movementExposure,
  operationResult,
  canCaptureObjective,
  unitLevel,
  move,
  attack,
  endTurn,
  checkWinner,
  battleLosses,
} from "./engine.js";
const $ = (id: string): any => document.getElementById(id);
const gameLogo=tributeAssets.feb.src;
initializeStaticTranslations();
function updateVersionLabels(){
 const date=localizedDate(release.builtAt);
 $("titleVersion").title=date+" · Brasília";
 $("buildVersion").textContent=`v${release.version} · ${date} · Brasília`;
}

$("gameLogo").src = gameLogo;
$("titleVersion").textContent = `v${release.version}`;
$("titleVersion").title = localizedDate(release.builtAt) + t("app.001");
$("buildVersion").textContent =
  t("app.002", release.version, localizedDate(release.builtAt));
let game = createGame(),
  selected: string | null = null,
  zoom = 1,
  busy = false,
  generation = 0,
  lastTap: { id: string | null; time: number } = { id: null, time: 0 },
  rewarded = false;
let trained: LearningTable = structuredClone(pretrained),
  trainedContext: LearningContext = {},
  trainedUsed = false;
try {
  const saved = JSON.parse(
    browserStore.read("monte-castelo-trained-v1") || "null",
  );
  if (validLearning(saved)) trained = saved;
} catch {}
function saveTrained() {
  const ok = browserStore.write(
    "monte-castelo-trained-v1",
    JSON.stringify(trained),
  );
  $("storageStatus").textContent = ok
    ? t("app.003")
    : t("app.004");
}
let memory: {
  games: number;
  q: Record<string, number>;
  visits: Record<string, number>;
} = { games: 0, q: {}, visits: {} };
try {
  const stored = JSON.parse(
    browserStore.read("monte-castelo-learning-v1") || "null",
  );
  if (stored && Number.isFinite(stored.games) && stored.q && stored.visits)
    memory = stored;
} catch {}
let policy: string | null = null,
  episode: string[] = [];
const esc = (s) =>
  String(translateData(String(s))).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] || c,
  );
function persist() {
  try {
    browserStore.write("monte-castelo-learning-v1", JSON.stringify(memory));
    return true;
  } catch {
    return false;
  }
}
function learn(reward, terminal = false) {
  if (!updateSimplePolicy(memory,policy,reward,terminal)) return;
  episode.push(policy!);
  persist();
}
function choosePolicy(side: Side) { return chooseSimplePolicy(memory,side); }
const center = (q, r) => ({ x: 65 + q * 64 + r * 32, y: 63 + r * 56 });
const combatEffects=createCombatEffects($("map"),$("combatAnnouncement"),event=>{
 const kind=t(`combat.${event.kind}`),result=event.damage?t("combat.damage",event.damage):t("combat.miss");
 const label=`${kind} · ${result}`;
 return {label,announcement:`${translateData(event.from.name)} → ${translateData(event.to.name)}: ${label}`};
});
let effectsGame=game;
const hex = (q, r) => {
  const { x, y } = center(q, r);
  return Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i - 30) * Math.PI) / 180;
    return `${x + 37 * Math.cos(a)},${y + 37 * Math.sin(a)}`;
  }).join(" ");
};
function symbol(u) {
  return u.type === "infantry"
    ? '<path d="M-14 -13L14 5M14 -13L-14 5"/>'
    : u.type === "armor"
      ? '<ellipse cx="0" cy="-4" rx="11" ry="6"/>'
      : '<circle cx="0" cy="-4" r="5" fill="#f4efd9"/>';
}
let localSide: Side = "br";
function computerSide(): Side | null {
  return $("gameMode").value === "computer" ? "de" : $("gameMode").value === "computer-br" ? "br" : null;
}
function humanSide(): Side { return $("gameMode").value === "remote" ? localSide : computerSide()==="br"?"de":"br"; }
function sideName(side: Side) { return side === "br" ? "FEB" : t("app.007"); }
function commandDescription() {
  return $("gameMode").value === "local" ? t("app.008") : t("app.009", sideName(humanSide()), humanSide()==="br"?t("app.010"):t("app.011"), computerSide()?t("app.012", sideName(computerSide()!)):t("app.013"));
}
function myTurn() {
  return $("gameMode").value === "local" || game.turn === humanSide();
}
let aiProgress: {side: Side; completed: string[]; chosen: string; stance: string; mode: string; before: number; oldScore: number} | null = null;
function saveSession() {
  browserStore.write(
    "monte-castelo-session-v1",
    JSON.stringify({
      schema: 1,
      game,
      localSide,
      mode: $("gameMode").value,
      ai: $("ai").value,
      stance: $("stance").value,
      rewarded,
      trainedUsed,
      trainedContext,
      aiProgress, policy, episode,
    }),
  );
}
function loadSession(): boolean {
  try {
    const value = JSON.parse(
      browserStore.read("monte-castelo-session-v1") || "null",
    );
    if (
      value?.schema !== 1 ||
      !validGame(value.game) ||
      !["br", "de"].includes(value.localSide) ||
      !["computer", "computer-br", "local", "remote"].includes(value.mode)
    )
      return false;
    game = value.game;
    localSide = value.localSide;
    if (value.aiProgress && ["br","de"].includes(value.aiProgress.side) && Array.isArray(value.aiProgress.completed) && value.aiProgress.completed.every(id=>typeof id === "string") && ["strong","weak","tactical"].includes(value.aiProgress.chosen) && ["aggressive","defensive"].includes(value.aiProgress.stance) && ["strong","weak","tactical","learning","trained","trained-fixed"].includes(value.aiProgress.mode) && Number.isFinite(value.aiProgress.before) && Number.isFinite(value.aiProgress.oldScore)) aiProgress=value.aiProgress;
    policy=typeof value.policy === "string"?value.policy:null;
    episode=Array.isArray(value.episode)?value.episode.filter(x=>typeof x === "string"):[];
    $("gameMode").value = value.mode;
    if (
      ["strong", "weak", "tactical", "learning", "trained", "trained-fixed"].includes(value.ai)
    )
      $("ai").value = value.ai;
    if (["aggressive", "defensive"].includes(value.stance))
      $("stance").value = value.stance;
    rewarded = !!value.rewarded;
    trainedUsed = !!value.trainedUsed;
    const ctx = value.trainedContext;
    if (
      ctx &&
      Object.values(ctx).every(
        (p: any) =>
          p &&
          typeof p.state === "string" &&
          Number.isInteger(p.action) &&
          p.action >= 0 &&
          p.action < 6 &&
          Number.isFinite(p.utility),
      )
    )
      trainedContext = ctx;
    return true;
  } catch {
    return false;
  }
}
function forestGlyph(x: number, y: number): string {
  return `<g pointer-events="none">${[
    [-17, 3, 0.8],
    [-7, -8, 1],
    [8, -9, 0.9],
    [18, 6, 0.8],
    [0, 9, 1],
  ]
    .map(
      ([dx, dy, size]) =>
        `<g transform="translate(${x + dx},${y + dy}) scale(${size})"><path d="M0 -13L-7 -2H-4L-9 5H9L4 -2H7Z" fill="#597c68" stroke="#405d4d" stroke-width=".7"/><path d="M0 4V10" stroke="#836d4d" stroke-width="2.5"/></g>`,
    )
    .join("")}</g>`;
}
function fortGlyph(x: number, y: number): string {
  return `<g pointer-events="none"><path d="M${x - 29} ${y + 18}v10h58v-10M${x - 29} ${y - 18}v-10h58v10" stroke="#786e59" stroke-width="5" fill="none"/><path d="M${x - 20} ${y + 26}v-6m12 6v-6m12 6v-6m12 6v-6" stroke="#ede4ce" stroke-width="2"/><rect x="${x - 8}" y="${y - 32}" width="16" height="5" fill="#4b4a43"/></g>`;
}
const heightColors = ["", "#f4efdf", "#e9d6a7", "#d1b48c", "#bd8b4f"];
function contourGlyph(): string {
  let lines = "";
  for (let r = 0; r < ROWS - 1; r++)
    for (let q = 0; q < COLS - 1; q++) {
      const make = (q: number, r: number) => ({
          ...center(q, r),
          z: altitude(q, r),
        }),
        a = make(q, r),
        b = make(q + 1, r),
        c = make(q, r + 1),
        d = make(q + 1, r + 1);
      for (const triangle of [
        [a, b, c],
        [b, d, c],
      ])
        for (const level of [750, 800, 850, 900, 950]) {
          const crossings: { x: number; y: number }[] = [];
          for (let i = 0; i < 3; i++) {
            const p = triangle[i],
              n = triangle[(i + 1) % 3];
            if (
              (p.z < level && n.z >= level) ||
              (n.z < level && p.z >= level)
            ) {
              const t = (level - p.z) / (n.z - p.z);
              crossings.push({
                x: p.x + t * (n.x - p.x),
                y: p.y + t * (n.y - p.y),
              });
            }
          }
          if (crossings.length === 2)
            lines += `<path d="M${crossings[0].x},${crossings[0].y}L${crossings[1].x},${crossings[1].y}" stroke-width="${level % 100 === 0 ? 1.8 : 1}"/>`;
        }
    }
  return `<g class="contours" fill="none" stroke="#936432" stroke-width="2.8" stroke-linecap="round" pointer-events="none">${lines}</g>`;
}
let activeDialog:(()=>string)|null=null;
function render() {
  if(effectsGame!==game){combatEffects.clear();effectsGame=game;}
  checkWinner(game);
  const weather = weatherAt(game.round);
  $("weatherInfo").textContent =
    t("weather.chip", weather.cloud >= 70 ? "☁" : weather.cloud >= 30 ? "⛅" : "☀", Math.round(weather.temperature), weather.cloud, String(weather.hour).padStart(2, "0"));

  const u = game.units.find((v) => v.id === selected),
    reach =
      u && u.side === game.turn && myTurn() && !busy && !game.winner
        ? reachable(game, u)
        : new Map();
  const exposure=new Map<string,ReturnType<typeof movementExposure>>();
  if(u)for(const k of reach.keys()){const[q,r]=k.split(',').map(Number);const risk=movementExposure(game,u,q,r);if(risk)exposure.set(k,risk);}
  let svg =
    t("app.014");
  for (let r = 0; r < ROWS; r++)
    for (let q = 0; q < COLS; q++) {
      const t = terrain(q, r),
        { x, y } = center(q, r);
      svg += `<g><polygon class="hex ${reach.has(key(q, r)) ? "reach" : ""} ${exposure.has(key(q,r))?"exposed-reach":""}" data-q="${q}" data-r="${r}" data-danger="${exposure.has(key(q,r))}" points="${hex(q, r)}" fill="${t === "road" ? "#e6c998" : heightColors[elevation(q, r)]}"/>${t === "forest" ? forestGlyph(x, y) : ""}${fortification(q, r) ? fortGlyph(x, y) : ""}${t === "hill" ? `<path d="M${x - 22} ${y + 12}q22 -38 44 0m-37 0q15 -26 30 0" stroke="#69754e" fill="none" pointer-events="none"/>` : ""}<text x="${x - 25}" y="${y + 27}" font-size="7" fill="#495c3d88" pointer-events="none">~${Math.round(altitude(q, r) / 10) * 10}m · N${elevation(q, r)}</text></g>`;
    }
  svg += geographicGlyph();
  svg += contourGlyph();
  for (const o of objectives) {
    const { x, y } = center(o.q, o.r);
    const star=Array.from({length:10},(_,i)=>{const angle=(i*36-90)*Math.PI/180,radius=i%2?4.2:10;return `${x+radius*Math.cos(angle)},${y+radius*Math.sin(angle)}`;}).join(" ");
    svg += t("app.016", x, y, o.q, o.r, star, x, y - 39, o.name?o.name+' · ':'', o.points);
  }
  svg +=
    t("app.017");
  for (const v of game.units) {
    const { x, y } = center(v.q, v.r),
      target =
        u &&
        u.side === game.turn &&
        canAttack(u, v) &&
        !busy &&
        myTurn();
    svg += t("app.018", selected === v.id ? "selected" : "", target ? "target" : "", v.id, x, y, esc(v.name), v.side === "br" ? "FEB" : t("app.019"), v.hp, v.atk, v.def, esc(v.name), v.atk, v.def, v.hp, v.side === "br" ? "#226ba4" : "#30363d", target?'<rect class="attack-bar" x="-24" y="-30" width="48" height="4" rx="1" fill="#c92f37" pointer-events="none"/>':'', troopProfile(v.id)?.mark??'II', unitLevel(v), symbol(v), v.side === "br" ? "FEB" : "DE", v.hp, v.atk, v.def, v.mp, Array.from({ length: v.hp }, (_, i) => `<circle cx="${-7 + i * 7}" cy="10" r="2" fill="#eed788"/>`).join(""), v.hp < 3 ? `<g><circle cx="23" cy="-23" r="10" fill="#b34332" stroke="#fff"/><text x="23" y="-20" text-anchor="middle" style="font-size:10px">−${3 - v.hp}</text></g>` : "", v.suppressed?'<circle class="suppression-marker" cx="-23" cy="-23" r="6" fill="#e2a827" stroke="#fff"/><text x="-23" y="-20" text-anchor="middle" style="font-size:8px">S</text>':'', v.fired ? '<path d="M-22 -22L22 22" stroke="#e5d9bb" opacity=".4"/>' : "");
  }
  $("map").innerHTML = svg;
  combatEffects.redraw();
  $("time").textContent = clock(game.winner&&game.finishedRound?game.finishedRound+1:game.round);
  const actionable =
    u && u.side === game.turn && myTurn() && !busy && !game.winner;
  $('actionHint').textContent=actionable?(u.fired?(u.mp>0?t("app.024", u.name, u.mp):t("app.025", u.name)):t("app.026", u.name, u.mp)):t("app.027");
  if(actionable&&exposure.size)$('actionHint').textContent+=t("app.028", exposure.size);
  $("goals").innerHTML = objectives
    .map((o, i) => {
      const held = game.units.find((v) => v.q === o.q && v.r === o.r && canCaptureObjective(v));
      return t("app.029", i, held ? "held-" + held.side : "", o.name||`Hex ${o.q+1}-${o.r+1}`, o.points, held ? (held.side === "br" ? t("app.030") : t("app.031")) : t("app.032"));
    })
    .join("");
  $("round").textContent = `${game.finishedRound??Math.min(game.round,roundLimit(game))} / ${roundLimit(game)}`;
  $('missionTitle').textContent=game.rules?.requireSummit?t("app.033"):t("app.034");
  $('missionDetail').textContent=t("app.035", game.rules?.requireSummit?t("app.036"):'', missionInstruction(game), objectivePointsPerRound());
  const forecast=missionForecast(game);
  $('missionForecast').textContent=game.winner?translateData(operationResult(game).detail):t("app.037", forecast.missing, forecast.income, forecast.remaining, forecast.missing===0?t("app.038"):forecast.income?t("app.039", forecast.roundsAtCurrentIncome):t("app.040"), !forecast.pointsPossible?t("app.041"):forecast.missing?t("app.042", forecast.lastSummitOnlyRound):'', game.rules?.summitAtDeadlineWins?t("app.043"):'', forecast.earliestSummitRound!==null&&!forecast.summit?t("app.044", forecast.earliestSummitRound):'');
  $('missionForecast').classList.toggle('urgent',!game.winner&&(!forecast.pointsPossible||(forecast.roundsAtCurrentIncome!==null&&forecast.roundsAtCurrentIncome>forecast.remaining)||game.round>=8));
  $("score").textContent = `${game.score} / ${targetScore(game)}`;
  $("end").disabled = busy || !!game.winner || !myTurn();
  $("shareTurn").disabled =
    $("gameMode").value !== "remote" ||
    game.turn === localSide ||
    !!game.winner;
  $("yourSide").textContent = $("gameMode").value === "local" ? t("app.045", sideName(game.turn)) : t("app.046", sideName(humanSide()));
  $("ai").disabled = busy || !computerSide();
  $("stance").disabled = busy || !computerSide() || $("ai").value === "trained-fixed";
  $("phase").textContent = game.winner
    ? t($("gameMode").value === "local" ? "phase.localWinner" : game.winner===humanSide()?"phase.playerWinner":"phase.playerDefeat",sideName(game.winner),operationResult(game).title)
    : busy ? t("app.050", sideName(game.turn)) : !myTurn() ? ($("gameMode").value==="remote"?t("app.051"):t("app.052")) : $("gameMode").value==="local"?t("app.053", sideName(game.turn)):t("app.054");
  $("brief").textContent = game.winner
    ? t("app.055")
    : translateData(missionInstruction(game));
  $("log").innerHTML = game.log
    .slice(0, 7)
    .map((l) => `<p>${esc(l)}</p>`)
    .join("");
  $("unitName").textContent = u ? translateData(u.name) : t("app.056");
  $("unitInfo").innerHTML = u
    ? t("app.057", esc(troopProfile(u.id)?.echelon??t("term.Agrupamento")), esc(troopProfile(u.id)?.formation??''), u.side === "br" ? t("app.058") : t("app.059"), { infantry: t("term.Infantaria"), armor: t("app.060"), artillery: t("term.Artilharia") }[u.type], u.atk, u.def, u.hp, u.mp, maximumMovement(u), unitLevel(u), troopLevels[unitLevel(u)], Math.round(altitude(u.q, u.r)), elevation(u.q, u.r), fortification(u.q, u.r), attackRange(u), u.heightRange&&!u.indirect?t("app.061"):'', ["hill", "forest"].includes(terrain(u.q, u.r)) ? "+1" : "0", u.fired ? (u.mp>0?t("app.062"):t("app.063")) : u.mp === 0 ? t("app.064") : (game.rules?.freeFireOrder?t("app.065"):t("app.066")), 3 - u.hp, u.atk - (3 - u.hp) * 0.5, u.reorganizing?t("app.067"):'', u.suppressed?t("app.068"):'', u.reactionSpent?t("app.069"):'', canCaptureObjective(u)?t("app.070"):t("app.071"), u.maxMp===undefined?t("app.072"):'', u.id==='b4'?sampaioSupport():'')
    : t("app.073", $("gameMode").value==="local"?(game.turn==="br"?t("term.azul"):t("app.074")):humanSide()==="br"?t("term.azul"):t("app.075"));
  $("learningStatus").textContent =
    $("ai").value === "trained-fixed"
      ? t("fixed.status", sideName(computerSide()??"de"), fixedModels[computerSide()??"de"].episodes)
      : t("app.076", trained.episodes, Object.keys(trained.q).length, memory.games, policy ? " · " + policy.replace(/^br:/, "").replace("/", " / ") : "");
  if (game.winner && !rewarded) {
    rewarded = true;
    if (trainedUsed) {
      finishLearningEpisode(trained, trainedContext, game);
      saveTrained();
    }
    if (episode.length || policy) {
      learn(game.winner === computerSide() ? 8 : -8, true);
      memory.games++;
      persist();
      $("learningStatus").textContent =
        t("app.077", memory.games);
    }
    const assessment=victoryAssessment(game),outcome=operationResult(game);
    show(() => t("app.078", esc(outcome.title), esc(outcome.detail), assessment.rounds, roundLimit(game), game.score, assessment.lostUnits, assessment.lostCohesion, assessment.efficiency, gameLossComparison(), "", sideName(game.winner!), game.rules?.summitAtDeadlineWins?t("victory.paths",targetScore(game),roundLimit(game)):t("victory.legacy",missionInstruction(game))));
  }
  saveSession();
}
function show(html:()=>string) {
  activeDialog=html;
  $("modalBody").innerHTML = html();
  if (!$("modal").open) $("modal").showModal();
}
function refreshDialog(){
 if(!$("modal").open||!activeDialog)return;
 const statuses=["importResult","shareStatus"].map(id=>({id,text:$(id)?.textContent}));
 const handlers=new Map<string,{click:GlobalEventHandlers['onclick'];change:GlobalEventHandlers['onchange'];value:string}>();
 for(const el of $("modalBody").querySelectorAll('[id]') as NodeListOf<HTMLInputElement>)handlers.set(el.id,{click:el.onclick,change:el.onchange,value:el.value});
 $("modalBody").innerHTML=activeDialog();
 for(const status of statuses)if(status.text&&$(status.id))$(status.id).textContent=translateRenderedMessage(status.text);
 for(const [id,h]of handlers){const el=$(id);if(el){el.onclick=h.click;el.onchange=h.change;if(el.type!=="file"&&h.value!==undefined)el.value=h.value;}}
}

function inspect(u) {
  show(() => t("app.079", esc(u.name), esc(troopProfile(u.id)?.echelon??t("term.Agrupamento")), unitLevel(u), troopLevels[unitLevel(u)], u.side, u.type === "infantry" ? "☒" : u.type === "armor" ? "▱" : "●", u.atk, u.def, u.mp, u.hp, 3 - u.hp, u.atk, u.def, u.hp, 3 - u.hp, attackRange(u), esc(troopProfile(u.id)?.description??t("app.080")), u.id==='b4'?sampaioSupport():'', canCaptureObjective(u)?t("app.081"):t("app.082"), maximumMovement(u),unitCurrentState(u)));
}
function unitCurrentState(u){
 const damage=3-u.hp,penalty=damage*.5,number=(n:number)=>new Intl.NumberFormat(language,{maximumFractionDigits:1}).format(n);
 const yes=(flag:boolean)=>t(flag?"unit.yes":"unit.no");
 return t("unit.current",u.hp,damage,u.mp,maximumMovement(u),number(u.atk-penalty),u.atk,number(penalty),u.def,yes(!!u.fired),yes(u.mp>0&&!u.reorganizing&&!game.winner&&u.side===game.turn),yes(!!u.suppressed),yes(!!u.reorganizing),yes(!!u.reactionSpent));
}
function selectUnit(id) {
  const now = Date.now(),
    u = game.units.find((v) => v.id === id);
  if (!u) return;
  if (lastTap.id === id && now - lastTap.time < 650) {
    lastTap = { id: null, time: 0 };
    inspect(u);
    return;
  }
  lastTap = { id, time: now };
  if (busy || game.winner || !myTurn()) {
    selected = id;
    render();
    return;
  }
  const actor = game.units.find((v) => v.id === selected);
  if (actor && actor.side === game.turn && u.side !== actor.side) {
    if (!canAttack(actor, u)) {
      $("actionHint").textContent =
        t("app.083");
      return;
    }
    attack(game, actor.id, u.id, Math.random, combatEffects.enqueue);
    render();
    return;
  }
  selected = id;
  render();
}
$("map").addEventListener("click", (e) => {
  const piece = e.target.closest("[data-id]");
  if (piece) {
    selectUnit(piece.dataset.id);
    return;
  }
  const cell = e.target.closest("[data-q]");
  if (cell && !busy && selected && myTurn()) {
    lastTap = { id: null, time: 0 };
    advance(game, selected, +cell.dataset.q, +cell.dataset.r, Math.random, combatEffects.enqueue);
    render();
  }
});
$("map").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const el = e.target.closest("[data-id]");
    if (el) {
      e.preventDefault();
      selectUnit(el.dataset.id);
    }
  }
});
const pause = () => new Promise((resolve) => setTimeout(resolve, 240));
function hpBalance(side: Side) { return game.units.reduce((total,u)=>total+(u.side===side?u.hp:-u.hp),0); }
async function computerTurn() {
  const side=computerSide();
  if (!side || game.turn!==side || busy || game.winner) return;
  busy=true;
  const token=generation;
  selected=null;
  if (!aiProgress || aiProgress.side!==side) {
    const mode=$("ai").value;
    policy=mode==="learning"?choosePolicy(side):null;
    let [chosen,stance]=policy?policy.replace(/^br:/,"").split("/"):[mode,$("stance").value];
    if(mode==="trained") {
      trainedUsed=true;
      const learned=beginLearningTurn(trained,trainedContext,game,side);
      chosen=learned.strategy;stance=learned.stance;saveTrained();
    }
    if(mode==="trained-fixed") {
      const fixed=chooseFixedPolicy(game,side);
      chosen=fixed.strategy;stance=fixed.stance;
    }
    aiProgress={side,completed:[],chosen,stance,mode,before:hpBalance(side),oldScore:game.score};
  }
  render();
  const progress=aiProgress;
  for(const id of activationOrder(game,side)) {
    if(progress.completed.includes(id))continue;
    await pause();
    if(token!==generation)return;
    takeAIAction(game,id,progress.chosen,progress.stance,Math.random,combatEffects.enqueue);
    progress.completed.push(id);
    render();
    if(game.winner)break;
  }
  if(!game.winner)endTurn(game);
  if(progress.mode==="learning"&&!rewarded) learn(hpBalance(side)-progress.before+(side==="br"?1:-1)*(game.score-progress.oldScore));
  aiProgress=null;
  busy=false;
  if(progress.mode==="trained")saveTrained();
  render();
}
$("end").onclick = async () => {
  if (busy || game.winner || !myTurn()) return;
  lastTap={id:null,time:0};selected=null;
  endTurn(game);render();
  if($("gameMode").value==="remote") { if(!game.winner)shareTurn(); return; }
  await computerTurn();
};
$("new").onclick = () => {
  if (
    !game.winner &&
    !confirm(
      t("app.084")
    )
  )
    return;
  generation++;
  aiProgress=null;
  game = createGame();
  localSide = computerSide()==="br"?"de":"br";
  selected = null;
  busy = false;
  rewarded = false;
  episode = [];
  policy = null;
  trainedContext = {};
  trainedUsed = false;
  render();
  narrative();
};
const mapBase = 960;
function setZoom(n: number, anchor?: { x: number; y: number }) {
  const viewport = $("viewport");
  const oldWidth = $("map").getBoundingClientRect().width;
  const px = anchor?.x ?? viewport.clientWidth / 2,
    py = anchor?.y ?? viewport.clientHeight / 2;
  const oldX = viewport.scrollLeft + px,
    oldY = viewport.scrollTop + py;
  zoom = Math.max(0.25, Math.min(3, n));
  const newWidth = mapBase * zoom;
  viewport.style.height = `${Math.min(690 * zoom, innerHeight * 0.65)}px`;
  $("map").style.width = `${newWidth}px`;
  $("map").style.minWidth = "0";
  $("resetZoom").textContent = `${Math.round(zoom * 100)}%`;
  $("zoom").value = String(zoom);
  viewport.scrollLeft = (oldX * newWidth) / oldWidth - px;
  viewport.scrollTop = (oldY * newWidth) / oldWidth - py;
}
function fitMap() {
  const viewport = $("viewport");
  const fit = Math.min(viewport.clientWidth / 960, (innerHeight * 0.65) / 690);
  setZoom(fit);
  viewport.scrollTo(0, 0);
}
function idealView() {
  setZoom(
    innerWidth < 600 ? 1.15 : Math.max(0.9, $("viewport").clientWidth / 960),
  );
  const { x, y } = center(3, 4);
  $("viewport").scrollLeft = x * zoom - $("viewport").clientWidth / 2;
  $("viewport").scrollTop = y * zoom - $("viewport").clientHeight / 2;
}
$("in").onclick = () => setZoom(zoom + 0.1);
$("out").onclick = () => setZoom(zoom - 0.1);
$("resetZoom").onclick = () => setZoom(1);
$("zoom").oninput = (e) => setZoom(Number(e.target.value));
$("fit").onclick = fitMap;
$("ideal").onclick = idealView;
$("viewport").addEventListener(
  "wheel",
  (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const rect = $("viewport").getBoundingClientRect();
    setZoom(zoom * Math.exp(-e.deltaY * 0.008), {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  },
  { passive: false },
);
let pinch: { distance: number; zoom: number } | null = null;
$("viewport").addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 2) {
      pinch = {
        distance: Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        ),
        zoom,
      };
    }
  },
  { passive: true },
);
$("viewport").addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length === 2 && pinch) {
      e.preventDefault();
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const rect = $("viewport").getBoundingClientRect();
      setZoom((pinch.zoom * d) / pinch.distance, {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
      });
    }
  },
  { passive: false },
);
$("viewport").addEventListener("touchend", () => (pinch = null));
$("close").onclick = () => $("modal").close();
$("modal").addEventListener("close",()=>{void computerTurn();});
$("rules").onclick = () =>
  show(() => t("app.085", commandDescription(), roundLimit(game), game.rules?.rangeHeightThreshold??90, game.rules?.freeFireOrder?t("app.086"):t("app.087"), objectivePointsPerRound(), missionInstruction(game), roundLimit(game), game.rules?.retreatOnLoss?t("app.088"):t("app.089"), game.rules?.freeFireOrder?t("app.090"):t("app.091")));
function narrative() {
  show(() => t("app.092", gameLogo, commandDescription(), $("gameMode").value==="local"?t("app.093"):humanSide()==="br"?t("app.094"):t("app.095"), missionInstruction(game)));
  $("begin").onclick = () => { $("modal").close(); void computerTurn(); };
}
let resumed = loadSession(),
  received = false;
try {
  if (location.hash.startsWith("#turn=")) {
    game = decodeTurn(location.hash.slice(6));
    localSide = game.turn;
    $("gameMode").value = "remote";
    rewarded = false;
    trainedUsed = false;
    trainedContext = {};
    resumed = true;
    received = true;
    history.replaceState(null, "", location.pathname + location.search);
  }
} catch {
  show(() => t("app.096"));
}
render();
fitMap();
if (resumed && !game.winner) {
  show(() => t("app.097", received ? t("app.098") : t("app.099"), Math.min(game.round, 10), game.score, $("gameMode").value === "remote" ? (localSide === "br" ? t("app.100") : t("app.101")) : t("app.102")));
  $("begin").onclick = () => { $("modal").close(); void computerTurn(); };
} else if (!game.winner) narrative();

$("credits").onclick = () =>
  show(() => t("app.103", gameLogo, ludesLogo, release.version, localizedDate(release.builtAt), esc(language === "en-US" ? englishLicense() : licenseText)));

$("memory").onclick = () => {
  show(() => t("app.104", trained.episodes, trained.updates, Object.keys(trained.q).length, pretrained.episodes) + fixedModelSummary());
  $("exportMemory").onclick = () => {
    const blob = new Blob([JSON.stringify(trained, null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = language === "en-US" ? "monte-castelo-vibed-experience.json" : "monte-castelo-vibed-experiencia.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $("importMemory").onchange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file || file.size > 2000000)
        throw new Error(t("app.105"));
      const data = JSON.parse(await file.text());
      if (!validLearning(data))
        throw new Error(t("app.106"));
      trained = data;
      trainedContext = {};
      saveTrained();
      $("importResult").textContent =
        t("app.107");
    } catch (err) {
      $("importResult").textContent =
        err instanceof SyntaxError ? t("error.json") : err instanceof Error ? translateData(err.message) : t("app.108");
    }
  };
};

function downloadTurn() {
  const data = JSON.stringify({ schema: 1, game }),
    blob = new Blob([data], { type: "application/json" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `monte-castelo-${language === "en-US" ? "turn" : "turno"}-${game.round}-${game.turn}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function shareTurn() {
  const url = publicTurnLink(game, location.href);
  show(() => t("app.109", game.turn === "br" ? t("app.110") : t("app.111"), url ? t("app.112", encodeURIComponent(t("app.113"))) : t("app.115")));
  $("downloadTurn").onclick = downloadTurn;
  if (url)
    $("copyTurn").onclick = async () => {
      try {
        await navigator.clipboard.writeText(url);
        $("shareStatus").textContent = t("app.116");
      } catch {
        $("shareStatus").textContent =
          t("app.117");
      }
    };
}
$("shareTurn").onclick = shareTurn;
$("gameMode").onchange = () => {
  generation++;
  aiProgress=null;
  game = createGame();
  localSide = computerSide()==="br"?"de":"br";
  busy = false;
  selected = null;
  rewarded = false;
  policy=null;episode=[];
  trainedUsed = false;
  trainedContext = {};
  render();
  narrative();
};
$("ai").onchange = () => {
  saveSession();
  render();
};
$("stance").onchange = saveSession;
$("loadTurn").onchange = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file || file.size > 50000) throw new Error(t("app.118"));
    const value = JSON.parse(await file.text());
    if (value.schema !== 1 || !validGame(value.game))
      throw new Error(t("app.119"));
    generation++;
    aiProgress=null;
    game = value.game;
    localSide = game.turn;
    $("gameMode").value = "remote";
    busy = false;
    selected = null;
    rewarded = false;
    trainedUsed = false;
    trainedContext = {};
    render();
    show(() => t("app.120", game.round, localSide === "br" ? t("term.theFEB") : t("app.121")));
  } catch (err) {
    show(() => t("app.122", esc(err instanceof SyntaxError ? t("error.json") : err instanceof Error ? translateData(err.message) : t("app.123"))));
  } finally {
    e.target.value = "";
  }
};

$("goals").onclick = (e) => {
  const button = e.target.closest("[data-goal]");
  if (!button) return;
  const goal = objectives[Number(button.dataset.goal)],
    pos = center(goal.q, goal.r);
  setZoom(Math.max(zoom, 1.1));
  $("viewport").scrollLeft = pos.x * zoom - $("viewport").clientWidth / 2;
  $("viewport").scrollTop = pos.y * zoom - $("viewport").clientHeight / 2;
};

$("map").addEventListener("dblclick", (e) => {
  e.preventDefault();
  const rect = $("map").getBoundingClientRect(),
    x = ((e.clientX - rect.left) * 960) / rect.width,
    y = ((e.clientY - rect.top) * 690) / rect.height;
  const unit = game.units.find((u) => {
    const p = center(u.q, u.r);
    return Math.abs(p.x - x) < 28 && Math.abs(p.y - y) < 28;
  });
  if (unit) inspect(unit);
});

$("briefing").onclick = narrative;

$("newTop").onclick = () => $("new").click();

$("weatherInfo").onclick = () =>
  show(() => t("app.124", [
      6, 9, 12, 16, 18,
    ]
      .map((i) => {
        const w = weatherHours[i];
        return `<tr><td>${String(i).padStart(2, "0")}:00</td><td>~${w.temperature} °C</td><td>${w.cloud}%</td><td>${w.precipitation} mm</td></tr>`;
      })
      .join(
        "",
      ), weatherQuery));

function geographicGlyph(): string {
  const path = (p: { x: number; y: number }[]) =>
    p.map((v, i) => `${i ? "L" : "M"}${v.x},${v.y}`).join("");
  return `<g pointer-events="none" class="geographical-features">${geography.woods.map((p) => `<path d="${path(p)}Z" fill="#5e856b" fill-opacity=".12" stroke="#658371" stroke-opacity=".3" stroke-width=".7"/>`).join("")}${geography.roads.map((r) => `<path d="${path(r.points)}" fill="none" stroke="${["path", "footway", "track"].includes(r.type) ? "#8e795a" : "#e6b971"}" stroke-width="${["path", "footway"].includes(r.type) ? 1.3 : 3.5}" stroke-dasharray="${["path", "footway"].includes(r.type) ? "3 3" : "none"}" stroke-linecap="round"/>`).join("")}${geography.buildings.map((p) => `<path d="${path(p)}Z" fill="#a48a73" stroke="#806b57" stroke-width=".4"/>`).join("")}${geography.settlements.filter(() => false).map((p) =>
        `<text x="${p.x + 5}" y="${p.y - 6}" class="place-label">${esc(p.name)}</text>`,
    )
    .join("")}</g>`;
}
$("mapSources").onclick = () =>
  show(() => t("app.126", officialMap, historicalMap));

$('forces').onclick=()=>show(() => t("app.127", sampaioSupport(), troopProfiles.map(p=>`<tr><th scope="row">${p.side==='br'?'FEB':'Heer'} · ${esc(p.name)}</th><td>${esc(p.echelon)}</td><td>${p.level}</td><td>${p.atk}</td><td>${p.def}</td><td>${p.mp}</td><td>${p.range}</td><td>${p.canCapture?t("term.sim"):t("app.129")}</td></tr>`).join('')));

function sampaioSupport() { return t("app.130"); }

function gameLossComparison() {
  const losses=battleLosses(game);
  return t("app.131", losses.br.removedUnits, losses.br.initialUnits, losses.de.removedUnits, losses.de.initialUnits, losses.br.lostCohesion, losses.br.initialCohesion, losses.de.lostCohesion, losses.de.initialCohesion, losses.br.withdrawnUnits??t("app.132"), losses.de.withdrawnUnits??t("app.133"));
}


$("language").value=language;
$("language").onchange=()=>{
 setLanguage($("language").value);
 applyStaticTranslations();
 updateVersionLabels();
 $("storageStatus").textContent=translateRenderedMessage($("storageStatus").textContent);
 render();
 refreshDialog();
};
$("tribute").onclick=()=>show(()=>t("tribute.dialog",tributeAssets.regiment.src,translateData(tributeAssets.regiment.label),tributeAssets.regiment.sourceUrl,translateData(tributeAssets.regiment.credit),tributeAssets.feb.src,translateData(tributeAssets.feb.label),tributeAssets.feb.sourceUrl,translateData(tributeAssets.feb.credit),tributePhoto.src));

function fixedModelSummary(){
 return t("fixed.dialog", ...(["br","de"] as const).map(side=>{
  const model=fixedModels[side],p=model.parameters;
  return t("fixed.model",sideName(side),model.episodes,model.updates,Object.keys(model.q).length,model.seeds[0],model.seeds[1],p.alpha,p.gamma,p.epsilonTraining,p.epsilonInference);
 }));
}
updateVersionLabels();

function englishLicense(){
 const begin=licenseText.indexOf("Attribution-NonCommercial-ShareAlike 4.0 International");
 const end=licenseText.lastIndexOf("\n---\n");
 return `Copyright © 2026 Geraldo Xexéo (xexeo)\nCC BY-NC-SA 4.0\n\n${licenseText.slice(begin,end)}\n\n${t("license.thirdParty")}`;
}
