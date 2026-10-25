import { type Side } from './engine.js';
import {validGame,encodeTurn,decodeTurn,publicTurnLink} from './exchange.js';
import { pretrained } from "./pretrained.js";
import { beginLearningTurn, finishLearningEpisode, validLearning, type LearningContext, type LearningTable } from "./learning.js";
import { browserStore } from "./persistence.js";
import { aiAction } from "./ai.js";
import { release } from "./version.js";
import { ludesLogo, gameLogo } from "./assets-data.js";
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
  move,
  attack,
  endTurn,
} from "./engine.js";
const $ = (id: string): any => document.getElementById(id);
$("gameLogo").src = gameLogo;
$("buildVersion").textContent = `v${release.version} · ${release.displayDate} · Brasília`;
let game = createGame(),
  selected: string | null = null,
  zoom = 1,
  busy = false,
  generation = 0,
  lastTap: { id: string | null; time: number } = { id: null, time: 0 },
  rewarded = false;
let trained:LearningTable=structuredClone(pretrained),trainedContext:LearningContext={},trainedUsed=false;
try{const saved=JSON.parse(browserStore.read('monte-castelo-trained-v1')||'null');if(validLearning(saved))trained=saved;}catch{}
function saveTrained(){const ok=browserStore.write('monte-castelo-trained-v1',JSON.stringify(trained));$('storageStatus').textContent=ok?'Experiência salva neste navegador.':'Armazenamento indisponível: exporte a experiência antes de sair.';}
const policyKeys = [
  "strong/aggressive",
  "strong/defensive",
  "weak/aggressive",
  "weak/defensive",
  "tactical/aggressive",
  "tactical/defensive",
];
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
  String(s).replace(
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
  if (!policy) return;
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
  return [...policyKeys].sort(
    (a, b) =>
      (Number(memory.q[b]) || 0) - (Number(memory.q[a]) || 0) ||
      Math.random() - 0.5,
  )[0];
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
let actionMode:"move"|"attack"="move";
let localSide:Side='br';
function myTurn(){return $('gameMode').value==='remote'?game.turn===localSide:game.turn==='br';}
function saveSession(){if(busy)return;browserStore.write('monte-castelo-session-v1',JSON.stringify({schema:1,game,localSide,mode:$('gameMode').value,ai:$('ai').value,stance:$('stance').value,rewarded,trainedUsed,trainedContext}));}
function loadSession():boolean{try{const value=JSON.parse(browserStore.read('monte-castelo-session-v1')||'null');if(value?.schema!==1||!validGame(value.game)||!['br','de'].includes(value.localSide)||!['computer','remote'].includes(value.mode))return false;game=value.game;localSide=value.localSide;$('gameMode').value=value.mode;if(['strong','weak','tactical','learning','trained'].includes(value.ai))$('ai').value=value.ai;if(['aggressive','defensive'].includes(value.stance))$('stance').value=value.stance;rewarded=!!value.rewarded;trainedUsed=!!value.trainedUsed;const ctx=value.trainedContext;if(ctx&&Object.values(ctx).every((p:any)=>p&&typeof p.state==='string'&&Number.isInteger(p.action)&&p.action>=0&&p.action<6&&Number.isFinite(p.utility)))trainedContext=ctx;return true;}catch{return false;}}
function forestGlyph(x:number,y:number):string{return `<g pointer-events="none">${[[-17,3,.8],[-7,-8,1],[8,-9,.9],[18,6,.8],[0,9,1]].map(([dx,dy,size])=>`<g transform="translate(${x+dx},${y+dy}) scale(${size})"><path d="M0 -13L-7 -2H-4L-9 5H9L4 -2H7Z" fill="#597c68" stroke="#405d4d" stroke-width=".7"/><path d="M0 4V10" stroke="#836d4d" stroke-width="2.5"/></g>`).join('')}</g>`;}
function fortGlyph(x:number,y:number):string{return `<g pointer-events="none"><path d="M${x-29} ${y+18}v10h58v-10M${x-29} ${y-18}v-10h58v10" stroke="#786e59" stroke-width="5" fill="none"/><path d="M${x-20} ${y+26}v-6m12 6v-6m12 6v-6m12 6v-6" stroke="#ede4ce" stroke-width="2"/><rect x="${x-8}" y="${y-32}" width="16" height="5" fill="#4b4a43"/></g>`;}
function render() {
  const u = game.units.find((v) => v.id === selected),
    reach =
      u && u.side === game.turn && myTurn() && !busy && actionMode==='move'
        ? reachable(game, u)
        : new Map();
  let svg =
    '<defs><pattern id="paper" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".5" fill="#4e633a" opacity=".16"/></pattern></defs><rect width="960" height="690" fill="#f2edde"/><rect width="960" height="690" fill="url(#paper)"/><path d="M40 540 Q200 520 300 420 T620 135 Q700 60 840 45" fill="none" stroke="#7e8b66" stroke-width="110" opacity=".15"/><text x="795" y="615" class="maplabel">N ↑</text><text x="650" y="650" class="maplabel">Mapa tático esquemático · sem escala</text>';
  for (let r = 0; r < ROWS; r++)
    for (let q = 0; q < COLS; q++) {
      const t = terrain(q, r),
        { x, y } = center(q, r);
      svg += `<g><polygon class="hex ${reach.has(key(q, r)) ? "reach" : ""}" data-q="${q}" data-r="${r}" points="${hex(q, r)}" fill="${{ hill: "#d3c5a8", forest: "#c4d4c4", road: "#e6c998", plain: ["", "#f0ead8", "#e6deca", "#dcd1ba", "#cdbf9f"][elevation(q, r)] }[t]}"/>${t === "forest" ? forestGlyph(x,y) : ""}${fortification(q,r)?fortGlyph(x,y):""}${t === "hill" ? `<path d="M${x - 22} ${y + 12}q22 -38 44 0m-37 0q15 -26 30 0" stroke="#69754e" fill="none" pointer-events="none"/>` : ""}<text x="${x - 25}" y="${y + 27}" font-size="7" fill="#495c3d88" pointer-events="none">${q + 1}${r + 1} · ↑${elevation(q, r)}</text></g>`;
    }
  for (const o of objectives) {
    const { x, y } = center(o.q, o.r);
    svg += `<circle cx="${x}" cy="${y}" r="34" fill="none" stroke="#b18421" stroke-width="3" stroke-dasharray="5 3" pointer-events="none"/><text x="${x+28}" y="${y-22}" font-size="23" fill="#a16d0d" pointer-events="none">⚑</text><text x="${x}" y="${y - 39}" text-anchor="middle" class="maplabel">${o.name} · ${o.points}★</text>`;
  }
  svg +=
    '<text x="95" y="595" class="maplabel">FEB · eixo de aproximação a partir de Gaggio Montano</text><text x="430" y="25" class="maplabel">Linha defensiva alemã · Apeninos setentrionais</text>';
  for (const v of game.units) {
    const { x, y } = center(v.q, v.r),
      target = u && actionMode==='attack' && u.side===game.turn && canAttack(u, v) && !busy && myTurn();
    svg += `<g class="unit ${selected === v.id ? "selected" : ""} ${target ? "target" : ""}" data-id="${v.id}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="${esc(v.name)}, ${v.side === "br" ? "FEB" : "alemã"}, ${v.hp} de resistência, ataque ${v.atk}, defesa ${v.def}"><title>${esc(v.name)} · A${v.atk} D${v.def} · ${v.hp} PV</title><rect class="counter" x="-25" y="-25" width="50" height="50" rx="1" fill="${v.side === "br" ? "#226ba4" : "#30363d"}"/><rect class="symbol" x="-14" y="-13" width="28" height="18"/> <g class="symbol">${symbol(v)}</g><text x="0" y="-17" text-anchor="middle" font-size="7">${v.side === "br" ? "FEB" : "DE"} ${v.hp}/3</text><text x="-21" y="21" style="font-size:9px">A${v.atk} D${v.def}</text><text x="8" y="21" style="font-size:9px">M${v.mp}</text>${Array.from({ length: v.hp }, (_, i) => `<circle cx="${-7 + i * 7}" cy="10" r="2" fill="#eed788"/>`).join("")}${v.hp < 3 ? `<g><circle cx="23" cy="-23" r="10" fill="#b34332" stroke="#fff"/><text x="23" y="-20" text-anchor="middle" style="font-size:10px">−${3 - v.hp}</text></g>` : ""}${v.fired ? '<path d="M-22 -22L22 22" stroke="#e5d9bb" opacity=".4"/>' : ""}</g>`;
  }
  $("map").innerHTML = svg;
  $("time").textContent = clock(game.round);
  const actionable=u&&u.side===game.turn&&myTurn()&&!busy&&!game.winner;
  $('actionMove').disabled=!actionable;$('actionAttack').disabled=!actionable||!!u?.fired;
  $('actionMove').textContent=`Mover${actionable?' · '+u.mp+' PM':''}`;$('actionAttack').textContent=`Atacar${actionable?' · alcance '+(u.type==='artillery'?2:1):''}`;
  $('actionMove').className=actionMode==='move'?'active move':'';$('actionAttack').className=actionMode==='attack'?'active attack':'';
  $('actionHint').textContent=actionable?(actionMode==='move'?`${u.name}: toque em um hexágono AZUL para mover.`:`${u.name}: toque em um inimigo com borda VERMELHA para atacar.`):'1. Selecione sua peça. 2. Escolha Mover ou Atacar. 3. Toque no destino ou alvo.';
  $('goals').innerHTML=objectives.map((o,i)=>{const held=game.units.find(v=>v.q===o.q&&v.r===o.r);return `<button data-goal="${i}" class="${held?'held-'+held.side:''}">⚑ ${o.name} · ${o.points} ponto${o.points>1?'s':''}<small>${held?(held.side==='br'?'FEB · seu controle':'Defesa alemã'):'Livre · ocupe para pontuar'} · localizar ↗</small></button>`;}).join('');
  $("round").textContent = `${Math.min(game.round, LIMIT)} / ${LIMIT}`;
  $("score").textContent = `${game.score} / 8`;
  $("end").disabled = busy || !!game.winner || !myTurn();
  $("shareTurn").disabled=$("gameMode").value!=="remote"||game.turn===localSide||!!game.winner;
  $("yourSide").textContent=$("gameMode").value==='remote'?(localSide==='br'?'VOCÊ COMANDA A FEB':'VOCÊ COMANDA A DEFESA ALEMÃ'):'VOCÊ COMANDA A FEB';
  $("ai").disabled = busy || $("gameMode").value==='remote';
  $("stance").disabled = busy || $("gameMode").value==='remote';
  $("phase").textContent = game.winner
    ? game.winner === "br"
      ? "Monte Castelo é nosso!"
      : "A defesa manteve as alturas."
    : busy
      ? "O inimigo está manobrando…"
      : !myTurn()?"Envie o turno ao seu oponente":"Sua vez de avançar";
  $("brief").textContent = game.winner
    ? "Operação encerrada. Inicie outra para experimentar uma nova estratégia."
    : "Ocupe elevações: acumule 8 pontos até o fim da 10ª rodada.";
  $("log").innerHTML = game.log
    .slice(0, 7)
    .map((l) => `<p>${esc(l)}</p>`)
    .join("");
  $("unitName").textContent = u ? u.name : "A cobra vai fumar.";
  $("unitInfo").innerHTML = u
    ? `<p>${u.side === "br" ? "Força Expedicionária Brasileira" : "Defesa alemã"} · ${{ infantry: "Infantaria", armor: "Apoio blindado", artillery: "Artilharia" }[u.type]}</p><div class="statrow"><span>Ataque ${u.atk}</span><span>Defesa ${u.def}</span><span>PV ${u.hp}/3</span><span>Movimento ${u.mp}</span><span>Altitude ↑${elevation(u.q, u.r)}</span><span>Fortificação +${fortification(u.q,u.r)}</span><span>Alcance ${u.type === "artillery" ? 2 : 1}</span><span>Cobertura ${["hill", "forest"].includes(terrain(u.q, u.r)) ? "+1" : "0"}</span></div><p>${u.fired ? "Ação concluída · já atacou neste turno." : u.mp === 0 ? "Sem movimento · ainda pode atacar um inimigo ao alcance." : "Pronta para agir · pode mover e depois atacar."} Dano acumulado: ${3 - u.hp}. Potência atual: ${u.atk - (3 - u.hp) * 0.5}. Defender acima do atacante dá +1 adicional.</p>`
    : "<p>Selecione uma peça azul. Escolha Mover e toque num hexágono azul, ou Atacar e toque num inimigo vermelho.</p><p>A = ataque · D = defesa · M = movimento restante. Pontos dourados = resistência. Selo vermelho = dano acumulado. Toque duas vezes para ampliar.</p>";
  $("learningStatus").textContent =
    `IA especial: ${trained.episodes} partidas de experiência · ${Object.keys(trained.q).length} situações. Aprendiz simples: ${memory.games} partidas concluídas · experiência local${policy ? " · " + policy.replace("/", " / ") : ""}.`;
  if (game.winner && !rewarded) {
    rewarded = true;
    if(trainedUsed){finishLearningEpisode(trained,trainedContext,game);saveTrained();}
    if (episode.length || policy) {
      learn(game.winner === "de" ? 8 : -8, true);
      memory.games++;
      persist();
      $("learningStatus").textContent =
        `Aprendiz: ${memory.games} partidas concluídas · experiência salva neste navegador.`;
    }
    show(
      `<span class="eyebrow">FIM DA OPERAÇÃO</span><h2>${game.winner === "br" ? "A cobra fumou!" : "As alturas resistiram."}</h2><p>${game.winner === "br" ? "A FEB alcançou seu objetivo tático." : "A defesa alemã impediu a FEB de atingir o objetivo no tempo disponível."}</p><p>${game.score} pontos · rodada ${Math.min(game.round, 10)}. Feche esta janela e escolha “Nova operação” para jogar novamente.</p>`,
    );
  }
  saveSession();
}
function show(html) {
  $("modalBody").innerHTML = html;
  if (!$("modal").open) $("modal").showModal();
}
function inspect(u) {
  show(
    `<h2>${esc(u.name)}</h2><div class="bigpiece">${u.type === "infantry" ? "☒" : u.type === "armor" ? "▱" : "●"}<small>A${u.atk} · D${u.def} · M${u.mp}<br>${u.hp}/3 PV · ${3 - u.hp} dano(s)</small></div><p>Ataque ${u.atk} · Defesa ${u.def} · Resistência ${u.hp}/3 · Dano acumulado ${3 - u.hp} · Alcance ${u.type === "artillery" ? 2 : 1} hexágono(s).</p><p>As peças representam agrupamentos abstratos, não efetivos exatos ou uma ordem de batalha documental.</p>`,
  );
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
    if(actionMode!=='attack'){$('actionHint').textContent='Para atacar, escolha ATACAR e depois toque no inimigo vermelho.';return;}
    if(!canAttack(actor,u)){$('actionHint').textContent='Alvo fora do alcance ou sem linha de visão. Reposicione sua peça.';return;}
    attack(game, actor.id, u.id);
    render();
    return;
  }
  selected = id;
  actionMode="move";
  render();
}
$("map").addEventListener("click", (e) => {
  const piece = e.target.closest("[data-id]");
  if (piece) {
    selectUnit(piece.dataset.id);
    return;
  }
  const cell = e.target.closest("[data-q]");
  if (cell && !busy && selected && myTurn() && actionMode==='move') {
    move(game, selected, +cell.dataset.q, +cell.dataset.r);
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
  if (busy || game.winner || !myTurn()) return;
  if($('gameMode').value==='remote'){selected=null;endTurn(game);render();if(!game.winner)shareTurn();return;}
  busy = true;
  const token = generation;
  selected = null;
  endTurn(game);
  render();
  const mode = $("ai").value;
  if (mode === "learning") policy = choosePolicy();
  else policy = null;
  let [chosen, stance] = policy
    ? policy.split("/")
    : [mode, $("stance").value];
  if(mode==='trained'){trainedUsed=true;const learned=beginLearningTurn(trained,trainedContext,game,'de');chosen=learned.strategy;stance=learned.stance;saveTrained();}
  const before =
      game.units.filter((u) => u.side === "br").reduce((n, u) => n + u.hp, 0) -
      game.units.filter((u) => u.side === "de").reduce((n, u) => n + u.hp, 0),
    oldScore = game.score;
  for (const id of game.units.filter((u) => u.side === "de").map((u) => u.id)) {
    await pause();
    if (token !== generation) return;
    const action = aiAction(game, id, chosen, stance);
    if (action) attack(game, action.attacker, action.target);
    render();
    if (game.winner) break;
  }
  if (!game.winner) endTurn(game);
  const after =
    game.units.filter((u) => u.side === "br").reduce((n, u) => n + u.hp, 0) -
    game.units.filter((u) => u.side === "de").reduce((n, u) => n + u.hp, 0);
  if (mode === "learning" && !rewarded)
    learn(before - after - (game.score - oldScore));
  busy = false;
  if(mode==='trained')saveTrained();
  render();
};
$("new").onclick = () => {
  if (
    !game.winner &&
    !confirm(
      "Recomeçar esta operação? A experiência já aprendida será mantida.",
    )
  )
    return;
  generation++;
  game = createGame();
  localSide='br';
  selected = null;
  busy = false;
  rewarded = false;
  episode = [];
  policy = null;
  trainedContext={};trainedUsed=false;
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
$("rules").onclick = () =>
  show(
    `<span class="eyebrow">MANUAL DE CAMPANHA</span><h2>Tomar as alturas</h2><p>Você comanda a FEB, em azul. O computador comanda a defesa alemã, em areia. Uma partida tem no máximo 10 rodadas.</p><ol><li><b>Mova:</b> selecione a peça, escolha Mover e toque no destino azul. Campo e estrada custam 1 PM; mata, 2 PM. Some 1 PM por nível de subida. Descer não tem custo extra. Pode mover em etapas. Não é possível atravessar peças.</li><li><b>Ataque:</b> selecione a peça, escolha Atacar e toque no inimigo marcado em vermelho. Infantaria e apoio blindado alcançam 1 hexágono; artilharia, 2. Um ataque por turno, com linha de visão: mata e elevações intermediárias mais altas bloqueiam o tiro.</li><li><b>Combate:</b> ataque + dado de 1 a 6 − defesa − cobertura − 0,5 por PV perdido pelo atacante. Mata, objetivo elevado ou fortificação dão +1 de cobertura, sem acumular entre si. As posições preparadas de Monte Castelo e do esporão são desenhadas como abrigos e trincheiras; suas localizações são esquemáticas. Um defensor acima do atacante recebe mais +1. Os números ↑1 a ↑4 indicam níveis relativos de altitude. Resultado ≥5 causa 2 danos; ≥1 causa 1; ≤0 falha e causa 1 dano de contra-ataque ao atacante se adjacente. Cada peça começa com 3 PV. Atacar zera seus PM.</li><li><b>Vitória:</b> ao fim de cada turno alemão, uma peça brasileira sobre Monte Castelo rende 2 pontos; cada objetivo secundário rende 1. Acumule 8 pontos ou elimine o inimigo. A defesa vence se eliminar a FEB ou impedir os 8 pontos até o fim da rodada 10.</li></ol><h2>21 de fevereiro de 1945</h2><p>A conquista de Monte Castelo, nos Apeninos setentrionais, foi um marco da Força Expedicionária Brasileira na campanha da Itália. Depois das tentativas frustradas de novembro e dezembro de 1944, o ataque de fevereiro de 1945 ocorreu no contexto da Operação Encore, em coordenação com a 10ª Divisão de Montanha dos EUA no setor de Monte Belvedere. O general Mascarenhas de Moraes comandava a FEB; a defesa do setor estava ligada à 232ª Divisão de Infantaria do Heer (Exército regular alemão). As fontes consultadas para este cenário não identificam unidades Waffen-SS na defesa de Monte Castelo; o jogo representa tropas do Heer.</p><p>O cenário representa o avanço brasileiro do setor de Gaggio Montano contra posições elevadas. Elevações favorecem a defesa, matas dificultam a progressão e a artilharia dá apoio a distância. O limite de rodadas representa a pressão por coordenação e tomada das posições.</p><p><b>Limites históricos:</b> este tabuleiro é esquemático e não usa levantamento topográfico. “Esporão ocidental” e “Crista oriental” são objetivos de jogo, não posições históricas verificadas. Efetivos, distâncias, estradas e posições foram simplificados para uma partida curta; as unidades não reproduzem uma ordem de batalha exata.</p><h3>Horário, observação e clima</h3><p>O relógio do cenário começa às 06:00 e avança 72 minutos por rodada, cobrindo o período até 18:00. A síntese em inglês da batalha situa o ataque principal às 06:00; a síntese em português diz “ao amanhecer”. Ambas registram a chegada ao cume às 17:30 e a concentração de artilharia entre 16:00 e 17:00. Na rodada 10 (16:48), a artilharia brasileira recebe +1 de ataque: uma abstração dessa concentração. Os turnos não reproduzem uma cronologia exata.</p><p>A posição de observação elevada lembrada na pergunta corresponde especialmente à crista de Riva, a sudoeste de Monte Belvedere. Dali os alemães observavam as aproximações à encosta sul de Belvedere e corrigiam o fogo de artilharia. O 1º Batalhão do 86º Regimento de Infantaria de Montanha, com a Companhia F, escalou de surpresa as escarpas na noite de 18 para 19 de fevereiro, tomou os postos e resistiu aos contra-ataques. A 10ª Divisão de Montanha atacou Belvedere–Gorgolesco em seguida. Isso integrou a ofensiva coordenada com a FEB; não é um segundo monte a ser tomado neste tabuleiro. Monte della Torraccia continuou sendo disputado durante a operação.</p><p><b>Clima do cenário:</b> frio de fim de inverno e visibilidade diurna boa são hipóteses de jogo, não uma série meteorológica medida. As fontes consultadas descrevem chuva e lama nos ataques de novembro e dezembro; isso não comprova o mesmo tempo no ataque final de fevereiro. Não foi localizado um boletim meteorológico diário de 21 de fevereiro. Por isso não simulamos chuva, neve ou temperaturas inventadas. As primeiras duas rodadas usam a mesma visibilidade das demais; o relógio não implica uma medição de luminosidade.</p><h3>Fontes consultadas</h3><p><a href="https://pt.wikipedia.org/wiki/Batalha_de_Monte_Castelo" target="_blank" rel="noopener">Batalha de Monte Castelo · síntese em português</a><br><a href="https://en.wikipedia.org/wiki/Battle_of_Monte_Castello" target="_blank" rel="noopener">Battle of Monte Castello · cronologia em inglês</a><br><a href="https://en.wikipedia.org/wiki/Operation_Encore" target="_blank" rel="noopener">Operation Encore · Riva Ridge e Belvedere</a></p><h3>Bibliografia para aprofundar</h3><p><a href="https://www.fgv.br/cpdoc/acervo/dicionarios/verbete-tematico/forca-expedicionaria-brasileira-feb" target="_blank" rel="noopener">FGV CPDOC · Força Expedicionária Brasileira</a><br><a href="https://history.army.mil/html/books/006/6-4-1/index.html" target="_blank" rel="noopener">U.S. Army Center of Military History · Cassino to the Alps</a></p><p>As fontes são indicadas para consulta. Foram consultadas as sínteses da batalha em português e inglês e de Operation Encore. O mapa tático não foi validado contra cartografia original; não é uma reprodução geográfica.</p><h3>Comandantes do computador</h3><p>Caçador prioriza maior ataque, desempata por distância. Oportunista prioriza menor defesa, desempata por distância. A postura agressiva aproxima; a defensiva valoriza cobertura e objetivos. Estado-maior avalia movimentos legais, ameaças, apoio e objetivos; calcula sem busca longa. Aprendiz usa Q-learning simples para escolher entre seis combinações de estratégia/postura, com exploração de 20%, recompensa por danos e contenção de pontos, e bônus por resultado final. Ele aprende a escolher políticas, não movimentos individuais. A experiência fica no armazenamento local, sem servidor; apagar os dados do navegador apaga o aprendizado.</p>`,
  );
function narrative() {
  show(
    `<span class="eyebrow">APENINOS, ITÁLIA · 21 DE FEVEREIRO DE 1945</span><img class="narrative-logo" src="${gameLogo}" alt="Emblema de Monte Castelo Vibed: cobra fumando sobre montanhas"><h2>Monte Castelo Vibed</h2><h3>Antes de o sol alcançar as alturas…</h3><p>À sua frente, Monte Castelo. Depois dos ataques frustrados do ano anterior, os pracinhas da Força Expedicionária Brasileira voltam a avançar. A encosta exposta favorece os defensores; cada dobra do terreno pode oferecer proteção ou esconder uma posição inimiga.</p><p>No setor vizinho, a ofensiva americana contra a crista de Riva e Monte Belvedere integra o esforço aliado. Agora, cabe à FEB conquistar sua parte das alturas.</p><p><b>Sua missão:</b> conduza as peças azuis, use a cobertura e a artilharia e acumule 8 pontos nas elevações em até 10 rodadas. Planeje a subida: a altura custa movimento e protege o defensor.</p><p class="muted">Narrativa ambientada em fatos históricos. Tabuleiro, forças e duração dos turnos são abstrações. Horário baseado nas sínteses da batalha; clima diário e cartografia ainda sem verificação primária.</p><button id="begin">Assumir o comando →</button>`,
  );
  $("begin").onclick = () => $("modal").close();
}
let resumed=loadSession(),received=false;
try{if(location.hash.startsWith('#turn=')){game=decodeTurn(location.hash.slice(6));localSide=game.turn;$('gameMode').value='remote';rewarded=false;trainedUsed=false;trainedContext={};resumed=true;received=true;history.replaceState(null,'',location.pathname+location.search);}}catch{show('<h2>Turno não reconhecido</h2><p>O link recebido está incompleto ou é incompatível.</p>');}
render();fitMap();
if(resumed){show(`<span class="eyebrow">${received?'TURNO RECEBIDO':'OPERAÇÃO SALVA'}</span><h2>Monte Castelo espera por você.</h2><p>Rodada ${Math.min(game.round,10)} · ${game.score} pontos. ${$('gameMode').value==='remote'?(localSide==='br'?'Você comanda a FEB.':'Você comanda a defesa alemã.'):'Sua experiência e sua operação foram mantidas neste navegador.'}</p><button id="begin">Retomar operação →</button>`);$('begin').onclick=()=>$('modal').close();}else narrative();

$("credits").onclick = () =>
  show(
    `<span class="eyebrow">AUTORIA & LICENÇA</span><img class="narrative-logo" src="${gameLogo}" alt="Emblema original do jogo inspirado na FEB"><h2>Monte Castelo Vibed</h2><div class="ludes-credit"><img src="${ludesLogo}" alt="Logo oficial do LUDES" width="300" height="76"><a href="https://ludes.cos.ufrj.br/" target="_blank" rel="noopener">LUDES · UFRJ</a></div><p><b>Autoria e concepção:</b> Geraldo Xexéo (xexeo).<br><b>Desenvolvimento:</b> realizado com assistência de IA, a partir das orientações do autor.</p><p>Copyright © 2026 Geraldo Xexéo (xexeo).</p><p class="muted">Versão ${release.version} · ${release.displayDate} · Brasília</p><h3>CC BY-NC-SA 4.0</h3><p>Creative Commons Atribuição–NãoComercial–CompartilhaIgual 4.0 Internacional. Você pode compartilhar e adaptar este trabalho com atribuição, para fins não comerciais e distribuindo adaptações sob a mesma licença.</p><p><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br" target="_blank" rel="noopener">Resumo oficial da licença</a> · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pt" target="_blank" rel="noopener">Termos oficiais em português</a></p><details><summary>Texto integral da licença (disponível offline)</summary><pre class="license-text">${esc(licenseText)}</pre></details><p class="muted">O emblema do jogo é uma criação com assistência de IA inspirada na cobra fumando da FEB; não é um distintivo oficial. O logo LUDES é a imagem institucional fornecida pelo autor. A licença do jogo não concede direitos sobre marcas e logotipos institucionais.</p>`,
  );

$('memory').onclick=()=>{show(`<span class="eyebrow">EXPERIÊNCIA DO COMANDANTE</span><h2>Uma IA que leva suas lições adiante</h2><p>${trained.episodes} partidas de experiência · ${trained.updates} atualizações · ${Object.keys(trained.q).length} situações aprendidas.</p><p>A IA especial já vem treinada em ${pretrained.episodes} partidas de autojogo. Aprende a escolher estratégia e postura conforme fase, forças, pontos e ocupação. Continua aprendendo aqui; a experiência fica neste navegador. Não há sincronização automática entre aparelhos.</p><button id="exportMemory">Exportar experiência</button><p><label for="importMemory">Importar experiência salva</label><input id="importMemory" type="file" accept="application/json,.json"></p><p id="importResult" aria-live="polite"></p>`);$('exportMemory').onclick=()=>{const blob=new Blob([JSON.stringify(trained,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='monte-castelo-vibed-experiencia.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};$('importMemory').onchange=async e=>{try{const file=e.target.files[0];if(!file||file.size>2000000)throw new Error('Arquivo ausente ou muito grande.');const data=JSON.parse(await file.text());if(!validLearning(data))throw new Error('Arquivo de experiência incompatível.');trained=data;trainedContext={};saveTrained();$('importResult').textContent='Experiência importada. Será usada no próximo turno.';}catch(err){$('importResult').textContent=err instanceof Error?err.message:'Não foi possível importar.';}};};

function downloadTurn(){const data=JSON.stringify({schema:1,game}),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`monte-castelo-turno-${game.round}-${game.turn}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function shareTurn(){const url=publicTurnLink(game,location.href);show(`<span class="eyebrow">HUMANO × HUMANO · TURNO ASSÍNCRONO</span><h2>Passe o comando.</h2><p>O próximo turno é ${game.turn==='br'?'da FEB':'da defesa alemã'}. Envie o link ou arquivo ao seu oponente; ele abre o jogo e assume esse lado. Quando terminar, ele envia o próximo turno de volta.</p>${url?`<a class="share-link" href="https://wa.me/?text=${encodeURIComponent('Monte Castelo Vibed · rodada '+game.round+' · seu turno! '+url)}" target="_blank" rel="noopener">Enviar pelo WhatsApp ↗</a><button id="copyTurn">Copiar link do turno</button>`:'<p>Esta cópia está aberta offline ou em endereço local. Use o arquivo de turno; para enviar um link, abra a versão publicada no GitHub Pages.</p>'}<button id="downloadTurn">Baixar arquivo do turno</button><p id="shareStatus" aria-live="polite"></p><p class="muted">Modo assíncrono, sem servidor de partida. Cada envio é uma fotografia do estado; continuem sempre a partir do último turno recebido.</p>`);$('downloadTurn').onclick=downloadTurn;if(url)$('copyTurn').onclick=async()=>{try{await navigator.clipboard.writeText(url);$('shareStatus').textContent='Link copiado.';}catch{$('shareStatus').textContent='Use o botão do WhatsApp ou baixe o turno.';}};}
$('shareTurn').onclick=shareTurn;
$('gameMode').onchange=()=>{generation++;game=createGame();localSide='br';busy=false;selected=null;rewarded=false;trainedUsed=false;trainedContext={};render();narrative();};
$('ai').onchange=()=>{saveSession();render();};$('stance').onchange=saveSession;
$('loadTurn').onchange=async e=>{try{const file=e.target.files[0];if(!file||file.size>50000)throw new Error('Arquivo inválido.');const value=JSON.parse(await file.text());if(value.schema!==1||!validGame(value.game))throw new Error('Turno incompatível.');generation++;game=value.game;localSide=game.turn;$('gameMode').value='remote';busy=false;selected=null;rewarded=false;trainedUsed=false;trainedContext={};render();show(`<h2>Turno recebido</h2><p>Rodada ${game.round}. Você comanda ${localSide==='br'?'a FEB':'a defesa alemã'}.</p>`);}catch(err){show(`<h2>Não foi possível abrir o turno</h2><p>${esc(err instanceof Error?err.message:'Arquivo inválido.')}</p>`);}finally{e.target.value='';}};

$('actionMove').onclick=()=>{actionMode='move';render();};$('actionAttack').onclick=()=>{actionMode='attack';render();};
$('goals').onclick=e=>{const button=e.target.closest('[data-goal]');if(!button)return;const goal=objectives[Number(button.dataset.goal)],pos=center(goal.q,goal.r);setZoom(Math.max(zoom,1.1));$('viewport').scrollLeft=pos.x*zoom-$('viewport').clientWidth/2;$('viewport').scrollTop=pos.y*zoom-$('viewport').clientHeight/2;};

$('map').addEventListener('dblclick',e=>{e.preventDefault();const rect=$('map').getBoundingClientRect(),x=(e.clientX-rect.left)*960/rect.width,y=(e.clientY-rect.top)*690/rect.height;const unit=game.units.find(u=>{const p=center(u.q,u.r);return Math.abs(p.x-x)<28&&Math.abs(p.y-y)<28;});if(unit)inspect(unit);});

$("briefing").onclick=narrative;
