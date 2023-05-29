const userModel = require("../models/user");

module.exports.getUser = function(userid) {
    return userModel.findOne({userId : userid})
}

module.exports.insert = function(user) { 
    var newUser = new userModel(user)
    return newUser.save()
}


module.exports.updateLastAccess = (id, date) => {
    return userModel.updateOne({userId:id},{last_access:date})
        .then(() =>{
            console.log("inseriu o last access")
            return userModel.findOne({_id:id})
        })
        .catch(erro => {
            throw erro
        })
}


module.exports.updateUser = (id, info) => {
    return userModel.updateOne({_id:id}, info)
        .then(() =>{
            return userModel.findOne({_id:id})
        })
        .catch(erro => {
            throw erro
        })
}


module.exports.hardDelete= id => {
    return userModel.deleteOne({userId:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}