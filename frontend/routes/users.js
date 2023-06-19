var express = require('express');
var router = express.Router();
const axios = require('axios');

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
              renderUserPage(req, res, true, false, false,undefined,undefined,error.response.data.error);
          });
      }
});

function renderUserPage(req, res, owner=null, admin=null, passwordFlag=null, requestRoleUpdateFlag=null, updateUserFlag=null, error=null){
  axios.get(process.env.API_AUTH_URL + '/user/getUser',{
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
      .then((response) => {
        console.log(error)
        res.render('user_page', { user: response.data, owner:owner, admin:admin, passwordFlag:passwordFlag, requestRoleUpdateFlag:requestRoleUpdateFlag, updateUserFlag:updateUserFlag, error:error });
      })
      .catch((error) => {
        //console.log(error);
        res.render('error_page', { message: error.response.data.error });
  });
}



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
