var mongoose = require('mongoose'), 
    Schema = mongoose.Schema

var noticiaSchema = new Schema({
    title: { type: String, required: true},
    uploadedBy: { type: String, required: true }, // ID do utilizador que fez o upload
    uploadedByUsername: { type: String, required: true }, // username do utilizador que fez o upload
    resourceId: { type: Schema.Types.ObjectId, ref: 'resource',  unique: true }, // ID do recurso a que pertence o comentário
    type: { type: String},  
    public: {type : Boolean, required : true}, // Se o recurso é público ou não
    content : {type : String}, // avisos do admin
    power : {type : Boolean, default : false}, // poder do admin
    dateCreated: String,
    //updateDate: String,
    //for soft delete
    deleted: Boolean,
    deleteDate : String,
    deletedBy : String, 
})

module.exports = mongoose.model('noticia', noticiaSchema)
