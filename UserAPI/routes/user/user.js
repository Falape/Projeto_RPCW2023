var express = require('express');
const User = require("../../controllers/user"),
      userModel = require("../../models/user");
var router = express.Router();

const { checkValidToken, checkValidTokenAdmin } = require('../../javascript/validateToken');

router.put('/update', checkValidToken, function(req, res) {
  console.log("update")

  //User.lookup(req.payload._id)
  User.lookup("user1")
  .then(user => {
    if(req.body.name != undefined && req.body.name != "" && req.body.name != null){
      user.name = req.body.name;
    }
    if(req.body.username != undefined && req.body.username != "" && req.body.username != null){
      user.username = req.body.username;
    }
    
    user.save()
     .then(savedUser => {
       res.status(200).json(savedUser);
     });
  })
});

module.exports = router;
