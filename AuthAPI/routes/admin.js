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
    
    if(payload.role != 'admin'){
      return res.status(401).jsonp({error:"Not authorized"})
    }
    
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
    
    if(payload.role != 'admin'){
      return res.status(401).jsonp({error:"Not authorized"})
    }else{
      return res.status(200).json(await RequestUpdateRole.lookup(req.params.id));
    }

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
        //console.log(payload);
        console.log("token é válido")
        resolve(payload);
      }
    })
  })
}

module.exports = router;
