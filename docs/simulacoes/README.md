# Simulações válidas por versão

Cada pasta reúne análise, dados brutos por partida e manifesto com hashes do programa. O número identifica a versão executada; mudar apenas a versão não invalida resultados.

- **0.9.2**: [estudo-duas-escalas](0.9.2/estudo-duas-escalas/analise.md) · [treino-batalhoes](0.9.2/treino-batalhoes/analise.md) · [treino-companhias](0.9.2/treino-companhias/analise.md) · [movimento-exaustivo](0.9.2/movimento-exaustivo/analise.md) · [regressao-controlada](0.9.2/regressao-controlada/analise.md) · [avaliacao-ias-fixas](0.9.2/avaliacao-ias-fixas/analise.md) · [avaliacao-ias-fixas-companhias](0.9.2/avaliacao-ias-fixas-companhias/analise.md) · [matriz-ias](0.9.2/matriz-ias/analise.md) · [matriz-ias-companhias](0.9.2/matriz-ias-companhias/analise.md) · [latencia-companhias](0.9.2/latencia-companhias/analise.md) · [manifesto](0.9.2/manifesto.json)

`npm run build` e o hook de commit verificam os hashes e removem as pastas incompatíveis, incluindo análises e dados brutos. Referências numéricas marcadas no README/guia também são removidas. O histórico do Git preserva os registros antigos. O aprendizado simples é compartilhado com o navegador em simple-learning.ts, incluído nos hashes. Mudanças exclusivamente na apresentação (app.ts, CSS, HTML), documentação ou metadados de versão não invalidam as simulações sem interface.
