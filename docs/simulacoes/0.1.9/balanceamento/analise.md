# Calibração 0.1.9

Objetivo: aproximadamente 50% com a mesma IA nos dois lados, sem alterar relevo, identidade das formações ou fatos documentados.

## Regras finais

- 9 × 9 hexágonos, 81 amostras Copernicus DEM, posições de cenário em troops.ts.
- Meta 8 pontos acumulados e cume assegurado ao fim do turno alemão. Máximo 4 por rodada; apenas infantaria de manobra captura.
- Prazo 10 rodadas. Tempo e perdas graduam a vitória.
- Defesa elevada +1 com 30 m. Alcance direto +1 com 90 m e linha de visão.
- Reação de subida/assalto primeiro, máximo 1 dano, uma reação por movimento completo; gasta o próximo turno da unidade. Sem somar contra-ataque automático depois da reação.
- Acerto indireto suprime reação. Apoio regimental alcance 2; grupos de ambos os lados alcance 5.
- Mesmos custos, dados e regras de reação para os dois lados. Atributos táticos não são avaliações históricas de comandantes.

## Experimentos

Tentativas intermediárias incompatíveis foram removidas. O histórico do Git preserva as decisões.

`calibracao-resumo.json`: comparação com reação limitada a 1 dano, meta 8 e cume obrigatório; 250 sementes de referência por opção, mesmos perfis, variando alcance de ambos os grupos e do apoio. Reproduzir com `npm run build && node scripts/calibrate-artillery.mjs`. Alcance 5 e apoio 2 produziram 53,2% FEB na amostra de seleção. Alcance 8/12 favoreceu excessivamente a FEB. Esses alcances representam apoio alocado no jogo, não alcance balístico real.

## Validação final

- `node scripts/autoplay.mjs --games 500 --seed 1 --name referencia`: 269 FEB / 231 DE.
- `node scripts/autoplay.mjs --games 500 --seed 10001 --name validacao`: 242 FEB / 258 DE.
- Total: **511/1000 FEB (51,1%)**, 489/1000 DE (48,9%). A média de duração foi 6,36 rodadas; tempo humano de 5–10 minutos ainda precisa de jogadores reais.
- Todas as 511 vitórias brasileiras cumpriram ocupação do cume e meta. Nenhuma vitória brasileira por simples eliminação. Predomina a derrota FEB pela perda de infantaria de manobra.

As sementes de validação não foram usadas para escolher parâmetros. Intervalos de incerteza por conjunto estão nos JSONs. Autojogo não garante equilíbrio com qualquer política ou contra humanos. A IA especial tem avaliação própria; resultados não devem ser misturados com o algoritmo tático fixo.

## Limites de fidelidade

O cume agora é indispensável, ao contrário dos protótipos vencidos por eliminação. Isso aproxima o objetivo do fato histórico, mas não reconstrói a retirada alemã descrita por Fisher p. 431. A presença e permanência de todos os destacamentos de cenário continuam abstrações. Não há equivalência entre PV perdidos e mortes reais.

Os experimentos anteriores guardaram apenas agregados. Eles estão nesta pasta como resumos; não equivalem a dados individuais por partida. Novas execuções passam a salvar ambos automaticamente.
