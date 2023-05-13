var express = require('express');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    user = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

var router = express.Router();


router.post("/requestUpdateRole", checkValidToken, async function (req, res){
  console.log("requestUpdateRole")

  if(req.body.required_Role == undefined){
    res.status(400).jsonp({ error: "Field is missing" })
  }else{
    const reqUp = new requestUpdateRole({user_id: req.payload._id, current_Role: req.payload.role, required_Role: req.body.required_Role})

    await RequestUpdateRole.insert(reqUp)
    //await reqUp.save();
    res.status(200).json(reqUp);
  }

})

router.get('/getUser', checkValidToken, async function(req, res, next) {
  console.log("get_updateRole_id")
    
  res.status(200).json(await User.lookup(req.payload._id));
});


router.get('/deleteUser', checkValidToken, function(req, res, next) {
  console.log("get_updateRole_id")
    
  User.lookup(req.payload._id)
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
});


// Check if token is valid
function checkValidToken(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  if(authHeader){
    jwt.verify(token, process.env.TOKEN_SECRET, function (e, payload) {
      if (e) res.status(401).jsonp({error:'Erro na verificação do token: ' + e})
      else {      
        req.payload=payload;
        next();
      }
    })
  }else{
    res.status(401).jsonp({error:'No token provided'})
  }
}

module.exports = router;
