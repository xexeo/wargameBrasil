# Treinamento separado por lado

2400 episódios para FEB e 2400 para Alemanha, com 400 episódios por adversário fixo em cada lado. Alpha 0,18; gamma 0,9; exploração de treino 0,20, constantes. Inferência posterior tem exploração zero e não atualiza pesos.

Os resultados brutos, sementes e parâmetros estão nesta pasta. Vitórias durante treino não constituem avaliação independente. Execute evaluate-fixed.mjs após recompilar os modelos.
