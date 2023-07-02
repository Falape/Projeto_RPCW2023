var mongoose = require('mongoose'), 
    Schema = mongoose.Schema

var resourceSchema = new Schema({
    title: { type: String, required: true, unique: true },
    author: String, // autor do recurso, pode não haver.
    uploadedBy: { type: String, required: true }, // ID do utilizador que fez o upload
    uploadedByUsername: { type: String, required: true }, // username do utilizador que fez o upload
    type: { type: String, required: true },  
    public: Boolean, // Se o recurso é público ou não
    path : String, // caminho para o ficheiro
    description: String, // descrição do recurso
    dateCreated: String,
    updateDate: String,
    //for soft delete
    deleted: Boolean,
    deleteDate : String,
    deletedBy : String, 
})


module.exports = mongoose.model('resource', resourceSchema)

