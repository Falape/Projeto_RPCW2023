var express = require('express');
const User = require("../controllers/user"),
      userModel = require("../models/user");
var router = express.Router();

const { checkValidToken, checkValidTokenAdmin } = require('../javascript/validateToken');

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
