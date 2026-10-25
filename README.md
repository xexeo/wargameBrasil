# Monte Castelo Vibed

Wargame tático sobre o ataque final da FEB a Monte Castelo, em 21 de fevereiro de 1945. Humano contra computador, regras simples inspiradas em wargames tradicionais, partidas projetadas para 5–10 minutos.

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
- IA aprendiz: Q-learning simples sobre seis combinações de estratégia/postura, exploração de 20% e experiência mantida em `localStorage` entre partidas. Não treina uma rede neural nem aprende movimentos individuais.
- Vitória brasileira por 8 pontos de ocupação ou eliminação da defesa; vitória alemã por impedir o objetivo em 10 rodadas ou eliminar a FEB.
- Relógio de cenário das 06:00 às 18:00; concentração de artilharia brasileira na rodada 10, inspirada no fogo histórico de 16:00–17:00.

O tempo de 5–10 minutos é uma meta de projeto, ainda sem validação com jogadores. A IA calcula localmente; sua sequência visual normalmente leva cerca de 1–2 segundos.

## Limites e pendências

- **Clima de 21/02/1945:** falta uma fonte meteorológica diária. Boa visibilidade e movimento normal são hipóteses explícitas, não condições medidas. Não transportamos automaticamente a chuva e lama de novembro/dezembro para fevereiro.
- Mapa esquemático, sem escala ou georreferenciamento; níveis de altitude relativos e objetivos secundários de jogo. Ainda não é uma reconstrução cartográfica.
- Consulte [docs/HISTORIA.md](docs/HISTORIA.md) para distinguir fatos consultados, abstrações e pontos não confirmados.
- A experiência da IA depende do armazenamento permitido pelo navegador. Limpar seus dados apaga o aprendizado; abrir arquivos locais pode ter comportamento de armazenamento diferente entre navegadores.
- A partida em andamento não é salva ao recarregar a página.

## Desenvolvimento

Use o checkout existente, na branch **`main`**. Por orientação do autor, não criar branches adicionais ou worktrees. Atualizar este README a cada mudança relevante de estado.

Requisitos de desenvolvimento: Node.js 22 ou superior e npm. Python 3 é usado apenas no servidor estático opcional de desenvolvimento; não é necessário para jogar `jogo.html`.

```sh
npm ci --cache /workspace/.npm-cache
npm run build
npm test
npm run typecheck
```

`npm run build` compila o TypeScript em `dist/` e gera `jogo.html` com os recursos embutidos. Esses arquivos são mantidos no repositório para jogar sem ferramentas de desenvolvimento. Depois de alterar fontes, gere-os novamente.

Para servir a versão modular localmente, execute `npm start`. Para os testes em navegador, execute `npm run test:browser`. Os testes usam Chromium em `/usr/bin/chromium`, configurado em [playwright.config.js](playwright.config.js); ajuste esse caminho em outras máquinas.

## Validação

Na implementação atual, passaram 6 testes das regras e 6 cenários de navegador (computador e celular): narrativa, movimento, zoom, turno inimigo, popup de regras, ampliação de peça e persistência do aprendizado. A suíte é executada novamente antes da entrega das mudanças.

Os testes de motor exercitam partidas completas com as combinações de IA e postura, movimento legal, combate, pontuação, altitude e linha de visão. Clima histórico e fidelidade topográfica não são validados por esses testes.

## Copyright e licença

Copyright © 2026 Geraldo Xexéo (xexeo).

Este trabalho está licenciado sob a [Creative Commons
Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional
(CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br).
Consulte o arquivo [LICENSE](LICENSE).

Marcas e logotipos institucionais não são relicenciados por este aviso.
