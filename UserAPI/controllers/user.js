const userModel = require("../models/user");

module.exports.lookup = function(userid) {
    return userModel.findOne({userId : userid})
}

module.exports.insert = function(user) { 
    var nerUser = new userModel(user)
    return nerUser.save()
}