var express = require('express');
var router = express.Router();

router.put('/user/:id', function(req, res) {
  console.log("update")
  info = {
    name: req.body.name,
    usename: req.body.username,
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
