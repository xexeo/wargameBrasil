# Plano histórico — consolidação após 0.1.20

Executado na 0.1.21; substituído como plano ativo pelo [plano0.9](PLANO_0_9.md). Dados da 0.1.20 citados abaixo são registro daquela etapa; arquivos incompatíveis foram retirados, permanecendo no histórico do Git.

Registro de 25/10/2026, horário de Brasília. Versão 0.1.20 publicada e verificada no commit89e2324, com 134 testes. Este plano consolida os pedidos mais recentes e registra decisões revisáveis.

## Entrega a implementar

1. Popup Aparência, português padrão e inglês americano opcional. Três presets A (azul/papel), B (petróleo/pedra) e C (violeta/areia), conforme a comparação publicada. A é o padrão recomendado. Cores semânticas e parâmetros visuais podem ser ajustados individualmente e persistem no navegador. Fontes disponíveis offline, tamanhos de textos e símbolos, espessuras e opacidades terão controles próprios. Regras, movimento e atributos de combate não fazem parte desse popup.
2. Centralizar os valores visuais em variáveis compartilhadas por página, mapa SVG, exemplos das peças, efeitos e popups. Mudanças de aparência não reiniciam partida, zoom ou aprendizado. Validar valores armazenados, oferecer restauração dos presets e manter o fundo branco por padrão.
3. Incluir a proposta opcional de terreno de inverno: cores menos douradas, vegetação dessaturada, terra e pedra em neutros. Neve e lama não serão distribuídas como fatos locais sem fonte. A aparência não cria penalidades de movimento nem altera alturas.
4. Ampliar a história com antecedentes, inverno e tentativas anteriores, preparação da ofensiva coordenada e sequência do dia 21. Usar textos brasileiros e buscar nos acervos Arquivo Nacional/FGV e memórias militares, identificando o que foi efetivamente lido. Produzir conteúdo equivalente em inglês americano.
5. Conferir as referências fornecidas pelo autor (Costa, Maximiano, Mascarenhas e Joel Silveira), incluindo título/edição quando houver catálogo acessível. Bibliografia sugerida não equivale a livro integral consultado. Não inventar páginas, citações ou análise de fotografias sem identificar as imagens.
6. Publicar na main uma nova versão 0.1.X com README/guia atualizados, HTMLs autocontidos iguais, testes adequados e verificação do Pages.

## Conquistas da 0.1.20 a preservar

Foto JPEG enviada depois pelo usuário, sem tratamento adicional; homenagem ao tenente do 6ºRI; sinais de ataque, reação ao mover e contra-ataque; popup com dano e estado atuais; estrelas vermelhas pequenas no centro dos hexágonos; comparação histórica de baixas removida, preservando perdas da partida; dois aprendizes fixos independentes e opções de aprendizado online; interfaces emPT eEN.

## Dados, arquitetura e limites

As4.800 partidas de treino e2.110 de avaliação/matriz da 0.1.20 estão arquivadas com sementes e hashes. O balanço continua favorável àFEB; não declarar50/50. Alterações de interface não invalidam simulações sem interface: o aprendizado simples está agora no módulo compartilhado simple-learning.ts. Mudanças no motor/IA/protocolo continuam invalidando os dados automaticamente.

A descrição enviada pelo usuário sobre lama, minas, uniformes e fotografias é uma pista de pesquisa. Sua distribuição exata e as datas fotográficas ainda exigem documentos identificáveis. Não importar para 21/02 condições de dezembro/janeiro, não criar posições de minas nem afirmar emprego local de armamento sem fonte.

## Verificação prevista

Presets e ajustes individuais, persistência/reabertura, valores inválidos, troca de idioma, leitura de todos os popups e preservação da partida/memórias; controles móveis e desktop; cobertura de tokens visuais e contraste dos presets; suíte de regras/IA e fluxo de jogo existente; Pages com versão e recursos públicos corretos.

## Entrega consolidada — v0.1.21

Implementados presets e personalização, cores semânticas CSS/SVG, importação/exportação, persistência e validação, animações opcionais por tipo de arma, narrativa brasileira ampliada e epílogos por vencedor. Também entraram os pedidos posteriores: legenda de todos os símbolos, dano acima das peças, Fechar/Close em todos os popups, correção da mensagem sobre ocupação do cume e ajuste do Mapa inteiro. Fontes, limites dos acervos e bibliografia conferida estão em PESQUISA_ACERVOS_NARRATIVA.md.

Decisões que o autor pode mudar: presetA como padrão, materiais de inverno opcionais, duração padrão650ms, faixa de personalização dos tamanhos e ausência de neve/minas/penalidades locais não documentadas. Fatos históricos não foram alterados para obter50/50. A pesquisa documental integral deMascarenhas e a calibração do equilíbrio permanecem pendentes.

Pedidos finais incorporados: sons opcionais e volume, pesquisa de bibliotecas/condições de uso em SONS.md, e tabela de efeitos de terreno nas regras.
