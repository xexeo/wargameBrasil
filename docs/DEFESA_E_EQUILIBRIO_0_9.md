# Defesa, subida e equilíbrio — 0.9.0

Decisões de 26/10/2026. Conservam o mapa, dez peças, três batalhões brasileiros, identidades, cota e janela de 06h–18h. O pedido foi estudar uma defesa mais convincente sem ignorar a dificuldade humana relatada pelo autor. As medições são de políticas automáticas; não medem as partidas particulares dele.

## Evidência consultada

- **Fisher, _Cassino to the Alps_, capítulo XXIV, pp.428 e431**, [reprodução da história oficial americana](https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/USA-MTO-Cassino-24.html). A232ª DI cobria uma frente de cerca de 18 milhas, com composição heterogênea e muitos homens mais velhos/convalescentes. Reservas de fuzileiros e elementos de montanha na frente ampla não comprovam uma unidade de elite no cume. O avanço americano precipitou retirada alemã; a pequena retaguarda não equivale aos quatro destacamentos completos do jogo nem a sua eliminação física.
- **U.S. War Department, TM-E30-451, _Handbook on German Military Forces_ (1945), [capítulo IV, Tactics](https://www.ibiblio.org/hyperwar/Germany/HB/HB-4.html)**. Referência geral para posições preparadas, observação, defesa em profundidade e combinação de fogos diretos e curvos. Não é uma carta tática de Monte Castelo.
- Mesmo manual, [capítulo VII, Weapons](https://www.ibiblio.org/hyperwar/Germany/HB/HB-7.html): emprego de metralhadoras em bipé/tripé, MG34/MG42 e morteiros. Alcances técnicos podem exceder muito um hexágono. Isso não prova o modelo ou a dotação de cada posição da 232ª DI no dia 21. Alcance balístico não pode ser convertido diretamente em alcance de um contador de batalhão.
- As fontes brasileiras de narrativa e organização permanecem em [HISTORIA](HISTORIA.md), [acervos](PESQUISA_ACERVOS_NARRATIVA.md) e [TROPAS](TROPAS.md). Não se afirma leitura integral de Mascarenhas ou boletim local ainda não obtido.

## Escolhas de projeto

| Parâmetro | Antes | 0.9.0 | Motivo e limite |
| --- | ---: | ---: | --- |
| Subida por faixa N | +1 PM | **+2 PM** | Mais esforço para subir sob fogo; coeficiente de jogo, não medição de lama. Simétrico. |
| Cobertura preparada | +1 | **+2** | Posição tem valor superior à cobertura natural, sem aumentar qualidade individual. Beneficia qualquer ocupante. |
| Fogos alemães | alcance 5 | **alcance 6** | Maior disponibilidade defensiva no recorte; não localização ou alcance balístico literal de uma bateria. |
| Infantaria alemã | alcance 1 | **alcance 1** | Evita generalizar toda infantaria como metralhadora pesada, mantendo +1 por altura/visão. |
| Prazo |10 rodadas | **10 rodadas** | Preserva janela histórica abstrata. Reduzir prazo sozinho pouco interfere em eliminações. |
| Meta antecipada |8+cume | **8+cume** | Preserva objetivo legível; cume no fechamento final continua vitória custosa. |
| A/D e efetivos | abstrações existentes | **preservados** | Sem elite, SS, reforços ou batalhões locais inventados. |

Fortificações permanecem no cume e no secundário hex 4–4, esquemáticas. O bônus é o maior entre cobertura natural e preparada, somado ao desnível ≥30 m. Tiro direto de ≥90 m acima recebe +1 hex; indireto não. Não se amplia globalmente o alcance alemão por nacionalidade.

Com +2 PM, mata subindo uma faixa custa4PM: um batalhão de 3 PM precisa contornar. Peças de 2 PM não vencem diretamente um passo de subida que custe3; não se acumulam PM. Esse limite é explícito nas regras. Planejamento e previsão descartam passos acima do máximo da peça. São abstrações de mobilidade, não impedimentos históricos permanentes de soldados reais.

Estado-maior alemão guarda o cume nas duas posturas; a seleção do tiro usa a mesma prioridade por missão do planejamento. Infantaria intercepta manobra; artilharia procura contrabateria até haver ameaça próxima ao cume. Caçador e Oportunista conservam as prioridades solicitadas. Memórias pessoais não são apagadas; modelos distribuídos são treinados novamente.

## Protocolo de comparação

`scripts/study-final.mjs` fixa explicitamente os atributos e regras da base anterior, evitando que mudanças dos padrões contaminem a comparação. Seis políticas por lado, todas as36 duplas ordenadas, mesmos dados de combate entre candidatos. Primeiro foram exploradas13 variantes, incluindo subida, alcance, proteção e objetivos; as escolhas foram confirmadas em lotes de sementes separados. Lotes intermediários serviram ao desenvolvimento, não são estimativas independentes da versão final.

O lote final arquivado usa50 jogos por dupla e candidato, sementes2600001–2600050. São1.800 jogos por candidato,5.400 no total. Como as mesmas50 sementes são reutilizadas nas36 células e nos candidatos, os agregados são descritivos; não tratar5.400 resultados como observações independentes para um intervalo binomial simples. Cada jogo registra vencedor, rodada, pontuação, chegada/ocupação do cume e perdas. O protocolo é copiado junto dos dados; os hashes verificam o programa.

Treinamento, avaliação independente dos modelos e matriz9×9 são execuções separadas. A matriz solicitada usa10 partidas por dupla: útil para localizar tendências, imprecisa para afirmar uma chance exata ou dominância universal. Conferir a [pasta de simulações vigente](simulacoes/README.md).

## Interpretação de jogo e história

Neutralização imediata continua um caminho de vitória expressamente pedido. Por isso, aumentar apenas a meta de pontos não obriga todas as partidas a conquistar o cume. O resultado distingue neutralização e ocupação atual, sem afirmar que todas as pessoas morreram. Não se alegou reconstruir a retirada histórica por uma eliminação de contadores.

A artilharia pode apoiar e suprimir, mas tem baixa defesa e mobilidade. Uma defesa que abandona o cume pode perder por ocupação; um atacante que perde seus três batalhões pode perder apesar de conservar fogos. Estudar essas alternativas é mais útil que impor uma superioridade numérica fictícia. Não se afirma que qualquer política seja dominante contra estratégias humanas não avaliadas.

Os coeficientes2/2/6 são decisões revisáveis em `scenario.ts` e `troops.ts`. Partidas antigas conservam valores; flags novas ausentes mantêm subida/proteção1. Quantidade e alcance dos fogos continuam abstrações de disponibilidade. Duração medida em rodadas não é duração humana em minutos.

## Relatórios finais

[Comparação numérica dos candidatos e decisão](simulacoes/0.9.0/estudo-final-defesa/analise.md), [matriz e dominância observada](simulacoes/0.9.0/matriz-ias/analise.md), [avaliação independente dos modelos](simulacoes/0.9.0/avaliacao-ias-fixas/analise.md). Na comparação, a base usa regras antigas com a IA atual; não reproduz integralmente o executável anterior. A variante escolhida não atingiu50/50 em todas as políticas. A conclusão é de aproximação do portfólio e defesa mais fundamentada, com assimetria restante explicitamente medida.
