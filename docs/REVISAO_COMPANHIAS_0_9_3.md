# Revisão restrita à escala companhia — 0.9.3

Pedidos: companhias independentes, potência coerente com o escalão, defesa alemã também desdobrada e todos os símbolos documentados. Batalhão está funcionando: conservar regras, atributos e modelos distribuídos dessa opção; comparar contra a 0.9.2 antes de publicar.

Candidato único: nove companhias FEB, apoio e fogos (11 peças); três núcleos alemães desdobrados em dois destacamentos cada, reserva e fogos (8 peças,19 ao todo). Os sete destacamentos alemães são hipóteses de distribuição de cenário, não sete companhias históricas confirmadas. Não se inventam números de regimentos ou efetivos. Reutilizar terreno e posições elevadas; núcleos adicionais ficam próximos dos antigos, sem novos objetivos.

Cada unidade recebe movimento e ataque próprios; remove-se o bloqueio entre companhias e a dívida de reação por batalhão. Uma unidade que reage ou reorganiza ainda compromete a própria ação, como no motor compartilhado. Companhias FEB A 1/D2, destacamentos alemães A 2/D2 (fator anterior preservado), reserva alemã A 1/D1; apoio A 2/D1; fogos A 3/D1. Na escala companhia, cada disparo causa no máximo1PV, inclusive apoio, contra 2 PV possíveis no batalhão. Três PV representam coesão relativa, não efetivo igual entre escalas. A diferença deixa de ser somente baixar A e D juntos.

Salvar a revisão da composição no cenário: partidas de companhia anteriores conservam suas peças e denominadores, mas recebem ações independentes; informar que Novo jogo é necessário para o novo desdobramento. Experiência e modelos novos de companhia têm namespace próprio; não alterar nem treinar novamente os de batalhão. Um ciclo de treinamento e avaliação somente de companhia, sem sucessivos ajustes para obter50%.

Legenda: S em círculo âmbar = supressão (também aplicada na retirada/reorganização), sem reação/contra-ataque; não é dano. Explicar duração, diferenças entre bolinhas de PV, selo de dano e impacto. Cobrir escalãoI/II, identificação A/I, estados escritos, terreno, ações, munições, clima, zoom e menu. I de companhia passa acima do contador; preservar desenho dos batalhões. Regras PT/EN e guia devem concordar com os estados realmente implementados.

## Entrega e verificação

Regressão:120 partidas de batalhão comparadas com a 0.9.2, incluindo todos os estados intermediários, com igualdade completa. Os arquivos fixed-models.ts e pretrained.ts permanecem iguais byte a byte. Não houve treinamento de batalhão.

Companhia: uma passagem de 2.400 jogos por modelo fixo e2.000 da Veterana, seguida por 1.300 jogos de avaliação independente e matriz 9×9 com 10 jogos por dupla. Há vantagem de certas políticas e dos modelos na amostra; não se declara equilíbrio perfeito. Dados em [simulações](simulacoes/README.md). A fila visual longa de fim de partida de companhia preserva o impacto em curso e os dois últimos antes do resultado; o histórico mantém todos os disparos. O modo batalhão não usa esse ajuste de apresentação.

Símbolos e regras foram conferidos em PT/EN. A legenda fica aberta; o círculo S tem descrição acessível e tooltip. I de companhia aparece acima, respeitando a escala visual. Batalhão mantém seu desenho e suas regras. Salvos antigos de companhia exibem aviso para iniciar Novo jogo quando se desejar a nova composição.
