# Revisão documental — 0.9.0

Revisão de 26/10/2026, depois das alterações de código. Escopo: README, guia, todos os documentos Markdown de primeiro nível em `docs/`, índice e análises de simulações; HTML/Markdown de UX são regenerados da fonte única. Imagens e respostas originais de acervos/DEM/OSM/ERA5 permanecem registros de procedência, sem reescrever evidência para combinar com o cenário.

| Conjunto | Conferência e resultado |
| --- | --- |
| README e GUIA_DO_JOGO | Guia reescrito como referência vigente; corrigidos ordem livre de ação, perfis, alcance, cobertura, subida, vitória, modo computador FEB/humanos e versionamento. Retiradas contagens antigas de testes e taxas incompatíveis. |
| TROPAS e IA_POR_LADO | Alcance6 alemão, atributos restantes preservados, dois aprendizes independentes, treino/avaliação separados e rotas por mobilidade. T1–T3 não são bônus ocultos nem notas históricas. |
| DEFESA_E_EQUILIBRIO e PLANO_0_9 | Fontes lidas, parâmetros revisáveis, seleção de candidatos, resultados e limites de inferência. Prazo/mapa não foram encurtados para calibrar taxas. |
| REVISAO_BATALHOES e PLANO_PROXIMA_VERSAO | Marcados como registros de etapas anteriores; não são instruções vigentes em conflito com o guia. Dados antigos só no histórico do Git. |
| HISTORIA, MAPAS_OFICIAIS, ESCALA_DAS_PECAS | Distinção entre participação, organização e posição de cenário; Heer/232ª DI, sem SS; companhia continua proposta separada. Consulta integral de Mascarenhas não foi alegada. |
| GEOGRAFIA e TEMPO_21_FEVEREIRO_1945 | DEM/OSM modernos e ERA5 regional mantêm limites e atribuições. Subida vigente corrigida; nuvens não equivalem a nevoeiro, neve sem dados não é zero. |
| PESQUISA_ACERVOS_NARRATIVA | Datas/fotografias e bibliografia mantidas com limites; anotada a posterior calibração de regras, sem converter pesquisa parcial em leitura integral. |
| PESQUISA_MASCARENHAS_BAIXAS | Tabela identificada como pesquisa fora da interface; pessoas não são PV, escopos mensal/campanha não são baixas do ataque final. |
| TRIBUTO_FONTES e INTERNACIONALIZACAO | Corrigidas frases que ainda diziam usar o emblema regimental moderno. Homenagem atual: fotografia do autor,6º RI e distintivo FEB. PT padrão e EN-US preservados. |
| PALETAS_UX e SONS | Auditoria inicial separada da aparência vigente;47 cores, letras FEB/DE independentes, presets, inverno opcional, munições animadas sem seta e som sintetizado. |
| IMAGEM_ROTEIRO_FEB | Mantida decisão de somente link externo e procedência; ausência de licença localizada não virou autorização de reprodução. |
| Simulações | Novos modelos/avaliações/matriz/estudo com sementes e hashes; pastas incompatíveis removidas, Git preserva anteriores. Protocolos distinguem treino, avaliação e exploração. |

A conferência local de links Markdown verifica a existência de destinos relativos. Links externos mantêm as datas e condições de acesso das pesquisas registradas; não se afirma nova disponibilidade de todos os acervos.

A suíte cobre regras, importação/retomada, aparência, idioma, som, animação, fim de partida, fluxo completo desktop/celular e HTML autocontido. As contagens finais da entrega são registradas abaixo após a execução completa. Testes de software não comprovam fidelidade histórica nem duração humana.

Publicação: workflow passa a incluir também `jogo.html` como arquivo baixável, além do mesmo conteúdo em `index.html`. Links relativos dos documentos foram conferidos sem destinos ausentes. Nenhuma licença de terceiros foi convertida à licença geral por esta revisão.

Suíte desta entrega: **72 testes sem interface** e **116 casos de navegador**, distribuídos entre desktop e celular. O hook de commit exige a aprovação de ambos antes de registrar a versão. Inclui teste de variação de trajetória e espera pelo último impacto, além do fluxo de partida completa. Treino distribuído:2.000 episódios online e2.400 para cada lado fixo; avaliação independente:1.300 partidas; matriz:810; estudo comparativo final:5.400. Esses conjuntos têm finalidades e sementes próprias e não devem ser somados como uma taxa única.
