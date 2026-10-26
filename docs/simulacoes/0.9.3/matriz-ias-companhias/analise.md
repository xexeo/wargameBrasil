# Matriz de IAs — matriz-ias-companhias

Versão executada 0.9.3; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 50,0% | 100,0% | 30,0% | 90,0% | 20,0% | 40,0% | 80,0% | 80,0% | 0,0% | 54,4% |
| CD | 80,0% | 70,0% | 10,0% | 0,0% | 0,0% | 0,0% | 20,0% | 0,0% | 0,0% | 20,0% |
| OA | 40,0% | 20,0% | 60,0% | 50,0% | 20,0% | 50,0% | 60,0% | 10,0% | 20,0% | 36,7% |
| OD | 80,0% | 70,0% | 20,0% | 10,0% | 40,0% | 0,0% | 30,0% | 0,0% | 0,0% | 27,8% |
| EA | 90,0% | 100,0% | 90,0% | 90,0% | 80,0% | 90,0% | 100,0% | 70,0% | 70,0% | 86,7% |
| ED | 80,0% | 80,0% | 80,0% | 100,0% | 80,0% | 70,0% | 90,0% | 70,0% | 70,0% | 80,0% |
| AP | 50,0% | 80,0% | 50,0% | 60,0% | 30,0% | 60,0% | 60,0% | 50,0% | 10,0% | 50,0% |
| FX | 70,0% | 90,0% | 70,0% | 80,0% | 80,0% | 60,0% | 90,0% | 50,0% | 50,0% | 71,1% |
| VE | 90,0% | 100,0% | 90,0% | 90,0% | 60,0% | 80,0% | 100,0% | 60,0% | 50,0% | 80,0% |

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

456 vitórias FEB (56,3%), 354 alemãs. Média 8,82 rodadas e 2,66 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 49/90 | 27/90 |
| CD | 18/90 | 19/90 |
| OA | 33/90 | 40/90 |
| OD | 25/90 | 33/90 |
| EA | 78/90 | 49/90 |
| ED | 72/90 | 45/90 |
| AP | 45/90 | 27/90 |
| FX | 64/90 | 51/90 |
| VE | 72/90 | 63/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 24,98/33; DE 20,90/24. PV e peças não são contagens de mortos.

Motivos: deadline: 201; elimination: 504; lateSummit: 20; mission: 64; noManeuverInfantry: 21.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | OD | CD | — |
| BR | EA | CD, OA, OD, AP, FX, VE | CD, OA, OD, AP |
| BR | ED | CD, OA, OD, AP | OA |
| BR | FX | OA, AP | OA |
| BR | VE | CD, OA, OD, AP | CD, OA, OD, AP |
| DE | OA | AP | — |
| DE | EA | CD | — |
| DE | ED | OD, AP | — |
| DE | FX | CD, OD, AP | CD |
| DE | VE | CA, CD, OA, OD, EA, ED, AP | CA, OA, AP |

Melhor média atacante: EA, 78/90. Melhor média defensora: VE, 63/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 6100001–6100010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
