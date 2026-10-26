# Duas escalas no mesmo jogo — plano da 0.9.1

Pedido de 26/10/2026: integrar batalhão e companhia como duas opções do mesmo jogo, em um único ciclo de implementação, calibração e treinamento. Não criar outro jogo, outra interface ou duplicar o motor.

## Arquitetura e candidato

Compartilhar mapa, combate, altura, movimento, reações, objetivos, turno, interface, acessibilidade, arquivos remotos e simulador. Separar dados de tropas, orçamento de comando, modelos treinados e memória de experiência por escala. Partidas antigas sem escala significam batalhão; não converter uma partida iniciada. A opção escolhida inicia nova partida mediante confirmação quando necessário.

O rascunho da branch companhia servirá de referência, não será mesclado inteiro: foi escrito antes das últimas revisões e propunha apoio fora do mapa, reservas temporizadas e outras regras ainda não implementadas. Para preservar o mesmo jogo, esta integração mantém os dois apoios brasileiros e os fogos alemães como contadores do motor compartilhado. Nove companhias brasileiras (três por batalhão) + dois apoios =11 peças; quatro destacamentos e fogos alemães =5; total 16. Todos começam no mapa, com a terceira companhia de cada batalhão na retaguarda. Posições e letras A/B/C são etiquetas de cenário, não numeração/horário históricos comprovados.

Uma companhia brasileira por batalhão pode receber ordens no turno (movimento e ataque em qualquer ordem). Seleção não gasta comando; a primeira ação legal escolhe a companhia. Assim nove peças não triplicam os ataques dos três batalhões. Reação/reorganização de uma companhia ocupa o comando do batalhão no próximo turno; reação limitada a uma companhia por batalhão entre turnos. Apoios têm suas ações próprias. Destacamentos alemães permanecem independentes. Três PV significam coesão de cada escalão, não pessoas iguais.

Candidato: companhias A 2/D2, apoio A 2/D1, fogos FEB A 4/D1; destacamentos alemães A 2/D2, reserva A 1/D1, fogos A 3/D1. Movimento, alcance, dez rodadas, meta8+cume e geografia permanecem da 0.9.0. Comparar parâmetros de proteção/subida em uma só rodada de estudo, escolher uma vez, então treinar modelos por escala/lado e avaliar com sementes separadas. Não iterar até obter uma porcentagem desejada.

## Pesquisa e verificação

Reconsultar organização do Museu Virtual da FEB, Fisher e análises militares disponíveis. Estrutura orgânica conhecida não prova disposição local. Registrar fontes e limites. Dados brutos, sementes e análises por versão/escala; invalidar relatórios incompatíveis. Testar comando humano/IA, reação, salvamento, WhatsApp, perdas por força inicial, troca de escala e isolamento de experiência. Regras e narrativa devem informar a escala nos dois idiomas. Publicar a mesma página com seletor e atualizar README/guia.

## Implementação compartilhada

| Área | Estrutura |
| --- | --- |
| Motor e interface | `engine.ts` e `app.ts` únicos; escala é dado em `rules.scale`, ausente significa batalhão. Não há cópia do jogo. |
| Geografia/tempo/objetivos/visual | Mesmos módulos, recursos, zoom, idioma, sons, animações e condições de vitória. |
| Tropas | `troops.ts` conserva perfis originais; `company-troops.ts` deriva dados próprios e relações com batalhão. `profilesForScale` resolve a força inicial. |
| Comando | Predicado único de legalidade usado por humano, prévia e IA; somente companhias brasileiras têm grupo de comando. Mapas de ordens e reação são serializados, incluindo dívida de uma peça já removida. |
| IA tática | Algoritmos compartilhados; a ordenação considera qual companhia pode agir e qual está melhor colocada. Não há IA de movimentos duplicada. |
| Aprendizado | Mesmo treinador/atualização/inferência. Dados separados: dois modelos fixos por escala e uma tabela online por escala. Estado companhia tem prefixo próprio e coesão normalizada pela força inicial. |
| Armazenamento | Chaves legadas do batalhão preservadas; companhia usa namespace separado. Importar experiência de outra escala é recusado. Uma partida ativa carrega a escala e os comandos no mesmo formato de turno. |
| Medição | Mesmo simulador e matriz 9×9,10 jogos por dupla em cada escala; avaliação independente dos quatro modelos fixos. Denominadores de perdas dependem da força inicial, não de uma constante5/15. |

A versão integrada substitui o rascunho como comportamento executável; o experimento antigo continua preservado no Git. Não foram adicionados apoio fora do mapa, reserva temporizada ou outra interface. A previsão de chegada permanece otimista e ignora futura concorrência por comando entre companhias, além de ocupação e fogo futuro.

[Pesquisa efetivamente consultada e limites](PESQUISA_COMPANHIAS.md). Após comparar os candidatos, foram mantidos subida2 e cobertura2 nas duas escalas. A opção companhia mantém os mesmos critérios de vitória; não ganha pontos apenas por possuir mais contadores. Escolhas continuam editáveis, mas este pedido foi executado como um só ciclo, sem ajustes sucessivos para buscar uma taxa desejada.

## Verificação da entrega

A integração0.9.1 passou 78 testes sem interface e124 casos em Chromium, computador/celular. A 0.9.2 acrescenta a correção de movimento:80 testes sem interface e132 casos de navegador. Inclui partida completa de companhia pelos controles humanos e turno computacional, ordens por batalhão, dívida de reação após remoção da peça, retomada, inglês americano, troca de escala, memória separada e arquivo remoto. Na integração0.9.1, comparação de 120 partidas com módulos compilados da 0.9.0 confirmou vencedor, rodada, pontos, motivo e contagens de ataques na escala original para os casos testados.

Um ciclo completo:1.440 partidas de estudo de quatro candidatos, quatro modelos fixos com 2.400 jogos cada e duas Veteranas com 2.000 jogos cada. Avaliação independente:1.300 jogos por escala; matrizes:810 por escala. Não somar esses conjuntos como uma taxa única. [Índice, dados brutos, sementes e hashes](simulacoes/README.md). O tempo de cálculo foi medido separadamente das pausas visuais e não promete o mesmo desempenho em todos os celulares.

O mapa e os objetivos foram preservados. A companhia exige mais escolhas e pode ocupar mais rodadas, mesmo com o limite de comando; não se afirmou duração humana medida. A avaliação mostra diferenças importantes entre políticas e aprendizes, não equilíbrio perfeito nem ausência de estratégias dominantes. Isso foi registrado sem abrir outro ciclo de ajuste ou treino seletivo.

## Correção solicitada após a integração —0.9.2

O autor identificou que perfis de 1/2 PM e mata subindo por 4 PM podiam bloquear a progressão. A correção garante um passo com orçamento completo para vizinho livre plano, descendo ou subindo um nível, nas duas escalas e ao retomar partidas antigas. Desníveis maiores conservam o custo integral. Esse pedido altera deliberadamente o movimento da base; a regressão anterior é registro da 0.9.1, não afirma equivalência da regra nova. Resultados e modelos anteriores foram invalidados e substituídos por uma nova passagem para a regra final. [Verificação exaustiva](MOVIMENTO_MINIMO.md).
