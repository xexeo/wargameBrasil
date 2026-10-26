# Monte Castelo Vibed

<!-- release:start -->
**Versão 0.1.23 · 26/10/2026, 00:56:23 (Brasília)**
<!-- release:end -->

Wargame tático sobre o ataque final da FEB a Monte Castelo, em 21 de fevereiro de 1945. Humano contra computador, regras simples inspiradas em wargames tradicionais, partidas projetadas para 5–10 minutos.

## Jogar online

**[▶ Jogar Monte Castelo Vibed](https://xexeo.github.io/wargameBrasil/)**

Publicação pelo GitHub Pages, a partir da `main`, pelo workflow `.github/workflows/pages.yml`. Primeira publicação verificada: a página respondeu com o título do jogo após a ativação do Pages. O repositório também aceita a publicação nativa configurada na `main`/raiz.

## Jogar só no navegador

Abra **[jogo.html](jogo.html)** em um navegador moderno. Esse arquivo já contém todo o HTML, CSS e JavaScript compilado: não precisa de instalação, backend, login, conexão externa ou servidor de jogo. Baixe o arquivo antes de abri-lo; a visualização de código do GitHub não executa HTML.

O código-fonte é **TypeScript**. O JavaScript compilado é o que roda no navegador. A página principal `index.html` contém a mesma versão autocontida. O fonte HTML e a entrada modular de desenvolvimento ficam em `template.html`.

## Novidades da interface

**Aparência configurável:** botão no topo abre as três paletas A/B/C, com A como padrão. É possível editar separadamente 47 cores semânticas, fontes, tamanhos, linhas e opacidades, além de ativar/desativar animações e ajustar sua duração. As preferências ficam neste navegador; importação/exportação e restauração estão no popup. Os valores visuais são centralizados em `ui-settings.ts` e variáveis CSS compartilhadas pelo SVG, efeitos, exemplos das regras e painéis. Não exige conexão nem reinicia a partida, o zoom ou o aprendizado.

O botão **Som** permite ligar/desligar efeitos; o popup Aparência inclui volume. Som começa desligado e usa síntese local para rajadas, morteiro e artilharia, sem gravações históricas ou downloads. [Pesquisa e implementação sonora](docs/SONS.md).

As regras incluem uma tabela responsiva de movimento, proteção e observação por terreno.

Todos os popups têm **Fechar / Close** ao fim do texto. As regras incluem a legenda completa; o selo vermelho de dano fica acima das peças, separado do escalão/ID. O popup final contém um epílogo próprio de cada vencedor: impacto histórico para a FEB e hipótese identificada para uma defesa alemã bem-sucedida. O impacto da vitória foi retirado da narrativa geral para ficar concentrado no encerramento.

**Mapa inteiro** usa a largura disponível e ajusta a altura do quadro à proporção do SVG, eliminando a faixa vazia da redução anterior; a página pode ser rolada para percorrer o mapa completo. Zoom livre e Visão tática continuam disponíveis.


O duplo clique/toque mostra dano acumulado e estado atual da peça. Disparos recebem sinalização no mapa: trajetória, impacto e identificação de fogo defensivo, inclusive ao avançar. A animação distingue rajadas de infantaria, granadas de morteiro do apoio e obuses de artilharia; pode ser desativada sem ocultar o resultado do disparo. Os efeitos apenas mostram os eventos reais do motor; não alteram dados de combate ou regras.

Português é o idioma padrão; **English (US)** é opcional e persistente, incluindo regras, narrativa, mensagens, histórico e acessibilidade. Trocar o idioma preserva partida e aprendizado.

**Encerrar turno** fica no mapa em barra fixa. Estrelas vermelhas centrais marcam objetivos; bordas tracejadas marrons/laranja indicam risco de fogo defensivo no percurso. Novas partidas permitem mover e disparar em qualquer ordem com um ataque normal por turno. A eliminação da última peça adversária encerra a partida imediatamente.

Modos: humano FEB × computador alemão; computador FEB × humano alemão; dois humanos no mesmo aparelho; dois humanos à distância. Popup Homenagem a Pedro Henrique de Figueiredo Bonorino, tenente do **6º RI**, com a nova fotografia fornecida pelo usuário, preservada sem tratamento adicional e distintivo da FEB. O distintivo atual do Regimento Ipiranga e sua legenda foram removidos da homenagem por orientação do autor.

[**Ver as três paletas**](https://xexeo.github.io/wargameBrasil/ux/paletas-ux.svg) · [**Abrir a análise de UX**](https://xexeo.github.io/wargameBrasil/ux/paletas-ux.html). As três propostas estão disponíveis no popup Aparência; A, azul/carvão, é o padrão recomendado. A análise inclui terreno de inverno, iluminação do dia, neve, lama e pedra, distinguindo evidência de hipótese. [Ver estudo visual do terreno de inverno](https://xexeo.github.io/wargameBrasil/ux/terreno-inverno.svg).

[Pesquisa de mortos, feridos, prisioneiros e retirada](docs/PESQUISA_MASCARENHAS_BAIXAS.md) preservada na documentação. A comparação histórica de baixas humanas foi removida do resultado final por falta de dados confirmados; a tela mostra somente perdas desta partida em peças, coesão e recuos. [Copyright do roteiro no Memorial](docs/IMAGEM_ROTEIRO_FEB.md): sem licença de reprodução localizada; apenas referência externa foi incluída.

## Revisão atual da escala de batalhão

A main conserva as dez peças. A missão mostra pontos faltantes, ritmo pela ocupação atual, prazo e estimativa otimista de chegada ao cume. Destinos sujeitos a reação no percurso recebem borda laranja; apoio que suprime o defensor remove esse risco. A estimativa de chegada ignora ocupação e fogo futuro.

A IA tática distingue ataque e defesa: a FEB considera custo do caminho, prazo e preservação; a Alemanha combina interceptação e proteção dos objetivos. Todos os modos avançam ao cume quando não restam inimigos, e a infantaria brasileira que o ocupa mantém posição. O fim distingue chegada tardia, falta do cume e perda da infantaria.

[Plano, experimentos e decisões](docs/REVISAO_BATALHOES.md). As novas partidas usam retirada por perdas sem cura e conquista custosa ao assegurar o cume no fechamento final, mesmo sem completar a meta de pontos. A meta de8 pontos com cume antecipa a vitória. São abstrações de jogo; partidas salvas preservam as regras anteriores. Os relatórios incompatíveis foram removidos. Consulte os [resultados válidos por versão](docs/simulacoes/README.md) para os novos números, sem reutilizar os 51,1% da revisão anterior.

## Estudo de escala das peças

[Companhia ou batalhão?](docs/ESCALA_DAS_PECAS.md) compara o modelo atual com nove companhias brasileiras e quatro destacamentos alemães de cenário (13 contadores, com apoios fora do mapa). Proposta ainda não implementada. A organização de três companhias de fuzileiros por batalhão foi confirmada em fonte institucional do Museu Virtual da FEB; a distribuição local dos alemães e das reservas ainda exige documentação.

## Referência de regras

O [GUIA_DO_JOGO.md](GUIA_DO_JOGO.md) é o guia de implementação, regras e registro de decisões. Ele distingue recursos implementados, hipóteses de cenário e pendências; deve ser atualizado junto com o README antes de evoluir as regras.

## Estado atual

- **Encerrar turno** na barra do mapa; Nova partida no topo e no painel lateral.
- Interface clara, com fundo branco, responsiva para celular e computador. FEB em azul, defesa alemã em carvão; terreno em papel e terra. Títulos sem serifa Barlow Condensed, fonte embutida offline sob licença OFL.
- Narrativa histórica em popup ao iniciar cada operação e reaberta pelo botão **Missão**, sem reiniciar. Distintivo da FEB com procedência e crédito registrados, também presente na homenagem.
- Tabuleiro de 9 × 9 hexágonos; peças quadradas com símbolos de infantaria e artilharia.
- Seleção direta: toque na peça e veja destinos azuis e barras vermelhas nos inimigos atacáveis ao mesmo tempo. Toque no destino para mover ou no alvo para atacar, sem botões de modo.
- Duplo toque/clique amplia a peça e mostra seus atributos. Cada peça mostra movimento restante (M), ataque (A), defesa (D), resistência atual e selo de dano acumulado, atualizados após cada ação.
- Florestinhas desenhadas em SVG, fortificações e trincheiras esquemáticas em Monte Castelo e num objetivo secundário; bônus de proteção não acumula com cobertura natural.
- Mapa ancorado no cume OSM de 977 m, 81 amostras Copernicus DEM de 90 m, caminhos/bosques/edifícios atuais, com localidades modernas sem rótulos de objetivos históricos; escala aproximada de 180 m por hexágono. Popup **Mapa & fontes** com mapa 10 de Cassino to the Alps (história oficial do Exército dos EUA) e referência complementar de Armand Casini.
- Relevo com faixas de altitude em metros e curvas generalizadas; versão em letra pequena ao lado do nome do jogo.
- Faixa de missão, bandeiras e botões para localizar os três objetivos, com controle e pontuação visíveis.
- Artilharia com tiro indireto de até 5 hexágonos nos novos perfis, inclusive contra fortificações; proteção do defensor mantida. Essa revisão corrige o bloqueio excessivo da linha de visão direta.
- Terreno afeta movimento, defesa e linha de visão. Subidas gastam mais movimento; defensores acima do atacante recebem proteção adicional.
- Zoom contínuo por slider, pinça e Ctrl/Command + roda do mouse; atalhos **Mapa inteiro** e **Visão tática**.
- Regras com exemplo de peça e legenda de bolinhas, símbolos militares, A/D/M, dano e marca de ação; contexto histórico, fontes e diário de combate na interface.
- Popup **Autoria & licença**, incluindo logo oficial do LUDES, copyright e texto integral da CC BY-NC-SA 4.0 para consulta offline. O logo foi obtido no [endereço oficial informado pelo autor](https://ludes.cos.ufrj.br/wp-content/uploads/2016/07/ludes_azul.png).
- IA de maior ataque, IA de menor defesa e IA tática que avalia cobertura, ameaças, apoio e objetivos; posturas agressiva e defensiva.
- **Aprendiz fixo · por lado**: dois modelos independentes, treinados em 2.400 partidas cada, com 400 contra cada política adversária. Pesos congelados, exploração zero durante as partidas e nenhum acesso às memórias pessoais. [Parâmetros, método e limites](docs/IA_POR_LADO.md).
- IA especial **Veterana**: treinada em 2.000 partidas de autojogo, com 17.109 atualizações e 96 situações aprendidas, alternando autojogo e adversários das seis políticas fixas. Aprende por fase da partida, vantagem de forças, pontos e ocupação; continua aprendendo no navegador. Esse treinamento distribuído é anterior às regras atuais e não demonstra desempenho nesta versão; a avaliação atual está nos relatórios abaixo. A experiência pode ser exportada/importada e a persistência está isolada em `persistence.ts`, preparada para adaptação a app. [Experimentos válidos por versão](docs/simulacoes/README.md).
- IA aprendiz: Q-learning simples sobre seis combinações de estratégia/postura, exploração de 20% e experiência mantida em `localStorage` entre partidas. Não treina uma rede neural nem aprende movimentos individuais.
- O resultado por eliminação agora descreve a ocupação **no encerramento**: infantaria no cume, apoio no cume ou ausência de peça. Não usa a frase ambígua “o cume não foi ocupado” para negar uma ocupação anterior.
- Vitória antecipada brasileira exige **8 pontos acumulados e ocupação do cume no fechamento do turno alemão**; no último fechamento, basta assegurar o cume, com vitória custosa se faltar pontuação. Os objetivos dão no máximo **4 por rodada**: 2 + 1 + 1; duas rodadas de ocupação completa dão 8. Apoio não captura. Defesa vence por prazo de 10 rodadas ou perda de toda a infantaria de manobra brasileira. Tempo e perdas determinam o grau da vitória.
- Reconstrução meteorológica ERA5 incorporada offline, com temperatura e nuvens aproximadas por hora, tabela e distinção entre modelo e relatos históricos.
- Relógio de cenário das 06:00 às 18:00; concentração de artilharia brasileira na rodada 10, inspirada no fogo histórico de 16:00–17:00.

O tempo de 5–10 minutos é uma meta de projeto, ainda sem validação com jogadores. A IA calcula localmente; sua sequência visual normalmente leva cerca de 1–2 segundos.

## História ampliada e acervos

O botão **História** apresenta os antecedentes de1944, as tentativas anteriores, a ofensiva coordenada e a progressão de21/02/1945, com conteúdo equivalente em português e inglês americano. O popup inicial também recebeu contexto. A síntese usa textos brasileiros efetivamente lidos da FGV CPDOC, Museu Virtual da FEB e BBC News Brasil, além da história oficial americana.

A [pesquisa dos acervos e conferência bibliográfica](docs/PESQUISA_ACERVOS_NARRATIVA.md) registra fichas CFa foto182, CFa-22f, TN foto0266 e três imagens examinadas na exposição do Arquivo Nacional, com limites de datação. Foram separados1945, uma comemoração de1962 e uma foto deminas demaio; não se inventou uma série datada de21–23/02. O catálogo confirma o livro deJoel Silveira em2005; a referência atribuída aCosta em2020 permanece a localizar. As imagens desses acervos não foram incorporadas sem condições de reprodução confirmadas.

## Revisão atual: tropas, fogo e fontes

A escala principal é batalhão para a FEB e grupo de fogos para artilharia; apoio é agregado. Os alemães são destacamentos de cenário, com escalão exato não confirmado. Atributos e T1–T3 são classificações de jogo, sem notas históricas inventadas. [Perfis e critérios](docs/TROPAS.md).

A altura permite tiro defensivo antes do avanço/assalto, com limite de 1 dano e consumo da próxima ação. Apoio indireto suprime a reação. Vantagem de 90 m amplia o tiro direto em um hexágono; defesa elevada usa limiar de 30 m. A IA usa apoio antes de manobrar. Essas regras são simétricas.

O [registro de mapas oficiais](docs/MAPAS_OFICIAIS.md) distingue fontes efetivamente lidas e catálogos. Fisher, p. 431, relata retirada alemã e pequena retaguarda final. O jogo ainda abstrai essa retirada; não afirma que quatro batalhões completos defenderam o cume. Os mapas integrais da memória de Mascarenhas permanecem pendentes de consulta. A nova narrativa confronta o verbete brasileiro da FGV com a exposição do Museu Virtual da FEB; consultar o registro de acervos acima.


<!-- simulation:0.1.20/avaliacao-ias-fixas:start -->
**Avaliação dos aprendizes fixos — v0.1.20:** 1.300 partidas fora do treino. FEB venceu 575/600 (95,8%) contra o portfólio de seis políticas; Alemanha venceu 84/600 (14,0%) em seu próprio portfólio. No confronto direto entre os dois modelos, FEB venceu 99/100, Alemanha 1/100. **O cenário atual não está equilibrado em 50/50.** Os efeitos visuais preservaram os resultados de todas as 4.800 partidas de treinamento. [Análise e intervalos](docs/simulacoes/0.1.20/avaliacao-ias-fixas/analise.md) · [dados brutos](docs/simulacoes/0.1.20/avaliacao-ias-fixas/dados-brutos.json) · [treino e modelos](docs/simulacoes/0.1.20/treinamento-ias-fixas/analise.md).
<!-- simulation:0.1.20/avaliacao-ias-fixas:end -->

<!-- simulation:0.1.20/matriz-ias:start -->
A [matriz atual de nove perfis](docs/simulacoes/0.1.20/matriz-ias/analise.md) inclui 810 partidas (dez por dupla ordenada): 709 vitórias FEB (87,5%) e 101 alemãs, média de 5,71 rodadas. Houve 705 desfechos por eliminação; a predominância desse resultado exige revisão de estratégia e dinâmica de combate, sem alterar geografia ou fatos históricos para obter 50%. A duração humana em minutos não foi medida.
<!-- simulation:0.1.20/matriz-ias:end -->

## Simulações e análises por versão

O diretório [docs/simulacoes](docs/simulacoes/README.md) contém os experimentos ainda compatíveis com o programa. Cada versão tem seu manifesto de hashes; cada execução reúne análise e dados. Mudanças nos fontes de regras, terreno, IA ou protocolo removem automaticamente as pastas incompatíveis ao compilar/commitar. Atualizar só a versão, CSS ou documentação preserva os resultados. O histórico do Git guarda os registros excluídos.







O prazo é o fechamento da rodada10 (18h do cenário). Cume mais8 pontos antecipa a vitória; o cume assegurado no fechamento final basta para vitória custosa quando faltam pontos. Só o cume rende2 por rodada: ocupá-lo da rodada7 à10 alcança a meta de8. A meta de 5–10 minutos humanos ainda não foi medida com jogadores.

## Autojogo sem interface

A arquitetura separa `geography.ts`/`geography-data.ts` (terreno e fontes geográficas), `engine.ts` (regras e estado), `ai.ts` (estratégias), `simulator.ts` (partidas e torneios sem DOM), `app.ts` (interface), `ui-settings.ts` (preferências visuais) e `history-content.ts` (narrativa/epílogos) e `scripts/autoplay.mjs` (CLI). O mesmo motor executa jogo visual e simulações. `learning.ts`, `simple-learning.ts` e os módulos fixos treinam e atualizam as IAs sem DOM ou armazenamento; `persistence.ts` adapta armazenamento do navegador; `pretrained.ts` incorpora o treinamento inicial.

```sh
npm run simulate -- --games 500 --seed 1 --name referencia
node scripts/autoplay.mjs --games 1 --seed 42 --replay /tmp/partida.json
```

Todas as novas execuções salvam os resultados individuais e o resumo em `docs/simulacoes/<versão>/<execução>/`. Os experimentos antigos que guardaram apenas agregados estão identificados como tal; dados individuais ausentes não foram inventados.

```sh
npm run simulate:matrix
npm run simulations:check
# Dois aprendizes independentes, 2.400 partidas por lado:
npm run train:fixed
npm run evaluate:fixed
```

## Humano × humano e WhatsApp

Selecione **Humano × humano · à distância**. O primeiro jogador comanda a FEB. Ao encerrar o turno, use **Enviar pelo WhatsApp**; quem abre o link assume o lado do próximo turno e envia outro link ao terminar. O link contém uma fotografia validada da partida, sem backend e sem envio automático de mensagens. Não há sala em tempo real ou verificação de identidade; continuem sempre do último estado recebido.

Na versão offline, exporte o arquivo do turno e envie-o como documento; o destinatário usa **Abrir arquivo de turno**. Links com endereços locais não são oferecidos para compartilhamento.

## Limites e pendências

- **Clima de 21/02/1945:** agora há uma reconstrução regional ERA5, com botão de tempo e popup de fontes no jogo. Ela sugere madrugada muito fria/nublada e abertura ao longo da manhã, sem precipitação modelada no dia. É reanálise de escala ~25 km, não medição local. Profundidade da neve está sem dados. Ainda falta boletim instrumental contemporâneo. [Pesquisa e limites](docs/TEMPO_21_FEVEREIRO_1945.md).
- O mapa agora tem base geográfica atual, mas **ainda não é uma restituição de 1945**. Caminhos e matas OSM modernos, discretização dos hexágonos e fortificações de cenário têm limitações explícitas. [Método, fontes e licenças](docs/GEOGRAFIA.md).
- Consulte [docs/HISTORIA.md](docs/HISTORIA.md) para distinguir fatos consultados, abstrações e pontos não confirmados.
- O equilíbrio entre os lados continua pendente. Os resultados válidos por versão distinguem o treinamento da avaliação independente; números anteriores às regras atuais não são usados como medição de desempenho atual.
- A experiência da IA depende do armazenamento permitido pelo navegador. Limpar seus dados apaga o aprendizado; abrir arquivos locais pode ter comportamento de armazenamento diferente entre navegadores.
- Partida e preferências são salvas localmente; ao reabrir, o jogo oferece retomada. Se a página for fechada durante o turno da IA, retoma o último ponto de controle de peça concluída e continua sem repetir as peças já ativadas.

## Versões e commits

Cada novo commit incrementa a versão `0.1.X`. O hook versionado em `.githooks/pre-commit` atualiza `version.json`, o código compilado, a data/hora de Brasília, os pacotes e este README, além de executar os testes. Ative-o em um checkout novo com `git config core.hooksPath .githooks`. O jogo exibe a mesma versão no rodapé e nos créditos. Builds sem commit preservam a versão atual.

## Desenvolvimento

A versão de batalhões continua na **`main`**. A alternativa de companhias está isolada na branch **`experimento/escala-companhia`**, autorizada pelo autor; não é a versão publicada. Atualizar este README a cada mudança relevante de estado.

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

`npm run build` compila o TypeScript em `dist/`, usa `template.html` como fonte e gera `index.html` e `jogo.html` idênticos, com os recursos embutidos. Isso permite publicação nativa do Pages na raiz sem misturar arquivos de versões diferentes. Esses arquivos são mantidos no repositório para jogar sem ferramentas de desenvolvimento. Depois de alterar fontes, gere-os novamente.

Para servir o jogo localmente, execute `npm start`; a entrada modular alternativa é `template.html`. Para os testes em navegador, execute `npm run test:browser`. Os testes usam Chromium em `/usr/bin/chromium`, configurado em [playwright.config.js](playwright.config.js); ajuste esse caminho em outras máquinas.

## Validação

Na implementação atual, passaram 50 testes do motor/simulador/aprendizado/troca de turnos/clima/geografia e 60 cenários de navegador (computador e celular): narrativa, movimento, zoom, turno inimigo, popup de regras, ampliação de peça, persistência do aprendizado, créditos/licença e arquivo standalone sem carregar recursos adicionais. A suíte é executada novamente antes da entrega das mudanças.

Os testes de motor exercitam partidas completas com as combinações de IA e postura, movimento legal, combate, pontuação, altitude e linha de visão. Clima histórico e fidelidade topográfica não são validados por esses testes.

## Copyright e licença

Copyright © 2026 Geraldo Xexéo (xexeo).

Este trabalho está licenciado sob a [Creative Commons
Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional
(CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br).
Consulte o arquivo [LICENSE](LICENSE).

Dados OSM mantêm ODbL 1.0; Copernicus DEM e outros recursos de terceiros mantêm suas condições próprias. Marcas e logotipos institucionais não são relicenciados por este aviso. Consulte os avisos em LICENSE e docs/GEOGRAFIA.md.

Na v0.1.22, textos e símbolos militares usam cores independentes por exército: FEB branca e Alemanha creme claro por padrão, ajustáveis em Aparência → Peças e estados.

Na v0.1.23, as opções do cabeçalho formam um menu compacto no computador e um menu hambúrguer em telas estreitas. O idioma permanece visível; o menu fecha ao escolher uma opção, tocar fora ou pressionar Escape.
