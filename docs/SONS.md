# Sons de combate

Consulta e implementação em 26/10/2026. Som opcional, desligado inicialmente, com volume configurável. A preferência fica no navegador, independente da partida e do aprendizado. A reprodução só é liberada após interação do usuário, conforme as regras de áudio do navegador.

## Pesquisa de efeitos

| Fonte consultada | Licença indicada | Conteúdo e decisão |
| --- | --- | --- |
| [Kenney — Impact Sounds](https://kenney.nl/assets/impact-sounds) | CC0 |130 efeitos de impacto/foley. Página e licença lidas. É uma referência de biblioteca livre; não foi apresentada como gravação de obuseiros. |
| [OpenGameArt — Battle Sound Effects](https://opengameart.org/content/battle-sound-effects), artisticdude/Ogrebane | Inclui opção CC0 | A descrição trata de golpes, movimentos e arco para um RPG. A licença foi examinada; esses sons não foram incorporados como tiros de armas de 1945. |
| [OpenGameArt — Machine Gun](https://opengameart.org/content/machine-gun) | CC0 | O recurso é um modelo 3D, não áudio. Não foi incluído por apenas ter um nome apropriado. |

## Efeitos usados nesta versão

`combat-audio.ts` cria efeitos originais por síntese Web Audio, sem download de gravações e sem dependência de rede. Eles fazem parte do conteúdo original do jogo. Não são gravações históricas de armas identificadas.

- Infantaria: rajada curta com transientes e componente grave.
- Apoio agregado do Sampaio: lançamento, trajetória e impacto de granada de morteiro.
- Artilharia: disparo, passagem do projétil e explosão mais grave. O grupo brasileiro resume fogos de 105/155mm; o som não pretende identificar um calibre ou modelo exato. **Obuseiro** é a arma; **obus** é o projétil.

A classificação é compartilhada com a animação visual. Os sons acompanham a fila dos eventos mostrados; desligar interrompe fontes ativas e futuras. Volume e habilitação são atualizados imediatamente. Desabilitar animações não precisa desabilitar o som, e ambos os controles são independentes.

O gerador de ruído tem seu próprio estado e não chama `Math.random`: não consome os dados de combate. Eventos e estado da partida não são modificados. Falha ou bloqueio do áudio não impede jogar. Há limite de vozes, envelopes curtos e compressor; a configuração pessoal de volume continua disponível.

Gravações externas de armas específicas poderão ser avaliadas posteriormente, com identificação, licença e atribuição próprias. Nenhum direito sobre os bancos consultados é atribuído à licença do jogo.

## Animação revista na 0.9.0

Infantaria mostra projéteis de bala em rajadas; o apoio mostra uma granada de morteiro com aletas numa parábola alta; artilharia mostra obus com cinta de forçamento numa curva mais baixa. São ícones esquemáticos de munição, sem identificação falsa de calibre ou modelo. Não há seta. Sequência visual própria varia curvatura, desvio e espaçamento, sem consumir RNG do combate; redução de movimento e desativação preservam impacto estático. O relatório final aguarda o término da fila de efeitos.
