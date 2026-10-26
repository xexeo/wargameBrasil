# Verificação exaustiva de movimento

29 perfis nas duas escalas, 2349 origens e 190269 combinações origem/destino. 12064 passagens adjacentes; 2320 subidas de um nível; 58 subidas de dois ou mais níveis bloqueadas. 27456 verificações de PM parciais e 24128 entradas ocupadas testadas.

Todos os perfis conseguem entrar em qualquer vizinho livre de mesmo nível, descida ou subida de um nível com orçamento completo. Gastam o custo nominal ou todo o seu movimento máximo quando esse custo é maior. A redução não usa o saldo restante, evitando várias subidas gratuitas. Desníveis maiores mantêm custo integral. Rotas, custo cobrado, prévia e distâncias da IA foram comparados.

Em todos os 190269 pares de origem/destino também existe rota ao longo de vários turnos, ignorando ocupação e fogo. Não significa chegar a todos os lugares numa rodada. Falhas de movimento não gastam PM. Aliados e inimigos bloqueiam entrada. Os dados contêm uma matriz de custos por perfil/origem; o protocolo está copiado nesta pasta. Tempo da execução21.01s neste ambiente.
