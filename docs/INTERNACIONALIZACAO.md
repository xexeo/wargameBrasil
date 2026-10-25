# Internacionalização: português padrão e inglês dos Estados Unidos

## Plano de implementação

1. Manter `pt-BR` como idioma inicial explícito, independentemente do navegador. Oferecer `en-US` em um seletor persistido separadamente da operação e do aprendizado.
2. Centralizar mensagens em catálogo com chaves e parâmetros. Traduzir também conteúdo extenso dos diálogos, acessibilidade, unidades, resultados, registros, erros e interfaces de arquivos. Preservar nomes próprios e estado original do motor.
3. Alterar o idioma sem iniciar operação, fechar diálogos, executar turno ou apagar experiência. Manter datas no fuso `America/Sao_Paulo`, usando a formatação do idioma selecionado.
4. Acrescentar homenagem com o texto aprovado (6º Regimento de Infantaria), imagens incorporadas e atribuições próprias. Identificar a imagem regimental como atual, sem afirmar uso em 1945.
5. Verificar os diálogos e modos nos dois idiomas, persistência e igualdade do estado ao alternar. Acrescentar auditoria de cobertura e testes de navegador; preservar os testes existentes em português.

## Decisões

- A tradução pertence à apresentação. Identificadores, dados históricos desconhecidos, políticas da IA e registros persistidos não mudam com o idioma.
- Valores históricos não confirmados permanecem desconhecidos; o contexto de 414 baixas não é uma contagem diária.
- Inglês usa vocabulário dos EUA (`defense`, `armor`, `color`, `center`, `meters`).
- A troca de idioma é reversível e não altera o modo, a seleção ou os valores da partida.

## Implementação e validação

O catálogo `i18n-messages.ts` usa chaves explícitas e parâmetros ordenados; uma chave inexistente é erro. `i18n-data.ts` traduz os dados imutáveis de tropas e fontes. `i18n.ts` traduz os padrões conhecidos de mensagens do motor exclusivamente ao apresentar os registros, sem modificar os registros salvos. Nomes próprios e nomes fornecidos em arquivos importados preservam sua grafia.

A troca de idioma atualiza a apresentação e recompõe o diálogo aberto, mantendo seus controles e mensagens de resultado. A preferência ocupa uma chave própria de armazenamento, separada da operação e da experiência. Os termos completos em inglês da licença continuam incorporados e os avisos de terceiros têm apresentação traduzida.

Verificações executadas em navegador Chromium, nas dimensões desktop e celular: 48 casos existentes em português e 12 casos de internacionalização aprovados. Os novos casos cobrem todos os diálogos, dez perfis de tropas, os quatro modos, turno do computador, registros, erros de arquivos, persistência do idioma, preservação byte a byte da operação e experiência ao alternar e igualdade dos parâmetros dos dois catálogos. `npm run typecheck` e `npm run build` aprovados. Foi utilizada configuração temporária na porta 8027; a configuração permanente não foi alterada.

O resultado de eliminação identifica a força vencedora e não afirma ocupação do cume quando ele permanece livre. O diálogo final explica os três caminhos de vitória das regras atuais e rotula separadamente as regras antigas preservadas.

A homenagem usa o 6º RI, conforme correção expressa do usuário. O distintivo regimental atual é identificação institucional, com créditos e direitos próprios; não é apresentado como distintivo comprovadamente usado em 1945 nem relicenciado sob CC BY-NC-SA. O distintivo real da FEB aparece também no cabeçalho e na narrativa. O roteiro do Memorial da Democracia permanece apenas como link externo, conforme a verificação em `IMAGEM_ROTEIRO_FEB.md`.
