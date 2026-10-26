# Matriz de IAs — matriz-ias

Versão executada 0.9.2; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 90,0% | 30,0% | 80,0% | 50,0% | 90,0% | 60,0% | 80,0% | 20,0% | 20,0% | 57,8% |
| CD | 10,0% | 0,0% | 10,0% | 0,0% | 0,0% | 0,0% | 10,0% | 10,0% | 10,0% | 5,6% |
| OA | 70,0% | 20,0% | 80,0% | 70,0% | 100,0% | 80,0% | 70,0% | 10,0% | 10,0% | 56,7% |
| OD | 0,0% | 0,0% | 0,0% | 0,0% | 0,0% | 0,0% | 0,0% | 10,0% | 20,0% | 3,3% |
| EA | 30,0% | 100,0% | 40,0% | 100,0% | 90,0% | 80,0% | 60,0% | 50,0% | 60,0% | 67,8% |
| ED | 30,0% | 100,0% | 40,0% | 100,0% | 100,0% | 100,0% | 60,0% | 50,0% | 70,0% | 72,2% |
| AP | 40,0% | 40,0% | 60,0% | 50,0% | 70,0% | 60,0% | 60,0% | 40,0% | 30,0% | 50,0% |
| FX | 30,0% | 90,0% | 40,0% | 80,0% | 90,0% | 70,0% | 60,0% | 30,0% | 50,0% | 60,0% |
| VE | 30,0% | 80,0% | 40,0% | 80,0% | 100,0% | 50,0% | 70,0% | 40,0% | 50,0% | 60,0% |

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

390 vitórias FEB (48,1%), 420 alemãs. Média 6,48 rodadas e 0,87 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 52/90 | 57/90 |
| CD | 5/90 | 44/90 |
| OA | 51/90 | 51/90 |
| OD | 3/90 | 37/90 |
| EA | 61/90 | 26/90 |
| ED | 65/90 | 40/90 |
| AP | 45/90 | 43/90 |
| FX | 54/90 | 64/90 |
| VE | 54/90 | 58/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 11,08/15; DE 11,68/15. PV e peças não são contagens de mortos.

Motivos: elimination: 660; noManeuverInfantry: 110; lateSummit: 5; deadline: 21; mission: 14.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | CD, OD | CD |
| BR | OA | CD | — |
| BR | EA | CD, OD, FX | CD, OD |
| BR | ED | CD, OD, EA, FX | CD, OD |
| BR | AP | CD, OD | CD, OD |
| BR | FX | CD, OD | CD, OD |
| BR | VE | CD, OD | CD, OD |
| DE | ED | EA | — |

Melhor média atacante: ED, 65/90. Melhor média defensora: FX, 64/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 3600001–3600010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
