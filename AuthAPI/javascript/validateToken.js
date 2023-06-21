var jwt = require('jsonwebtoken');

// Check if token is valid
function checkValidToken(req, res, next) {
  
    const authHeader = req.headers['authorization']
    //console.log("authHeader: "+authHeader)
    const token = authHeader && authHeader.split(' ')[1];
    //console.log("token: "+token)
  
    if(authHeader){
      //console.log("authHeader")
      jwt.verify(token, process.env.TOKEN_SECRET, function (e, payload) {
        if (e) res.status(401).jsonp({error:'Erro na verificação do token: ' + e})
        else {      
          req.payload=payload;
          next();
        }
      })
    }else{
      console.log("No token provided")
      res.status(401).jsonp({error:'No token provided'})
    }
  }



  // Check if token is valid for admin
function checkValidTokenAdmin(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
  
    if(authHeader){
      jwt.verify(token, process.env.TOKEN_SECRET, function (e, payload) {
        if (e) res.status(401).jsonp({error:'Erro na verificação do token: ' + e})
        else {
          if(payload.role != 'admin'){
            res.status(401).jsonp({error:'Not authorized'})
          }else{
            req.payload=payload;
            next();
          }
        }
      })
    }else{
      res.status(401).jsonp({error:'No token provided'})
    }
  }

module.exports = {
    checkValidToken,
    checkValidTokenAdmin
}