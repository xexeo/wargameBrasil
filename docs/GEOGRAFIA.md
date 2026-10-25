# Base geográfica de Monte Castelo Vibed

Atualização de 25/10/2026: o tabuleiro deixou de usar apenas faixas inventadas por linha. Agora cada hexágono corresponde a uma posição geográfica e a uma amostra de elevação.

## Cume e escala

- Âncora do objetivo Monte Castelo: **44,2206238°N, 10,9537700°E**.
- Fonte: [nó OpenStreetMap 5245929042](https://www.openstreetmap.org/node/5245929042), identificado como `natural=peak`, nome Monte Castello, cota registrada **977 m**.
- A amostra Copernicus no centro desse hexágono retorna **980 m**. Essa diferença é compatível com a resolução e generalização; não substituímos a cota nominal por uma alegação de medição exata.
- Projeção local aproximada com norte para cima, em WGS84: 2,8 metros por unidade SVG. Centros de hexágonos vizinhos ficam a aproximadamente **180 m**.
- A coordenada usada anteriormente para o contexto da batalha, 44,221799°N / 10,954227°E, fica próxima, mas a nova âncora usa o ponto explicitamente identificado como cume. A reanálise meteorológica regional anterior continua pertinente à região, sem precisão de encosta.

## Elevação

Fonte: **Copernicus DEM 2021 GLO-90**, resolução de aproximadamente 90 m, obtido pela [API de elevação do Open-Meteo](https://open-meteo.com/en/docs/elevation-api). Foram consultados os 72 centros dos hexágonos. As amostras vão de **713 a 980 m**.

Conversão deliberadamente simples para as regras:

| Nível | Faixa de altitude DEM | Uso no jogo |
| --- | --- | --- |
| N1 | abaixo de 780 m | terrenos mais baixos |
| N2 | 780–849 m | encostas inferiores |
| N3 | 850–919 m | encostas/cristas intermediárias |
| N4 | a partir de 920 m | terrenos mais altos, incluindo o cume |

Subir uma faixa adiciona 1 PM; defender numa faixa acima do atacante acrescenta 1 de proteção. O valor em metros aparece como aproximado. Essas faixas não devem ser confundidas com uma classificação geomorfológica precisa.

As linhas de 50 em 50 metros são **curvas interpoladas entre amostras**, obtidas por triangulação da grade de centros e interseção das cotas com as arestas dos triângulos. Não são curvas oficiais contínuas de um levantamento de precisão. A altimetria atual representa melhor o relevo local do que o mapa inicial; não restitui automaticamente o terreno de 1945.

## Caminhos, bosques, edifícios e localidades

Fonte: fotografia dos dados atuais do **OpenStreetMap**, consultada pela API 0.6, caixa `10.939,44.206,10.974,44.225`. A cópia preservada contém 11.009 elementos.

- 91 traçados de caminhos e vias selecionados.
- 11 polígonos de bosques/floresta.
- 246 contornos de edifícios.
- 24 localidades nomeadas, com um subconjunto mostrado para manter o mapa legível, incluindo Abetaia, Paradiso, Baldone e Gambaiana.
- Classificação dos centros de hexágonos: 29 de mata, 21 de caminho e 22 de campo aberto.

Um caminho a menos de aproximadamente 31 m do centro classifica a célula como caminho. Na ausência disso, um centro dentro de polígono florestal classifica a célula como mata. É uma conversão para hexágonos: não representa a fração exata de cobertura dentro de cada célula ou uma rede contínua de estradas para as regras.

**Não afirmar que essas vias, construções ou matas existiam nessa forma em 1945.** A base é moderna. Posições das unidades, baterias, fortificações e objetivos secundários continuam sendo decisões de cenário, sem restituição documental de cada abrigo.

## Referência histórica incorporada

[10thMtMap01.jpg, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:10thMtMap01.jpg): **Armand Casini**, mapa dos movimentos da 10ª Divisão de Montanha em Riva Ridge, Belvedere e Torraccia, no panfleto *Mountaineers*, aproximadamente 1950. Os metadados consultados indicam **domínio público**, por publicação sem aviso de copyright. A imagem original está em `assets/riva-belvedere-map.jpg` e é exibida no popup **Mapa & fontes**.

É uma perspectiva regional histórica, útil para entender a relação entre as elevações e operações aliadas. Não foi usada como se fosse uma carta topográfica georreferenciada dos 72 hexágonos.

## Reproduzir e conferir

- `docs/geography/locations.json`: coordenadas e projeção dos centros.
- `docs/geography/elevation-source.json`: resposta DEM preservada.
- `docs/geography/osm-source.json`: resposta OSM preservada, incluindo declaração de licença.
- `docs/geography/peak-source.json`: registro do ponto de cume.
- `node scripts/import-geography.mjs`: converte os arquivos preservados em `geography-data.ts`, sem novas requisições à rede.
- `geography.ts`: funções sem navegador para obter altitude, faixa e terreno.
- `npm run build`: atualiza o jogo standalone, com dados e imagem incorporados; não há dependência de mapa online durante a partida.

O script simplifica geometrias para exibição e usa centros de células para classificar terreno. Polígonos florestais multiparte ou com lacunas na resposta podem não ser integralmente reconstruídos; não tratar ausência de marcação como levantamento negativo de campo.

## Direitos e atribuição

**© OpenStreetMap contributors**, dados sob [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). A base adaptada e as cópias de dados OSM mantêm essa licença própria; não são relicenciadas como CC BY-NC-SA. A atribuição também aparece na interface.

Elevação: Copernicus DEM 2021 GLO-90 via Open-Meteo; [documentação e referência do conjunto](https://open-meteo.com/en/docs/elevation-api). Mapa Casini: domínio público conforme Wikimedia Commons. Tipografia Barlow Condensed: OFL. A licença do código e das criações originais do jogo permanece CC BY-NC-SA 4.0.
