# Matriz de IAs — matriz-ias

Versão executada 0.9.0; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 100,0% | 20,0% | 100,0% | 50,0% | 0,0% | 90,0% | 80,0% | 40,0% | 50,0% | 58,9% |
| CD | 60,0% | 10,0% | 50,0% | 10,0% | 0,0% | 10,0% | 20,0% | 0,0% | 10,0% | 18,9% |
| OA | 80,0% | 50,0% | 90,0% | 30,0% | 0,0% | 70,0% | 50,0% | 30,0% | 40,0% | 48,9% |
| OD | 40,0% | 0,0% | 0,0% | 0,0% | 0,0% | 10,0% | 10,0% | 10,0% | 0,0% | 7,8% |
| EA | 60,0% | 60,0% | 60,0% | 70,0% | 50,0% | 80,0% | 70,0% | 60,0% | 50,0% | 62,2% |
| ED | 50,0% | 60,0% | 50,0% | 70,0% | 50,0% | 90,0% | 70,0% | 60,0% | 40,0% | 60,0% |
| AP | 80,0% | 20,0% | 80,0% | 30,0% | 30,0% | 60,0% | 30,0% | 40,0% | 20,0% | 43,3% |
| FX | 50,0% | 60,0% | 50,0% | 60,0% | 50,0% | 80,0% | 70,0% | 50,0% | 40,0% | 56,7% |
| VE | 90,0% | 10,0% | 80,0% | 40,0% | 60,0% | 70,0% | 50,0% | 30,0% | 30,0% | 51,1% |

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

367 vitórias FEB (45,3%), 443 alemãs. Média 7,76 rodadas e 1,23 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 53/90 | 29/90 |
| CD | 17/90 | 61/90 |
| OA | 44/90 | 34/90 |
| OD | 7/90 | 54/90 |
| EA | 56/90 | 66/90 |
| ED | 54/90 | 34/90 |
| AP | 39/90 | 45/90 |
| FX | 51/90 | 58/90 |
| VE | 46/90 | 62/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 10,60/15; DE 11,77/15. PV e peças não são contagens de mortos.

Motivos: elimination: 435; noManeuverInfantry: 170; deadline: 142; lateSummit: 19; mission: 44.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | CD, OD | — |
| BR | OA | CD, OD | — |
| BR | EA | CD, OD, FX | OD |
| BR | ED | OD, FX | OD |
| BR | AP | CD, OD | CD, OD |
| BR | FX | OD | OD |
| BR | VE | CD, OD | OD |
| DE | CD | ED, AP | — |
| DE | OD | ED, AP | — |
| DE | EA | CA, OA, ED | ED |
| DE | FX | ED | — |
| DE | VE | CA, OA, ED, AP | CA, AP |

Melhor média atacante: EA, 56/90. Melhor média defensora: EA, 66/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 200001–200010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
