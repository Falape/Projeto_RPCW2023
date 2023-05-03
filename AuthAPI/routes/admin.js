var express = require('express');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    user = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

var router = express.Router();

//gets the list of requests for role update
router.post('/updateRoleList', async function(req, res, next) {
  console.log("updateRoleList")
  try {
    var payload = await checkValidToken(req)

    if(req.body.accepted == undefined || req.body.accepted == null){
      return res.status(200).jsonp(await RequestUpdateRole.list())

    }else{
      return res.status(200).json(await RequestUpdateRole.filter(req.body.accepted));
    }

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

//gets the request for role update by id
router.get('/updateRole/:id', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    var payload = await checkValidToken(req)

    return res.status(200).json(await RequestUpdateRole.lookup(req.params.id));

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

//accepts or rejects the request for role update
router.post('/updateRole/:id', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    //Validate token
    var payload = await checkValidToken(req)

    //accpet must be true or false
    if(req.body.accept == undefined || req.body.accept == null){
      return res.status(400).jsonp({error:"Field is missing"})
    }else{
      //update the reuqestUpdateRole
      var updateRole = await RequestUpdateRole.lookup(req.params.id);
      updateRole.accepted = req.body.accept;
      updateRole.admin_Id = payload._id;
      updateRole.accepted_date = Date.now();

      await updateRole.save();
      
      //if it was accepted then updates the user role
      if(req.body.accept == true){
         
        User.lookup(updateRole.user_id)
          .then(userToUpdate => {
            userToUpdate.role = updateRole.required_Role;
            var savedUser = userToUpdate.save()
            return res.status(200).json(savedUser);
          });
      }
    }
  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

//Get user by id
router.get('/getUser/:id', async function(req, res, next) {
  console.log("get_user_id")
  try {
    var payload = await checkValidToken(req)

    return res.status(200).json(await User.lookup(req.params.id));

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

router.post('/listUsers', async function(req, res, next) {
  console.log("listUsers")
  try {
    var payload = await checkValidToken(req)

    if(req.body.deleted == undefined || req.body.deleted == null){
      return res.status(200).jsonp(await User.list())

    }else{
      return res.status(200).json(await User.filter(req.body.accepted));
    }
  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

router.get('/deleteUser/:id', async function(req, res, next) {
  console.log("DeleteUser by id") 
  try {
    var payload = await checkValidToken(req)
  
    User.lookup(req.params.id)
      .then(userr => {
        userr.deleted = true;
        userr.deleted_date = Date.now();
        //var savedUser = 
        userr.save()
         .then(savedUser => {
           res.status(200).json(savedUser);
         });
      })
      .catch(err => {
        res.status(500).jsonp({ error: 'Erro getting user: ' + err })
      });
  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

// Check if token is valid
function checkValidToken(req) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, function (e, payload) {
      if (e) reject('Erro na verificação do token: ' + e)
      else {
        if(payload.role != 'admin'){
          reject('Not authorized')
        }else{
          resolve(payload);
        }
      }
    })
  })
}

module.exports = router;
