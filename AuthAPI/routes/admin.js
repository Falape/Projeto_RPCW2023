var express = require('express');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    user = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

var router = express.Router();

//gets the list of requests for role update
router.post('/updateRoleList', checkValidToken, async function(req, res, next) {
  console.log("updateRoleList")

  if(req.body.accepted == undefined || req.body.accepted == null){
    res.status(200).jsonp(await RequestUpdateRole.list())

  }else{
    res.status(200).json(await RequestUpdateRole.filter(req.body.accepted));
  }

});

//gets the request for role update by id
router.get('/updateRole/:id', checkValidToken,async function(req, res, next) {
  console.log("get_updateRole_id")

  res.status(200).json(await RequestUpdateRole.lookup(req.params.id));
});

//accepts or rejects the request for role update
router.post('/updateRole/:id', checkValidToken, async function(req, res, next) {
  console.log("get_updateRole_id")

  //accpet must be true or false
  if(req.body.accept == undefined || req.body.accept == null){
    res.status(400).jsonp({error:"Field is missing"})
  }else{
    //update the reuqestUpdateRole
    var updateRole = await RequestUpdateRole.lookup(req.params.id);
    updateRole.accepted = req.body.accept;
    updateRole.admin_Id = req.payload._id;
    updateRole.accepted_date = Date.now();
    await updateRole.save();
    
    //if it was accepted then updates the user role
    if(req.body.accept == true){
       
      User.lookup(updateRole.user_id)
        .then(userToUpdate => {
          userToUpdate.role = updateRole.required_Role;
          userToUpdate.save()
          .then(savedUser => {
            res.status(200).json(savedUser);
          });
        });
    }
  }
});

//Get user by id
router.get('/getUser/:id', checkValidToken, async function(req, res, next) {
  console.log("get_user_id")

  res.status(200).json(await User.lookup(req.params.id));
});

router.post('/listUsers', checkValidToken,async function(req, res, next) {
  console.log("listUsers")

  if(req.body.deleted == undefined || req.body.deleted == null){
    res.status(200).jsonp(await User.list())
    
  }else{
    res.status(200).json(await User.filter(req.body.deleted));
  }
});

router.get('/deleteUser/:id', checkValidToken, function(req, res, next) {
  console.log("DeleteUser by id") 

  User.lookup(req.params.id)
    .then(userr => {
      userr.deleted = true;
      userr.deleted_date = Date.now();

      userr.save()
       .then(savedUser => {
         res.status(200).json(savedUser);
       });
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro getting user: ' + err })
    });
  
});

router.post('/updateUser/:id', checkValidToken, function(req, res, next) {
  console.log("updateUser by id") 

  User.lookup(req.params.id)
    .then(userr => {
      if(req.body.username != undefined && req.body.username != null){
        userr.username = req.body.username;
      }
      if(req.body.email != undefined && req.body.email != null){
        userr.email = req.body.email;
      }
      userr.save()
       .then(savedUser => {
         res.status(200).json(savedUser);
       })
       .catch(err => {
        res.status(500).jsonp({ error: 'Erro updating user: ' + err })
       });
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro getting user: ' + err })
    });

});

// Check if token is valid
function checkValidToken(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  if(authHeader){
    jwt.verify(token, process.env.TOKEN_SECRET, function (e, payload) {
      if (e) res.status(401).jsonp({error:'Erro na verificação do token: ' + e})
      else {
        if(payload.role != 'admin'){
          res.status(401).jsonp({error:'Not authorized'})
        }else{
          req.payload=payload;
          next();
        }
      }
    })
  }else{
    res.status(401).jsonp({error:'No token provided'})
  }
}

module.exports = router;
