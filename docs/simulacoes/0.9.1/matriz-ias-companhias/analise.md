# Matriz de IAs — matriz-ias-companhias

Versão executada 0.9.1; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 70,0% | 50,0% | 50,0% | 50,0% | 10,0% | 0,0% | 60,0% | 50,0% | 40,0% | 42,2% |
| CD | 100,0% | 60,0% | 0,0% | 30,0% | 10,0% | 10,0% | 0,0% | 30,0% | 20,0% | 28,9% |
| OA | 50,0% | 10,0% | 30,0% | 0,0% | 10,0% | 0,0% | 20,0% | 10,0% | 40,0% | 18,9% |
| OD | 30,0% | 10,0% | 0,0% | 10,0% | 10,0% | 0,0% | 20,0% | 0,0% | 20,0% | 11,1% |
| EA | 60,0% | 90,0% | 100,0% | 90,0% | 50,0% | 80,0% | 90,0% | 60,0% | 90,0% | 78,9% |
| ED | 90,0% | 80,0% | 100,0% | 70,0% | 50,0% | 80,0% | 90,0% | 70,0% | 80,0% | 78,9% |
| AP | 60,0% | 30,0% | 30,0% | 30,0% | 0,0% | 20,0% | 40,0% | 40,0% | 40,0% | 32,2% |
| FX | 80,0% | 70,0% | 70,0% | 80,0% | 10,0% | 0,0% | 50,0% | 20,0% | 60,0% | 48,9% |
| VE | 60,0% | 70,0% | 70,0% | 60,0% | 30,0% | 80,0% | 70,0% | 50,0% | 70,0% | 62,2% |

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

362 vitórias FEB (44,7%), 448 alemãs. Média 9,09 rodadas e 1,24 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 38/90 | 30/90 |
| CD | 26/90 | 43/90 |
| OA | 17/90 | 45/90 |
| OD | 10/90 | 48/90 |
| EA | 71/90 | 72/90 |
| ED | 71/90 | 63/90 |
| AP | 29/90 | 46/90 |
| FX | 44/90 | 57/90 |
| VE | 56/90 | 44/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 16,48/33; DE 12,94/15. PV e peças não são contagens de mortos.

Motivos: elimination: 338; deadline: 441; lateSummit: 14; mission: 17.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | OA, OD | — |
| BR | EA | OA, OD, AP, VE | OA, OD |
| BR | ED | CA, OA, OD, AP, VE | CA, OA, OD, AP |
| BR | FX | OA, OD | — |
| BR | VE | OA, OD, AP | OA, OD |
| DE | EA | CA, CD, VE | CA, VE |
| DE | FX | CA | — |

Melhor média atacante: EA, 71/90. Melhor média defensora: EA, 72/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 3600001–3600010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
