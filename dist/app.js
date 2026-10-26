import { createCombatAudio } from "./combat-audio.js";
import { defaultRules, heightThreshold } from "./scenario.js";
import { operationPresentation as operationResult } from "./outcome-presentation.js";
import { historyContent, openingContext, victoryEpilogue } from "./history-content.js";
import { loadUISettings, applyUISettings, saveUISettings, defaultUISettings, winterUISettings, validatedUISettings, colorControls, numberControls, fontChoices } from "./ui-settings.js";
import { t, translateData, language, setLanguage, applyStaticTranslations, initializeStaticTranslations, localizedDate, translateRenderedMessage } from "./i18n.js";
import { tributeAssets } from "./tribute-assets.js";
import { createCombatEffects } from "./combat-effects.js";
import { tributePhoto } from "./tribute-photo.js";
import { chooseFixedPolicy, modelsForGame } from "./fixed-learning.js";
import { companyPretrained } from "./company-pretrained.js";
import { chooseSimplePolicy, updateSimplePolicy } from "./simple-learning.js";
import { officialMap } from "./official-map.js";
import { profilesForScale, troopProfile, troopLevels } from "./troops.js";
import { geography, altitude } from "./geography.js";
import { weatherAt, weatherHours, weatherQuery } from "./weather.js";
import { validGame, decodeTurn, publicTurnLink, } from "./exchange.js";
import { pretrained } from "./pretrained.js";
import { beginLearningTurn, finishLearningEpisode, validLearning, } from "./learning.js";
import { browserStore } from "./persistence.js";
import { activationOrder, takeAIAction } from "./ai.js";
import { release } from "./version.js";
import { ludesLogo, historicalMap } from "./assets-data.js";
import { licenseText } from "./license-text.js";
import { COLS, ROWS, key, objectives, terrain, fortification, elevation, clock, createGame, scaleOf, canCommand, reachable, canAttack, attackRange, maximumMovement, advance, targetScore, objectivePointsPerRound, roundLimit, victoryAssessment, missionForecast, missionInstruction, movementExposure, canCaptureObjective, unitLevel, attack, endTurn, checkWinner, battleLosses, } from "./engine.js";
const $ = (id) => document.getElementById(id);
const gameLogo = tributeAssets.feb.src;
let uiSettings = loadUISettings();
applyUISettings(uiSettings);
initializeStaticTranslations();
function updateVersionLabels() {
    const date = localizedDate(release.builtAt);
    $("titleVersion").title = date + " · Brasília";
    $("buildVersion").textContent = `v${release.version} · ${date} · Brasília`;
}
$("gameLogo").src = gameLogo;
$("titleVersion").textContent = `v${release.version}`;
$("titleVersion").title = localizedDate(release.builtAt) + t("app.001");
$("buildVersion").textContent =
    t("app.002", release.version, localizedDate(release.builtAt));
let game = createGame(), selected = null, zoom = 1, busy = false, generation = 0, lastTap = { id: null, time: 0 }, rewarded = false;
const learningScope = () => scaleOf(game) === 'company' ? (game.rules?.companyRevision === 2 ? 'company2' : 'company') : 'battalion';
const pretrainedForGame = () => scaleOf(game) === 'company' ? companyPretrained : pretrained;
const memoryKey = (kind) => `monte-castelo-${kind}${learningScope() === 'battalion' ? '' : `-${learningScope()}`}-v1`;
let memoryScale = 'battalion';
let trained = structuredClone(pretrained), trainedContext = {}, trainedUsed = false;
try {
    const saved = JSON.parse(browserStore.read(memoryKey("trained")) || "null");
    if (validLearning(saved))
        trained = saved;
}
catch { }
function saveTrained() {
    const ok = browserStore.write(memoryKey("trained"), JSON.stringify({ ...trained, scale: scaleOf(game), companyRevision: game.rules?.companyRevision }));
    $("storageStatus").textContent = ok
        ? t("app.003")
        : t("app.004");
}
let memory = { games: 0, q: {}, visits: {} };
try {
    const stored = JSON.parse(browserStore.read(memoryKey("learning")) || "null");
    if (stored && Number.isFinite(stored.games) && stored.q && stored.visits)
        memory = stored;
}
catch { }
function loadScaleMemories() {
    memoryScale = learningScope();
    trained = structuredClone(pretrainedForGame());
    memory = { games: 0, q: {}, visits: {} };
    try {
        const saved = JSON.parse(browserStore.read(memoryKey('trained')) || 'null');
        if (validLearning(saved) && (saved.scale ?? 'battalion') === scaleOf(game))
            trained = saved;
    }
    catch { }
    try {
        const saved = JSON.parse(browserStore.read(memoryKey('learning')) || 'null');
        if (saved && Number.isFinite(saved.games) && saved.q && saved.visits)
            memory = saved;
    }
    catch { }
}
let policy = null, episode = [];
const esc = (s) => String(translateData(String(s))).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
function persist() {
    try {
        browserStore.write(memoryKey("learning"), JSON.stringify(memory));
        return true;
    }
    catch {
        return false;
    }
}
function learn(reward, terminal = false) {
    if (!updateSimplePolicy(memory, policy, reward, terminal))
        return;
    episode.push(policy);
    persist();
}
function choosePolicy(side) { return chooseSimplePolicy(memory, side); }
const center = (q, r) => ({ x: 65 + q * 64 + r * 32, y: 63 + r * 56 });
const combatAudio = createCombatAudio(() => ({ enabled: uiSettings.soundEnabled, volume: uiSettings.numbers.soundVolume, duration: uiSettings.numbers.animationDuration }));
const combatEffects = createCombatEffects($("map"), $("combatAnnouncement"), event => {
    const kind = t(`combat.${event.kind}`), result = event.damage ? t("combat.damage", event.damage) : t("combat.miss");
    const label = `${kind} · ${result}`;
    return { label, announcement: `${translateData(event.from.name)} → ${translateData(event.to.name)}: ${label}` };
}, () => ({ animations: uiSettings.animations, duration: uiSettings.numbers.animationDuration }), event => combatAudio.play(event));
let effectsGame = game;
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
            : '<circle cx="0" cy="-4" r="5" fill="var(--unit-ink)"/>';
}
let localSide = "br";
function computerSide() {
    return $("gameMode").value === "computer" ? "de" : $("gameMode").value === "computer-br" ? "br" : null;
}
function humanSide() { return $("gameMode").value === "remote" ? localSide : computerSide() === "br" ? "de" : "br"; }
function sideName(side) { return side === "br" ? "FEB" : t("app.007"); }
function commandDescription() {
    return $("gameMode").value === "local" ? t("app.008") : t("app.009", sideName(humanSide()), humanSide() === "br" ? t("app.010") : t("app.011"), computerSide() ? t("app.012", sideName(computerSide())) : t("app.013"));
}
function myTurn() {
    return $("gameMode").value === "local" || game.turn === humanSide();
}
let aiProgress = null;
function saveSession() {
    browserStore.write("monte-castelo-session-v1", JSON.stringify({
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
    }));
}
function loadSession() {
    try {
        const value = JSON.parse(browserStore.read("monte-castelo-session-v1") || "null");
        if (value?.schema !== 1 ||
            !validGame(value.game) ||
            !["br", "de"].includes(value.localSide) ||
            !["computer", "computer-br", "local", "remote"].includes(value.mode))
            return false;
        game = value.game;
        localSide = value.localSide;
        if (value.aiProgress && ["br", "de"].includes(value.aiProgress.side) && Array.isArray(value.aiProgress.completed) && value.aiProgress.completed.every(id => typeof id === "string") && ["strong", "weak", "tactical"].includes(value.aiProgress.chosen) && ["aggressive", "defensive"].includes(value.aiProgress.stance) && ["strong", "weak", "tactical", "learning", "trained", "trained-fixed"].includes(value.aiProgress.mode) && Number.isFinite(value.aiProgress.before) && Number.isFinite(value.aiProgress.oldScore))
            aiProgress = value.aiProgress;
        policy = typeof value.policy === "string" ? value.policy : null;
        episode = Array.isArray(value.episode) ? value.episode.filter(x => typeof x === "string") : [];
        $("gameMode").value = value.mode;
        if (["strong", "weak", "tactical", "learning", "trained", "trained-fixed"].includes(value.ai))
            $("ai").value = value.ai;
        if (["aggressive", "defensive"].includes(value.stance))
            $("stance").value = value.stance;
        rewarded = !!value.rewarded;
        trainedUsed = !!value.trainedUsed;
        const ctx = value.trainedContext;
        if (ctx &&
            Object.values(ctx).every((p) => p &&
                typeof p.state === "string" &&
                Number.isInteger(p.action) &&
                p.action >= 0 &&
                p.action < 6 &&
                Number.isFinite(p.utility)))
            trainedContext = ctx;
        return true;
    }
    catch {
        return false;
    }
}
function forestGlyph(x, y) {
    return `<g pointer-events="none">${[
        [-17, 3, 0.8],
        [-7, -8, 1],
        [8, -9, 0.9],
        [18, 6, 0.8],
        [0, 9, 1],
    ]
        .map(([dx, dy, size]) => `<g transform="translate(${x + dx},${y + dy}) scale(${size})"><path d="M0 -13L-7 -2H-4L-9 5H9L4 -2H7Z" fill="var(--ui-forest)" stroke="var(--ui-forestStroke)" stroke-width=".7"/><path d="M0 4V10" stroke="var(--ui-branches)" stroke-width="2.5"/></g>`)
        .join("")}</g>`;
}
function fortGlyph(x, y) {
    return `<g pointer-events="none"><path d="M${x - 29} ${y + 18}v10h58v-10M${x - 29} ${y - 18}v-10h58v10" stroke="var(--ui-fort)" stroke-width="5" fill="none"/><path d="M${x - 20} ${y + 26}v-6m12 6v-6m12 6v-6m12 6v-6" stroke="var(--ui-mapHalo)" stroke-width="2"/><rect x="${x - 8}" y="${y - 32}" width="16" height="5" fill="var(--ui-fort)"/></g>`;
}
const heightColors = ["", "var(--ui-terrain1)", "var(--ui-terrain2)", "var(--ui-terrain3)", "var(--ui-terrain4)"];
function contourGlyph() {
    let lines = "";
    for (let r = 0; r < ROWS - 1; r++)
        for (let q = 0; q < COLS - 1; q++) {
            const make = (q, r) => ({
                ...center(q, r),
                z: altitude(q, r),
            }), a = make(q, r), b = make(q + 1, r), c = make(q, r + 1), d = make(q + 1, r + 1);
            for (const triangle of [
                [a, b, c],
                [b, d, c],
            ])
                for (const level of [750, 800, 850, 900, 950]) {
                    const crossings = [];
                    for (let i = 0; i < 3; i++) {
                        const p = triangle[i], n = triangle[(i + 1) % 3];
                        if ((p.z < level && n.z >= level) ||
                            (n.z < level && p.z >= level)) {
                            const t = (level - p.z) / (n.z - p.z);
                            crossings.push({
                                x: p.x + t * (n.x - p.x),
                                y: p.y + t * (n.y - p.y),
                            });
                        }
                    }
                    if (crossings.length === 2)
                        lines += `<path d="M${crossings[0].x},${crossings[0].y}L${crossings[1].x},${crossings[1].y}" stroke-width="calc(var(--ui-contourWidth) * ${level % 100 === 0 ? 1.5 : 1})"/>`;
                }
        }
    return `<g class="contours" fill="none" stroke="var(--ui-contour)" stroke-width="2.8" stroke-linecap="round" pointer-events="none">${lines}</g>`;
}
let activeDialog = null;
function render() {
    if (memoryScale !== learningScope())
        loadScaleMemories();
    $('unitScale').value = scaleOf(game);
    $('scaleStatus').textContent = scaleOf(game) === 'company' ? t(game.rules?.companyRevision === 2 ? 'scale.independentStatus' : 'scale.legacyStatus') : t('scale.battalionStatus');
    updateSoundUI();
    if (effectsGame !== game) {
        combatAudio.mute();
        combatEffects.clear();
        effectsGame = game;
    }
    checkWinner(game);
    const weather = weatherAt(game.round);
    $("weatherInfo").textContent =
        t("weather.chip", weather.cloud >= 70 ? "☁" : weather.cloud >= 30 ? "⛅" : "☀", Math.round(weather.temperature), weather.cloud, String(weather.hour).padStart(2, "0"));
    const u = game.units.find((v) => v.id === selected), reach = u && u.side === game.turn && myTurn() && !busy && !game.winner
        ? reachable(game, u)
        : new Map();
    const exposure = new Map();
    if (u)
        for (const k of reach.keys()) {
            const [q, r] = k.split(',').map(Number);
            const risk = movementExposure(game, u, q, r);
            if (risk)
                exposure.set(k, risk);
        }
    let svg = t("app.014");
    for (let r = 0; r < ROWS; r++)
        for (let q = 0; q < COLS; q++) {
            const t = terrain(q, r), { x, y } = center(q, r);
            svg += `<g><polygon class="hex ${reach.has(key(q, r)) ? "reach" : ""} ${exposure.has(key(q, r)) ? "exposed-reach" : ""}" data-q="${q}" data-r="${r}" data-danger="${exposure.has(key(q, r))}" points="${hex(q, r)}" fill="${t === "road" ? "var(--ui-road)" : heightColors[elevation(q, r)]}"/>${t === "forest" ? forestGlyph(x, y) : ""}${fortification(q, r) ? fortGlyph(x, y) : ""}${t === "hill" ? `<path d="M${x - 22} ${y + 12}q22 -38 44 0m-37 0q15 -26 30 0" stroke="var(--ui-stone)" fill="none" pointer-events="none"/>` : ""}<text class="altitude-label" x="${x - 25}" y="${y + 27}" fill="var(--ui-altitude)" pointer-events="none">~${Math.round(altitude(q, r) / 10) * 10}m · N${elevation(q, r)}</text></g>`;
        }
    svg += geographicGlyph();
    svg += contourGlyph();
    for (const o of objectives) {
        const { x, y } = center(o.q, o.r);
        const star = Array.from({ length: 10 }, (_, i) => { const angle = (i * 36 - 90) * Math.PI / 180, radius = uiSettings.numbers.starRadius * (i % 2 ? .42 : 1); return `${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`; }).join(" ");
        svg += t("app.016", x, y, o.q, o.r, star, x, y - 39, o.name ? o.name + ' · ' : '', o.points);
    }
    svg +=
        t("app.017");
    for (const v of game.units) {
        const { x, y } = center(v.q, v.r), target = u &&
            u.side === game.turn &&
            canCommand(game, u) && canAttack(u, v) &&
            !busy &&
            myTurn();
        svg += t("app.018", (selected === v.id ? "selected" : "") + (!canCommand(game, v) ? " command-locked" : ""), target ? "target" : "", v.id, x, y, esc(v.name) + (v.suppressed ? " · " + t("symbols.suppressionLabel") : ""), v.side === "br" ? "FEB" : t("app.019"), v.hp, v.atk, v.def, esc(v.name) + (v.suppressed ? " · " + t("symbols.suppressionLabel") : ""), v.atk, v.def, v.hp, v.side === "br" ? "var(--ui-br)" : "var(--ui-de)", target ? '<rect class="attack-bar" x="-24" y="-30" width="48" height="4" rx="1" fill="var(--ui-objective)" pointer-events="none"/>' : '', troopProfile(v.id)?.commandGroup ? `${v.name.split('/1º')[0]}` : troopProfile(v.id)?.mark ?? 'II', unitLevel(v), symbol(v), v.side === "br" ? "FEB" : "DE", v.hp, v.atk, v.def, v.mp, Array.from({ length: v.hp }, (_, i) => `<circle cx="${-7 + i * 7}" cy="10" r="2" fill="var(--ui-cohesion)"/>`).join(""), "", v.suppressed ? '<g class="suppression-state" role="img" aria-label="' + esc(t('symbols.suppressionLabel')) + '"><title>' + esc(t('symbols.suppressionLabel')) + '</title><circle class="suppression-marker" cx="-23" cy="-23" r="6" fill="var(--ui-suppression)" stroke="var(--ui-panel)"/><text x="-23" y="-20" text-anchor="middle" style="font-size:calc(8px * var(--ui-counterFontScale))">S</text></g>' : '', v.fired ? '<path d="M-22 -22L22 22" stroke="var(--ui-counterText)" opacity="var(--ui-firedOpacity)"/>' : "", v.side, scaleOf(game) === 'company' && troopProfile(v.id)?.mark === 'I' ? `<text class="company-echelon" x="${-18 * uiSettings.numbers.counterScale}" y="${-26 * uiSettings.numbers.counterScale - 7}" text-anchor="middle" aria-hidden="true">I</text>` : '');
    }
    svg += `<g class="unit-condition-layer" pointer-events="none">${game.units.filter(v => v.hp < 3).map(v => { const { x, y } = center(v.q, v.r), label = t("symbols.damageLabel", 3 - v.hp), offset = 25 * uiSettings.numbers.counterScale + 12; return `<g class="damage-marker" data-damage-unit="${v.id}" transform="translate(${x},${y - offset})" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title><circle r="8" fill="var(--ui-damage)" stroke="var(--ui-counterText)" stroke-width="1"/><text y="3" text-anchor="middle" fill="var(--ui-counterText)" style="font:700 9px var(--ui-font)">−${3 - v.hp}</text></g>`; }).join('')}</g>`;
    $("map").innerHTML = svg;
    combatEffects.redraw();
    $("time").textContent = clock(game.winner && game.finishedRound ? game.finishedRound + 1 : game.round);
    const actionable = u && u.side === game.turn && myTurn() && !busy && !game.winner;
    $('actionHint').textContent = actionable ? (u.fired ? (u.mp > 0 ? t("app.024", u.name, u.mp) : t("app.025", u.name)) : t("app.026", u.name, u.mp)) : t("app.027");
    if (actionable && !canCommand(game, u))
        $('actionHint').textContent = t('scale.locked');
    if (actionable && exposure.size)
        $('actionHint').textContent += t("app.028", exposure.size);
    $("goals").innerHTML = objectives
        .map((o, i) => {
        const held = game.units.find((v) => v.q === o.q && v.r === o.r && canCaptureObjective(v));
        return t("app.029", i, held ? "held-" + held.side : "", o.name || `Hex ${o.q + 1}-${o.r + 1}`, o.points, held ? (held.side === "br" ? t("app.030") : t("app.031")) : t("app.032"));
    })
        .join("");
    $("round").textContent = `${game.finishedRound ?? Math.min(game.round, roundLimit(game))} / ${roundLimit(game)}`;
    $('missionTitle').textContent = game.rules?.requireSummit ? t("app.033") : t("app.034");
    $('missionDetail').textContent = t("app.035", game.rules?.requireSummit ? t("app.036") : '', missionInstruction(game), objectivePointsPerRound());
    document.querySelector('#heightMovement')?.replaceChildren(t("ui.160", game.rules?.ascentStepCost ?? 1) + (game.rules?.minimumStep !== false ? t("movement.short") : ""));
    const forecast = missionForecast(game);
    $('missionForecast').textContent = game.winner ? translateData(operationResult(game).detail) : t("app.037", forecast.missing, forecast.income, forecast.remaining, forecast.missing === 0 ? t("app.038") : forecast.income ? t("app.039", forecast.roundsAtCurrentIncome) : t("app.040"), !forecast.pointsPossible ? t("app.041") : forecast.missing ? t("app.042", forecast.lastSummitOnlyRound) : '', game.rules?.summitAtDeadlineWins ? t("app.043") : '', forecast.earliestSummitRound !== null && !forecast.summit ? t("app.044", forecast.earliestSummitRound) : '');
    $('missionForecast').classList.toggle('urgent', !game.winner && (!forecast.pointsPossible || (forecast.roundsAtCurrentIncome !== null && forecast.roundsAtCurrentIncome > forecast.remaining) || game.round >= 8));
    $("score").textContent = `${game.score} / ${targetScore(game)}`;
    $("end").disabled = busy || !!game.winner || !myTurn();
    $("shareTurn").disabled =
        $("gameMode").value !== "remote" ||
            game.turn === localSide ||
            !!game.winner;
    $("yourSide").textContent = $("gameMode").value === "local" ? t("app.045", sideName(game.turn)) : t("app.046", sideName(humanSide()));
    $("ai").disabled = busy || !computerSide();
    $("unitScale").disabled = busy;
    $("stance").disabled = busy || !computerSide() || $("ai").value === "trained-fixed";
    $("phase").textContent = game.winner
        ? t($("gameMode").value === "local" ? "phase.localWinner" : game.winner === humanSide() ? "phase.playerWinner" : "phase.playerDefeat", sideName(game.winner), operationResult(game).title)
        : busy ? t("app.050", sideName(game.turn)) : !myTurn() ? ($("gameMode").value === "remote" ? t("app.051") : t("app.052")) : $("gameMode").value === "local" ? t("app.053", sideName(game.turn)) : t("app.054");
    $("brief").textContent = game.winner
        ? t("app.055")
        : translateData(missionInstruction(game));
    $("log").innerHTML = game.log
        .slice(0, 7)
        .map((l) => `<p>${esc(l)}</p>`)
        .join("");
    $("unitName").textContent = u ? translateData(u.name) : t("app.056");
    $("unitInfo").innerHTML = u
        ? t("app.057", esc(troopProfile(u.id)?.echelon ?? t("term.Agrupamento")), esc(troopProfile(u.id)?.formation ?? ''), u.side === "br" ? t("app.058") : t("app.059"), { infantry: t("term.Infantaria"), armor: t("app.060"), artillery: t("term.Artilharia") }[u.type], u.atk, u.def, u.hp, u.mp, maximumMovement(u), unitLevel(u), troopLevels[unitLevel(u)], Math.round(altitude(u.q, u.r)), elevation(u.q, u.r), fortification(u.q, u.r) * (game.rules?.fortificationStrength ?? 1), attackRange(u), u.heightRange && !u.indirect ? t("app.061") : '', ["hill", "forest"].includes(terrain(u.q, u.r)) ? "+1" : "0", u.fired ? (u.mp > 0 ? t("app.062") : t("app.063")) : u.mp === 0 ? t("app.064") : (game.rules?.freeFireOrder ? t("app.065") : t("app.066")), 3 - u.hp, u.atk - (3 - u.hp) * 0.5, u.reorganizing ? t("app.067") : '', u.suppressed ? t("app.068") : '', u.reactionSpent ? t("app.069") : '', canCaptureObjective(u) ? t("app.070") : t("app.071"), u.maxMp === undefined ? t("app.072") : '', u.id === 'b4' || u.id === 'c-b4' ? sampaioSupport() : '')
        : t("app.073", $("gameMode").value === "local" ? (game.turn === "br" ? t("term.azul") : t("app.074")) : humanSide() === "br" ? t("term.azul") : t("app.075"));
    $("learningStatus").textContent =
        $("ai").value === "trained-fixed"
            ? t("fixed.status", sideName(computerSide() ?? "de"), modelsForGame(game)[computerSide() ?? "de"].episodes)
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
        const assessment = victoryAssessment(game), outcome = operationResult(game);
        const finishedGame = game;
        if (scaleOf(game) === 'company')
            combatEffects.limitPending(2);
        combatEffects.whenIdle(() => { if (game !== finishedGame)
            return; show(() => t("app.078", esc(outcome.title), esc(outcome.detail), assessment.rounds, roundLimit(game), game.score, assessment.lostUnits, assessment.lostCohesion, assessment.efficiency, gameLossComparison(), victoryEpilogue(language, game.winner), sideName(game.winner), game.rules?.summitAtDeadlineWins ? t("victory.paths", targetScore(game), roundLimit(game)) : t("victory.legacy", missionInstruction(game)), battleLosses(game).br.initialUnits, battleLosses(game).br.initialCohesion)); });
    }
    saveSession();
}
function show(html) {
    activeDialog = html;
    $("modalBody").innerHTML = html();
    if (!$("modal").open)
        $("modal").showModal();
}
function refreshDialog() {
    if (!$("modal").open || !activeDialog)
        return;
    const statuses = ["importResult", "shareStatus", "uiSettingsStatus"].map(id => ({ id, text: $(id)?.textContent }));
    const handlers = new Map();
    for (const el of $("modalBody").querySelectorAll('[id]'))
        handlers.set(el.id, { click: el.onclick, change: el.onchange, value: el.value });
    $("modalBody").innerHTML = activeDialog();
    for (const status of statuses)
        if (status.text && $(status.id))
            $(status.id).textContent = translateRenderedMessage(status.text);
    for (const [id, h] of handlers) {
        const el = $(id);
        if (el) {
            el.onclick = h.click;
            el.onchange = h.change;
            if (el.type !== "file" && h.value !== undefined)
                el.value = h.value;
        }
    }
}
function inspect(u) {
    show(() => t("app.079", esc(u.name), esc(troopProfile(u.id)?.echelon ?? t("term.Agrupamento")), unitLevel(u), troopLevels[unitLevel(u)], u.side, u.type === "infantry" ? "☒" : u.type === "armor" ? "▱" : "●", u.atk, u.def, u.mp, u.hp, 3 - u.hp, u.atk, u.def, u.hp, 3 - u.hp, attackRange(u), esc(troopProfile(u.id)?.description ?? t("app.080")), u.id === 'b4' || u.id === 'c-b4' ? sampaioSupport() : '', canCaptureObjective(u) ? t("app.081") : t("app.082"), maximumMovement(u), unitCurrentState(u)));
}
function unitCurrentState(u) {
    const damage = 3 - u.hp, penalty = damage * .5, number = (n) => new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(n);
    const yes = (flag) => t(flag ? "unit.yes" : "unit.no");
    return t("unit.current", u.hp, damage, u.mp, maximumMovement(u), number(u.atk - penalty), u.atk, number(penalty), u.def, yes(!!u.fired), yes(canCommand(game, u) && u.mp > 0 && !u.reorganizing && !game.winner && u.side === game.turn), yes(!!u.suppressed), yes(!!u.reorganizing), yes(!!u.reactionSpent));
}
function selectUnit(id) {
    const now = Date.now(), u = game.units.find((v) => v.id === id);
    if (!u)
        return;
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
        if (!canCommand(game, actor) || !canAttack(actor, u)) {
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
function hpBalance(side) { return game.units.reduce((total, u) => total + (u.side === side ? u.hp : -u.hp), 0); }
async function computerTurn() {
    const side = computerSide();
    if (!side || game.turn !== side || busy || game.winner)
        return;
    busy = true;
    const token = generation;
    selected = null;
    if (!aiProgress || aiProgress.side !== side) {
        const mode = $("ai").value;
        policy = mode === "learning" ? choosePolicy(side) : null;
        let [chosen, stance] = policy ? policy.replace(/^br:/, "").split("/") : [mode, $("stance").value];
        if (mode === "trained") {
            trainedUsed = true;
            const learned = beginLearningTurn(trained, trainedContext, game, side);
            chosen = learned.strategy;
            stance = learned.stance;
            saveTrained();
        }
        if (mode === "trained-fixed") {
            const fixed = chooseFixedPolicy(game, side);
            chosen = fixed.strategy;
            stance = fixed.stance;
        }
        aiProgress = { side, completed: [], chosen, stance, mode, before: hpBalance(side), oldScore: game.score };
    }
    render();
    const progress = aiProgress;
    for (const id of activationOrder(game, side)) {
        if (progress.completed.includes(id))
            continue;
        await pause();
        if (token !== generation)
            return;
        takeAIAction(game, id, progress.chosen, progress.stance, Math.random, combatEffects.enqueue);
        progress.completed.push(id);
        render();
        if (game.winner)
            break;
    }
    if (!game.winner)
        endTurn(game);
    if (progress.mode === "learning" && !rewarded)
        learn(hpBalance(side) - progress.before + (side === "br" ? 1 : -1) * (game.score - progress.oldScore));
    aiProgress = null;
    busy = false;
    if (progress.mode === "trained")
        saveTrained();
    render();
}
$("end").onclick = async () => {
    if (busy || game.winner || !myTurn())
        return;
    lastTap = { id: null, time: 0 };
    selected = null;
    endTurn(game);
    render();
    if ($("gameMode").value === "remote") {
        if (!game.winner)
            shareTurn();
        return;
    }
    await computerTurn();
};
$("new").onclick = () => {
    if (!game.winner &&
        !confirm(t("app.084")))
        return;
    generation++;
    aiProgress = null;
    game = createGame({ ...defaultRules, scale: scaleOf(game) });
    localSide = computerSide() === "br" ? "de" : "br";
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
const mapBase = $("map").viewBox.baseVal.width;
const mapHeight = $("map").viewBox.baseVal.height;
function setZoom(n, anchor) {
    const viewport = $("viewport");
    const oldWidth = $("map").getBoundingClientRect().width;
    const px = anchor?.x ?? viewport.clientWidth / 2, py = anchor?.y ?? viewport.clientHeight / 2;
    const oldX = viewport.scrollLeft + px, oldY = viewport.scrollTop + py;
    viewport.dataset.view = "free";
    viewport.style.maxHeight = "";
    zoom = Math.max(0.25, Math.min(3, n));
    const newWidth = mapBase * zoom;
    viewport.style.height = `${Math.min(mapHeight * zoom, innerHeight * 0.65)}px`;
    $("map").style.width = `${newWidth}px`;
    $("map").style.minWidth = "0";
    $("resetZoom").textContent = `${Math.round(zoom * 100)}%`;
    $("zoom").value = String(zoom);
    viewport.scrollLeft = (oldX * newWidth) / oldWidth - px;
    viewport.scrollTop = (oldY * newWidth) / oldWidth - py;
}
function fitMap() {
    const viewport = $("viewport");
    const fit = viewport.clientWidth / mapBase;
    setZoom(fit);
    viewport.dataset.view = "full";
    viewport.style.maxHeight = "none";
    viewport.style.height = `${mapHeight * zoom}px`;
    viewport.scrollTo(0, 0);
}
function idealView() {
    setZoom(innerWidth < 600 ? 1.15 : Math.max(0.9, $("viewport").clientWidth / 960));
    const { x, y } = center(3, 4);
    $("viewport").scrollLeft = x * zoom - $("viewport").clientWidth / 2;
    $("viewport").scrollTop = y * zoom - $("viewport").clientHeight / 2;
}
$("in").onclick = () => setZoom(zoom + 0.1);
$("out").onclick = () => setZoom(zoom - 0.1);
$("resetZoom").onclick = () => setZoom(1);
$("zoom").oninput = (e) => setZoom(Number(e.target.value));
$("fit").onclick = fitMap;
window.addEventListener("resize", () => { if ($("viewport").dataset.view === "full")
    fitMap(); });
$("ideal").onclick = idealView;
$("viewport").addEventListener("wheel", (e) => {
    if (!e.ctrlKey && !e.metaKey)
        return;
    e.preventDefault();
    const rect = $("viewport").getBoundingClientRect();
    setZoom(zoom * Math.exp(-e.deltaY * 0.008), {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    });
}, { passive: false });
let pinch = null;
$("viewport").addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        pinch = {
            distance: Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY),
            zoom,
        };
    }
}, { passive: true });
$("viewport").addEventListener("touchmove", (e) => {
    if (e.touches.length === 2 && pinch) {
        e.preventDefault();
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const rect = $("viewport").getBoundingClientRect();
        setZoom((pinch.zoom * d) / pinch.distance, {
            x: (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left,
            y: (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top,
        });
    }
}, { passive: false });
$("viewport").addEventListener("touchend", () => (pinch = null));
$("close").onclick = () => $("modal").close();
$("modal").addEventListener("close", () => { void computerTurn(); });
$("rules").onclick = () => show(() => scaleRules() + completeSymbolLegend() + t("app.085", commandDescription(), roundLimit(game), game.rules?.rangeHeightThreshold ?? 90, game.rules?.freeFireOrder ? t("app.086") : t("app.087"), objectivePointsPerRound(), missionInstruction(game), roundLimit(game), game.rules?.retreatOnLoss ? t("app.088") : t("app.089"), game.rules?.freeFireOrder ? t("app.090") : t("app.091"), terrainRulesTable(), t("rules.automatic"), game.rules?.ascentStepCost ?? 1, game.rules?.fortificationStrength ?? 1, t(scaleOf(game) === 'company' ? 'combat.companyDamage' : 'combat.battalionDamage')));
function narrative() {
    show(() => scalePicker() + scaleRules() + t("app.092", gameLogo, commandDescription(), $("gameMode").value === "local" ? t("app.093") : humanSide() === "br" ? t("app.094") : t("app.095"), missionInstruction(game), openingContext(language)));
    $("openingScale").onchange = () => switchScale($("openingScale").value);
    $("begin").onclick = () => { $("modal").close(); void computerTurn(); };
}
let resumed = loadSession(), received = false;
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
}
catch {
    show(() => t("app.096"));
}
render();
fitMap();
if (resumed && !game.winner) {
    show(() => t("app.097", received ? t("app.098") : t("app.099"), Math.min(game.round, 10), game.score, $("gameMode").value === "remote" ? (localSide === "br" ? t("app.100") : t("app.101")) : t("app.102")));
    $("begin").onclick = () => { $("modal").close(); void computerTurn(); };
}
else if (!game.winner)
    narrative();
$("credits").onclick = () => show(() => t("app.103", gameLogo, ludesLogo, release.version, localizedDate(release.builtAt), esc(language === "en-US" ? englishLicense() : licenseText)));
$("memory").onclick = () => {
    show(() => t("app.104", trained.episodes, trained.updates, Object.keys(trained.q).length, pretrainedForGame().episodes) + fixedModelSummary());
    $("exportMemory").onclick = () => {
        const blob = new Blob([JSON.stringify({ ...trained, scale: scaleOf(game), companyRevision: game.rules?.companyRevision }, null, 2)], {
            type: "application/json",
        }), url = URL.createObjectURL(blob), a = document.createElement("a");
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
            if (!validLearning(data) || (data.scale ?? 'battalion') !== scaleOf(game) || (scaleOf(game) === 'company' && (data.companyRevision ?? 1) !== (game.rules?.companyRevision ?? 1)))
                throw new Error(t("app.106"));
            trained = data;
            trainedContext = {};
            saveTrained();
            $("importResult").textContent =
                t("app.107");
        }
        catch (err) {
            $("importResult").textContent =
                err instanceof SyntaxError ? t("error.json") : err instanceof Error ? translateData(err.message) : t("app.108");
        }
    };
};
function downloadTurn() {
    const data = JSON.stringify({ schema: 1, game }), blob = new Blob([data], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
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
            }
            catch {
                $("shareStatus").textContent =
                    t("app.117");
            }
        };
}
$("shareTurn").onclick = shareTurn;
$("gameMode").onchange = () => {
    generation++;
    aiProgress = null;
    game = createGame({ ...defaultRules, scale: scaleOf(game) });
    localSide = computerSide() === "br" ? "de" : "br";
    busy = false;
    selected = null;
    rewarded = false;
    policy = null;
    episode = [];
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
        if (!file || file.size > 50000)
            throw new Error(t("app.118"));
        const value = JSON.parse(await file.text());
        if (value.schema !== 1 || !validGame(value.game))
            throw new Error(t("app.119"));
        generation++;
        aiProgress = null;
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
    }
    catch (err) {
        show(() => t("app.122", esc(err instanceof SyntaxError ? t("error.json") : err instanceof Error ? translateData(err.message) : t("app.123"))));
    }
    finally {
        e.target.value = "";
    }
};
$("goals").onclick = (e) => {
    const button = e.target.closest("[data-goal]");
    if (!button)
        return;
    const goal = objectives[Number(button.dataset.goal)], pos = center(goal.q, goal.r);
    setZoom(Math.max(zoom, 1.1));
    $("viewport").scrollLeft = pos.x * zoom - $("viewport").clientWidth / 2;
    $("viewport").scrollTop = pos.y * zoom - $("viewport").clientHeight / 2;
};
$("map").addEventListener("dblclick", (e) => {
    e.preventDefault();
    const rect = $("map").getBoundingClientRect(), x = ((e.clientX - rect.left) * 960) / rect.width, y = ((e.clientY - rect.top) * 690) / rect.height;
    const unit = game.units.find((u) => {
        const p = center(u.q, u.r);
        return Math.abs(p.x - x) < 28 && Math.abs(p.y - y) < 28;
    });
    if (unit)
        inspect(unit);
});
$("briefing").onclick = narrative;
$("newTop").onclick = () => $("new").click();
$("weatherInfo").onclick = () => show(() => t("app.124", [
    6, 9, 12, 16, 18,
]
    .map((i) => {
    const w = weatherHours[i];
    return `<tr><td>${String(i).padStart(2, "0")}:00</td><td>~${w.temperature} °C</td><td>${w.cloud}%</td><td>${w.precipitation} mm</td></tr>`;
})
    .join(""), weatherQuery));
function geographicGlyph() {
    const path = (p) => p.map((v, i) => `${i ? "L" : "M"}${v.x},${v.y}`).join("");
    return `<g pointer-events="none" class="geographical-features">${geography.woods.map((p) => `<path d="${path(p)}Z" fill="var(--ui-forest)" fill-opacity="var(--ui-forestOpacity)" stroke="var(--ui-forestStroke)" stroke-opacity="var(--ui-forestOpacity)" stroke-width=".7"/>`).join("")}${geography.roads.map((r) => `<path d="${path(r.points)}" fill="none" stroke="${["path", "footway", "track"].includes(r.type) ? "var(--ui-path)" : "var(--ui-road)"}" stroke-width="${["path", "footway"].includes(r.type) ? 1.3 : 3.5}" stroke-dasharray="${["path", "footway"].includes(r.type) ? "3 3" : "none"}" stroke-linecap="round"/>`).join("")}${geography.buildings.map((p) => `<path d="${path(p)}Z" fill="var(--ui-building)" stroke="var(--ui-building)" stroke-width=".4"/>`).join("")}${geography.settlements.filter(() => false).map((p) => `<text x="${p.x + 5}" y="${p.y - 6}" class="place-label">${esc(p.name)}</text>`)
        .join("")}</g>`;
}
$("mapSources").onclick = () => show(() => t("app.126", officialMap, historicalMap));
$('forces').onclick = () => show(() => scaleRules() + t("app.127", sampaioSupport(), profilesForScale(scaleOf(game), game.rules?.companyRevision ?? 1).map(p => `<tr><th scope="row">${p.side === 'br' ? 'FEB' : 'Heer'} · ${esc(p.name)}</th><td>${esc(p.echelon)}</td><td>${p.level}</td><td>${p.atk}</td><td>${p.def}</td><td>${p.mp}</td><td>${p.range}</td><td>${p.canCapture ? t("term.sim") : t("app.129")}</td></tr>`).join('')));
function sampaioSupport() { return t("app.130"); }
function gameLossComparison() {
    const losses = battleLosses(game);
    return t("app.131", losses.br.removedUnits, losses.br.initialUnits, losses.de.removedUnits, losses.de.initialUnits, losses.br.lostCohesion, losses.br.initialCohesion, losses.de.lostCohesion, losses.de.initialCohesion, losses.br.withdrawnUnits ?? t("app.132"), losses.de.withdrawnUnits ?? t("app.133"));
}
$("language").value = language;
$("language").onchange = () => {
    setLanguage($("language").value);
    applyStaticTranslations();
    updateVersionLabels();
    $("storageStatus").textContent = translateRenderedMessage($("storageStatus").textContent);
    render();
    refreshDialog();
};
$("tribute").onclick = () => show(() => t("tribute.dialog", tributeAssets.feb.src, translateData(tributeAssets.feb.label), tributeAssets.feb.sourceUrl, translateData(tributeAssets.feb.credit), tributePhoto.src));
function fixedModelSummary() {
    return t("fixed.dialog", ...["br", "de"].map(side => {
        const model = modelsForGame(game)[side], p = model.parameters;
        return t("fixed.model", sideName(side), model.episodes, model.updates, Object.keys(model.q).length, model.seeds[0], model.seeds[1], p.alpha, p.gamma, p.epsilonTraining, p.epsilonInference);
    }));
}
updateVersionLabels();
function englishLicense() {
    const begin = licenseText.indexOf("Attribution-NonCommercial-ShareAlike 4.0 International");
    const end = licenseText.lastIndexOf("\n---\n");
    return `Copyright © 2026 Geraldo Xexéo (xexeo)\nCC BY-NC-SA 4.0\n\n${licenseText.slice(begin, end)}\n\n${t("license.thirdParty")}`;
}
function appearanceDialog() {
    const word = (control) => language === 'en-US' ? control.en : control.pt;
    const groups = ['page', 'units', 'terrain', 'actions', 'combat', 'type', 'lines', 'opacity'];
    const sections = groups.map(group => {
        const colorFields = colorControls.filter(control => control.group === group).map(control => {
            const id = `ui-color-${control.key}`, label = esc(word(control)), value = uiSettings.colors[control.key];
            return `<div class="appearance-field"><label for="${id}">${label}</label><input id="${id}" type="color" value="${value}" data-ui-color="${control.key}" aria-label="${label}"><input id="ui-hex-${control.key}" type="text" value="${value}" data-ui-color="${control.key}" maxlength="7" pattern="#[0-9a-fA-F]{6}" spellcheck="false" aria-label="${esc(t('appearance.hex', word(control)))}"></div>`;
        }).join('');
        const numericFields = numberControls.filter(control => control.group === group).map(control => `<div class="appearance-field appearance-number"><label for="ui-number-${control.key}">${esc(word(control))}</label><input id="ui-number-${control.key}" type="number" min="${control.min}" max="${control.max}" step="${control.step}" value="${uiSettings.numbers[control.key]}" data-ui-number="${control.key}"><small>${control.unit}</small></div>`).join('');
        const animationToggle = group === 'combat' ? `<label class="appearance-toggle" for="uiAnimations"><input id="uiAnimations" type="checkbox" ${uiSettings.animations ? 'checked' : ''}>${t('appearance.animations')}</label><p class="appearance-note">${t('appearance.animationsNote')}</p><label class="appearance-toggle" for="uiSound"><input id="uiSound" type="checkbox" ${uiSettings.soundEnabled ? 'checked' : ''}>${t('appearance.soundEnabled')}</label><p class="appearance-note">${t('appearance.soundNote')}</p>` : '';
        const font = group === 'type' ? `<label for="uiFont">${t('appearance.font')}</label><select id="uiFont">${Object.entries(fontChoices).map(([key, choice]) => `<option value="${key}" ${uiSettings.font === key ? 'selected' : ''}>${esc(word(choice))}</option>`).join('')}</select>` : '';
        return `<details class="appearance-group" ${group === 'page' ? 'open' : ''}><summary>${t(`appearance.group.${group}`)}</summary><div class="appearance-fields">${font}${animationToggle}${colorFields}${numericFields}</div></details>`;
    }).join('');
    return `<section id="appearanceSettings"><h2>${t('appearance.title')}</h2><p class="appearance-intro">${t('appearance.intro')}</p><div class="appearance-toolbar"><label for="uiPreset">${t('appearance.preset')}</label><select id="uiPreset">${['A', 'B', 'C'].map(preset => `<option value="${preset}" ${uiSettings.preset === preset ? 'selected' : ''}>${t(`appearance.preset.${preset}`)}</option>`).join('')}<option value="custom" ${uiSettings.preset === 'custom' ? 'selected' : ''} disabled>${t('appearance.custom')}</option></select><button id="uiWinter">${t('appearance.winter')}</button><button id="uiReset">${t('appearance.reset')}</button><button id="uiExport">${t('appearance.export')}</button><label class="file-label" for="uiImport">${t('appearance.import')}<input id="uiImport" type="file" accept="application/json,.json"></label></div><p id="uiSettingsStatus" class="appearance-status" role="status">${t('appearance.saved')}</p>${sections}<p class="appearance-note">${t('appearance.note')}</p></section>`;
}
function commitAppearance() {
    if (uiSettings.soundEnabled)
        combatAudio.sync();
    else
        combatAudio.mute();
    applyUISettings(uiSettings);
    const saved = saveUISettings(uiSettings);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', uiSettings.colors.page);
    render();
    if ($('uiPreset'))
        $('uiPreset').value = uiSettings.preset;
    if ($('uiSettingsStatus'))
        $('uiSettingsStatus').textContent = t(saved ? 'appearance.saved' : 'appearance.storage');
}
function openAppearance() {
    show(appearanceDialog);
    $('uiPreset').onchange = () => { uiSettings = defaultUISettings($('uiPreset').value); commitAppearance(); openAppearance(); };
    $('uiWinter').onclick = () => { uiSettings = winterUISettings(uiSettings); commitAppearance(); openAppearance(); };
    $('uiReset').onclick = () => { uiSettings = defaultUISettings(); commitAppearance(); openAppearance(); };
    $('uiFont').onchange = () => { uiSettings.font = $('uiFont').value; uiSettings.preset = 'custom'; commitAppearance(); };
    $('uiAnimations').onchange = () => { uiSettings.animations = $('uiAnimations').checked; uiSettings.preset = 'custom'; commitAppearance(); };
    $('uiSound').onchange = () => setSoundEnabled($('uiSound').checked);
    $('modalBody').oninput = (event) => {
        const input = event.target;
        if (!input.closest('#appearanceSettings'))
            return;
        const color = input.dataset.uiColor, number = input.dataset.uiNumber;
        if (color) {
            if (!/^#[0-9a-f]{6}$/i.test(input.value)) {
                input.setAttribute('aria-invalid', 'true');
                return;
            }
            input.removeAttribute('aria-invalid');
            uiSettings.colors[color] = input.value.toUpperCase();
            $(`ui-color-${color}`).value = uiSettings.colors[color];
            $(`ui-hex-${color}`).value = uiSettings.colors[color];
        }
        else if (number) {
            const definition = numberControls.find(control => control.key === number), value = input.valueAsNumber;
            if (!Number.isFinite(value) || value < definition.min || value > definition.max) {
                input.setAttribute('aria-invalid', 'true');
                return;
            }
            input.removeAttribute('aria-invalid');
            uiSettings.numbers[number] = value;
        }
        else
            return;
        uiSettings.preset = 'custom';
        commitAppearance();
    };
    $('uiExport').onclick = () => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(uiSettings, null, 2)], { type: 'application/json' })), link = document.createElement('a');
        link.href = url;
        link.download = 'monte-castelo-vibed-ui.json';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    $('uiImport').onchange = async (event) => {
        try {
            const file = event.target.files?.[0];
            if (!file || file.size > 64000)
                throw Error();
            const value = validatedUISettings(JSON.parse(await file.text()));
            if (!value)
                throw Error();
            uiSettings = value;
            commitAppearance();
            openAppearance();
        }
        catch {
            $('uiSettingsStatus').textContent = t('appearance.invalid');
        }
    };
}
$('appearance').onclick = openAppearance;
function completeSymbolLegend() {
    const icon = (drawing) => `<svg viewBox="0 0 100 80" aria-hidden="true" focusable="false">${drawing}</svg>`;
    const hexagon = '<polygon points="50,10 78,25 78,55 50,70 22,55 22,25" fill="var(--ui-terrain1)" stroke="var(--ui-grid)"/>';
    const examples = [
        ['factions', icon('<rect x="4" y="18" width="42" height="42" fill="var(--ui-br)"/><rect x="54" y="18" width="42" height="42" fill="var(--ui-de)"/><text x="25" y="45" text-anchor="middle" fill="var(--ui-counterText)">FEB</text><text x="75" y="45" text-anchor="middle" fill="var(--ui-counterText)">DE</text>')],
        ['military', icon('<g fill="none" stroke="var(--ui-mapText)" stroke-width="2"><rect x="8" y="13" width="35" height="23"/><path d="M8 13L43 36M43 13L8 36"/><rect x="57" y="13" width="35" height="23"/><circle cx="75" cy="25" r="5"/><rect x="32" y="47" width="35" height="23"/><ellipse cx="50" cy="58" rx="12" ry="6"/></g>')],
        ['echelon', icon('<text x="50" y="25" text-anchor="middle" fill="var(--ui-mapText)">I · II · AP · DEST</text><text x="50" y="55" text-anchor="middle" fill="var(--ui-mapText)">T1 · T2 · T3</text>')],
        ['values', icon('<text x="50" y="34" text-anchor="middle" fill="var(--ui-mapText)">A3 D3 M2</text><text x="50" y="59" text-anchor="middle" fill="var(--ui-mapText)">FEB 2/3</text>')],
        ['dots', icon('<rect x="18" y="15" width="64" height="50" fill="var(--ui-br)"/><g fill="var(--ui-cohesion)"><circle cx="36" cy="40" r="5"/><circle cx="50" cy="40" r="5"/><circle cx="64" cy="40" r="5"/></g>')],
        ['damage', icon('<rect x="28" y="29" width="44" height="44" fill="var(--ui-br)"/><circle cx="50" cy="15" r="12" fill="var(--ui-damage)"/><text x="50" y="20" text-anchor="middle" fill="var(--ui-counterText)">−1</text>')],
        ['suppression', icon('<circle cx="50" cy="36" r="19" fill="var(--ui-suppression)"/><text x="50" y="43" text-anchor="middle" fill="var(--ui-counterText)">S</text>')],
        ['states', icon('<text x="50" y="30" text-anchor="middle" fill="var(--ui-mapText)">PV · PM</text><text x="50" y="57" text-anchor="middle" fill="var(--ui-mapText)">A/I · B/II</text>')],
        ['spent', icon('<rect x="25" y="13" width="50" height="50" fill="var(--ui-br)"/><path d="M27 15L73 61" stroke="var(--ui-counterText)" stroke-width="4" opacity="var(--ui-firedOpacity)"/>')],
        ['selection', icon('<rect x="25" y="13" width="50" height="50" fill="var(--ui-br)" stroke="var(--ui-selection)" stroke-width="5"/>')],
        ['movement', icon(hexagon + '<polygon points="50,10 78,25 78,55 50,70 22,55 22,25" fill="none" stroke="var(--ui-movement)" stroke-width="4"/>')],
        ['risk', icon(hexagon + '<polygon points="50,10 78,25 78,55 50,70 22,55 22,25" fill="none" stroke="var(--ui-risk)" stroke-width="5" stroke-dasharray="6 3"/>')],
        ['attack', icon('<rect x="25" y="23" width="50" height="45" fill="var(--ui-de)" stroke="var(--ui-attack)" stroke-width="4"/><path d="M25 15H75" stroke="var(--ui-attack)" stroke-width="6"/>')],
        ['objective', icon(hexagon + '<circle cx="50" cy="40" r="30" fill="none" stroke="var(--ui-objective)" stroke-dasharray="5 3"/><path d="M50 28L53 36L62 36L55 42L58 51L50 46L42 51L45 42L38 36L47 36Z" fill="var(--ui-objective)"/>')],
        ['height', icon('<path d="M10 59Q40 5 88 27M10 70Q48 20 88 40" fill="none" stroke="var(--ui-contour)" stroke-width="2"/><text x="50" y="22" text-anchor="middle" fill="var(--ui-altitude)">~850m · N3</text>')],
        ['forest', icon(forestGlyph(50, 38))],
        ['fort', icon(fortGlyph(50, 39))],
        ['routes', icon('<path d="M8 20Q50 55 92 20" fill="none" stroke="var(--ui-road)" stroke-width="6"/><path d="M8 51Q50 80 92 51" fill="none" stroke="var(--ui-path)" stroke-width="3" stroke-dasharray="5 4"/>')],
        ['buildings', icon('<g fill="var(--ui-building)"><rect x="20" y="20" width="24" height="18"/><rect x="52" y="30" width="27" height="19" transform="rotate(18 65 40)"/><rect x="30" y="48" width="19" height="15"/></g><path d="M5 70Q30 15 50 70M15 70Q30 35 43 70" fill="none" stroke="var(--ui-stone)"/>')],
        ['orientation', icon('<text x="50" y="27" text-anchor="middle" fill="var(--ui-mapText)">N ↑</text><path d="M15 54H85M15 49V59M85 49V59" stroke="var(--ui-mapText)"/><text x="50" y="75" text-anchor="middle" fill="var(--ui-mapText)">500 m</text>')],
        ['controls', icon('<text x="50" y="30" text-anchor="middle" fill="var(--ui-mapText)">☰  +  −  →</text><text x="50" y="59" text-anchor="middle" fill="var(--ui-mapText)">☀ ⛅ ☁</text>')],
        ['ammunition', icon('<g fill="var(--ui-combatBurst)" stroke="var(--ui-combatTrace)"><path d="M8 21H25Q35 25 25 29H8Z"/><ellipse cx="51" cy="39" rx="10" ry="6"/><path d="M41 36L30 29V49L41 42Z"/><path d="M69 52H86Q101 59 86 66H69Z"/></g>')],
        ['fire', icon('<path d="M8 58L66 25" stroke="var(--ui-combatTrace)" stroke-width="3" stroke-dasharray="7 4"/><path d="M70 10L76 24L91 19L82 31L93 42L78 41L73 56L67 42L52 45L60 32L50 21L65 24Z" fill="var(--ui-combatBurst)" stroke="var(--ui-combatTrace)"/>')],
    ];
    return `<details class="symbol-legend" open><summary>${t('symbols.title')}</summary><p>${t('symbols.intro')}</p><div class="symbol-legend-grid">${examples.map(([key, drawing]) => `<div class="symbol-legend-row" data-symbol="${key}">${drawing}<p>${t(`symbols.${key}`)}</p></div>`).join('')}</div></details>`;
}
function dismissCurrentDialog() { const begin = $("begin"); if (begin && $("modalBody").contains(begin) && typeof begin.onclick === "function")
    begin.click();
else
    $("modal").close(); }
$("close").onclick = dismissCurrentDialog;
$("closeBottom").onclick = dismissCurrentDialog;
$("modal").addEventListener("cancel", event => { event.preventDefault(); dismissCurrentDialog(); });
$("history").onclick = () => show(() => historyContent(language));
function terrainRulesTable() { return t("terrain.rulesTable", heightThreshold, game.rules?.rangeHeightThreshold ?? 90, game.rules?.ascentStepCost ?? 1, game.rules?.fortificationStrength ?? 1, 2 + (game.rules?.ascentStepCost ?? 1), 2 * (game.rules?.ascentStepCost ?? 1), t(game.rules?.minimumStep === false ? "movement.legacy" : "movement.minimum")); }
function updateSoundUI() { const button = $("soundToggle"); button.textContent = t(uiSettings.soundEnabled ? "sound.on" : "sound.off"); button.setAttribute("aria-pressed", String(uiSettings.soundEnabled)); button.title = t("sound.tooltip"); if ($("uiSound"))
    $("uiSound").checked = uiSettings.soundEnabled; }
function setSoundEnabled(enabled) { uiSettings.soundEnabled = enabled; uiSettings.preset = "custom"; if (enabled)
    void combatAudio.unlock();
else
    combatAudio.mute(); commitAppearance(); }
$("soundToggle").onclick = () => setSoundEnabled(!uiSettings.soundEnabled);
for (const name of ["pointerdown", "keydown"])
    document.addEventListener(name, () => { if (uiSettings.soundEnabled)
        void combatAudio.unlock(); }, { capture: true });
// Accessible disclosure navigation, independent of game and dialog state.
const headerMenu = $("headerMenu"), menuToggle = $("menuToggle");
function closeHeaderMenu(restoreFocus = false) { headerMenu.dataset.open = "false"; headerMenu.style.maxHeight = ""; menuToggle.setAttribute("aria-expanded", "false"); if (restoreFocus)
    menuToggle.focus(); }
menuToggle.onclick = () => { const open = menuToggle.getAttribute("aria-expanded") !== "true"; headerMenu.dataset.open = String(open); menuToggle.setAttribute("aria-expanded", String(open)); if (open)
    headerMenu.style.maxHeight = `${Math.max(100, innerHeight - headerMenu.getBoundingClientRect().top - 12)}px`; };
headerMenu.addEventListener("click", event => { if (event.target.closest("button"))
    closeHeaderMenu(); });
document.addEventListener("pointerdown", event => { if (!headerMenu.contains(event.target) && !menuToggle.contains(event.target))
    closeHeaderMenu(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    closeHeaderMenu(true);
} });
matchMedia("(max-width:1000px)").addEventListener("change", () => closeHeaderMenu());
function scaleRules() { return t(scaleOf(game) === 'company' ? 'scale.companyRules' : 'scale.battalionRules') + (scaleOf(game) === 'company' && game.rules?.companyRevision !== 2 ? t('scale.legacyCompany') : ''); }
function scalePicker() { return `<div class="scale-picker"><label for="openingScale">${t('scale.label')}</label><select id="openingScale"><option value="battalion" ${scaleOf(game) === 'battalion' ? 'selected' : ''}>${t('scale.battalion')}</option><option value="company" ${scaleOf(game) === 'company' ? 'selected' : ''}>${t('scale.company')}</option></select></div>`; }
function switchScale(value) {
    if (!['battalion', 'company'].includes(value) || value === scaleOf(game))
        return;
    const started = game.round > 1 || game.units.some(u => u.hp < 3 || u.fired || u.mp !== maximumMovement(u));
    if (started && !game.winner && !confirm(t('scale.confirm'))) {
        $('unitScale').value = scaleOf(game);
        if ($('openingScale'))
            $('openingScale').value = scaleOf(game);
        return;
    }
    saveTrained();
    persist();
    generation++;
    aiProgress = null;
    game = createGame({ ...defaultRules, scale: value });
    loadScaleMemories();
    localSide = computerSide() === "br" ? "de" : "br";
    selected = null;
    busy = false;
    rewarded = false;
    policy = null;
    episode = [];
    trainedUsed = false;
    trainedContext = {};
    render();
    narrative();
}
$('unitScale').onchange = () => switchScale($('unitScale').value);
//# sourceMappingURL=app.js.map