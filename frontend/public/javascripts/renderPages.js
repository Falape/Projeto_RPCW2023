
const axios = require('axios');

function renderUserPage(req, res, owner=null, passwordFlag=null, requestRoleUpdateFlag=null, updateUserFlag=null, deleteUserFlag=null, error=null){
    //console.log(requestRoleUpdateFlag)
    axios.get(process.env.API_AUTH_URL + '/user/getUser',{
                headers: {
                  Authorization: `Bearer ${req.session.user.token}`
                }
              })
        .then((response) => {
          //console.log(req.session.user)
          res.render('user_page', { user: response.data, owner:owner, userInfo:req.session.user, passwordFlag:passwordFlag, requestRoleUpdateFlag:requestRoleUpdateFlag, updateUserFlag:updateUserFlag, deleteUserFlag:deleteUserFlag, error:error });
        })
        .catch((error) => {
          //console.log(error);
          res.render('error_page', { message: error.response.data.error });
    });
}

//the deleteFlag is in case it fails to delete
function renderResourcePage(req, res, resourceId, downloadFlag=null, updateFlag = null, deleteFlag = null,flagError=null){
  axios.get(process.env.API_DATA_URL + '/resource/' + resourceId,
    {
      headers: {
        Authorization: `Bearer ${req.session.user.token}`
      }
    })
    .then((response) => {
      console.log(response.data);
      // need to get resource files
      axios.get(process.env.API_DATA_URL + '/file/resource/' + resourceId,
        {
          headers: {
            Authorization: `Bearer ${req.session.user.token}`
          }
        })
        .then((response2) => {
          console.log(response2.data);

          // need to get resource rating
          axios.get(process.env.API_DATA_URL + '/rating/resource/' + resourceId,
            {
              headers: {
                Authorization: `Bearer ${req.session.user.token}`
              }
            })
            .then((response3) => {
              //tries to get the comments
              axios.get(process.env.API_DATA_URL + '/comment/resource/' + resourceId,
                {
                  headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                  }
                })
                .then((response4) => {
                  console.log(response4.data);
                  res.render('resource', { resource: response.data, userInfo:req.session.user 
                    ,files: response2.data ,rating: response3.data, comments: response4.data, 
                    downloadFlag:downloadFlag, updateFlag:updateFlag, deleteFlag:deleteFlag, 
                    flagError:flagError});
                })
                .catch((error) => {
                  //res.render('error_page', { message: "Não foi possivel obter os comentários do recurso." });
                  res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: response3.data, comments: "", commentFlag: false, downloadUrl: process.env.FRONT_URL + '/download/resource/'+resourceId, error: "Não foi possivel obter os comentários do recurso.", downloadFlag:downloadFlag, updateFlag:updateFlag, deleteFlag:deleteFlag, flagError:flagError});
                })
            })
            .catch((error) => {
              console.log(error);
              
              //failed to get the rating, it will try to get the comments
              axios.get(process.env.API_DATA_URL + '/comment/resource/' + resourceId,
                {
                  headers: {
                    Authorization: `Bearer ${req.session.user.token}`
                  }
                })
                //got the comments
                .then((response4) => {
                  console.log(response4.data);
                  //res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: response3.data, comments: response4.data, downloadUrl: process.env.FRONT_URL + '/download/resource/'+resourceId });
                  res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: "", comments: response4.data, downloadUrl: process.env.FRONT_URL + '/download/resource/'+resourceId, error:"Não foi possivel obter o rating do recurso.", downloadFlag:downloadFlag, updateFlag:updateFlag, deleteFlag:deleteFlag, flagError:flagError});
                })
                //failed to get the comments
                .catch((error) => {
                  //res.render('error_page', { message: "Não foi possivel obter os comentários do recurso." });
                  res.render('resource', { resource: response.data, userInfo:req.session.user ,files: response2.data ,rating: "", comments: "", commentFlag: false, downloadUrl: process.env.FRONT_URL + '/download/resource/'+resourceId, error: "Não foi possivel obter o rating nem os comentários do recurso.", downloadFlag:downloadFlag, updateFlag:updateFlag, deleteFlag:deleteFlag, flagError:flagError});
                })

            })
        })
        .catch((error) => {
          console.log(error);
          res.render('error_page', { message: "Não foi possivel obter os ficheiros do recurso." });
        })
    })
    .catch((error) => {
      console.log(error);
      res.render('error_page', { message: "Não foi possivel obter o recurso desejado." });
    });
}


function renderListUsers(req, res, flagError=null, error=null){
  axios.get(process.env.API_AUTH_URL + '/listUsers', {
    headers: {
      Authorization: `Bearer ${req.session.user.token}`
    }
  })
  .then((rep) => {
    console.log(rep.data.token)
    if (!req.session) {
      return res.redirect('/login')//res.status(500).send('Session object is undefined');
    }

    //console.log(rep.data)
    //TODO: render home page
    res.render('list_user', {userInfo:req.session.user, userList: rep.data, flagError:flagError, error:error});
  }).catch((err) => {
    console.log(err)
    if (err.response && err.response.data){
      console.log(err.response.data)
      res.render('error_page', { message: err.response.data.error });
    }else{
      res.render('error_page', { message: err });
    }
  });
}

// function renderListRoleUpdateRequests(req, res, acceptedFlag=null, errorFlag=null){
//   axios.get(process.env.API_AUTH_URL + '/admin/updateRoleList',{
//     headers: {
//         Authorization: `Bearer ${req.session.user.token}`
//     }
//     })
//   .then((response) => {
//     console.log(response.data)
//     res.render('listRequestUpdate', { roleUpdatesList: response.data, userInfo:req.session.user, acceptedFlag:acceptedFlag, errorFlag:errorFlag});
//   })
//   .catch((error) => {
//     console.log(error);
//     res.render('error_page', { message: error.response.data.error });
//   });
// }

// function renderNoticiasPage(res, req, body={}, userDeletedFlag =null, resourceDeleted = null, errorFlag= null ,error=null){
//   body = body// pode ser usado para filtrar
//     axios.post(process.env.API_DATA_URL + '/noticia/', body, {
//       headers: {
//         Authorization: `Bearer ${req.session.user.token}`
//       }
//     })
//       .then((notic) => {
//         console.log(notic.data)
//         res.render('noticias', { noticias: notic.data, userInfo: req.session.user, userDeletedFlag: userDeletedFlag, resourceDeleted: resourceDeleted, errorFlag: errorFlag, error:error });
//       })
//       .catch((err) => {
//         console.log(err)
//         res.render('error_page', { message: "Não foi possivel mostrar as noticias." });
//       });
// }




module.exports = {renderUserPage, renderResourcePage, renderListUsers};