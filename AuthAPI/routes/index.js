var express = require('express');
var jwt = require('jsonwebtoken');
    passport = require("passport");

User = require("../models/user");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({'body':"test"});
});

// Signup
router.post("/signup", function (req, res) {
  console.log(req.body);
  //console.log(req.body.password);
  if(req.body.email == undefined || req.body.password == undefined || req.body.nome == undefined || req.body.filiacao == undefined || req.body.username == undefined){
    return res.status(500).jsonp({error:"Field is missing"})
  }

  User.register(new User({email: req.body.email, role : 'consumer', username : req.body.username}), req.body.password, function (err, user) {
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
                  else res.status(201).jsonp({signUpToken:token})
        });
      });
    })(req, res);
  });
});

// Login
router.post("/login", function (req, res) {
  console.log('entra aqui')
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right', user: user
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
                  else res.status(201).jsonp({signUpToken:token})
      });
    });
  })(req, res);

});

// Logout 
//FIXME: (NOT WORKING)
router.get("/logout", function (req, res) {
  console.log("logout");
  req.logout();
  res.status(200).json({'body':"test"});
});



module.exports = router;
