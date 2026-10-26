# Matriz de IAs — matriz-ias

Versão executada 0.9.1; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 90,0% | 50,0% | 90,0% | 70,0% | 10,0% | 70,0% | 50,0% | 80,0% | 70,0% | 64,4% |
| CD | 60,0% | 30,0% | 50,0% | 10,0% | 0,0% | 30,0% | 40,0% | 10,0% | 30,0% | 28,9% |
| OA | 40,0% | 40,0% | 50,0% | 40,0% | 10,0% | 60,0% | 50,0% | 80,0% | 50,0% | 46,7% |
| OD | 50,0% | 0,0% | 10,0% | 0,0% | 0,0% | 0,0% | 30,0% | 10,0% | 0,0% | 11,1% |
| EA | 60,0% | 40,0% | 50,0% | 80,0% | 40,0% | 90,0% | 60,0% | 50,0% | 50,0% | 57,8% |
| ED | 50,0% | 40,0% | 70,0% | 80,0% | 60,0% | 90,0% | 60,0% | 50,0% | 60,0% | 62,2% |
| AP | 80,0% | 40,0% | 80,0% | 50,0% | 10,0% | 40,0% | 50,0% | 60,0% | 60,0% | 52,2% |
| FX | 20,0% | 40,0% | 60,0% | 40,0% | 20,0% | 70,0% | 20,0% | 60,0% | 50,0% | 42,2% |
| VE | 80,0% | 30,0% | 90,0% | 30,0% | 80,0% | 50,0% | 70,0% | 70,0% | 50,0% | 61,1% |

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

384 vitórias FEB (47,4%), 426 alemãs. Média 7,93 rodadas e 1,37 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 58/90 | 37/90 |
| CD | 26/90 | 59/90 |
| OA | 42/90 | 35/90 |
| OD | 10/90 | 50/90 |
| EA | 52/90 | 67/90 |
| ED | 56/90 | 40/90 |
| AP | 47/90 | 47/90 |
| FX | 38/90 | 43/90 |
| VE | 55/90 | 48/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 10,29/15; DE 12,29/15. PV e peças não são contagens de mortos.

Motivos: elimination: 406; noManeuverInfantry: 163; deadline: 165; lateSummit: 24; mission: 52.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | CD, OA, OD, AP | CD, OD |
| BR | CD | OD | — |
| BR | EA | CD, OD | OD |
| BR | ED | OD | — |
| BR | AP | CD, OD | CD, OD |
| BR | VE | CD, OD | OD |
| DE | CD | OA, ED, VE | OA |
| DE | EA | OA | OA |
| DE | VE | OA | — |

Melhor média atacante: CA, 58/90. Melhor média defensora: EA, 67/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 3600001–3600010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
