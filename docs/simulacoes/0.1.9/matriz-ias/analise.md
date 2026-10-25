# Matriz de vitórias e avaliação das IAs

Cenário da versão **0.1.9**, commit [92078fc](https://github.com/xexeo/wargameBrasil/commit/92078fc4d5b88124781c6c0aa4e3df75e55f3780). 640 partidas: 10 por dupla ordenada, 8 perfis em cada lado. Não foram alteradas regras, tropas, mapa ou tabela distribuída para produzir este relatório.

## Como ler

**Linhas = FEB; colunas = alemães; célula = percentual de vitórias da FEB.** A chance observada alemã é 100% menos a célula. Cada vitória vale 10 pontos percentuais.

| FEB ↓ / Alemanha → | CA | CD | OA | OD | EA | ED | AP | VE | Média FEB |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **CA** | 40% | 80% | 60% | 80% | 100% | 100% | 80% | 80% | 77,5% |
| **CD** | 40% | 90% | 50% | 100% | 70% | 100% | 100% | 70% | 77,5% |
| **OA** | 30% | 100% | 20% | 100% | 100% | 90% | 80% | 80% | 75,0% |
| **OD** | 10% | 30% | 30% | 30% | 70% | 80% | 40% | 40% | 41,3% |
| **EA** | 10% | 90% | 20% | 90% | 60% | 80% | 60% | 100% | 63,8% |
| **ED** | 20% | 50% | 20% | 90% | 0% | 0% | 50% | 30% | 32,5% |
| **AP** | 40% | 100% | 50% | 100% | 80% | 90% | 80% | 90% | 78,8% |
| **VE** | 90% | 100% | 100% | 100% | 100% | 100% | 100% | 80% | 96,3% |
| **Média FEB por defensor** | 35,0% | 80,0% | 43,8% | 86,3% | 72,5% | 80,0% | 73,8% | 71,3% | 67,8% |

- **CA**: Caçador agressivo.
- **CD**: Caçador defensivo.
- **OA**: Oportunista agressivo.
- **OD**: Oportunista defensivo.
- **EA**: Estado-maior agressivo.
- **ED**: Estado-maior defensivo.
- **AP**: Aprendiz simples · memória inicial vazia.
- **VE**: Veterana · tabela distribuída + aprendizado na partida.

As médias dão peso igual a cada um dos oito oponentes; não representam a chance contra um jogador humano específico. A chance da diagonal não mede a força absoluta: uma IA pode ser boa atacante e má defensora.

## Ranking por lado

| Perfil | FEB: vitórias/80 | Taxa FEB | Alemanha: vitórias/80 | Taxa alemã | Pior confronto FEB | Pior confronto alemão |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| CA | 62 | 77,5% | 52 | 65,0% | 4/10 | 1/10 |
| CD | 62 | 77,5% | 16 | 20,0% | 4/10 | 0/10 |
| OA | 60 | 75,0% | 45 | 56,3% | 2/10 | 0/10 |
| OD | 33 | 41,3% | 11 | 13,8% | 1/10 | 0/10 |
| EA | 51 | 63,8% | 22 | 27,5% | 1/10 | 0/10 |
| ED | 26 | 32,5% | 16 | 20,0% | 0/10 | 0/10 |
| AP | 63 | 78,8% | 21 | 26,3% | 4/10 | 0/10 |
| VE | 77 | 96,3% | 23 | 28,8% | 8/10 | 0/10 |

## Duração e perdas

| Perfil | Rodadas médias como FEB | Coesão FEB perdida /15 | Rodadas médias como Alemanha | Coesão alemã perdida /15 |
| --- | ---: | ---: | ---: | ---: |
| CA | 7,93 | 7,28 | 7,10 | 13,20 |
| CD | 7,47 | 6,28 | 7,64 | 14,75 |
| OA | 8,01 | 8,19 | 7,84 | 13,78 |
| OD | 8,47 | 7,32 | 7,79 | 14,97 |
| EA | 5,95 | 9,05 | 7,43 | 13,80 |
| ED | 7,29 | 9,95 | 7,61 | 14,49 |
| AP | 7,79 | 7,39 | 7,00 | 14,13 |
| VE | 7,48 | 6,09 | 7,99 | 14,79 |

Resumo das 640 partidas:

- **434 vitórias FEB (67,8%)**, todas por missão: pontos e cume. **206 vitórias alemãs (32,2%)**. Isso é a média desta mistura de perfis, não um equilíbrio universal do cenário.
- **109 derrotas FEB por prazo (17,0% do total)**; **97 por perda de toda a infantaria de manobra (15,2%)**.
- **104 derrotas por prazo após eliminar as cinco peças alemãs**: 16,3% de todas as partidas e 50,5% das vitórias alemãs. Restavam brasileiros, mas faltavam pontos e/ou cume.
- Média **7,55 rodadas**, 7,54 pontos FEB.
- Perdas médias FEB: **1,65 peças / 7,69 de coesão**; Alemanha: **4,66 peças / 14,24 de coesão**. Perdas não são contagens de mortos reais.
- Vitórias FEB: **161 decisivas, 236 táticas e 37 custosas**; nenhuma pírrica. O grau usa tempo e perdas das regras atuais.

## Dominância observada

Uma estratégia domina outra neste quadro se nunca ganha menos contra nenhum dos oito oponentes e ganha mais contra pelo menos um. É dominância **empírica nesta amostra**, não uma prova sobre todas as partidas. Dominância estrita exige ganhar mais em todos os oito confrontos.

### Ataque brasileiro

| Perfil | Domina na matriz (inclui empates) | Domina estritamente |
| --- | --- | --- |
| CA | OD | OD |
| CD | OD, ED | ED |
| OA | ED | — |
| AP | OD, ED | OD, ED |
| VE | CA, CD, OA, OD, ED | OD, ED |

### Defesa alemã

| Perfil | Domina na matriz (inclui empates) | Domina estritamente |
| --- | --- | --- |
| CA | CD, OD, AP | CD, OD, AP |
| CD | OD | — |
| OA | CD, OD, AP | — |

**Não há perfil globalmente dominante em nenhum lado**, mesmo nesta matriz. VE tem a maior média no ataque, mas vence VE defensora em 8/10, enquanto EA vence essa mesma defensora em 10/10 e AP em 9/10. CA é o melhor defensor na média, mas contra ED atacante permite 2 vitórias FEB; EA e ED defensoras permitem zero.

## Avaliação de jogabilidade

1. **O equilíbrio depende muito das políticas.** O resultado anterior de 51,1% FEB com EA contra EA não autorizava concluir equilíbrio geral. Aqui EA × EA deu 6/10; CA × CA deu 4/10; OA × OA, 2/10; ED × ED, 0/10; VE × VE, 8/10.
2. **Defensivo não equivale a mais seguro para quem sobe.** ED atacante teve só 26/80; CA e CD tiveram 62/80. ED usa os mesmos bônus de proteção e ocupação como heurística, embora a FEB tenha prazo para avançar. A permanência em cobertura/objetivos secundários pode contrariar a missão. Isso é uma hipótese apoiada pelo código e pelos resultados, não uma causa isolada experimentalmente.
3. **Caçador agressivo é um defensor perigoso.** Contra EA atacante venceu 9/10; nove derrotas FEB vieram por perda de infantaria, em confrontos de 4,4 rodadas em média. A política de buscar maior ataque e aproximar ameaça os recursos de apoio e a capacidade de manobra. O nome Estado-maior não significa que seja a IA mais forte.
4. **VE aprendeu melhor a atacar que a defender nesta avaliação.** Foi 77/80 pela FEB e 23/80 pela Alemanha. A tabela usa estados distintos por lado, mas o treino e a recompensa não garantem boa defesa contra qualquer oponente. Não há evidência para chamá-la de melhor defensora.
5. **O prazo pode gerar finais frustrantes.** Os 104 casos de defesa vencedora sem nenhuma peça restante revelam que ganhar a batalha material e cumprir a missão se separaram bastante. A regra funciona como programada, mas esse resultado merece revisão de desenho e comparação histórica. Melhorar indicação de prazo/rota ao cume e planejamento da IA vem antes de alterar fatos ou atribuir qualidade fictícia a tropas.
6. **A artilharia e o apoio são relevantes, mas não foi demonstrada uma estratégia dominante de bombardeio.** Todos os perfis usam a mesma ordem automática de apoio antes de infantaria. Sem comparar outra ordem, não se pode atribuir as diferenças somente ao apoio. A enorme perda material alemã mostra atrito excessivo; uma vitória histórica por ocupação/recuo não exige aniquilação.

Prioridades recomendadas, sem mudar regras nesta rodada: melhorar planejamento do prazo e preservação de infantaria; treinar a defensora contra adversários variados; comparar políticas sobre ocupação e retirada, em vez de recompensar só dano; validar esses candidatos depois em amostra maior. Não reduzir a dificuldade só por duas derrotas, mas tornar os modos de dificuldade honestos: CA agressivo pode ser mais difícil que VE ou Estado-maior.

Para jogar como FEB: apoiar antes da subida; preservar pelo menos um batalhão de manobra; não desviar todos para eliminar os últimos inimigos; ocupar e sustentar o cume com antecedência. São recomendações pelas regras atuais, não políticas novas testadas neste torneio.

## Incerteza e reprodução

**10 partidas por célula é uma sondagem.** Intervalos de Wilson de 95%: 0/10 ≈ 0–27,8%; 5/10 ≈ 23,7–76,3%; 10/10 ≈ 72,2–100%. Assim, 100% observado não significa vitória garantida. Há 64 células e muitos contrastes; não foi feito teste confirmatório com correção por comparações múltiplas. Nenhuma dominância foi estabelecida estatisticamente.

Sementes 200001–200010, iguais entre células. Os confrontos compartilham condições aleatórias iniciais; as médias agregadas são descritivas, sem tratá-las como 640 ensaios independentes. Há um fluxo determinístico para dados e outro por controlador para decisões aleatórias. Resultados não reproduzem as duas partidas pessoais do autor, cujos estados não foram fornecidos.

AP começa com memória vazia em cada partida. VE começa com a tabela distribuída de 2.000 partidas, exploração de 8%, e continua aprendendo dentro da partida. Memórias são independentes por lado e não transitam entre confrontos. Não foi acessado o localStorage do usuário. Esta matriz não mede evolução acumulada entre sessões. As IAs de aprendizado ignoram a postura externa porque escolhem suas próprias políticas; duplicá-las em agressiva/defensiva seria redundante. A Aprendiz foi espelhada para comandar a FEB, com recompensa de coesão e pontos invertida; no navegador ela só comanda alemães.

O script verifica 18 partidas fixas contra o simulador canônico, comparando vencedor, pontos e rodada. Essas verificações não entram nas 640 partidas da matriz.

```sh
npm run build
node scripts/round-robin.mjs 10 200001
node scripts/report-round-robin.mjs
```

[Dados completos, sementes, hashes dos fontes e resultados individuais](dados-brutos.json). O torneio usa as regras da versão 0.1.9; o commit de publicação do relatório pode ter um número de versão posterior, sem mudar essas regras.
