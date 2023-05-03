var express = require('express');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    user = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

var router = express.Router();

/* GET users listing. */
router.post('/updateRoleList', async function(req, res, next) {
  console.log("updateRoleList")
  try {
    console.log("Gonna check token")
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    
    
    if(req.body.accepted == undefined){
      return res.status(200).jsonp(await RequestUpdateRole.list())

    }else{
      return res.status(200).json(await RequestUpdateRole.filter(req.body.accepted));
    }

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

router.get('/updateRole/:id', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    console.log("Gonna check token")
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    
    return res.status(200).json(await RequestUpdateRole.lookup(req.params.id));

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

router.post('/updateRole/:id', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    //Validate token
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
 
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
        var userToUpdate = await User.lookup(updateRole.user_id)
        userToUpdate.role = updateRole.required_Role;
        return res.status(200).json(await userToUpdate.save());
      }
    }
  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

router.get('/getUser/:id', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    console.log("Gonna check token")
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    
    return res.status(200).json(await User.lookup(req.params.id));

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});

// Check if token is valid
function checkValidToken(req) {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)

    jwt.verify(token, process.env.TOKEN_SECRET, function (e, payload) {
      console.log("dentro jwt")
      if (e) reject('Erro na verificação do token: ' + e)
      else {
        if(payload.role != 'admin'){
          reject('Not authorized')
        }else{
          console.log("token é válido: ", payload)
          resolve(payload);
        }
      }
    })
  })
}

module.exports = router;
