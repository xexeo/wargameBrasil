# Simulações válidas por versão

Cada pasta reúne análise, dados brutos por partida e manifesto com hashes do programa. O número identifica a versão executada; mudar apenas a versão não invalida resultados.

Nenhuma simulação válida; execute novamente após mudanças nas regras ou IAs.

`npm run build` e o hook de commit verificam os hashes e removem as pastas incompatíveis, incluindo análises e dados brutos. Referências numéricas marcadas no README/guia também são removidas. O histórico do Git preserva os registros antigos. A validação é conservadora: inclui app.ts porque contém a Aprendiz. Mudanças só em CSS, HTML, documentação ou metadados de versão não invalidam os dados.
