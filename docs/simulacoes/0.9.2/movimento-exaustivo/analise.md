# Verificação exaustiva de movimento

26 perfis nas duas escalas, 2106 origens e 170586 combinações origem/destino. 10816 passagens adjacentes; 2080 subidas de um nível; 52 subidas de dois ou mais níveis bloqueadas. 24960 verificações de PM parciais e 21632 entradas ocupadas testadas.

Todos os perfis conseguem entrar em qualquer vizinho livre de mesmo nível, descida ou subida de um nível com orçamento completo. Gastam o custo nominal ou todo o seu movimento máximo quando esse custo é maior. A redução não usa o saldo restante, evitando várias subidas gratuitas. Desníveis maiores mantêm custo integral. Rotas, custo cobrado, prévia e distâncias da IA foram comparados.

Em todos os 170586 pares de origem/destino também existe rota ao longo de vários turnos, ignorando ocupação e fogo. Não significa chegar a todos os lugares numa rodada. Falhas de movimento não gastam PM. Aliados e inimigos bloqueiam entrada. Os dados contêm uma matriz de custos por perfil/origem; o protocolo está copiado nesta pasta. Tempo da execução7.25s neste ambiente.
