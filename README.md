# Monte Castelo Vibed

<!-- release:start -->
**Versão 0.9.2 · 26/10/2026, 08:34:24 (Brasília)**
<!-- release:end -->

Wargame sobre o ataque final da FEB a Monte Castelo, em 21 de fevereiro de 1945. HTML e TypeScript, somente no navegador, computador ou celular, sem conta ou servidor de jogo. Meta de duração humana: 5–10 minutos; ainda não medida com uma amostra de jogadores.

## Jogar

**[▶ Jogar online](https://xexeo.github.io/wargameBrasil/)** · **[Baixar jogo.html](https://xexeo.github.io/wargameBrasil/jogo.html)**

Para jogar offline, salve `jogo.html` e abra no navegador. `index.html` contém a mesma versão autocontida, com fontes, imagens, estilos e código incorporados. A visualização de código do GitHub não executa HTML. O Pages publica a `main`; tanto o workflow quanto a publicação nativa pela raiz recebem os mesmos arquivos.

## Movimento corrigido — 0.9.2

Com o movimento completo, **toda peça pode entrar num vizinho livre de mesmo nível, descendo ou subindo um nível**, inclusive artilharia e mata. Paga o custo nominal ou seu máximo de PM, o menor dos dois. A redução usa o máximo da peça, não o saldo restante; subir dois ou mais níveis conserva o custo integral e pode ser impossível. Ocupação, reação e comando continuam valendo. A correção também se aplica a partidas antigas sem a nova opção registrada.

Verificação exaustiva:26 perfis nas duas escalas,81 posições iniciais cada e170.586 destinos testados; custos, desconto de PM, orçamento parcial, bloqueios e rotas da IA. Todo perfil também tem caminho para todos os hexágonos ao longo de vários turnos, sem ocupação ou fogo. [Método e resultados](docs/MOVIMENTO_MINIMO.md).

## Duas escalas — integradas na 0.9.1

O mesmo jogo agora oferece **Batalhões · jogo original** ou **Companhias · nove companhias FEB**, no popup inicial e no seletor Escala das peças. A opção companhia tem 16 peças: nove companhias brasileiras, apoio e fogos; quatro destacamentos e fogos alemães. Usa o mesmo mapa, combate, turnos, objetivos, aparência e controles.

Para evitar triplicar ataques, só uma companhia de cada batalhão brasileiro recebe ordens por turno. A primeira ação legal compromete o comando; selecionar/inspecionar não gasta. As outras companhias ficam esmaecidas e ainda defendem. Reação/reorganização compromete o próximo comando do batalhão. Apoios e destacamentos alemães têm ações próprias. Letras A/B/C são etiquetas de cenário, não uma ordem de batalha local comprovada.

Modelos fixos e experiência online são independentes por escala; suas memórias antigas de batalhão são preservadas. Trocar escala inicia outra partida, com confirmação se a atual já começou; salvar/importar/WhatsApp mantém escala e ordens. Não converte uma partida iniciada. **Novo jogo** mantém a escala escolhida.

[Arquitetura e decisões](docs/DUAS_ESCALAS.md) · [Pesquisa histórica](docs/PESQUISA_COMPANHIAS.md) · [Análises atuais por escala](docs/simulacoes/README.md). Um ciclo de estudo, uma passagem de treino por escala e avaliação independente; nenhuma promessa de 50/50 humano ou de duração medida.

## Entrega 0.9.0 — recursos preservados

- **Defesa e subida:** +2 PM por faixa de subida, proteção preparada +2 e fogos alemães com alcance 6; infantaria, mapa, identidades e prazo de dez rodadas preservados. Abrigos nos hex 6–2 (cume) e4–4, posições esquemáticas. Beneficiam qualquer ocupante. [Estudo, fontes e limites](docs/DEFESA_E_EQUILIBRIO_0_9.md).
- **IA por lado:** Estado-maior alemão mantém o cume nas duas posturas e distingue interceptação de contrabateria. Rotas consideram a mobilidade real; não planejam passos mais caros que o máximo de PM. Aprendizes fixos e pré-treino online são refeitos para as regras atuais. [Método](docs/IA_POR_LADO.md).
- **Munições animadas:** balas em rajada, granadas de morteiro com aletas e obuses com cinta de forçamento, sem seta. Trajetórias variam sem alterar o sorteio de combate. O resultado final espera o último impacto. Animação e som são opcionais e independentes.
- **Documentação revista:** guia consolidado, números antigos retirados do estado atual, planos anteriores identificados como registros históricos e novas análises com dados brutos por versão.

Novas partidas recebem esses parâmetros; partidas salvas mantêm os atributos e regras anteriores. É preciso iniciar **Novo jogo** para experimentar integralmente a 0.9.

## Como jogar

Selecione uma peça e toque num destino destacado para mover ou num inimigo com barra de ataque para disparar. Pode mover e atirar em qualquer ordem, com um ataque normal e o orçamento de movimento da peça. Duplo toque/clique mostra dano e estado atuais. **Encerrar turno** fica na barra do mapa.

Estrelas vermelhas centrais são objetivos. Monte Castelo rende2 pontos e cada secundário1 por fechamento de rodada; máximo4 por rodada, acumulável até 8. Só infantaria de manobra assegura objetivos. Cume +8 pontos permite vitória antecipada; cume no fechamento da rodada 10 basta para vitória custosa. Eliminar todas as peças inimigas dá vitória imediata; perder toda a infantaria brasileira encerra a missão. Resultado explica a ocupação no encerramento e mostra perdas de jogo, sem converter PV em mortos.

Bordas tracejadas indicam risco de fogo defensivo **no percurso**, não bloqueio ou dano garantido. Reações e contra-ataques são automáticos para humanos e computadores dos dois lados. Suprimir com apoio antes de subir pode impedir a reação. As regras explicam todos os símbolos e trazem uma tabela de terreno.

Modos: humano FEB × computador alemão; computador FEB × humano alemão; humanos no mesmo aparelho; humanos à distância, por arquivo/link enviado no WhatsApp. Não há sincronização em tempo real. Partida e turno da IA têm retomada local.

## Interface e acessibilidade

Português padrão; **English (US)** opcional, incluindo regras, narrativa, resultados, inspeções e acessibilidade. Trocar idioma não altera partida ou aprendizado. Menu compacto no computador, hambúrguer no celular; todos os popups terminam com **Fechar / Close**.

Em **Aparência**, três presetsA/B/C, com A azul/carvão recomendado, **47 cores** e controles separados de fontes, dimensões, linhas e opacidades. Textos e símbolos FEB/DE têm cores próprias, branca/creme no padrão. Configurações persistem, podem ser exportadas/importadas e restauradas. Terreno de inverno é opção visual; não altera regras. Fundo branco por padrão; símbolos e rótulos complementam a cor.

[**Comparar paletas**](https://xexeo.github.io/wargameBrasil/ux/paletas-ux.svg) · [**Análise de UX**](https://xexeo.github.io/wargameBrasil/ux/paletas-ux.html) · [**Proposta de terreno de inverno**](https://xexeo.github.io/wargameBrasil/ux/terreno-inverno.svg)

Zoom contínuo, **Mapa inteiro** e **Visão tática**. Dano acima da peça, separado do ID. Som desligado inicialmente, sintetizado localmente, com volume; não são gravações históricas. Redução de movimento ou animação desligada mantém impacto estático e anúncio. [Sons e pesquisa de bibliotecas](docs/SONS.md).

## História e procedência

Narrativa inicial, História ampliada com antecedentes e sequência do dia, mapas oficiais de contexto e estimativas meteorológicas regionais. Epílogo FEB explica importância/consequências; vitória alemã recebe hipótese de atraso local, identificada como contrafactual.

O tabuleiro9×9 usa amostras atuais Copernicus DEM e feições OSM, aproximadamente180m entre centros, cota nominal977m. **Não é uma restituição de 1945**: caminhos, bosques e posições militares têm limites explícitos. 232ª DI é Heer, sem SS ou elite inventada. Três batalhões brasileiros, apoio e fogos; alemães são destacamentos de cenário de escalão local não confirmado, não quatro batalhões históricos completos.

[História](docs/HISTORIA.md) · [Mapas oficiais](docs/MAPAS_OFICIAIS.md) · [Geografia](docs/GEOGRAFIA.md) · [Tempo](docs/TEMPO_21_FEVEREIRO_1945.md) · [Acervos e bibliografia brasileira](docs/PESQUISA_ACERVOS_NARRATIVA.md) · [Tropas](docs/TROPAS.md)

A homenagem usa a fotografia enviada de Pedro Henrique de Figueiredo Bonorino, tenente do **6º RI**, e o distintivo FEB. O emblema regimental moderno foi removido. [Procedência](docs/TRIBUTO_FONTES.md). O roteiro ilustrado do Memorial da Democracia é apenas link externo: [licença de reprodução não localizada](docs/IMAGEM_ROTEIRO_FEB.md). A [pesquisa de baixas](docs/PESQUISA_MASCARENHAS_BAIXAS.md) é documental; a comparação histórica de baixas humanas foi retirada da interface por falta de dados confirmados.

## IAs e dados de simulação

Caçador, Oportunista e Estado-maior, nas posturas agressiva/defensiva; Aprendiz simples e Veterana com experiência local; **Aprendiz fixo por lado**, duas tabelas independentes por escala, de 2.400 partidas cada, pesos congelados e exploração zero durante o jogo. São seletores de políticas, não redes que aprendem cada movimento. Memória pode ser exportada; limpar dados do navegador apaga experiência local.

[**Análises e dados válidos por versão**](docs/simulacoes/README.md). Cada pasta contém sementes, resultados individuais, protocolo e manifesto de hashes. Mudanças de motor/IA/modelos invalidam e removem as pastas incompatíveis; o Git conserva o histórico. Alterações visuais não invalidam autojogo. Treino com exploração não equivale a avaliação independente; taxa de um portfólio não garante50/50 de cada política nem mede dificuldade humana.








<!-- simulation:0.9.2/matriz-ias:start -->
**Batalhões com movimento corrigido:** 810 jogos,10 por dupla. FEB **48,1%**, Alemanha **51,9%**; média 6,48 rodadas. [Matriz, dominâncias e dados](docs/simulacoes/0.9.2/matriz-ias/analise.md).
<!-- simulation:0.9.2/matriz-ias:end -->

<!-- simulation:0.9.2/matriz-ias-companhias:start -->
**Companhias com movimento corrigido:** 810 jogos,10 por dupla. FEB **42,7%**, Alemanha **57,3%**; média 8,91 rodadas. [Matriz, dominâncias e dados](docs/simulacoes/0.9.2/matriz-ias-companhias/analise.md).
<!-- simulation:0.9.2/matriz-ias-companhias:end -->

<!-- simulation:0.9.2/avaliacao-ias-fixas-companhias:start -->
Entre aprendizes fixos de companhia, a FEB venceu 58/100 jogos independentes. Uma média do portfólio não garante50/50 para cada dupla ou jogador. [Avaliação e intervalos](docs/simulacoes/0.9.2/avaliacao-ias-fixas-companhias/analise.md).
<!-- simulation:0.9.2/avaliacao-ias-fixas-companhias:end -->

```sh
# Uma passagem de estudo/treino para as duas escalas:
npm run train:scales
# Avaliação com sementes separadas:
npm run evaluate:scales
# Duas matrizes9×9,10 jogos por dupla:
npm run simulate:matrices
```

Scripts de treinamento substituem os próprios modelos e invalidam relatórios incompatíveis. Recompile antes de avaliar. Não misture resultados gerados antes e depois da substituição dos modelos.

## Desenvolvimento, versões e validação

[**Guia vigente de regras e decisões**](GUIA_DO_JOGO.md) · [Plano da entrega0.9](docs/PLANO_0_9.md) · [Estudo de escala companhia](docs/ESCALA_DAS_PECAS.md)

As duas escalas estão integradas na **main** e na mesma página. A branch `experimento/escala-companhia` preserva o rascunho anterior, não é necessária para jogar. A entrega0.9.0 iniciou a série0.9.X; esta atualização é0.9.2. O hook atualiza versão/data/hora de Brasília e roda testes. Builds sem commit preservam a versão.

Requisitos para desenvolver: Node.js22+, npm; Python3 apenas para servidor estático opcional. Para jogar, basta navegador moderno.

```sh
npm ci
git config core.hooksPath .githooks
npm run build
npm test
npm run test:browser
npm start
```

`template.html` é o fonte HTML, `app.ts` a interface; `engine.ts`, `ai.ts` e módulos de aprendizado funcionam sem DOM. `dist/`, `index.html` e `jogo.html` são gerados e versionados. Chromium fica em `/usr/bin/chromium` na configuração de testes deste ambiente; ajuste em outras máquinas.

Validação da entrega:80 testes sem interface e132 casos de navegador, incluindo partidas completas nas duas escalas, idiomas, aparência, som, retomada e HTML offline. A verificação de movimento cobre170.586 combinações de origem/destino. [Método atual](docs/MOVIMENTO_MINIMO.md) e [arquitetura das escalas](docs/DUAS_ESCALAS.md). A regressão que preservou a 0.9.0 é registro da integração0.9.1; a correção posterior muda deliberadamente o movimento.

Limites que permanecem: restituição cartográfica local de 1945, mapas integrais de Mascarenhas, efetivos/baixas locais e boletim instrumental contemporâneo. ERA5 regional não prova neve ou lama em cada posição. Duração humana e dificuldade percebida exigem jogadores; autojogo mede rodadas e resultados de políticas.

## Copyright e licença

Copyright ©2026 Geraldo Xexéo (xexeo). Criações originais sob [Creative Commons Atribuição-NãoComercial-CompartilhaIgual4.0 Internacional — CC BY-NC-SA4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt-br). [LICENSE](LICENSE).

OSM conserva ODbL1.0, Copernicus e demais recursos mantêm suas condições. Marcas/logos institucionais não são relicenciados. Avisos e procedência acompanham o jogo offline e a documentação.
