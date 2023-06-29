var express = require('express');
const axios = require('axios');
var jwt = require('jsonwebtoken');
const passport = require("passport"),

    User = require("../controllers/user"),
    userModel = require("../models/user"),
    RequestUpdateRole = require("../controllers/requestUpdateRole"),
    requestUpdateRole = require("../models/requestUpdateRole");
  
const { checkValidTokenAdmin } = require('../javascript/validateToken');

var router = express.Router();

//gets the list of requests for role update
router.get('/updateRoleList', checkValidTokenAdmin, function(req, res, next) {
  console.log("updateRoleList")

  //if(req.body.accepted == undefined || req.body.accepted == null){
    RequestUpdateRole.list()
      .then(list => {
        res.status(200).jsonp(list);
      })
      .catch(error => {
        res.status(400).jsonp({ error: error.message });
      });
});

//gets the request for role update by id
router.get('/updateRole/:id', checkValidTokenAdmin,async function(req, res, next) {
  console.log("get_updateRole_id")

  res.status(200).json(await RequestUpdateRole.lookup(req.params.id));
});

//accepts or rejects the request for role update
router.post('/updateRole/:id', checkValidTokenAdmin, async function(req, res, next) {
  console.log("get_updateRole_id")

  //accpet must be true or false
  if(req.body.accept == undefined || req.body.accept == null){
    res.status(400).jsonp({error:"Field is missing"})
  }else{
    //update the reuqestUpdateRole
    var updateRole = await RequestUpdateRole.lookup(req.params.id);
    updateRole.accepted = req.body.accept;
    updateRole.admin_Id = req.payload._id;
    updateRole.accepted_date = Date.now();
    await updateRole.save();
    
    //if it was accepted then updates the user role
    if(req.body.accept == true){
       
      User.lookup(updateRole.user_id)
        .then(userToUpdate => {
          userToUpdate.role = updateRole.required_Role;
          userToUpdate.save()
          .then(savedUser => {
            res.status(200).json(savedUser);
          });
        });
    }
  }
});

router.get('/updateRole/accept/:id', checkValidTokenAdmin, function(req, res, next) {
  console.log("accept_updateRole_id")

  RequestUpdateRole.lookup(req.params.id)
  .then(updateRole => {
    User.lookup(updateRole.user_id)
      .then(userToUpdate => {
        userToUpdate.role = updateRole.required_Role;
        userToUpdate.save()
        .then(savedUser => {
          RequestUpdateRole.delete(req.params.id)
          res.status(200).json(savedUser);
        });
      });
  })
  .catch(error => {
    res.status(400).jsonp({ error: "Não encontrou o pedido!" });
  });
});

router.get('/updateRole/refuse/:id', checkValidTokenAdmin, function(req, res, next) {
  console.log("refuse_updateRole_id")

  RequestUpdateRole.delete(req.params.id)
  .then(() => {
    res.status(200).json({message: "Pedido apagado com sucesso!"});
  })
  .catch(error => {
    res.status(400).jsonp({ error: "Não encontrou o pedido!" });
  })
});


//Get user by id
router.get('/getUser/:id', checkValidTokenAdmin, async function(req, res, next) {
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

router.post('/listUsers', checkValidTokenAdmin,async function(req, res, next) {
  console.log("listUsers")

  res.status(200).jsonp(await User.list())

});


router.post("/updatePassword/:id", checkValidTokenAdmin, async function (req, res) {
  console.log("updatePassword")

  if (req.body.newPassword == undefined) {
    res.status(400).jsonp({ error: "Field is missing" })
  } else {
    userModel.findOne({ _id: req.params.id })
    .then(user => {
      if (!user) {
        return res.status(404).jsonp({ error: 'User not found' });
      }

      // Update the user's password
      user.setPassword(req.body.newPassword, function (err) {
        if (err) {
          return res.status(500).jsonp({ error: 'Error setting password: ' + err });
        }

        user.save()
          .then(() => {
            return res.status(200).json(user);
          })
          .catch(err => {
            return res.status(500).jsonp({ error: 'Error updating password: ' + err });
          });
      });
    })

    // Update the user's password
    
  } 

});

router.delete('/deleteUser/:id', checkValidTokenAdmin, function(req, res, next) {
  console.log("DeleteUser by id") 

  User.lookup(req.params.id)
    .then(userr => {
      User.delete(req.params.id)
        .then(resp => {       
          
          try{
            console.log("delete user from user server, id: "+userr._id)
            axios.delete(process.env.USER_SERVER_PROTOCOL + '://' + process.env.USER_SERVER_HOST + ':' + process.env.USER_SERVER_PORT + '/api/delete/'+userr._id)  
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
          res.status(200).json(resp);
        })
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro getting user: ' + err })
    });
  
});

router.put('/updateUser/:id', checkValidTokenAdmin, function(req, res, next) {
  console.log("updateUser by id") 

  User.lookup(req.params.id)
    .then(userr => {
      if(req.body.username != undefined && req.body.username != null){
        userr.username = req.body.username;
      }
      if(req.body.email != undefined && req.body.email != null){
        userr.email = req.body.email;
      }
      userr.save()
       .then(savedUser => {
         res.status(200).json(savedUser);
       })
       .catch(err => {
        res.status(500).jsonp({ error: 'Erro updating user: ' + err })
       });
    })
    .catch(err => {
      res.status(500).jsonp({ error: 'Erro getting user: ' + err })
    });

});

module.exports = router;
