var express = require('express');
const resource = require('../../data_api/models/resource');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.redirect('/recursos')
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
  //console.log(req.body.password)
  body ={
    username: req.body.username,
    password: req.body.password
  }
  axios.post(process.env.API_AUTH_URL + '/login',body)
  .then((rep) => {
    console.log(rep.data.token)
    if (!req.session) {
      return res.status(500).send('Session object is undefined');
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
    console.log(err)
    res.render('error_page', { message: err.response.data.error })
  });
});


router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
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
    console.log(error.response.data);
    res.render('error_page', { message: error.response.data.error });
  });
});



router.get('/recurso', function(req, res, next) {
  resourcee = {
    title: "Recurso 1",
    uploadedByUsername: "admin",
    type: "video",
    public: true,
    creationDate: "2021-05-01",
    updateDate: "2021-05-01",
    rating: 2.5,
  }
  fls = [
    {name: "file1", type: "video", browserSupported: true},
    {name: "file2", type: "video", browserSupported: false},
    {name: "file3", type: "video", browserSupported: true},
  ]
  res.render('resource', { resource: resourcee, files: fls });
});

router.get('/files', function(req, res, next) {
  fls = [
    {name: "file1", type: "video", browserSupported: true},
    {name: "file2", type: "video", browserSupported: false},
    {name: "file3", type: "video", browserSupported: true},
  ]
  res.render('tabelaFiles', { files: fls });
});


router.get('/recursos', function(req, res, next) {
  // make request to daa api to get all resources
  axios.post(process.env.API_DATA_URL + '/resource')
  .then((response) => {
    console.log(response.data);
    res.render('list_resources2', { resources: response.data});
  })
  .catch((error) => {
    console.log(error.response.data);
    res.render('error_page', { message: error.response.data.error });
  });
});

router.get('/recurso/:id', function(req, res, next) {
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
        console.log(response3.data);
        res.render('resource', { resource: response.data, rating: response2.data, files: response3.data});
      })
      .catch((error) => {
        console.log(error);
        res.render('error_page', { message: error });
      })
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: error });
    })
  })
  .catch((error) => {
    console.log(error);
    res.render('error_page', { message: error });
  });
});

router.get('/navbar', function(req, res, next) {
  res.render('navbar', { title: 'Express' });
});

module.exports = router;
