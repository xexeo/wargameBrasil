# Comparação de regras — batalhões

250 sementes por configuração, mesma IA tática/agressiva nos dois lados. As1000 partidas não são avaliações humanas; candidatas não são história documentada.

| Retirada | Cume suficiente no prazo | FEB/250 | Rodadas | Derrotas sem defensores | Derrotas no cume |
| --- | --- | ---: | ---: | ---: | ---: |
| não | não | 202 | 7.02 | 5 | 4 |
| não | sim | 206 | 7.02 | 1 | 0 |
| sim | não | 179 | 7.32 | 20 | 21 |
| sim | sim | 200 | 7.32 | 0 | 0 |

A seleção deve considerar efeitos sobre manobra, conservação de tropas e objetivo, além da taxa de vitórias. Os padrões publicados permanecem os registrados em scenario.ts. [Dados individuais](dados-brutos.json) · [Resumo](resultados.json).

## Decisão desta revisão

Manter os dois candidatos desligados no padrão. A retirada reduziu a frequência de vitórias FEB nesta política, mas aumentou derrotas com defesa eliminada de5 para20 e derrotas com cume ocupado de4 para21; aproximar uma taxa de50% não compensou esses efeitos. Aceitar o cume no fechamento final remove a derrota tardia, mas favorece ainda mais o atacante nesta configuração. Nenhum candidato altera o DEM ou confirma uma ordem histórica de retirada.

A validação separada, sementes10001–10500, deu407/500 FEB (81,4%), intervalo de95%77,8–84,6%. **A meta de aproximadamente50% com a mesma IA não foi atingida nesta revisão.** A prioridade seguinte é melhorar a defesa e testar como ela reage à pressão de apoio, sem inventar efetivos ou retocar o relevo. A fase atual corrige planejamento, clareza e diagnóstico do resultado; não deve ser apresentada como cenário plenamente equilibrado.

Os experimentos são simétricos. Retirada não cura, não evita golpe fatal e falha se a saída estiver bloqueada; reorganização consome a próxima ativação. Cume suficiente só pode encerrar ao fechamento do prazo e não gera vitória antecipada por eliminação.
