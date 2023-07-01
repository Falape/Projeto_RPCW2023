var express = require('express');
var jwt = require('jsonwebtoken');
const axios = require('axios');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require("passport"),

  User = require("../controllers/user"),
  userModel = require("../models/user"),
  RequestUpdateRole = require("../controllers/requestUpdateRole"),
  requestUpdateRole = require("../models/requestUpdateRole");

const { checkValidToken } = require('../javascript/validateToken');
const { v4: uuidv4 } = require('uuid');

function generateUniqueUsername() {
  return 'user_' + uuidv4();
}

var router = express.Router();

// Signup
router.post("/signup", function (req, res) {
  console.log("signup");
  if (req.body.email == undefined || req.body.password == undefined || req.body.name == undefined || req.body.filiacao == undefined || req.body.username == undefined) {
    res.status(500).jsonp({ error: "Field is missing" })
  }

  var newUser = new userModel({ email: req.body.email, role: 'consumer', username: req.body.username })

  User.register(newUser, req.body.password)
    .then(nUser => {
      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
          res.status(502).jsonp({ error: "Erro na Autentificação", err: err })
        } else {
          req.login(user, { session: false }, (err) => {
            if (err) {
              res.status(503).jsonp({ error: "Erro no login" })
            } else {
              // generate a signed son web token with the contents of user object and return it in the response
              var userTosend = {}
              userTosend.id = user._id
              userTosend.role = user.role
              jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION },
                function (e, token) {
                  if (e) res.status(507).jsonp({ error: "Error creating token" })
                  else {
                    userInfo = {
                      name: req.body.name,
                      filiacao: req.body.filiacao,
                      username: req.body.username,
                      userId: user._id
                    }
                    try {
                      axios.post(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/create', userInfo)
                        .then((response) => {
                          console.log("Axios request success");
                        })
                        .catch((error) => {
                          console.log("Axios request error:", error.message);
                          // Handle the error without crashing the server
                        });
                    } catch (e) {
                      console.log(e)
                    }
                    res.status(201).jsonp(
                      {
                        token: token,
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
    })
    .catch(err => {
      if (err.code == 11000) {
        res.status(501).jsonp({ error: "Email já está registado!" })
      } else {
        console.log(err)
        res.status(501).jsonp({
          errorMessage: 'Error signing up',
          error: err.message
        });
      }
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
    } else {
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.status(500).jsonp({ error: "Erro no login" });
        }

        console.log("passa aqui")
        var userTosend = {}
        userTosend.id = user._id
        userTosend.role = user.role

        // generate a signed son web token with the contents of user object and return it in the response
        jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.TOKEN_SECRET,
          { expiresIn: process.env.TOKEN_EXPIRATION },
          function (e, token) {
            if (e) res.status(507).jsonp({ error: "Error creating token" })
            else {
              try {
                axios.get(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/updateLastAccess/' + user._id)
                  .then((response) => {
                    console.log("Axios request success");
                  })
                  .catch((error) => {
                    console.log("Axios request error:", error.message);
                    // Handle the error without crashing the server
                  });
              } catch (e) {
                console.log(e)
              }
              res.status(201).jsonp(
                {
                  token: token,
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
    userModel.authenticate()(req.payload.username, req.body.oldPassword, function (err, user, options) {
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

router.get('/logout', checkValidToken, function (req, res) {
  req.logout(function (err) {
    if (err)
      res.status(444).jsonp('error', { error: err })
    else
      res.status(200).json({ 'body': "test" });
  })
});

router.get('/listUsers', checkValidToken, function (req, res, next) {
  console.log("listUsers")
  User.list()
    .then(data => {
      res.status(200).jsonp(data)
    })
    .catch(err => {
      res.status(500).jsonp({ error: err })
    })
  //res.status(200).jsonp(await User.list())

});

router.get('/getUser/:id', checkValidToken, async function (req, res, next) {
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
    }).
    catch(err => {
      res.status(500).jsonp({error: "User não encontrado!"})
    })
});


/*  Google AUTH  */
/*
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.REDIRECT_URI;
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_REDIRECT_URI
},
  function (accessToken, refreshToken, profile, done) {
    //userProfile=profile;

    userProfile = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value, // gets the first email
      provider: profile.provider
    };
    console.log("userProfile: ", userProfile)

    return done(null, userProfile);
  }
));

router.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/callback', function (req, res, next) {
  console.log("callback")
  passport.authenticate('google', { failureJSON: { message: 'An error has occurred' } }, function (err, user, info) {
    if (err) {
      return res.status(500).json({ error: 'Erro no login1: ', err });
    }
    if (!user) {
      return res.status(500).json({ error: 'Erro no login2: ', err });
    }
    console.log("user: ", user)
    console.log("info: ", info)

    myfilter = { id_oauth: user.id }
    console.log("myfilter: ", myfilter)

    User.findByFilter(myfilter)
      .then((usr) => {
        console.log("[FILTER]user: ", usr)
        // erro ao tentar isto user.length == 0 || 
        if (usr == null) {
          console.log("user.length == 0")
          newUser = {
            username: generateUniqueUsername(),
            email: user.email,
            role: "consumer",
            method: "google",
            id_oauth: user.id
          }

          User.insert(newUser)
            .then((user) => {
              console.log("user: ", user)
              //const token = user.generateJwt();
              jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_EXPIRATION },
                function (e, token) {
                  if (e) res.status(507).jsonp({ error: "Error creating token" })
                  else {
                    userInfo = {
                      name: user.name,
                      //filiacao: req.body.filiacao,
                      username: user.username,
                      userId: user._id
                    }
                    try {
                      axios.post(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/create', userInfo)
                        .then((response) => {
                          console.log("Axios request success");
                        })
                        .catch((error) => {
                          console.log("Axios request error:", error.message);
                          // Handle the error without crashing the server
                        });
                    } catch (e) {
                      console.log(e)
                    }
                    res.status(201).jsonp(
                      {
                        token: token,
                        username: user.username,
                        role: user.role,
                        userId: user._id
                      }
                    )

                  }
                });
            })
            .catch((err) => {
              console.log("err: ", err)
              return res.status(500).json({ error: 'Erro ao registar novo utilizador ', err });
            })
        } else {
          console.log("user.length != 0")
          console.log("usr: ", usr)
          //const token = user.generateJwt();
          jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRATION },
            function (e, token) {
              if (e) res.status(507).jsonp({ error: "Error creating token" })
              else {
                userInfo = {
                  name: usr.name,
                  //filiacao: req.body.filiacao,
                  username: usr.username,
                  userId: usr._id
                }

                try {
                  axios.post(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/create', userInfo)
                    .then((response) => {
                      console.log("Axios request success");
                    })
                    .catch((error) => {
                      console.log("Axios request error:", error.message);
                      // Handle the error without crashing the server
                    });
                } catch (e) {
                  console.log(e)
                }
                res.status(201).jsonp(
                  {
                    token: token,
                    username: user.username,
                    role: user.role,
                    userId: user._id
                  }
                )

              }
            });
        }
      })
      .catch((err) => {
        console.log("err: ", err)
        return res.status(500).json({ error: 'Não foi possivel verificar o registo do utilizador ', err });
      })

    // tirar dados 
    // Verificar se tem conta interna no nosso sistema 
    //User.findByFilter({id_oauth: })
    // se tiver, cria um token e continua normalmente
    // se não tiver, cria uma conta interna, cria um token e continua normalmente
    console.log(" CHEGUEI AQUI")
    //return res.status(200).json(user);
  })(req, res, next);

});
*/

router.post('/getUserGoogleID/', function (req, res, next) {
  console.log("get_user_id")

  user_body = {
    name: req.body.name,
    id_oauth: req.body.id_oauth,
    email: req.body.email
  }

  myfilter = { id_oauth: user_body.id_oauth}
  console.log("myfilter: ", myfilter)

  User.findByFilter(myfilter)
    .then((usr) => {
      if (usr == null) {
        console.log("user.length == 0")
        console.log("usr: ", usr)
        newUser = {
          username: generateUniqueUsername(),
          email: user_body.email,
          role: "consumer",
          method: "google",
          id_oauth: user_body.id_oauth
        }

        User.insert(newUser)
          .then((user) => {
            console.log("user: ", user)
            //const token = user.generateJwt();
            jwt.sign({ _id: user._id, role: user.role, username: user.username }, process.env.TOKEN_SECRET,
              { expiresIn: process.env.TOKEN_EXPIRATION },
              function (e, token) {
                if (e) res.status(507).jsonp({ error: "Error creating token" })
                else {
                  userInfo = {
                    name: user.name,
                    //filiacao: req.body.filiacao,
                    username: user.username,
                    userId: user._id
                  }
                  try {
                    axios.post(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/create', userInfo)
                      .then((response) => {
                        console.log("Axios request success");
                      })
                      .catch((error) => {
                        console.log("Axios request error:", error.message);
                        // Handle the error without crashing the server
                      });
                  } catch (e) {
                    console.log(e)
                  }
                  res.status(201).jsonp(
                    {
                      token: token,
                      username: user.username,
                      role: user.role,
                      userId: user._id
                    }
                  )

                }
              });
          })
          .catch((err) => {
            console.log("err: ", err)
            return res.status(500).json({ error: 'Erro ao registar novo utilizador ', err });
          })
      } else {
        console.log("user.length != 0")
        console.log("usr: ", usr)
        //const token = user.generateJwt();
        jwt.sign({ _id: usr._id, role: usr.role, username: usr.username }, process.env.TOKEN_SECRET,
          { expiresIn: process.env.TOKEN_EXPIRATION },
          function (e, token) {
            if (e) res.status(507).jsonp({ error: "Error creating token" })
            else {
              userInfo = {
                name: usr.name,
                //filiacao: req.body.filiacao,
                username: usr.username,
                userId: usr._id
              }

              res.status(201).jsonp(
                {
                  token: token,
                  username: usr.username,
                  role: usr.role,
                  userId: usr._id
                }
              )

            }
          });
      }
    })
    .catch((err) => {
      console.log("err: ", err)
      return res.status(500).json({ error: 'Não foi possivel obter o user, erro: ', err });
    })
});




module.exports = router;
