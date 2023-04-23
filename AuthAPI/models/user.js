var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: {type: String, unique:true, required: 'Please enter your email', trim: true, lowercase:true},
    password: { type: String, required: true },
    role: { type: String, required: true }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);