var express = require('express');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    user = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

var router = express.Router();


router.post("/requestUpdateRole",async function (req, res){
  console.log("requestUpdateRole")
  try {
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    if(req.body.required_Role == undefined){
      return res.status(400).jsonp({ error: "Field is missing" })
    }else{
      const reqUp = new requestUpdateRole({user_id: payload._id, current_Role: payload.role, required_Role: req.body.required_Role})
      console.log(reqUp)
      await RequestUpdateRole.insert(reqUp)
      //await reqUp.save();
      res.status(200).json(reqUp);
    }
  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
})

router.get('/getUser', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    
    return res.status(200).json(await User.lookup(payload._id));

  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});


router.get('/deleteUser', async function(req, res, next) {
  console.log("get_updateRole_id")
  try {
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    
    User.lookup(payload._id)
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


    //return res.status(200).json(await User.lookup(payload._id));

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
        console.log("token é válido: ", payload)
        resolve(payload);
      }
    })
  })
}

module.exports = router;
