# Simulações válidas por versão

Cada pasta reúne análise, dados brutos por partida e manifesto com hashes do programa. O número identifica a versão executada; mudar apenas a versão não invalida resultados.

- **0.1.20**: [treinamento-ias-fixas](0.1.20/treinamento-ias-fixas/analise.md) · [avaliacao-ias-fixas](0.1.20/avaliacao-ias-fixas/analise.md) · [matriz-ias](0.1.20/matriz-ias/analise.md) · [manifesto](0.1.20/manifesto.json)

`npm run build` e o hook de commit verificam os hashes e removem as pastas incompatíveis, incluindo análises e dados brutos. Referências numéricas marcadas no README/guia também são removidas. O histórico do Git preserva os registros antigos. O aprendizado simples é compartilhado com o navegador em simple-learning.ts, incluído nos hashes. Mudanças exclusivamente na apresentação (app.ts, CSS, HTML), documentação ou metadados de versão não invalidam as simulações sem interface.
