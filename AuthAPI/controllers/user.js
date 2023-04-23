const User = require('../models/user')


module.exports.list = function () {
    return User
        .find()  //procurar parametros
        .exec()
}

module.exports.lookup = function(id) { 
    return User
        .findOne({ username:id})  //devolve só o obejto se fosse find devolvia uma lista com o objeto
        .exec()
}


module.exports.insert = function(user) { 
    var newUser = new User(user)
    return newUser.save()
}
