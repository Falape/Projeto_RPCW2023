var mongoose = require('mongoose'), 
    Schema = mongoose.Schema

var resourceSchema = new Schema({
    title: { type: String, required: true },
    author: String, // autor do recurso, pode não haver.
    uploadedBy: { type: String, required: true }, // ID do utilizador que fez o upload
    type: { type: String, required: true },  
    public: Boolean, // Se o recurso é público ou não
    dateCreated: String,
    path: { type: String, required: true },
    browserSupported : { type: Boolean, required: true },
    //for soft delete
    deleted: Boolean,
    deleteDate : String,
    deletedBy : String, 
})


module.exports = mongoose.model('resource', resourceSchema)

