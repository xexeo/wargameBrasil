# Matriz de IAs — matriz-ias

Versão executada 0.1.13; 640 partidas, 10 por dupla ordenada. Regras: retirada desligada; cume suficiente no prazo desligado. [Dados brutos, sementes e hashes](dados-brutos.json).

Linhas FEB; colunas Alemanha; células mostram vitórias FEB. Para Alemanha, subtrair de100%.

| FEB ↓ / DE → | CA | CD | OA | OD | EA | ED | AP | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 40,0% | 80,0% | 60,0% | 80,0% | 30,0% | 100,0% | 50,0% | 100,0% | 67,5% |
| CD | 90,0% | 100,0% | 100,0% | 100,0% | 80,0% | 100,0% | 90,0% | 100,0% | 95,0% |
| OA | 30,0% | 100,0% | 40,0% | 100,0% | 40,0% | 100,0% | 70,0% | 90,0% | 71,3% |
| OD | 0,0% | 80,0% | 70,0% | 80,0% | 20,0% | 50,0% | 60,0% | 80,0% | 55,0% |
| EA | 40,0% | 90,0% | 50,0% | 100,0% | 70,0% | 100,0% | 80,0% | 100,0% | 78,8% |
| ED | 100,0% | 90,0% | 100,0% | 100,0% | 100,0% | 100,0% | 100,0% | 90,0% | 97,5% |
| AP | 50,0% | 100,0% | 50,0% | 100,0% | 40,0% | 90,0% | 70,0% | 90,0% | 73,8% |
| VE | 90,0% | 100,0% | 100,0% | 100,0% | 80,0% | 100,0% | 90,0% | 100,0% | 95,0% |

- **CA**: Caçador agressivo.
- **CD**: Caçador defensivo.
- **OA**: Oportunista agressivo.
- **OD**: Oportunista defensivo.
- **EA**: Estado-maior agressivo.
- **ED**: Estado-maior defensivo.
- **AP**: Aprendiz simples · memória inicial vazia.
- **VE**: Veterana · tabela distribuída + aprendizado na partida.

## Resultados e duração

507 vitórias FEB (79,2%), 133 alemãs. Média 7,54 rodadas e 7,74 pontos FEB. Minutos de jogo humano não foram medidos.

| Perfil | Vitórias FEB | Vitórias alemãs |
| --- | ---: | ---: |
| CA | 54/80 | 36/80 |
| CD | 76/80 | 6/80 |
| OA | 57/80 | 23/80 |
| OD | 44/80 | 4/80 |
| EA | 63/80 | 34/80 |
| ED | 78/80 | 6/80 |
| AP | 59/80 | 19/80 |
| VE | 76/80 | 5/80 |

Derrotas FEB com toda a defesa fora de combate: **60** (9,4% do total). Derrotas FEB com infantaria no cume: **53**. Perdas médias de coesão: FEB 7,60/15; DE 14,50/15. PV e peças não são contagens de mortos.

Motivos: deadline: 60; noManeuverInfantry: 73; mission: 507.

## Dominância observada

Uma política domina outra nesta matriz se não vence menos contra nenhum adversário e vence mais contra pelo menos um. Isso é uma comparação empírica, sem prova de dominância estatística.

| Lado | Perfil | Domina na amostra | Supera em todos os confrontos |
| --- | --- | --- | --- |
| BR | CD | CA, OA, OD, EA, AP | OD |
| BR | ED | OD | OD |
| BR | VE | CA, OA, OD, EA, AP | OD |
| DE | CA | OA, OD, ED, AP | — |
| DE | CD | OD | — |
| DE | OA | OD | — |
| DE | EA | OD, ED, AP | — |
| DE | AP | OD | — |

Melhor média atacante: ED, 78/80. Melhor média defensora: CA, 36/80. As médias usam mistura uniforme dos oponentes, não um jogador humano específico. O nome de uma IA não determina sua dificuldade.

## Método e limites

Independent per side, reset before each match. AP starts empty, VE starts from distributed pretrained table, epsilon 0.08. Both update within match. No training is carried across cells or matches; browser user memory unavailable.

Dados: Separate deterministic stream per controller and side; combat RNG shared stream per match. Sementes 200001–200010, comuns entre células; agregados são descritivos, sem pressupor independência entre todas as partidas. Cada intervalo de Wilson de95% está nos dados. Com10 por célula, 0/10 corresponde aproximadamente a0–27,8%; 5/10 a23,7–76,3%; 10/10 a72,2–100%. Não há correção confirmatória por comparações múltiplas.

O runner verifica vencedor, pontos e rodada contra o simulador canônico em18 partidas fixas antes da matriz. AP começa sem memória pessoal; VE começa com a tabela distribuída e ambos aprendem dentro da partida com cópias independentes. A postura externa não se aplica a AP/VE, que escolhem políticas. Não foram avaliadas as partidas particulares do usuário.

A IA pode planejar melhor a ocupação e ainda ter dificuldade contra outra política; a vitória exige avaliar objetivo, prazo e conservação de infantaria em conjunto. Regras experimentais não são relatos de acontecimentos históricos. Comparar candidatos no relatório de revisão, sem alterar mapa ou identidades para obter50%.

## Avaliação desta revisão

O painel de640 partidas terminou em507 vitórias FEB e133 alemãs (79,2%/20,8%), com7,54 rodadas em média. ED foi o melhor atacante (78/80); CA o melhor defensor (36/80). Não houve dominância global: ED atacante perdeu uma partida contra VE defensora, enquanto CD e VE atacantes venceram esse mesmo confronto em10/10; CA defensor não superou todos os outros em todas as linhas. As diferenças de uma ou duas partidas não estabelecem superioridade estatística.

A mistura uniforme de perfis favoreceu a FEB, e a validação EA×EA de500 partidas deu81,4% FEB. A revisão **ainda não está equilibrada em50%**. As políticas defensivas tendem a sofrer com apoio e concentração do ataque; o nome Estado-maior não garante o adversário mais difícil.

Houve60 derrotas FEB com todos os alemães fora de combate, contra104 no painel anterior com as mesmas sementes: melhora descritiva do conjunto, ainda um problema relevante. Mudaram a heurística e o treino da Veterana, portanto a comparação não isola uma única causa. Os resultados anteriores ficam no Git; não são dados válidos para o motor atual.

A avaliação independente da Veterana usa outro protocolo (tabela compartilhada dentro da partida, exploração zero) e resultou em294/300 FEB; não misturar com a matriz de tabelas independentes e exploração de8%. Isso também mostra que o treino misto não garante equilíbrio nem boa defesa universal.
