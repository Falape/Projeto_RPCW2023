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
        console.log(response);
  
      // TODO: Render the home page or redirect to a different route
      res.render('user_page', { user: response.data, owner:true });
      })
      .catch((error) => {
        console.log(error);
        res.render('error_page', { message: error.response.data.error });
  });
});

module.exports = router;
