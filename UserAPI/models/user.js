var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
    name: String, //{ type: String, required: true },
    username: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true },
    filiacao: String,
    created_date : { type: String, required: true },
    last_access : String,
    // deleted: { type: Boolean, default: false },
    // deleted_date : { type: Date, default: null },
});


module.exports = mongoose.model("User", UserSchema);