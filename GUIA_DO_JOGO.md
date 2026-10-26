# Monte Castelo Vibed — guia de regras e registro de decisões

Versão 0.1 · 25/10/2026 · referência para implementação, testes e revisão.

Este documento foi solicitado quando o primeiro protótipo já estava implementado. Registra seu estado real e orienta as próximas mudanças; não implica que os recursos abaixo já existiam antes dessa solicitação. Toda alteração relevante de regra deve atualizar este guia, os testes correspondentes, o popup de regras e o README.

## 1. Objetivo do projeto

Criar um wargame de navegador, em HTML e TypeScript, humano contra computador, sobre a conquista de Monte Castelo pela FEB em 21/02/1945. Inspiração em wargames tradicionais da Avalon Hill, com regras simples e nível de abstração solicitado pelo autor a partir de *Guerra dos Sete Dias*, da coleção *Todos os Jogos*. Não reproduzir regras, mapas ou componentes desses jogos.

Meta de duração: 5–10 minutos, ainda a confirmar por testes com jogadores. Cada campanha dura no máximo dez rodadas. Não há backend de jogo, conta ou serviço de IA.

## 2. Plataforma e identidade

- Nome: **Monte Castelo Vibed**.
- Jogável em navegador de computador e celular; o arquivo `jogo.html` incorpora os recursos necessários e pode ser aberto diretamente.
- Código-fonte em TypeScript; saída compilada em JavaScript. `template.html` é o fonte HTML; `index.html` e `jogo.html` são gerados e autocontidos. Publicar a mesma versão completa evita mistura de recursos entre atualizações.
- Fundo branco, texto escuro, mapa com cores claras de vegetação e terra.
- Logo original inspirado na cobra fumando da FEB; não usar como referência o símbolo de aviação “Senta a Pua”. Não apresentar o logo do jogo como distintivo oficial.
- Popup de autoria: Geraldo Xexéo, assistência de IA, logo oficial do LUDES, copyright e licença CC BY-NC-SA 4.0 completa, inclusive offline. Marcas institucionais não são relicenciadas.
- Repositório: trabalhar apenas na branch `main`, sem branches adicionais ou worktrees, até nova orientação do autor.

## 3. Escopo histórico

O cenário representa o ataque final, não toda a campanha de novembro de 1944 a fevereiro de 1945. Deve destacar a relação entre relevo, observação, progressão da infantaria e apoio de artilharia.

As fontes secundárias consultadas situam o ataque principal às 06:00 ou ao amanhecer, a concentração de artilharia entre 16:00 e 17:00 e a chegada ao cume às 17:30. Os turnos são uma compressão para o jogo, não uma cronologia exata.

O caso dos observatórios na crista de Riva pertence à operação aliada no setor de Belvedere: os americanos escalaram as escarpas de surpresa na noite de 18–19/02, tomaram os postos e resistiram aos contra-ataques. Não transformar Riva em um objetivo brasileiro de Monte Castelo nem confundir os dois locais. A cronologia de Torraccia requer cuidado devido a divergências nas sínteses consultadas.

**Boletim instrumental e topografia precisa ainda pendentes.** A reconstrução regional ERA5 foi adicionada com fontes e limites em docs/TEMPO_21_FEVEREIRO_1945.md. Não apresentar valores modelados como medições no cume. Não copiar automaticamente o tempo ruim dos ataques de novembro/dezembro para fevereiro. Detalhes e fontes em [docs/HISTORIA.md](docs/HISTORIA.md).

## 4. Mapa

Implementado:

- Grade axial de 9 × 9 hexágonos, com seis vizinhos por hexágono.
- Peças quadradas, cada uma ocupando um hexágono.
- Base geográfica atual ancorada no cume OSM de Monte Castello (44,2206238°N / 10,9537700°E), aproximadamente 180 m entre centros de hexágonos. DEM Copernicus GLO-90 em cada centro; feições OSM atuais. Ainda não é um mapa militar restituído de 1945.
- Campo aberto, mata, estrada e objetivos elevados.
- Quatro faixas de altitude DEM: N1 <780 m, N2 780–849 m, N3 850–919 m, N4 ≥920 m. Curvas a cada 50 m interpoladas entre amostras, não curvas de levantamento de precisão. Os níveis continuam simplificando o custo e a defesa.
- Monte Castelo vale 2 pontos por rodada de ocupação brasileira; cada secundário vale 1. Os secundários não têm nomes próprios: são referências de hexágono sem localização histórica confirmada. O total máximo é 4 por rodada, acumulável até a meta de 8.

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

As peças brasileiras são azuis; as alemãs, carvão, ambas com identificação textual. O mapa usa papel e terra para separar terreno e contadores. Títulos usam Barlow Condensed sem serifa, e números dos contadores usam Arial/sans em negrito. Os nomes Franklin, Uzeda e Sizeno contextualizam a infantaria brasileira; não equivalem a uma ordem de batalha exata.

O popup de regras deve conter uma peça de exemplo e explicar cada marca: bolinhas douradas = PV; ponto branco central = artilharia; retângulo com X = infantaria; selo vermelho = dano; traço diagonal = ataque já usado; A/D/M = ataque, defesa e movimento restante; FEB/DE = lado.

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

- Batalhões brasileiros têm 3 PM; destacamentos alemães e apoio, 2; grupos de artilharia, 1. Cada perfil em troops.ts define o máximo.
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
- Infantaria: alcance de 1 hexágono. Artilharia: alcance de 5 hexágonos, com tiro indireto.
- Apenas um ataque por peça por turno.
- É permitido mover e depois atacar; não é permitido mover depois de atacar.
- Infantaria usa linha de visão direta. Artilharia pode bombardear alvos conhecidos, inclusive fortificações, a até 5 hexágonos, sem bloqueio por terreno intermediário; a proteção do defensor continua valendo. Simplificação de fogo previamente planejado num mapa sem névoa de guerra.
- O raio direto interpola a altitude DEM dos centros com altura de observação de 2 m; terreno e copa de mata (15 m como parâmetro de jogo) bloqueiam se ultrapassarem esse raio. Hexágonos adjacentes sempre têm linha de visão.
- Peças intermediárias não bloqueiam a visão. Não há avistamento compartilhado, observadores de artilharia individualizados, névoa de guerra ou efeito de luminosidade nesta versão.

## 9. Combate

Calcular:

```text
potência = A + d6 − D − cobertura − vantagem de altura − penalidade por dano + barragem
```

- `d6`: sorteio uniforme de 1 a 6.
- Cobertura: +1 à defesa em mata, objetivo elevado ou fortificação; usar o maior bônus, sem acumular coberturas. Monte Castelo e um objetivo secundário recebem abrigos/trincheiras esquemáticos de nível 1, não localizações verificadas de bunkers.
- Vantagem de altura: mais +1 à defesa quando o defensor está pelo menos 30 m acima do atacante.
- Penalidade por dano: 0,5 por PV perdido pelo atacante.
- Barragem: +1 somente para artilharia brasileira na rodada 10.

| Resultado | Efeito |
| --- | --- |
| Potência ≥ 5 | Defensor perde 2 PV |
| Potência ≥ 1 e < 5 | Defensor perde 1 PV |
| Potência < 1 | Nenhum dano no defensor |
| Potência ≤ 0 e distância 1 | Atacante perde 1 PV por contra-ataque |

O contra-ataque de um ataque mal sucedido adjacente só ocorre se o defensor não estiver suprimido e não tiver reagido. Na nova missão, consome sua próxima ação, sem duplicar um tiro defensivo anterior. No intervalo fracionário entre 0 e 1, pode haver falha sem contra-ataque. Peças com PV ≤ 0 são removidas imediatamente. Não há dano por área, munição ou fogo amigo.

Registrar dado, dano e eventual contra-ataque no diário. Mostrar a resistência e o selo de dano atualizados nas peças.

## 10. Pontos e vitória

- Ao fim do turno alemão, apenas infantaria de manobra brasileira sobre objetivos pontua: cume 2, cada secundário 1. Apoio e artilharia não ocupam para pontuação.
- **4 é o máximo por rodada; 8 é a meta acumulada.** Dois fechamentos de rodada com todos os objetivos dão 4 + 4 = 8. Os pontos ganhos não são subtraídos ao perder uma posição.
- Para vencer antes do prazo, FEB precisa acumular8 pontos e assegurar Monte Castelo com infantaria no fechamento do turno alemão. No fechamento da rodada10, o cume basta; sem8 pontos, é vitória custosa, com eficiência máxima44. Eliminar a defesa ou controlar somente os secundários não substitui o cume.
- Defesa vence se toda a infantaria de manobra brasileira sair de combate ou o cume não for assegurado no fechamento final. Partidas antigas sem a flag de conquista no prazo ainda exigem a pontuação completa.
- Grau da vitória: eficiência = máximo de zero e arredondamento de `100 − 3 × (rodada final − 1) − 8 × peças brasileiras perdidas − 1,5 × coesão perdida`. Decisiva ≥70, tática ≥45, custosa ≥20, pírrica abaixo de 20. Isso não é contagem de mortos reais.
- Partidas antigas sem configuração de missão preservam as regras de sua versão; a interface lê a meta do estado salvo.

### Subida sob fogo

Uma unidade de tiro direto pelo menos 30 m acima pode reagir primeiro ao avanço exposto ou ao assalto contra ela, respeitando alcance e linha de visão. Uma reação por movimento completo e uma por unidade entre seus turnos; consome o próximo turno de movimento e ataque. O tiro de oportunidade causa no máximo 1 dano. Não se soma novo contra-ataque de falha do assalto após a reação. Regra simétrica para ambos os lados.

Acerto indireto suprime reação até o início do turno do alvo; não tira o ataque normal. Apoio deve preceder a manobra. Tiro direto ganha +1 hexágono com pelo menos 90 m de vantagem real de altitude e linha de visão. Indireto não ganha alcance com altura. Os grupos de ambos os lados têm alcance 5; isso representa disponibilidade de apoio, não limite balístico dos obuses.

## 11. Horário e clima

Dez rodadas de 72 minutos, com início às 06:00 e término às 18:00. O horário mostrado no turno é seu início; a décima rodada começa às 16:48. O apoio de artilharia dessa rodada é inspirado na concentração histórica das 16:00–17:00, com duração e efeito simplificados.

Estado atual: a série ERA5 regional de 21/02 está incorporada em weather.ts, com estimativas horárias, popup de método e fonte arquivada. É reanálise de resolução ~25 km, não observação no cume. O jogo seleciona a hora inteira anterior ao início da rodada e identifica o dado como ERA5 regional. Não há penalidade mecânica automática de frio, chuva, neve ou lama. Nuvens não equivalem a nevoeiro; a hora não altera automaticamente a visibilidade. Dados de profundidade da neve são nulos e não devem ser interpretados como zero. Mudanças futuras de regra climática exigem decisão explícita e novos testes.

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
- A partida atual é restaurada por ponto de controle completo; a experiência é mantida quando o navegador permite armazenamento. Limpar seus dados apaga o aprendizado.

### IA especial Veterana

Implementada em `learning.ts`, independente da interface. Q-learning tabular sobre seis políticas; o estado distingue lado, fase, vantagem em PV, faixa de pontos, objetivos ocupados e presença no cume. Taxa 0,18, desconto 0,9, exploração de 8% no navegador. Recompensa usa diferença de forças, pontos e controle, com +12/−12 ao final. Treinamento inicial: 2.000 partidas, sementes 50001–52000, exploração decrescendo de 30% a 10%. Tabela incorporada em `pretrained.ts`; aprendizado local salvo com esquema versionado, exportável/importável. `persistence.ts` é o adaptador substituível por armazenamento de app. Esse recurso amplia o Aprendiz simples, que continua disponível separadamente.

A avaliação deve usar sementes distintas e registrar quando a experiência online está ativa. Treinamento não garante taxa específica de vitória ou melhora em toda partida.

## 13. Controles e comunicação

- Popup de narrativa no começo de cada operação; botão Missão reabre a narrativa sem reiniciar.
- Um toque/clique seleciona e mostra simultaneamente destinos azuis e barras vermelhas nos alvos. Tocar no destino move; tocar no inimigo marcado ataca. Não há botões de modo.
- Destaque de hexágonos alcançáveis e inimigos ao alcance.
- Duplo toque/clique amplia peça; seleção por Enter/Espaço também é aceita nas peças.
- Zoom contínuo por slider, pinça e Ctrl/Command + roda do mouse; botões +/− são atalhos adicionais.
- **Mapa inteiro:** enquadrar todos os hexágonos na área de mapa.
- **Visão tática:** aproximar para leitura das peças, permitindo rolagem do mapa.
- Popup de regras e história disponível durante a partida; popup separado de autoria e licença.
- Botão Nova partida no topo, ao lado de Encerrar turno, e também no painel lateral. Reiniciar não apaga o aprendizado.
- Diário comunica combate, rodada, pontuação e barragem. Tela de fim explica o resultado e permite reiniciar.

### Partidas remotas e retomada

Humano × humano funciona por fotografias de turnos compartilhadas por link no WhatsApp, quando hospedado, ou arquivo JSON offline. Quem recebe assume o lado que deve jogar. Quem enviou fica impedido de agir pelo lado oposto enquanto aguarda. Não há backend, salas ao vivo, identidade verificada ou sincronização automática; o estado mais recente deve ser trocado pelos jogadores. Importar um estado valida esquema, posições e limites de atributos.

A sessão local guarda modo, lado, peças, pontos, rodada, preferências e contexto de aprendizado. Não salvar um turno parcialmente processado da IA. Ao recarregar, oferecer retomada do último ponto completo.

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

Os resultados compatíveis e seus dados ficam em [docs/simulacoes](docs/simulacoes/README.md). Resultados de regras anteriores foram removidos da árvore atual; consultar o histórico do Git para recuperar decisões.

## 17. Revisão de jogabilidade — tiro indireto

A versão inicial exigia linha de visão direta para artilharia. O autojogo e a observação do autor mostraram que a dobra do terreno bloqueava o tiro contra posições que a artilharia deveria apoiar. Decisão revisável: alcance 3 e tiro indireto contra alvos conhecidos; manter cobertura/fortificação. Reexecutar treino, testes e torneios após essa mudança, sem misturar taxas de vitória com as do modelo anterior.

## 18. Revisão geográfica

Base moderna Copernicus DEM/OSM incorporada para tornar o relevo, os caminhos e as localidades menos inventados. Fontes arquivadas, método e limites em docs/GEOGRAFIA.md. A imagem histórica de Casini fica no popup Mapa & fontes. Não confundir feições modernas com 1945, nem pontos de cenário com posições militares verificadas. Reexecutar treino e balanceamento depois da mudança de terreno. Dados OSM mantêm ODbL separadamente do código CC BY-NC-SA.

## 19. Revisão do gerador reproduzível

O LCG inicial correlacionava o primeiro dado entre sementes consecutivas. Substituído por Mulberry32 e adicionado teste de distribuição das primeiras faces entre sementes. Resultados antigos são registros legados, não validação da versão atual. A regra de combate real do navegador continua usando seu gerador uniforme; não há alteração de dados para favorecer qualquer lado.

Na comparação da base geográfica, os atributos originais ficaram mais próximos de 50% que os três ajustes candidatos. Mantidos os atributos originais; escolha revisável pelo autor. Documentar amostras de referência e validação separadamente.

## 20. Registro de decisões

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

## Revisão 0.1.9

Perfis e escala em [docs/TROPAS.md](docs/TROPAS.md); fontes militares em [docs/MAPAS_OFICIAIS.md](docs/MAPAS_OFICIAIS.md). Tabuleiro alongado para 81 hexágonos com amostras DEM reais. Sem nomes fictícios nos secundários. Nova vitória exige cume, tempo e perdas graduam o resultado. Relatórios antigos de equilíbrio não avaliam estas regras; consultar os novos relatórios summit no README.


## Persistência dos experimentos

Guardar análises e dados por versão em docs/simulacoes/<versão>/<execução>. Manifesto contém hashes de regras, geografia, IA e protocolo. Build e commit removem diretórios incompatíveis e referências numéricas marcadas no README. Versionamento/CSS/documentação não invalidam; O aprendizado simples foi extraído para simple-learning.ts, compartilhado com o simulador e incluído nos hashes; app.ts fica restrito à interface e à coordenação dos controles. Mudanças exclusivamente visuais não invalidam simulações sem interface. Nunca rotular um resumo agregado como dados individuais. Novas execuções guardam uma linha por partida, sementes, parâmetros e resumo; os experimentos antigos declaram quando esses dados não existiam.

## Revisão atual dos batalhões

Implementadas projeção de missão, risco no percurso e orientação da IA por papel/objetivo. Ver [REVISAO_BATALHOES.md](docs/REVISAO_BATALHOES.md). Explicar motivo do resultado mesmo quando a defesa foi eliminada; não afirmar que manteve o cume se a FEB o ocupa. Novas partidas ativam retirada por perdas e aceitam o cume no fechamento final para vitória custosa sem a meta de pontos. Partidas anteriores preservam suas flags/regras. Treino distribuído alterna os lados aprendizes contra seis políticas fixas, com autojogo a cada sétima partida; isso não é avaliação independente. Novas simulações são rejeitadas se o programa mudar durante sua execução.

## Regra adotada após comparar candidatos

A combinação de retirada e cume suficiente no fechamento final foi validada com sementes separadas e adotada para novas partidas. Retirada por tiro não cura e cobra a próxima ativação; sem saída livre não há recuo, e golpe fatal remove a peça. Cume mais8 pontos antecipa vitória. No último fechamento, cume ocupado por infantaria dá vitória; sem8 pontos, eficiência fica limitada a44 e o grau é custoso. A versão antiga continua exigindo8 pontos se a flag de conquista no prazo estiver ausente/falsa. Instrução da missão vem do motor para manter texto e regra iguais.

## Ordem de ação, modos e fim imediato

Novas partidas têm freeFireOrder: movimento e um ataque em qualquer ordem, sem PM cobrados pelo disparo. Reação/reorganização ainda comprometem ações. Flag ausente/falsa preserva ordem anterior. Neutralização completa de um lado encerra imediatamente por eliminação, identificada como tal sem afirmar ocupação do cume. Há modos computador FEB e humanos locais, além dos anteriores. O comando de encerrar turno fica na barra fixa do mapa. Estrelas vermelhas centrais são objetivos, tracejado indica exposição, não bloqueio. O apoio agregado é histórico na composição de armas, mas o contador/alcance são abstrações explicitadas no popup. PT padrão, EN-US opcional; estado da partida e memória não dependem do idioma.

## Aprendizes fixos separados por lado — v0.1.19

A opção Aprendiz fixo escolhe a política do turno consultando exclusivamente a tabela do lado controlado pelo computador: FEB ou Alemanha. Cada tabela é treinada em 2.400 partidas contra as seis combinações fixas de estratégia e postura, em 400 partidas por adversário. Durante o jogo publicado não há exploração, atualização de pesos nem uso da experiência pessoal do navegador. Os dados de combate continuam aleatórios. Alpha 0,18, gamma 0,9 e exploração de treino 0,20 são constantes; exploração de inferência é zero. Detalhes em [IA_POR_LADO.md](docs/IA_POR_LADO.md).

A Veterana e a Aprendiz simples mantêm seu aprendizado online e são opções distintas. Alterar o idioma ou escolher o modelo fixo não apaga suas memórias. Regras e fatos históricos permanecem comuns a todas as IAs.

A homenagem passa a mostrar a fotografia fornecida pelo usuário, restaurada com auxílio de IA e identificada como tal. Os emblemas conservam suas fontes e condições próprias.

## Sinalização de combate e fotografia — v0.1.20

Os disparos passam a emitir eventos transitórios, com origem e impacto registrados antes de retirada ou eliminação. A interface mostra traço, pequena explosão e mensagem de ataque, fogo defensivo ou contra-ataque, distinguindo dano de ausência de perda. O fogo durante avanço identifica o hexágono intermediário atingido. A apresentação não muda resultados, aleatoriedade, regras ou estado compartilhado. Os efeitos respeitam a preferência de redução de movimento.

A fotografia da homenagem é substituída pelo JPEG `1000165051.jpg`, enviado depois pelo usuário, sem tratamento adicional. A legenda é atualizada para não atribuir a esta imagem a restauração por IA aplicada à imagem anterior.

Por solicitação do autor, a comparação histórica de baixas humanas deixa de aparecer no resultado final, já que não há dados confirmados adequados ao dia da batalha. A pesquisa permanece na documentação. O relatório final conserva apenas perdas da partida em peças, coesão e recuos. O popup de unidade exibe seu dano e estado atuais ao ser aberto.

## Próxima entrega consolidada

[Plano com pedidos, decisões revisáveis e verificação](docs/PLANO_PROXIMA_VERSAO.md): personalização completa da aparência e narrativa histórica ampliada com fontes brasileiras e pesquisa em acervos, preservando as correções e as regras da0.1.20.

## Aparência, narrativa e encerramento — v0.1.21

Popup Aparência com três presetsA/B/C e valores visuais independentes, persistência e validação. Tokens compartilhados por CSS/SVG centralizam cores, fontes, tamanhos, espessuras e opacidades. Animações opcionais diferenciam infantaria, apoio e artilharia; desativá-las mantém a indicação estática de impacto e o anúncio. Não alteram combate ou aprendizado.

A legenda explica todos os símbolos atuais, e o marcador de dano passa para uma camada acima das peças, fora do escalão/ID. Todos os popups incluem botão Fechar/Close ao fim do texto. A narrativa antes/durante o ataque usa fontes brasileiras; o impacto e as hipóteses posteriores aparecem somente no resultado final, de acordo com o vencedor.

A descrição de eliminação consulta a posição final do cume, distinguindo infantaria, apoio e ausência de peça. Não confunde ausência final com nunca ter ocupado a posição, nem exige o fechamento de rodada anterior para descrever uma infantaria já presente. A condição de vitória é preservada.

Mapa inteiro passa a ajustar a largura e a altura proporcionalmente ao SVG, sem faixa vazia; a página pode ser rolada. Zoom livre, pinça e visão tática são preservados. Fontes e limites históricos permanecem em PESQUISA_ACERVOS_NARRATIVA.md. O plano consolidado está entregue, com pendências documentais explicitadas e o equilíbrio50/50 ainda não alcançado.

Sons de combate opcionais, desligados inicialmente, com volume e preferência persistente. São sintetizados localmente; não gravações de armas históricas. O gerador de ruído é independente do RNG de combate. A tabela das regras resume movimento, cobertura, subida/descida, vantagem de altura e tiro indireto, sem mudar os valores do motor.

## Homenagem — v0.1.22

Removidos o distintivo atual do Regimento Ipiranga e sua legenda, por orientação do autor. A homenagem conserva a fotografia de Pedro Bonorino, a referência ao6ºRI e o distintivo da FEB.
