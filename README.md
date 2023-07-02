<h1 align="center">Projeto RPCW 2023</h1>
      
<p align="center">
  <a href="#sobre">Sobre</a>  •  
  <a href="#características">Características</a>  •  
  <a href="#instalação-e-uso">Instalação e uso</a>  • 
  <a href="#wiki">Wiki</a> 
</p>

---

## Sobre:

Das várias propostas de projecto disponibilizadas, o grupo decidiu escolher a proposta 1: "Plataforma de Gestão e Disponibilização de Recursos Educativos". Esta proposta consiste em desenvolver uma plataforma capaz de disponibilizar recursos educativos de vários tipos: livros, artigos , testes, exames, relatórios, etc. 
Para isto, existem três tipos de utilizadores, consumers, producers e admins. Os consumers, tal como o nome indica, apenas podem consumir, ver, comentar, classificar e fazer download de recursos. Os produrers podem fazer tudo os que os consumers fazem, com a adição de conseguirem também submeter novos recursos na plataforma. O tipo de utilizador admin como seria de esperar, pode fazer tudo o que os outros utilizadores conseguem, com adição de outras funcionalidades uteis para a moderação da plataforma, tais como publicar anuncios (noticias), apagar comentários e recursos de outros utilizadores. 

Na plataforma podem ser submetidos qualquer tipo de ficheiros. Caso seja submetido um zip, este deverá estar no formato SIP aceite pela plataforma, no qual apenas requer um manifesto no formato json, no qual o nome de todos os ficheiros presentes no zip, devem estar associados a sua hash md5.

## Características

Nesta secção descrevemos como são compostas as apis ao explicar o que cada endpoint disponivel faz.

#### Api dados
A Api de dados, tal como o nome indica, trata de todos os dados da plataforma, tais como os dados dos recursos, dos comentários, das classificações e das noticias. As operações disponiveis são baseadas em CRUD (create, read, update, and delete).

### Api Auth 

Aqui estão as rotas disponíveis em /admin:

- `GET /updateRoleList`: Obtém a lista de pedidos de atualização role. Esta rota é usada para buscar uma lista de todas as solicitações para atualizar as funções dos utilizadores.

- `GET /updateRole/:id`: Obtém a solicitação de atualização de role por ID. Esta rota é usada para buscar uma solicitação específica de atualização de role usando seu ID.

- `POST /updateRole/:id`: Aceita ou rejeita a solicitação de atualização de role. Esta rota é usada para aceitar ou rejeitar uma solicitação específica de atualização de role, atualizando o registro de solicitação e possivelmente o papel do utilizador.

- `GET /updateRoleAcceptRefuse/:id`: Aceita ou recusa a solicitação de atualização de role. Semelhante à rota `POST /updateRole/:id`, mas aceita ou recusa o pedido com base no parâmetro de consulta 'accept' enviado com o pedido.

- `GET /getUser/:id`: Obtém um utilizador por ID. Esta rota é usada para buscar um utilizador específico por seu ID.

- `POST /listUsers`: Lista todos os utilizadores. Esta rota é usada para buscar uma lista de todos os utilizadores no sistema.

- `POST /updatePassword/:id`: Atualiza a senha do utilizador pelo ID. Esta rota é usada para atualizar a senha de um utilizador específico usando seu ID.

- `DELETE /deleteUser/:id`: Faz o delete um utilizador pelo ID. Esta rota é usada para excluir um utilizador específico usando seu ID.

- `PUT /updateUser/:id`: Atualiza um utilizador pelo ID. Esta rota é usada para atualizar as informações de um utilizador específico (como o nome de utilizador e o email) usando seu ID.

**Nota**: Todas as rotas estão protegidas pelo middleware `checkValidTokenAdmin`, o que significa que elas exigem um token de autenticação válido de um administrador para serem acessadas.

Aqui estão as rotas disponíveis em /:

- `POST /signup`: rota de registro de utilizador. Esta rota é usado para registrar um novo utilizador no sistema com a função de 'consumer'. O corpo da requisição deve incluir o `email`, `password`, `name`, `filiation` e `username` do utilizador.

- `POST /login`: rota de login do utilizador. Esta rota é usado para fazer login de um utilizador. O corpo da requisição deve incluir o `username` e `password` do utilizador.

- `POST /updatePassword`: rota de atualização de senha do utilizador. Esta rota é usado para atualizar a senha de um utilizador. O corpo da requisição deve incluir a `oldPassword` e `newPassword` do utilizador. Esta rota requer um token de autenticação válido.

- `GET /logout`: rota de logout do utilizador. Esta rota é usado para fazer logout de um utilizador. Esta rota requer um token de autenticação válido.

- `GET /listUsers`: rota de lista de utilizadores. Esta rota é usado para obter uma lista de todos os utilizadores. Esta rota requer um token de autenticação válido.

- `GET /getUser/:id`: rota de obtenção de utilizador por ID. Esta rota é usado para obter um utilizador específico usando seu ID. Esta rota requer um token de autenticação válido.
- `POST /getUserGoogleID/:id`: Esta rota é usado para obter um utilizador usando o ID do Google. Ele recebe um objeto JSON com as propriedades `name`, `id_oauth` e `email`. Se o utilizador existir, um token de autenticação JWT é retornado. Caso contrário, um novo utilizador é criado com um nome de utilizador exclusivo gerado automaticamente e um token de autenticação JWT é retornado.

**Observação**: Todos os pontos finais são protegidos pelo middleware `checkValidToken`, o que significa que eles requerem um token de autenticação válido para serem acessados.

Aqui estão as rotas disponíveis em /users:

- `POST /requestUpdateRole`: Solicita atualização de função. Esta rota é usada para enviar uma solicitação de atualização de função, fornecendo o papel requerido pelo utilizador.

- `GET /getUser`: Obtém informações do utilizador. Esta rota é usada para obter as informações do utilizador atualmente autenticado.

- `DELETE /deleteUser`: Exclui o utilizador. Esta rota é usada para excluir o utilizador atualmente autenticado.

**Observação**: Todos os pontos finais são protegidos pelo middleware `checkValidToken`, o que significa que eles requerem um token de autenticação válido para serem acessados.


### Api users 

hello world

### Api frontend

hello world

### Processo de ingestão
Para que a nossa plataforma conseguisse receber qualquer tipo de ficheiros, decidimos dividir este processo em 2 partes. Uma para os ficheiros zip, no qual criamos um script para efectuar a verificação e outro para fazer o storing do do ficheiro zip. E outra parte, na qual criamos um zip com o(s) ficheiros submetidos pelo utilizador e depois fazemos store do mesmo. Nesta ultima parte, não fazemos a verificação, porque somos nós que criamos o zip, e desta maneira consideramo-lo logo válido.

O processo de storing consiste em fazer a hash md5 do ficheiro zip, a qual tem 32 caracteres. Dividimos esta string em 2 (cada com 16 caractesres) e criamos directórios da seguinte maneira: pasta_principal/hash1/hash2/ , dentro do hash2 então temos o 2 coisas, uma pasta comficheiros unziped e o ficheiro zip original. Dentro da pasta unziped encontra-se todos os ficheiros do zip, para que seja possivel aos utilizadores fazer download de cada uma partes de um recurso.


## Instalação e uso:

Para a instalação, deverá ter disponivel o Docker. Todos os serviços desenvolvidos estão em docker containers que serão "levantados" ao usar o docker compose presente na raiz do projecto. Este docker compose deverá então por todos os serviços a correr de modo que se posssa proceder a utilização da plataforma logo de seguida.

É possivel fazer download da ultima versão da plataforma [aqui](https://github.com/Falape/Projeto_RPCW2023/archive/refs/heads/main.zip) .

## Wiki

Para mais informações sobre Docker e de como proceder para o instalar, consultar a documentação presente [aqui](https://www.docker.com/) .

