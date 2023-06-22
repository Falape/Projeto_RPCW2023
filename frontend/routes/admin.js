var express = require('express');
var router = express.Router();
const axios = require('axios');
const {renderListRoleUpdateRequests} = require('../public/javascripts/renderPages')

router.get('/updateRequests', function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    renderListRoleUpdateRequests(req, res);
});

router.get('/requestRoleUpdate/accept/:id', function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    axios.get(process.env.API_AUTH_URL + '/admin/updateRole/accept/' + req.params.id,{
                headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                }
                })
        .then((response) => {
            console.log(response.data)
            renderListRoleUpdateRequests(req, res, true, null)
        })
        .catch((error) => {
            console.log(error);
            if(error.response && error.response.data){
                renderListRoleUpdateRequests(req, res, null, error.response.data.error)
            }else{
                res.render('error_page', { message: error });
            }
    });
});

router.get('/requestRoleUpdate/refuse/:id', function(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    axios.get(process.env.API_AUTH_URL + '/admin/updateRole/refuse/' + req.params.id,{
                headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                }
                })
        .then((response) => {
            console.log(response.data)
            renderListRoleUpdateRequests(req, res, false, null)
        })
        .catch((error) => {
            console.log(error);
            if(error.response && error.response.data){
                renderListRoleUpdateRequests(req, res, null, error.response.data.error)
            }else{
                res.render('error_page', { message: error });
            }
    });
});


module.exports = router;