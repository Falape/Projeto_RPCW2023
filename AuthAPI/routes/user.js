var express = require('express');
const axios = require('axios');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    userModel = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");

const { checkValidToken } = require('../javascript/validateToken');

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

router.get('/getUser', checkValidToken, function(req, res, next) {
  console.log("get_updateRole_id")
  User.lookup(req.payload._id)
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


router.delete('/deleteUser', checkValidToken, function(req, res, next) {
  console.log("get_updateRole_id")
    
  User.lookup(req.payload._id)
    .then(userr => {
      User.delete(userr._id)
        .then(resp => {    
          
          try{
            axios.delete(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/delete/'+userr._id)  
          }catch(e){  
            console.log(e)
          }
          
          res.status(200).json(resp);
        })
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro getting user: ' + err })
    });
});

module.exports = router;
