# Caminho para Monte Castelo Vibed 1.0

Plano aprovado pelo autor em 26/10/2026. Referência: [0.9.3, commit 4529364](https://github.com/xexeo/wargameBrasil/commit/45293642c438f9078c607a57869b2291223401ff).

## Compromissos

- Batalhão conserva regras, perfis, mapa e modelos de IA; apresentação compartilhada passa por regressão. Mudanças de regras são exclusivas de companhia.
- Companhias mantêm ações independentes. Não reintroduzir bloqueio das irmãs.
- Manter navegador/offline, português padrão, inglês americano opcional, duas escalas do mesmo jogo e a meta humana de 5–10 minutos.
- Não alterar fatos históricos, topografia ou identidades para obter uma taxa de vitória. Hipóteses aparecem como hipóteses.
- Cada entrega coerente recebe commit, versão 0.9.X e registro neste documento. O número 1.0 depende dos critérios finais, não de uma data arbitrária.
- Resultados automáticos não substituem testes com pessoas. Não declarar duração humana, usabilidade ou equilíbrio humano sem observação.

## Etapas e critérios de passagem

| Etapa | Trabalho | Saída verificável | Estado |
| --- | --- | --- | --- |
| 1. Referência estável | Fixar a 0.9.3 e automatizar a proteção de batalhão | 120 históricos completos, seis políticas × 20 sementes, hashes dos modelos e configuração inicial | Concluída nesta entrega |
| 2. Diagnóstico de companhia | Medir fogo, concentração, supressão, reações, ocupação, retiradas e congestionamento nas duas escalas | Relatório e dados por partida/turno, protocolo, sementes e limites | Concluída nesta entrega |
| 3. Refinamento de companhia | Distinguir recuo no mapa de retirada da batalha; reavaliar pontuação considerando abandono das posições; comparar preparação do assalto e funções de apoio | Decisões registradas, regressão de batalhão aprovada e ações independentes preservadas | Pendente; depende de 2 |
| 4. História e terreno | Auditar composição alemã, cronologia, mapa moderno, posições e condições ambientais | Quadro fato/aproximação/hipótese com fontes e consequências sobre o cenário | Pendente |
| 5. Clareza das decisões | Previsão de combate, modificadores, reação, bloqueios, objetivos e resultado | Testes PT/EN, celular/computador e compreensão observada | Pendente |
| 6. Equilíbrio e IAs | Congelar regras; um ciclo final de treino de companhia e avaliação reservada | Matriz de 10 por dupla, ao menos 100 nos confrontos principais e análise de exploração | Pendente; depende de 3–5 |
| 7. Pessoas e duração | Observar partidas nas duas escalas com iniciantes e jogadores de wargames | Tempos reais, dúvidas, erros de operação e problemas corrigidos | Pendente; requer participantes |
| 8. Candidata e lançamento | Auditar documentação, traduções, licenças, créditos, persistência, intercâmbio e offline | Checklist abaixo aprovado, candidata publicada e arquivos conferidos | Pendente |

Etapas históricas e de interface podem avançar durante avaliações demoradas, mas nenhuma medição deve misturar versões das regras. Não é necessário aceitar uma regra nova em cada etapa: manter a regra atual é uma decisão válida quando a evidência não favorece a alternativa.

## Método de diagnóstico e ajuste

1. Comparar a referência antes de modificar companhia. Contar disparos normais, fogo defensivo e contra-ataques separadamente; não chamar ativações de disparos.
2. Registrar concentração de tiros por alvo e turno, eficácia por função, supressão antes do assalto, ocupação do cume, retiradas e motivo do fim.
3. Distinguir bloqueio físico por peças de falta de PM, reorganização ou escolha da IA de ficar parada. Congestionamento medido no início do turno não representa todos os bloqueios possíveis durante ele.
4. Comparar candidatos com sementes iguais. Separar ajuste, treino e avaliação final; novas sementes reservadas não participam da escolha do candidato.
5. Buscar decisões de observar → apoiar → suprimir → avançar → ocupar → sustentar. Investigar finais por eliminação sem remover automaticamente essa vitória.
6. Avaliar concentração em um corredor, corrida ao cume, desprezo por secundários, caça à artilharia e combate até a eliminação. Comparar consequências, não apenas taxa de vitória.
7. Guardar análises e dados em `docs/simulacoes/<versão>/`; invalidar quando o núcleo mudar. Uma comparação antiga continua disponível no histórico do Git.

## Protocolo final de equilíbrio

- Matriz completa: dez partidas por dupla ordenada de perfis, sementes comuns entre células e intervalos de confiança.
- Confrontos principais: pelo menos 100 partidas, incluindo modelos fixos entre si e Estado-maior nas duas posturas.
- Objetivo aproximado de 50% entre controladores comparáveis, com limites e assimetrias declarados; média de portfólio não demonstra equilíbrio de uma dupla.
- Relatar vitória, razão, rodadas, ocupação, coesão, retiradas e comportamento. PV não são pessoas.
- Um ciclo final de treinamento de companhia após congelar as regras; não procurar sucessivos treinos favoráveis. Modelos de batalhão permanecem intactos.

## Condições para a 1.0

- [ ] Nenhum defeito conhecido impede começar, concluir, salvar ou retomar uma partida.
- [ ] Regressão de batalhão aprovada; modelos preservados.
- [ ] Companhia tem ações independentes e fatores coerentes e explicados.
- [ ] Movimento, terreno, altura, combate e reação são consistentes, previsíveis e explicáveis.
- [ ] Objetivos, todos os símbolos e motivos de vitória são compreensíveis em PT/EN.
- [ ] Nenhuma estratégia evidentemente dominante ficou sem análise e decisão.
- [ ] Duração humana medida; se companhia exceder a meta, simplificar operação e testar novamente.
- [ ] Fonte histórica, aproximação e hipótese aparecem diferenciadas.
- [ ] Salvamento anterior, troca por arquivo/WhatsApp e memórias por escala foram verificados.
- [ ] Aparência, som, animação, movimento reduzido e controles de celular funcionam.
- [ ] Créditos, licenças, fontes, README, regras e documentação correspondem à candidata.
- [ ] Testes automáticos aprovados e publicação online/offline conferida.
- [ ] Versionamento e arquivamento de simulações aceitam a série 1.0, com testes.

## Registro de entregas

### 0.9.4 — etapas 1 e 2

- Referência permanente em `tests/fixtures/battalion-0.9.3.json`: hashes de 120 históricos completos, configuração inicial e dois arquivos de modelos. `npm run test:battalion` verifica a referência, também incluída em `npm test`. Captura protegida contra substituição por uma versão posterior.
- Diagnóstico de 440 partidas: 220 por escala, seis políticas com 20 sementes e modelos fixos com 100. Instrumentação usa o observador real de combate e verifica equivalência com o simulador. `npm run diagnose:scales` reproduz a execução.
- [Resultados, dados e limites](simulacoes/0.9.4/diagnostico-escalas/analise.md) e [interpretação e próximos experimentos](simulacoes/0.9.4/diagnostico-escalas/interpretacao.md).
- Nenhuma alteração de regras, perfis ou modelos de qualquer escala. Nenhum treino novo nesta etapa.

Correção incorporada a pedido do autor: a vitória FEB sem defensores alemães reconhece Monte Castelo assegurado, sem exigir peça no hexágono ou pontos adicionais. Vale na apresentação das duas escalas; estados, vencedor, perfis e modelos permanecem iguais. Os totais de peças e coesão do resultado passam a respeitar a escala, inclusive salvos antigos.

Próxima etapa: distinguir recuo de retirada da batalha e reavaliar a pontuação considerando o abandono das posições. Os alemães atualmente só recuam no mapa; não se retiram da batalha por decisão operacional. Depois comparar preparação do assalto e decisões da IA em companhia, uma hipótese por vez. Não alterar regras só porque companhia tem mais disparos absolutos: há mais peças e partidas com mais rodadas. Testes com pessoas e publicação 1.0 continuam pendentes.

## Depois da 1.0

Névoa de guerra completa, observadores como novas peças, campanhas, novos cenários e multiplayer em tempo real ficam fora desta preparação. Seu custo não deve atrasar a consolidação das duas escalas atuais.
