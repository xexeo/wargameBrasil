# Matriz de IAs — matriz-ias-companhias

Versão executada 0.9.2; 810 partidas, 10 por dupla ordenada. Regras: retirada ligada; cume suficiente no prazo ligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | FX | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 70,0% | 0,0% | 10,0% | 0,0% | 40,0% | 20,0% | 10,0% | 10,0% | 20,0% | 20,0% |
| CD | 80,0% | 0,0% | 0,0% | 0,0% | 0,0% | 0,0% | 0,0% | 10,0% | 0,0% | 10,0% |
| OA | 10,0% | 10,0% | 20,0% | 0,0% | 40,0% | 0,0% | 40,0% | 40,0% | 40,0% | 22,2% |
| OD | 70,0% | 0,0% | 0,0% | 0,0% | 10,0% | 0,0% | 10,0% | 10,0% | 0,0% | 11,1% |
| EA | 30,0% | 90,0% | 90,0% | 100,0% | 80,0% | 60,0% | 80,0% | 100,0% | 60,0% | 76,7% |
| ED | 40,0% | 100,0% | 90,0% | 100,0% | 70,0% | 70,0% | 80,0% | 90,0% | 60,0% | 77,8% |
| AP | 50,0% | 20,0% | 20,0% | 30,0% | 40,0% | 30,0% | 30,0% | 60,0% | 30,0% | 34,4% |
| FX | 40,0% | 80,0% | 90,0% | 80,0% | 60,0% | 40,0% | 80,0% | 40,0% | 60,0% | 63,3% |
| VE | 40,0% | 70,0% | 90,0% | 100,0% | 60,0% | 40,0% | 80,0% | 80,0% | 60,0% | 68,9% |

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

346 vitórias FEB (42,7%), 464 alemãs. Média 8,91 rodadas e 1,37 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 18/90 | 47/90 |
| CD | 9/90 | 53/90 |
| OA | 20/90 | 49/90 |
| OD | 10/90 | 49/90 |
| EA | 69/90 | 50/90 |
| ED | 70/90 | 64/90 |
| AP | 31/90 | 49/90 |
| FX | 57/90 | 46/90 |
| VE | 62/90 | 57/90 |

Derrotas FEB com toda a defesa fora de combate: **0** (0,0% do total). Derrotas FEB com infantaria no cume: **0**. Perdas médias de coesão: FEB 18,77/33; DE 12,56/15. PV e peças não são contagens de mortos.

Motivos: deadline: 453; elimination: 328; lateSummit: 14; mission: 15.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CA | OD | — |
| BR | EA | OA | OA |
| BR | ED | OA, FX, VE | OA |
| BR | FX | OA | — |
| BR | VE | OA | OA |
| DE | ED | EA | — |
| DE | VE | EA | — |

Melhor média atacante: ED, 70/90. Melhor média defensora: ED, 64/90. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. FX uses independently trained side-specific frozen models with zero exploration and no updates. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 3600001–3600010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE/FX, que escolhem políticas. FX usa a tabela fixa correspondente ao lado, sem exploração nem atualização. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.
