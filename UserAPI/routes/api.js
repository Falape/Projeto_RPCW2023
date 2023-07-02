var express = require('express');
const User = require("../controllers/user"),
      userModel = require("../models/user");
var router = express.Router();

//const { checkValidToken, checkValidTokenAdmin } = require('../../javascript/validateToken');

//must create some sord of OAuth2.0, so in the signup, a requests is sent to here
router.post('/create', function(req, res) {
  console.log("create")

  body = {
    name: req.body.name,
    username: req.body.username,
    userId: req.body.userId,
    filiacao: req.body.filiacao,
    created_date: Date.now(),
    last_access: Date.now()
  }

  Object.keys(re_data).forEach(key => {
    if (re_data[key] === undefined || re_data[key] === null) {
        delete re_data[key];
    }
  });

  const user = new userModel(body)
  User.insert(user)
    .then(savedUser => {
      res.status(200).json(savedUser);
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro creating user: ' + err })
    });
});

router.get('/user/:id', function(req, res) {
  console.log("get")
  User.getUser(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro getting user: ' + err })
    });
});

router.delete('/delete/:id', function(req, res) {
  console.log("delete")
  User.hardDelete(req.params.id)
    .then(deletedUser => {
      res.status(200).json(deletedUser);
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro deleting user: ' + err })
    });
});

router.get('/updateLastAccess/:id', function(req, res) {
  console.log("updateLastAccess")
  console.log(req.params.id)
  console.log(Date.now())
  User.updateLastAccess(req.params.id, Date.now())
    .then(resp => {
      console.log("fez update")
      res.status(200);
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro deleting user: ' + err })
    });
})

router.put('/user/:id', function(req, res) {
  console.log("update")
  info = {
    name: req.body.name,
    filiacao: req.body.filiacao,
    last_access: Date.now()
  }
  User.updateUser(req.params.id)
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro deleting user: ' + err })
    });
});

module.exports = router;
