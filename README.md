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

Aqui estão as rotas disponíveis em /resource:

- `POST /`: Lista todos os recursos. Esta rota é usada para recuperar uma lista de todos os recursos.

- `GET /:id`: Recupera um recurso pelo seu ID. Esta rota é usada para obter um recurso específico fornecendo o seu ID como parâmetro.

- `POST /add`: Adiciona um novo recurso. Esta rota é usada para adicionar um novo recurso. Os dados do recurso são fornecidos no corpo da requisição.

- `PUT /edit/:id`: Atualiza as informações de um recurso. Esta rota é usada para atualizar as informações de um recurso específico identificado pelo seu ID. Os dados atualizados do recurso são fornecidos no corpo da requisição.

- `DELETE /delete/hard/:id`: Deleta um recurso permanentemente. Esta rota é usada para excluir um recurso permanentemente do sistema. O recurso é identificado pelo seu ID, fornecido como parâmetro na URL.

- `DELETE /delete/soft/:id`: Deleta um recurso de forma suave. Esta rota é usada para marcar um recurso como deletado, sem excluí-lo permanentemente do sistema. O recurso é identificado pelo seu ID, fornecido como parâmetro na URL.

Aqui estão as rotas disponíveis em /comment:

- `POST /`: Lista todos os comentários. Esta rota é usada para obter uma lista de todos os comentários.

- `GET /:id`: Recupera um comentário pelo seu ID. Esta rota é usada para obter um comentário específico fornecendo seu ID como parâmetro.

- `GET /resource/:id`: Recupera comentários de um recurso específico. Esta rota é usada para obter todos os comentários associados a um recurso específico, identificado pelo seu ID.

- `POST /add/:id`: Adiciona um novo comentário a um recurso. Esta rota é usada para adicionar um novo comentário a um recurso. O conteúdo do comentário e o ID do recurso são fornecidos no corpo da requisição e no parâmetro da URL, respectivamente.

- `PUT /edit/:id`: Atualiza as informações de um comentário. Esta rota é usada para atualizar as informações de um comentário específico identificado pelo seu ID. Os dados atualizados do comentário são fornecidos no corpo da requisição.

- `DELETE /delete/hard/:id`: Deleta um comentário permanentemente. Esta rota é usada para excluir um comentário permanentemente do sistema. O comentário é identificado pelo seu ID, fornecido como parâmetro na URL.

- `DELETE /delete/soft/:id`: Deleta um comentário suavemente. Esta rota é usada para deletar um comentário suavemente, marcando-o como excluído sem removê-lo permanentemente do sistema. O comentário é identificado pelo seu ID, fornecido como parâmetro na URL.

Aqui estão as rotas disponíveis em /noticia:

- `POST /`: Lista todas as notícias. Esta rota é usada para recuperar uma lista de todas as notícias.

- `GET /:id`: Recupera uma notícia pelo seu ID. Esta rota é usada para obter uma notícia específica fornecendo o seu ID como parâmetro.

- `GET /resource/:id`: Recupera notícias de um recurso específico. Esta rota é usada para obter todas as notícias associadas a um recurso específico, identificado pelo seu ID.

- `POST /add/:id`: Adiciona uma nova notícia a um recurso. Esta rota é usada para adicionar uma nova notícia a um recurso. O título da notícia, o ID do recurso, o tipo, a flag "pública" e a data de criação são fornecidos no corpo da requisição e como parâmetro na URL.

- `POST /addAviso`: Adiciona um novo aviso. Esta rota é usada para adicionar um novo aviso. O título do aviso, o nome de usuário do usuário que fez o upload, o tipo, a flag "pública", o conteúdo e a data de criação são fornecidos no corpo da requisição.

- `DELETE /delete/hard/:id`: Deleta uma notícia permanentemente. Esta rota é usada para excluir uma notícia permanentemente do sistema. A notícia é identificada pelo seu ID, fornecido como parâmetro na URL.

Aqui estão as rotas disponíveis em /rating:

- `POST /`: Lista todas as avaliações. Esta rota é usada para recuperar uma lista de todas as avaliações.

- `GET /:id`: Recupera uma avaliação pelo seu ID. Esta rota é usada para obter uma avaliação específica fornecendo o seu ID como parâmetro.

- `GET /resource/list/:id`: Recupera a lista de avaliações de um recurso específico. Esta rota é usada para obter todas as avaliações associadas a um recurso específico, identificado pelo seu ID.

- `GET /resource/:id`: Recupera a avaliação total de um recurso. Esta rota é usada para obter a avaliação total de um recurso, que é a média das avaliações dadas pelos usuários.

- `POST /add/:id`: Adiciona uma nova avaliação a um recurso. Esta rota é usada para adicionar uma nova avaliação a um recurso. O valor da avaliação e o ID do recurso são fornecidos no corpo da requisição e como parâmetro na URL.

- `PUT /edit/:id`: Atualiza as informações de uma avaliação. Esta rota é usada para atualizar as informações de uma avaliação específica identificada pelo seu ID. Os dados atualizados da avaliação são fornecidos no corpo da requisição.

- `DELETE /delete/hard/:id`: Deleta uma avaliação permanentemente. Esta rota é usada para excluir uma avaliação permanentemente do sistema. A avaliação é identificada pelo seu ID, fornecido como parâmetro na URL.

- `DELETE /delete/soft/:id`: Deleta uma avaliação de forma suave. Esta rota é usada para marcar uma avaliação como deletada, sem excluí-la permanentemente do sistema. A avaliação é identificada pelo seu ID, fornecido como parâmetro na URL.

Aqui estão as rotas disponíveis em /file:

- `GET /:id`: Recupera um arquivo pelo seu ID. Esta rota é usada para obter um arquivo específico fornecendo seu ID como parâmetro.

- `GET /resource/:id`: Recupera arquivos de um recurso específico. Esta rota é usada para obter todos os arquivos associados a um recurso específico, identificado pelo seu ID.

- `POST /add/:id`: Adiciona um novo arquivo a um recurso. Esta rota é usada para adicionar um novo arquivo a um recurso. O nome do arquivo, o tipo, o caminho e o suporte do navegador são fornecidos no corpo da requisição, e o ID do recurso é fornecido como parâmetro na URL.

- `DELETE /delete/hard/:id`: Deleta um arquivo permanentemente. Esta rota é usada para excluir um arquivo permanentemente do sistema. O arquivo é identificado pelo seu ID, fornecido como parâmetro na URL.

Aqui estão as rotas disponíveis em /api:

- `DELETE /delete/hard/:id`: Deleta um recurso permanentemente pelo ID. Esta rota é usada para excluir um recurso específico permanentemente usando seu ID.

- `DELETE /delete/hard/user/:id`: Deleta todos os recursos e comentários associados de um usuário permanentemente pelo ID do usuário. Esta rota é usada para excluir todos os recursos e seus comentários de um usuário específico permanentemente usando seu ID.

- `DELETE /delete/hard/comments/:id`: Deleta todos os comentários de um usuário permanentemente pelo ID do usuário. Esta rota é usada para excluir todos os comentários de um usuário específico permanentemente usando seu ID.

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

Aqui estão as rotas disponíveis em /admin:

- `PUT /user/:id`: Atualiza um usuário pelo ID. Esta rota é usada para atualizar as informações de um usuário específico (como nome, nome de usuário, filiação e data de último acesso) usando seu ID.

Aqui estão as rotas disponíveis em /api:

- `POST /create`: Cria um novo usuário. Esta rota é usada para criar um novo usuário com as informações fornecidas no corpo da solicitação.

- `GET /user/:id`: Obtém um usuário por ID. Esta rota é usada para buscar um usuário específico pelo seu ID.

- `DELETE /delete/:id`: Deleta um usuário por ID. Esta rota é usada para excluir um usuário específico pelo seu ID.

- `GET /updateLastAccess/:id`: Atualiza o último acesso de um usuário pelo ID. Esta rota é usada para atualizar a data e hora do último acesso de um usuário específico usando seu ID.

- `PUT /user/:id`: Atualiza um usuário pelo ID. Esta rota é usada para atualizar as informações de um usuário específico (como nome, filiação e último acesso) usando seu ID.

Aqui estão as rotas disponíveis em /users:

- `PUT /user/:id`: Atualiza um usuário pelo ID. Esta rota é usada para atualizar as informações de um usuário específico (como nome, filiação e último acesso) usando seu ID.

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

