# Aprendizes fixos por lado

A opção de IA fixa usa dois modelos: um para a FEB e outro para a defesa alemã. Cada modelo escolhe entre as seis combinações existentes de Caçador, Oportunista e Estado-maior com postura agressiva ou defensiva. A execução das peças continua usando a IA tática do jogo, que considera o lado, a missão, apoio, terreno e ameaças. Este treino escolhe a política de cada turno; não aprende caminhos individuais nem altera regras.

Os modelos têm tabelas Q independentes. A FEB é treinada para cumprir sua missão e preservar suas peças; a defesa alemã recebe o sinal oposto para pontos e controle brasileiro. A tabela brasileira contém apenas estados `br:`; a alemã, apenas `de:`. Nenhuma experiência passa de um modelo ao outro.

A Veterana existente continua sendo uma opção separada, com seu próprio aprendizado online. A Aprendiz simples e a experiência já salva no navegador também continuam disponíveis. A IA fixa não lê nem apaga essas memórias.

## Parâmetros definidos antes do treino

| Parâmetro | Valor |
| --- | --- |
| Episódios por lado | 2.400 |
| Adversários | seis combinações fixas de estratégia/postura |
| Partidas por adversário, em cada lado | 400 |
| Alpha | 0,18 |
| Gamma | 0,9 |
| Exploração durante treino | 0,20 constante |
| Exploração durante a partida publicada | **0** |
| Sementes FEB | 900001–902400 |
| Sementes Alemanha | 910001–912400 |
| Gerador | Mulberry32 |
| Recompensa de coesão relativa | 0,6 × diferença de PV |
| Recompensa de pontuação brasileira | +0,7 × pontos para FEB; sinal contrário para Alemanha |
| Recompensa de controle brasileiro | +0,4 × renda dos objetivos para FEB; sinal contrário para Alemanha |
| Resultado final | +12 por vitória; −12 por derrota |

A atualização usa a variação da utilidade entre ativações do lado aprendiz, incluindo o turno adversário. O resultado final acrescenta o bônus acima. Esses coeficientes são parâmetros de desenho, não estimativas históricas. A exploração e os desempates do treino usam um fluxo aleatório separado dos dados de combate.

Os estados registram lado, fase da operação, vantagem de coesão, faixa de pontos, quantidade de objetivos próprios e presença própria no cume. Eles agregam situações diferentes; a tabela não prevê perfeitamente o combate.

## Inferência publicada

`chooseFixedPolicy(game, side)` retorna `{strategy, stance}`. Ela consulta somente `fixedModels[side]`, escolhe o maior valor Q e resolve empates pela primeira combinação na ordem fixa: Caçador agressivo, Caçador defensivo, Oportunista agressivo, Oportunista defensivo, Estado-maior agressivo e Estado-maior defensivo.

Em um estado nunca observado, a FEB usa Estado-maior agressivo e a Alemanha usa Estado-maior defensivo. A consulta não chama um gerador aleatório, não cria linhas, não atualiza pesos e não acessa armazenamento. O objeto completo dos modelos, seus metadados e linhas de pesos são congelados em JavaScript. O combate continua sujeito aos dados normais do jogo; congelar a escolha da política não torna os resultados das partidas iguais.

## Reprodução e avaliação

Após compilar os módulos, execute `node scripts/train-fixed.mjs`. O script gera `fixed-models.ts` e arquiva metadados, tabelas e resultados de todas as 4.800 partidas com o mecanismo de simulações por versão. Recompile para que o JavaScript distribuído incorpore as novas tabelas antes de executar `node scripts/evaluate-fixed.mjs`.

A avaliação utiliza sementes que não aparecem nos dois intervalos de treino: 100 partidas por adversário e lado, mais 100 confrontos entre os dois modelos fixos, totalizando 1.300. Não há exploração nem atualização durante a avaliação. As taxas e os intervalos de Wilson de 95% são publicados por adversário e por lado, junto de sementes, perdas, escolhas e resultados individuais.

O jogo é assimétrico: uma taxa brasileira não deve ser comparada diretamente a uma taxa alemã como medida de qualidade. O portfólio não inclui todas as estratégias humanas possíveis. Resultados de treino, com exploração, também não substituem a avaliação independente. Não se afirma que estes modelos sejam superiores à Veterana ou os mais fortes disponíveis sem uma comparação específica.

Os hashes devem incluir o motor, IA, módulos fixos, modelos gerados e os dois scripts. O treinamento aceita como mudança esperada somente a substituição do próprio arquivo de modelos; qualquer outra mudança de código durante uma execução invalida o arquivamento. Atualizações das regras ou da IA exigem novo treino e nova avaliação antes de apresentar números como atuais.

## Revalidação 0.9.0

Os modelos distribuídos são novamente treinados após a revisão da subida, abrigos, alcance dos fogos alemães e planejamento de rotas. Não reaproveitar taxas da 0.1.20. O Estado-maior alemão mantém o cume nas duas posturas e aplica as prioridades de missão também à seleção do alvo de um disparo legal. [Resultados atuais, treino e avaliação](simulacoes/README.md).
