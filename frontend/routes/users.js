var express = require('express');
var router = express.Router();
const axios = require('axios');
const {renderUserPage} = require('../public/javascripts/renderPages')

/* GET users listing. */
router.get('/getUser', function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  axios.get(process.env.API_AUTH_URL + '/user/getUser',{
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
      .then((response) => {
        
        // TODO: Render the home page or redirect to a different route
        res.render('user_page', { user: response.data, owner:true, userInfo:req.session.user});
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
    renderUserPage(req, res, true, false, null, null, null, "Old password missing!" );
   }else 
      if(req.body.newPassword != req.body.newPasswordConfirm){
        //res.render('error_page', { message: "New password and confimation doesn't match!" });
        renderUserPage(req, res, true, false, null, null, null, "New password and confimation doesn't match!" );
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
              renderUserPage(req, res, true, true, null, null, null, null);
            })
            .catch((error) => {
              console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response && error.response.data){
                renderUserPage(req, res, true, false, null, null, null,error.response.data.error);
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
      //(req, res, owner=null, admin=null, passwordFlag=null, requestRoleUpdateFlag=null, updateUserFlag=null, error=null)
      renderUserPage(req, res, true, null, false, null, null, "Role missing!");
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
            
              //res.render('user_page', { user: response.data, owner:true, admin:false, requestRoleUpdateFlag:true });
              renderUserPage(req, res, true, null, true, null, null, null);
            })
            .catch((error) => {
              console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response && error.response.data){
                renderUserPage(req, res, true, null, false, null, null, error.response.data.error);
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
              res.render('login', { userDeleted: true, msg: "Utilizador apagado!" });
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
              res.render('login', { userDeleted: true, msg: "Utilizador apagado!" });
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

router.get('/delete/:id', function(req, res, next) {
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
              axios.delete(process.env.API_DATA_URL + '/api/delete/hard/user/' + req.params.id, {
                headers: {
                  Authorization: `Bearer ${req.session.user.token}`
                }
              })
              .then((resp1) => {
                console.log("Apagou recursos do utilizador e comentários que estes tinha")
                axios.delete(process.env.API_DATA_URL + '/api/delete/hard/comments/'  + req.params.id, {
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
              renderNoticiasPage(res,req,true, null, null, null);
              res.render('noticias', { userInfo: req.session.user, userDeletedFlag: true});
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
