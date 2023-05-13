O ficheiro readArchive.js lê e lista todos os ficheiros de um arquivo ZIP usando adm-zip, fazendo a verificação se todos os ficheiros referenciados no RRD-SIP.json existem na pasta enviada.

## A estrutura do ficheiro RRD-SIP.json deve ser:

[{"file": "nome_file1", "hash": "hash_ficheiro"}, {"file": "nome_file2, "hash": "hash_ficheiro"}]

## Para correr:

Tem que se passar à função readZipArchive o ficheiro zip que se quer ler. 

Em caso de faltar um documento, emite erro, caso contrário é confirmado que todos os elementos referenciados no RRD-SIP.json estão presentes na pasta enviada.

## Descrição dos ficheiros:

#### mybagit_teste_3.zip 
O RRD-SIP.json contém uma hash errada.  

#### mybagit_teste_2.zip
Existe um ficheiro não definido no RRD-SIP.json.
      -  
#### mybagit_teste_1.zip
A pasta não contém um dos ficheiros definidos no RRD-SIP.json.

#### mybagit.zip
Tudo ok. 


