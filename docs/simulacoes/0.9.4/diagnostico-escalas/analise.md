# Diagnóstico de ações e fogo nas duas escalas

Referência sem mudança de regras. Seis políticas iguais para ambos os lados, 20 sementes por perfil; modelos fixos próprios de cada lado em pelo menos 100 confrontos por escala. Sementes começam em 7200001. Um perfil não equivale a um jogador humano. Os perfis não recebem pesos para produzir uma taxa agregada conveniente.

| Escala | Política dos dois lados | Jogos | Vitórias FEB | Fim por eliminação | Rodada média | Disparos normais/jogo | Fogo defensivo/jogo | Máximo de tiros num alvo/turno | Tiro direto contra suprimido |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Batalhão | strong/aggressive | 20 | 90.0% | 90.0% | 5.25 | 17.1 | 1.9 | 2 | 28.0% |
| Batalhão | strong/defensive | 20 | 5.0% | 40.0% | 6.75 | 18.7 | 2.3 | 3 | 33.8% |
| Batalhão | weak/aggressive | 20 | 90.0% | 100.0% | 6.75 | 19.4 | 2.8 | 3 | 19.6% |
| Batalhão | weak/defensive | 20 | 5.0% | 90.0% | 7.25 | 18.8 | 3.0 | 4 | 19.0% |
| Batalhão | tactical/aggressive | 20 | 80.0% | 80.0% | 6.35 | 20.3 | 1.6 | 3 | 30.8% |
| Batalhão | tactical/defensive | 20 | 80.0% | 80.0% | 6.65 | 21.3 | 1.9 | 3 | 21.9% |
| Batalhão | fixed | 100 | 69.0% | 94.0% | 5.92 | 19.9 | 3.1 | 4 | 25.4% |
| Companhia | strong/aggressive | 20 | 65.0% | 75.0% | 9.15 | 47.7 | 14.1 | 3 | 12.8% |
| Companhia | strong/defensive | 20 | 55.0% | 50.0% | 9.40 | 43.2 | 8.3 | 4 | 19.5% |
| Companhia | weak/aggressive | 20 | 35.0% | 80.0% | 8.25 | 47.9 | 11.4 | 5 | 17.5% |
| Companhia | weak/defensive | 20 | 30.0% | 30.0% | 9.70 | 46.9 | 11.7 | 4 | 18.8% |
| Companhia | tactical/aggressive | 20 | 80.0% | 60.0% | 8.80 | 50.6 | 8.6 | 5 | 22.0% |
| Companhia | tactical/defensive | 20 | 65.0% | 60.0% | 9.20 | 54.2 | 6.7 | 5 | 21.8% |
| Companhia | fixed | 100 | 67.0% | 65.0% | 8.73 | 50.7 | 7.9 | 5 | 24.3% |

## Definições e limites

- Disparos vêm dos eventos reais do motor, incluindo reações durante movimento. Ativações ou tentativas interrompidas não são disparos. Contra-ataques estão separados nos dados.
- Concentração conta tiros normais contra o mesmo ID em um turno de um lado, mesmo se o alvo recuou. É o máximo observado, não uma média.
- Suprimido é o estado do alvo no evento de tiro direto, antes da retirada posterior. Não distingue supressão por apoio de supressão por reorganização; não demonstra causalmente o benefício do apoio.
- Congestionamento conta peças com PM no início do turno sem destino legal ocupado, mas com destino ao remover as outras peças. Não é análise de todo bloqueio de rota ao longo do turno.
- Função: artilharia pelo tipo; apoio pela propriedade de tiro indireto; demais infantaria. Coesão perdida efetiva exclui dano excedente ao PV restante; não equivale a baixas humanas.
- Movimentos tentados são intenções retornadas pela IA; podem ser interrompidos por reação. Não se confundem com hexágonos efetivamente percorridos.
- Políticas fixas dos seis perfis são comparadas ao simulador canônico na primeira semente de cada escala, verificando vencedor, rodada, pontuação e contagens. Os modelos FX escolhem políticas por lado/estado e não aprendem nesta medição.
- Somente IA contra IA. Minutos humanos não foram medidos. Estas sementes são de diagnóstico e ficam excluídas da avaliação final reservada.

## Arquivos

[dados-brutos.json](dados-brutos.json): eventos, turnos, condições finais e sementes. [resumo.json](resumo.json): indicadores por perfil e função. [protocolo.mjs](protocolo.mjs): cópia da instrumentação utilizada; executar o original na raiz do projeto. O manifesto contém hashes do núcleo; os dados também contêm SHA-256 do protocolo.
