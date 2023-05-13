LER ANTES DE USAR QUALQUER SCRIPT INCLUIDO NESTA PASTA.

Este processo foi dividido em 3 partes.
1. Uma que transformas pastas ou ficheiros em SIPs de formato ZIP
2. Uma que verifica SIPs com formato ZIP fornecidos pelo USER.
3. Uma que dado 1 SIP, faz o storing dos dados e devolve uma lista com informações a guardar na BD.

Pronto, isto vai funcionar das seguinte maneiras:

1. USER fornece um ZIP
    - então é usado o processo 2, seguido do 3.

2. USER fornece um ficheiro (individual) ou uma pasta
    - então é usado o processo 1, seguido do 3.

No 2. como somos nós a fazer o ZIP, consideramos que é válido e passamos logo ao armazenamento.

TESTEs:

em qualquer um destes, convém fazer: npm i
depois, dependedo do script a usar, este pode receber input pelo teminal, ou então ser preciso mudar
no codigo. Para isto: Ver as ultimas linhas do script.