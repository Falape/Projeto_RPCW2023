var express = require('express');
User = require("../models/user");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({'body':"test"});
});


router.post("/register", function (req, res) {
  console.log(req.body);
  //console.log(req.body.password);
  User.register(new User({email: req.body.email, role : 'consumer'}), req.body.password, function (err, user) {
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
        jwt.sign({ _id:user._id, role: user.role, email: user.email}, 'O Ramalho e fixe',
                {expiresIn: process.env.TOKEN_EXPIRATION}, 
                function(e, token){
                  if(e) res.status(507).jsonp({error:"Erro na geração de token"})
                  else res.status(201).jsonp({token:token,  userData:userTosend})
        });
      });
    })(req, res);
  });
});

module.exports = router;
