var express = require('express');
var router = express.Router();
const axios = require('axios');
const {renderUserPage} = require('../public/javascripts/renderPages')

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const alerts = req.session.alerts;
  req.session.alerts = {}

  axios.get(process.env.API_AUTH_URL + '/user/getUser',{
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
      .then((response) => {
        
        // TODO: Render the home page or redirect to a different route
        res.render('user_page', { user: response.data, userInfo:req.session.user, owner:true, passwordFlag : alerts.passwordFlag, requestRoleUpdateFlag: alerts.requestRoleUpdateFlag, userDeletedFlag: alerts.userDeletedFlag, msg: alerts.msg });
      })
      .catch((error) => {
        console.log(error);
        res.render('error_page', { message: error.response.data.error });
  });
}); 


router.post('/updatePassword', function(req, res, next) {
  console.log("updatePassword")
  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log(req.body);

   if(req.body.oldPassword == undefined){
    //res.render('error_page', { message: "Old password missing!" });
    req.session.alerts = {
      passwordFlag: false,
      msg: "Password antiga em falta!"
    }
    //renderUserPage(req, res, true, false, null, null, null, "Old password missing!" );
    res.redirect('/users/getUser')
   }else 
      if(req.body.newPassword != req.body.newPasswordConfirm){
        //res.render('error_page', { message: "New password and confimation doesn't match!" });
        req.session.alerts = {
          passwordFlag: false,
          msg: "Password nova e confirmação não coincidem!"
        }
        res.redirect('/users/getUser')
        //renderUserPage(req, res, true, false, null, null, null, "New password and confimation doesn't match!" );
      } else{

          axios.post(process.env.API_AUTH_URL + '/updatePassword', {
              oldPassword: req.body.oldPassword,
              newPassword: req.body.newPassword
            }, {
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
            .then((response) => {
              //console.log(response);
            
              //res.render('user_page', { user: response.data, owner:true, admin:false, passwordFlag:true });
              req.session.alerts = {
                passwordFlag: true
              } 
              //renderUserPage(req, res, true, true, null, null, null, null);
              res.redirect('/users/getUser')
            })
            .catch((error) => {
              console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response && error.response.data){
                req.session.alerts = {
                  passwordFlag: false,
                  msg: error.response.data.error
                }
                //renderUserPage(req, res, true, false, null, null, null,error.response.data.error);
                res.redirect('/users/getUser')
              }else{
                res.render('error_page', { message: error });
              }
          });
      }
});

router.post('/requestRoleUpdate', function(req, res, next) {
  console.log("requestRoleUpdate")
  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log(req.body);
    if(req.body.role == undefined){
      req.session.alerts = {
        requestRoleUpdateFlag: false,
        msg: "Role em falta!"
      }
      //renderUserPage(req, res, true, null, false, null, null, "Role missing!");
      res.redirect('/users/getUser')
    }else{
      axios.post(process.env.API_AUTH_URL + '/user/requestUpdateRole', {
            required_Role: req.body.role
            }, {
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
            .then((response) => {
              //console.log(response);
            
              req.session.alerts = {
                requestRoleUpdateFlag: true
              }
              //renderUserPage(req, res, true, null, true, null, null, null);
              res.redirect('/users/getUser')
            })
            .catch((error) => {
              console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response && error.response.data){

                req.session.alerts = {
                  requestRoleUpdateFlag: false,
                  msg: error.response.data.error
                }
                //renderUserPage(req, res, true, null, false, null, null, error.response.data.error);
                res.redirect('/users/getUser')
              }else{
                res.render('error_page', { message: error });
              }
          });
    }
});

router.get('/delete', function(req, res, next) {
  console.log("delete")
  if (!req.session.user) {
    return res.redirect('/login');
  }

  //console.log(req.body);

  console.log(req.session.user.token)
  axios.delete(process.env.API_AUTH_URL + '/user/deleteUser', {
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
            .then((resp) => {
              //console.log(response);
              axios.delete(process.env.API_DATA_URL + '/api/delete/hard/user/' + req.session.user.userId, {
                headers: {
                  Authorization: `Bearer ${req.session.user.token}`
                }
              })
              .then((resp1) => {
                console.log("Apagou recursos do utilizador e comentários que estes tinha")
                axios.delete(process.env.API_DATA_URL + '/api/delete/hard/comments/'  + req.session.user.userId, {
                  headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                  }
                })
                .then((resp2) => {
                  console.log("Apagou os comentários")
                })
                .catch((error) => {
                  console.log(error);
                  //res.render('error_page', { message: error.response.data.error });
                });
              })
              .catch((error) => {
                console.log(error);
                //res.render('error_page', { message: error.response.data.error });
              });
              //res.render('user_page', { user: response.data, owner:true, admin:false, requestRoleUpdateFlag:true });
              req.session.alerts={
                userDeletedFlag: true,
                msg: "Utilizador apagado!"
              }
              res.redirect('/login');
            })
            .catch((error) => {
              //console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response && error.response.data){
                renderUserPage(req, res, true, null, null, null, false,error.response.data.error);
              }else{
                res.render('error_page', { message: error });
              }
          });
});




router.get('/recursos/:id', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  // make request to daa api to get all resources
  axios.post(process.env.API_DATA_URL + '/resource', {uploadedBy: req.params.id}, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
  .then((response) => {
    console.log(response.data);
    if (response.data.length > 0) {
      id_user = response.data[0].uploadedByUsername;
    }
    else {
      id_user = ""
    }
    res.render('list_resources3', {userInfo:req.session.user, resources: response.data, user : id_user});
  })
  .catch((error) => {
    console.log(error);
    res.render('error_page', { message: "Não foi possivel obter os recursos do utilizador." });
  });
});



module.exports = router;
