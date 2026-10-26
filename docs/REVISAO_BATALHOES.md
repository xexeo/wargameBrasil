# Registro da revisão do jogo de batalhões

**Registro das etapas 0.1.X. Para regras atuais, usar [guia](../GUIA_DO_JOGO.md) e [revisão0.9](DEFESA_E_EQUILIBRIO_0_9.md).**

Plano registrado antes da implementação em 25/10/2026. A alternativa de companhias permanece isolada na outra branch. Esta revisão conserva as dez peças e o mapa geográfico da main.

## Entrega principal

- Projeção de pontos e fechamentos de rodada restantes; faltam pontos/cume, último início de ocupação apenas do cume e estimativa otimista de deslocamento. A estimativa ignora ocupação e fogo, portanto não promete uma rota segura.
- Destinos expostos a uma reação válida são sinalizados usando o mesmo percurso de menor custo que o motor executa. Supressão, alcance, altitude e reação já gasta entram no aviso.
- IA tática brasileira prioriza missão e preservação de infantaria; IA tática alemã protege/intercepta objetivos. Todos os modos deixam de perseguir inimigos inexistentes e avançam ao cume quando a defesa acaba; ocupante brasileiro do cume mantém a posição.
- Fim explica se faltaram pontos, cume ou infantaria, e distingue conquista tardia de defesa ainda combatente. A condição padrão continua cume mais 8 pontos até o fim da rodada 10, a menos que os experimentos abaixo justifiquem outra decisão explícita.

## Experimentos de regra, inicialmente desligados

1. Retirada sob perdas: quando infantaria sobrevive a um ataque caindo de 2/3 para 1 PV, tenta um hexágono livre mais distante do atacante. Se não houver, permanece. A retirada suprime reação e compromete a próxima ação; não recupera PV e não evita uma perda fatal. Regra simétrica, sem alegar que reproduz uma ordem real de retirada.
2. Cume no prazo: aceitar cume assegurado no fechamento final mesmo faltando pontos, classificando como conquista no limite. Não permite vitória por eliminação nem muda prazo ou mapa.

Comparar quatro combinações com a mesma IA e sementes, guardando cada resultado. Não transformar um candidato em regra padrão apenas para obter50%. Julgar também duração, ocupação, perdas e derrotas sem defensores. Regras de partidas antigas e memória local continuam preservadas.

## Validação e pesquisa

Testar projeção e limites, trajetos expostos/suprimidos, IA que progride e mantém cume, motivos de resultado, retirada legal/bloqueada e intercâmbio. Exercitar computador/celular e partida completa. Repetir matriz 8×8 com 10 partidas por dupla e guardar análise/dados por versão. Treino da Veterana precisa refletir a nova IA; experiência pessoal não deve ser apagada.

História oficial Fisher p.431 descreve retirada alemã e pequena retaguarda; isso apoia estudar retirada, mas não fornece um turno obrigatório nem efetivos por hexágono. Atualizar a documentação que ainda registra a fonte como inacessível. Nenhum atributo de batalhão, cota ou identidade será inventado para calibrar resultados.

## Decisão intermediária após medir (superada abaixo)

Na etapa intermediária, as regras candidatas foram implementadas e testadas e permaneceram desligadas no padrão: a retirada trouxe efeitos indesejados sobre o prazo e aceitar cume sem pontos favoreceu ainda mais o atacante. Os números e a decisão detalhada ficam apenas nos relatórios versionados, para serem removidos quando incompatíveis. A nova IA conclui melhor a missão, mas a defesa ainda precisa de calibração; não declarar50% de equilíbrio sem medição válida.

## Refinamento da defesa por função

A primeira versão da IA de missão favoreceu excessivamente a FEB. Foram comparados em cópias isoladas alvos de manobra para todos os alemães, somente artilharia e somente infantaria. Adotou-se a divisão funcional: infantaria tática intercepta unidades que podem conquistar o cume, considerando proximidade/coesão; artilharia tática prioriza contrabateria até haver ameaça imediata ao cume. Caçador e Oportunista preservam suas prioridades originais. A decisão altera escolhas da IA, não atributos, identidade de tropas, DEM ou cronologia. Revalidar com sementes separadas e refazer treino/matriz; números de candidatos incompatíveis são removidos da árvore atual e preservados no Git quando já commitados.

## Decisão final para novas partidas

A defesa passou a separar interceptação da infantaria e contrabateria. Com essa correção, as duas regras combinadas foram próximas da meta e evitaram os finais de defesa vencedora sem defensores na validação independente. Adotar a combinação: retirada por perda de coesão, sem cura e com reorganização, e vitória custosa por cume assegurado no fechamento final quando faltar pontuação. Cume com a meta completa permite vencer antes. As configurações individuais continuam no estudo de comparação, sem tratar parâmetros como fatos históricos. Partidas antigas preservam flags ausentes/falsas; somente novas partidas recebem o padrão. A análise numérica fica nos diretórios versionados compatíveis.

## Solicitações posteriores do autor

A vitória por neutralização de todas as peças adversárias volta a ser detectada imediatamente, inclusive ao retomar uma partida ativa sem defensores. Isso não afirma conquista do cume nem morte de todos os soldados. Novas partidas permitem mover e disparar em qualquer ordem com um ataque normal e o mesmo orçamento de PM; flags antigas preservam a regra anterior de movimento. Contagens de recuos são eventos/unidades do jogo, sem conversão em pessoas. Recalcular a matriz após essas mudanças; os números de 54% não avaliam automaticamente esta revisão.
