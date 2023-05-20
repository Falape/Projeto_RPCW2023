var express = require('express');
const User = require("../../controllers/user"),
      userModel = require("../../models/user");
var router = express.Router();

//const { checkValidToken, checkValidTokenAdmin } = require('../../javascript/validateToken');

//must create some sord of OAuth2.0, so in the signup, a requests is sent to here
router.post('/create', function(req, res) {
  console.log("create")
  const user = new userModel({name: req.body.name, username: req.body.username, userId: req.body.userId, filiacao: req.body.filiacao, created_date: Date.now(), last_access: Date.now()})
  User.insert(user)
    .then(savedUser => {
      res.status(200).json(savedUser);
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro creating user: ' + err })
    });
});

router.post('/delete', function(req, res) {

});
module.exports = router;
