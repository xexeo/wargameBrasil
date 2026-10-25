# Escala, tropas e níveis táticos

Decisão de projeto registrada antes da implementação desta revisão, em 25/10/2026. A escala de referência será **batalhão** para infantaria e **grupo** para artilharia. Pelotões individuais exigiriam mais peças para cobrir a frente e prejudicariam a duração de 5–10 minutos.

## Base histórica e limites

- Os batalhões Franklin, Uzeda e Sizeno Sarmento pertencem ao **1º Regimento de Infantaria, Sampaio**. A síntese consultada identifica I/1º RI com Franklin, II/1º RI com Uzeda e III/1º RI com Sizeno. Não atribuir automaticamente qualidade superior a um deles apenas pela importância de seu comandante ou pela direção de ataque.
- A **Artilharia Divisionária da FEB** coordenou os fogos de apoio. A organização divisional empregava grupos de 105 e 155 mm. Uma peça de jogo representa fogos alocados de um grupo, não toda a artilharia da FEB concentrada fisicamente num único hexágono.
- A **232ª Divisão de Infantaria** era uma formação do **Heer**, com os regimentos de granadeiros 1043, 1044 e 1045 e o Artillerie-Regiment 232. Sua condição de divisão estática não significa que fosse uma divisão de montanha de elite. A formação incluía homens mais velhos e convalescentes, alguns com experiência anterior de combate; isso também não autoriza tratar todos como inexperientes.
- As fontes mencionam reservas de fuzileiros e elementos de montanha no setor mais amplo. Não foi confirmada a posição de cada batalhão alemão nos hexágonos. Portanto as peças alemãs representam destacamentos agregados de cenário, de escalão não confirmado, sem inventar números de batalhões ou unidades SS no mapa.
- “Apoio do Sampaio” agrega armas coletivas distribuídas no regimento. **Não é um quarto batalhão histórico criado pelo jogo.** Seu fator de combate resume esse apoio numa peça.

## Níveis

- **T1 — reduzido:** destacamento de menor força disponível, representado na reserva de cenário. Não é uma nota sobre a coragem ou a experiência de seus soldados.
- **T2 — operacional:** infantaria e apoio aptos ao combate, incluindo tropas já expostas à campanha.
- **T3 — especializado em fogos:** perfil de grupo de artilharia. Tem maior alcance e poder de fogo, mas menor mobilidade e defesa próxima.

Esses níveis são **classificações de jogo**, não avaliações numéricas encontradas em relatórios de 1945. Não somam bônus ocultos a A/D. O papel e o escalão explicam os atributos visíveis; T3 não vence automaticamente T2.

## Perfis iniciais propostos

Os valores abaixo são o ponto de partida da calibração, não um compromisso de mantê-los se o autojogo mostrar desequilíbrio. `troops.ts` é a fonte editável; registrar alterações ao final da validação.

| Peça | Escalão representado | T | A | D | PM | Alcance | Ocupa objetivo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| I/1º RI — Franklin | batalhão | 2 | 3 | 3 | 3 | 1 | sim |
| II/1º RI — Uzeda | batalhão | 2 | 3 | 3 | 3 | 1 | sim |
| III/1º RI — Sizeno | batalhão | 2 | 3 | 3 | 3 | 1 | sim |
| Apoio do Sampaio | armas coletivas agregadas | 2 | 3 | 2 | 2 | 2 | não |
| Grupo de fogos FEB | grupo de artilharia alocado | 3 | 5 | 1 | 1 | 5 | não |
| Granadeiros — Castelo | destacamento de cenário, 232ª DI | 2 | 3 | 3 | 2 | 1 | sim |
| Granadeiros — setor A | destacamento de cenário, 232ª DI | 2 | 3 | 3 | 2 | 1 | sim |
| Granadeiros — setor B | destacamento de cenário, 232ª DI | 2 | 3 | 3 | 2 | 1 | sim |
| Reserva — 232ª DI | destacamento reduzido de cenário | 1 | 2 | 2 | 2 | 1 | sim |
| Fogos — Art.Rgt.232 | grupo de artilharia alocado | 3 | 4 | 1 | 1 | 5 | não |

Os 3 PV continuam representando coesão/capacidade restante de cada peça, não efetivos iguais de pessoas. A menor defesa torna apoio e artilharia vulneráveis no combate próximo. PM mede liberdade de manobra na situação tática, não uma velocidade de marcha nacional ou individual.

## Regras da revisão

- Infantaria ocupa os objetivos; apoio e artilharia precisam colaborar com a manobra e não geram pontos sozinhos.
- Se a FEB perder todas as suas peças capazes de ocupar objetivos antes de vencer, a missão fracassa, mesmo que reste uma bateria.
- O apoio agregado usa alcance 2 e fogo indireto como simplificação de suas armas coletivas; não é uma afirmação de que toda metralhadora dispara indiretamente.
- Artilharia conserva alcance abstrato 5 e tiro indireto. Isso não representa o alcance balístico real de obuses de 105/155 mm numa escala de 180 m por hexágono; resume disponibilidade de apoio na área do jogo.
- IA deve usar apoio à distância e deixar a tomada de posições para infantaria, em ambos os lados.
- Para atender à revisão dos controles, selecionar a peça mostrará simultaneamente destinos azuis e uma barra vermelha nos inimigos atacáveis. Sem botões Mover/Atacar.
- Partidas salvas de versões anteriores mantêm seus atributos; perfis completos novos são usados ao iniciar outra partida. O aprendizado não será apagado.

## Fontes efetivamente consultadas

1. [Battle of Monte Castello](https://en.wikipedia.org/wiki/Battle_of_Monte_Castello), especialmente ataque final e forças alemãs; a síntese remete a Mascarenhas de Moraes para a operação dos batalhões. Fonte secundária, não uma ordem de batalha original consultada.
2. [232nd Infantry Division (Wehrmacht)](https://en.wikipedia.org/wiki/232nd_Infantry_Division_(Wehrmacht)), organização e natureza da formação; cita Fisher para pessoal e reservas.
3. [Brazilian Expeditionary Force](https://en.wikipedia.org/wiki/Brazilian_Expeditionary_Force), organização dos regimentos e apoio divisional.
4. [A organização técnica e militar da FEB](https://www.nosrastrosdahistoria.com/post/a-organiza%C3%A7%C3%A3o-t%C3%A9cnica-e-militar-da-feb-e-seus-regimentos-na-segunda-guerra-mundial), texto integral consultado, organização da artilharia em quatro grupos e calibres 105/155 mm. Divulgação histórica; não usar como prova da localização de cada bateria no dia 21.

Continuam pendentes os mapas de situação e diários que permitiriam localizar e dimensionar cada destacamento com maior precisão. Os perfis e níveis ficam sujeitos à revisão do autor.

## Conferência em história oficial

O capítulo XXIV, p. 431, de Fisher relata retirada alemã e resistência final de pequena retaguarda. Não afirmar que as três peças de granadeiros são três batalhões completos no cume. Ver [MAPAS_OFICIAIS.md](MAPAS_OFICIAIS.md) para fontes e limites.

## Parâmetros de fogo revistos

Alcance dos dois grupos: 5 hexágonos (disponibilidade abstrata, não limite balístico). Reação em altura: máximo 1 dano, uma reação por movimento completo; consome o próximo turno da unidade. Alcance direto +1 com desnível mínimo de 90 m e linha de visão. Defesa elevada +1 a partir de 30 m. Regras simétricas.
