// Explicit bilingual templates. Ordered parameters use {0}, {1}, … .
export const messages = {
 "movement.short": {"pt": " · mínimo 1 hex", "en": " · minimum 1 hex"},
 "movement.minimum": {"pt": "Deslocamento mínimo: com o movimento completo, toda peça pode entrar num vizinho livre de mesmo nível, descendo ou subindo um nível. Paga o custo nominal ou todo o seu máximo de PM, o que for menor. Exemplo com custo nominal de 4 PM; infantaria de 3 PM gasta 3, destacamento de 2 gasta 2 e artilharia de 1 gasta 1. A redução usa o máximo da peça, nunca o saldo: se já gastou PM, pode precisar esperar o próximo turno. Subir dois ou mais níveis conserva o custo integral e pode ser impossível. Ocupação, reação, reorganização e comando continuam valendo. A correção também vale para partidas antigas sem essa opção registrada.", "en": "Minimum movement: with its full allowance, every counter can enter a free neighboring hex at the same level, downhill, or one level uphill. Pay the nominal cost or the counter’s full maximum MP, whichever is lower. For example, with a nominal cost of 4 MP; infantry with 3 MP spends 3, a detachment with 2 spends 2, and artillery with 1 spends 1. The reduction uses maximum MP, never the remaining balance: after spending MP, a counter may have to wait until its next turn. Climbing two or more levels keeps its full cost and may be impossible. Occupation, reactions, reorganization, and command still apply. This correction also applies to old saves without the option recorded."},
 "movement.legacy": {"pt": "Este arquivo desativou explicitamente o deslocamento mínimo. Passos acima do máximo de PM são intransponíveis; essa configuração não é o padrão do jogo.", "en": "This file explicitly disabled minimum movement. Steps exceeding maximum MP are impassable; this is not the game’s default setting."},

 "scale.locked": {"pt": "O comando deste batalhão já está comprometido neste turno. Escolha a companhia indicada em Ordens ou outro batalhão. Peças esmaecidas não podem receber novas ordens.", "en": "This battalion’s command is already committed this turn. Choose the company listed under Orders or another battalion. Dimmed counters cannot receive new orders."},
  "scale.label": {"pt": "ESCALA DAS PEÇAS", "en": "COUNTER SCALE"},
  "scale.battalion": {"pt": "Batalhões · jogo original", "en": "Battalions · original game"},
  "scale.company": {"pt": "Companhias · nove companhias FEB", "en": "Companies · nine FEB companies"},
  "scale.available": {"pt": "todos os batalhões disponíveis", "en": "all battalions available"},
  "scale.confirm": {"pt": "Trocar a escala inicia outra partida e substitui a operação atual. Continuar?", "en": "Changing scale starts another game and replaces the current operation. Continue?"},
  "scale.battalionStatus": {"pt": "Batalhões: regras originais, dez peças.", "en": "Battalions: original rules, ten counters."},
  "scale.status": {"pt": "Companhias · uma companhia por batalhão/turno. Ordens: {0}. Reação ou reorganização também compromete esse comando.", "en": "Companies · one company per battalion/turn. Orders: {0}. A reaction or reorganization also commits that command."},
  "scale.battalionRules": {"pt": "<p class=\"scale-notice\"><b>Escala: batalhão.</b> Dez peças, regras originais. Você pode iniciar a opção companhia no seletor de escala.</p>", "en": "<p class=\"scale-notice\"><b>Scale: battalion.</b> Ten counters, original rules. You can start the company option using the scale selector.</p>"},
  "scale.companyRules": {"pt": "<section class=\"scale-notice\"><h3>Escala: companhia · o mesmo jogo</h3><p>Nove companhias FEB, três por batalhão, mais apoio e fogos; cinco peças alemãs. Dezesseis peças ao todo. A/I significa companhia A do I batalhão. A/B/C são etiquetas de cenário, não numeração histórica confirmada. <b>I indica companhia; II, batalhão ou grupo.</b> A terceira companhia começa na retaguarda, já no mapa, sem chegada temporizada.</p><p><b>Comando:</b> só uma companhia por batalhão brasileiro recebe ordens a cada turno. Selecionar não gasta comando; o primeiro movimento ou ataque legal escolhe a companhia. Ela pode mover e atirar em qualquer ordem. As outras duas ainda defendem. Há uma reação por batalhão entre turnos; reação/reorganização compromete o comando do batalhão no próximo turno, mesmo se a peça sair de combate. Apoio e fogos agem separadamente; destacamentos alemães são independentes.</p><p>Companhias usam A2/D2/M3 e 3 PV de coesão; reserva alemã reduzida, A1/D1. Os demais valores aparecem na inspeção e em Forças. Não são efetivos humanos iguais. Os apoios continuam no mapa para compartilhar o mesmo combate e controles. O prazo, mapa, objetivos e condições de vitória são os mesmos. Experiência e modelos são separados por escala.</p></section>", "en": "<section class=\"scale-notice\"><h3>Scale: company · the same game</h3><p>Nine FEB companies, three per battalion, plus support and artillery; five German counters. Sixteen counters in total. A/I means company A of battalion I. A/B/C are scenario labels, not verified historical company numbers. <b>I indicates a company; II, a battalion or artillery group.</b> The third company starts behind the others, already on the map, without timed arrival.</p><p><b>Command:</b> only one company per Brazilian battalion receives orders each turn. Selecting does not spend command; its first legal move or attack chooses the company. It may move and fire in either order. The other two still defend. Each battalion has one reaction between turns; a reaction/reorganization commits its next-turn command even if that counter is removed. Support and artillery act separately; German detachments are independent.</p><p>Companies use A2/D2/M3 and 3 cohesion HP; the reduced German reserve uses A1/D1. Other values appear in inspection and Forces. They do not represent equal human strengths. Support stays on the map to share the same combat and controls. The deadline, map, objectives, and victory conditions are the same. Experience and models are separate by scale.</p></section>"},
  "appearance.group.opacity": {
    "pt": "Opacidades",
    "en": "Opacities"
  },
  "appearance.group.lines": {
    "pt": "Espessuras",
    "en": "Line widths"
  },
  "appearance.group.type": {
    "pt": "Fontes e tamanhos",
    "en": "Fonts and sizes"
  },
  "appearance.group.combat": {
    "pt": "Efeitos de combate",
    "en": "Combat effects"
  },
  "appearance.group.actions": {
    "pt": "Objetivos e ações",
    "en": "Objectives and actions"
  },
  "appearance.group.terrain": {
    "pt": "Terreno e mapa",
    "en": "Terrain and map"
  },
  "appearance.group.units": {
    "pt": "Peças e estados",
    "en": "Counters and conditions"
  },
  "appearance.group.page": {
    "pt": "Página, painéis e texto",
    "en": "Page, panels, and text"
  },
  "appearance.note": {
    "pt": "As letras FEB/DE, símbolos e formas continuam identificando ações. Ajustes livres podem reduzir o contraste; use Restaurar padrão A para recuperar a proposta recomendada. Terreno de inverno é uma opção gráfica, sem criar neve, lama ou regras novas.",
    "en": "FEB/DE labels, symbols, and shapes still identify actions. Custom settings can reduce contrast; use Restore preset A to recover the recommended proposal. Winter terrain is a visual option and adds no snow, mud, or new rules."
  },
  "appearance.hex": {
    "pt": "Cor hexadecimal · {0}",
    "en": "Hex color · {0}"
  },
  "appearance.font": {
    "pt": "Fonte offline",
    "en": "Offline font"
  },
  "appearance.invalid": {
    "pt": "Arquivo de aparência inválido. As preferências anteriores foram preservadas.",
    "en": "Invalid appearance file. Your previous preferences were preserved."
  },
  "appearance.storage": {
    "pt": "Preferências aplicadas; armazenamento indisponível. Exporte para guardar.",
    "en": "Preferences applied; storage unavailable. Export them to keep a copy."
  },
  "appearance.saved": {
    "pt": "Preferências aplicadas. As alterações ficam neste navegador.",
    "en": "Preferences applied. Changes stay in this browser."
  },
  "appearance.import": {
    "pt": "Importar aparência",
    "en": "Import appearance"
  },
  "appearance.export": {
    "pt": "Exportar aparência",
    "en": "Export appearance"
  },
  "appearance.reset": {
    "pt": "Restaurar padrão A",
    "en": "Restore preset A"
  },
  "appearance.winter": {
    "pt": "Aplicar terreno de inverno",
    "en": "Apply winter terrain"
  },
  "appearance.custom": {
    "pt": "Personalizado",
    "en": "Custom"
  },
  "appearance.preset.C": {
    "pt": "C · Violeta e areia",
    "en": "C · Violet and sand"
  },
  "appearance.preset.B": {
    "pt": "B · Petróleo e pedra",
    "en": "B · Teal and stone"
  },
  "appearance.preset.A": {
    "pt": "A · Azul e papel — recomendado",
    "en": "A · Blue and paper — recommended"
  },
  "appearance.preset": {
    "pt": "Ponto de partida",
    "en": "Starting preset"
  },
  "appearance.intro": {
    "pt": "Escolha uma das três propostas ou personalize cada valor. O mapa muda imediatamente; partida, zoom e experiência das IAs são preservados.",
    "en": "Choose one of the three proposals or customize each value. The map updates immediately; your game, zoom, and AI experience are preserved."
  },
  "appearance.title": {
    "pt": "Aparência do jogo",
    "en": "Game appearance"
  },
  "appearance.button": {
    "pt": "Aparência",
    "en": "Appearance"
  },
  "unit.current": {
    "pt": "<section class=\"unit-current-state\"><h3>Estado atual da unidade</h3><dl><dt>Coesão atual</dt><dd>{0}/3 PV</dd><dt>Dano acumulado</dt><dd>{1} PV</dd><dt>Movimento restante</dt><dd>{2}/{3} PM</dd><dt>Ataque efetivo</dt><dd>{4} (base {5} − penalidade {6})</dd><dt>Defesa base</dt><dd>{7}</dd><dt>Já disparou</dt><dd>{8}</dd><dt>Pode mover nesta fase</dt><dd>{9}</dd><dt>Suprimida</dt><dd>{10}</dd><dt>Reorganizando</dt><dd>{11}</dd><dt>Reação gasta</dt><dd>{12}</dd></dl><p class=\"muted\">Cobertura, altura, dado e situação do alvo são calculados no combate; a defesa base não é uma defesa final única.</p></section>",
    "en": "<section class=\"unit-current-state\"><h3>Current unit status</h3><dl><dt>Current cohesion</dt><dd>{0}/3 HP</dd><dt>Accumulated damage</dt><dd>{1} HP</dd><dt>Movement remaining</dt><dd>{2}/{3} MP</dd><dt>Effective attack</dt><dd>{4} (base {5} − penalty {6})</dd><dt>Base defense</dt><dd>{7}</dd><dt>Already fired</dt><dd>{8}</dd><dt>Can move in this phase</dt><dd>{9}</dd><dt>Suppressed</dt><dd>{10}</dd><dt>Reorganizing</dt><dd>{11}</dd><dt>Reaction spent</dt><dd>{12}</dd></dl><p class=\"muted\">Cover, elevation, the die, and the target’s situation are evaluated during combat; base defense is not a single final defense value.</p></section>"
  },
  "unit.no": {
    "pt": "não",
    "en": "no"
  },
  "unit.yes": {
    "pt": "sim",
    "en": "yes"
  },
  "combat.miss": {
    "pt": "Sem perda de coesão",
    "en": "No cohesion loss"
  },
  "combat.damage": {
    "pt": "−{0} PV",
    "en": "−{0} HP"
  },
  "combat.counterattack": {
    "pt": "Contra-ataque",
    "en": "Counterattack"
  },
  "combat.defensive-fire": {
    "pt": "Fogo defensivo",
    "en": "Defensive fire"
  },
  "combat.attack": {
    "pt": "Ataque",
    "en": "Attack"
  },
  "fixed.model": {
    "pt": "<h4>{0}</h4><p>{1} partidas de treino · {2} atualizações · {3} situações. Sementes: {4}–{5}. α = {6}; γ = {7}; exploração no treino = {8}; exploração no jogo = {9}.</p>",
    "en": "<h4>{0}</h4><p>{1} training games · {2} updates · {3} states. Seeds: {4}–{5}. α = {6}; γ = {7}; training exploration = {8}; in-game exploration = {9}.</p>"
  },
  "fixed.dialog": {
    "pt": "<section class=\"fixed-models\"><h3>Dois aprendizes fixos, um por lado</h3><p>Cada modelo foi treinado separadamente contra seis combinações fixas de estratégia e postura, com 400 partidas por adversário. Os pesos ficam congelados no jogo. A postura é escolhida pelo próprio modelo. Estes modelos não usam nem alteram a experiência pessoal da Veterana ou do Aprendiz simples.</p>{0}{1}<p>A exploração de inferência é zero; empates usam a primeira política. As sementes tornam o treino reproduzível. Os dados e a avaliação independente estão no repositório, em docs/simulacoes.</p></section>",
    "en": "<section class=\"fixed-models\"><h3>Two fixed learners, one for each side</h3><p>Each model was trained separately against six fixed strategy and stance combinations, with 400 games per opponent. Weights remain frozen in the game. Each model chooses its own stance. These models do not use or change the personal experience of the Veteran or the simple learner.</p>{0}{1}<p>Inference exploration is zero; ties select the first policy. Seeds make training reproducible. Raw data and held-out evaluation are in the repository under docs/simulacoes.</p></section>"
  },
  "fixed.status": {
    "pt": "Aprendiz fixo · {0}: {1} partidas de treino. Modelo exclusivo deste lado; escolhe estratégia e postura sem explorar nem alterar pesos durante a partida.",
    "en": "Fixed learner · {0}: {1} training games. A separate model for this side chooses strategy and stance without exploration or weight updates during play."
  },
  "fixed.option": {
    "pt": "Aprendiz fixo · por lado",
    "en": "Fixed learner · per side"
  },
  "legend.exposure": {
    "pt": "┄ Borda tracejada marrom/laranja · rota exposta a fogo defensivo",
    "en": "┄ Dashed brown/dashed border · route exposed to defensive fire"
  },
  "app.001": {
    "pt": " · Brasília",
    "en": " · Brasília"
  },
  "app.002": {
    "pt": "v{0} · {1} · Brasília",
    "en": "v{0} · {1} · Brasília"
  },
  "app.003": {
    "pt": "Experiência salva neste navegador.",
    "en": "Experience saved in this browser."
  },
  "app.004": {
    "pt": "Armazenamento indisponível: exporte a experiência antes de sair.",
    "en": "Storage unavailable: export your experience before leaving."
  },
  "app.007": {
    "pt": "DEFESA ALEMÃ",
    "en": "GERMAN DEFENSE"
  },
  "app.008": {
    "pt": "Dois jogadores comandam a FEB e a defesa alemã neste aparelho. As peças mostram FEB ou DE.",
    "en": "Two players command the FEB and German defense on this device. Counters are labeled FEB or DE."
  },
  "app.009": {
    "pt": "Você comanda a {0}, {1}. {2}",
    "en": "You command the {0}, {1}. {2}"
  },
  "app.010": {
    "pt": "com as peças marcadas FEB",
    "en": "using counters labeled FEB"
  },
  "app.011": {
    "pt": "com as peças marcadas DE",
    "en": "using counters labeled DE"
  },
  "app.012": {
    "pt": "O computador comanda a {0}.",
    "en": "The computer commands the {0}."
  },
  "app.013": {
    "pt": "O oponente recebe os turnos por link ou arquivo.",
    "en": "Your opponent receives turns through a link or file."
  },
  "app.014": {
    "pt": "<defs><pattern id=\"paper\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><circle cx=\"2\" cy=\"2\" r=\".5\" fill=\"var(--ui-paper)\" opacity=\"var(--ui-paperOpacity)\"/></pattern></defs><rect width=\"960\" height=\"690\" fill=\"var(--ui-terrain1)\"/><rect width=\"960\" height=\"690\" fill=\"url(#paper)\"/><text x=\"900\" y=\"65\" class=\"maplabel\">N ↑</text><text x=\"650\" y=\"650\" class=\"maplabel\">Base geográfica atual · cenário tático 1945</text>",
    "en": "<defs><pattern id=\"paper\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><circle cx=\"2\" cy=\"2\" r=\".5\" fill=\"var(--ui-paper)\" opacity=\"var(--ui-paperOpacity)\"/></pattern></defs><rect width=\"960\" height=\"690\" fill=\"var(--ui-terrain1)\"/><rect width=\"960\" height=\"690\" fill=\"url(#paper)\"/><text x=\"900\" y=\"65\" class=\"maplabel\">N ↑</text><text x=\"650\" y=\"650\" class=\"maplabel\">Present-day geography · 1945 tactical scenario</text>"
  },
  "app.016": {
    "pt": "<circle class=\"objective-ring\" cx=\"{0}\" cy=\"{1}\" r=\"34\" fill=\"none\" stroke=\"var(--ui-objective)\" stroke-width=\"2\" stroke-dasharray=\"5 3\" pointer-events=\"none\"/><polygon class=\"objective-star\" data-objective=\"{2},{3}\" points=\"{4}\" fill=\"var(--ui-objective)\" fill-opacity=\"var(--ui-objectiveOpacity)\" pointer-events=\"none\"/><text x=\"{5}\" y=\"{6}\" text-anchor=\"middle\" class=\"maplabel\" pointer-events=\"none\">{7}+{8}/rod</text>",
    "en": "<circle class=\"objective-ring\" cx=\"{0}\" cy=\"{1}\" r=\"34\" fill=\"none\" stroke=\"var(--ui-objective)\" stroke-width=\"2\" stroke-dasharray=\"5 3\" pointer-events=\"none\"/><polygon class=\"objective-star\" data-objective=\"{2},{3}\" points=\"{4}\" fill=\"var(--ui-objective)\" fill-opacity=\"var(--ui-objectiveOpacity)\" pointer-events=\"none\"/><text x=\"{5}\" y=\"{6}\" text-anchor=\"middle\" class=\"maplabel\" pointer-events=\"none\">{7}+{8}/round</text>"
  },
  "app.017": {
    "pt": "<text x=\"75\" y=\"680\" class=\"maplabel\">Aproximação FEB · Gaggio Montano fora do recorte, a sudoeste</text><path d=\"M80 625h179m-179 -5v10m179 -10v10\" stroke=\"var(--ui-mapText)\" stroke-width=\"2\"/><text x=\"80\" y=\"648\" font-size=\"11\" fill=\"var(--ui-mapText)\">0</text><text x=\"235\" y=\"648\" font-size=\"11\" fill=\"var(--ui-mapText)\">500 m</text><text x=\"430\" y=\"25\" class=\"maplabel\">Linha defensiva alemã · Apeninos setentrionais</text>",
    "en": "<text x=\"75\" y=\"680\" class=\"maplabel\">FEB approach · Gaggio Montano beyond the map to the southwest</text><path d=\"M80 625h179m-179 -5v10m179 -10v10\" stroke=\"var(--ui-mapText)\" stroke-width=\"2\"/><text x=\"80\" y=\"648\" font-size=\"11\" fill=\"var(--ui-mapText)\">0</text><text x=\"235\" y=\"648\" font-size=\"11\" fill=\"var(--ui-mapText)\">500 m</text><text x=\"430\" y=\"25\" class=\"maplabel\">German defensive line · Northern Apennines</text>"
  },
  "app.018": {
    "pt": "<g class=\"unit {0} {1}\" data-id=\"{2}\" data-side=\"{28}\" transform=\"translate({3},{4})\" tabindex=\"0\" role=\"button\" aria-label=\"{5}, {6}, {7} de resistência, ataque {8}, defesa {9}\"><title>{10} · A{11} D{12} · {13} PV</title><g class=\"counter-content\"><rect class=\"counter\" x=\"-25\" y=\"-25\" width=\"50\" height=\"50\" rx=\"1\" fill=\"{14}\"/><rect class=\"counter-separator\" x=\"-23\" y=\"-23\" width=\"46\" height=\"46\"/>{15}<text class=\"troop-mark\" x=\"0\" y=\"35\" text-anchor=\"middle\">{16} · T{17}</text><rect class=\"symbol\" x=\"-14\" y=\"-13\" width=\"28\" height=\"18\"/> <g class=\"symbol\">{18}</g><text x=\"0\" y=\"-17\" text-anchor=\"middle\" style=\"font-size:calc(7px * var(--ui-counterFontScale))\">{19} {20}/3</text><text x=\"-21\" y=\"21\" style=\"font-size:calc(9px * var(--ui-counterFontScale))\">A{21} D{22}</text><text x=\"8\" y=\"21\" style=\"font-size:calc(9px * var(--ui-counterFontScale))\">M{23}</text>{24}{25}{26}{27}</g></g>",
    "en": "<g class=\"unit {0} {1}\" data-id=\"{2}\" data-side=\"{28}\" transform=\"translate({3},{4})\" tabindex=\"0\" role=\"button\" aria-label=\"{5}, {6}, {7} cohesion, attack {8}, defense {9}\"><title>{10} · A{11} D{12} · {13} HP</title><g class=\"counter-content\"><rect class=\"counter\" x=\"-25\" y=\"-25\" width=\"50\" height=\"50\" rx=\"1\" fill=\"{14}\"/><rect class=\"counter-separator\" x=\"-23\" y=\"-23\" width=\"46\" height=\"46\"/>{15}<text class=\"troop-mark\" x=\"0\" y=\"35\" text-anchor=\"middle\">{16} · T{17}</text><rect class=\"symbol\" x=\"-14\" y=\"-13\" width=\"28\" height=\"18\"/> <g class=\"symbol\">{18}</g><text x=\"0\" y=\"-17\" text-anchor=\"middle\" style=\"font-size:calc(7px * var(--ui-counterFontScale))\">{19} {20}/3</text><text x=\"-21\" y=\"21\" style=\"font-size:calc(9px * var(--ui-counterFontScale))\">A{21} D{22}</text><text x=\"8\" y=\"21\" style=\"font-size:calc(9px * var(--ui-counterFontScale))\">M{23}</text>{24}{25}{26}{27}</g></g>"
  },
  "app.019": {
    "pt": "alemã",
    "en": "German"
  },
  "app.024": {
    "pt": "{0}: já atacou; ainda pode mover com seus {1} PM. Toque num hexágono com CONTORNO DE MOVIMENTO.",
    "en": "{0}: already fired; can still move with {1} MP. Tap a hex with a MOVEMENT OUTLINE."
  },
  "app.025": {
    "pt": "{0}: ação usada ou comprometida por fogo/reorganização. Selecione outra peça.",
    "en": "{0}: action spent or committed to reaction fire/reorganization. Select another counter."
  },
  "app.026": {
    "pt": "{0} · {1} PM: toque num hexágono com CONTORNO DE MOVIMENTO para andar ou num inimigo com BARRA DE ATAQUE para atacar.",
    "en": "{0} · {1} MP: tap a hex with a MOVEMENT OUTLINE to move or an enemy with an ATTACK BAR to attack."
  },
  "app.027": {
    "pt": "Selecione sua peça. Toque num destino com contorno de movimento para mover ou num inimigo com barra de ataque para disparar.",
    "en": "Select your counter. Tap a destination with a movement outline to move or an enemy with an attack bar to fire."
  },
  "app.028": {
    "pt": " ⚠ {0} destino(s) com borda tracejada expostos a fogo defensivo no percurso. Suprima o defensor com apoio antes de subir.",
    "en": " ⚠ {0} destination(s) with dashed borders are exposed to defensive fire along the route. Suppress the defender with support before climbing."
  },
  "app.029": {
    "pt": "<button data-goal=\"{0}\" class=\"{1}\">⚑ {2} · +{3}/rodada<small>{4} · localizar ↗</small></button>",
    "en": "<button data-goal=\"{0}\" class=\"{1}\">⚑ {2} · +{3}/round<small>{4} · locate ↗</small></button>"
  },
  "app.030": {
    "pt": "FEB · seu controle",
    "en": "FEB · under your control"
  },
  "app.031": {
    "pt": "Defesa alemã",
    "en": "German defense"
  },
  "app.032": {
    "pt": "Livre · ocupe para pontuar",
    "en": "Unoccupied · capture to score"
  },
  "app.033": {
    "pt": "⚑ MISSÃO: TOME E SEGURE MONTE CASTELO",
    "en": "⚑ MISSION: CAPTURE AND HOLD MONTE CASTELO"
  },
  "app.034": {
    "pt": "⚑ MISSÃO: OCUPE AS POSIÇÕES MARCADAS",
    "en": "⚑ MISSION: OCCUPY THE MARKED POSITIONS"
  },
  "app.035": {
    "pt": "{0}{1} Os objetivos rendem até {2} pontos por rodada, que se somam ao placar: Monte Castelo +2; cada secundário +1. Tempo e perdas determinam o grau da vitória.",
    "en": "{0}{1} Objectives yield up to {2} points per round, added to your score: Monte Castelo +2; each secondary objective +1. Time and losses determine the victory grade."
  },
  "app.036": {
    "pt": "A infantaria deve permanecer no cume até o fim do turno alemão. ",
    "en": "Infantry must hold the summit until the German turn ends. "
  },
  "app.037": {
    "pt": "Faltam {0} pontos · ocupação atual: +{1}/rodada · {2} fechamento(s) restante(s). {3} {4} {5} {6}",
    "en": "{0} points still needed · current occupation: +{1}/round · {2} round ending(s) left. {3} {4} {5} {6}"
  },
  "app.038": {
    "pt": "Pontos suficientes: assegure o cume.",
    "en": "Enough points: secure the summit."
  },
  "app.039": {
    "pt": "Nesse ritmo, precisa de {0} fechamento(s).",
    "en": "At this rate, you need {0} round ending(s)."
  },
  "app.040": {
    "pt": "A ocupação atual não gera pontos.",
    "en": "Current occupation produces no points."
  },
  "app.041": {
    "pt": "⚠ Mesmo todos os objetivos não completam a pontuação no prazo.",
    "en": "⚠ Even all objectives cannot reach the required score before the deadline."
  },
  "app.042": {
    "pt": "Para a meta de pontos só no cume: iniciar ocupação até a rodada {0}.",
    "en": "To reach the score using only the summit: occupy it by round {0}."
  },
  "app.043": {
    "pt": "Cume assegurado no fechamento final ainda permite vitória custosa.",
    "en": "Holding the summit at the final round ending still allows a costly victory."
  },
  "app.044": {
    "pt": "Percurso otimista ao cume: rodada {0}, ignorando bloqueios e fogo.",
    "en": "Optimistic route to the summit: round {0}, ignoring blocking units and fire."
  },
  "app.045": {
    "pt": "COMANDO LOCAL · VEZ DA {0}",
    "en": "LOCAL COMMAND · {0} TURN"
  },
  "app.046": {
    "pt": "VOCÊ COMANDA A {0}",
    "en": "YOU COMMAND THE {0}"
  },
  "app.047": {
    "pt": "Vitória da {0}",
    "en": "{0} victory"
  },
  "app.048": {
    "pt": "Vitória! Operação encerrada.",
    "en": "Victory! Operation complete."
  },
  "app.049": {
    "pt": "Derrota. Operação encerrada.",
    "en": "Defeat. Operation complete."
  },
  "app.050": {
    "pt": "O computador comanda a {0}…",
    "en": "The computer commands the {0}…"
  },
  "app.051": {
    "pt": "Envie o turno ao seu oponente",
    "en": "Send the turn to your opponent"
  },
  "app.052": {
    "pt": "O computador vai manobrar…",
    "en": "The computer is about to maneuver…"
  },
  "app.053": {
    "pt": "Vez da {0}",
    "en": "{0} turn"
  },
  "app.054": {
    "pt": "Sua vez de avançar",
    "en": "Your turn to advance"
  },
  "app.055": {
    "pt": "Operação encerrada. Inicie outra para experimentar uma nova estratégia.",
    "en": "Operation complete. Start another to try a new strategy."
  },
  "app.056": {
    "pt": "A cobra vai fumar.",
    "en": "The smoking snakes are ready."
  },
  "app.057": {
    "pt": "<p class=\"troop-formation\">{0} · {1}</p><p>{2} · {3}</p><div class=\"statrow\"><span>Ataque {4}</span><span>Defesa {5}</span><span>PV {6}/3</span><span>Movimento {7}/{8}</span><span>T{9} · {10}</span><span>Altitude ~{11}m · N{12}</span><span>Fortificação +{13}</span><span>Alcance {14}{15}</span><span>Cobertura {16}</span></div><p>{17} Dano acumulado: {18}. Potência atual: {19}. Defender pelo menos 30 m acima do atacante dá +1 adicional.</p><p>{20}{21}{22}</p><p class=\"muted\">{23} {24}</p>{25}",
    "en": "<p class=\"troop-formation\">{0} · {1}</p><p>{2} · {3}</p><div class=\"statrow\"><span>Attack {4}</span><span>Defense {5}</span><span>HP {6}/3</span><span>Movement {7}/{8}</span><span>T{9} · {10}</span><span>Altitude ~{11}m · N{12}</span><span>Fortification +{13}</span><span>Range {14}{15}</span><span>Cover {16}</span></div><p>{17} Accumulated damage: {18}. Current power: {19}. Defending at least 30 m above the attacker adds another +1.</p><p>{20}{21}{22}</p><p class=\"muted\">{23} {24}</p>{25}"
  },
  "app.058": {
    "pt": "Força Expedicionária Brasileira",
    "en": "Brazilian Expeditionary Force"
  },
  "app.059": {
    "pt": "Defesa alemã",
    "en": "German defense"
  },
  "app.060": {
    "pt": "Apoio blindado",
    "en": "Armored support"
  },
  "app.061": {
    "pt": " +1 acima de ",
    "en": " +1 above "
  },
  "app.062": {
    "pt": "Ação de fogo usada · já atacou; ainda pode mover com os PM restantes; não pode disparar outra vez.",
    "en": "Fire action spent · already attacked; can still use remaining MP to move; cannot fire again."
  },
  "app.063": {
    "pt": "Ação usada ou comprometida · já atacou, reagiu ou está em reorganização.",
    "en": "Action spent or committed · already attacked, reacted, or is reorganizing."
  },
  "app.064": {
    "pt": "Sem movimento · ainda pode atacar um inimigo ao alcance.",
    "en": "No movement left · can still attack an enemy in range."
  },
  "app.065": {
    "pt": "Pronta para agir · pode mover e atacar em qualquer ordem.",
    "en": "Ready · can move and attack in either order."
  },
  "app.066": {
    "pt": "Pronta para agir · pode mover e depois atacar; nesta partida antiga, atacar encerra o movimento.",
    "en": "Ready · can move, then attack; in this older saved game, attacking ends movement."
  },
  "app.067": {
    "pt": "Em reorganização: próxima ativação comprometida. ",
    "en": "Reorganizing: next activation committed. "
  },
  "app.068": {
    "pt": "Sob fogo de apoio: não pode reagir até seu próprio turno. ",
    "en": "Under support fire: cannot react until its own turn. "
  },
  "app.069": {
    "pt": "Ação do próximo turno comprometida por fogo ou recuo.",
    "en": "Next turn’s action committed by fire or withdrawal."
  },
  "app.070": {
    "pt": "Infantaria de manobra: pode ocupar os objetivos.",
    "en": "Maneuver infantry: can occupy objectives."
  },
  "app.071": {
    "pt": "Apoio de fogos: não ocupa objetivos sozinho.",
    "en": "Fire support: cannot occupy objectives alone."
  },
  "app.072": {
    "pt": "Perfil preservado da partida anterior; novas partidas usam os perfis revisados.",
    "en": "Profile preserved from an earlier game; new games use revised profiles."
  },
  "app.073": {
    "pt": "<p>Selecione uma de suas peças ({0}) e toque no hexágono com contorno de movimento para andar ou no inimigo com barra de ataque para atacar.</p><p>A = ataque · D = defesa · M = movimento restante. Bolinhas = coesão. Marcador −N = dano acumulado. Toque duas vezes para ampliar.</p>",
    "en": "<p>Select one of your counters ({0}) and tap a hex with a movement outline to move or an enemy with an attack bar to attack.</p><p>A = attack · D = defense · M = movement remaining. Dots = cohesion. The −N badge = accumulated damage. Double-tap to enlarge.</p>"
  },
  "app.074": {
    "pt": "DE",
    "en": "DE"
  },
  "app.075": {
    "pt": "DE",
    "en": "DE"
  },
  "app.076": {
    "pt": "IA especial: {0} partidas de experiência · {1} situações. Aprendiz simples: {2} partidas concluídas · experiência local{3}.",
    "en": "Veteran AI: {0} games of experience · {1} situations. Simple learner: {2} completed games · local experience{3}."
  },
  "app.077": {
    "pt": "Aprendiz: {0} partidas concluídas · experiência salva neste navegador.",
    "en": "Learner: {0} completed games · experience saved in this browser."
  },
  "app.078": {
    "pt": "<span class=\"eyebrow\">FIM DA OPERAÇÃO</span><h2>{0}</h2><p><b>Vencedor: {10}</b></p><p>{1}</p><div class=\"statrow\"><span>Rodadas: {2}/{3}</span><span>Pontos: {4}</span><span>Peças FEB fora de combate: {5}/5</span><span>Coesão perdida: {6}/15</span><span>Eficiência: {7}/100</span></div>{8}{9}<p>Uma vitória mais cedo e com menos perdas recebe grau maior: decisiva, tática, custosa ou pírrica. Perdas de peças e coesão não são números de soldados mortos.</p><p>{11}</p><p>Use Nova partida para outra operação. A experiência da IA é preservada.</p>",
    "en": "<span class=\"eyebrow\">OPERATION COMPLETE</span><h2>{0}</h2><p><b>Winner: {10}</b></p><p>{1}</p><div class=\"statrow\"><span>Rounds: {2}/{3}</span><span>Points: {4}</span><span>FEB counters out of action: {5}/5</span><span>Cohesion lost: {6}/15</span><span>Efficiency: {7}/100</span></div>{8}{9}<p>An earlier victory with fewer losses earns a higher grade: decisive, tactical, costly, or Pyrrhic. Counter and cohesion losses do not count soldiers killed.</p><p>{11}</p><p>Use New game to start another operation. AI experience is preserved.</p>"
  },
  "app.079": {
    "pt": "<h2>{0}</h2><p>{1} · T{2} — {3}</p><div class=\"bigpiece\" data-side=\"{4}\">{5}<small>A{6} · D{7} · M{8}<br>{9}/3 PV · {10} dano(s)</small></div>{20}<p>Ataque {11} · Defesa {12} · Resistência {13}/3 · Dano acumulado {14} · Alcance {15} hexágono(s).</p><p>{16}</p>{17}<p>{18} Mobilidade máxima: {19} PM.</p><p class=\"muted\">Os 3 PV são coesão relativa, não efetivos iguais de pessoas. Escalão e T1–T3 estão explicados em Forças e níveis.</p>",
    "en": "<h2>{0}</h2><p>{1} · T{2} — {3}</p><div class=\"bigpiece\" data-side=\"{4}\">{5}<small>A{6} · D{7} · M{8}<br>{9}/3 HP · {10} damage</small></div>{20}<p>Attack {11} · Defense {12} · Cohesion {13}/3 · Accumulated damage {14} · Range {15} hex(es).</p><p>{16}</p>{17}<p>{18} Maximum mobility: {19} MP.</p><p class=\"muted\">The 3 HP represent relative cohesion, not equal numbers of people. Echelons and T1–T3 are explained in Forces and levels.</p>"
  },
  "app.080": {
    "pt": "Agrupamento de cenário.",
    "en": "Scenario grouping."
  },
  "app.081": {
    "pt": "Pode ocupar posições.",
    "en": "Can occupy positions."
  },
  "app.082": {
    "pt": "Somente apoio de fogos; não ocupa posições sozinho.",
    "en": "Fire support only; cannot occupy positions alone."
  },
  "app.083": {
    "pt": "Alvo fora do alcance ou sem linha de visão. Reposicione sua peça.",
    "en": "Target out of range or outside line of sight. Reposition your counter."
  },
  "app.084": {
    "pt": "Recomeçar esta operação? A experiência já aprendida será mantida.",
    "en": "Restart this operation? Learned experience will be preserved."
  },
  "app.085": {
    "pt": "<span class=\"eyebrow\">MANUAL DE CAMPANHA</span><h2>Tomar as alturas</h2><p>{0} Uma partida tem no máximo {1} rodadas.</p><ol><li><b>Mova:</b> selecione a peça e toque no hexágono com contorno de movimento. Campo e estrada custam 1 PM; mata, 2 PM. O custo nominal soma {11} PM por nível de subida; a regra de deslocamento mínimo da tabela pode limitá-lo ao máximo da peça. Descer não tem custo extra. Pode mover em etapas. Não é possível atravessar peças.</li><li><b>Ataque:</b> selecione a peça e toque no inimigo com barra de ataque. Não há botões para trocar de ação. Infantaria alcança 1 hexágono; o apoio agregado alcança 2 por uma simplificação de suas armas coletivas. Artilharia faz tiro indireto em alvos conhecidos a 5 hexágonos (FEB) ou 6 (alemães) nos novos perfis, inclusive fortificações, dispensando linha de visão direta. A proteção do terreno e da fortificação continua valendo. Um ataque por turno.</li><li><b>Combate:</b> ataque + dado de 1 a 6 − defesa − cobertura − 0,5 por PV perdido pelo atacante. Mata ou morro dão +1 de cobertura; fortificação dá +{12}. Usa-se a maior cobertura, sem acumular. As posições preparadas de Monte Castelo e de um objetivo secundário são desenhadas como abrigos e trincheiras; suas localizações são esquemáticas. Um defensor pelo menos 30 m acima recebe mais +1. O tiro direto de uma posição pelo menos {2} m acima alcança um hexágono extra, com linha de visão. N1 a N4 indicam as faixas de altitude do terreno. Resultado ≥5 causa 2 danos; ≥1 causa 1; ≤0 falha e causa 1 dano de contra-ataque ao atacante se adjacente, desde que o defensor não esteja suprimido nem já tenha reagido. Cada peça começa com 3 PV de coesão. Infantaria possui 3 PM; destacamentos alemães 2; apoio 2; artilharia 1, conforme o perfil. Apenas infantaria de manobra ocupa objetivos. Perder toda a infantaria de manobra encerra a missão brasileira. {3}<p class=\"automatic-combat\">{10}</p></li><li><b>Vitória:</b> ao fim de cada turno alemão, uma peça brasileira de infantaria de manobra sobre Monte Castelo rende 2 pontos; cada objetivo secundário rende 1. O máximo dos três objetivos é {4} pontos por rodada, não o limite do placar. Os pontos se acumulam entre rodadas e não são perdidos ao sair da posição. {5} Eliminar todas as peças de um lado dá vitória imediata ao adversário. Enquanto houver defensores, os secundários sozinhos não substituem a missão do cume. O prazo é {6} rodadas; a perda de toda a infantaria de manobra também dá vitória à defesa. O grau da vitória considera tempo, peças fora de combate e coesão perdida.</li></ol>{9}<h2>Retirada e reorganização</h2><p>{7}</p><h2>Fogo na subida</h2><p>Ao selecionar uma peça, os destinos legais expostos a reação no percurso recebem borda tracejada. O cálculo considera altitude, linha de visão, alcance, supressão e reação já gasta. É risco de disparo, não dano garantido. A projeção da missão mostra pontuação pela ocupação atual e um percurso otimista; ignora bloqueios e fogo futuro e não é promessa de chegada.</p><p>Ao percorrer uma rota exposta ou iniciar um assalto, uma unidade de tiro direto pelo menos 30 m acima pode disparar primeiro. Há no máximo uma reação por movimento completo e uma do alvo antes do assalto. O tiro de oportunidade causa no máximo 1 dano; o ataque normal pode causar 2. A reação consome a ação de fogo e movimento do próximo turno da unidade; não é um disparo extra ilimitado. A regra é simétrica, incluindo brasileiros que dominem altura.</p><p>Um acerto de apoio indireto suprime a reação do defensor até o início do seu próprio turno, sem retirar seu tiro normal. Use apoio antes de mandar a infantaria encosta acima. O símbolo S indica supressão. Artilharia indireta não ganha alcance adicional por altura.</p><h2>Como ler a altura</h2><p>As faixas de luminosidade mostram quatro níveis: N1 vale, N2 encosta, N3 crista e N4 cume. As linhas de contorno são curvas de nível a cada 50 m, geradas por interpolação entre as amostras de elevação do tabuleiro. Subir um nível acrescenta nominalmente +{11} PM, com a exceção de deslocamento mínimo explicada na tabela; defender pelo menos 30 m acima dá +1 de defesa. As faixas agora derivam de amostras do Copernicus DEM de 90 m: N1 abaixo de 780 m, N2 de 780–849 m, N3 de 850–919 m, N4 a partir de 920 m. São generalizações para as regras. O cume está ancorado no ponto OSM de cota 977 m; a amostra DEM dá aproximadamente 980 m. O relevo é geográfico atual; caminhos e bosques modernos não comprovam a cobertura de 1945.</p><h2>Como ler o desenho das peças</h2><div class=\"counter-guide\"><div class=\"example-counter\" aria-label=\"Exemplo de infantaria brasileira: três pontos de resistência, ataque três, defesa três e movimento três\"><b>FEB 3/3</b><svg viewBox=\"0 0 80 44\" role=\"img\" aria-label=\"Símbolo militar de infantaria\"><rect x=\"10\" y=\"3\" width=\"60\" height=\"36\" fill=\"none\" stroke=\"var(--ui-counterText)\" stroke-width=\"3\"/><path d=\"M10 3L70 39M70 3L10 39\" stroke=\"var(--ui-counterText)\" stroke-width=\"3\"/></svg><span class=\"example-dots\">● ● ●</span><small>A3 D3 M3</small></div><div><p><b>FEB / DE:</b> lado da peça. FEB identifica brasileiros; DE identifica alemães. As cores são as escolhidas em Aparência. O número 3/3 mostra a resistência atual e a inicial.</p><p><b>Bolinhas de coesão:</b> cada uma vale 1 ponto de resistência (PV). Três bolinhas: peça intacta. Duas: sofreu 1 dano. Uma: sofreu 2 danos. Ao perder o último PV, a peça sai do mapa.</p></div></div><ul><li><b>Retângulo com X:</b> símbolo militar convencional de infantaria, simplificado para o jogo.</li><li><b>Retângulo com ponto central:</b> artilharia, com tiro indireto de 5 hexágonos (FEB) ou 6 (alemães) nos novos perfis. O ponto central identifica o tipo da tropa; as bolinhas de coesão abaixo mostram resistência.</li><li><b>A:</b> ataque nominal. <b>D:</b> defesa nominal. <b>M:</b> movimento restante no turno. M diminui ao mover{8}; volta ao máximo no próximo turno desse lado.</li><li><b>Selo de dano −1 ou −2:</b> dano acumulado desde os 3 PV iniciais. Cada PV perdido reduz a potência do ataque em 0,5; a potência atual aparece no painel da peça.</li><li><b>Traço diagonal sobre a peça:</b> já atacou neste turno. O direito de ataque volta no próximo turno desse lado.</li><li><b>II:</b> escalão de batalhão ou grupo de artilharia. <b>AP:</b> apoio agregado. <b>DEST:</b> destacamento reduzido de cenário. <b>T1–T3:</b> nível tático do perfil; T1 reduzido, T2 operacional, T3 especializado em fogos. Não são notas históricas nem bônus ocultos.</li><li><b>Halo de seleção:</b> peça selecionada. <b>Hexágonos com contorno de movimento:</b> destinos legais ao selecionar sua peça. <b>Contorno de ataque no inimigo:</b> alvo legal ao selecionar sua peça.</li></ul><p>Duplo toque/clique amplia a peça com seus valores atuais. O painel mostra também altitude, cobertura, fortificação, alcance e estado de ação.</p><p>Leia a narrativa ampliada e as fontes brasileiras no botão História.</p><h3>Comandantes do computador</h3><p>Caçador prioriza maior ataque, desempata por distância. Oportunista prioriza menor defesa, desempata por distância. A postura agressiva aproxima; a defensiva valoriza cobertura e objetivos. Estado-maior avalia movimentos legais, ameaças, apoio e objetivos; calcula sem busca longa. Aprendiz usa Q-learning simples para escolher entre seis combinações de estratégia/postura, com exploração de 20%, recompensa por danos e contenção de pontos, e bônus por resultado final. Ele aprende a escolher políticas, não movimentos individuais. A experiência fica no armazenamento local, sem servidor; apagar os dados do navegador apaga o aprendizado.</p>",
    "en": "<span class=\"eyebrow\">CAMPAIGN MANUAL</span><h2>Capture the heights</h2><p>{0} A game lasts at most {1} rounds.</p><ol><li><b>Move:</b> select a counter and tap a hex with a movement outline. Open ground and roads cost 1 MP; woods cost 2 MP. The nominal cost adds {11} MP for each elevation level climbed; the minimum-movement rule in the table may cap this at the counter’s maximum allowance. Descending has no extra cost. You may move in stages. Counters cannot pass through other counters.</li><li><b>Attack:</b> select a counter and tap an enemy with an attack bar. No action-switch buttons are needed. Infantry reaches 1 hex; aggregated support reaches 2 as a simplification of its crew-served weapons. In the new profiles, artillery uses indirect fire against known targets up to 5 hexes away (FEB) or 6 (German artillery), including fortifications, without requiring direct line of sight. Terrain and fortification protection still apply. One attack per turn.</li><li><b>Combat:</b> attack + a six-sided die − defense − cover − 0.5 per HP lost by the attacker. Woods or a hill provide +1 cover; a fortification provides +{12}. Use the highest cover bonus; these do not stack. Prepared positions on Monte Castelo and a secondary objective are drawn as shelters and trenches; their locations are schematic. A defender at least 30 m higher receives another +1. Direct fire from a position at least {2} m higher reaches one extra hex, with line of sight. N1 through N4 indicate relative elevation levels. A result ≥5 causes 2 damage; ≥1 causes 1; ≤0 misses and causes 1 counterattack damage to an adjacent attacker, provided the defender is neither suppressed nor already spent its reaction. Each counter starts with 3 HP of cohesion. Infantry has 3 MP; German detachments 2; support 2; artillery 1, according to its profile. Only maneuver infantry occupies objectives. Losing all maneuver infantry ends the Brazilian mission. {3}<p class=\"automatic-combat\">{10}</p></li><li><b>Victory:</b> at the end of each German turn, a Brazilian maneuver infantry counter on Monte Castelo earns 2 points; each secondary objective earns 1. The three objectives yield up to {4} points per round; this is not the score limit. Points accumulate between rounds and are retained after leaving a position. {5} Eliminating every counter on one side gives its opponent an immediate victory. While defenders remain, secondary objectives alone do not replace the summit mission. The deadline is {6} rounds; losing all maneuver infantry also gives victory to the defense. Victory grades consider time, counters out of action, and cohesion lost.</li></ol>{9}<h2>Withdrawal and reorganization</h2><p>{7}</p><h2>Fire on the climb</h2><p>When selecting a counter, legal destinations exposed to reactions along the route receive dashed borders. The calculation considers elevation, line of sight, range, suppression, and spent reactions. It indicates a risk of fire rather than guaranteed damage. The mission forecast shows the score from current occupation and an optimistic route; it ignores blocking units and future fire and does not promise arrival.</p><p>When a unit follows an exposed route or starts an assault, a direct-fire unit at least 30 m higher may fire first. There is at most one reaction per complete movement and one from the target before an assault. Opportunity fire causes at most 1 damage; a normal attack can cause 2. A reaction commits the reacting unit’s fire and movement actions for its next turn; it is not an unlimited extra shot. The rule is symmetric and includes Brazilian units holding higher ground.</p><p>A hit from indirect support suppresses the defender’s reactions until its own turn begins without removing its normal shot. Use support before sending infantry uphill. S marks suppression. Indirect artillery gains no extra range from elevation.</p><h2>Reading elevation</h2><p>Lightness bands show four levels: N1 valley, N2 slope, N3 ridge, and N4 summit. Contour lines occur every 50 m, interpolated between board elevation samples. Climbing one level adds a nominal +{11} MP, subject to the minimum-movement exception in the table; defending at least 30 m higher gives +1 defense. Bands derive from 90 m Copernicus DEM samples: N1 below 780 m, N2 780–849 m, N3 850–919 m, N4 at or above 920 m. These are rule generalizations. The summit is anchored at the OSM point of 977 m; the DEM sample is approximately 980 m. Terrain reflects present-day geography; modern paths and woods do not establish 1945 cover.</p><h2>Reading the counters</h2><div class=\"counter-guide\"><div class=\"example-counter\" aria-label=\"Brazilian infantry example: three cohesion points, attack three, defense three, movement three\"><b>FEB 3/3</b><svg viewBox=\"0 0 80 44\" role=\"img\" aria-label=\"Military infantry symbol\"><rect x=\"10\" y=\"3\" width=\"60\" height=\"36\" fill=\"none\" stroke=\"var(--ui-counterText)\" stroke-width=\"3\"/><path d=\"M10 3L70 39M70 3L10 39\" stroke=\"var(--ui-counterText)\" stroke-width=\"3\"/></svg><span class=\"example-dots\">● ● ●</span><small>A3 D3 M3</small></div><div><p><b>FEB / DE:</b> the counter’s side. FEB identifies Brazilian counters; DE identifies German counters. Colors follow your Appearance settings. The number 3/3 shows current and initial cohesion.</p><p><b>Cohesion dots:</b> each represents 1 cohesion point (HP). Three dots: intact counter. Two: 1 damage taken. One: 2 damage taken. Losing the last HP removes the counter from the map.</p></div></div><ul><li><b>Rectangle with X:</b> conventional military infantry symbol, simplified for the game.</li><li><b>Rectangle with a center dot:</b> artillery, with indirect fire up to 5 hexes (FEB) or 6 (German artillery) in the new profiles. The center dot identifies troop type; the cohesion dots below show cohesion.</li><li><b>A:</b> nominal attack. <b>D:</b> nominal defense. <b>M:</b> movement remaining this turn. M decreases when moving{8}; it returns to maximum on that side’s next turn.</li><li><b>−1 or −2 damage badge:</b> accumulated damage from the initial 3 HP. Each lost HP reduces attack power by 0.5; current power appears in the unit panel.</li><li><b>Diagonal line across a counter:</b> it has already attacked this turn. Its attack becomes available again on that side’s next turn.</li><li><b>II:</b> battalion or artillery group echelon. <b>AP:</b> aggregated support. <b>DEST:</b> reduced scenario detachment. <b>T1–T3:</b> tactical profile level; T1 reduced, T2 operational, T3 fire specialist. These are neither historical ratings nor hidden bonuses.</li><li><b>Selection halo:</b> selected counter. <b>Solid hex outlines:</b> legal destinations when your counter is selected. <b>Enemy attack outline:</b> legal target when your counter is selected.</li></ul><p>Double-tap/click enlarges a counter with its current values. The panel also shows elevation, cover, fortifications, range, and action status.</p><p>Read the expanded account and Brazilian sources with the History button.</p><h3>Computer commanders</h3><p>Hunter prioritizes higher attack, breaking ties by distance. Opportunist prioritizes lower defense, breaking ties by distance. Aggressive stance closes the distance; defensive stance favors cover and objectives. General staff evaluates legal moves, threats, support, and objectives without a deep search. Learner uses simple Q-learning to choose among six strategy/stance combinations, with 20% exploration, rewards for damage and limiting points, and a final-result bonus. It learns to select policies rather than individual moves. Experience stays in local storage without a server; clearing browser data removes learning.</p>"
  },
  "app.086": {
    "pt": "Mova e atire em qualquer ordem. O ataque normal preserva os PM restantes; só há um disparo por turno. Reações e reorganização ainda podem comprometer movimento e fogo.",
    "en": "Move and fire in either order. A normal attack preserves remaining MP; only one shot per turn. Reactions and reorganization can still commit movement and fire."
  },
  "app.087": {
    "pt": "Nesta partida preservada, atacar zera seus PM: mova antes de atacar.",
    "en": "This saved game preserves the earlier rule: attacking removes all MP. Move before attacking."
  },
  "app.088": {
    "pt": "Ao sobreviver a um tiro caindo de 2 ou 3 para 1 PV, infantaria tenta recuar um hexágono livre mais distante do atacante. Não atravessa peças, não recupera PV e não evita golpe fatal. Sem saída, permanece. A retirada impede reação e compromete a próxima ativação. A regra vale para os dois lados e abstrai perda de coesão; não reproduz uma ordem histórica específica.",
    "en": "When surviving a hit that reduces it from 2 or 3 HP to 1 HP, infantry attempts to withdraw to an empty adjacent hex farther from the attacker. It cannot pass through counters, regain HP, or avoid a fatal hit. With no escape, it stays. Withdrawal prevents reactions and commits the next activation. The rule applies to both sides and abstracts lost cohesion; it does not reproduce a specific historical order."
  },
  "app.089": {
    "pt": "Esta partida preserva a regra anterior, sem retirada automática por perdas.",
    "en": "This game preserves the earlier rule, with no automatic withdrawal after losses."
  },
  "app.090": {
    "pt": "; o disparo normal preserva os PM restantes",
    "en": "; normal fire preserves remaining MP"
  },
  "app.091": {
    "pt": " e zera ao atacar nesta partida antiga",
    "en": " and drops to zero when attacking in this older game"
  },
  "app.092": {
    "pt": "<span class=\"eyebrow\">APENINOS, ITÁLIA · 21 DE FEVEREIRO DE 1945</span><img class=\"narrative-logo\" src=\"{0}\" alt=\"Distintivo oficial da Força Expedicionária Brasileira\"><h2>Monte Castelo Vibed</h2><h3>Antes de o sol alcançar as alturas…</h3>{4}<p>{1}</p><p><b>Sua missão:</b> {2} {3} Planeje a subida: a altura custa movimento e protege o defensor.</p><p class=\"muted\">Narrativa ambientada em fatos históricos. Tabuleiro, forças e duração dos turnos são abstrações. Horário baseado nas sínteses da batalha; clima diário representado por reanálise regional ERA5; cartografia generalizada, cotejada com mapa operacional da história oficial americana.</p><button id=\"begin\">Assumir o comando →</button>",
    "en": "<span class=\"eyebrow\">APENNINES, ITALY · FEBRUARY 21, 1945</span><img class=\"narrative-logo\" src=\"{0}\" alt=\"Official Brazilian Expeditionary Force emblem\"><h2>Monte Castelo Vibed</h2><h3>Before sunlight reaches the heights…</h3>{4}<p>{1}</p><p><b>Your mission:</b> {2} {3} Plan your climb: elevation costs movement and protects the defender.</p><p class=\"muted\">A narrative based on historical events. The board, forces, and turn length are abstractions. Times follow battle summaries; daily weather uses regional ERA5 reanalysis; generalized mapping is compared with an operational map from the official U.S. Army history.</p><button id=\"begin\">Take command →</button>"
  },
  "app.093": {
    "pt": "alterne o comando dos dois lados no mesmo aparelho.",
    "en": "alternate command of both sides on this device."
  },
  "app.094": {
    "pt": "conduza as peças azuis, use a cobertura e a artilharia.",
    "en": "lead the blue counters and use cover and artillery."
  },
  "app.095": {
    "pt": "comande as peças em carvão e contenha o avanço brasileiro.",
    "en": "command the charcoal counters and contain the Brazilian advance."
  },
  "app.096": {
    "pt": "<h2>Turno não reconhecido</h2><p>O link recebido está incompleto ou é incompatível.</p>",
    "en": "<h2>Unrecognized turn</h2><p>The received link is incomplete or incompatible.</p>"
  },
  "app.097": {
    "pt": "<span class=\"eyebrow\">{0}</span><h2>Monte Castelo espera por você.</h2><p>Rodada {1} · {2} pontos. {3}</p><button id=\"begin\">Retomar operação →</button>",
    "en": "<span class=\"eyebrow\">{0}</span><h2>Monte Castelo awaits.</h2><p>Round {1} · {2} points. {3}</p><button id=\"begin\">Resume operation →</button>"
  },
  "app.098": {
    "pt": "TURNO RECEBIDO",
    "en": "TURN RECEIVED"
  },
  "app.099": {
    "pt": "OPERAÇÃO SALVA",
    "en": "SAVED OPERATION"
  },
  "app.100": {
    "pt": "Você comanda a FEB.",
    "en": "You command the FEB."
  },
  "app.101": {
    "pt": "Você comanda a defesa alemã.",
    "en": "You command the German defense."
  },
  "app.102": {
    "pt": "Sua experiência e sua operação foram mantidas neste navegador.",
    "en": "Your experience and operation have been preserved in this browser."
  },
  "app.103": {
    "pt": "<span class=\"eyebrow\">AUTORIA & LICENÇA</span><img class=\"narrative-logo\" src=\"{0}\" alt=\"Distintivo oficial da Força Expedicionária Brasileira\"><h2>Monte Castelo Vibed</h2><div class=\"ludes-credit\"><img src=\"{1}\" alt=\"Logo oficial do LUDES\" width=\"300\" height=\"76\"><a href=\"https://ludes.cos.ufrj.br/\" target=\"_blank\" rel=\"noopener\">LUDES · UFRJ</a></div><p><b>Autoria e concepção:</b> Geraldo Xexéo (xexeo).<br><b>Desenvolvimento:</b> realizado com assistência de IA, a partir das orientações do autor.</p><p>Copyright © 2026 Geraldo Xexéo (xexeo).</p><p class=\"muted\">Versão {2} · {3} · Brasília</p><h3>CC BY-NC-SA 4.0</h3><p>Creative Commons Atribuição–NãoComercial–CompartilhaIgual 4.0 Internacional. Você pode compartilhar e adaptar este trabalho com atribuição, para fins não comerciais e distribuindo adaptações sob a mesma licença.</p><p><a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br\" target=\"_blank\" rel=\"noopener\">Resumo oficial da licença</a> · <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.pt\" target=\"_blank\" rel=\"noopener\">Termos oficiais em português</a></p><details><summary>Texto integral da licença (disponível offline)</summary><pre class=\"license-text\">{4}</pre></details><p class=\"muted\">O distintivo histórico da FEB é reproduzido com os créditos e condições da fonte indicados na Homenagem. O jogo é independente e não implica endosso institucional. O logo LUDES é a imagem institucional fornecida pelo autor. A licença do jogo não concede direitos sobre marcas e logotipos institucionais.</p>",
    "en": "<span class=\"eyebrow\">CREDITS & LICENSE</span><img class=\"narrative-logo\" src=\"{0}\" alt=\"Official Brazilian Expeditionary Force emblem\"><h2>Monte Castelo Vibed</h2><div class=\"ludes-credit\"><img src=\"{1}\" alt=\"Official LUDES logo\" width=\"300\" height=\"76\"><a href=\"https://ludes.cos.ufrj.br/\" target=\"_blank\" rel=\"noopener\">LUDES · UFRJ</a></div><p><b>Author and concept:</b> Geraldo Xexéo (xexeo).<br><b>Development:</b> created with AI assistance following the author’s direction.</p><p>Copyright © 2026 Geraldo Xexéo (xexeo).</p><p class=\"muted\">Version {2} · {3} · Brasília</p><h3>CC BY-NC-SA 4.0</h3><p>Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International. You may share and adapt this work with attribution for noncommercial purposes, distributing adaptations under the same license.</p><p><a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en\" target=\"_blank\" rel=\"noopener\">Official license summary</a> · <a href=\"https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en\" target=\"_blank\" rel=\"noopener\">Official English legal terms</a></p><details><summary>Full license text (available offline)</summary><pre class=\"license-text\" lang=\"en\">{4}</pre></details><p class=\"muted\">The historical FEB emblem is reproduced with the source credits and conditions listed in Tribute. This independent game does not imply institutional endorsement. The LUDES logo is the institutional image supplied by the author. The game license grants no rights to institutional trademarks or logos.</p>"
  },
  "app.104": {
    "pt": "<span class=\"eyebrow\">EXPERIÊNCIA DO COMANDANTE</span><h2>Uma IA que leva suas lições adiante</h2><p>{0} partidas de experiência · {1} atualizações · {2} situações aprendidas.</p><p>A IA especial já vem treinada em {3} partidas de autojogo. Aprende a escolher estratégia e postura conforme fase, forças, pontos e ocupação. Continua aprendendo aqui; a experiência fica neste navegador. Não há sincronização automática entre aparelhos.</p><button id=\"exportMemory\">Exportar experiência</button><p><label for=\"importMemory\">Importar experiência salva</label><input id=\"importMemory\" type=\"file\" accept=\"application/json,.json\"></p><p id=\"importResult\" aria-live=\"polite\"></p>",
    "en": "<span class=\"eyebrow\">COMMANDER EXPERIENCE</span><h2>An AI that carries its lessons forward</h2><p>{0} games of experience · {1} updates · {2} learned situations.</p><p>The veteran AI comes trained on {3} self-play games. It learns to choose strategy and stance based on phase, forces, points, and occupation. It keeps learning here; experience stays in this browser. There is no automatic synchronization between devices.</p><button id=\"exportMemory\">Export experience</button><p><label for=\"importMemory\">Import saved experience</label><input id=\"importMemory\" type=\"file\" accept=\"application/json,.json\"></p><p id=\"importResult\" aria-live=\"polite\"></p>"
  },
  "app.105": {
    "pt": "Arquivo ausente ou muito grande.",
    "en": "File missing or too large."
  },
  "app.106": {
    "pt": "Arquivo de experiência incompatível.",
    "en": "Incompatible experience file."
  },
  "app.107": {
    "pt": "Experiência importada. Será usada no próximo turno.",
    "en": "Experience imported. It will be used next turn."
  },
  "app.108": {
    "pt": "Não foi possível importar.",
    "en": "Unable to import."
  },
  "app.109": {
    "pt": "<span class=\"eyebrow\">HUMANO × HUMANO · TURNO ASSÍNCRONO</span><h2>Passe o comando.</h2><p>O próximo turno é {0}. Envie o link ou arquivo ao seu oponente; ele abre o jogo e assume esse lado. Quando terminar, ele envia o próximo turno de volta.</p>{1}<button id=\"downloadTurn\">Baixar arquivo do turno</button><p id=\"shareStatus\" aria-live=\"polite\"></p><p class=\"muted\">Modo assíncrono, sem servidor de partida. Cada envio é uma fotografia do estado; continuem sempre a partir do último turno recebido.</p>",
    "en": "<span class=\"eyebrow\">HUMAN × HUMAN · ASYNCHRONOUS TURN</span><h2>Pass command.</h2><p>The next turn belongs to {0}. Send the link or file to your opponent; they open the game and take command of that side. When finished, they send the next turn back.</p>{1}<button id=\"downloadTurn\">Download turn file</button><p id=\"shareStatus\" aria-live=\"polite\"></p><p class=\"muted\">Asynchronous mode with no game server. Each transfer is a snapshot; always continue from the latest received turn.</p>"
  },
  "app.110": {
    "pt": "da FEB",
    "en": "the FEB"
  },
  "app.111": {
    "pt": "da defesa alemã",
    "en": "the German defense"
  },
  "app.112": {
    "pt": "<a class=\"share-link\" href=\"https://wa.me/?text={0}\" target=\"_blank\" rel=\"noopener\">Enviar pelo WhatsApp ↗</a><button id=\"copyTurn\">Copiar link do turno</button>",
    "en": "<a class=\"share-link\" href=\"https://wa.me/?text={0}\" target=\"_blank\" rel=\"noopener\">Send through WhatsApp ↗</a><button id=\"copyTurn\">Copy turn link</button>"
  },
  "app.113": {
    "pt": "Monte Castelo Vibed · rodada ",
    "en": "Monte Castelo Vibed · round "
  },
  "app.114": {
    "pt": " · seu turno! ",
    "en": " · your turn! "
  },
  "app.115": {
    "pt": "<p>Esta cópia está aberta offline ou em endereço local. Use o arquivo de turno; para enviar um link, abra a versão publicada no GitHub Pages.</p>",
    "en": "<p>This copy is open offline or at a local address. Use the turn file; to send a link, open the published GitHub Pages version.</p>"
  },
  "app.116": {
    "pt": "Link copiado.",
    "en": "Link copied."
  },
  "app.117": {
    "pt": "Use o botão do WhatsApp ou baixe o turno.",
    "en": "Use the WhatsApp button or download the turn."
  },
  "app.118": {
    "pt": "Arquivo inválido.",
    "en": "Invalid file."
  },
  "app.119": {
    "pt": "Turno incompatível.",
    "en": "Incompatible turn."
  },
  "app.120": {
    "pt": "<h2>Turno recebido</h2><p>Rodada {0}. Você comanda {1}.</p>",
    "en": "<h2>Turn received</h2><p>Round {0}. You command {1}.</p>"
  },
  "app.121": {
    "pt": "a defesa alemã",
    "en": "the German defense"
  },
  "app.122": {
    "pt": "<h2>Não foi possível abrir o turno</h2><p>{0}</p>",
    "en": "<h2>Unable to open turn</h2><p>{0}</p>"
  },
  "app.123": {
    "pt": "Arquivo inválido.",
    "en": "Invalid file."
  },
  "app.124": {
    "pt": "<span class=\"eyebrow\">21 FEV 1945 · HORÁRIO LOCAL DA ITÁLIA (UTC+1)</span><h2>O tempo no último ataque</h2><p>A reconstrução regional ERA5, distribuída pelo Open-Meteo, sugere uma madrugada muito fria e nublada, abertura pela manhã e céu aberto à tarde. É um modelo retrospectivo, não um diário meteorológico medido no campo de batalha.</p><div class=\"weather-table\"><table><thead><tr><th>Hora</th><th>Temperatura</th><th>Nuvens</th><th>Precipitação</th></tr></thead><tbody>{0}</tbody></table></div><p>O modelo indica 0 mm de precipitação e 0 cm de neve nova no dia. Isso não demonstra ausência de neve acumulada: a série de profundidade da neve retornou sem dados. Vento modelado às 14h: 9,3 km/h. Não tratamos nebulosidade como nevoeiro nem deduzimos solo seco apenas da ausência de chuva.</p><p>Nascer do sol calculado: 07:05; pôr do sol: 17:53, sem considerar obstruções das montanhas. O relógio de jogo e o apoio de artilharia são simplificações da operação.</p><p>Consulta para 44,221799°N / 10,954227°E; resposta regional 44,25°N / 11,00°E, elevação informada 954 m. Resolução ERA5: 0,25° (~25 km). A escala não resolve as encostas nem o microclima de Monte Castelo.</p><p>Um resultado indexado do Blog do Exército descreve o dia como ensolarado; o texto integral retornou 503. A BBC descreve o frio no contexto da campanha, sem medição diária. Essas evidências foram separadas no registro histórico.</p><p><a href=\"{1}\" target=\"_blank\" rel=\"noopener\">Consulta reproduzível dos dados</a> · <a href=\"https://open-meteo.com/en/docs/historical-weather-api\" target=\"_blank\" rel=\"noopener\">Documentação Open-Meteo</a> · <a href=\"https://www.bbc.com/portuguese/articles/c3d8v1jmyryo\" target=\"_blank\" rel=\"noopener\">Reportagem BBC</a></p><p class=\"muted\">Dados: Open-Meteo / ECMWF ERA5, com atribuição às fontes. O jogo incorpora uma cópia e não depende de conexão com uma API meteorológica para funcionar.</p>",
    "en": "<span class=\"eyebrow\">FEB 21, 1945 · ITALIAN LOCAL TIME (UTC+1)</span><h2>Weather during the final attack</h2><p>The regional ERA5 reconstruction, distributed by Open-Meteo, suggests a very cold and cloudy early morning, clearing during the morning and clear afternoon skies. This is a retrospective model, not a weather diary measured on the battlefield.</p><div class=\"weather-table\"><table><thead><tr><th>Time</th><th>Temperature</th><th>Cloud cover</th><th>Precipitation</th></tr></thead><tbody>{0}</tbody></table></div><p>The model indicates 0 mm of precipitation and 0 cm of new snow that day. This does not establish an absence of accumulated snow: the snow-depth series returned no data. Modeled wind at 14:00: 9.3 km/h. We do not equate clouds with fog or infer dry ground solely from the absence of rain.</p><p>Calculated sunrise: 07:05; sunset: 17:53, excluding mountain obstructions. The game clock and artillery support simplify the operation.</p><p>Query: 44.221799°N / 10.954227°E; regional response: 44.25°N / 11.00°E, reported elevation 954 m. ERA5 resolution: 0.25° (~25 km). This scale cannot resolve Monte Castelo’s slopes or microclimate.</p><p>An indexed Army Blog result describes a sunny day; the full text returned HTTP 503. The BBC describes cold during the campaign without a daily measurement. These sources are distinguished in the historical record.</p><p><a href=\"{1}\" target=\"_blank\" rel=\"noopener\">Reproducible data query</a> · <a href=\"https://open-meteo.com/en/docs/historical-weather-api\" target=\"_blank\" rel=\"noopener\">Open-Meteo documentation</a> · <a href=\"https://www.bbc.com/portuguese/articles/c3d8v1jmyryo\" target=\"_blank\" rel=\"noopener\">BBC report</a></p><p class=\"muted\">Data: Open-Meteo / ECMWF ERA5, with source attribution. The game includes a copy and works without a connection to a weather API.</p>"
  },
  "app.126": {
    "pt": "<span class=\"eyebrow\">GEOGRAFIA & FONTES DO MAPA</span><h2>Um campo de batalha com lugar real</h2><p>O hexágono de Monte Castelo está ancorado em 44,2206238°N / 10,9537700°E, ponto de cume registrado no OpenStreetMap com cota 977 m. Cada centro de hexágono recebeu uma amostra do Copernicus DEM GLO-90 (90 m), via Open-Meteo. A distância entre centros vizinhos é aproximadamente 180 m.</p><p>Os traçados de caminhos, bosques, edifícios e localidades vêm de uma fotografia atual do OpenStreetMap. Eles ajudam a representar o lugar, mas não demonstram o que existia em 1945. As fortificações e posições militares continuam sendo abstrações de cenário; as curvas são generalizadas entre amostras, não curvas de nível de precisão.</p><h3>Mapa da história oficial do Exército dos EUA</h3><img class=\"historic-map\" src=\"{0}\" alt=\"Mapa 10 da história oficial Cassino to the Alps, Operação Encore, 19 de fevereiro a 5 de março de 1945\"><p>Ernest F. Fisher Jr., <i>Cassino to the Alps</i>, U.S. Army Center of Military History, mapa 10, cartografia de R. Clinton. Mostra Monte Castello, Belvedere e della Torraccia, eixos de ataque e curvas de nível. Escala operacional: não localiza cada destacamento neste tabuleiro.</p><p><a href=\"https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/USA-MTO-Cassino-24.html\" target=\"_blank\" rel=\"noopener\">História oficial, capítulo XXIV (cópia HyperWar)</a> · <a href=\"https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/maps/USA-MTO-Cassino-10.jpg\" target=\"_blank\" rel=\"noopener\">Mapa 10 original</a></p><p>A p. 431 descreve retirada alemã precipitada pelo avanço americano e resistência final de uma pequena retaguarda. A defesa integral do jogo é uma abstração, não uma reprodução literal dos efetivos naquele momento. A memória de Mascarenhas foi localizada em catálogos da BIBLIEx, mas seus mapas integrais ainda não foram consultados.</p><h3>Referência complementar</h3><img class=\"historic-map\" src=\"{1}\" alt=\"Mapa histórico dos movimentos da 10ª Divisão de Montanha em Riva Ridge, Belvedere e Torraccia, com Monte Castello a leste\"><p class=\"muted\">Armand Casini, panfleto Mountaineers, c.1950. Domínio público conforme metadados do Wikimedia Commons. É uma perspectiva regional, não o levantamento topográfico deste tabuleiro.</p><p><a href=\"https://commons.wikimedia.org/wiki/File:10thMtMap01.jpg\" target=\"_blank\" rel=\"noopener\">Mapa histórico e metadados</a> · <a href=\"https://www.openstreetmap.org/node/5245929042\" target=\"_blank\" rel=\"noopener\">Cume no OpenStreetMap</a> · <a href=\"https://open-meteo.com/en/docs/elevation-api\" target=\"_blank\" rel=\"noopener\">Copernicus DEM / Open-Meteo</a></p><p class=\"muted\">© OpenStreetMap contributors, dados sob ODbL 1.0; Copernicus DEM 2021 GLO-90. As licenças desses dados permanecem próprias, separadas da licença do código do jogo.</p><p><a href=\"https://memorialdademocracia.com.br/card/feb-conquista-o-monte-castelo\" target=\"_blank\" rel=\"noopener\">Consultar o roteiro histórico da FEB no Memorial da Democracia</a></p>",
    "en": "<span class=\"eyebrow\">GEOGRAPHY & MAP SOURCES</span><h2>A battlefield in a real place</h2><p>The Monte Castelo hex is anchored at 44.2206238°N / 10.9537700°E, a summit recorded by OpenStreetMap at 977 m. Each hex center has a Copernicus DEM GLO-90 (90 m) sample supplied through Open-Meteo. Neighboring centers are approximately 180 m apart.</p><p>Paths, woods, buildings, and settlements come from a present-day OpenStreetMap snapshot. They help depict the place but do not establish what existed in 1945. Fortifications and military positions remain scenario abstractions; contours are generalized between samples rather than precise survey contours.</p><h3>Map from the official U.S. Army history</h3><img class=\"historic-map\" src=\"{0}\" alt=\"Map 10 from the official history Cassino to the Alps: Operation Encore, February 19–March 5, 1945\"><p>Ernest F. Fisher Jr., <i>Cassino to the Alps</i>, U.S. Army Center of Military History, map 10, cartography by R. Clinton. Shows Monte Castello, Belvedere, and della Torraccia, attack axes, and contours. Its operational scale does not locate each detachment on this board.</p><p><a href=\"https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/USA-MTO-Cassino-24.html\" target=\"_blank\" rel=\"noopener\">Official history, chapter XXIV (HyperWar copy)</a> · <a href=\"https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/maps/USA-MTO-Cassino-10.jpg\" target=\"_blank\" rel=\"noopener\">Original map 10</a></p><p>Page 431 describes a German withdrawal prompted by the American advance and final resistance by a small rear guard. The full defense in the game is an abstraction rather than a literal reproduction of the strength present then. Mascarenhas’s memoir was located in BIBLIEx catalogs, but its complete maps have not yet been consulted.</p><h3>Additional reference</h3><img class=\"historic-map\" src=\"{1}\" alt=\"Historical map of 10th Mountain Division movements at Riva Ridge, Belvedere, and Torraccia, with Monte Castello to the east\"><p class=\"muted\">Armand Casini, Mountaineers pamphlet, c. 1950. Public domain according to Wikimedia Commons metadata. This is a regional perspective rather than a topographic survey of this board.</p><p><a href=\"https://commons.wikimedia.org/wiki/File:10thMtMap01.jpg\" target=\"_blank\" rel=\"noopener\">Historical map and metadata</a> · <a href=\"https://www.openstreetmap.org/node/5245929042\" target=\"_blank\" rel=\"noopener\">Summit on OpenStreetMap</a> · <a href=\"https://open-meteo.com/en/docs/elevation-api\" target=\"_blank\" rel=\"noopener\">Copernicus DEM / Open-Meteo</a></p><p class=\"muted\">© OpenStreetMap contributors, data under ODbL 1.0; Copernicus DEM 2021 GLO-90. These data retain their own licenses, separate from the game code’s license.</p><p><a href=\"https://memorialdademocracia.com.br/card/feb-conquista-o-monte-castelo\" target=\"_blank\" rel=\"noopener\">View the historical FEB campaign route at Memorial da Democracia</a></p>"
  },
  "app.127": {
    "pt": "<span class=\"eyebrow\">ESCALA DAS TROPAS · NÍVEIS TÁTICOS</span><h2>Forças e níveis</h2>{0}<p>A infantaria usa batalhões ou companhias conforme a escala selecionada; a artilharia, grupos de fogos. O apoio do Sampaio agrega armas coletivas e não inventa um quarto batalhão. Os destacamentos alemães agregam forças da 232ª DI do Heer, com escalão exato não confirmado; não se afirmam três batalhões completos no cume.</p><p>T1 = destacamento reduzido; T2 = operacional; T3 = especializado em fogos. São perfis de jogo, sem bônus ocultos e sem afirmar uma nota histórica de cada comandante. Os três batalhões do Sampaio recebem a mesma classe operacional.</p><div class=\"roster-table\"><table><thead><tr><th>Tropa</th><th>Escalão</th><th>T</th><th>A</th><th>D</th><th>PM</th><th>Alcance</th><th>Ocupa</th></tr></thead><tbody>{1}</tbody></table></div><p>A defesa preparada vem da fortificação e do terreno. A reserva T1 representa menor força disponível, sem concluir que os soldados fossem inexperientes. A artilharia tem alto poder de fogo e defesa próxima baixa; o alcance é uma abstração de disponibilidade de apoio, não alcance balístico real.</p><p>Os novos perfis valem para novas partidas. Partidas salvas mantêm seus atributos; o aprendizado local não é apagado.</p><p><a href=\"https://en.wikipedia.org/wiki/Battle_of_Monte_Castello\" target=\"_blank\" rel=\"noopener\">Batalhões no ataque final</a> · <a href=\"https://en.wikipedia.org/wiki/232nd_Infantry_Division_(Wehrmacht)\" target=\"_blank\" rel=\"noopener\">Organização da 232ª DI</a> · <a href=\"https://github.com/xexeo/wargameBrasil/blob/main/docs/TROPAS.md\" target=\"_blank\" rel=\"noopener\">Fontes, critérios e valores editáveis</a></p>",
    "en": "<span class=\"eyebrow\">TROOP SCALE · TACTICAL LEVELS</span><h2>Forces and levels</h2>{0}<p>Infantry uses battalions or companies according to the selected scale; artillery uses allocated fire groups. Sampaio support aggregates crew-served weapons rather than inventing a fourth battalion. German detachments aggregate forces from the Heer’s 232nd Infantry Division; their exact echelon is unconfirmed. Three complete battalions are not asserted to have held the summit.</p><p>T1 = reduced detachment; T2 = operational; T3 = fire specialist. These are game profiles without hidden bonuses or historical ratings of individual commanders. All three Sampaio battalions receive the same operational class.</p><div class=\"roster-table\"><table><thead><tr><th>Troop</th><th>Echelon</th><th>T</th><th>A</th><th>D</th><th>MP</th><th>Range</th><th>Captures</th></tr></thead><tbody>{1}</tbody></table></div><p>Prepared defense comes from fortifications and terrain. The T1 reserve represents lower available strength without concluding that its soldiers were inexperienced. Artillery has strong firepower and weak close defense; range abstracts available support rather than actual ballistic range.</p><p>New profiles apply to new games. Saved games retain their attributes; local learning is preserved.</p><p><a href=\"https://en.wikipedia.org/wiki/Battle_of_Monte_Castello\" target=\"_blank\" rel=\"noopener\">Battalions in the final attack</a> · <a href=\"https://en.wikipedia.org/wiki/232nd_Infantry_Division_(Wehrmacht)\" target=\"_blank\" rel=\"noopener\">232nd Infantry Division organization</a> · <a href=\"https://github.com/xexeo/wargameBrasil/blob/main/docs/TROPAS.md\" target=\"_blank\" rel=\"noopener\">Sources, criteria, and editable values</a></p>"
  },
  "app.129": {
    "pt": "não",
    "en": "no"
  },
  "app.130": {
    "pt": "<p class=\"support-explanation\"><b>Apoio Sampaio: ramo de infantaria.</b> Uma única peça agrega metralhadoras e morteiros orgânicos de 81 e 60 mm, distribuídos historicamente entre batalhões e companhias. Não representa um quarto batalhão nem uma unidade autônoma comprovada no ataque. O alcance de 2 hexágonos (cerca de 360 m entre centros) abstrai apoio disponível ao setor; não é o alcance balístico dessas armas. Composição, posição e disponibilidade exatas neste tabuleiro são escolhas de cenário.</p><p><a href=\"https://museuvirtualdafeb.eb.mil.br/estrutura-organizacional-da-forca-expedicionaria-brasileira/\" target=\"_blank\" rel=\"noopener\">Museu Virtual da FEB · estrutura organizacional</a></p>",
    "en": "<p class=\"support-explanation\"><b>Sampaio support: infantry branch.</b> One counter aggregates organic machine guns and 81 mm and 60 mm mortars historically distributed among battalions and companies. It represents neither a fourth battalion nor a verified independent unit in the attack. Its 2-hex range (about 360 m between centers) abstracts support available to the sector rather than those weapons’ ballistic range. Exact composition, position, and availability on this board are scenario choices.</p><p><a href=\"https://museuvirtualdafeb.eb.mil.br/estrutura-organizacional-da-forca-expedicionaria-brasileira/\" target=\"_blank\" rel=\"noopener\">FEB Virtual Museum · organizational structure</a></p>"
  },
  "app.131": {
    "pt": "<h3>Perdas nesta partida</h3><div class=\"loss-comparison\"><table><thead><tr><th>Medida do jogo</th><th>FEB</th><th>Alemanha</th></tr></thead><tbody><tr><th>Peças fora de combate</th><td>{0}/{1}</td><td>{2}/{3}</td></tr><tr><th>Coesão perdida (PV)</th><td>{4}/{5}</td><td>{6}/{7}</td></tr><tr><th>Peças que recuaram</th><td>{8}</td><td>{9}</td></tr></tbody></table></div><p>Peças fora de combate e pontos de coesão são medidas do jogo. Não equivalem a soldados mortos, feridos ou desaparecidos. Recuos registrados contam peças distintas; não são baixas humanas.</p>",
    "en": "<h3>Losses in this game</h3><div class=\"loss-comparison\"><table><thead><tr><th>Game measure</th><th>FEB</th><th>Germany</th></tr></thead><tbody><tr><th>Counters out of action</th><td>{0}/{1}</td><td>{2}/{3}</td></tr><tr><th>Cohesion lost (HP)</th><td>{4}/{5}</td><td>{6}/{7}</td></tr><tr><th>Counters that withdrew</th><td>{8}</td><td>{9}</td></tr></tbody></table></div><p>Counters out of action and cohesion points are game measures. They do not represent soldiers killed, wounded, or missing. Recorded withdrawals count distinct counters rather than human casualties.</p>"
  },
  "app.132": {
    "pt": "não registrado",
    "en": "not recorded"
  },
  "app.133": {
    "pt": "não registrado",
    "en": "not recorded"
  },
  "app.134": {
    "pt": "Não confirmado",
    "en": "Unconfirmed"
  },
  "app.135": {
    "pt": "Retirada registrada; total não confirmado",
    "en": "Withdrawal recorded; total unconfirmed"
  },
  "app.136": {
    "pt": "Não confirmado",
    "en": "Unconfirmed"
  },
  "app.137": {
    "pt": "<h3>Comparação histórica: baixas humanas</h3><p>{0}. Os registros acessíveis não permitem preencher as contagens diárias abaixo. “Não confirmado” não significa zero.</p><div class=\"loss-comparison historical-losses\"><table><thead><tr><th>Categoria histórica</th><th>FEB</th><th>Alemanha</th></tr></thead><tbody><tr><th>Mortos</th><td>{1}</td><td>{2}</td></tr><tr><th>Feridos</th><td>{3}</td><td>{4}</td></tr><tr><th>Prisioneiros</th><td>{5}</td><td>{6}</td></tr><tr><th>Retirados</th><td>{7}</td><td>{8}</td></tr></tbody></table></div><p><b>FEB:</b> {9}</p><p><b>Alemanha:</b> {10}</p><details class=\"historical-context\"><summary>Totais de outro escopo: contexto documental</summary>{11}</details><p class=\"historical-sources\">{12}</p>",
    "en": "<h3>Historical comparison: human casualties</h3><p>{0}. Accessible records do not establish the daily counts below. “Unconfirmed” does not mean zero.</p><div class=\"loss-comparison historical-losses\"><table><thead><tr><th>Historical category</th><th>FEB</th><th>Germany</th></tr></thead><tbody><tr><th>Killed</th><td>{1}</td><td>{2}</td></tr><tr><th>Wounded</th><td>{3}</td><td>{4}</td></tr><tr><th>Prisoners</th><td>{5}</td><td>{6}</td></tr><tr><th>Withdrawn</th><td>{7}</td><td>{8}</td></tr></tbody></table></div><p><b>FEB:</b> {9}</p><p><b>Germany:</b> {10}</p><details class=\"historical-context\"><summary>Totals with a different scope: documentary context</summary>{11}</details><p class=\"historical-sources\">{12}</p>"
  },
  "app.138": {
    "pt": "<p><b>{0}:</b> {1} baixas — {2} mortos, {3} feridos e {4} desaparecidos.</p><p>{5}</p>",
    "en": "<p><b>{0}:</b> {1} casualties — {2} killed, {3} wounded, and {4} missing.</p><p>{5}</p>"
  },
  "term.Agrupamento": {
    "pt": "Agrupamento",
    "en": "Grouping"
  },
  "term.Infantaria": {
    "pt": "Infantaria",
    "en": "Infantry"
  },
  "term.Artilharia": {
    "pt": "Artilharia",
    "en": "Artillery"
  },
  "term.azul": {
    "pt": "FEB",
    "en": "FEB"
  },
  "term.sim": {
    "pt": "sim",
    "en": "yes"
  },
  "ui.134": {
    "pt": "Distintivo oficial da Força Expedicionária Brasileira",
    "en": "Official Brazilian Expeditionary Force emblem"
  },
  "ui.135": {
    "pt": "BRASIL NA SEGUNDA GUERRA · 21 FEV 1945",
    "en": "BRAZIL IN WORLD WAR II · FEB 21, 1945"
  },
  "ui.136": {
    "pt": "Operação Encore",
    "en": "Operation Encore"
  },
  "ui.137": {
    "pt": "Missão",
    "en": "Mission"
  },
  "ui.138": {
    "pt": "Autoria & licença",
    "en": "Credits & license"
  },
  "ui.139": {
    "pt": "Regras & história",
    "en": "Rules & history"
  },
  "ui.140": {
    "pt": "Homenagem",
    "en": "Tribute"
  },
  "ui.141": {
    "pt": "Idioma",
    "en": "Language"
  },
  "ui.142": {
    "pt": "VOCÊ COMANDA A FEB",
    "en": "YOU COMMAND THE FEB"
  },
  "ui.143": {
    "pt": "Sua vez de avançar",
    "en": "Your turn to advance"
  },
  "ui.144": {
    "pt": "Selecione uma unidade brasileira para começar.",
    "en": "Select a Brazilian unit to begin."
  },
  "ui.145": {
    "pt": "21 FEV · HORA",
    "en": "FEB 21 · TIME"
  },
  "ui.146": {
    "pt": "RODADA",
    "en": "ROUND"
  },
  "ui.147": {
    "pt": "PONTOS ACUMULADOS",
    "en": "ACCUMULATED POINTS"
  },
  "ui.148": {
    "pt": "＋ Nova partida",
    "en": "＋ New game"
  },
  "ui.149": {
    "pt": "⚑ MISSÃO: TOME E SEGURE MONTE CASTELO",
    "en": "⚑ MISSION: CAPTURE AND HOLD MONTE CASTELO"
  },
  "ui.150": {
    "pt": "A infantaria deve assegurar o cume. Os pontos acumulados e o prazo da missão aparecem aqui.",
    "en": "Infantry must secure the summit. Accumulated points and the mission deadline appear here."
  },
  "ui.151": {
    "pt": "Consultar reconstrução meteorológica da batalha",
    "en": "View reconstructed battle weather"
  },
  "ui.152": {
    "pt": "SETOR DOS APENINOS · ITÁLIA",
    "en": "APENNINES SECTOR · ITALY"
  },
  "ui.153": {
    "pt": "Mapa & fontes",
    "en": "Map & sources"
  },
  "ui.154": {
    "pt": "Mapa inteiro",
    "en": "Entire map"
  },
  "ui.155": {
    "pt": "Visão tática",
    "en": "Tactical view"
  },
  "ui.156": {
    "pt": "Zoom contínuo",
    "en": "Continuous zoom"
  },
  "ui.157": {
    "pt": "Diminuir zoom",
    "en": "Zoom out"
  },
  "ui.158": {
    "pt": "Aumentar zoom",
    "en": "Zoom in"
  },
  "ui.159": {
    "pt": "Legenda da altitude",
    "en": "Elevation key"
  },
  "ui.160": {
    "pt": "Subir +{0} PM/nível · defender acima +1",
    "en": "Climb +{0} MP/level · defend higher +1"
  },
  "ui.161": {
    "pt": "Mapa hexagonal de Monte Castelo",
    "en": "Hex map of Monte Castelo"
  },
  "ui.162": {
    "pt": "Comando do turno no mapa",
    "en": "Map turn controls"
  },
  "ui.163": {
    "pt": "Concluiu suas ordens?",
    "en": "Finished giving orders?"
  },
  "ui.164": {
    "pt": "Encerrar turno →",
    "en": "End turn →"
  },
  "ui.165": {
    "pt": "▧ Mata · movimento 2",
    "en": "▧ Woods · movement 2"
  },
  "ui.166": {
    "pt": "↑ Altitude · subida +PM · defesa +1",
    "en": "↑ Elevation · climb +MP · defense +1"
  },
  "ui.167": {
    "pt": "━ Estrada · movimento 1",
    "en": "━ Road · movement 1"
  },
  "ui.168": {
    "pt": "■ FEB · azul",
    "en": "■ FEB · blue"
  },
  "ui.169": {
    "pt": "■ Alemães · carvão",
    "en": "■ Germans · charcoal"
  },
  "ui.170": {
    "pt": "CENTRO DE COMANDO",
    "en": "COMMAND CENTER"
  },
  "ui.171": {
    "pt": "A cobra vai fumar.",
    "en": "The smoking snakes are ready."
  },
  "ui.172": {
    "pt": "Toque numa peça verde, depois num hexágono iluminado para mover ou num inimigo marcado para atacar.",
    "en": "Tap a blue counter, then a highlighted hex to move or a marked enemy to attack."
  },
  "ui.173": {
    "pt": "Toque duas vezes numa peça para ampliá-la.",
    "en": "Double-tap a counter to enlarge it."
  },
  "ui.174": {
    "pt": "Forças e níveis · escala das tropas",
    "en": "Forces and levels · troop scale"
  },
  "ui.175": {
    "pt": "MODO DE JOGO",
    "en": "GAME MODE"
  },
  "ui.176": {
    "pt": "Humano FEB × computador alemão",
    "en": "Human FEB × German computer"
  },
  "ui.177": {
    "pt": "Computador FEB × humano alemão",
    "en": "FEB computer × German human"
  },
  "ui.178": {
    "pt": "Dois humanos · mesmo aparelho",
    "en": "Two humans · same device"
  },
  "ui.179": {
    "pt": "Humano × humano · à distância",
    "en": "Human × human · remote"
  },
  "ui.180": {
    "pt": "Enviar turno · WhatsApp",
    "en": "Send turn · WhatsApp"
  },
  "ui.181": {
    "pt": "Abrir arquivo de turno",
    "en": "Open turn file"
  },
  "ui.182": {
    "pt": "COMANDANTE INIMIGO",
    "en": "COMPUTER COMMANDER"
  },
  "ui.183": {
    "pt": "Estado-maior · tática avançada",
    "en": "General staff · advanced tactics"
  },
  "ui.184": {
    "pt": "Caçador · maior ataque",
    "en": "Hunter · highest attack"
  },
  "ui.185": {
    "pt": "Oportunista · menor defesa",
    "en": "Opportunist · lowest defense"
  },
  "ui.186": {
    "pt": "Veterana · IA especial treinada",
    "en": "Veteran · specially trained AI"
  },
  "ui.187": {
    "pt": "Aprendiz · aprende neste navegador",
    "en": "Learner · learns in this browser"
  },
  "ui.188": {
    "pt": "POSTURA DE MOVIMENTO",
    "en": "MOVEMENT STANCE"
  },
  "ui.189": {
    "pt": "Defensiva · proteger elevações",
    "en": "Defensive · protect heights"
  },
  "ui.190": {
    "pt": "Agressiva · aproximar e atacar",
    "en": "Aggressive · close in and attack"
  },
  "ui.191": {
    "pt": "Experiência da IA · exportar / importar",
    "en": "AI experience · export / import"
  },
  "ui.192": {
    "pt": "Nova operação",
    "en": "New operation"
  },
  "ui.193": {
    "pt": "DIÁRIO DE OPERAÇÕES",
    "en": "OPERATIONS JOURNAL"
  },
  "ui.194": {
    "pt": "Versão e data da edição",
    "en": "Release version and date"
  },
  "ui.195": {
    "pt": "Um jogo tático de 5–10 minutos. Cenário histórico, escala e forças simplificadas.",
    "en": "A 5–10 minute tactical game. Historical scenario with simplified scale and forces."
  },
  "ui.196": {
    "pt": "Fechar janela",
    "en": "Close dialog"
  },
  "weather.chip": {
    "pt": "{0} ERA5 regional · ~{1} °C · {2}% nuvens · {3}h",
    "en": "{0} Regional ERA5 · ~{1} °C · {2}% clouds · {3}:00"
  },
  "error.json": {
    "pt": "O arquivo não contém JSON válido.",
    "en": "The file does not contain valid JSON."
  },
  "tribute.dialog": {
    "pt": "<span class=\"eyebrow\">HOMENAGEM</span><h2>Pedro Henrique de Figueiredo Bonorino</h2><figure class=\"tribute-portrait\"><img src=\"{4}\" alt=\"Retrato de Pedro Henrique de Figueiredo Bonorino\" style=\"display:block;width:min(100%,340px);height:auto;margin:auto;border-radius:4px\"><figcaption>Fotografia fornecida pelo autor da homenagem.</figcaption></figure><p>Este jogo é uma homenagem a Pedro Henrique de Figueiredo Bonorino, à época tenente de Infantaria do 6º Regimento de Infantaria, integrante da Força Expedicionária Brasileira (FEB).</p><figure><img class=\"narrative-logo\" src=\"{0}\" alt=\"{1}\"><figcaption>{1}</figcaption></figure><p class=\"muted\">{3} <a href=\"{2}\" target=\"_blank\" rel=\"noopener\">Fonte do distintivo da FEB</a></p><p>As imagens conservam seus direitos e condições próprios; não são relicenciadas pela licença CC BY-NC-SA do jogo. Esta homenagem é independente e não implica endosso institucional.</p>",
    "en": "<span class=\"eyebrow\">TRIBUTE</span><h2>Pedro Henrique de Figueiredo Bonorino</h2><figure class=\"tribute-portrait\"><img src=\"{4}\" alt=\"Portrait of Pedro Henrique de Figueiredo Bonorino\" style=\"display:block;width:min(100%,340px);height:auto;margin:auto;border-radius:4px\"><figcaption>Photograph supplied by the tribute author.</figcaption></figure><p>This game is a tribute to Pedro Henrique de Figueiredo Bonorino, then an infantry lieutenant in the 6th Infantry Regiment of the Brazilian Expeditionary Force (FEB).</p><figure><img class=\"narrative-logo\" src=\"{0}\" alt=\"{1}\"><figcaption>{1}</figcaption></figure><p class=\"muted\">{3} <a href=\"{2}\" target=\"_blank\" rel=\"noopener\">FEB emblem source</a></p><p>These images retain their own rights and conditions; they are not relicensed under the game’s CC BY-NC-SA license. This independent tribute does not imply institutional endorsement.</p>"
  },
  "license.thirdParty": {
    "pt": "Recursos de terceiros: consulte os créditos e fontes.",
    "en": "Third-party resources\nOpenStreetMap data and the adapted geography database retain ODbL 1.0: https://opendatacommons.org/licenses/odbl/1-0/\n© OpenStreetMap contributors: https://www.openstreetmap.org/copyright\nElevation: Copernicus DEM 2021 GLO-90 through Open-Meteo, subject to the provider’s terms: https://open-meteo.com/en/docs/elevation-api\nThe Armand Casini historical map, Mountaineers, c. 1950, is public domain according to Wikimedia Commons. Barlow Condensed retains the SIL Open Font License in assets/fonts/OFL.txt. Institutional logos and tribute images retain their own rights as stated in their source credits. These resources are not relicensed under the game code’s CC BY-NC-SA notice."
  },
  "term.theFEB": {
    "pt": "a FEB",
    "en": "the FEB"
  },
  "phase.localWinner": {
    "pt": "Vitória da {0} · {1}",
    "en": "{0} victory · {1}"
  },
  "phase.playerWinner": {
    "pt": "Vitória! {0} · {1}",
    "en": "Victory! {0} · {1}"
  },
  "phase.playerDefeat": {
    "pt": "Derrota. Vitória da {0} · {1}",
    "en": "Defeat. {0} victory · {1}"
  },
  "victory.paths": {
    "pt": "Condições desta missão: eliminar todas as peças adversárias vence imediatamente. A FEB também pode vencer antes do prazo com {0} pontos e infantaria no cume; no fechamento da rodada {1}, assegurar o cume basta, com vitória custosa se faltar a meta de pontos.",
    "en": "Mission victory conditions: eliminating every opposing counter wins immediately. The FEB can also win early with {0} points and infantry on the summit; at the end of round {1}, securing the summit is enough, with a costly victory if the point target is unmet."
  },
  "victory.legacy": {
    "pt": "Condições preservadas desta partida antiga: {0}",
    "en": "Preserved conditions for this older game: {0}"
  },
  "symbols.title": {
    "pt": "Legenda completa dos símbolos",
    "en": "Complete symbol legend"
  },
  "symbols.intro": {
    "pt": "As formas, letras e números continuam válidos em qualquer paleta. Exemplos usam suas cores atuais.",
    "en": "Shapes, letters, and numbers keep the same meaning in every palette. Examples use your current colors."
  },
  "symbols.factions": {
    "pt": "<b>FEB / DE:</b> identificam as forças brasileira e alemã; o preenchimento distingue os lados.",
    "en": "<b>FEB / DE:</b> identify Brazilian and German forces; counter fills distinguish the sides."
  },
  "symbols.military": {
    "pt": "<b>Retângulo com X:</b> infantaria. <b>Ponto:</b> artilharia. <b>Elipse:</b> blindados, quando presentes; o cenário atual não inclui uma peça blindada.",
    "en": "<b>Rectangle with an X:</b> infantry. <b>Dot:</b> artillery. <b>Ellipse:</b> armor when present; the current scenario has no armored counter."
  },
  "symbols.echelon": {
    "pt": "<b>II:</b> batalhão ou grupo de artilharia. <b>AP:</b> apoio agregado. <b>DEST:</b> destacamento reduzido do cenário. <b>T1–T3:</b> perfil tático, de reduzido a especialista de fogo; não é patente, número de homens nem bônus oculto.",
    "en": "<b>II:</b> battalion or artillery group. <b>AP:</b> aggregated support. <b>DEST:</b> reduced scenario detachment. <b>T1–T3:</b> tactical profile, from reduced to fire specialist; not rank, manpower, or a hidden bonus."
  },
  "symbols.values": {
    "pt": "<b>A:</b> ataque base. <b>D:</b> defesa base. <b>M:</b> movimento restante. <b>2/3:</b> coesão atual de três pontos; cada perda reduz o ataque efetivo em 0,5.",
    "en": "<b>A:</b> base attack. <b>D:</b> base defense. <b>M:</b> movement remaining. <b>2/3:</b> current cohesion out of three points; each lost point reduces effective attack by 0.5."
  },
  "symbols.dots": {
    "pt": "<b>Bolinhas:</b> um ponto de coesão por bolinha. Não contam soldados individuais.",
    "en": "<b>Dots:</b> one cohesion point per dot. They do not count individual soldiers."
  },
  "symbols.damage": {
    "pt": "<b>−1 / −2 acima da peça:</b> dano acumulado. O marcador fica separado da identificação e do escalão; não representa a força de ataque.",
    "en": "<b>−1 / −2 above the counter:</b> accumulated damage. The badge is separate from identification and echelon; it is not attack strength."
  },
  "symbols.suppression": {
    "pt": "<b>S:</b> unidade suprimida por fogo indireto; não pode executar reação enquanto essa condição durar. Reorganização e reação já gasta aparecem por extenso na inspeção.",
    "en": "<b>S:</b> suppressed by indirect fire; the unit cannot react while suppressed. Reorganization and a spent reaction are written out in inspection."
  },
  "symbols.spent": {
    "pt": "<b>Risco diagonal:</b> o ataque normal desta ativação já foi usado. Na regra atual, isso não impede mover com PM restantes.",
    "en": "<b>Diagonal slash:</b> this activation’s normal attack has been used. Under current rules, remaining MP can still be spent on movement."
  },
  "symbols.selection": {
    "pt": "<b>Contorno reforçado da peça:</b> seleção ou foco; as ações mostradas se referem a essa peça.",
    "en": "<b>Heavy counter outline:</b> selection or focus; displayed actions apply to that counter."
  },
  "symbols.movement": {
    "pt": "<b>Contorno contínuo no hexágono:</b> destino alcançável com os PM atuais pelo caminho calculado. Toque para mover.",
    "en": "<b>Solid hex outline:</b> a destination reachable with current MP along the calculated route. Tap it to move."
  },
  "symbols.risk": {
    "pt": "<b>Borda tracejada no destino:</b> a rota está exposta a possível fogo defensivo de uma posição elevada. É previsão de risco, não garantia de dano nem proibição de mover.",
    "en": "<b>Dashed destination outline:</b> the route is exposed to possible defensive fire from a higher position. It predicts risk, not certain damage or prohibited movement."
  },
  "symbols.attack": {
    "pt": "<b>Barra acima do inimigo e contorno de ataque:</b> alvo legal para a peça selecionada. Toque no inimigo para atacar.",
    "en": "<b>Bar above an enemy and attack outline:</b> a legal target for the selected counter. Tap the enemy to attack."
  },
  "symbols.objective": {
    "pt": "<b>Estrela e anel tracejado:</b> objetivo. O rótulo +N/rod indica os pontos por fechamento de rodada com infantaria FEB no hexágono. Monte Castelo é o cume exigido pela missão.",
    "en": "<b>Star and dashed ring:</b> objective. The +N/round label shows points awarded at round ending with FEB infantry in the hex. Monte Castelo is the summit required by the mission."
  },
  "symbols.height": {
    "pt": "<b>N1–N4 e ~metros:</b> faixas e cota aproximada da altura amostrada. <b>Curvas:</b> linhas de mesma altitude. Subir custa mais movimento e a altura pode favorecer defesa, reação e alcance conforme as regras.",
    "en": "<b>N1–N4 and ~meters:</b> bands and approximate sampled elevation. <b>Contours:</b> lines of equal elevation. Climbing costs more movement, and height can improve defense, reaction, and range under the rules."
  },
  "symbols.forest": {
    "pt": "<b>Grupos de árvores:</b> mata do terreno simplificado; exige mais movimento e dá cobertura. As manchas suaves de bosque vêm da base geográfica atual, não de um inventário de 1945.",
    "en": "<b>Tree clusters:</b> woods in the simplified terrain; they cost extra movement and provide cover. Soft woodland areas come from present-day geographic data, not a 1945 inventory."
  },
  "symbols.fort": {
    "pt": "<b>Traços de abrigo e pequeno bloco:</b> fortificação abstrata. Aumenta a proteção do defensor; não é uma construção histórica individual confirmada.",
    "en": "<b>Shelter marks and a small block:</b> an abstract fortification. It improves defender protection; it is not an individually confirmed historical building."
  },
  "symbols.routes": {
    "pt": "<b>Linha contínua:</b> estrada. <b>Tracejado fino:</b> trilha ou caminho da base atual. Só o terreno classificado pelo motor determina custo; um traço geográfico decorativo não cria uma regra extra.",
    "en": "<b>Solid route:</b> road. <b>Thin dashes:</b> a trail or path in current geographic data. Only engine-classified terrain determines cost; a decorative geographic line creates no extra rule."
  },
  "symbols.buildings": {
    "pt": "<b>Pequenos polígonos:</b> edificações da base atual. <b>Arcos de relevo:</b> símbolo esquemático de morro. Não identificam tropas ou objetivos e não acrescentam bônus além do terreno calculado.",
    "en": "<b>Small polygons:</b> buildings in current data. <b>Relief arcs:</b> a schematic hill symbol. They do not identify troops or objectives and add no bonus beyond the calculated terrain."
  },
  "symbols.orientation": {
    "pt": "<b>N ↑:</b> norte do mapa. <b>Barra de 500 m:</b> escala geográfica aproximada. Setas em mensagens de tiro ligam quem atira ao alvo.",
    "en": "<b>N ↑:</b> map north. <b>500 m bar:</b> approximate geographic scale. Arrows in firing messages connect the shooter to its target."
  },
  "symbols.fire": {
    "pt": "<b>Traço e pequena explosão:</b> disparo real já resolvido. O texto distingue Ataque, Fogo defensivo e Contra-ataque, com perda de PV ou Sem perda de coesão. O impacto fica no hexágono atingido, mesmo se a peça continuar andando, recuar ou sair de combate. Infantaria usa rajadas; o apoio agregado usa a imagem de morteiro; artilharia usa arco e projétil genérico, sem afirmar um calibre. Em Aparência, é possível desligar o movimento e ajustar a duração; o resultado continua visível.",
    "en": "<b>Tracer and small burst:</b> an actual shot that has already resolved. Text distinguishes Attack, Defensive fire, and Counterattack, with HP loss or No cohesion loss. Impact stays in the struck hex even if the counter keeps moving, withdraws, or leaves action. Infantry uses bursts; aggregated support uses a mortar image; artillery uses an arc and generic shell with no stated caliber. Appearance lets you disable movement and adjust duration; the result stays visible."
  },
  "symbols.damageLabel": {
    "pt": "Dano acumulado: {0} PV",
    "en": "Accumulated damage: {0} HP"
  },
  "dialog.closeBottom": {
    "pt": "Fechar",
    "en": "Close"
  },
  "history.button": {
    "pt": "História",
    "en": "History"
  },
  "rules.button": {
    "pt": "Regras & símbolos",
    "en": "Rules & symbols"
  },
  "appearance.animations": {
    "pt": "Animar os disparos",
    "en": "Animate firing"
  },
  "appearance.animationsNote": {
    "pt": "Infantaria mostra rajadas; apoio agregado mostra uma granada de morteiro; artilharia mostra um projétil em arco. São convenções visuais, sem calibre específico. Desligar mantém impacto e resultado estáticos. A preferência do aparelho por movimento reduzido sempre é respeitada.",
    "en": "Infantry shows bursts; aggregated support shows a mortar round; artillery shows a shell on an arc. These are visual conventions with no specific caliber. Turning animations off keeps a static impact and result. Your device’s reduced-motion preference is always respected."
  },
  "terrain.rulesTable": {
    "pt": "<section class=\"terrain-rules\"><h3>Terreno, movimento e proteção</h3><div class=\"terrain-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Terreno, movimento e proteção\"><table><caption>Referência do cenário: custos nominais para entrar no hexágono e bônus de proteção.</caption><thead><tr><th scope=\"col\">Condição</th><th scope=\"col\">Custo de movimento</th><th scope=\"col\">Proteção</th><th scope=\"col\">Observação</th></tr></thead><tbody><tr><th scope=\"row\">Campo e estrada</th><td>1 PM</td><td>Sem cobertura própria</td><td>A altura ou uma fortificação ainda podem proteger o defensor.</td></tr><tr><th scope=\"row\">Mata</th><td>2 PM</td><td>+1 de cobertura</td><td>Não soma sua cobertura à de morro ou fortificação; usa-se a maior.</td></tr><tr><th scope=\"row\">Morro</th><td>1 PM + subida</td><td>+1 de cobertura</td><td>A altura custa movimento pela diferença entre N1–N4, não pelo símbolo de morro isoladamente.</td></tr><tr><th scope=\"row\">Subir níveis</th><td>+{2} PM por nível</td><td>Ver desnível em metros</td><td>Some ao custo do terreno de destino. N1 → N2 acrescenta {2} PM; N1 → N3 acrescenta {5} PM.</td></tr><tr><th scope=\"row\">Descer</th><td>Sem custo extra</td><td>Depende da posição final</td><td>Pague o custo normal do terreno de destino, mesmo descendo.</td></tr><tr><th scope=\"row\">Fortificação</th><td>Custo do terreno</td><td>+{3} de cobertura</td><td>Não acumula com a cobertura de mata ou morro. O desnível de altura ainda pode somar proteção.</td></tr><tr><th scope=\"row\">Defensor ≥{0} m acima</th><td>Sem custo próprio</td><td>+1 adicional de defesa</td><td>O desnível é medido entre atacante e defensor, em metros, independentemente da faixa N.</td></tr><tr><th scope=\"row\">Atirador ≥{1} m acima</th><td>Sem custo próprio</td><td>Não altera cobertura</td><td>+1 hexágono de alcance para tiro direto habilitado, mantendo linha de visão. Não se aplica ao tiro indireto.</td></tr><tr><th scope=\"row\">Tiro indireto</th><td>Não muda o movimento</td><td>Proteção continua valendo</td><td>Artilharia e apoio com tiro indireto dispensam linha de visão direta; não ignoram a defesa do terreno.</td></tr><tr><th scope=\"row\">Hexágono ocupado</th><td>Entrada bloqueada</td><td>—</td><td>Uma peça não atravessa nem termina o movimento sobre outra peça.</td></tr></tbody></table></div><p class=\"terrain-example\"><b>Exemplo:</b> entrar em mata (2 PM) e subir de N1 para N2 (+{2} PM) tem custo nominal de <b>{4} PM</b>. {6}</p><p class=\"muted\">O clima regional é informativo: o modelo atual não aplica penalidades automáticas por frio, nuvens, neve ou lama. A subida representa o esforço tático nas encostas. Os alcances e condições da unidade aparecem na inspeção. Na escala companhia, a previsão de chegada também ignora a disputa futura por comando entre companhias do mesmo batalhão.</p></section>",
    "en": "<section class=\"terrain-rules\"><h3>Terrain, movement, and protection</h3><div class=\"terrain-table-scroll\" tabindex=\"0\" role=\"region\" aria-label=\"Terrain, movement, and protection\"><table><caption>Scenario reference: nominal costs to enter a hex and protection bonuses.</caption><thead><tr><th scope=\"col\">Condition</th><th scope=\"col\">Movement cost</th><th scope=\"col\">Protection</th><th scope=\"col\">Notes</th></tr></thead><tbody><tr><th scope=\"row\">Open ground and road</th><td>1 MP</td><td>No inherent cover</td><td>Elevation or a fortification can still protect the defender.</td></tr><tr><th scope=\"row\">Woods</th><td>2 MP</td><td>+1 cover</td><td>Does not stack with hill or fortification cover; use the highest cover bonus.</td></tr><tr><th scope=\"row\">Hill</th><td>1 MP + climbing</td><td>+1 cover</td><td>Elevation costs movement through N1–N4 differences, not through the hill symbol alone.</td></tr><tr><th scope=\"row\">Climbing levels</th><td>+{2} MP per level</td><td>See elevation in meters</td><td>Add to the destination terrain cost. N1 → N2 adds {2} MP; N1 → N3 adds {5} MP.</td></tr><tr><th scope=\"row\">Descending</th><td>No extra cost</td><td>Depends on the final position</td><td>Pay the destination’s normal terrain cost even when moving downhill.</td></tr><tr><th scope=\"row\">Fortification</th><td>Underlying terrain cost</td><td>+{3} cover</td><td>Does not stack with woods or hill cover. An elevation advantage can still add protection.</td></tr><tr><th scope=\"row\">Defender ≥{0} m higher</th><td>No separate cost</td><td>+1 additional defense</td><td>The height difference is measured between attacker and defender in meters, independently of N bands.</td></tr><tr><th scope=\"row\">Shooter ≥{1} m higher</th><td>No separate cost</td><td>Does not alter cover</td><td>+1 hex of enabled direct-fire range, with line of sight still required. Does not apply to indirect fire.</td></tr><tr><th scope=\"row\">Indirect fire</th><td>Does not alter movement</td><td>Protection still applies</td><td>Artillery and indirect support do not require direct line of sight; they do not ignore terrain defense.</td></tr><tr><th scope=\"row\">Occupied hex</th><td>Entry blocked</td><td>—</td><td>A counter cannot pass through or end movement on another counter.</td></tr></tbody></table></div><p class=\"terrain-example\"><b>Example:</b> entering woods (2 MP) and climbing from N1 to N2 (+{2} MP) has a nominal cost of <b>{4} MP</b>. {6}</p><p class=\"muted\">Regional weather is informational: the current model applies no automatic penalties for cold, clouds, snow, or mud. Climbing represents tactical effort on the slopes. Unit inspection shows its ranges and conditions. At company scale, the arrival forecast also ignores future command competition between companies of the same battalion.</p></section>"
  },
  "appearance.soundEnabled": {
    "pt": "Ativar som dos disparos",
    "en": "Enable firing sounds"
  },
  "appearance.soundNote": {
    "pt": "O som começa desligado. Ative com um toque; a preferência e o volume ficam neste navegador. O jogo continua funcionando em silêncio.",
    "en": "Sound starts off. Enable it with a tap; your preference and volume stay in this browser. The game remains fully playable in silence."
  },
  "sound.off": {
    "pt": "Som: desligado",
    "en": "Sound: off"
  },
  "sound.on": {
    "pt": "Som: ligado",
    "en": "Sound: on"
  },
  "sound.tooltip": {
    "pt": "Ligar ou desligar os sons dos disparos",
    "en": "Turn firing sounds on or off"
  },
  "rules.automatic": {
    "pt": "<b>Automático para humanos e computadores:</b> o contra-ataque acontece quando um ataque adjacente falha (resultado ≤0), o defensor sobrevive e não está suprimido nem já reagiu. O fogo defensivo de oportunidade também é automático para os dois lados quando suas condições de altura, alcance e linha de visão são atendidas. O ataque normal do jogador é comandado tocando na própria peça e depois no inimigo com barra de ataque. Os perfis das tropas determinam a mobilidade: os batalhões brasileiros têm 3 PM e os destacamentos alemães, 2 PM; apoio e artilharia têm os seus próprios valores.",
    "en": "<b>Automatic for humans and computers:</b> a counterattack occurs when an adjacent attack fails (result ≤0), the defender survives, and it is neither suppressed nor has already reacted. Opportunity defensive fire is also automatic for both sides when its elevation, range, and line-of-sight conditions are met. A player commands a normal attack by tapping their own counter and then an enemy with an attack bar. Troop profiles determine mobility: Brazilian battalions have 3 MP and German detachments have 2 MP; support and artillery have their own values."
  },
  "navigation.menu": {
    "pt": "Menu do jogo",
    "en": "Game menu"
  }
} as const;
