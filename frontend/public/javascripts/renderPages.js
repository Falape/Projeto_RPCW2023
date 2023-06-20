
const axios = require('axios');

function renderUserPage(req, res, owner=null, admin=null, passwordFlag=null, requestRoleUpdateFlag=null, updateUserFlag=null, error=null){
    console.log(passwordFlag)
    console.log(requestRoleUpdateFlag)
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

module.exports = renderUserPage;