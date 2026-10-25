# Tempo no ataque final a Monte Castelo

Pesquisa ampliada em 25/10/2026. Esta nota distingue relatos históricos, reconstrução regional e observação meteorológica local.

## Resultado principal

A reanálise **ECMWF ERA5**, obtida pelo **Open-Meteo Historical Weather API**, sugere frio intenso e nebulosidade elevada de madrugada, abertura pela manhã e céu aberto à tarde em 21/02/1945, na região do monte. O modelo não registra precipitação ou neve nova naquele dia. **Isso não comprova ausência de neve acumulada no solo.** A consulta de profundidade de neve retornou valores nulos, e não zero.

| Hora local, UTC+1 | Temperatura modelada | Nebulosidade modelada | Precipitação modelada |
| --- | --- | --- | --- |
| 06:00 | −8,3 °C | 94% | 0 mm |
| 09:00 | −4,8 °C | 47% | 0 mm |
| 12:00 | −0,5 °C | 0% | 0 mm |
| 16:00 | −0,4 °C | 0% | 0 mm |
| 18:00 | −5,4 °C | 0% | 0 mm |

Nascer e pôr do sol calculados: 07:05 e 17:53, sem horizonte montanhoso. O vento modelado chega a 9,3 km/h às 14–15h. Os valores decimais são a saída do modelo, não precisão de uma medição no cume.

## Método e limites

- Coordenadas solicitadas: 44,221799°N / 10,954227°E.
- Coordenadas retornadas pela API: 44,25°N / 11,00°E; elevação informada: 954 m.
- Modelo solicitado explicitamente: `era5`; fuso `Europe/Rome`, com UTC+1 nessa data.
- Resolução documentada do ERA5: 0,25°, aproximadamente 25 km, com série retrospectiva desde 1940.
- A célula regional não resolve encostas, orientação dos vales, horizonte local, nevoeiro pontual ou condições dentro de uma posição fortificada.
- Nebulosidade não é sinônimo de nevoeiro. Ausência de precipitação num dia não comprova solo seco ou trânsito livre em todos os caminhos.
- Não interpretar a série como um boletim instrumental de uma estação em Monte Castelo. A incerteza histórica aumenta ao retroceder para períodos com rede de observações mais limitada.

A resposta completa, seus campos nulos, unidades, metadados e URL exata da consulta foram preservados em [weather-era5-1945-02-21.json](weather-era5-1945-02-21.json). O jogo incorpora os valores em `weather.ts`, sem chamadas externas durante a partida.

Documentação: [Open-Meteo Historical Weather API](https://open-meteo.com/en/docs/historical-weather-api). Atribuição dos dados: Open-Meteo / ECMWF ERA5; consultar as condições de uso e atribuição do provedor para reutilização independente. Dados de terceiros não são apresentados como produção original do autor do jogo.

## Relatos históricos comparados

1. **Blog do Exército Brasileiro**, “A importância atemporal da conquista de Monte Castelo para o Exército Brasileiro”, indexado com data de 20/02/2026: o resultado de busca associa o alvorecer de 21 de fevereiro a um dia ensolarado. [Endereço do artigo](https://eblog.eb.mil.br/en/w/a-import%C3%A2ncia-atemporal-da-conquista-de-monte-castelo-para-o-ex%C3%A9rcito-brasileiro). **Limite:** a página integral respondeu HTTP 503; foi consultado apenas o trecho indexado, que não substitui o artigo completo nem um boletim meteorológico. A abertura do tempo sugerida pela reanálise é compatível com a descrição geral de dia ensolarado, sem provar que todo o amanhecer esteve sem nuvens.
2. **André Bernardo, BBC News Brasil**, 20/02/2025, [“Monte Castelo, 80 anos: ‘O diabo é testemunha de que não foi um passeio’”](https://www.bbc.com/portuguese/articles/c3d8v1jmyryo): texto integral consultado. Descreve frio, chuva e nevoeiro no contexto da campanha e cita Joel Silveira e historiadores. A menção a episódios de −20 °C não pode ser transferida automaticamente para 21/02.
3. **Aventuras na História**, artigo atualizado em 22/02/2025, [“Batalha de Monte Castelo: Os 80 anos da maior vitória da FEB”](https://aventurasnahistoria.com.br/noticias/reportagem/historia-a-segunda-guerra-batalha-de-monte-castelo-maior-vitoria-da-feb.phtml): texto integral consultado. Situa problemas de nevoeiro nas tentativas anteriores e menciona o degelo no início de fevereiro; isso não quantifica neve, lama ou temperatura no cume no dia 21.
4. Foi localizado um resultado de **Defesa Aérea & Naval** que descreve tarde cinzenta e tempestades de neve. A página integral retornou 403. Não foi possível conferir sua base documental; a descrição não foi adotada como fato diário nem usada para contrariar silenciosamente outras fontes.

## Divergência adicional de horários

A BBC, reproduzindo o relato de Joel Silveira, situa uma concentração de fogo às **16:20**, a declaração de conquista praticamente concluída às **17:45** e uma comunicação do cume às **17:50**. As sínteses da Wikipédia consultadas antes apresentam **17:30** como chegada ao topo. Podem se referir a marcos diferentes, mas não foi possível demonstrar isso com os documentos originais. O jogo mantém a janela de ação 06:00–18:00 e o bônus de artilharia na rodada iniciada às 16:48; não transforma um desses horários numa precisão única incontestável.

## Uso no jogo

- Mostrar estimativas regionais de temperatura e nuvens para a hora inteira anterior ao início de cada rodada.
- Disponibilizar um popup com a tabela, fontes, escala e limites.
- Conservar o fundo branco e a legibilidade; não escurecer o tabuleiro como efeito noturno.
- Não criar penalidades automáticas de lama, neve, movimento ou observação sem regra explicitamente definida e fundamentação adicional. Frio e nebulosidade informam o cenário, sem prometer uma simulação meteorológica fina.
- Manter pendente a localização de diário de operações ou boletim instrumental contemporâneo que permita refinar a reconstituição.
