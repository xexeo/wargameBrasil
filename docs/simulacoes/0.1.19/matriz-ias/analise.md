# Matriz de IAs — matriz-ias

Versão executada 0.1.19; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 80,0% | 100,0% | 80,0% | 100,0% | 100,0% | 100,0% | 90,0% | 100,0% | 100,0% | 94,4% |
| CD | 70,0% | 50,0% | 100,0% | 90,0% | 80,0% | 80,0% | 100,0% | 70,0% | 90,0% | 81,1% |
| OA | 50,0% | 100,0% | 70,0% | 100,0% | 90,0% | 100,0% | 90,0% | 100,0% | 80,0% | 86,7% |
| OD | 80,0% | 40,0% | 80,0% | 80,0% | 80,0% | 80,0% | 90,0% | 60,0% | 70,0% | 73,3% |
| EA | 100,0% | 100,0% | 100,0% | 100,0% | 80,0% | 80,0% | 100,0% | 80,0% | 100,0% | 93,3% |
| ED | 100,0% | 100,0% | 90,0% | 100,0% | 60,0% | 70,0% | 80,0% | 70,0% | 100,0% | 85,6% |
| AP | 80,0% | 100,0% | 80,0% | 100,0% | 60,0% | 100,0% | 100,0% | 100,0% | 60,0% | 86,7% |
| FX | 80,0% | 100,0% | 100,0% | 100,0% | 80,0% | 100,0% | 100,0% | 90,0% | 80,0% | 92,2% |
| VE | 80,0% | 100,0% | 100,0% | 100,0% | 80,0% | 100,0% | 100,0% | 100,0% | 90,0% | 94,4% |

- **CA**: Caçador agressivo.
- **CD**: Caçador defensivo.
- **OA**: Oportunista agressivo.
- **OD**: Oportunista defensivo.
- **EA**: Estado-maior agressivo.
- **ED**: Estado-maior defensivo.
- **AP**: Aprendiz simples · memória inicial vazia.
- **FX**: Aprendiz fixo · modelo próprio de cada lado.
- **VE**: Veterana · tabela distribuída + aprendizado na partida.

## Resultados e duração

709 vitórias FEB (87,5%), 101 alemãs. Média 5,71 rodadas e 1,20 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 85/90 | 18/90 |
| CD | 73/90 | 11/90 |
| OA | 78/90 | 10/90 |
| OD | 66/90 | 3/90 |
| EA | 84/90 | 19/90 |
| ED | 77/90 | 9/90 |
| AP | 78/90 | 5/90 |
| FX | 83/90 | 13/90 |
| VE | 85/90 | 13/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 6,70/15; DE 14,49/15. PV e peças não são contagens de mortos.

Motivos: elimination: 705; noManeuverInfantry: 70; deadline: 24; mission: 11.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | OA, OD | — |
| BR | EA | CD, OD, ED | — |
| BR | FX | OD | — |
| BR | VE | CD, OD, AP, FX | — |
| DE | CA | OD | — |
| DE | CD | OD | — |
| DE | EA | OD, ED | — |
| DE | ED | OD | — |
| DE | FX | OD, ED | — |
| DE | VE | OD | — |

Melhor média atacante: CA, 85/90. Melhor média defensora: EA, 19/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 200001–200010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
