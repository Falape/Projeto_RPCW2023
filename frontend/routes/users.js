var express = require('express');
var router = express.Router();
const axios = require('axios');
const renderUserPage = require('../public/javascripts/renderUserPage')

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
        res.render('user_page', { user: response.data, owner:true });
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
    res.render('error_page', { message: "Old password missing!" });
   }else 
      if(req.body.newPassword != req.body.newPasswordConfirm){
        res.render('error_page', { message: "New password and confimation doesn't match!" });
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
              renderUserPage(req, res, true, false, true);
            })
            .catch((error) => {
              console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response.data.error != undefined){
                renderUserPage(req, res, true, false, false,null,null,error.response.data.error);
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
      renderUserPage(req, res, true, false, null, false, null, "Role missing!");
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
              renderUserPage(req, res, true, false, null, true);
            })
            .catch((error) => {
              console.log(error);
              //res.render('error_page', { message: error.response.data.error });
              if (error.response.data.error != undefined){
                renderUserPage(req, res, true, false, undefined, false, undefined, error.response.data.error);
              }else{
                res.render('error_page', { message: error });
              }
          });
    }
});



router.get('/recursos/:id', function(req, res, next) {
  
  // make request to daa api to get all resources
  axios.post(process.env.API_DATA_URL + '/resource', {uploadedBy: req.params.id})
  .then((response) => {
    console.log(response.data);
    res.render('list_resources3', { resources: response.data, user : req.session.user.username});
  })
  .catch((error) => {
    console.log(error);
    res.render('error_page', { message: error });
  });
});



module.exports = router;
