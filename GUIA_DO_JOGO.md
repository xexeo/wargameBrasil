# Monte Castelo Vibed — guia de regras e registro de decisões

Versão 0.1 · 25/10/2026 · referência para implementação, testes e revisão.

Este documento foi solicitado quando o primeiro protótipo já estava implementado. Registra seu estado real e orienta as próximas mudanças; não implica que os recursos abaixo já existiam antes dessa solicitação. Toda alteração relevante de regra deve atualizar este guia, os testes correspondentes, o popup de regras e o README.

## 1. Objetivo do projeto

Criar um wargame de navegador, em HTML e TypeScript, humano contra computador, sobre a conquista de Monte Castelo pela FEB em 21/02/1945. Inspiração em wargames tradicionais da Avalon Hill, com regras simples e nível de abstração solicitado pelo autor a partir de *Guerra dos Sete Dias*, da coleção *Todos os Jogos*. Não reproduzir regras, mapas ou componentes desses jogos.

Meta de duração: 5–10 minutos, ainda a confirmar por testes com jogadores. Cada campanha dura no máximo dez rodadas. Não há backend de jogo, conta ou serviço de IA.

## 2. Plataforma e identidade

- Nome: **Monte Castelo Vibed**.
- Jogável em navegador de computador e celular; o arquivo `jogo.html` incorpora os recursos necessários e pode ser aberto diretamente.
- Código-fonte em TypeScript; saída compilada em JavaScript.
- Fundo branco, texto escuro, mapa com cores claras de vegetação e terra.
- Logo original inspirado na cobra fumando da FEB; não usar como referência o símbolo de aviação “Senta a Pua”. Não apresentar o logo do jogo como distintivo oficial.
- Popup de autoria: Geraldo Xexéo, assistência de IA, logo oficial do LUDES, copyright e licença CC BY-NC-SA 4.0 completa, inclusive offline. Marcas institucionais não são relicenciadas.
- Repositório: trabalhar apenas na branch `main`, sem branches adicionais ou worktrees, até nova orientação do autor.

## 3. Escopo histórico

O cenário representa o ataque final, não toda a campanha de novembro de 1944 a fevereiro de 1945. Deve destacar a relação entre relevo, observação, progressão da infantaria e apoio de artilharia.

As fontes secundárias consultadas situam o ataque principal às 06:00 ou ao amanhecer, a concentração de artilharia entre 16:00 e 17:00 e a chegada ao cume às 17:30. Os turnos são uma compressão para o jogo, não uma cronologia exata.

O caso dos observatórios na crista de Riva pertence à operação aliada no setor de Belvedere: os americanos escalaram as escarpas de surpresa na noite de 18–19/02, tomaram os postos e resistiram aos contra-ataques. Não transformar Riva em um objetivo brasileiro de Monte Castelo nem confundir os dois locais. A cronologia de Torraccia requer cuidado devido a divergências nas sínteses consultadas.

**Clima diário e topografia precisa ainda pendentes.** Não afirmar precipitação, neve, temperatura ou condições do solo em 21/02 sem fonte. Não copiar automaticamente o tempo ruim dos ataques de novembro/dezembro para fevereiro. Detalhes e fontes em [docs/HISTORIA.md](docs/HISTORIA.md).

## 4. Mapa

Implementado:

- Grade axial de 9 × 8 hexágonos, com seis vizinhos por hexágono.
- Peças quadradas, cada uma ocupando um hexágono.
- Mapa inteiramente esquemático, sem escala ou georreferenciamento; não é um mapa militar histórico.
- Campo aberto, mata, estrada e objetivos elevados.
- Quatro níveis relativos de altitude, indicados por ↑1–↑4. Não correspondem a cotas em metros.
- Monte Castelo vale 2 pontos por rodada de ocupação brasileira; “Esporão ocidental” e “Crista oriental” valem 1 cada. Os nomes e posições dos objetivos secundários são abstrações do jogo.

Nenhuma peça atravessa ou termina movimento num hexágono ocupado, inclusive por aliado. Não há empilhamento, zonas de controle, suprimentos, reforços ou retirada obrigatória nesta versão.

## 5. Unidades e informações dinâmicas

Cada lado começa com cinco peças; valores e quantidade são abstrações, não efetivos documentados.

| Atributo | Significado |
| --- | --- |
| A | Ataque nominal |
| D | Defesa nominal |
| M | Movimento restante no turno |
| PV | Resistência atual; todas começam com 3 |
| Selo vermelho | Dano acumulado: 3 − PV |
| Símbolo de retângulo com X | Infantaria |
| Símbolo de ponto no retângulo | Artilharia |

As peças brasileiras são verdes; as alemãs, cinza. Os nomes Franklin, Uzeda e Sizeno contextualizam a infantaria brasileira; não equivalem a uma ordem de batalha exata.

No painel de seleção: ataque, defesa, movimento, resistência, altitude, cobertura, alcance, potência atual e estado de ação. No duplo toque/clique: peça ampliada e seus atributos atuais.

Estados: pronta para agir, sem movimento mas ainda apta a atacar, ou ação concluída por já ter atacado. Resistência reduzida penaliza o ataque; não reduz movimento máximo nem defesa nominal nesta versão.

## 6. Sequência de rodada

1. Brasileiro move e ataca com suas peças, na ordem que desejar.
2. “Encerrar turno” transfere o comando ao computador.
3. Cada peça alemã calcula um destino legal e pode atacar uma vez.
4. Ao fim do turno alemão, computar os pontos brasileiros de ocupação.
5. Verificar vitória; se a partida continuar, iniciar a rodada seguinte e renovar movimento e direito de ataque brasileiros.

O movimento e o direito de ataque de cada lado são renovados no começo do seu turno. A inteligência alemã age localmente; a animação por unidade serve para tornar suas ações compreensíveis.

## 7. Movimento

- Infantaria e artilharia começam o turno com 3 PM.
- Campo aberto ou estrada: 1 PM para entrar.
- Mata: 2 PM para entrar.
- Somar 1 PM por nível de altitude ganho ao entrar no próximo hexágono.
- Descer não gera custo adicional nem devolve pontos.
- Um objetivo em elevação não cobra custo extra separado da subida, exceto se também for mata.
- O caminho usa o menor custo legal, podendo contornar obstáculos; não exige cliques em todos os hexágonos intermediários.
- O jogador pode mover em etapas enquanto houver PM.
- Atacar zera os PM restantes. Uma peça sem PM ainda pode atacar se não atacou neste turno.

O código admite um tipo de apoio blindado com 4 PM, mas nenhuma peça desse tipo está no cenário inicial. Não apresentar blindados como presentes neste protótipo histórico.

## 8. Ataque e observação

- Selecionar a própria peça e depois um inimigo válido.
- Infantaria: alcance de 1 hexágono. Artilharia: alcance de 2.
- Apenas um ataque por peça por turno.
- É permitido mover e depois atacar; não é permitido mover depois de atacar.
- Deve existir linha de visão, inclusive para artilharia nesta versão simplificada.
- Mata intermediária bloqueia a linha de visão. Um nível de terreno intermediário acima da linha interpolada entre atacante e alvo também bloqueia.
- Peças intermediárias não bloqueiam a visão. Não há avistamento compartilhado, fogo indireto real, névoa de guerra ou efeito de luminosidade nesta versão.

## 9. Combate

Calcular:

```text
potência = A + d6 − D − cobertura − vantagem de altura − penalidade por dano + barragem
```

- `d6`: sorteio uniforme de 1 a 6.
- Cobertura: +1 à defesa em mata ou objetivo elevado; não acumular duas coberturas.
- Vantagem de altura: mais +1 à defesa quando o defensor está num nível acima do atacante, independentemente da diferença total de níveis.
- Penalidade por dano: 0,5 por PV perdido pelo atacante.
- Barragem: +1 somente para artilharia brasileira na rodada 10.

| Resultado | Efeito |
| --- | --- |
| Potência ≥ 5 | Defensor perde 2 PV |
| Potência ≥ 1 e < 5 | Defensor perde 1 PV |
| Potência < 1 | Nenhum dano no defensor |
| Potência ≤ 0 e distância 1 | Atacante perde 1 PV por contra-ataque |

O contra-ataque é uma consequência automática de um ataque mal sucedido adjacente; não gasta a ação futura do defensor. No intervalo fracionário entre 0 e 1, pode haver falha sem contra-ataque. Peças com PV ≤ 0 são removidas imediatamente. Não há dano por área, munição ou fogo amigo.

Registrar dado, dano e eventual contra-ataque no diário. Mostrar a resistência e o selo de dano atualizados nas peças.

## 10. Pontos e vitória

- Ao fim de cada turno alemão, somar pontos dos objetivos ocupados por peças brasileiras: Monte Castelo 2, cada secundário 1.
- Os pontos são cumulativos; perder uma posição não subtrai pontos já ganhos.
- FEB vence ao alcançar 8 pontos ou eliminar todas as peças alemãs.
- Defesa alemã vence se eliminar a FEB ou se, ao terminar a décima rodada, a FEB não tiver alcançado 8 pontos.
- Ocupação exige a peça sobre o hexágono; proximidade não basta. Não existe bandeira permanente depois que a peça sai.
- Na regra atual, é possível vencer acumulando pontos secundários sem ocupar o cume. Avaliar esse detalhe no balanceamento, pois a fidelidade ao objetivo histórico pode justificar exigir a ocupação de Monte Castelo numa versão futura.

Essas regras são simétricas quanto a eliminação, mas o objetivo e o relógio são assimétricos: cabe ao brasileiro avançar; o alemão deve atrasar.

## 11. Horário e clima

Dez rodadas de 72 minutos, com início às 06:00 e término às 18:00. O horário mostrado no turno é seu início; a décima rodada começa às 16:48. O apoio de artilharia dessa rodada é inspirado na concentração histórica das 16:00–17:00, com duração e efeito simplificados.

Estado atual: boa visibilidade e movimento normal são hipóteses de cenário, identificadas como tal. Não há penalidade mecânica de frio, chuva, neve ou lama. A hora não altera automaticamente a visibilidade. Introduzir clima histórico somente após localizar e registrar fonte apropriada; definir e testar seus efeitos antes de alterar as regras.

## 12. Inteligências artificiais

### Escolha de alvo

- **Caçador:** maior ataque inimigo primeiro; desempate pela menor distância.
- **Oportunista:** menor defesa inimiga primeiro; desempate pela menor distância.
- **Estado-maior:** considera resistência, defesa, distância, ameaças, apoio de aliados e ocupação dos objetivos.

Os modos básicos priorizam o atributo e usam proximidade como desempate. Confirmar por teste de jogo se essa interpretação produz a experiência pretendida pelo autor.

### Postura de movimento

- **Agressiva:** maior incentivo a reduzir distância e conseguir ataque.
- **Defensiva:** valoriza cobertura e manutenção de elevações, sem impedir ataques possíveis.

O cálculo enumera destinos alcançáveis dentro dos PM, compara sua utilidade e escolhe um destino; em seguida escolhe um alvo legal. Estado-maior é uma heurística local, não busca minimax profunda. Meta: menos de 10 segundos de cálculo por turno em aparelhos razoáveis; medir antes de prometer desempenho em todo dispositivo.

### Aprendiz persistente

- Q-learning simples num único estado abstrato, com seis ações: três estratégias × duas posturas.
- Escolhe uma combinação por turno alemão.
- Exploração: 20%; caso contrário, favorece o maior valor aprendido.
- Taxa de aprendizado: 0,2; desconto: 0,85.
- Recompensa favorece danos brasileiros e penaliza perdas alemãs e pontos brasileiros; vitória alemã rende +8, derrota −8.
- A experiência é persistida em `localStorage`, chave `monte-castelo-learning-v1`, sem reinicialização automática entre partidas.
- Não aprende cada movimento individual, não usa rede neural nem depende de serviço remoto. Não há garantia de evolução monotônica ou de vencer o jogador.
- A partida atual não é restaurada após recarregamento; a experiência é mantida quando o navegador permite armazenamento. Limpar seus dados apaga o aprendizado.

## 13. Controles e comunicação

- Popup de narrativa no começo de cada operação.
- Um toque/clique seleciona; outro num destino move ou num inimigo válido ataca.
- Destaque de hexágonos alcançáveis e inimigos ao alcance.
- Duplo toque/clique amplia peça; seleção por Enter/Espaço também é aceita nas peças.
- Zoom contínuo por slider, pinça e Ctrl/Command + roda do mouse; botões +/− são atalhos adicionais.
- **Mapa inteiro:** enquadrar todos os hexágonos na área de mapa.
- **Visão tática:** aproximar para leitura das peças, permitindo rolagem do mapa.
- Popup de regras e história disponível durante a partida; popup separado de autoria e licença.
- Diário comunica combate, rodada, pontuação e barragem. Tela de fim explica o resultado e permite reiniciar.

## 14. Critérios de aceitação

- Compilar TypeScript sem erros e gerar um `jogo.html` executável sem backend.
- Exercitar movimento, bloqueio por ocupação, subida, cobertura, linha de visão, ataque, contra-ataque, eliminação, pontos e encerramento.
- Simular campanhas completas com todas as combinações de IA/postura sem movimentos ilegais.
- Testar em tamanhos de computador e celular: abertura, seleção, movimento, ataque, turno inimigo, regras, créditos, ampliação e zoom.
- Confirmar persistência do aprendizado depois de recarregar a página.
- Confirmar imagens e licença no arquivo standalone, sem requisições externas para jogar.
- Conferir o README e este guia antes de cada entrega. Distinguir claramente testes aprovados de fidelidade histórica ainda não verificada.

## 15. Versionamento e continuidade

A partir da solicitação do autor, todo novo commit deve avançar `0.1.X` e exibir versão, data e hora de Brasília no jogo e no README. O hook `.githooks/pre-commit` automatiza isso; não ignorá-lo. Commits anteriores à solicitação não são reescritos. Manter apenas a branch `main`.

Continuar autonomamente por etapas concretas e verificáveis. Registrar decisões alteráveis pelo autor e limitações; não tratar hipótese histórica como fato ou prometer trabalho indefinido após o encerramento da tarefa.

## 16. Autojogo obrigatório e arquitetura

O núcleo `engine.ts` não depende de navegador; `ai.ts` decide usando esse núcleo; `simulator.ts` executa partidas completas com sementes reproduzíveis. A interface `app.ts` usa o mesmo motor. Antes de considerar uma versão pronta, rodar autojogo e comparar os resultados com o problema histórico, sem inventar equivalência entre estatísticas do jogo e a batalha real.

Buscar aproximadamente 50% de vitórias para cada lado usando a mesma IA, postura e regras em ambos. Reportar quantidade de partidas, sementes, taxa e incerteza. Não ajustar resultados durante uma partida, não impor alternância de vitórias e não afirmar equilíbrio contra humanos com base apenas em autojogo. Decisões de balanceamento podem ser revistas pelo autor.

A amostra inicial de 500 partidas resultou em 51,4% FEB e 48,6% defesa alemã. A grande maioria terminou por eliminação; essa semelhança limitada com a tomada histórica do cume deve permanecer explícita.

## 17. Registro de decisões

| Data | Decisão | Estado |
| --- | --- | --- |
| 25/10/2026 | Nome Monte Castelo Vibed; HTML e TypeScript só no navegador | Implementado |
| 25/10/2026 | Mapa hexagonal, peças quadradas e símbolos militares | Implementado |
| 25/10/2026 | Partida curta, humano × computador, três estratégias e aprendiz persistente | Implementado; balanceamento pendente |
| 25/10/2026 | Movimento, defesa e observação dependem de terreno e altitude | Implementado |
| 25/10/2026 | Fundo branco, narrativa, dois enquadramentos e zoom contínuo | Implementado |
| 25/10/2026 | Copyright, CC BY-NC-SA 4.0 e logo LUDES no popup | Implementado |
| 25/10/2026 | Emblema inspirado na cobra fumando, substituindo inspiração inicial em Senta a Pua | Implementado |
| 25/10/2026 | Informações dinâmicas de movimento, dano e estado | Implementado |
| 25/10/2026 | Documentar regras antes de continuar sua evolução | Este guia criado após o protótipo inicial |
| 25/10/2026 | Pesquisar clima diário e cartografia original | Pendente; não inventar dados |
