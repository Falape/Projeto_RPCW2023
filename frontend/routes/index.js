var express = require('express');
const resource = require('../../data_api/models/resource');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
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

  rcs = [
    {title: "rec1", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec2", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec3", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec4", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec5", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec6", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec7", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec8", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec9", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec10", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
  ]

  res.render('list_resources2', { resources: rcs});
});

router.get('/navbar', function(req, res, next) {
  res.render('navbar', { title: 'Express' });
});

module.exports = router;
