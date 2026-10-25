# Simulações válidas por versão

Cada pasta reúne análise, dados brutos por partida e manifesto com hashes do programa. O número identifica a versão executada; mudar apenas a versão não invalida resultados.

- **0.1.14**: [treinamento](0.1.14/treinamento/analise.md) · [manifesto](0.1.14/manifesto.json)

`npm run build` e o hook de commit verificam os hashes e removem as pastas incompatíveis, incluindo análises e dados brutos. Referências numéricas marcadas no README/guia também são removidas. O histórico do Git preserva os registros antigos. A validação é conservadora: inclui app.ts porque contém a Aprendiz. Mudanças só em CSS, HTML, documentação ou metadados de versão não invalidam os dados.
