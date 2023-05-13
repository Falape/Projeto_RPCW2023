var mongoose = require('mongoose'), 
    Schema = mongoose.Schema

// Os comentários ficam numa coleção à parte, mas identificados com o ID do recurso a que pertencem
var commentSchema = new Schema({
    postedBy : { type: String, required: true },
    content : { type: String, required: true },
    dateCreated : { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'resource', required: true }, // ID do recurso a que pertence o comentário
    //for soft delete
    deleted: Boolean,
    deleteDate : String,
    deletedBy : String, 
})


module.exports = mongoose.model('comment', commentSchema);