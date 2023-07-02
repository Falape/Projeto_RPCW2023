<h1 align="center">Projeto RPCW 2023</h1>
      
<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#características">Características</a> •
  <a href="#instalação-e-uso">Instalação e uso</a> •
  <a href="#wiki">Wiki</a> 
</p>

---

## Sobre:

Das várias propostas de projecto disponibilizadas, o grupo decidiu escolher a proposta 1: "Plataforma de Gestão e Disponibilização de Recursos Educativos". Esta proposta consiste em desenvolver uma plataforma capaz de disponibilizar recursos educativos de vários tipos: livros, artigos , testes, exames, relatórios, etc. 
Para isto, existem três tipos de utilizadores, consumers, producers e admins. Os consumers, tal como o nome indica, apenas podem consumir, ver, comentar, classificar e fazer download de recursos. Os produrers podem fazer tudo os que os consumers fazem, com a adição de conseguirem também submeter novos recursos na plataforma. O tipo de utilizador admin como seria de esperar, pode fazer tudo o que os outros utilizadores conseguem, com adição de outras funcionalidades uteis para a moderação da plataforma, tais como publicar anuncios (noticias), apagar comentários e recursos de outros utilizadores. 

Na plataforma podem ser submetidos qualquer tipo de ficheiros. Caso seja submetido um zip, este deverá estar no formato SIP aceite pela plataforma, no qual apenas requer um manifesto no formato json, no qual o nome de todos os ficheiros presentes no zip, devem estar associados a sua hash md5.

## Características

### Api Design

The OAuth-server utilizes a MongoDB database to store registered client information and manage active tokens in the system. It also uses JSON Schema to verify the authorization scopes of the clients.

#### Api dados
A Api de dados, tal como o nome indica, trata de todos os dados da plataforma, tais como os dados dos recursos, dos comentários, das classificações e das noticias. As operações disponiveis são baseadas em CRUD (create, read, update, and delete).

### Api Auth 

hello world

### Api users 

hello world

### Api frontend

hello world


## Instalação e uso:

Para a instalação, deverá ter disponivel o Docker. Todos os serviços desenvolvidos estão em docker containers que serão "levantados" ao usar o docker compose presente na raiz do projecto. Este docker compose deverá então por todos os serviços a correr de modo que se posssa proceder a utilização da plataforma logo de seguida.

## Wiki

... TBC
