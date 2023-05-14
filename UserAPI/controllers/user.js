const userModel = require("../models/user");

module.exports.insert = function(user) { 
    var nerUser = new userModel(user)
    return nerUser.save()
}