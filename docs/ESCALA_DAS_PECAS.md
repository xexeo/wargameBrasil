# Estudo de escala: batalhão ou companhia?

Estudo original de 25/10/2026. **Atualização0.9.1:** a escala companhia foi integrada como opção do mesmo jogo. Abaixo permanece o raciocínio e a proposta original; a implementação vigente usa16 peças com apoios no tabuleiro e comando por batalhão, conforme [DUAS_ESCALAS](DUAS_ESCALAS.md). Apoio fora do mapa e reserva temporizada não foram adotados nesta integração.

## O que representam as dez peças atuais

- FEB: três batalhões de infantaria, um apoio regimental agregado e um grupo de fogos.
- Alemanha: três destacamentos defensivos, uma reserva e um grupo de fogos.
- Portanto, cinco peças de cada lado **não significam cinco batalhões de cada lado**, nem efetivos iguais. Só três peças brasileiras são infantaria de manobra capaz de ocupar objetivos.

Esse recorte torna a partida curta, mas elimina opções: uma baixa de batalhão retira um terço das peças brasileiras de manobra. Um batalhão também costuma distribuir suas companhias por várias posições; representá-lo em um único hexágono de aproximadamente 180 m é uma concentração espacial abstrata, não a frente real completa da unidade.

## Evidência histórica disponível

A nova fonte institucional consultada é o [Museu Virtual da FEB, Estrutura Organizacional da Força Expedicionária Brasileira](https://museuvirtualdafeb.eb.mil.br/estrutura-organizacional-da-forca-expedicionaria-brasileira/), artigo de Sírio Fröhlich, 26/03/2025. É uma síntese institucional atual, não o mapa de efetivos do dia da batalha. Ela descreve:

- Três batalhões por regimento de infantaria.
- Três companhias de fuzileiros por batalhão, mais companhia de petrechos e elementos de comando/serviços.
- Três pelotões de fuzileiros por companhia, mais pelotão de petrechos com metralhadoras leves e morteiros de 60 mm.
- Apoio pesado do batalhão com metralhadoras e morteiros de 81 mm.
- Artilharia divisional: três grupos de 105 mm e um de 155 mm, cada grupo com três baterias. Isso não prova que todas as baterias apoiaram a mesma companhia ao mesmo tempo.

A conta organizacional para um regimento é **3 × 3 = 9 companhias de fuzileiros**, ou **3 × 3 × 3 = 27 pelotões de fuzileiros**. Separar também as companhias de petrechos acrescentaria três peças, chegando a 12 companhias de combate/apoio, antes dos elementos regimentais. Não é necessário transformar unidades administrativas em contadores.

Como referência primária de organização americana, foram consultadas cópias das tabelas do War Department de 26/02/1944: [T/O&E 7-15, Infantry Battalion](https://www.militaryresearch.org/7-15%2026Feb44.pdf), [7-17, Infantry Rifle Company](https://www.militaryresearch.org/7-17%2026Feb44.pdf) e [7-18, Infantry Heavy Weapons Company](https://www.militaryresearch.org/7-18%2026Feb44.pdf). O quadro americano prevê companhia de fuzileiros de 193 militares, pelotão de fuzileiros de 41 e batalhão de 860, sem a seção médica anexada de 34. São **efetivos de organização**, não o efetivo brasileiro presente em Monte Castelo em 21/02/1945. Não usar esses números como contagem de combatentes brasileiros reais naquele dia.

A [história oficial americana, Fisher, capítulo XXIV, p. 431](https://www.ibiblio.org/hyperwar/USA/USA-MTO-Cassino/USA-MTO-Cassino-24.html), identifica o 1º Regimento brasileiro convergindo de sul e sudoeste. Relata retirada alemã e resistência final de pequena retaguarda. O mapa 10 permite situar a operação, mas não discrimina cada companhia no recorte local.

**Ainda não confirmados:** número e identificação das companhias efetivamente empenhadas em cada eixo e horário; distribuição entre primeiro escalão e reserva; efetivos e baixas por companhia; composição exata dos destacamentos alemães no cume. A presença da 232ª DI na frente não autoriza colocar seus regimentos inteiros sobre Monte Castelo. A menção a uma pequena retaguarda também não autoriza convertê-la automaticamente em uma companhia de efetivo conhecido.

## Alternativas de representação

| Escala de manobra brasileira | Contadores de fuzileiros no conjunto do regimento | Avaliação |
| --- | ---: | --- |
| Batalhão | 3 | Rápido, mas poucas escolhas e perdas abruptas |
| Companhia | 9 | Permite eixos, apoio mútuo e reservas sem grande excesso de peças |
| Pelotão | 27, antes dos apoios | Muitos comandos para celular e partida de 5–10 minutos |

Companhia combina melhor com o tamanho dos hexágonos e com a necessidade de representar progressão, cobertura, supressão e apoio. Isso não estabelece uma frente fixa de 180 m para toda companhia. O relógio atual, de 72 minutos por rodada, também precisaria ser revisto como abstração de comando; baixar o escalão não obriga automaticamente a aumentar o número de rodadas.

## Proposta preferida para experimentar

- **Nove companhias brasileiras de fuzileiros** no conjunto disponível, agrupadas nos três batalhões.
- **Quatro destacamentos alemães de cenário**, preservando inicialmente os três núcleos defensivos e uma reserva do modelo atual. **Quatro é parâmetro de protótipo, não quantidade histórica comprovada.** Não os rotular como quatro companhias completas sem documentação.
- Apoios orgânicos integrados aos perfis das companhias. Artilharia representada por missões de fogo fora do mapa, em ambos os lados, em vez de grupos fisicamente ocupando um hexágono da encosta. O fogo continua sujeito a disponibilidade e observação a definir.
- Resultado: **13 contadores de manobra ao todo**, contra dez peças totais atualmente. Se a hipótese de cenário começar com seis companhias brasileiras e três em reserva, serão dez contadores inicialmente no mapa (6 + 4) e até treze depois. **A distribuição 6 + 3 é proposta de desenho, ainda não uma reconstituição da ordem de ataque.**
- Se for desejado mover separadamente as três companhias brasileiras de petrechos, o total subiria para **16 contadores de manobra/apoio** (12 brasileiros + 4 alemães), antes de outros apoios. Isso acrescenta micromanejo e não é a primeira opção para uma partida curta.

O apoio fora do mapa não elimina a possibilidade histórica de canhões e observadores ameaçados; limita o recorte do jogo à manobra da infantaria. Uma futura representação de observação pode ser mais útil que estacionar um grupo inteiro de obuses perto do cume.

## Mudanças necessárias antes de avaliar equilíbrio

Não transformar cada batalhão em três cópias com os mesmos atributos: isso triplicaria os ataques brasileiros e a soma de coesão das peças de manobra. Tampouco basta dividir ataque/defesa por três, pois o dado e o bônus de terreno continuariam com o mesmo peso.

Precisariam ser revistos ação/ativação, efeitos de supressão e retirada, reação defensiva, apoio, ocupação e condição de derrota. Deve haver reserva para uma perda não encerrar abruptamente uma ala; o recuo alemão deve ser considerado sem fabricar uma ordem de batalha para obter 50%.

Depois de mudar os perfis ou regras, as simulações atuais serão removidas pelo verificador de compatibilidade. O experimento em companhia deverá gerar nova matriz, com dados brutos e análise na pasta da versão executada, e ser comparado à duração e às opções táticas do modelo atual.

## Pesquisa necessária para uma ordem de batalha local mais precisa

Consultar as ordens de operações de 21/02, diários do 1º RI e seus batalhões, mapas de situação com horários, mapas de efetivos e a memória de Mascarenhas com seus anexos. Cruzar com documentos do IV Corpo/5º Exército e registros alemães. Até isso ser feito, distinguir sempre: estrutura orgânica conhecida, participação documentada e distribuição de cenário proposta.
