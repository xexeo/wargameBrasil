# Matriz de IAs — matriz-ias

Versão executada 0.1.16; 640 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 90,0% | 100,0% | 80,0% | 100,0% | 70,0% | 100,0% | 100,0% | 100,0% | 92,5% |
| CD | 100,0% | 100,0% | 100,0% | 100,0% | 70,0% | 90,0% | 100,0% | 100,0% | 95,0% |
| OA | 40,0% | 100,0% | 60,0% | 100,0% | 30,0% | 100,0% | 80,0% | 40,0% | 68,8% |
| OD | 20,0% | 100,0% | 50,0% | 100,0% | 70,0% | 100,0% | 70,0% | 20,0% | 66,3% |
| EA | 100,0% | 90,0% | 100,0% | 100,0% | 60,0% | 100,0% | 80,0% | 100,0% | 91,3% |
| ED | 100,0% | 100,0% | 100,0% | 100,0% | 50,0% | 100,0% | 100,0% | 100,0% | 93,8% |
| AP | 60,0% | 100,0% | 70,0% | 100,0% | 60,0% | 100,0% | 80,0% | 60,0% | 78,8% |
| VE | 100,0% | 100,0% | 100,0% | 100,0% | 70,0% | 90,0% | 100,0% | 100,0% | 95,0% |

- **CA**: Caçador agressivo.
- **CD**: Caçador defensivo.
- **OA**: Oportunista agressivo.
- **OD**: Oportunista defensivo.
- **EA**: Estado-maior agressivo.
- **ED**: Estado-maior defensivo.
- **AP**: Aprendiz simples · memória inicial vazia.
- **VE**: Veterana · tabela distribuída + aprendizado na partida.

## Resultados e duração

545 vitórias FEB (85,2%), 95 alemãs. Média 7,30 rodadas e 7,60 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 74/80 | 19/80 |
| CD | 76/80 | 1/80 |
| OA | 55/80 | 14/80 |
| OD | 53/80 | 0/80 |
| EA | 73/80 | 32/80 |
| ED | 75/80 | 2/80 |
| AP | 63/80 | 9/80 |
| VE | 76/80 | 18/80 |

Derrotas FEB com toda a defesa fora de combate: **7** (1,1% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 7,11/15; DE 14,24/15. PV e peças não são contagens de mortos.

Motivos: mission: 510; deadline: 8; noManeuverInfantry: 87; lateSummit: 35.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | OA, OD, AP | — |
| BR | ED | OA | — |
| BR | AP | OA | — |
| DE | CA | OD, VE | — |
| DE | CD | OD | — |
| DE | OA | OD | — |
| DE | EA | CD, OD, ED, AP | CD, OD, ED |
| DE | ED | OD | — |
| DE | AP | CD, OD | — |
| DE | VE | OD | — |

Melhor média atacante: CD, 76/80. Melhor média defensora: EA, 32/80. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 200001–200010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE, que escolhem políticas. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.

## Avaliação desta revisão

No painel de640 partidas houve545 vitórias FEB (85,2%) e95 alemãs (14,8%), com7,30 rodadas em média. A média do painel mistura políticas com desempenhos muito diferentes e **não é o equilíbrio EA×EA**. CD e VE empataram como melhores atacantes,76/80; EA foi a melhor defensora,32/80. Não houve dominância global observada: EA defensora foi melhor em diversas linhas, mas CA explorou melhor OD atacante; nenhum perfil superou todos os outros contra todos os oponentes.

Houve7 derrotas FEB com toda a defesa fora de combate (1,1% do painel), contra104 no painel de0.1.9. Trata-se de comparação descritiva: mudaram heurísticas, treino e regras, portanto não isola a contribuição de cada mudança. Foram510 vitórias por missão completa,35 por cume no fechamento final,87 derrotas por perda da infantaria e8 por prazo.

A validação de500 partidas da mesma IA tática/agressiva nos dois lados deu54% FEB/46% DE, perto da meta. Isso não se generaliza para todos os perfis. Na avaliação separada da Veterana, com tabela compartilhada por partida e exploração zero, a FEB venceu300/300. Essa política continua fraca na defesa nesse protocolo; treino e nome não significam força universal. A matriz usa outra configuração de aprendizado (tabelas independentes, exploração de8%) e os conjuntos não devem ser misturados.

A prioridade de aperfeiçoamento restante é a escolha de políticas da Veterana defensora e das posturas defensivas básicas. O cenário não foi deformado nem recebeu reforços históricos inventados para forçar taxas. As chances por célula continuam apenas sondagens de10 partidas.
