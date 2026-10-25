# Especificação da alternativa de companhias

Revisão de desenho: **company-draft-1**, 25/10/2026. Branch `experimento/escala-companhia`. Documento de referência para futura implementação, derivado do [guia do experimento](GUIA.md) e do [estudo histórico de escala](../../docs/ESCALA_DAS_PECAS.md).

**Estado real:** somente organização e estado inicial estão implementados em `scenario.ts`. As regras abaixo são uma especificação de candidato, não comportamento já disponível no HTML. Ainda não há partidas completas, equilíbrio medido ou matriz de resultados desta variante. O jogo executado pelo HTML e as simulações herdadas continuam sendo os da base de batalhões.

## 1. Requisitos fixos, parâmetros e hipóteses

**Fixos nesta alternativa:** execução local no navegador com HTML/TypeScript; motor sem DOM; mapa geográfico da base; interface clara para celular; peças quadradas e símbolos militares; movimento e ataque por toque contextual; nove companhias brasileiras agrupadas nos três batalhões; apoios orgânicos integrados; artilharia fora do mapa; reserva explícita; identificação experimental; resultados e memória separados da base. Preservar zoom contínuo, mapa inteiro, visão tática, inspeção por duplo toque, missão inicial e sua reabertura, autoria/LUDES e licenças.

**Parâmetros iniciais de teste:** seis companhias brasileiras ativas, três em reserva, quatro destacamentos alemães ativos, três ativações por lado, uma companhia ativada por batalhão, 3 PV por contador, A2/D2, dez rodadas, meta de oito pontos mais cume, três missões de apoio por lado. São valores de protótipo revisáveis, não dados encontrados nos documentos históricos.

**Hipóteses não confirmadas historicamente:** distribuição duas companhias ativas/uma reserva em cada batalhão; posições iniciais; quantidade e dimensão dos quatro destacamentos alemães; horários de chegada das reservas; disponibilidade numérica das missões de fogo. Etiquetas A/B/C não pretendem ser a numeração histórica das companhias. Não inventar números de unidades, comandantes, topônimos ou avaliações de qualidade para preencher essas lacunas.

## 2. Ordem de batalha de cenário

| Elemento | Quantidade | Estado inicial | Representação |
| --- | ---: | --- | --- |
| Companhias brasileiras de fuzileiros | 9 | 6 no mapa, 3 na reserva | 3 por batalhão, duas A/B ativas e C em reserva |
| Destacamentos alemães da 232ª DI | 4 | 4 no mapa | Três núcleos defensivos e reserva local; escalão exato não confirmado |
| Descritores de apoio de artilharia | 2 | Fora do mapa | Um por lado; não equivalem a duas baterias históricas |

Total: dez contadores inicialmente no mapa, treze no conjunto de manobra, até treze simultaneamente ativos. Descritores de artilharia não ocupam hexágonos, não capturam objetivos e não são alvos de infantaria neste recorte. Não adicionar contadores separados para comando, serviços ou cada arma orgânica.

As posições iniciais são as registradas no protótipo: brasileiros em q=1…6/r=7; alemães em (5,1), (3,3), (6,3), (4,1), usando coordenadas internas iniciadas em zero. Tropas alemãs são Heer; não há comprovação de Waffen-SS neste recorte.

## 3. Perfis candidatos e escala

| Perfil | A | D | PV de coesão | PM | Alcance direto |
| --- | ---: | ---: | ---: | ---: | ---: |
| Companhia brasileira | 2 | 2 | 3 | 3 | 1 |
| Destacamento alemão | 2 | 2 | 3 | 2 | 1 |

Os três batalhões recebem a mesma classe operacional inicial. Armas orgânicas estão incluídas no A/D; não concedem um segundo ataque gratuito. Os 3 PV normalizam a coesão de cada contador, sem afirmar efetivos iguais ou transformar danos em números de mortos.

Não copiar três vezes os fatores dos batalhões. A quantidade maior de companhias será controlada também por orçamento de ativações, e o dado/terreno exigirão calibração própria. Não interpretar A2 como metade ou dois terços de um efetivo real.

A escala de aproximadamente 180 m por hexágono permanece uma generalização. Cada contador indica a posição tática de referência de uma companhia/destacamento, não toda a área física ocupada pela unidade. Manter dez rodadas de 72 minutos no primeiro candidato permite comparar com a base; isso não descreve uma troca de tiros contínua durante 72 minutos.

## 4. Sequência de rodada e comando

1. Início do turno brasileiro: processar entradas de reserva devidas, quitar dívidas de reação, renovar PM/ação das unidades elegíveis e abrir orçamento de comando.
2. Brasileiro escolhe a ordem entre apoio, pedidos de reserva, movimentos e ataques legais. Apoio não é obrigatoriamente a primeira ação humana.
3. Encerrar turno brasileiro: concluir ativações, expirar a supressão que já atravessou esse turno e preparar reações para o turno adversário.
4. Executar o mesmo ciclo de início, ações e encerramento para a Alemanha.
5. No fechamento alemão: pontuar objetivos brasileiros, verificar vitória/prazo, registrar duração e iniciar a rodada seguinte se necessário.

Cada lado dispõe de **três ativações por turno**, antes das dívidas por fogo defensivo. Pela FEB, no máximo uma companhia por batalhão pode ser ativada no mesmo turno. Pela Alemanha, no máximo três destacamentos distintos. Uma unidade ativada pode mover em etapas e atacar uma vez. Selecionar/inspecionar não gasta ativação; o primeiro movimento ou ataque válido gasta uma. Voltar à mesma unidade já ativada não gasta outra, enquanto houver PM e ela ainda não tiver atacado.

A solicitação de reserva ocupa a ativação do respectivo batalhão e uma das três ativações do lado. Apoio fora do mapa usa seu próprio limite de missões, sem permitir ativar uma segunda companhia daquele batalhão. Unidades não ativadas podem defender e, se elegíveis, reagir; a reação será cobrada no próximo turno.

Configuração para comparação posterior: três ativações com uma por batalhão, quatro ativações permitindo uma segunda companhia de apenas um batalhão, e ativações livres. Alterar uma variável por vez. O candidato livre serve como controle do risco de multiplicar ataques; não é o padrão inicial.

## 5. Movimento, altura e observação

Reutilizar DEM, curvas e custos geográficos da base: campo/estrada 1 PM, mata 2 PM, mais 1 PM por faixa de altitude subida; descer não devolve PM. Não atravessar ou terminar em hexágono ocupado. Não há empilhamento. Caminhos de menor custo devem ser os mesmos na prévia e na execução.

Tiro direto usa linha de visão pela altitude DEM, altura de observação e copas da base; adjacentes têm linha de visão. Defender pelo menos 30 m acima dá +1. Atirar pelo menos 90 m acima amplia alcance direto em um hexágono, exigindo linha de visão. A proteção de mata/posição preparada usa o maior bônus natural/preparado (+1), além do bônus separado de altura. Posições preparadas permanecem esquemáticas.

O deslocamento é resolvido hexágono a hexágono; reações podem interrompê-lo antes do destino. Não gastar todo o custo de uma rota se a unidade tiver sido retirada de combate ou forçada a recuar antes de completá-la.

## 6. Ataque, coesão, supressão e retirada

Potência direta candidata: `A + d6 − D − cobertura − bônus de altura − 0,5 × PV perdidos − penalidade de supressão`. Resultado ≥5 causa 2 danos; ≥1 causa 1; abaixo de 1 não causa dano. Cada ataque encerra o movimento da unidade. Retirar de combate ao chegar a zero PV e registrar saída/baixa como perda de capacidade, não morte de todos os soldados.

**Não há contra-ataque automático adicional em falhas:** a reação explícita é o mecanismo de fogo defensivo desta alternativa. Isso evita dobrar a punição de um assalto depois de o defensor já ter atirado.

Acerto de artilharia causa supressão. Unidade suprimida não reage e tem −1 no ataque normal. A supressão dura até o fim do próximo turno próprio do alvo; acertos repetidos não acumulam penalidade. A interface mostra S e o momento de expiração. O alvo pode mover e retirar-se se for ativado. Perder supressão não restaura PV nem ativações.

Ao receber dano e terminar com exatamente 1 PV, tentar uma retirada de um hexágono legal. O destino deve estar livre, dentro do mapa, não adjacente a inimigo e mais distante do atacante direto; para apoio indireto usar como ameaça o observador da missão. Entre destinos elegíveis, preferir maior cobertura, depois maior distância da ameaça, depois q/r crescentes. Esta regra determinística é compartilhada pelo humano e pelo simulador; não abre decisão extra no celular. Se nenhum destino existe, a unidade permanece suprimida no lugar, sem eliminação automática. A retirada não recupera PM e encerra o movimento/ataque ainda em curso do alvo.

Se uma reação causar retirada do assaltante antes do ataque, cancelar o assalto; a ativação já gasta não é devolvida. Se o defensor recuar após um ataque, não avançar automaticamente para o hexágono desocupado: a ocupação exige movimento legal posterior de outra unidade ou de turno futuro.

A retirada alemã descrita por Fisher não será equiparada automaticamente a esse recuo tático. Um evento operacional de retirada histórica exige pesquisa de horários/condições e será uma hipótese separada de cenário.

## 7. Fogo defensivo e dívida de comando

Unidade de tiro direto não suprimida, com alvo pelo menos 30 m abaixo e dentro do alcance/visão, pode reagir ao avanço exposto ou ao assalto contra ela. Resolver primeiro a reação do próprio alvo no assalto; em deslocamento escolher o defensor elegível de maior A, depois menor distância e id. Máximo de uma reação por movimento completo, uma reação por unidade entre seus turnos e, pela FEB, uma por batalhão. Limite global de três reações por lado entre turnos.

Reação causa no máximo 1 dano, usando a mesma potência/dado do tiro direto. Cada unidade que reagiu fica com dívida para seu próximo turno. No início desse turno, cada dívida consome uma das três ativações; a unidade fica indisponível para mover/atacar durante ele. Pela FEB, a dívida também ocupa a ativação de seu batalhão. Depois do turno próprio, limpar a dívida e permitir reações futuras. Não apagar uma dívida simplesmente porque o jogador selecionou outra companhia do batalhão.

O lado pode ficar sem ativações de infantaria se tiver usado as três reações; ainda poderá usar apoio disponível e encerrar turno. Reação interrompida por supressão não gera dívida, dano ou sorteio. A simetria vale para ambos os lados, inclusive brasileiros que conquistaram altura.

## 8. Reserva brasileira

Uma reserva por batalhão, sem coordenadas enquanto estiver fora do mapa. Candidato inicial: pedidos liberados desde a rodada 1, no máximo um pedido por turno brasileiro; cada pedido gasta uma ativação de seu batalhão e chega no início do turno brasileiro seguinte. Não fabricar efetivos novos nem repor PV de uma companhia perdida: a reserva mantém sua própria identidade.

Células de entrada preferenciais, ainda hipóteses de desenho: I/1º RI (1,8)/(2,8); II/1º RI (3,8)/(4,8); III/1º RI (5,8)/(6,8). Entrada só em célula livre, dentro do mapa e não adjacente a inimigo. Preferir a primeira livre na ordem registrada. Não atravessar peça, desalojar aliado ou teletransportar para outro setor se ambas estiverem bloqueadas.

Entrada bloqueada permanece pendente para o início do turno seguinte, sem novo custo de comando e sem duplicar unidade. Mostrar a causa do bloqueio. Entrada bem-sucedida deixa a companhia com zero PM e sem ataque/reação/observação nesse turno; passa a ficar pronta no início do turno próprio seguinte. Ela já pode sofrer ataques e ocupar fisicamente sua célula.

Não declarar derrota por ausência momentânea de infantaria ativa se houver reservas ou entradas pendentes. Comando abstrato permite solicitar uma reserva mesmo sem comandante representado no mapa. A missão fracassa se toda a infantaria do conjunto estiver fora de combate e não houver reserva/entrada pendente, ou pelo prazo. Bloqueio de entradas não cria vitória automática antes do prazo.

## 9. Artilharia fora do mapa

Cada lado começa com **três missões disponíveis**, no máximo uma por turno próprio. São recursos de cenário, não inventário histórico de projéteis ou baterias. Candidato simétrico inicial; não concluir que os efetivos ou as capacidades históricas eram iguais.

A missão exige um alvo inimigo identificado e um observador de infantaria próprio ativo, não suprimido, não recém-chegado, com linha de visão e alvo a até três hexágonos. Não basta o inimigo estar desenhado no mapa sem névoa. Um observador ativado continua elegível se não estiver suprimido/retirado; observar não concede novo ataque nem custa outra ativação. Não exigir alcance balístico contado a partir de uma artilharia inexistente no mapa.

Resolver com `3 + d6 − D − cobertura − bônus de altura defensiva`; sem bônus de alcance por altura. Potência ≥1 causa 1 dano e supressão; caso contrário, falha. Máximo 1 dano por missão neste candidato. Informar observador, alvo, dado e efeito no diário. O alvo pode recuar conforme a regra de 1 PV. Não permitir reação contra a artilharia fora do mapa ou contra o observador apenas por observar.

Consumir uma missão quando um pedido válido é executado, inclusive se o tiro falhar. Pedidos inválidos não consomem missão, ativação ou RNG. Não há reposição automática. Primeira versão não aplica o bônus de barragem da rodada 10 da base; conservar o contexto histórico no texto, e avaliar concentração programada apenas em experimento posterior explicitamente separado.

## 10. Pontuação, prazo e grau da vitória

Candidato comparável à base: ao fechar o turno alemão, infantaria brasileira ativa sobre o cume rende 2 pontos e cada secundário 1. Máximo 4 pontos por rodada; meta **8 acumulados**, com cume ocupado e assegurado nesse fechamento. Perdas posteriores não subtraem pontos já registrados. Reserva fora do mapa e artilharia não pontuam.

Prazo de dez rodadas, encerramento às 18h do relógio do cenário. Apenas o cume exige quatro fechamentos de rodada, logo ocupação desde a rodada 7 até a 10; pontos secundários acumulados podem permitir chegada posterior. Eliminar todos os alemães não substitui a missão neste primeiro candidato. Registrar explicitamente finais em que a defesa ganhou pelo prazo sem contadores restantes, para avaliar esse efeito já visto na base.

Defesa vence por prazo ou pela perda de toda a infantaria brasileira disponível no conjunto. Companhia em reserva/pedida não conta como perdida. Não presumir cinco unidades ou 15 PV no cálculo de resultado.

Grau candidato brasileiro: `eficiência = arredondar(max(0, 100 − 3×(rodada final−1) − 30×(companhias perdidas/9) − 30×(coesão perdida/27)))`. Coesão perdida inclui PV de companhias removidas; reservas intactas conservam seus PV. Decisiva ≥70; tática ≥45; custosa ≥20; pírrica abaixo disso. A fórmula é um parâmetro de jogo, não um índice histórico de baixas. Revisar incentivos para não premiar artificialmente reservas ociosas.

## 11. Estado, comandos e arquitetura

Criar estado próprio da variante, sem converter o protótipo atual em `Game` por coerção de tipos. Estado mínimo: identificador de variante/revisão; configuração completa; rodada/turno/fase; placar/vencedor/rodada final; roster fixo das treze identidades; estado e PV de cada contador; células somente de ativos; reservas pendentes e chegada prevista; supressão/expiração; ativações gastas por unidade e batalhão; dívidas de reação; missões e observadores; diário/eventos; estado do RNG; contador de turnos transferidos.

Comandos públicos: `Move`, `Attack`, `RequestReserve`, `FireSupport`, `EndTurn`, com id/células/alvo necessários. `Select`, zoom e inspeção são estado de UI e não mudam a partida. Cada comando terá validação pura, execução e lista de eventos. A UI usa a mesma validação para destacar destinos/alvos; a IA usa a mesma execução. Não duplicar custo, alcance, reserva ou retirada no código visual.

Rejeição de comando deve deixar estado, orçamento e RNG inalterados. Movimento parcial interrompido por evento válido gera eventos e custo real percorrido, não erro genérico. Controlar explicitamente sorteios: fluxo de combate e fluxo de política injetados no headless, com sementes no relatório. Para humanos, gerar a semente ao criar a partida e persistir o estado do gerador. Não usar tempo de animação para decidir combate.

Não herdar treinamento da base como se fosse treino da variante. As políticas de alvo maior ataque/menor defesa e Estado-maior terão adaptadores para selecionar ativações, observação e reserva. Aprendiz/Veterana exigirão tabela, estados e recompensas separados. Guardar perfis e escolhas de política por turno nas simulações, com memória independente por lado e protocolo de reset/persistência declarado.

## 12. Persistência e humano × humano

Chaves locais próprias, como `monte-castelo-company-session-v1` e `monte-castelo-company-learning-v1`; nunca sobrescrever a sessão/experiência da base. Envelope de intercâmbio candidato: `schema: 2`, `variant: company-experiment`, `rulesRevision: company-draft-1`, configuração/fingerprint e estado completo. A base não deve aceitar silenciosamente esse envelope. Ao importar arquivo de outra variante, explicar a incompatibilidade sem substituir a sessão atual.

Validar: treze ids esperados e únicos no roster; até treze ativos; toda unidade exatamente em um estado ativo/reserva/pendente/fora-de-combate; sem sobreposição; coordenadas apenas de ativos; nove companhias brasileiras/quatro destacamentos alemães; PV/PM/orçamentos dentro dos perfis; ativações compatíveis com batalhões; dívidas sem duplicação; missões 0–3; fase/rodada/coerência do vencedor; log e payload limitados. Valores máximos candidatos: rodada 1–11, log 400 entradas de até 1.000 caracteres e payload de turno 30 KB.

Exportação de arquivo e link WhatsApp devem preservar reservas, supressão, dívida, apoio e RNG, sem backend ou envio automático. Mostrar variante, revisão, lado a jogar e número de turno transferido. Reabrir uma mensagem antiga não autentica o jogador nem garante que seja o último estado; manter a limitação do intercâmbio assíncrono da base explícita.

## 13. Interface e acessibilidade

Banner permanente **EXPERIMENTO · COMPANHIAS** e indicação inequívoca do cenário na narrativa, regras, versão e exportação. Branco como fundo; FEB azul/alemães carvão, símbolos e nomes em texto; não depender só de cor. Companhia usa marca de escalão I, batalhão é agrupamento II no painel; destacamentos alemães seguem DEST enquanto a identificação não for comprovada.

Mostrar ativações restantes e batalhões já usados; tocar na companhia mostra destinos azuis e barras vermelhas somente para ações legais. Companhia do mesmo batalhão cuja ativação foi usada por outra continua selecionável/inspecionável, com motivo do bloqueio. Movimento em etapas preservado sem alternadores Mover/Atacar.

Painel de reservas mostra disponível/pedida/chegada bloqueada/chegada nesta rodada e entrada prevista. Comando Solicitar reserva é contextual ao batalhão. Apoio tem botão próprio por ser uma decisão distinta, seguido de indicação de observadores/alvos legais e missões restantes. Não representar a artilharia como uma peça clicável em célula fictícia.

Missão deve mostrar prazo, placar acumulado, rendimento previsto e presença de infantaria no cume. Expor números A/D/PV/PM, supressão, reação e dívida. Diário distingue dano, supressão, retirada e destruição da capacidade de combate. Meta de toque de 44 px para controles; no zoom tático garantir legibilidade dos contadores e motivos de bloqueio, com rolagem lateral restrita ao mapa. Popups de regras devem ilustrar as novas marcas.

## 14. Testes de aceitação

- Organização: nove companhias, três batalhões, distribuição 6+3 e quatro alemães; dez posições iniciais, treze identidades totais; apoios/ reservas sem coordenadas de mapa. Já coberto pelo protótipo atual.
- Comando: primeira ação válida cobra uma ativação; inspeção não cobra; mesma companhia continua sem segunda cobrança; outra do mesmo batalhão é bloqueada; orçamento e dívida aplicados sem dupla cobrança.
- Movimento: custo e prévia coincidem; ocupação/subida corretas; reação no trajeto usa a célula efetiva; retirada interrompe avanço e não devolve ativação.
- Combate: limites do dado/dano; um tiro normal por unidade; falha sem contra-ataque automático extra; altura/visão; supressão tem duração definida; retirada determinística e bloqueio não mata automaticamente.
- Reservas: pedido/atraso/entrada única; alternativas ordenadas; hexágono ocupado ou adjacente a inimigo bloqueia; nenhum custo extra na repetição; ausência de ativos com reserva não encerra incorretamente.
- Apoio: observador válido obrigatório; recém-chegado/suprimido inelegível; uma missão por turno e três totais; falha consome missão; pedido inválido preserva RNG e recursos; artilharia não captura nem é atacável no mapa.
- Vitória: meta e cume no fechamento correto; 4 por rodada versus 8 acumulados; reserva não pontua; prazo exatamente dez; todos os brasileiros perdidos só após esgotar reservas; grau usa nove companhias/27 PV.
- Persistência: ida e volta de todas as fases/efeitos e RNG; rejeitar esquema da outra variante, ids duplicados, estado impossível e payload excessivo; chave da base intacta.
- Headless: semente igual produz os mesmos eventos/resultado; nenhum comando ilegal das IAs; toda partida termina; quantidades não excedem o roster; orçamento não fica negativo.
- Browser desktop/celular: narrativa e banner; zoom; seleção contextual; bloqueio por batalhão; pedido/entrada bloqueada de reserva; apoio com/sem observador; retirada visível; retomada/exportação; partida completa usando os mesmos comandos do headless.

## 15. Autojogo, dados e critérios de comparação

Só simular equilíbrio depois de implementar turnos, fogos, reservas e desfecho completos. Matriz inicial: seis políticas fixas (três estratégias × duas posturas), Aprendiz e Veterana, comandando ambos os lados; dez jogos por dupla ordenada, 64 células/640 partidas. Estado inicial de aprendizagem, exploração, sementes e fluxos RNG devem ser declarados; nenhum acesso pressuposto à memória pessoal do navegador.

Guardar em `docs/simulacoes/<versão>/company-<revisão>-<execução>/`: análise, agregados, dados por partida e manifesto. Cada partida registra sementes, vencedor/motivo, rodada, placar, cume, perdas por companhia/batalhão, supressão/retirada, reservas pedidas/entradas/bloqueadas, ativações/dívidas, missões usadas, políticas e eventos de comando. Dados compactos não devem perder os eventos necessários para reproduzir uma partida problemática.

**Antes de registrar qualquer resultado**, incluir arquivos do motor, configuração, regras, perfis, adaptadores de IA, armazenamento de estado e protocolo experimental no fingerprint de compatibilidade. O verificador atual protege a base, mas ainda não inclui arquivos da variante: não basta reutilizar seu manifesto sem estender a cobertura. Remover análise e dados incompatíveis quando esses fontes mudarem. Mudança apenas de versão/CSS/documentação não invalida resultados; protocolo alterado precisa ser identificado.

Publicar matriz como frequências observadas, não probabilidades garantidas; dez jogos por célula não demonstram equilíbrio ou dominância estatística. Informar intervalos de Wilson e distinguir vantagem/ dominância empírica de confirmação. Comparar com a base por duração em rodadas, ativações, perdas de manobra, retirada e chegada ao cume; minutos humanos exigem sessões reais.

Investigar candidatos de comando, retirada e reserva um por vez. Não remodelar DEM, inventar unidades históricas ou ajustar silenciosamente qualidade de comandantes para atingir 50%. A meta próxima de 50% com a mesma IA é critério de projeto, não requisito para alterar os fatos. Não substituir o jogo base sem revisão de jogabilidade, dados e fidelidade.

## 16. Pendências históricas e decisões abertas

Pesquisar ordens do dia 21/02, diários do 1º RI e batalhões, mapas de situação por horário, efetivos por companhia e anexos da memória de Mascarenhas. Cruzar com documentos do IV Corpo/5º Exército e registros alemães. Distinguir organização conhecida, ação efetivamente documentada e distribuição de cenário.

Continuam abertos: identidade e setores das companhias; dimensão da retaguarda alemã; condição/horário do recuo operacional; missões e observação reais; distribuição de primeiro escalão/reserva; número ideal de ativações; tempo de chegada e prontidão das reservas; severidade de supressão/retirada; equilíbrio de apoio; fórmula de grau. Todos os valores numéricos deste candidato devem ficar em configuração editável e ser registrados junto aos dados do experimento que os testar.

## 17. Marcos de implementação

1. Organização/estado inicial e isolamento — concluído em `36b1a0b`; testes da variante somente cobrem este marco.
2. Esta especificação completa e revisão das hipóteses — documento atual, sem expansão de implementação.
3. Estado de partida/comandos e orçamento, com testes headless.
4. Reserva, fogos, supressão/retirada e desfecho, com testes de fases limítrofes.
5. Adaptadores de IA, armazenamento/WhatsApp e interface experimental.
6. Protocolo/fingerprint da variante, matriz e análise por versão.
7. Comparação com a base e decisão de manter, revisar ou descartar a alternativa.

A `main` continuará podendo evoluir em batalhões de forma independente. Esta branch não deve incorporar mudanças da base por merge/rebase automático sem verificar se alteram o experimento e seus resultados.
