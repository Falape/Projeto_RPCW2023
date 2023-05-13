const RequestUpdateRole = require('../models/requestUpdateRole')


module.exports.list = function () {
    return RequestUpdateRole
        .find()  //procurar parametros
        .exec()
}

module.exports.filter = function (accepted) {

    return RequestUpdateRole
        .find({accepted : accepted})  //procurar parametros
        .exec()
}



module.exports.lookup = function(id) { 
    return RequestUpdateRole
        .findOne({_id:id})  //devolve só o obejto se fosse find devolvia uma lista com o objeto
        .exec()
}


module.exports.insert = function(requestUpdateRole) { 
    var newRequestUpdateRole = new RequestUpdateRole(requestUpdateRole)
    return newRequestUpdateRole.save()
}
