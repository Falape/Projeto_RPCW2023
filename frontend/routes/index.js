var express = require('express');
const resource = require('../../data_api/models/resource');
var router = express.Router();
const axios = require('axios');
var fs = require('fs')
const multer = require('multer');
var multer_upload = multer({ dest: 'uploads' })
const sip_creation = require('../public/javascripts/creation');
const sip_read = require('../public/javascripts/readArchive');
const sip_store = require('../public/javascripts/store');
const { fail } = require('assert');

const { renderResourcePage, renderUserPage } = require('../public/javascripts/renderPages')

//... rest of your code


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session.user)
  if (req.session.user == undefined || req.session.user.token == null) {
    return res.redirect('/login');
  }else{
    res.redirect('/noticias')
  }
});

router.get('/noticias', function (req, res, next) {
  console.log(req.session.user)
  if (!req.session.user) {
    return res.redirect('/login');
  }
  else {
    const alerts = req.session.alerts;
    req.session.alerts = {}

    axios.post(process.env.API_DATA_URL + '/noticia/', {}, {
      headers: {
        Authorization: `Bearer ${req.session.user.token}`
      }
    })
      .then((notic) => {
        console.log(notic.data)
        res.render('noticias', { noticias: notic.data, userInfo: req.session.user, userDeletedFlag: alerts.userDeletedFlag, resourceDeletedFlag: alerts.resourceDeletedFlag, errorFlag: alerts.errorFlag, msg:alerts.msg });
      })
      .catch((err) => {
        console.log(err)
        res.render('error_page', { message: "Não foi possivel mostrar as noticias." });
      });
    //renderNoticiasPage(res, req, {}, null, null, null, null)
    //res.redirect('/recursos')
  }
});

router.get('/login', function (req, res, next) {
  const alerts = req.session.alerts;
  req.session.alerts = {}
  res.render('login', {errorFlag:alerts.errorFlag, userDeletedFlag:alerts.userDeletedFlag , msg:alerts.msg});
});

router.post('/login', function (req, res, next) {
  //console.log(req.body.password)
  body = {
    username: req.body.username,
    password: req.body.password
  }

  axios.post(process.env.API_AUTH_URL + '/login', body)
    .then((rep) => {
      console.log(rep.data.token)
      if (!req.session) {
        return res.redirect('/login')//res.status(500).send('Session object is undefined');
      }
      req.session.user = {
        username: rep.data.username,
        role: rep.data.role,
        token: rep.data.token,
        userId: rep.data.userId
      };
      //TODO: render home page
      res.render('test', { userInfo: req.session.user });
    }).catch((err) => {

      if (err.response && err.response.data) {
        res.render('login', { errorFlag: true, msg: err.response.data.error });
      } else {
        res.render('error_page', { message: err });
      }
    });
});



router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  const { username, name, email, filiation, password } = req.body;

  // Perform validation on the input fields as needed

  // Make an axios request to the authentication API's signup endpoint
  axios.post(process.env.API_AUTH_URL + '/signup', {
    username: username,
    name: name,
    email: email,
    filiacao: filiation,
    password: password
  })
    .then((response) => {
      console.log(response.data);
      if (!req.session) {
        return res.status(500).send('Session object is undefined');
      }
      req.session.user = {
        username: response.data.username,
        role: response.data.role,
        token: response.data.token,
        userId: response.data.userId
      };
      // TODO: Render the home page or redirect to a different route
      res.render('test', { userInfo: req.session.user, user: req.session.user });
    })
    .catch((error) => {
      //console.log(error.response);
      if (error.response && error.response.data) {
        //console.log("error")
        //console.log(error.response.data.error)
        res.render('signup', { wrong_data: true, error: error.response.data.error });
      } else {
        res.render('error_page', { message: error });
      }

    });
});


router.get('/recursos', function (req, res, next) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  // make request to daa api to get all resources
  axios.post(process.env.API_DATA_URL + '/resource',{}, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      res.render('list_resources2', { resources: response.data, userInfo: req.session.user });
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        res.render('error_page', { message: error.response.data.error });
      } else {
        res.render('error_page', { message: "Não foi possivel listar os recursos." });
      }
    });
});

router.get('/recurso/:id', function (req, res, next) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  const alerts = req.session.alerts;
  req.session.alerts = {}

  axios.get(process.env.API_DATA_URL + '/resource/' + req.params.id,
    {
      headers: {
        Authorization: `Bearer ${req.session.user.token}`
      }
    })
    .then((response) => {
      console.log(response.data);
      // need to get resource files
      axios.get(process.env.API_DATA_URL + '/file/resource/' + req.params.id,
        {
          headers: {
            Authorization: `Bearer ${req.session.user.token}`
          }
        })
        .then((response2) => {
          console.log(response2.data);

          // need to get resource rating
          axios.get(process.env.API_DATA_URL + '/rating/resource/' + req.params.id,
            {
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
            .then((response3) => {
              //tries to get the comments
              axios.get(process.env.API_DATA_URL + '/comment/resource/' + req.params.id,
                {
                  headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                  }
                })
                .then((response4) => {
                  console.log(response4.data);
                  res.render('resource', { resource: response.data, userInfo:req.session.user  ,files: response2.data ,rating: response3.data, comments: response4.data, downloadFlag:alerts.downloadFlag, updateFlag:alerts.updateFlag, resourceDeletedFlag:alerts.resourceDeletedFlag, commentDeleteFlag:alerts.commentDeleteFlag, errorFlag:alerts.errorFlag, msg:alerts.msg});
                })
                .catch((error) => {
                  //res.render('error_page', { message: "Não foi possivel obter os comentários do recurso." });
                  res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: response3.data, comments: "", downloadFlag:alerts.downloadFlag, updateFlag:alerts.updateFlag, resourceDeletedFlag:alerts.resourceDeletedFlag, commentDeleteFlag:alerts.commentDeleteFlag, errorFlag:true, msg: alerts.msg || "Não foi possivel obter os comentários do recurso."});
                })
            })
            .catch((error) => {
              console.log(error);
              
              //failed to get the rating, it will try to get the comments
              axios.get(process.env.API_DATA_URL + '/comment/resource/' + req.params.id,
                {
                  headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                  }
                })
                //got the comments
                .then((response4) => {
                  console.log(response4.data);
                  //res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: response3.data, comments: response4.data, downloadUrl: process.env.FRONT_URL + '/download/resource/'+req.params.id });
                  res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: "", comments: response4.data, downloadFlag:alerts.downloadFlag, updateFlag:alerts.updateFlag, resourceDeletedFlag:alerts.resourceDeletedFlag, commentDeleteFlag:alerts.commentDeleteFlag, errorFlag:true, msg: alerts.msg || "Não foi possivel obter o rating do recurso."});
                })
                //failed to get the comments
                .catch((error) => {
                  //res.render('error_page', { message: "Não foi possivel obter os comentários do recurso." });
                  res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: "", comments: "", downloadFlag:alerts.downloadFlag, updateFlag:alerts.updateFlag, resourceDeletedFlag:alerts.resourceDeletedFlag, commentDeleteFlag:alerts.commentDeleteFlag, errorFlag:true, msg: alerts.msg || "Não foi possivel obter o rating nem os comentários do recurso."});
                })

            })
        })
        .catch((error) => {
          console.log(error);
          res.render('error_page', { message: "Não foi possivel obter os ficheiros do recurso." });
        })
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel obter o recurso desejado." });
    });
});

router.get('/navbar', function (req, res, next) {
  res.render('navbar');
});

router.get('/submission', function (req, res, next) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('upload', { userInfo: req.session.user });
})

router.post('/upload', multer_upload.single('Myfile'), (req, res) => {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log(`Received file ${req.file.originalname}`);
  let oldPath = __dirname + '/../' + req.file.path
  console.log('oldPath: ' + oldPath)
  let newPath = __dirname + '/../uploads/' + req.file.originalname
  console.log('newPath: ' + newPath)

  // lançar erro quando não se encontra uma sessão... [IMPORTANTE]

  //catch parameters
  body = {
    title: req.body.title,
    uploadedBy: req.session.user.userId,
    uploadedByUsername: req.session.user.username,
    author: req.body.author == "" ? null : req.body.author,
    public: req.body.publicResource == 'yes' ? true : false,
    type: req.body.type,
    path: newPath
  }

  console.log(body);
  //console.dir(req.file)
  fs.rename(oldPath, newPath, (erro) => {
    if (erro) {
      res.render('error', { error: erro })
    }
    else {
      // se for um zip então readArchive --> store
      if (req.file.mimetype == 'application/zip') {
        console.log('is a zip')
        sip_read.readZipArchive(__dirname + '/../uploads/' + req.file.originalname)
          .then((resp) => {
            if (resp == false) {
              // zip não se encontra no formato correcto.

              //res.render('error_page', { message: "ZIP is invalid." });
              res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "ZIP is invalid." });
            }
            else {
              axios.post(process.env.API_DATA_URL + '/resource/add', body, {
                headers: {
                  Authorization: `Bearer ${req.session.user.token}`
                }
              })
                .then((response) => {
                  resource_id = response.data._id;
                  sip_store.StoreSIP(__dirname + '/../uploads/' + req.file.originalname)
                    .then((files) => {
                      console.log(files);

                      // fazer update do resource path
                      tmp_path = files[0].path;
                      // need to cut the last 2 parts of the path
                      tmp_path = tmp_path.split('/');
                      tmp_path = tmp_path.slice(0, tmp_path.length - 2);
                      tmp_path = tmp_path.join('/');
                      console.log(tmp_path);
                      tmp_path = './' + tmp_path + '/' + req.file.originalname;

                      axios.put(process.env.API_DATA_URL + '/resource/edit/' + resource_id, { path: tmp_path }, {
                        headers: {
                          Authorization: `Bearer ${req.session.user.token}`
                        }
                      })
                        .then((response) => {
                          console.log(response.data);
                        })
                        .catch((error) => {
                          console.log(error);
                          //res.render('error_page', { message: "Não foi possivel actualizar o path do  recurso." });
                          res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel actualizar o path do  recurso." });
                        });
                      // mandar files para a bd
                      for (let i = 0; i < files.length; i++) {
                        let file_body = {
                          fileName: files[i].fileName,
                          type: files[i].type,
                          path: files[i].path,
                          browserSupported: files[i].browserSupported,
                        }
                        console.log("vou adicionar: ", file_body);
                        axios.post(process.env.API_DATA_URL + '/file/add/' + resource_id, file_body, {
                          headers: {
                            Authorization: `Bearer ${req.session.user.token}`
                          }
                        })
                          .then((response) => {
                            console.log(response.data);
                          })
                          .catch((error) => {
                            console.log(error);
                            //res.render('error_page', { message: "Não foi possivel Adicionar o ficheiro: " + file_body.fileName });
                            res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel Adicionar o ficheiro: " + file_body.fileName });
                          });
                      }
                      res.redirect('/recurso/' + resource_id);
                    })
                    .catch((error) => {
                      console.log(error);
                      //res.render('error_page', { message: "Não foi possivel concluir o processo de armazenamento." });
                      res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel concluir o processo de armazenamento." });
                    })

                })
                .catch((error) => {
                  console.log(error);
                  //res.render('error_page', { message: "Não foi possivel submeter o recurso." });
                  res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel submeter o recurso." });
                })
            }
          })
          .catch((error) => {
            console.log(error);
            //res.render('error_page', { message: "Não foi possivel verificar o formato/conteudo do zip submetido." });
            res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel verificar o formato/conteudo do zip submetido." });
          })
      }
      else { // se não for um zip, create Sip --> store

        console.log('not a zip');
        //make request to data api to create resource
        axios.post(process.env.API_DATA_URL + '/resource/add', body, {
          headers: {
            Authorization: `Bearer ${req.session.user.token}`
          }
        })
          .then((response) => {
            console.log(response.data);
            resource_id = response.data._id;

            console.log("adicionaei o recurso, agora vou ao async");
            (async () => {
              try {
                //console.log("PATH:", __dirname + '/../uploads/' + req.file.originalname)
                await sip_creation.createSIP(__dirname + '/../uploads/' + req.file.originalname);
                console.log('--- ZIP CREATED ---');

                sip_store.StoreSIP(__dirname + '/../uploads/output.zip')
                  .then((files) => {
                    console.log(files);
                    // mandar files para a bd
                    for (let i = 0; i < files.length; i++) {
                      let file_body = {
                        fileName: files[i].fileName,
                        type: files[i].type,
                        path: files[i].path,
                        browserSupported: files[i].browserSupported,
                      }
                      console.log("vou adicionar: ", file_body);
                      axios.post(process.env.API_DATA_URL + '/file/add/' + resource_id, file_body, {
                        headers: {
                          Authorization: `Bearer ${req.session.user.token}`
                        }
                      })
                        .then((response) => {
                          res.redirect('/recurso/' + resource_id);
                        })
                        .catch((error) => {
                          console.log(error);
                          //res.render('error_page', { message: "Não foi possivel Adicionar o ficheiro: " + file_body.fileName });
                          res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel Adicionar o ficheiro: " + file_body.fileName });
                        });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    //res.render('error_page', { message: "Não foi possivel concluir o processo de armazenamento." });
                    res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel concluir o processo de armazenamento." });
                  })

              } catch (error) {
                console.error('An error occurred:', error);
                //res.render('error_page', { message: "Não foi possivel concluir o processo de criação de um SIP (ficheiro zip)." });
                res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel concluir o processo de criação de um SIP (ficheiro zip)." });
              }
            })();

          })
          .catch((error) => {
            console.log(error);
            //res.render('error_page', { message: "Não foi possivel submeter o recurso." });
            res.render('upload', { userInfo: req.session.user, flagAlert: true, flagError: "Não foi possivel submeter o recurso." });
          });
      }
    }
  })
  //res.redirect('/recursos')
})

router.post('/comment', function (req, res, next) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  body = {
    content: req.body.comment,
    id: req.body.resourceId
  }
  console.log("BODY:", body);
  axios.post(process.env.API_DATA_URL + '/comment/add/' + req.body.resourceId, body, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      res.redirect('/recurso/' + req.body.resourceId)
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel submeter o seu comentário." });
    })
});

router.post('/rate', function (req, res, next) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log("CHEGUEI AO RATE")
  body = {
    value: req.body.rating,
  }
  console.log("BODY:", body);
  axios.post(process.env.API_DATA_URL + '/rating/add/' + req.body.resourceId, body, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      console.log("RATE ALTERADO COM SUCESSO!")
      //res.redirect('/recurso/' + req.body.resourceId)
      res.redirect(req.get('referer'))
      return
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel submeter o rating." });
    })
})


//TODO, mas find a way to have acess to the resource id
router.get('/download/:id', function (req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  axios.get(process.env.API_DATA_URL + '/file/' + req.params.id,{
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      console.log("DOWNLOAD PATH: ", response.data.path);
      res.download(response.data.path)
    })
    .catch((error) => {
      console.log(error);
      req.session.alerts = {
        downloadFlag : true,
        msg: "Não foi possivel fazer download do ficheiro."
      }

      res.redirect('/recurso/' + req.params.id)
      //renderResourcePage(req, res, req.params.id, true, null, null, "Não foi possivel fazer download do ficheiro.");
      //res.render('error_page', { message: "Não foi possivel fazer download do ficheiro." });
    })
});

router.get('/download/resource/:id', function (req, res) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  axios.get(process.env.API_DATA_URL + '/resource/' + req.params.id,{
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      console.log("DOWNLOAD RESOURCE PATH: ", response.data.path);
      res.download(response.data.path)
    })
    .catch((error) => {
      console.log(error);
      req.session.alerts = {
        downloadFlag : true,
        msg: "Não foi possivel fazer download do recurso."
      }
      res.redirect('/recurso/' + req.params.id)
      //renderResourcePage(req, res, req.params.id, true, null, null, "Não foi possivel fazer download do recurso.");
      //res.render('error_page', { message: "Não foi possivel fazer download do recurso." });
    })
});

router.get('/listUsers', function (req, res, next) {
  //console.log(req.body.password)
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const alerts = req.session.alerts;
  req.session.alerts = {}

  axios.get(process.env.API_AUTH_URL + '/listUsers', {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
  .then((rep) => {
    console.log(rep.data.token)
    if (!req.session) {
      return res.redirect('/login')//res.status(500).send('Session object is undefined');
    }

    //console.log(rep.data)
    //TODO: render home page
    res.render('list_user', {userInfo:req.session.user, userList: rep.data, errorFlag:alerts.errorFlag, msg:alerts.msg});
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data){
      console.log(err.response.data)
      res.render('error_page', { message: err.response.data.error });
    }else{
      res.render('error_page', { message: err });
    }
  });

  //renderListUsers(req, res, null, null);
});

router.get('/getUser/:id', function (req, res, next) {
  //console.log(req.body.password)
  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log("token " + req.session.user.token)
  axios.get(process.env.API_AUTH_URL + '/getUser/' + req.params.id, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {

      if (!req.session) {
        return res.redirect('/login')//res.status(500).send('Session object is undefined');
      }
      var owner = false;

      if (req.session.user.userId == response.data._id) {
        owner = true;
      }
      res.render('user_page', { user: response.data, owner: owner, userInfo: req.session.user });
    }).catch((err) => {
      console.log(err)
      req.session.alerts = {
        errorFlag:true, 
        msg:"Não foi possivel obter o utilizador."
      }
      //renderListUsers(req, res, true, "Não foi possivel obter o utilizador.");
      res.redirect('/listUsers');
    });
});


router.get('/logout', function (req, res) {
  if (!req.session) {
    return res.redirect('/login')//res.status(500).send('Session object is undefined');
  }
  //req.logout(); // This will clear the user session
  res.clearCookie('session');
  res.redirect('/'); // Redirect the user to the home page or any other desired page
});



router.get('/comment/delete/soft/:id', function (req, res) {
  console.log("DELETE COMMENT: ", req.params.id);

  if (!req.session.user) {
    return res.redirect('/login');
  }

  axios.get(process.env.API_DATA_URL + '/comment/' + req.params.id, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      if(response.data == null){
        res.render('error_page', { message: "Comentário já foi apagado." });
      }
      axios.delete(process.env.API_DATA_URL + '/comment/delete/soft/' + req.params.id, {
        headers: {
          Authorization: `Bearer ${req.session.user.token}`
        }
      })
        .then((response) => {
          console.log(response.data);
          req.session.alerts = {
            commentDeleteFlag : true
          }
          //renderResourcePage(req, res, response.data.resourceId, null, true, null);
          res.redirect('/recurso/' + response.data.resourceId)
        })
        .catch((error) => {
          console.log(error);
          req.session.alerts = {
            commentDeleteFlag : false,
            msg: "Não foi possivel remover o comentário."
          }
          //renderResourcePage(req, res, response.data.resourceId, null, false, null, "Não foi possivel remover o comentário.");
          res.redirect('/recurso/' + response.data.resourceId)
        })
    })
    .catch((error) => {
      console.log(error);
    
      //TODO: render 
      //res.render('error_page', { message: "Não foi possivel remover o comentário." });
      req.session.alerts = {
        commentDeleteFlag : false,
        msg: "Não foi possivel remover o comentário."
      }
      //renderResourcePage(req, res, response.data.resourceId, null, false, null, "Não foi possivel remover o comentário.");
      res.redirect('/recurso/' + response.data.resourceId)
    })
});

router.get('/comment/delete/hard/:id', function (req, res) {

  if (!req.session.user) {
    return res.redirect('/login');
  }

  axios.get(process.env.API_DATA_URL + '/comment/' + req.params.id, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log("rep.data.1:",response.data);
      if(response.data == null){
        res.render('error_page', { message: "Comentário já foi apagado." });
      }
      axios.delete(process.env.API_DATA_URL + '/comment/delete/hard/' + req.params.id, {
        headers: {
          Authorization: `Bearer ${req.session.user.token}`
        }
      })
        .then((response2) => {
          console.log("rep.data.2:",response2.data);
          req.session.alerts = {
            commentDeleteFlag : true
          }
          //renderResourcePage(req, res, response.data.resourceId, null, true, null);
          res.redirect('/recurso/' + response.data.resourceId)
        })
        .catch((error) => {
          console.log(error);
          req.session.alerts = {
            commentDeleteFlag : false,
            msg: "Não foi possivel remover o comentário."
          }
          //renderResourcePage(req, res, response.data.resourceId, null, false, null, "Não foi possivel remover o comentário.");
          res.redirect('/recurso/' + response.data.resourceId)
        })
    })
    .catch((error) => {
      console.log(error);
      req.session.alerts = {
        commentDeleteFlag : false,
        msg: "Não foi possivel remover o comentário."
      }

      //TODO: passar o id do recurso
      //res.redirect('/recurso/' + response.data.resourceId)
      res.render('error_page', { message: "Não foi possivel remover o comentário." });
    })
});

// MEGA HARD DELETE
router.get('/resource/delete/:id', function (req, res) {
  // FAZER ISTO 
  if (!req.session.user) {
    return res.redirect('/login');
  }

  axios.delete(process.env.API_DATA_URL + '/resource/delete/hard/' + req.params.id, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      res.redirect('/');

    })
    .catch((error) => {
      console.log(error);
      req.session.alerts = {
        commentDeleteFlag : false,
        msg: "Não foi possivel fazer remover o recurso."
      }
      //renderResourcePage(req, res, req.params.id, null, false, null, "Não foi possivel fazer remover o recurso.");
      res.redirect('/recurso/' + req.params.id)
      //res.render('error_page', { message: "Não foi possivel fazer download do recurso." });
    })
});


router.post('/resource/filter', function (req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // get all fields
  campos = {
    title: req.body.title,
    uploadedByUsername: req.body.uploadedByUsername,
    dateCreated: req.body.dateCreated,
    type: req.body.type,
  }

  
  // verify if fields of body are empty
  for (var key in campos) {
    if (campos[key] == "" || campos[key] == undefined) {
      campos[key] = null;
    }
  }
  
  console.log(campos);

  axios.post(process.env.API_DATA_URL + '/resource',campos, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      res.render('list_resources3', { resources: response.data, userInfo: req.session.user });
      //res.redirect('/noticias');
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel filtrar os recursos." });
    })
});


router.post('/resource/filter/geral', function (req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // get all fields
  campos = {
    title: req.body.title,
    uploadedByUsername: req.body.uploadedByUsername,
    dateCreated: req.body.dateCreated,
    type: req.body.type,
  }

  
  // verify if fields of body are empty
  for (var key in campos) {
    if (campos[key] == "" || campos[key] == undefined) {
      campos[key] = null;
    }
  }
  
  console.log(campos);

  axios.post(process.env.API_DATA_URL + '/resource',campos, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data);
      res.render('list_resources2', { resources: response.data, userInfo: req.session.user });
      //res.redirect('/noticias');
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel filtrar os recursos." });
    })
});




module.exports = router;
