import { officialMap } from "./official-map.js";
import { troopProfiles, troopProfile, troopLevels } from "./troops.js";
import { geography, altitude } from "./geography.js";
import { weatherAt, weatherHours, weatherQuery } from "./weather.js";
import { validGame, decodeTurn, publicTurnLink, } from "./exchange.js";
import { pretrained } from "./pretrained.js";
import { beginLearningTurn, finishLearningEpisode, validLearning, } from "./learning.js";
import { browserStore } from "./persistence.js";
import { activationOrder, takeAIAction } from "./ai.js";
import { release } from "./version.js";
import { ludesLogo, gameLogo, historicalMap } from "./assets-data.js";
import { licenseText } from "./license-text.js";
import { COLS, ROWS, key, objectives, terrain, fortification, elevation, clock, createGame, reachable, canAttack, attackRange, maximumMovement, advance, targetScore, objectivePointsPerRound, roundLimit, victoryAssessment, canCaptureObjective, unitLevel, attack, endTurn, } from "./engine.js";
const $ = (id) => document.getElementById(id);
$("gameLogo").src = gameLogo;
$("titleVersion").textContent = `v${release.version}`;
$("titleVersion").title = release.displayDate + " · Brasília";
$("buildVersion").textContent =
    `v${release.version} · ${release.displayDate} · Brasília`;
let game = createGame(), selected = null, zoom = 1, busy = false, generation = 0, lastTap = { id: null, time: 0 }, rewarded = false;
let trained = structuredClone(pretrained), trainedContext = {}, trainedUsed = false;
try {
    const saved = JSON.parse(browserStore.read("monte-castelo-trained-v1") || "null");
    if (validLearning(saved))
        trained = saved;
}
catch { }
function saveTrained() {
    const ok = browserStore.write("monte-castelo-trained-v1", JSON.stringify(trained));
    $("storageStatus").textContent = ok
        ? "Experiência salva neste navegador."
        : "Armazenamento indisponível: exporte a experiência antes de sair.";
}
const policyKeys = [
    "strong/aggressive",
    "strong/defensive",
    "weak/aggressive",
    "weak/defensive",
    "tactical/aggressive",
    "tactical/defensive",
];
let memory = { games: 0, q: {}, visits: {} };
try {
    const stored = JSON.parse(browserStore.read("monte-castelo-learning-v1") || "null");
    if (stored && Number.isFinite(stored.games) && stored.q && stored.visits)
        memory = stored;
}
catch { }
let policy = null, episode = [];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] || c);
function persist() {
    try {
        browserStore.write("monte-castelo-learning-v1", JSON.stringify(memory));
        return true;
    }
    catch {
        return false;
    }
}
function learn(reward, terminal = false) {
    if (!policy)
        return;
    const prev = Number(memory.q[policy]) || 0;
    memory.q[policy] =
        prev +
            0.2 *
                (reward +
                    (terminal
                        ? 0
                        : 0.85 *
                            Math.max(0, ...Object.values(memory.q).filter(Number.isFinite))) -
                    prev);
    memory.visits[policy] = (Number(memory.visits[policy]) || 0) + 1;
    episode.push(policy);
    persist();
}
function choosePolicy() {
    if (Math.random() < 0.2)
        return policyKeys[Math.floor(Math.random() * policyKeys.length)];
    return [...policyKeys].sort((a, b) => (Number(memory.q[b]) || 0) - (Number(memory.q[a]) || 0) ||
        Math.random() - 0.5)[0];
}
const center = (q, r) => ({ x: 65 + q * 64 + r * 32, y: 63 + r * 56 });
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
let localSide = "br";
function myTurn() {
    return $("gameMode").value === "remote"
        ? game.turn === localSide
        : game.turn === "br";
}
function saveSession() {
    if (busy)
        return;
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
    }));
}
function loadSession() {
    try {
        const value = JSON.parse(browserStore.read("monte-castelo-session-v1") || "null");
        if (value?.schema !== 1 ||
            !validGame(value.game) ||
            !["br", "de"].includes(value.localSide) ||
            !["computer", "remote"].includes(value.mode))
            return false;
        game = value.game;
        localSide = value.localSide;
        $("gameMode").value = value.mode;
        if (["strong", "weak", "tactical", "learning", "trained"].includes(value.ai))
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
        .map(([dx, dy, size]) => `<g transform="translate(${x + dx},${y + dy}) scale(${size})"><path d="M0 -13L-7 -2H-4L-9 5H9L4 -2H7Z" fill="#597c68" stroke="#405d4d" stroke-width=".7"/><path d="M0 4V10" stroke="#836d4d" stroke-width="2.5"/></g>`)
        .join("")}</g>`;
}
function fortGlyph(x, y) {
    return `<g pointer-events="none"><path d="M${x - 29} ${y + 18}v10h58v-10M${x - 29} ${y - 18}v-10h58v10" stroke="#786e59" stroke-width="5" fill="none"/><path d="M${x - 20} ${y + 26}v-6m12 6v-6m12 6v-6m12 6v-6" stroke="#ede4ce" stroke-width="2"/><rect x="${x - 8}" y="${y - 32}" width="16" height="5" fill="#4b4a43"/></g>`;
}
const heightColors = ["", "#f4efdf", "#e9d6a7", "#d1b48c", "#bd8b4f"];
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
                        lines += `<path d="M${crossings[0].x},${crossings[0].y}L${crossings[1].x},${crossings[1].y}" stroke-width="${level % 100 === 0 ? 1.8 : 1}"/>`;
                }
        }
    return `<g class="contours" fill="none" stroke="#936432" stroke-width="2.8" stroke-linecap="round" pointer-events="none">${lines}</g>`;
}
function render() {
    const weather = weatherAt(game.round);
    $("weatherInfo").textContent =
        `${weather.cloud >= 70 ? "☁" : weather.cloud >= 30 ? "⛅" : "☀"} ERA5 regional · ~${Math.round(weather.temperature)} °C · ${weather.cloud}% nuvens · ${String(weather.hour).padStart(2, "0")}h`;
    const u = game.units.find((v) => v.id === selected), reach = u && u.side === game.turn && myTurn() && !busy
        ? reachable(game, u)
        : new Map();
    let svg = '<defs><pattern id="paper" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".5" fill="#4e633a" opacity=".16"/></pattern></defs><rect width="960" height="690" fill="#f2edde"/><rect width="960" height="690" fill="url(#paper)"/><text x="900" y="65" class="maplabel">N ↑</text><text x="650" y="650" class="maplabel">Base geográfica atual · cenário tático 1945</text>';
    for (let r = 0; r < ROWS; r++)
        for (let q = 0; q < COLS; q++) {
            const t = terrain(q, r), { x, y } = center(q, r);
            svg += `<g><polygon class="hex ${reach.has(key(q, r)) ? "reach" : ""}" data-q="${q}" data-r="${r}" points="${hex(q, r)}" fill="${t === "road" ? "#e6c998" : heightColors[elevation(q, r)]}"/>${t === "forest" ? forestGlyph(x, y) : ""}${fortification(q, r) ? fortGlyph(x, y) : ""}${t === "hill" ? `<path d="M${x - 22} ${y + 12}q22 -38 44 0m-37 0q15 -26 30 0" stroke="#69754e" fill="none" pointer-events="none"/>` : ""}<text x="${x - 25}" y="${y + 27}" font-size="7" fill="#495c3d88" pointer-events="none">~${Math.round(altitude(q, r) / 10) * 10}m · N${elevation(q, r)}</text></g>`;
        }
    svg += geographicGlyph();
    svg += contourGlyph();
    for (const o of objectives) {
        const { x, y } = center(o.q, o.r);
        svg += `<circle cx="${x}" cy="${y}" r="34" fill="none" stroke="#b18421" stroke-width="3" stroke-dasharray="5 3" pointer-events="none"/><text x="${x + 28}" y="${y - 22}" font-size="23" fill="#a16d0d" pointer-events="none">⚑</text><text x="${x}" y="${y - 39}" text-anchor="middle" class="maplabel">${o.name ? o.name + ' · ' : ''}${o.points}★/rod</text>`;
    }
    svg +=
        '<text x="75" y="680" class="maplabel">Aproximação FEB · Gaggio Montano fora do recorte, a sudoeste</text><path d="M80 625h179m-179 -5v10m179 -10v10" stroke="#5f5038" stroke-width="2"/><text x="80" y="648" font-size="11" fill="#5f5038">0</text><text x="235" y="648" font-size="11" fill="#5f5038">500 m</text><text x="430" y="25" class="maplabel">Linha defensiva alemã · Apeninos setentrionais</text>';
    for (const v of game.units) {
        const { x, y } = center(v.q, v.r), target = u &&
            u.side === game.turn &&
            canAttack(u, v) &&
            !busy &&
            myTurn();
        svg += `<g class="unit ${selected === v.id ? "selected" : ""} ${target ? "target" : ""}" data-id="${v.id}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="${esc(v.name)}, ${v.side === "br" ? "FEB" : "alemã"}, ${v.hp} de resistência, ataque ${v.atk}, defesa ${v.def}"><title>${esc(v.name)} · A${v.atk} D${v.def} · ${v.hp} PV</title><rect class="counter" x="-25" y="-25" width="50" height="50" rx="1" fill="${v.side === "br" ? "#226ba4" : "#30363d"}"/>${target ? '<rect class="attack-bar" x="-24" y="-30" width="48" height="4" rx="1" fill="#c92f37" pointer-events="none"/>' : ''}<text class="troop-mark" x="0" y="35" text-anchor="middle">${troopProfile(v.id)?.mark ?? 'II'} · T${unitLevel(v)}</text><rect class="symbol" x="-14" y="-13" width="28" height="18"/> <g class="symbol">${symbol(v)}</g><text x="0" y="-17" text-anchor="middle" font-size="7">${v.side === "br" ? "FEB" : "DE"} ${v.hp}/3</text><text x="-21" y="21" style="font-size:9px">A${v.atk} D${v.def}</text><text x="8" y="21" style="font-size:9px">M${v.mp}</text>${Array.from({ length: v.hp }, (_, i) => `<circle cx="${-7 + i * 7}" cy="10" r="2" fill="#eed788"/>`).join("")}${v.hp < 3 ? `<g><circle cx="23" cy="-23" r="10" fill="#b34332" stroke="#fff"/><text x="23" y="-20" text-anchor="middle" style="font-size:10px">−${3 - v.hp}</text></g>` : ""}${v.suppressed ? '<circle class="suppression-marker" cx="-23" cy="-23" r="6" fill="#e2a827" stroke="#fff"/><text x="-23" y="-20" text-anchor="middle" style="font-size:8px">S</text>' : ''}${v.fired ? '<path d="M-22 -22L22 22" stroke="#e5d9bb" opacity=".4"/>' : ""}</g>`;
    }
    $("map").innerHTML = svg;
    $("time").textContent = clock(game.winner && game.finishedRound ? game.finishedRound + 1 : game.round);
    const actionable = u && u.side === game.turn && myTurn() && !busy && !game.winner;
    $('actionHint').textContent = actionable ? (u.fired ? `${u.name}: já atacou. Selecione outra peça.` : `${u.name} · ${u.mp} PM: toque num destino AZUL para andar ou num inimigo com BARRA VERMELHA para atacar.`) : 'Selecione sua peça. Destinos azuis movem; inimigos com barra vermelha recebem ataque.';
    $("goals").innerHTML = objectives
        .map((o, i) => {
        const held = game.units.find((v) => v.q === o.q && v.r === o.r && canCaptureObjective(v));
        return `<button data-goal="${i}" class="${held ? "held-" + held.side : ""}">⚑ ${o.name || `Hex ${o.q + 1}-${o.r + 1}`} · +${o.points}/rodada<small>${held ? (held.side === "br" ? "FEB · seu controle" : "Defesa alemã") : "Livre · ocupe para pontuar"} · localizar ↗</small></button>`;
    })
        .join("");
    $("round").textContent = `${game.finishedRound ?? Math.min(game.round, roundLimit(game))} / ${roundLimit(game)}`;
    $('missionTitle').textContent = game.rules?.requireSummit ? '⚑ MISSÃO: TOME E SEGURE MONTE CASTELO' : '⚑ MISSÃO: OCUPE AS POSIÇÕES MARCADAS';
    $('missionDetail').textContent = `${game.rules?.requireSummit ? 'A infantaria deve permanecer no cume até o fim do turno alemão. ' : ''}Acumule ${targetScore(game)} pontos em até ${roundLimit(game)} rodadas. Os objetivos rendem até ${objectivePointsPerRound()} pontos por rodada, que se somam ao placar: Monte Castelo +2; cada secundário +1. Tempo e perdas determinam o grau da vitória.`;
    $("score").textContent = `${game.score} / ${targetScore(game)}`;
    $("end").disabled = busy || !!game.winner || !myTurn();
    $("shareTurn").disabled =
        $("gameMode").value !== "remote" ||
            game.turn === localSide ||
            !!game.winner;
    $("yourSide").textContent =
        $("gameMode").value === "remote"
            ? localSide === "br"
                ? "VOCÊ COMANDA A FEB"
                : "VOCÊ COMANDA A DEFESA ALEMÃ"
            : "VOCÊ COMANDA A FEB";
    $("ai").disabled = busy || $("gameMode").value === "remote";
    $("stance").disabled = busy || $("gameMode").value === "remote";
    $("phase").textContent = game.winner
        ? game.winner === "br"
            ? "Monte Castelo é nosso!"
            : "A defesa manteve as alturas."
        : busy
            ? "O inimigo está manobrando…"
            : !myTurn()
                ? "Envie o turno ao seu oponente"
                : "Sua vez de avançar";
    $("brief").textContent = game.winner
        ? "Operação encerrada. Inicie outra para experimentar uma nova estratégia."
        : `Tome Monte Castelo e alcance ${targetScore(game)} pontos até a rodada ${roundLimit(game)}.`;
    $("log").innerHTML = game.log
        .slice(0, 7)
        .map((l) => `<p>${esc(l)}</p>`)
        .join("");
    $("unitName").textContent = u ? u.name : "A cobra vai fumar.";
    $("unitInfo").innerHTML = u
        ? `<p class="troop-formation">${esc(troopProfile(u.id)?.echelon ?? 'Agrupamento')} · ${esc(troopProfile(u.id)?.formation ?? '')}</p><p>${u.side === "br" ? "Força Expedicionária Brasileira" : "Defesa alemã"} · ${{ infantry: "Infantaria", armor: "Apoio blindado", artillery: "Artilharia" }[u.type]}</p><div class="statrow"><span>Ataque ${u.atk}</span><span>Defesa ${u.def}</span><span>PV ${u.hp}/3</span><span>Movimento ${u.mp}/${maximumMovement(u)}</span><span>T${unitLevel(u)} · ${troopLevels[unitLevel(u)]}</span><span>Altitude ~${Math.round(altitude(u.q, u.r))}m · N${elevation(u.q, u.r)}</span><span>Fortificação +${fortification(u.q, u.r)}</span><span>Alcance ${attackRange(u)}${u.heightRange && !u.indirect ? ' +1 acima de ' + (u.rangeHeightThreshold ?? 90) + 'm' : ''}</span><span>Cobertura ${["hill", "forest"].includes(terrain(u.q, u.r)) ? "+1" : "0"}</span></div><p>${u.fired ? "Ação concluída · já atacou neste turno." : u.mp === 0 ? "Sem movimento · ainda pode atacar um inimigo ao alcance." : "Pronta para agir · pode mover e depois atacar."} Dano acumulado: ${3 - u.hp}. Potência atual: ${u.atk - (3 - u.hp) * 0.5}. Defender pelo menos 30 m acima do atacante dá +1 adicional.</p><p>${u.suppressed ? 'Sob fogo de apoio: não pode reagir até seu próprio turno. ' : ''}${u.reactionSpent ? 'Já reagiu: ação do próximo turno comprometida.' : ''}</p><p class="muted">${canCaptureObjective(u) ? 'Infantaria de manobra: pode ocupar os objetivos.' : 'Apoio de fogos: não ocupa objetivos sozinho.'} ${u.maxMp === undefined ? 'Perfil preservado da partida anterior; novas partidas usam os perfis revisados.' : ''}</p>`
        : "<p>Selecione uma peça azul e toque no destino azul para andar ou no inimigo com barra vermelha para atacar.</p><p>A = ataque · D = defesa · M = movimento restante. Pontos dourados = resistência. Selo vermelho = dano acumulado. Toque duas vezes para ampliar.</p>";
    $("learningStatus").textContent =
        `IA especial: ${trained.episodes} partidas de experiência · ${Object.keys(trained.q).length} situações. Aprendiz simples: ${memory.games} partidas concluídas · experiência local${policy ? " · " + policy.replace("/", " / ") : ""}.`;
    if (game.winner && !rewarded) {
        rewarded = true;
        if (trainedUsed) {
            finishLearningEpisode(trained, trainedContext, game);
            saveTrained();
        }
        if (episode.length || policy) {
            learn(game.winner === "de" ? 8 : -8, true);
            memory.games++;
            persist();
            $("learningStatus").textContent =
                `Aprendiz: ${memory.games} partidas concluídas · experiência salva neste navegador.`;
        }
        const assessment = victoryAssessment(game);
        show(`<span class="eyebrow">FIM DA OPERAÇÃO</span><h2>${assessment.grade}</h2><p>${game.winner === 'br' ? 'Monte Castelo foi assegurado pela infantaria.' : 'A defesa impediu a missão brasileira.'}</p><div class="statrow"><span>Rodadas: ${assessment.rounds}/${roundLimit(game)}</span><span>Pontos: ${game.score}</span><span>Peças FEB fora de combate: ${assessment.lostUnits}/5</span><span>Coesão perdida: ${assessment.lostCohesion}/15</span><span>Eficiência: ${assessment.efficiency}/100</span></div><p>Uma vitória mais cedo e com menos perdas recebe grau maior: decisiva, tática, custosa ou pírrica. Perdas de peças e coesão não são números de soldados mortos.</p><p>Use Nova partida para outra operação. A experiência da IA é preservada.</p>`);
    }
    saveSession();
}
function show(html) {
    $("modalBody").innerHTML = html;
    if (!$("modal").open)
        $("modal").showModal();
}
function inspect(u) {
    show(`<h2>${esc(u.name)}</h2><p>${esc(troopProfile(u.id)?.echelon ?? 'Agrupamento')} · T${unitLevel(u)} — ${troopLevels[unitLevel(u)]}</p><div class="bigpiece" data-side="${u.side}">${u.type === "infantry" ? "☒" : u.type === "armor" ? "▱" : "●"}<small>A${u.atk} · D${u.def} · M${u.mp}<br>${u.hp}/3 PV · ${3 - u.hp} dano(s)</small></div><p>Ataque ${u.atk} · Defesa ${u.def} · Resistência ${u.hp}/3 · Dano acumulado ${3 - u.hp} · Alcance ${attackRange(u)} hexágono(s).</p><p>${esc(troopProfile(u.id)?.description ?? 'Agrupamento de cenário.')}</p><p>${canCaptureObjective(u) ? 'Pode ocupar posições.' : 'Somente apoio de fogos; não ocupa posições sozinho.'} Mobilidade máxima: ${maximumMovement(u)} PM.</p><p class="muted">Os 3 PV são coesão relativa, não efetivos iguais de pessoas. Escalão e T1–T3 estão explicados em Forças e níveis.</p>`);
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
        if (!canAttack(actor, u)) {
            $("actionHint").textContent =
                "Alvo fora do alcance ou sem linha de visão. Reposicione sua peça.";
            return;
        }
        attack(game, actor.id, u.id);
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
        advance(game, selected, +cell.dataset.q, +cell.dataset.r);
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
$("end").onclick = async () => {
    if (busy || game.winner || !myTurn())
        return;
    lastTap = { id: null, time: 0 };
    if ($("gameMode").value === "remote") {
        selected = null;
        endTurn(game);
        render();
        if (!game.winner)
            shareTurn();
        return;
    }
    busy = true;
    const token = generation;
    selected = null;
    endTurn(game);
    render();
    const mode = $("ai").value;
    if (mode === "learning")
        policy = choosePolicy();
    else
        policy = null;
    let [chosen, stance] = policy ? policy.split("/") : [mode, $("stance").value];
    if (mode === "trained") {
        trainedUsed = true;
        const learned = beginLearningTurn(trained, trainedContext, game, "de");
        chosen = learned.strategy;
        stance = learned.stance;
        saveTrained();
    }
    const before = game.units.filter((u) => u.side === "br").reduce((n, u) => n + u.hp, 0) -
        game.units.filter((u) => u.side === "de").reduce((n, u) => n + u.hp, 0), oldScore = game.score;
    for (const id of activationOrder(game, "de")) {
        await pause();
        if (token !== generation)
            return;
        takeAIAction(game, id, chosen, stance);
        render();
        if (game.winner)
            break;
    }
    if (!game.winner)
        endTurn(game);
    const after = game.units.filter((u) => u.side === "br").reduce((n, u) => n + u.hp, 0) -
        game.units.filter((u) => u.side === "de").reduce((n, u) => n + u.hp, 0);
    if (mode === "learning" && !rewarded)
        learn(before - after - (game.score - oldScore));
    busy = false;
    if (mode === "trained")
        saveTrained();
    render();
};
$("new").onclick = () => {
    if (!game.winner &&
        !confirm("Recomeçar esta operação? A experiência já aprendida será mantida."))
        return;
    generation++;
    game = createGame();
    localSide = "br";
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
function setZoom(n, anchor) {
    const viewport = $("viewport");
    const oldWidth = $("map").getBoundingClientRect().width;
    const px = anchor?.x ?? viewport.clientWidth / 2, py = anchor?.y ?? viewport.clientHeight / 2;
    const oldX = viewport.scrollLeft + px, oldY = viewport.scrollTop + py;
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
$("rules").onclick = () => show(`<span class="eyebrow">MANUAL DE CAMPANHA</span><h2>Tomar as alturas</h2><p>Você comanda a FEB, em azul. O computador comanda a defesa alemã, em carvão. Uma partida tem no máximo ${roundLimit(game)} rodadas.</p><ol><li><b>Mova:</b> selecione a peça e toque no destino azul. Campo e estrada custam 1 PM; mata, 2 PM. Some 1 PM por nível de subida. Descer não tem custo extra. Pode mover em etapas. Não é possível atravessar peças.</li><li><b>Ataque:</b> selecione a peça e toque no inimigo com barra vermelha. Não há botões para trocar de ação. Infantaria alcança 1 hexágono; o apoio agregado alcança 2 por uma simplificação de suas armas coletivas. Artilharia faz tiro indireto em alvos conhecidos a até 5 hexágonos nos novos perfis, inclusive fortificações, dispensando linha de visão direta. A proteção do terreno e da fortificação continua valendo. Um ataque por turno.</li><li><b>Combate:</b> ataque + dado de 1 a 6 − defesa − cobertura − 0,5 por PV perdido pelo atacante. Mata, objetivo elevado ou fortificação dão +1 de cobertura, sem acumular entre si. As posições preparadas de Monte Castelo e de um objetivo secundário são desenhadas como abrigos e trincheiras; suas localizações são esquemáticas. Um defensor pelo menos 30 m acima recebe mais +1. O tiro direto de uma posição pelo menos ${game.rules?.rangeHeightThreshold ?? 90} m acima alcança um hexágono extra, com linha de visão. Os números ↑1 a ↑4 indicam níveis relativos de altitude. Resultado ≥5 causa 2 danos; ≥1 causa 1; ≤0 falha e causa 1 dano de contra-ataque ao atacante se adjacente, desde que o defensor não esteja suprimido nem já tenha reagido. Cada peça começa com 3 PV de coesão. Infantaria possui 3 PM; destacamentos alemães 2; apoio 2; artilharia 1, conforme o perfil. Apenas infantaria de manobra ocupa objetivos. Perder toda a infantaria de manobra encerra a missão brasileira. Atacar zera seus PM.</li><li><b>Vitória:</b> ao fim de cada turno alemão, uma peça brasileira de infantaria de manobra sobre Monte Castelo rende 2 pontos; cada objetivo secundário rende 1. O máximo dos três objetivos é ${objectivePointsPerRound()} pontos por rodada, não o limite do placar. Os pontos se acumulam entre rodadas e não são perdidos ao sair da posição. Acumule ${targetScore(game)} pontos e assegure Monte Castelo com infantaria no fim do turno alemão. Apenas tomar os secundários ou eliminar o inimigo não substitui a ocupação do cume nesta missão. O prazo é ${roundLimit(game)} rodadas; a perda de toda a infantaria de manobra também dá vitória à defesa. O grau da vitória considera tempo, peças fora de combate e coesão perdida.</li></ol><h2>Fogo na subida</h2><p>Ao percorrer uma rota exposta ou iniciar um assalto, uma unidade de tiro direto pelo menos 30 m acima pode disparar primeiro. Há no máximo uma reação por movimento completo e uma do alvo antes do assalto. O tiro de oportunidade causa no máximo 1 dano; o ataque normal pode causar 2. A reação consome a ação de fogo e movimento do próximo turno da unidade; não é um disparo extra ilimitado. A regra é simétrica, incluindo brasileiros que dominem altura.</p><p>Um acerto de apoio indireto suprime a reação do defensor até o início do seu próprio turno, sem retirar seu tiro normal. Use apoio antes de mandar a infantaria encosta acima. O símbolo S indica supressão. Artilharia indireta não ganha alcance adicional por altura.</p><h2>Como ler a altura</h2><p>As cores de papel para o marrom mostram quatro níveis: N1 vale, N2 encosta, N3 crista e N4 cume. As linhas marrons são curvas de nível a cada 50 m, geradas por interpolação entre as amostras de elevação do tabuleiro. Subir um nível custa +1 PM; defender pelo menos 30 m acima dá +1 de defesa. As faixas agora derivam de amostras do Copernicus DEM de 90 m: N1 abaixo de 780 m, N2 de 780–849 m, N3 de 850–919 m, N4 a partir de 920 m. São generalizações para as regras. O cume está ancorado no ponto OSM de cota 977 m; a amostra DEM dá aproximadamente 980 m. O relevo é geográfico atual; caminhos e bosques modernos não comprovam a cobertura de 1945.</p><h2>Como ler o desenho das peças</h2><div class="counter-guide"><div class="example-counter" aria-label="Exemplo de infantaria brasileira: três pontos de resistência, ataque três, defesa três e movimento três"><b>FEB 3/3</b><svg viewBox="0 0 80 44" role="img" aria-label="Símbolo militar de infantaria"><rect x="10" y="3" width="60" height="36" fill="none" stroke="white" stroke-width="3"/><path d="M10 3L70 39M70 3L10 39" stroke="white" stroke-width="3"/></svg><span class="example-dots">● ● ●</span><small>A3 D3 M3</small></div><div><p><b>FEB / DE:</b> lado da peça. Brasileiros são azuis; alemães, carvão. O número 3/3 mostra a resistência atual e a inicial.</p><p><b>Bolinhas douradas:</b> cada uma vale 1 ponto de resistência (PV). Três bolinhas: peça intacta. Duas: sofreu 1 dano. Uma: sofreu 2 danos. Ao perder o último PV, a peça sai do mapa.</p></div></div><ul><li><b>Retângulo com X:</b> símbolo militar convencional de infantaria, simplificado para o jogo.</li><li><b>Retângulo com ponto branco no centro:</b> artilharia, com tiro indireto de até 5 hexágonos nos novos perfis. O ponto central identifica o tipo da tropa; as bolinhas douradas abaixo mostram resistência.</li><li><b>A:</b> ataque nominal. <b>D:</b> defesa nominal. <b>M:</b> movimento restante no turno. M diminui ao mover e zera ao atacar; volta ao máximo no próximo turno desse lado.</li><li><b>Selo vermelho −1 ou −2:</b> dano acumulado desde os 3 PV iniciais. Cada PV perdido reduz a potência do ataque em 0,5; a potência atual aparece no painel da peça.</li><li><b>Traço diagonal sobre a peça:</b> já atacou neste turno. O direito de ataque volta no próximo turno desse lado.</li><li><b>II:</b> escalão de batalhão ou grupo de artilharia. <b>AP:</b> apoio agregado. <b>DEST:</b> destacamento reduzido de cenário. <b>T1–T3:</b> nível tático do perfil; T1 reduzido, T2 operacional, T3 especializado em fogos. Não são notas históricas nem bônus ocultos.</li><li><b>Halo azul:</b> peça selecionada. <b>Hexágonos com contorno azul:</b> destinos legais ao selecionar sua peça. <b>Contorno vermelho no inimigo:</b> alvo legal ao selecionar sua peça.</li></ul><p>Duplo toque/clique amplia a peça com seus valores atuais. O painel mostra também altitude, cobertura, fortificação, alcance e estado de ação.</p><h2>21 de fevereiro de 1945</h2><p>A conquista de Monte Castelo, nos Apeninos setentrionais, foi um marco da Força Expedicionária Brasileira na campanha da Itália. Depois das tentativas frustradas de novembro e dezembro de 1944, o ataque de fevereiro de 1945 ocorreu no contexto da Operação Encore, em coordenação com a 10ª Divisão de Montanha dos EUA no setor de Monte Belvedere. O general Mascarenhas de Moraes comandava a FEB; a defesa do setor estava ligada à 232ª Divisão de Infantaria do Heer (Exército regular alemão). As fontes consultadas para este cenário não identificam unidades Waffen-SS na defesa de Monte Castelo; o jogo representa tropas do Heer.</p><p>O cenário representa o avanço brasileiro do setor de Gaggio Montano contra posições elevadas. Elevações favorecem a defesa, matas dificultam a progressão e a artilharia dá apoio a distância. O limite de rodadas representa a pressão por coordenação e tomada das posições.</p><p><b>Limites históricos:</b> o tabuleiro usa amostras do Copernicus DEM e caminhos/bosques do OpenStreetMap atual; não é uma restituição da cartografia de 1945. Os pontos secundários não recebem nomes geográficos inventados: são referências de hexágono para as regras, sem afirmar uma posição histórica identificada. Efetivos, posições militares e conversão dos dados geográficos em hexágonos foram simplificados para uma partida curta; as unidades não reproduzem uma ordem de batalha exata.</p><h3>Horário, observação e clima</h3><p>O relógio do cenário começa às 06:00 e avança 72 minutos por rodada, cobrindo o período até 18:00. A síntese em inglês da batalha situa o ataque principal às 06:00; a síntese em português diz “ao amanhecer”. Ambas registram a chegada ao cume às 17:30 e a concentração de artilharia entre 16:00 e 17:00. Na rodada 10 (16:48), a artilharia brasileira recebe +1 de ataque: uma abstração dessa concentração. Os turnos não reproduzem uma cronologia exata.</p><p>A posição de observação elevada lembrada na pergunta corresponde especialmente à crista de Riva, a sudoeste de Monte Belvedere. Dali os alemães observavam as aproximações à encosta sul de Belvedere e corrigiam o fogo de artilharia. O 1º Batalhão do 86º Regimento de Infantaria de Montanha, com a Companhia F, escalou de surpresa as escarpas na noite de 18 para 19 de fevereiro, tomou os postos e resistiu aos contra-ataques. A 10ª Divisão de Montanha atacou Belvedere–Gorgolesco em seguida. Isso integrou a ofensiva coordenada com a FEB; não é um segundo monte a ser tomado neste tabuleiro. Monte della Torraccia continuou sendo disputado durante a operação.</p><p><b>Clima do cenário:</b> a reanálise ERA5 regional de 21/02/1945, acessada pelo Open-Meteo, sugere frio forte e muitas nuvens às 06h, abertura pela manhã e céu aberto à tarde. Ela indica precipitação e neve nova zero nesse dia; a cobertura de neve no chão não está disponível. O modelo tem resolução de aproximadamente 25 km e não é uma medição feita pelos soldados ou uma reconstrução de cada encosta. O botão de tempo mostra a estimativa horária; esses dados não geram penalidades automáticas de movimento ou visibilidade. Nuvens não equivalem a nevoeiro.</p><h3>Fontes consultadas</h3><p><a href="https://pt.wikipedia.org/wiki/Batalha_de_Monte_Castelo" target="_blank" rel="noopener">Batalha de Monte Castelo · síntese em português</a><br><a href="https://en.wikipedia.org/wiki/Battle_of_Monte_Castello" target="_blank" rel="noopener">Battle of Monte Castello · cronologia em inglês</a><br><a href="https://en.wikipedia.org/wiki/Operation_Encore" target="_blank" rel="noopener">Operation Encore · Riva Ridge e Belvedere</a></p><h3>Bibliografia para aprofundar</h3><p><a href="https://www.fgv.br/cpdoc/acervo/dicionarios/verbete-tematico/forca-expedicionaria-brasileira-feb" target="_blank" rel="noopener">FGV CPDOC · Força Expedicionária Brasileira</a><br><a href="https://history.army.mil/html/books/006/6-4-1/index.html" target="_blank" rel="noopener">U.S. Army Center of Military History · Cassino to the Alps</a></p><p>O capítulo XXIV e o mapa 10 de Cassino to the Alps foram consultados em reprodução HyperWar. A p. 431 registra retirada alemã e resistência final de pequena retaguarda, dinâmica simplificada neste jogo. Também foram consultadas as sínteses da batalha em português e inglês e de Operation Encore. O mapa agora está georreferenciado ao cume, com DEM e feições atuais OSM; ainda não é uma reconstrução cartográfica da batalha em 1945.</p><h3>Comandantes do computador</h3><p>Caçador prioriza maior ataque, desempata por distância. Oportunista prioriza menor defesa, desempata por distância. A postura agressiva aproxima; a defensiva valoriza cobertura e objetivos. Estado-maior avalia movimentos legais, ameaças, apoio e objetivos; calcula sem busca longa. Aprendiz usa Q-learning simples para escolher entre seis combinações de estratégia/postura, com exploração de 20%, recompensa por danos e contenção de pontos, e bônus por resultado final. Ele aprende a escolher políticas, não movimentos individuais. A experiência fica no armazenamento local, sem servidor; apagar os dados do navegador apaga o aprendizado.</p>`);
function narrative() {
    show(`<span class="eyebrow">APENINOS, ITÁLIA · 21 DE FEVEREIRO DE 1945</span><img class="narrative-logo" src="${gameLogo}" alt="Emblema de Monte Castelo Vibed: cobra fumando sobre montanhas"><h2>Monte Castelo Vibed</h2><h3>Antes de o sol alcançar as alturas…</h3><p>À sua frente, Monte Castelo. Depois dos ataques frustrados do ano anterior, os pracinhas da Força Expedicionária Brasileira voltam a avançar. A encosta exposta favorece os defensores; cada dobra do terreno pode oferecer proteção ou esconder uma posição inimiga.</p><p>No setor vizinho, a ofensiva americana contra a crista de Riva e Monte Belvedere integra o esforço aliado. Agora, cabe à FEB conquistar sua parte das alturas.</p><p><b>Sua missão:</b> conduza as peças azuis, use a cobertura e a artilharia e assegure Monte Castelo e acumule ${targetScore(game)} pontos em até ${roundLimit(game)} rodadas. Planeje a subida: a altura custa movimento e protege o defensor.</p><p class="muted">Narrativa ambientada em fatos históricos. Tabuleiro, forças e duração dos turnos são abstrações. Horário baseado nas sínteses da batalha; clima diário representado por reanálise regional ERA5; cartografia generalizada, cotejada com mapa operacional da história oficial americana.</p><button id="begin">Assumir o comando →</button>`);
    $("begin").onclick = () => $("modal").close();
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
    show("<h2>Turno não reconhecido</h2><p>O link recebido está incompleto ou é incompatível.</p>");
}
render();
fitMap();
if (resumed) {
    show(`<span class="eyebrow">${received ? "TURNO RECEBIDO" : "OPERAÇÃO SALVA"}</span><h2>Monte Castelo espera por você.</h2><p>Rodada ${Math.min(game.round, 10)} · ${game.score} pontos. ${$("gameMode").value === "remote" ? (localSide === "br" ? "Você comanda a FEB." : "Você comanda a defesa alemã.") : "Sua experiência e sua operação foram mantidas neste navegador."}</p><button id="begin">Retomar operação →</button>`);
    $("begin").onclick = () => $("modal").close();
}
else
    narrative();
$("credits").onclick = () => show(`<span class="eyebrow">AUTORIA & LICENÇA</span><img class="narrative-logo" src="${gameLogo}" alt="Emblema original do jogo inspirado na FEB"><h2>Monte Castelo Vibed</h2><div class="ludes-credit"><img src="${ludesLogo}" alt="Logo oficial do LUDES" width="300" height="76"><a href="https://ludes.cos.ufrj.br/" target="_blank" rel="noopener">LUDES · UFRJ</a></div><p><b>Autoria e concepção:</b> Geraldo Xexéo (xexeo).<br><b>Desenvolvimento:</b> realizado com assistência de IA, a partir das orientações do autor.</p><p>Copyright © 2026 Geraldo Xexéo (xexeo).</p><p class="muted">Versão ${release.version} · ${release.displayDate} · Brasília</p><h3>CC BY-NC-SA 4.0</h3><p>Creative Commons Atribuição–NãoComercial–CompartilhaIgual 4.0 Internacional. Você pode compartilhar e adaptar este trabalho com atribuição, para fins não comerciais e distribuindo adaptações sob a mesma licença.</p><p><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br" target="_blank" rel="noopener">Resumo oficial da licença</a> · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pt" target="_blank" rel="noopener">Termos oficiais em português</a></p><details><summary>Texto integral da licença (disponível offline)</summary><pre class="license-text">${esc(licenseText)}</pre></details><p class="muted">O emblema do jogo é uma criação com assistência de IA inspirada na cobra fumando da FEB; não é um distintivo oficial. O logo LUDES é a imagem institucional fornecida pelo autor. A licença do jogo não concede direitos sobre marcas e logotipos institucionais.</p>`);
$("memory").onclick = () => {
    show(`<span class="eyebrow">EXPERIÊNCIA DO COMANDANTE</span><h2>Uma IA que leva suas lições adiante</h2><p>${trained.episodes} partidas de experiência · ${trained.updates} atualizações · ${Object.keys(trained.q).length} situações aprendidas.</p><p>A IA especial já vem treinada em ${pretrained.episodes} partidas de autojogo. Aprende a escolher estratégia e postura conforme fase, forças, pontos e ocupação. Continua aprendendo aqui; a experiência fica neste navegador. Não há sincronização automática entre aparelhos.</p><button id="exportMemory">Exportar experiência</button><p><label for="importMemory">Importar experiência salva</label><input id="importMemory" type="file" accept="application/json,.json"></p><p id="importResult" aria-live="polite"></p>`);
    $("exportMemory").onclick = () => {
        const blob = new Blob([JSON.stringify(trained, null, 2)], {
            type: "application/json",
        }), url = URL.createObjectURL(blob), a = document.createElement("a");
        a.href = url;
        a.download = "monte-castelo-vibed-experiencia.json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    $("importMemory").onchange = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file || file.size > 2000000)
                throw new Error("Arquivo ausente ou muito grande.");
            const data = JSON.parse(await file.text());
            if (!validLearning(data))
                throw new Error("Arquivo de experiência incompatível.");
            trained = data;
            trainedContext = {};
            saveTrained();
            $("importResult").textContent =
                "Experiência importada. Será usada no próximo turno.";
        }
        catch (err) {
            $("importResult").textContent =
                err instanceof Error ? err.message : "Não foi possível importar.";
        }
    };
};
function downloadTurn() {
    const data = JSON.stringify({ schema: 1, game }), blob = new Blob([data], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = `monte-castelo-turno-${game.round}-${game.turn}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function shareTurn() {
    const url = publicTurnLink(game, location.href);
    show(`<span class="eyebrow">HUMANO × HUMANO · TURNO ASSÍNCRONO</span><h2>Passe o comando.</h2><p>O próximo turno é ${game.turn === "br" ? "da FEB" : "da defesa alemã"}. Envie o link ou arquivo ao seu oponente; ele abre o jogo e assume esse lado. Quando terminar, ele envia o próximo turno de volta.</p>${url ? `<a class="share-link" href="https://wa.me/?text=${encodeURIComponent("Monte Castelo Vibed · rodada " + game.round + " · seu turno! " + url)}" target="_blank" rel="noopener">Enviar pelo WhatsApp ↗</a><button id="copyTurn">Copiar link do turno</button>` : "<p>Esta cópia está aberta offline ou em endereço local. Use o arquivo de turno; para enviar um link, abra a versão publicada no GitHub Pages.</p>"}<button id="downloadTurn">Baixar arquivo do turno</button><p id="shareStatus" aria-live="polite"></p><p class="muted">Modo assíncrono, sem servidor de partida. Cada envio é uma fotografia do estado; continuem sempre a partir do último turno recebido.</p>`);
    $("downloadTurn").onclick = downloadTurn;
    if (url)
        $("copyTurn").onclick = async () => {
            try {
                await navigator.clipboard.writeText(url);
                $("shareStatus").textContent = "Link copiado.";
            }
            catch {
                $("shareStatus").textContent =
                    "Use o botão do WhatsApp ou baixe o turno.";
            }
        };
}
$("shareTurn").onclick = shareTurn;
$("gameMode").onchange = () => {
    generation++;
    game = createGame();
    localSide = "br";
    busy = false;
    selected = null;
    rewarded = false;
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
            throw new Error("Arquivo inválido.");
        const value = JSON.parse(await file.text());
        if (value.schema !== 1 || !validGame(value.game))
            throw new Error("Turno incompatível.");
        generation++;
        game = value.game;
        localSide = game.turn;
        $("gameMode").value = "remote";
        busy = false;
        selected = null;
        rewarded = false;
        trainedUsed = false;
        trainedContext = {};
        render();
        show(`<h2>Turno recebido</h2><p>Rodada ${game.round}. Você comanda ${localSide === "br" ? "a FEB" : "a defesa alemã"}.</p>`);
    }
    catch (err) {
        show(`<h2>Não foi possível abrir o turno</h2><p>${esc(err instanceof Error ? err.message : "Arquivo inválido.")}</p>`);
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
$("weatherInfo").onclick = () => show(`<span class="eyebrow">21 FEV 1945 · HORÁRIO LOCAL DA ITÁLIA (UTC+1)</span><h2>O tempo no último ataque</h2><p>A reconstrução regional ERA5, distribuída pelo Open-Meteo, sugere uma madrugada muito fria e nublada, abertura pela manhã e céu aberto à tarde. É um modelo retrospectivo, não um diário meteorológico medido no campo de batalha.</p><div class="weather-table"><table><thead><tr><th>Hora</th><th>Temperatura</th><th>Nuvens</th><th>Precipitação</th></tr></thead><tbody>${[
    6, 9, 12, 16, 18,
]
    .map((i) => {
    const w = weatherHours[i];
    return `<tr><td>${String(i).padStart(2, "0")}:00</td><td>~${w.temperature} °C</td><td>${w.cloud}%</td><td>${w.precipitation} mm</td></tr>`;
})
    .join("")}</tbody></table></div><p>O modelo indica 0 mm de precipitação e 0 cm de neve nova no dia. Isso não demonstra ausência de neve acumulada: a série de profundidade da neve retornou sem dados. Vento modelado às 14h: 9,3 km/h. Não tratamos nebulosidade como nevoeiro nem deduzimos solo seco apenas da ausência de chuva.</p><p>Nascer do sol calculado: 07:05; pôr do sol: 17:53, sem considerar obstruções das montanhas. O relógio de jogo e o apoio de artilharia são simplificações da operação.</p><p>Consulta para 44,221799°N / 10,954227°E; resposta regional 44,25°N / 11,00°E, elevação informada 954 m. Resolução ERA5: 0,25° (~25 km). A escala não resolve as encostas nem o microclima de Monte Castelo.</p><p>Um resultado indexado do Blog do Exército descreve o dia como ensolarado; o texto integral retornou 503. A BBC descreve o frio no contexto da campanha, sem medição diária. Essas evidências foram separadas no registro histórico.</p><p><a href="${weatherQuery}" target="_blank" rel="noopener">Consulta reproduzível dos dados</a> · <a href="https://open-meteo.com/en/docs/historical-weather-api" target="_blank" rel="noopener">Documentação Open-Meteo</a> · <a href="https://www.bbc.com/portuguese/articles/c3d8v1jmyryo" target="_blank" rel="noopener">Reportagem BBC</a></p><p class="muted">Dados: Open-Meteo / ECMWF ERA5, com atribuição às fontes. O jogo incorpora uma cópia e não depende de conexão com uma API meteorológica para funcionar.</p>`);
function geographicGlyph() {
    const path = (p) => p.map((v, i) => `${i ? "L" : "M"}${v.x},${v.y}`).join("");
    return `<g pointer-events="none" class="geographical-features">${geography.woods.map((p) => `<path d="${path(p)}Z" fill="#5e856b" fill-opacity=".12" stroke="#658371" stroke-opacity=".3" stroke-width=".7"/>`).join("")}${geography.roads.map((r) => `<path d="${path(r.points)}" fill="none" stroke="${["path", "footway", "track"].includes(r.type) ? "#8e795a" : "#e6b971"}" stroke-width="${["path", "footway"].includes(r.type) ? 1.3 : 3.5}" stroke-dasharray="${["path", "footway"].includes(r.type) ? "3 3" : "none"}" stroke-linecap="round"/>`).join("")}${geography.buildings.map((p) => `<path d="${path(p)}Z" fill="#a48a73" stroke="#806b57" stroke-width=".4"/>`).join("")}${geography.settlements.filter(() => false).map((p) => `<text x="${p.x + 5}" y="${p.y - 6}" class="place-label">${esc(p.name)}</text>`)
        .join("")}</g>`;
}
$("mapSources").onclick = () => show(`<span class="eyebrow">GEOGRAFIA & FONTES DO MAPA</span><h2>Um campo de batalha com lugar real</h2><p>O hexágono de Monte Castelo está ancorado em 44,2206238°N / 10,9537700°E, ponto de cume registrado no OpenStreetMap com cota 977 m. Cada centro de hexágono recebeu uma amostra do Copernicus DEM GLO-90 (90 m), via Open-Meteo. A distância entre centros vizinhos é aproximadamente 180 m.</p><p>Os traçados de caminhos, bosques, edifícios e localidades vêm de uma fotografia atual do OpenStreetMap. Eles ajudam a representar o lugar, mas não demonstram o que existia em 1945. As fortificações e posições militares continuam sendo abstrações de cenário; as curvas são generalizadas entre amostras, não curvas de nível de precisão.</p><h3>Mapa da história oficial do Exército dos EUA</h3><img class="historic-map" src="${officialMap}" alt="Mapa 10 da história oficial Cassino to the Alps, Operação Encore, 19 de fevereiro a 5 de março de 1945"><p>Ernest F. Fisher Jr., <i>Cassino to the Alps</i>, U.S. Army Center of Military History, mapa 10, cartografia de R. Clinton. Mostra Monte Castello, Belvedere e della Torraccia, eixos de ataque e curvas de nível. Escala operacional: não localiza cada destacamento neste tabuleiro.</p><p><a href="https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/USA-MTO-Cassino-24.html" target="_blank" rel="noopener">História oficial, capítulo XXIV (cópia HyperWar)</a> · <a href="https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/maps/USA-MTO-Cassino-10.jpg" target="_blank" rel="noopener">Mapa 10 original</a></p><p>A p. 431 descreve retirada alemã precipitada pelo avanço americano e resistência final de uma pequena retaguarda. A defesa integral do jogo é uma abstração, não uma reprodução literal dos efetivos naquele momento. A memória de Mascarenhas foi localizada em catálogos da BIBLIEx, mas seus mapas integrais ainda não foram consultados.</p><h3>Referência complementar</h3><img class="historic-map" src="${historicalMap}" alt="Mapa histórico dos movimentos da 10ª Divisão de Montanha em Riva Ridge, Belvedere e Torraccia, com Monte Castello a leste"><p class="muted">Armand Casini, panfleto Mountaineers, c.1950. Domínio público conforme metadados do Wikimedia Commons. É uma perspectiva regional, não o levantamento topográfico deste tabuleiro.</p><p><a href="https://commons.wikimedia.org/wiki/File:10thMtMap01.jpg" target="_blank" rel="noopener">Mapa histórico e metadados</a> · <a href="https://www.openstreetmap.org/node/5245929042" target="_blank" rel="noopener">Cume no OpenStreetMap</a> · <a href="https://open-meteo.com/en/docs/elevation-api" target="_blank" rel="noopener">Copernicus DEM / Open-Meteo</a></p><p class="muted">© OpenStreetMap contributors, dados sob ODbL 1.0; Copernicus DEM 2021 GLO-90. As licenças desses dados permanecem próprias, separadas da licença do código do jogo.</p>`);
$('forces').onclick = () => show(`<span class="eyebrow">ESCALA DE BATALHÃO · NÍVEIS TÁTICOS</span><h2>Forças e níveis</h2><p>A infantaria usa batalhões; a artilharia, grupos de fogos. O apoio do Sampaio agrega armas coletivas e não inventa um quarto batalhão. Os destacamentos alemães agregam forças da 232ª DI do Heer, com escalão exato não confirmado; não se afirmam três batalhões completos no cume.</p><p>T1 = destacamento reduzido; T2 = operacional; T3 = especializado em fogos. São perfis de jogo, sem bônus ocultos e sem afirmar uma nota histórica de cada comandante. Os três batalhões do Sampaio recebem a mesma classe operacional.</p><div class="roster-table"><table><thead><tr><th>Tropa</th><th>Escalão</th><th>T</th><th>A</th><th>D</th><th>PM</th><th>Alcance</th><th>Ocupa</th></tr></thead><tbody>${troopProfiles.map(p => `<tr><th scope="row">${p.side === 'br' ? 'FEB' : 'Heer'} · ${esc(p.name)}</th><td>${esc(p.echelon)}</td><td>${p.level}</td><td>${p.atk}</td><td>${p.def}</td><td>${p.mp}</td><td>${p.range}</td><td>${p.canCapture ? 'sim' : 'não'}</td></tr>`).join('')}</tbody></table></div><p>A defesa preparada vem da fortificação e do terreno. A reserva T1 representa menor força disponível, sem concluir que os soldados fossem inexperientes. A artilharia tem alto poder de fogo e defesa próxima baixa; o alcance é uma abstração de disponibilidade de apoio, não alcance balístico real.</p><p>Os novos perfis valem para novas partidas. Partidas salvas mantêm seus atributos; o aprendizado local não é apagado.</p><p><a href="https://en.wikipedia.org/wiki/Battle_of_Monte_Castello" target="_blank" rel="noopener">Batalhões no ataque final</a> · <a href="https://en.wikipedia.org/wiki/232nd_Infantry_Division_(Wehrmacht)" target="_blank" rel="noopener">Organização da 232ª DI</a> · <a href="https://github.com/xexeo/wargameBrasil/blob/main/docs/TROPAS.md" target="_blank" rel="noopener">Fontes, critérios e valores editáveis</a></p>`);
//# sourceMappingURL=app.js.map