var express = require('express');
var router = express.Router();
const axios = require('axios');
//const {renderNoticiasPage } = require('../public/javascripts/renderPages')

router.get('/updateRequests', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  const alerts = req.session.alerts;
  req.session.alerts = {}

  axios.get(process.env.API_AUTH_URL + '/admin/updateRoleList', {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data)
      res.render('listRequestUpdate', { roleUpdatesList: response.data, userInfo: req.session.user, acceptedFlag: alerts.acceptedFlag, errorFlag: alerts.errorFlag });
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: error.response.data.error });
    });

  //renderListRoleUpdateRequests(req, res);
});

router.post('/updatePassword/:id', function (req, res, next) {
  console.log("updatePasswordById")
  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log(req.body);

  //  if(req.body.oldPassword == undefined){
  //   //res.render('error_page', { message: "Old password missing!" });
  //   req.session.alerts = {
  //     passwordFlag: false,
  //     msg: "Password antiga em falta!"
  //   }
  //   //renderUserPage(req, res, true, false, null, null, null, "Old password missing!" );
  //   res.redirect('/users/getUser')

  if (req.body.newPassword != req.body.newPasswordConfirm) {
    //res.render('error_page', { message: "New password and confimation doesn't match!" });
    req.session.alerts = {
      passwordFlag: false,
      msg: "Password nova e confirmação não coincidem!"
    }
    res.redirect('/getUser/' + req.params.id)
    //renderUserPage(req, res, true, false, null, null, null, "New password and confimation doesn't match!" );
  } else {

    axios.post(process.env.API_AUTH_URL + '/admin/updatePassword/' + req.params.id, {
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
        res.redirect('/getUser/' + req.params.id)
      })
      .catch((error) => {
        console.log(error);
        //res.render('error_page', { message: error.response.data.error });
        if (error.response && error.response.data) {
          req.session.alerts = {
            passwordFlag: false,
            msg: error.response.data.error
          }
          //renderUserPage(req, res, true, false, null, null, null,error.response.data.error);
          res.redirect('/getUser/' + req.params.id)
        } else {
          res.render('error_page', { message: error });
        }
      });
  }
});

router.get('/requestRoleUpdate/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  console.log(req.query.accept)
  if (req.query.accept != undefined) {

    axios.get(process.env.API_AUTH_URL + '/admin/updateRoleAcceptRefuse/' + req.params.id, {
      params: {
        accept: req.query.accept
      },
      headers: {
        Authorization: `Bearer ${req.session.user.token}`
      }
    })
      .then((response) => {
        console.log(response.data)
        if (req.query.accept == "true") {
          req.session.alerts = {
            acceptedFlag: true,
          }
        } else {
          req.session.alerts = {
            acceptedFlag: false,
          }
        }
        res.redirect('/admin/updateRequests')
        //renderListRoleUpdateRequests(req, res, true, null)
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data) {
          req.session.alerts = {
            errorFlag: true,
            msg: error.response.data.error
          }
          res.redirect('/admin/updateRequests')
          //renderListRoleUpdateRequests(req, res, null, error.response.data.error)
        } else {
          res.render('error_page', { message: error });
        }
      });
  } else
    res.render('error_page', { message: "Missing accept parameter!" });
});


router.get('/delete/:id', function (req, res, next) {
  console.log("delete by id with admin")
  console.log(req.session)
  if (!req.session.user) {
    return res.redirect('/login');
  }

  //console.log(req.body);

  console.log(req.params.id)
  axios.delete(process.env.API_AUTH_URL + '/admin/deleteUser/' + req.params.id, {
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
          axios.delete(process.env.API_DATA_URL + '/api/delete/hard/comments/' + req.params.id, {
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
      req.session.alerts = {
        userDeletedFlag: true
      }
      //renderNoticiasPage(res, req);
      res.redirect('/noticias');
    })
    .catch((error) => {
      //console.log(error);
      //res.render('error_page', { message: error.response.data.error });
      if (error.response && error.response.data) {
        //It will be a diferente render
        req.session.alerts = {
          userDeletedFlag: false,
          msg: error.response.data.error
        }
        //renderUserPage(req, res, true, null, null, null, false, error.response.data.error);
        res.redirect('/users/getUser/' + req.params.id);
      } else {
        res.render('error_page', { message: error });
      }
    });
});

router.get('/noticia/add', function (req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('add_noticia', {userInfo: req.session.user});
});

router.post('/noticia/add', function (req, res, next) {
  console.log("Creating new noticia");
  
  if (!req.session.user) {
    return res.redirect('/login');
  }

  console.log(req.body);

  // you may want to add validation for req.body.title, req.body.public, and req.body.content

  axios.post(process.env.API_DATA_URL + '/noticia/addAviso', {
    title: req.body.title,
    public: req.body.public === "true" ? true : false,
    content: req.body.content
  }, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      req.session.alerts = {
        noticiaFlag: true,
      }
      res.redirect('/noticias') // redirect to where you list your noticias
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data) {
        req.session.alerts = {
          noticiaFlag: false,
          msg: error.response.data.error
        }
        res.redirect('/admin/noticia/add')
      } else {
        res.render('error_page', { message: error });
      }
    });
});


module.exports = router;