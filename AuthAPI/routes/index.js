var express = require('express');
var jwt = require('jsonwebtoken');
const axios = require('axios');
const passport = require("passport"),

    User = require("../controllers/user"),
    userModel = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

const { checkValidToken } = require('../javascript/validateToken');

var router = express.Router();

// Signup
router.post("/signup", function (req, res) {
  console.log("signup");
  if(req.body.email == undefined || req.body.password == undefined || req.body.name == undefined || req.body.filiacao == undefined || req.body.username == undefined){
    res.status(500).jsonp({error:"Field is missing"})
  }

  var newUser = new userModel({email: req.body.email, role : 'consumer', username : req.body.username})
  userModel.register(newUser, req.body.password, function (err, nUser) {
    if (err) {
      res.status(500).jsonp({
        errorMessage: 'Error signing up',
        error:err.message
      });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        res.status(500).jsonp({error:"Erro na Autentificação", err:err})
      }else{
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.status(500).jsonp({error:"Erro no login"})
        }else{
        // generate a signed son web token with the contents of user object and return it in the response
        var userTosend = {}
        userTosend.id = user._id
        userTosend.role = user.role
        jwt.sign({ _id:user._id, role: user.role, username: user.username}, process.env.TOKEN_SECRET,
                {expiresIn: process.env.TOKEN_EXPIRATION}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Error creating token"})
                  else{
                    userInfo = {
                      name: req.body.name,
                      filiacao: req.body.filiacao,
                      username: req.body.username,
                      userId: user._id
                    }
                    try{
                      axios.post(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/create', userInfo)
                      .then((response) => {
                        console.log("Axios request success");
                      })
                      .catch((error) => {
                        console.log("Axios request error:", error.message);
                        // Handle the error without crashing the server
                      });
                    }catch(e){  
                      console.log(e)
                    }                    
                    res.status(201).jsonp(
                      {
                        token:token,
                          username: user.username,
                          role: user.role,
                          userId: user._id
                      }
                    )
                  }    
        });
      }
      })
    };
    })(req, res);
  });
});

// Login
router.post("/login", function (req, res) {
  console.log('login')
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      res.status(400).json({
        error: 'Username or password are wrong'
      });
    }else{
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.status(500).jsonp({error:"Erro no login"});
      }

      console.log("passa aqui")
      var userTosend = {}
      userTosend.id = user._id
      userTosend.role = user.role

      // generate a signed son web token with the contents of user object and return it in the response
      jwt.sign({ _id:user._id, role: user.role, username: user.username}, process.env.TOKEN_SECRET,
                {expiresIn: process.env.TOKEN_EXPIRATION}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Error creating token"})
                  else{
                    try{
                      axios.get(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST +':'+ process.env.USER_SERVER_PORT + '/api/updateLastAccess/'+ user._id)
                      .then((response) => {
                        console.log("Axios request success");
                      })
                      .catch((error) => {
                        console.log("Axios request error:", error.message);
                        // Handle the error without crashing the server
                      });
                    }catch(e){  
                      console.log(e)
                    }
                    res.status(201).jsonp(
                      {
                        token:token,
                        username: user.username,
                        role: user.role,
                        userId: user._id
                      }
                    )
                  } 
      });
    });
  }
  })(req, res);
});

// Update Password
router.post("/updatePassword", checkValidToken, async function (req, res) {
  console.log("updatePassword")

  if (req.body.oldPassword == undefined || req.body.newPassword == undefined) {
    res.status(400).jsonp({ error: "Field is missing" })
  } else {
    userModel.authenticate()(req.payload.username, req.body.oldPassword, function(err, user, options) {
      if (err) {
        // handle error
        res.status(500).jsonp({ error: 'Erro na autenticação do utilizador: ' + err })
      } else if (!user) {
        // user not found or password incorrect
        res.status(401).jsonp({ error: "Old password doens't match" })
      } else {
        // user authenticated successfully, update password
        user.setPassword(req.body.newPassword, function () {
          user.save()
          res.status(200).json(user);
        })
      }
    })
  }

});

router.get('/logout', checkValidToken, function(req, res) {
  req.logout(function(err){
    if(err)
      res.status(444).jsonp('error', {error: err})
    else
      res.status(200).json({'body':"test"});
  })
});

router.get('/listUsers', checkValidToken, function(req, res, next) {
  console.log("listUsers")
  User.list()
    .then(data => {
      res.status(200).jsonp(data)
    })
    .catch(err => {
      res.status(500).jsonp({error: err})
    })
  //res.status(200).jsonp(await User.list())

});

router.get('/getUser/:id', checkValidToken, async function(req, res, next) {
  console.log("get_user_id")

  User.lookup(req.params.id)
    .then(userr => {
      userResp = {};
      userResp._id = userr._id;
      userResp.email = userr.email;
      userResp.role = userr.role;
      userResp.username = userr.username;
     
      const axiosPromise = axios.get(`${process.env.USER_SERVER_PROTOCOL}://${process.env.USER_SERVER_HOST}:${process.env.USER_SERVER_PORT}/api/user/${userr._id}`);

      Promise.all([axiosPromise])
        .then(([response]) => {
          console.log(response.data);
          userResp.name = response.data.name;
          userResp.filiacao = response.data.filiacao;
          userResp.created_date = response.data.created_date;
          userResp.last_access = response.data.last_access;
          console.log(userResp);
  
          res.status(200).json(userResp);
        })
        .catch(error => {
          console.log(error);
          // Handle the error, e.g., log the error or set default values for userResp properties
  
          res.status(200).json(userResp);
        });
    })
});


module.exports = router;
