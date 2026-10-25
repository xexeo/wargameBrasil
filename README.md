# Monte Castelo Vibed

<!-- release:start -->
**Versão 0.1.7 · 25/10/2026, 03:50:07 (Brasília)**
<!-- release:end -->

Wargame tático sobre o ataque final da FEB a Monte Castelo, em 21 de fevereiro de 1945. Humano contra computador, regras simples inspiradas em wargames tradicionais, partidas projetadas para 5–10 minutos.

## Jogar online

**[▶ Jogar Monte Castelo Vibed](https://xexeo.github.io/wargameBrasil/)**

Publicação pelo GitHub Pages, a partir da `main`, pelo workflow `.github/workflows/pages.yml`. Primeira publicação verificada: a página respondeu com o título do jogo após a ativação do Pages. O repositório também aceita a publicação nativa configurada na `main`/raiz.

## Jogar só no navegador

Abra **[jogo.html](jogo.html)** em um navegador moderno. Esse arquivo já contém todo o HTML, CSS e JavaScript compilado: não precisa de instalação, backend, login, conexão externa ou servidor de jogo. Baixe o arquivo antes de abri-lo; a visualização de código do GitHub não executa HTML.

O código-fonte é **TypeScript**. O JavaScript compilado é o que roda no navegador. Há também uma versão modular em `index.html`, destinada a hospedagem estática.

## Referência de regras

O [GUIA_DO_JOGO.md](GUIA_DO_JOGO.md) é o guia de implementação, regras e registro de decisões. Ele distingue recursos implementados, hipóteses de cenário e pendências; deve ser atualizado junto com o README antes de evoluir as regras.

## Estado atual

- Botão **Nova partida** visível no topo, ao lado de Encerrar turno, além do painel lateral.
- Interface clara, com fundo branco, responsiva para celular e computador. FEB em azul, defesa alemã em carvão; terreno em papel e terra. Títulos sem serifa Barlow Condensed, fonte embutida offline sob licença OFL.
- Narrativa histórica em popup ao iniciar cada operação e reaberta pelo botão **Missão**, sem reiniciar. Logo original do jogo inspirado na cobra fumando da FEB, criado com assistência de IA; não é um distintivo oficial.
- Tabuleiro de 9 × 8 hexágonos; peças quadradas com símbolos de infantaria e artilharia.
- Ações explícitas **Mover** e **Atacar** acima do mapa. Primeiro selecione a peça, escolha a ação e toque no hexágono azul ou no alvo vermelho. Movimento desconta pontos; tocar em inimigo no modo Mover não ataca.
- Duplo toque/clique amplia a peça e mostra seus atributos. Cada peça mostra movimento restante (M), ataque (A), defesa (D), resistência atual e selo de dano acumulado, atualizados após cada ação.
- Florestinhas desenhadas em SVG, fortificações e trincheiras esquemáticas em Monte Castelo e no esporão; bônus de proteção não acumula com cobertura natural.
- Mapa ancorado no cume OSM de 977 m, 72 amostras Copernicus DEM de 90 m, caminhos/bosques/edifícios e localidades reais como Abetaia; escala aproximada de 180 m por hexágono. Popup **Mapa & fontes** com referência histórica de Armand Casini.
- Relevo com faixas de altitude em metros e curvas generalizadas; versão em letra pequena ao lado do nome do jogo.
- Faixa de missão, bandeiras e botões para localizar os três objetivos, com controle e pontuação visíveis.
- Artilharia com tiro indireto de até 3 hexágonos, inclusive contra fortificações; proteção do defensor mantida. Essa revisão corrige o bloqueio excessivo da linha de visão direta.
- Terreno afeta movimento, defesa e linha de visão. Subidas gastam mais movimento; defensores acima do atacante recebem proteção adicional.
- Zoom contínuo por slider, pinça e Ctrl/Command + roda do mouse; atalhos **Mapa inteiro** e **Visão tática**.
- Regras com exemplo de peça e legenda de bolinhas, símbolos militares, A/D/M, dano e marca de ação; contexto histórico, fontes e diário de combate na interface.
- Popup **Autoria & licença**, incluindo logo oficial do LUDES, copyright e texto integral da CC BY-NC-SA 4.0 para consulta offline. O logo foi obtido no [endereço oficial informado pelo autor](https://ludes.cos.ufrj.br/wp-content/uploads/2016/07/ludes_azul.png).
- IA de maior ataque, IA de menor defesa e IA tática que avalia cobertura, ameaças, apoio e objetivos; posturas agressiva e defensiva.
- IA especial **Veterana**: treinada em 2.000 partidas de autojogo, com 20.205 atualizações e 124 situações aprendidas. Aprende por fase da partida, vantagem de forças, pontos e ocupação; continua aprendendo no navegador. A experiência pode ser exportada/importada e a persistência está isolada em `persistence.ts`, preparada para adaptação a app. [Relatório de treino](docs/training-report.json) e [avaliação independente](docs/trained-evaluation.json).
- IA aprendiz: Q-learning simples sobre seis combinações de estratégia/postura, exploração de 20% e experiência mantida em `localStorage` entre partidas. Não treina uma rede neural nem aprende movimentos individuais.
- Vitória brasileira por 8 pontos de ocupação ou eliminação da defesa; vitória alemã por impedir o objetivo em 10 rodadas ou eliminar a FEB.
- Reconstrução meteorológica ERA5 incorporada offline, com temperatura e nuvens aproximadas por hora, tabela e distinção entre modelo e relatos históricos.
- Relógio de cenário das 06:00 às 18:00; concentração de artilharia brasileira na rodada 10, inspirada no fogo histórico de 16:00–17:00.

O tempo de 5–10 minutos é uma meta de projeto, ainda sem validação com jogadores. A IA calcula localmente; sua sequência visual normalmente leva cerca de 1–2 segundos.

## Balanceamento da base geográfica atual

Com o mesmo algoritmo tático e postura agressiva nos dois lados, gerador reproduzível **Mulberry32**, foram jogadas 1.000 partidas: **466 vitórias FEB (46,6%) e 534 alemãs (53,4%)**. Amostra de referência: 237/500; amostra separada de validação: 229/500. A meta é ficar próximo de 50%, sem forçar resultados. [Referência](docs/balance-geographic.json) · [Validação](docs/balance-geographic-validation.json).

Foram comparados ajustes pequenos de atributos na amostra de referência; mantivemos os atributos originais porque já eram os mais próximos da meta entre as opções testadas. [Comparação](docs/balance-geographic-calibration.json). A base geográfica passou a permitir mais vitórias por ocupação e presença brasileira no cume; ainda predominam saídas de combate por esgotamento de resistência. Remover uma peça representa sua perda de capacidade de combate/retirada, não uma contagem literal de soldados mortos.

A revisão também corrigiu correlação nos primeiros dados de sementes consecutivas do gerador LCG inicial. Os relatórios antigos abaixo são históricos e não devem ser combinados com a avaliação atual. O simulador agora tem um teste específico de distribuição inicial, além dos testes de partidas completas.

## Revisão de jogabilidade e registros anteriores

A artilharia passou de tiro direto com alcance 2 para **tiro indireto com alcance 3**. O teste específico confirma que ela pode bombardear a posição fortificada atrás da dobra do terreno, conservando o bônus defensivo do alvo. O treino inicial foi refeito após a mudança.

No autojogo do tabuleiro anterior à base geográfica, a mesma IA tática/agressiva comandando ambos os lados venceu pela FEB em 289/500 partidas de referência e 258/500 de validação: **54,7% FEB / 45,3% defesa alemã no total**. [Referência](docs/balance-current.json) · [Validação](docs/balance-current-validation.json). Ainda predomina a vitória por eliminação; a fidelidade ao objetivo histórico de ocupar o cume é limitada e permanece registrada para revisão. Uma partida completa pela interface também foi jogada automaticamente em computador e celular, chegando à vitória brasileira na rodada 3, por eliminação, com 1 ponto de ocupação.

As estatísticas abaixo do protótipo anterior ficam como registro, não como avaliação das regras atuais.

## Autojogo sem interface

A arquitetura separa `geography.ts`/`geography-data.ts` (terreno e fontes geográficas), `engine.ts` (regras e estado), `ai.ts` (estratégias), `simulator.ts` (partidas e torneios sem DOM), `app.ts` (interface) e `scripts/autoplay.mjs` (CLI). O mesmo motor executa jogo visual e simulações. `learning.ts` treina e atualiza a IA sem DOM ou armazenamento; `persistence.ts` adapta armazenamento do navegador; `pretrained.ts` incorpora o treinamento inicial.

```sh
npm run simulate -- --games 500 --seed 1 --output docs/balance-baseline.json
node scripts/autoplay.mjs --games 1 --seed 42 --replay /tmp/partida.json
```

Avaliação inicial com a mesma IA tática/agressiva nos dois lados, sementes 1–500: **257 vitórias brasileiras (51,4%) e 243 alemãs (48,6%)**. [Relatório reproduzível](docs/balance-baseline.json). Uma segunda amostra, sementes 10001–10500, resultou em 216 vitórias FEB (43,2%) e 284 alemãs (56,8%). Agregado de 1.000 partidas: **47,3% FEB / 52,7% alemãs**. Os resultados por amostra variam; isso mede a configuração dessa IA, não equilíbrio garantido contra humanos. Foram 467 finais por eliminação, 26 por pontos e 7 por tempo; apenas 4 partidas terminaram com ocupação brasileira do cume. A frequência de eliminação mostra uma diferença importante em relação ao objetivo histórico de conquista das posições e orienta a próxima revisão de tática/objetivos.

## Humano × humano e WhatsApp

Selecione **Humano × humano · à distância**. O primeiro jogador comanda a FEB. Ao encerrar o turno, use **Enviar pelo WhatsApp**; quem abre o link assume o lado do próximo turno e envia outro link ao terminar. O link contém uma fotografia validada da partida, sem backend e sem envio automático de mensagens. Não há sala em tempo real ou verificação de identidade; continuem sempre do último estado recebido.

Na versão offline, exporte o arquivo do turno e envie-o como documento; o destinatário usa **Abrir arquivo de turno**. Links com endereços locais não são oferecidos para compartilhamento.

## Limites e pendências

- **Clima de 21/02/1945:** agora há uma reconstrução regional ERA5, com botão de tempo e popup de fontes no jogo. Ela sugere madrugada muito fria/nublada e abertura ao longo da manhã, sem precipitação modelada no dia. É reanálise de escala ~25 km, não medição local. Profundidade da neve está sem dados. Ainda falta boletim instrumental contemporâneo. [Pesquisa e limites](docs/TEMPO_21_FEVEREIRO_1945.md).
- O mapa agora tem base geográfica atual, mas **ainda não é uma restituição de 1945**. Caminhos e matas OSM modernos, discretização dos hexágonos e fortificações de cenário têm limitações explícitas. [Método, fontes e licenças](docs/GEOGRAFIA.md).
- Consulte [docs/HISTORIA.md](docs/HISTORIA.md) para distinguir fatos consultados, abstrações e pontos não confirmados.
- A IA Veterana ainda não atinge equilíbrio: na avaliação separada de 300 partidas sobre a base geográfica, foram **33,7% FEB / 66,3% defesa alemã** com o mesmo algoritmo nos dois lados. Isso mede a tabela treinada, não equilíbrio garantido contra humanos. A calibração da Veterana continua como decisão revisável.
- A experiência da IA depende do armazenamento permitido pelo navegador. Limpar seus dados apaga o aprendizado; abrir arquivos locais pode ter comportamento de armazenamento diferente entre navegadores.
- Partida e preferências são salvas localmente; ao reabrir, o jogo oferece retomada. Se a página for fechada durante o turno da IA, retoma o último ponto de controle completo, anterior ao processamento daquele turno.

## Versões e commits

Cada novo commit incrementa a versão `0.1.X`. O hook versionado em `.githooks/pre-commit` atualiza `version.json`, o código compilado, a data/hora de Brasília, os pacotes e este README, além de executar os testes. Ative-o em um checkout novo com `git config core.hooksPath .githooks`. O jogo exibe a mesma versão no rodapé e nos créditos. Builds sem commit preservam a versão atual.

## Desenvolvimento

Use o checkout existente, na branch **`main`**. Por orientação do autor, não criar branches adicionais ou worktrees. Atualizar este README a cada mudança relevante de estado.

Requisitos de desenvolvimento: Node.js 22 ou superior e npm. Python 3 é usado apenas no servidor estático opcional de desenvolvimento; não é necessário para jogar `jogo.html`.

```sh
npm ci --cache /workspace/.npm-cache
npm run build
npm test
npm run typecheck
# Treino reproduzível, opcional:
npm run train -- 2000
npm run build
```

`npm run build` compila o TypeScript em `dist/` e gera `jogo.html` com os recursos embutidos. Esses arquivos são mantidos no repositório para jogar sem ferramentas de desenvolvimento. Depois de alterar fontes, gere-os novamente.

Para servir a versão modular localmente, execute `npm start`. Para os testes em navegador, execute `npm run test:browser`. Os testes usam Chromium em `/usr/bin/chromium`, configurado em [playwright.config.js](playwright.config.js); ajuste esse caminho em outras máquinas.

## Validação

Na implementação atual, passaram 17 testes do motor/simulador/aprendizado/troca de turnos/clima/geografia e 16 cenários de navegador (computador e celular): narrativa, movimento, zoom, turno inimigo, popup de regras, ampliação de peça, persistência do aprendizado, créditos/licença e arquivo standalone sem carregar recursos adicionais. A suíte é executada novamente antes da entrega das mudanças.

Os testes de motor exercitam partidas completas com as combinações de IA e postura, movimento legal, combate, pontuação, altitude e linha de visão. Clima histórico e fidelidade topográfica não são validados por esses testes.

## Copyright e licença

Copyright © 2026 Geraldo Xexéo (xexeo).

Este trabalho está licenciado sob a [Creative Commons
Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional
(CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br).
Consulte o arquivo [LICENSE](LICENSE).

Dados OSM mantêm ODbL 1.0; Copernicus DEM e outros recursos de terceiros mantêm suas condições próprias. Marcas e logotipos institucionais não são relicenciados por este aviso. Consulte os avisos em LICENSE e docs/GEOGRAFIA.md.
