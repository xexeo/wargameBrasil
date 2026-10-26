# Diagnóstico para a 1.0 — primeira passagem

Execução 0.9.4, regras da 0.9.3. [Plano e estados](../../../PLANO_1_0.md). [440 partidas, protocolo e dados](analise.md).

## O que foi medido

Duas escalas, seis políticas idênticas dos dois lados com 20 sementes cada, mais 100 confrontos dos modelos fixos próprios de cada lado por escala. Total de 220 jogos por escala. Sementes 7200001–7200100; estas são de diagnóstico e não serão usadas para selecionar o modelo da avaliação final.

O observador real registra tiros, inclusive durante movimento, contra-ataques, dano efetivo e alvo. A rodada, vencedor, pontuação e contagens das primeiras partidas de cada política fixa foram comparadas ao simulador canônico. Não se mudou regra, atributo, mapa ou modelo para medir.

## Achados

No confronto dos modelos fixos, que têm cem jogos por escala:

| Indicador | Batalhão | Companhia |
| --- | ---: | ---: |
| Vitórias FEB | 69/100 | 67/100 |
| Fim por eliminação | 94/100 | 65/100 |
| Rodadas médias | 5,92 | 8,73 |
| Disparos normais por jogo, ambos os lados | 19,95 | 50,71 |
| Fogo defensivo por jogo | 3,11 | 7,94 |
| Maior concentração observada em alvo/turno | 4 | 5 |
| Tiros diretos contra alvo já suprimido | 25,4% | 24,3% |
| Bloqueios totais por ocupação no início do turno | 0/3351 | 108/9492 |

Conferir números de precisão integral em `resumo.json`; as taxas não demonstram dificuldade humana. Os modelos de cada escala são diferentes. Comparar suas vitórias não isola causalmente o efeito da escala.

1. **Volume absoluto de tiros precisa ser normalizado.** Companhia tem 19 peças contra dez e dura mais rodadas. No confronto fixo, são aproximadamente 5,81 disparos normais por rodada contra 3,37. Por peça inicial e rodada, aproximadamente 0,31 contra 0,34. O aumento absoluto, sozinho, não comprova excesso de ações individuais.
2. **Há risco maior de prolongamento em companhia.** A média se aproxima do limite de dez rodadas. Sem cronometrar pessoas, isso não determina minutos, mas reforça a prioridade de clareza e operação rápida.
3. **Eliminação também é frequente em batalhão.** O diagnóstico não justifica tratá-la como defeito exclusivo de companhia. O autor considera batalhão satisfatório; sua dinâmica será preservada. A companhia oferece espaço para testar alternativas sem extrapolar conclusões para a outra escala.
4. **Congestionamento total existe, mas é localizado.** Aproximadamente 1,14% das oportunidades elegíveis medidas em companhia começam sem destino por ocupação. Isso não mede todos os bloqueios de corredor nem invalida dificuldades específicas relatadas pelo jogador.
5. **Apoio não demonstrou benefício causal nesta passagem.** A frequência de tiros diretos contra alvos suprimidos é semelhante. O marcador inclui reorganização após retirada; não se pode afirmar que todo esse fogo foi preparado por artilharia. Na próxima instrumentação deve-se distinguir a origem e a sequência da supressão.
6. **A escolha da política altera fortemente o resultado.** Por exemplo, na companhia, Estado-maior agressivo dá 16 vitórias FEB em vinte jogos e Oportunista defensivo seis em vinte. São amostras pequenas. Misturar perfis até obter 50% não substitui a avaliação por confronto.

## Correção de interpretação pelo autor

A eliminação também depende de a IA alemã não abandonar a batalha. O recuo por perdas apenas muda a posição no mapa: não representa saída da área ou decisão operacional de retirada. Assim, a frequência de eliminação não demonstra sozinha um defeito nos valores de combate. A próxima investigação precisa incluir a possibilidade de retirada e sua relação com a pontuação. Pela regra de vitória atual, se não há mais defesa alemã e a FEB venceu, Monte Castelo está assegurado; cobrar uma peça no hexágono após esse fim era uma explicação incoerente, corrigida na apresentação.

## Próximos experimentos, na ordem

1. **Retirada e pontuação:** examinar trajetórias em que os alemães continuam combatendo após perder a posição ou a capacidade de defesa. Definir retirada operacional separada do recuo por perda de coesão e avaliar critérios de vitória territorial antes de mexer nos fatores de combate. Não considerar todo recuo histórico uma fuga nem inventar um horário obrigatório.
2. **Sequência de apoio e assalto:** identificar supressão provocada por apoio nesta ativação e medir reações evitadas, progresso no terreno e sobrevivência. Comparar IA atual a uma política companhia que priorize preparar a aproximação; manter as regras atuais inicialmente.
3. **Ocupação e conservação:** examinar trajetórias de vitórias por eliminação e derrotas por prazo. Testar escolhas de ocupar/sustentar/retirar antes de modificar vitória, pontos ou dano. A ausência de retirada da área não equivale à ausência de recuos no mapa.
4. **Funções das armas:** somente se os passos anteriores mostrarem necessidade, comparar um candidato de supressão com o padrão. Não alterar dano e duração de supressão juntos; manter unidades independentes e identificar o efeito de cada alteração.
5. **Clareza:** tornar visíveis previsão de tiro, reação e motivo de bloqueio. A percepção de injustiça não pode ser corrigida apenas por balanceamento automático.

Cada candidato exige sementes comuns e regras explícitas, regressão de batalhão e comparação de resultados e comportamento. Rejeitar um candidato é um resultado válido. Não se propõe aumentar alcances ou inventar tropas para obter determinada taxa.

## Limites da entrega

É diagnóstico da referência, não a avaliação final da 1.0. Não houve treinamento, testes humanos, mudança de regras ou declaração de equilíbrio perfeito. A validação histórica aprofundada, a interface de previsão e os experimentos acima permanecem no plano. As análises ligadas às simulações devem ser retiradas ou marcadas como históricas quando seu núcleo for invalidado; os dados originais ficam no Git.
