# Experimento: escala de companhia

Branch: `experimento/escala-companhia`, derivada de `main` em `19053be`.

Registro feito antes da implementação. Este primeiro passo é um **protótipo de organização e estado inicial sem interface**, sem movimento, combate ou avaliação de equilíbrio. O jogo de batalhões continua sendo o jogo executado pelo HTML nesta branch; o cenário experimental não é passado ao motor existente.

## Hipótese de trabalho

- Nove companhias brasileiras de fuzileiros, agrupadas nos três batalhões do 1º RI.
- Duas companhias por batalhão inicialmente no mapa; uma por batalhão na reserva: seis ativas e três reservas brasileiras.
- Quatro destacamentos alemães: três núcleos defensivos e uma reserva tática já no mapa, preservando as posições de cenário anteriores.
- Dez contadores inicialmente no mapa (6 + 4); treze no conjunto disponível (9 + 4).
- Armas orgânicas integradas às companhias. Dois descritores de apoio de artilharia, um por lado, fora do mapa. Isso não representa duas baterias históricas de tamanho conhecido.
- Nenhum valor A/D/PV/movimento é herdado automaticamente dos batalhões. Nove companhias não serão nove cópias do fator de combate de um batalhão.

A estrutura de três companhias por batalhão está apoiada nas fontes do [estudo de escala](../../docs/ESCALA_DAS_PECAS.md). A identificação A/B/C é uma etiqueta provisória de jogo, não numeração histórica de companhia. A distribuição duas ativas/uma reserva em cada batalhão e os quatro destacamentos alemães são **hipóteses de desenho**, não uma ordem de batalha documentada. As posições de destacamentos são esquemáticas. Falta confirmar companhias, efetivos, posições e horários nos documentos operacionais.

## Primeiro resultado verificável

`scenario.ts` fornecerá um construtor puro que retorna o quadro de unidades, reservas e descritores de apoio. Não usará armazenamento, DOM, relógio ou aleatoriedade. O tipo próprio do protótipo evita apresentá-lo como uma partida já compatível com o motor de batalhões.

Testes devem comprovar: nove companhias em três grupos de três, duas ativas e uma reserva por grupo; quatro destacamentos alemães; dez posições iniciais legais sem sobreposição; treze identidades únicas no conjunto; reservas e artilharia sem coordenadas de mapa; construções independentes sem estado mutável compartilhado.

## Próximas etapas

1. **Ativações:** definir orçamento de comando por batalhão/lado, antes dos fatores de combate, para evitar triplicar o volume de ataques. Quantidade exata de ativações ainda aberta.
2. **Reservas:** definir gatilhos, entradas legais, ocupação, movimentação e condições de derrota com unidades disponíveis fora do mapa.
3. **Fogos:** definir missões fora do mapa, observação, disponibilidade, supressão e interação com o fogo defensivo. Descritores iniciais não concedem disparos por si só.
4. **Motor:** criar execução headless própria da variante ou uma interface de cenário capaz de expressar esses estados. Rever perda de coesão, retirada e ocupação; evitar funções que presumam cinco unidades e 15 PV por lado.
5. **Interface:** identificação experimental, seleção de companhias/batalhões, reservas e missões de fogo. Preservar fundo branco, zoom e controles por toque.
6. **Autojogo:** após a variante realmente terminar partidas, gerar matriz de 10 jogos por dupla ordenada, com as políticas e hipóteses declaradas. Guardar análise, sementes e dados brutos por versão em `docs/simulacoes`; os fingerprints devem incluir o novo motor e seu protocolo antes de publicar resultados da variante.
7. **Comparação:** confrontar opções táticas, perda de infantaria, duração e conquista do cume com a base. Não atribuir 50% de equilíbrio ao protótipo antes de medir. Manter dados da base identificados como base.

## Isolamento

O worktree experimental usa porta local 8001 para desenvolvimento e testes de navegador. O workflow do Pages continua acionado apenas pela `main`. Não há merge ou publicação do cenário alternativo nesta etapa. Mudanças de documentação/configuração não invalidam os resultados anteriores da base; não há resultados simulados da variante ainda.

## Resultados herdados

Os diretórios de simulações copiados da base, inclusive a matriz e o resultado de 51,1%, avaliam exclusivamente o jogo de batalhões. Continuam compatíveis com esse motor preservado, mas não medem esta variante. Como ainda não há combate/turnos de companhia, não foi executada nem declarada simulação da alternativa.
