# Movimento mínimo e verificação de todos os lugares —0.9.2

O autor identificou que algumas peças não conseguiam subir. A causa foi confirmada: com custo nominal de terreno +2 PM por faixa de altitude, uma subida em campo custava3PM e em mata4PM. Destacamentos com 2 PM e artilharia com 1 PM não conseguiam executar esses passos; a infantaria de 3 PM também não subia em mata. O bloqueio estava em prévia, execução e planejamento, não somente no desenho.

## Regra corrigida

Para um vizinho livre, no mesmo nível, descendo ou subindo **um** nível, o custo efetivo é o menor entre o custo nominal e o **máximo** de movimento da peça. Isso garante pelo menos um passo com seu orçamento completo. A mesma exceção cobre terreno plano/descida para não permitir subir uma mata e depois ficar preso numa mata plana.

Exemplo: mata subindo tem custo nominal4; infantaria brasileira de 3 PM paga3, destacamento de 2 paga2 e artilharia de 1 paga1. Quem já gastou PM não pode reduzir o próximo passo até o seu saldo: deve ter pontos para pagar o custo calculado pelo máximo. O custo nominal de dois ou mais níveis de subida não é reduzido e pode impedir a entrada.

A exceção não permite atravessar peças nem ignorar o comando. Não restaura PM, não cancela reações e não remove reorganização. Um caminho disponível sem inimigos pode estar bloqueado numa partida real. Artilharia continua sendo fogos alocados: o contador não significa içar fisicamente toda a artilharia divisional para um hexágono. Trata-se da abstração de mobilidade pedida pelo autor.

A correção vale nas duas escalas e para partidas antigas sem a nova flag. `minimumStep:false` é uma desativação explícita em arquivo de regras, não o padrão da interface.

## Compartilhamento

`unitMovementCost` centraliza o custo efetivo. `reachable`, execução por hexágono e orçamento de PM usam a mesma função. Distâncias da IA e previsão recebem a mesma exceção e o mesmo máximo de movimento. O máximo da peça é separado do saldo atual. O mapa e as altitudes foram preservados.

## Testes exaustivos

`scripts/verify-movement.mjs` enumera os26 perfis existentes:10 de batalhão e16 de companhia. Para cada perfil, testa as81 posições iniciais e todos os81 destinos. Compara o motor com uma enumeração independente de caminhos limitada pelo orçamento e executa os movimentos, não apenas o cálculo nominal.

- 170.586 combinações de origem/destino;
- 10.816 passagens adjacentes, incluindo2.080 subidas de um nível e52 subidas maiores bloqueadas;
- 24.960 verificações de orçamentos parciais;
- 21.632 tentativas de entrada ocupada por aliado/inimigo;
- 170.586 pares com verificação de alcance ao longo de vários turnos, sem ocupação ou fogo: todos têm rota.

Os testes conferem prévia, percurso, custo cobrado, PM restantes, falhas sem gasto e distância usada pela IA. A matriz de dados registra custos por perfil/origem e o protocolo é copiado no diretório de resultados. O teste automatizado executa a mesma verificação na suíte; há também casos de navegador para artilharia brasileira/alemã em ambas as escalas, inclusive retomando arquivo antigo sem a flag.

[Dados e análise válidos](simulacoes/README.md). Não confundir poder alcançar o mapa ao longo de turnos com alcançar qualquer lugar num único turno, nem com atravessar posições inimigas sob fogo.

## Efeito nas análises

A mudança altera trajetos, exposição e escolhas de IA. Resultados e modelos anteriores foram invalidados pelo manifesto de hashes. Uma nova passagem de treinamento e avaliação é necessária para apresentar números da regra final. Não se afirmou equivalência da 0.9.2 com o movimento da 0.9.0; a comparação histórica pode desativar a exceção explicitamente como controle.
