# Monte Castelo Vibed

<!-- release:start -->
**Versão 0.1.3 · 25/10/2026, 03:01:49 (Brasília)**
<!-- release:end -->

Wargame tático sobre o ataque final da FEB a Monte Castelo, em 21 de fevereiro de 1945. Humano contra computador, regras simples inspiradas em wargames tradicionais, partidas projetadas para 5–10 minutos.

## Jogar online

**[▶ Jogar Monte Castelo Vibed](https://xexeo.github.io/wargameBrasil/)**

Publicação pelo GitHub Pages, a partir da `main`, pelo workflow `.github/workflows/pages.yml`. O link só fica disponível após a conclusão da primeira publicação.

## Jogar só no navegador

Abra **[jogo.html](jogo.html)** em um navegador moderno. Esse arquivo já contém todo o HTML, CSS e JavaScript compilado: não precisa de instalação, backend, login, conexão externa ou servidor de jogo. Baixe o arquivo antes de abri-lo; a visualização de código do GitHub não executa HTML.

O código-fonte é **TypeScript**. O JavaScript compilado é o que roda no navegador. Há também uma versão modular em `index.html`, destinada a hospedagem estática.

## Referência de regras

O [GUIA_DO_JOGO.md](GUIA_DO_JOGO.md) é o guia de implementação, regras e registro de decisões. Ele distingue recursos implementados, hipóteses de cenário e pendências; deve ser atualizado junto com o README antes de evoluir as regras.

## Estado atual

- Interface clara, com fundo branco, responsiva para celular e computador.
- Narrativa histórica em popup ao iniciar cada operação. Logo original do jogo inspirado na cobra fumando da FEB, criado com assistência de IA; não é um distintivo oficial.
- Tabuleiro de 9 × 8 hexágonos; peças quadradas com símbolos de infantaria e artilharia.
- Seleção e movimento por toque/clique, com desconto dos pontos de movimento; ataque selecionando a peça e depois o inimigo.
- Duplo toque/clique amplia a peça e mostra seus atributos. Cada peça mostra movimento restante (M), ataque (A), defesa (D), resistência atual e selo de dano acumulado, atualizados após cada ação.
- Terreno afeta movimento, defesa e linha de visão. Subidas gastam mais movimento; defensores acima do atacante recebem proteção adicional.
- Zoom contínuo por slider, pinça e Ctrl/Command + roda do mouse; atalhos **Mapa inteiro** e **Visão tática**.
- Regras, contexto histórico, fontes e diário de combate na interface.
- Popup **Autoria & licença**, incluindo logo oficial do LUDES, copyright e texto integral da CC BY-NC-SA 4.0 para consulta offline. O logo foi obtido no [endereço oficial informado pelo autor](https://ludes.cos.ufrj.br/wp-content/uploads/2016/07/ludes_azul.png).
- IA de maior ataque, IA de menor defesa e IA tática que avalia cobertura, ameaças, apoio e objetivos; posturas agressiva e defensiva.
- IA especial **Veterana**: treinada em 2.000 partidas de autojogo, com 18.143 atualizações e 116 situações aprendidas. Aprende por fase da partida, vantagem de forças, pontos e ocupação; continua aprendendo no navegador. A experiência pode ser exportada/importada e a persistência está isolada em `persistence.ts`, preparada para adaptação a app. [Relatório de treino](docs/training-report.json) e [avaliação independente](docs/trained-evaluation.json).
- IA aprendiz: Q-learning simples sobre seis combinações de estratégia/postura, exploração de 20% e experiência mantida em `localStorage` entre partidas. Não treina uma rede neural nem aprende movimentos individuais.
- Vitória brasileira por 8 pontos de ocupação ou eliminação da defesa; vitória alemã por impedir o objetivo em 10 rodadas ou eliminar a FEB.
- Relógio de cenário das 06:00 às 18:00; concentração de artilharia brasileira na rodada 10, inspirada no fogo histórico de 16:00–17:00.

O tempo de 5–10 minutos é uma meta de projeto, ainda sem validação com jogadores. A IA calcula localmente; sua sequência visual normalmente leva cerca de 1–2 segundos.

## Autojogo sem interface

A arquitetura separa `engine.ts` (regras e estado), `ai.ts` (estratégias), `simulator.ts` (partidas e torneios sem DOM), `app.ts` (interface) e `scripts/autoplay.mjs` (CLI). O mesmo motor executa jogo visual e simulações. `learning.ts` treina e atualiza a IA sem DOM ou armazenamento; `persistence.ts` adapta armazenamento do navegador; `pretrained.ts` incorpora o treinamento inicial.

```sh
npm run simulate -- --games 500 --seed 1 --output docs/balance-baseline.json
node scripts/autoplay.mjs --games 1 --seed 42 --replay /tmp/partida.json
```

Avaliação inicial com a mesma IA tática/agressiva nos dois lados, sementes 1–500: **257 vitórias brasileiras (51,4%) e 243 alemãs (48,6%)**. [Relatório reproduzível](docs/balance-baseline.json). Uma segunda amostra, sementes 10001–10500, resultou em 216 vitórias FEB (43,2%) e 284 alemãs (56,8%). Agregado de 1.000 partidas: **47,3% FEB / 52,7% alemãs**. Os resultados por amostra variam; isso mede a configuração dessa IA, não equilíbrio garantido contra humanos. Foram 467 finais por eliminação, 26 por pontos e 7 por tempo; apenas 4 partidas terminaram com ocupação brasileira do cume. A frequência de eliminação mostra uma diferença importante em relação ao objetivo histórico de conquista das posições e orienta a próxima revisão de tática/objetivos.

## Limites e pendências

- **Clima de 21/02/1945:** falta uma fonte meteorológica diária. Boa visibilidade e movimento normal são hipóteses explícitas, não condições medidas. Não transportamos automaticamente a chuva e lama de novembro/dezembro para fevereiro.
- Mapa esquemático, sem escala ou georreferenciamento; níveis de altitude relativos e objetivos secundários de jogo. Ainda não é uma reconstrução cartográfica.
- Consulte [docs/HISTORIA.md](docs/HISTORIA.md) para distinguir fatos consultados, abstrações e pontos não confirmados.
- A experiência da IA depende do armazenamento permitido pelo navegador. Limpar seus dados apaga o aprendizado; abrir arquivos locais pode ter comportamento de armazenamento diferente entre navegadores.
- A partida em andamento ainda não é salva ao recarregar a página; a experiência das IAs é mantida.

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

Na implementação atual, passaram 10 testes do motor/simulador/aprendizado e 10 cenários de navegador (computador e celular): narrativa, movimento, zoom, turno inimigo, popup de regras, ampliação de peça, persistência do aprendizado, créditos/licença e arquivo standalone sem carregar recursos adicionais. A suíte é executada novamente antes da entrega das mudanças.

Os testes de motor exercitam partidas completas com as combinações de IA e postura, movimento legal, combate, pontuação, altitude e linha de visão. Clima histórico e fidelidade topográfica não são validados por esses testes.

## Copyright e licença

Copyright © 2026 Geraldo Xexéo (xexeo).

Este trabalho está licenciado sob a [Creative Commons
Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional
(CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br).
Consulte o arquivo [LICENSE](LICENSE).

Marcas e logotipos institucionais não são relicenciados por este aviso.
