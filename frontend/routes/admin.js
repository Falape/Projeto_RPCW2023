var express = require('express');
var router = express.Router();
const axios = require('axios');
const { renderListRoleUpdateRequests, renderNoticiasPage } = require('../public/javascripts/renderPages')

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

router.get('/requestRoleUpdate/accept/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  axios.get(process.env.API_AUTH_URL + '/admin/updateRole/accept/' + req.params.id, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data)
      req.session.alerts = {
        acceptedFlag: true,
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
});

router.get('/requestRoleUpdate/refuse/:id', function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  axios.get(process.env.API_AUTH_URL + '/admin/updateRole/refuse/' + req.params.id, {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
    .then((response) => {
      console.log(response.data)
      req.session.alerts = {
        acceptedFlag: true,
      }
      res.redirect('/admin/updateRequests')
      //renderListRoleUpdateRequests(req, res, false, null)
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
      renderNoticiasPage(res, req, {}, true, null, null, null);
      //res.render('noticias', { userInfo: req.session.user, userDeletedFlag: true});
    })
    .catch((error) => {
      //console.log(error);
      //res.render('error_page', { message: error.response.data.error });
      if (error.response && error.response.data) {
        renderUserPage(req, res, true, null, null, null, false, error.response.data.error);
      } else {
        res.render('error_page', { message: error });
      }
    });
});

module.exports = router;