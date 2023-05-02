var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose");

var RequestUpdateRoleSchema = new mongoose.Schema({
    user_id: { type: String, required: true},
    current_Role: { type: String, required: true },  //FIX set default values CONSUMER, PRODUCER, ADMIN
    required_Role: { type: String, required: true },  //{ type: String, required: true },
    accepted: { type: String, default: null }, //set date?
    admin_Id: { type: String }
});

//RequestUpdateRoleSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", RequestUpdateRoleSchema);