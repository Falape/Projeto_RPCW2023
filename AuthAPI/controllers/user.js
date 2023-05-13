const User = require('../models/user')


module.exports.list = function () {
    return User
        .find()  //procurar parametros
        .exec()
}

module.exports.filter = function (deleted) {
    return User
        .find({deleted:deleted})  //procurar parametros
        .exec()
}

module.exports.lookup = function(id) { 
    return User
        .findOne({_id:id})  //devolve só o obejto se fosse find devolvia uma lista com o objeto
        .exec()
}

module.exports.findByFilter = function(filter) { 
    return User
        .findOne(filter)  //devolve só o obejto se fosse find devolvia uma lista com o objeto
        .exec()
}

module.exports.insert = function(user) { 
    var newUser = new User(user)
    return newUser.save()
}
