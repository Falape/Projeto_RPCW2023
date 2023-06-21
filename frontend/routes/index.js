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
//... rest of your code


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user)
  if (req.session.user == undefined || req.session.user.token == null) {
    return res.redirect('/login');
  }
  res.redirect('/recursos')
});

router.get('/login', function(req, res, next) {
  res.render('login');

});

router.post('/login', function (req, res, next) {
  //console.log(req.body.password)
  body = {
    username: req.body.username,
    password: req.body.password
  }
  axios.post(process.env.API_AUTH_URL + '/login',body)
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
    res.render('test', {user:req.session.user});
  }).catch((err) => {

    if (err.response.data.error != undefined){
      res.render('login', {wrong_data:true, error:  err.response.data.error});
    }else{
      res.render('error_page', { message: err.response.data.error });
    }
  });
});



router.get('/signup', function(req, res, next) {
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
    res.render('test', { user: req.session.user });
  })
  .catch((error) => {
    console.log(error.response);
    if (error.response.data.error != undefined){
      console.log("error")
      console.log(error.response.data.error)
      res.render('signup', {wrong_data:true, error:  error.response.data.error});
    }else{
      res.render('error_page', { message: error.response.data.error });
    }
   
  });
});


router.get('/recursos', function (req, res, next) {
  // make request to daa api to get all resources
  axios.post(process.env.API_DATA_URL + '/resource')
    .then((response) => {
      console.log(response.data);
      res.render('list_resources2', { resources: response.data });
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel listar os recursos." });
    });
});

router.get('/recurso/:id', function (req, res, next) {
  // make request to daa api to get all resources
  axios.get(process.env.API_DATA_URL + '/resource/' + req.params.id)
    .then((response) => {
      console.log(response.data);
      // need to get resource rating
      axios.get(process.env.API_DATA_URL + '/rating/resource/' + req.params.id,
        {
          headers: {
            Authorization: `Bearer ${req.session.user.token}`
          }
        })
        .then((response2) => {
          console.log(response2.data);

          // need to get resource files
          axios.get(process.env.API_DATA_URL + '/file/resource/' + req.params.id)
            .then((response3) => {

              axios.get(process.env.API_DATA_URL + '/comment/resource/' + req.params.id)
                .then((response4) => {
                  console.log(response4.data);
                  res.render('resource', { resource: response.data, rating: response2.data, files: response3.data, comments: response4.data });
                })
                .catch((error) => {
                  res.render('error_page', { message: "Não foi possivel obter os comentários do recurso." });
                })
            })
            .catch((error) => {
              console.log(error);
              res.render('error_page', { message: "Não foi possivel obter os ficheiros do recurso." });
            })
        })
        .catch((error) => {
          console.log(error);
          res.render('error_page', { message: "Não foi possivel obter o rating do recurso." });
        })
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel obter o recurso desejado." });
    });
});

router.get('/navbar', function (req, res, next) {
  res.render('navbar', { title: 'Express' });
});

router.get('/submission', function (req, res, next) {
  res.render('upload', { title: 'Express' });
})

router.post('/upload', multer_upload.single('Myfile'), (req, res) => {
  //catch parameters
  body = {
    title: req.body.title,
    uploadedBy: req.session.user.userId,
    uploadedByUsername: req.session.user.username,
    author: req.body.author == "" ? null : req.body.author,
    public: req.body.publicResource == 'yes' ? true : false,
    type: req.body.type
  }

  console.log(body);

  console.log(`Received file ${req.file.originalname}`);
  let oldPath = __dirname + '/../' + req.file.path
  console.log('oldPath: ' + oldPath)
  let newPath = __dirname + '/../uploads/' + req.file.originalname
  console.log('newPath: ' + newPath)
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
              res.render('error_page', { message: "ZIP is invalid." });
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
                            res.render('error_page', { message: "Não foi possivel Adicionar o ficheiro: " + file_body.fileName });
                          });
                      }
                      res.redirect('/recursos');
                    })
                    .catch((error) => {
                      console.log(error);
                      res.render('error_page', { message: "Não foi possivel concluir o processo de armazenamento." });
                    })

                })
                .catch((error) => {
                  console.log(error);
                  res.render('error_page', { message: "Não foi possivel submeter o recurso." });
                })
            }
          })
          .catch((error) => {
            console.log(error);
            res.render('error_page', { message: "Não foi possivel verificar o formato/conteudo do zip submetido." });
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
                          console.log(response.data);
                          res.redirect('/recursos')
                        })
                        .catch((error) => {
                          console.log(error);
                          res.render('error_page', { message: "Não foi possivel Adicionar o ficheiro: " + file_body.fileName });
                        });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                    res.render('error_page', { message: "Não foi possivel concluir o processo de armazenamento." });
                  })

              } catch (error) {
                console.error('An error occurred:', error);
                res.render('error_page', { message: "Não foi possivel concluir o processo de criação de um SIP (ficheiro zip)." });
              }
            })();

          })
          .catch((error) => {
            console.log(error);
            res.render('error_page', { message: "Não foi possivel submeter o recurso." });
          });
      }
    }
  })
  //res.redirect('/recursos')
})

router.post('/comment', function (req, res, next) {
  body = {
    content : req.body.comment,
    id : req.body.resourceId
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
  console.log("CHEGUEI AO RATE")
  body = {
    value : req.body.rating,
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

module.exports = router;
