var express = require('express');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    user = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");
    
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({'body':"test"});
});

// Signup
router.post("/signup", function (req, res) {
  console.log("signup");
  console.log(req.body);
  //console.log(req.body.password);
  if(req.body.email == undefined || req.body.password == undefined || req.body.name == undefined || req.body.filiacao == undefined || req.body.username == undefined){
    return res.status(500).jsonp({error:"Field is missing"})
  }

  user.register(new user({email: req.body.email, role : 'consumer', username : req.body.username}), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.status(500).jsonp({
        message: 'Error signing up', user: user
      });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
      console.log(err)
      console.log(user)
      if (err || !user) {
        return res.status(500).jsonp({error:"Erro na Autentificação", err:err})
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return res.status(500).jsonp({error:"Erro no login"})
        }
        // generate a signed son web token with the contents of user object and return it in the response
        var userTosend = {}
        userTosend.id = user._id
        userTosend.role = user.role
        jwt.sign({ _id:user._id, role: user.role, username: user.username}, process.env.TOKEN_SECRET,
                {expiresIn: process.env.TOKEN_EXPIRATION}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Error creating token"})
                  else res.status(201).jsonp({token:token})
        });
      });
    })(req, res);
  });
});

// Login
router.post("/login", function (req, res) {
  console.log('login')
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'Username or password are wrong'
      });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).jsonp({error:"Erro no login"});
      }

      var userTosend = {}
      userTosend.id = user._id
      userTosend.role = user.role

      // generate a signed son web token with the contents of user object and return it in the response
      jwt.sign({ _id:user._id, role: user.role, username: user.username}, process.env.TOKEN_SECRET,
                {expiresIn: process.env.TOKEN_EXPIRATION}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Error creating token"})
                  else res.status(201).jsonp({token:token})
      });
    });
  })(req, res);
});

// Update Password
router.post("/updatePassword", async function (req, res) {
  console.log("updatePassword")
  try {
    var payload = await checkValidToken(req)
    console.log("Payload", payload)
    console.log("username: ", payload.username)
    if (req.body.oldPassword == undefined || req.body.newPassword == undefined) {
      return res.status(400).jsonp({ error: "Field is missing" })
    } else {
      console.log("old and new password given, username: ", payload.username)
      user.authenticate()(payload.username, req.body.oldPassword, function(err, user, options) {
        console.log("user: ", user)
        if (err) {
          // handle error
          res.status(500).jsonp({ error: 'Erro na autenticação do utilizador: ' + err })
        } else if (!user) {
          // user not found or password incorrect
          res.status(401).jsonp({ error: "Old password doens't match" })
        } else {
          // user authenticated successfully, update password
          console.log("Authenticated successfully, update password")
          user.setPassword(req.body.newPassword, function () {
            user.save()
            res.status(200).json(user);
          })
        }
      })
    }
  } catch (e) {
    res.status(401).jsonp({ error: 'Erro token inválido: ' + e })
  }
});


router.post("/user/requestUpdateRole",async function (req, res){
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

// Logout 
//FIXME: (NOT WORKING)
router.get("/logout", function (req, res) {
  console.log("logout");
  req.logout();
  res.status(200).json({'body':"test"});
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
