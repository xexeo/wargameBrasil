# Monte Castelo Vibed — guia de regras e decisões

Referência vigente: **0.9.4 · 26/10/2026**. Regras preservadas da 0.9.3; preparação da 1.0 registrada no [plano de trabalho](docs/PLANO_1_0.md). Substitui as descrições conflitantes acumuladas nos protótipos 0.1.X. O histórico do Git preserva as versões anteriores. Toda mudança de regra deve atualizar motor, testes, regras da interface e este guia.

## Plataforma e identidade

HTML e TypeScript, somente no navegador, sem backend. `template.html` é o fonte; `index.html` e `jogo.html` são gerados, idênticos e autocontidos. Funcionam offline. Português é o padrão; inglês americano opcional, persistente e independente da partida. Meta de duração humana: 5–10 minutos, ainda sem medição com uma amostra de jogadores.

Copyright © 2026 Geraldo Xexéo. Criações originais sob CC BY-NC-SA 4.0; dados, imagens, fontes e marcas institucionais conservam seus avisos próprios em LICENSE e nos documentos de procedência. A homenagem identifica Pedro Henrique de Figueiredo Bonorino, tenente do **6º RI**, usa a fotografia enviada pelo autor e o distintivo da FEB. Não usa o emblema regimental atual. O logo do jogo é uma criação inspirada na cobra fumando, distinto da insígnia oficial.

## História, mapa e tempo

O cenário aborda o ataque final de 21/02/1945, com antecedentes na narrativa inicial e no popup História. Importância da conquista e hipótese de resistência alemã ficam no epílogo final. As sínteses apresentam chegada ao cume às 17h30; a reportagem brasileira baseada em Joel Silveira usa outros marcos até 17h50. Não há precisão cronológica única demonstrada pelos documentos originais consultados.

O relógio comprime 06h–18h em **dez rodadas de 72 minutos**. A rodada 10 começa às 16h48 e concede +1 ao ataque da artilharia FEB, inspirada na concentração de fogo da tarde. A série regional ERA5 é informativa, não medição no cume nem regra automática de lama/neve. [Tempo e limites](docs/TEMPO_21_FEVEREIRO_1945.md).

Tabuleiro axial **9 × 9**, seis vizinhos por hexágono, cerca de 180 m entre centros. Cume ancorado no ponto OSM de cota 977 m; amostra DEM próxima de 980 m. Altitudes Copernicus atuais: N1 <780 m; N2 780–849 m; N3 850–919 m; N4 ≥920 m. Curvas a cada 50 m são interpoladas. Vias, construções e matas OSM são modernas, não uma restituição de 1945. Posições militares são esquemáticas; objetivos secundários não recebem nomes históricos não comprovados. [Geografia](docs/GEOGRAFIA.md), [mapas oficiais](docs/MAPAS_OFICIAIS.md).

## Escolha de escala

Batalhão conserva dez peças, regras, atributos e modelos da 0.9.2. Companhia revisada usa nove companhias FEB, apoio e fogos (11), contra sete destacamentos alemães e fogos (8):19 peças. O desdobramento alemão é hipótese de cenário, não sete companhias históricas identificadas.

Cada companhia move e ataca independentemente. Não há limite por batalhão nem bloqueio das companhias irmãs. Reação ou reorganização compromete só a própria unidade. Movimento mínimo, mapa, prazo, objetivos e controles são compartilhados. Companhias FEB A 1/D2; destacamentos alemães A 2/D2; reserva A 1/D1; apoio A 2/D1; fogos A 3/D1. Na companhia, cada disparo causa no máximo1PV, inclusive apoio/artilharia. Batalhão mantém o máximo2. Três PV são coesão relativa, não efetivo igual entre escalas.

I aparece acima da companhia; A/I abaixo identifica companhia A do batalhão I. Letras A/B/C e posições são etiquetas/hipóteses. DEST não afirma escalão histórico confirmado. Salvos anteriores conservam suas peças e denominadores, recebem ações independentes e exibem aviso; Novo jogo é necessário para o desdobramento revisto. Modelos/experiência novos de companhia usam namespace próprio; os de batalhão são preservados. [Revisão](docs/REVISAO_COMPANHIAS_0_9_3.md).

## Tropas e símbolos — base batalhão

Cinco peças por lado. FEB: três batalhões do 1º RI Sampaio, apoio agregado e grupo de fogos. Alemanha: três destacamentos defensivos, uma reserva reduzida e fogos alocados da 232ª DI, **Heer**. Não há SS ou tropa de elite inventada. Não se conhecem os escalões e posições alemães locais com precisão. [Perfis completos](docs/TROPAS.md).

| Marca | Significado |
| --- | --- |
| FEB / DE | lado brasileiro / alemão, também distinguido por cor de peça e de texto |
| 3/3 e bolinhas | coesão atual/inicial; cada bolinha vale 1 PV, todas começam com 3 |
| Selo vermelho −1/−2, acima da peça | dano acumulado, separado do ID/escalão |
| Retângulo com X | infantaria, incluindo apoio de sua arma de origem |
| Retângulo com ponto | artilharia; ponto não é dano nem coesão |
| A / D / M | ataque nominal / defesa nominal / movimento restante |
| II / AP / DEST | batalhão ou grupo / apoio agregado / destacamento de cenário |
| T1 / T2 / T3 | reduzido / operacional / especializado em fogos; não soma bônus oculto |
| Traço diagonal | ataque normal já usado |
| S no círculo amarelo/âmbar | suprimida: sem fogo de oportunidade ou contra-ataque; não é dano nem bônus. Some no início do próximo turno próprio; reorganização/reação gasta pode continuar comprometendo a ação |
| Indicadores de reorganização/reação | ações seguintes comprometidas, conforme inspeção |
| Estrela vermelha no centro | objetivo; Monte Castelo vale 2, cada secundário 1 |
| Halo e contornos de movimento | seleção e destinos legais |
| Barra/contorno de ataque | inimigo que pode receber ataque da seleção |
| Borda tracejada de destino | risco de reação no percurso, não bloqueio ou dano garantido |
| Abrigos/trincheiras | posição preparada esquemática |
| Árvores, morros, vias, N e curvas | terreno e relevo; números em metros são aproximados |

**[Legenda completa de todos os símbolos](docs/SIMBOLOS.md)**, também ilustrada e aberta em Regras & símbolos. Inclui S, bolinhas de coesão, dano acumulado, escalões, identificações, estados, terrenos, munições, clima e controles.

Duplo clique/toque abre os atributos **atuais**, potência após dano, cobertura, fortificação, alcance e estado. Infantaria Sampaio: A 3/D3/M3/alcance 1. Apoio: A 3/D2/M2/alcance 2 indireto. FEB fogos: A 5/D1/M1/alcance 5. Granadeiros: A 3/D3/M2/alcance 1. Reserva: A 2/D2/M2/alcance 1. Fogos alemães: A 4/D1/M1/**alcance 6**. Alcances de apoio/artilharia representam disponibilidade tática, não alcance balístico literal.

## Turnos, movimento e terreno

Brasil age primeiro; Alemanha depois. Humanos e computadores obedecem ao mesmo motor. O humano escolhe uma peça e toca no destino ou inimigo: não precisa escolher modo de ação. Pode **mover, atirar e continuar movendo**, em qualquer ordem, com um ataque normal e o mesmo orçamento de PM. Encerrar turno fica na barra do mapa. Não há empilhamento ou passagem através de peças, mesmo aliadas.

| Condição | Custo nominal de entrada / efeito | Defesa |
| --- | --- | --- |
| Campo ou estrada | 1 PM | sem cobertura própria |
| Mata | 2 PM | +1 cobertura |
| Morro | 1 PM, mais eventual subida | +1 cobertura |
| Subir uma faixa N | **+2 PM por faixa**, além do terreno | conforme posição final |
| Descer | somente custo do destino | conforme posição final |
| Fortificação | custo normal do terreno | **+2 cobertura**, em vez da natural se maior |
| Defensor ≥30 m acima | sem custo separado | +1 adicional |
| Tiro direto ≥90 m acima do alvo | +1 hexágono de alcance, com linha de visão | não muda defesa |
| Tiro indireto | dispensa linha de visão direta; não ganha alcance por altura | cobertura continua valendo |
| Hexágono ocupado | bloqueado | — |

As coberturas naturais e preparadas **não somam**: usa-se a maior, depois se soma a vantagem de altura. Os abrigos estão em **hex 6–2 (Monte Castelo)** e **hex 4–4**, coordenadas de tela contadas a partir de 1; no motor são (5,1) e (3,3). Protegem qualquer lado que os ocupe, não aumentam D nominal da unidade.

O custo nominal de mata com subida de um nível é4PM. Pela correção 0.9.2, uma peça com movimento completo pode entrar em qualquer vizinho livre plano, descendo ou subindo um nível, pagando o menor entre custo nominal e seu máximo:3 PM para batalhão/companhia brasileira,2 para destacamento e1 para artilharia. Não se usa o saldo restante para reduzir custo: quem já gastou parte do movimento pode precisar esperar outro turno. Dois ou mais níveis de subida mantêm custo integral e podem ser impossíveis. Não se acumulam PM entre turnos.

A mesma regra vale em rotas, prévias, desconto real, IA e previsão. Também se aplica a partidas antigas sem a nova flag; apenas arquivos que desativem explicitamente `minimumStep` usam o bloqueio anterior. Ocupação, comando, supressão/reorganização e reação continuam limitando ações. A previsão ignora conflitos futuros de comando, peças e fogo futuro; não promete chegada segura. [Teste de todos os perfis e lugares](docs/MOVIMENTO_MINIMO.md).

## Ataque, reação e retirada

Tiro direto usa linha de visão com altitudes dos centros, observação a 2 m e copa de mata de 15 m como parâmetros de jogo; adjacentes têm visão. Peças intermediárias não bloqueiam. Indireto assume alvos conhecidos: não há névoa de guerra ou observador separado.

```text
potência = A + d6 − D − maior cobertura − vantagem de altura
           − 0,5 × PV perdidos pelo atacante + barragem
```

No batalhão, resultado ≥5 causa2 danos; ≥1 causa1; ≤0 falha. Na companhia revisada, resultado ≥1 causa apenas1 dano, nunca2. Falha adjacente pode provocar 1 dano de contra-ataque se o defensor não estiver suprimido nem tiver reagido. Perda do último PV remove a peça; isso representa neutralização, não todos os soldados mortos.

Ao mover por rota exposta, um defensor de tiro direto ≥30 m acima pode reagir primeiro. Há no máximo uma reação por movimento completo e uma do alvo antes de um assalto. Reação causa no máximo 1 dano e compromete movimento e ataque do próximo turno da peça que reagiu. **É automática para humanos e computadores de ambos os lados**; não há botão especial de contra-ataque. Ataques normais seguem as mesmas regras para os dois lados, exceto perfis e barragem FEB descritos.

Acerto de tiro indireto suprime a reação até o início do turno do defensor; não retira seu tiro normal. Infantaria que sobrevive caindo de 2/3 para 1 PV tenta recuar a um vizinho livre mais distante do atacante. Se não houver, fica. Não recupera PV e compromete a próxima ativação para reorganizar. Perda fatal não permite fuga.

## Vitória e resultado

Ao terminar cada turno alemão, infantaria brasileira de manobra ocupante recebe pontos: cume 2, dois secundários 1 cada. Máximo **4 por rodada**, acumulados até a meta de **8**, sem perda de pontos ao sair. Apoio e artilharia não asseguram objetivos.

- Cume +8 pontos: vitória brasileira antecipada.
- Cume assegurado no fechamento da rodada 10: vitória brasileira mesmo sem a meta; nesse caso é custosa, eficiência limitada a 44.
- Eliminar todas as peças adversárias: vitória imediata de qualquer lado, sem exigir pontos ou ocupação.
- Perder toda a infantaria brasileira de manobra: derrota da missão, mesmo restando fogos.
- Demais casos ao prazo: vitória defensiva.

Se não restarem defensores alemães e a FEB vencer por neutralização, Monte Castelo é considerado assegurado: não há cobrança de deslocar uma peça ao cume ou completar pontos. Essa explicação não teletransporta unidades nem altera a pontuação acumulada. Nos demais resultados, informa-se a ocupação no encerramento. Grau considera tempo, peças e coesão perdidas; vencedor não muda com o grau. Mostra perdas de jogo e recuos, sem comparação numérica com baixas humanas históricas não confirmadas. O último efeito termina antes de abrir o epílogo.

## IAs e persistência

Caçador prioriza maior ataque e proximidade; Oportunista menor defesa e proximidade. Postura agressiva aproxima; defensiva valoriza proteção. Estado-maior usa missão, custo real de rota, ameaças e apoio. A defesa tática guarda o cume nas duas posturas, intercepta infantaria e faz contrabateria quando não há ameaça imediata ao cume. Busca curta, sem servidor.

Aprendiz simples e Veterana aprendem políticas online e conservam experiência no armazenamento local. Veterana recebe pré-treino reproduzível. **Aprendiz fixo** usa uma tabela independente por lado e escala, 2.400 partidas cada, pesos congelados, exploração zero no jogo. Aprende seleção de seis políticas, não caminhos individuais. [Método e limites](docs/IA_POR_LADO.md). Limpar dados do navegador apaga experiência local; falha de armazenamento não impede jogar.

Modos: humano FEB × computador alemão; computador FEB × humano alemão; humanos locais; humanos remotos por arquivo/link enviado pelo WhatsApp. Não há sincronização em tempo real. Partida e progresso do turno computacional têm pontos de retomada. Aparência e idioma ficam separados das memórias de IA.

## Aparência, som e acessibilidade

Fundo branco, três presets A/B/C; A azul/carvão recomendado. **47 cores**, fontes, dimensões, linhas e opacidades configuráveis em Aparência, com importação/exportação e restauração. Letras/símbolos FEB e DE têm tokens separados. Nomes, formas e símbolos complementam a cor. Terreno de inverno é opção visual, não regra. Menu compacto no desktop e hambúrguer no celular.

Zoom contínuo, Mapa inteiro, Visão tática e duplo toque. Todos os popups terminam com **Fechar / Close**. Animações opcionais: balas em rajada, granadas de morteiro com aletas e obuses com cinta de forçamento. Trajetórias e rajadas variam sem consumir dados do combate; não há seta de ataque. Desativar/reduzir movimento mantém impacto estático e anúncio. Som sintetizado original é independente, desligado inicialmente, com volume. Não são gravações históricas. [Sons](docs/SONS.md), [paletas](docs/PALETAS_UX.md).

## Versão, validação e limites

Trabalho publicado na **main**, com duas escalas do mesmo jogo. A proposta anterior permanece registrada em `experimento/escala-companhia`; a opção companhia integrada está na mesma main. A entrega0.9.0 iniciou a série0.9.X; a integração das duas escalas é0.9.1 e a correção de movimento,0.9.2. Hook `.githooks/pre-commit` atualiza versão/data/hora de Brasília e executa testes; não ignorar.

Motor, IA e treinamento funcionam sem interface. Dados e análises em [simulacoes](docs/simulacoes/README.md), com sementes, protocolos e hashes; mudanças incompatíveis removem os arquivos atuais, mantendo o histórico no Git. Resultados de treino não são avaliação independente. Equilíbrio de portfólio não prova 50/50 de cada política nem dificuldade humana.

[Defesa e equilíbrio 0.9](docs/DEFESA_E_EQUILIBRIO_0_9.md) registra fontes, decisões e medições. Permanecem limites: posições e efetivos locais, mapas integrais de Mascarenhas, boletim meteorológico contemporâneo e duração humana medida. Não alterar fatos, relevo ou identidades para calibrar uma taxa.
