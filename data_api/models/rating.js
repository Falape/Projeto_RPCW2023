var mongoose = require('mongoose'), 
    Schema = mongoose.Schema

// Os ratings funcionaram de forma semelhante aos comentários
// serão uma coleção à parte, mas identificados com o ID do recurso a que pertencem
var ratingSchema = new Schema({
    postedBy : { type: String, required: true, unique: true },
    value: { type: Number, required: true, min: 0, max: 5}, // valor do rating, entre 0 e 5
    dateCreated : { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'resource', required: true }, // ID do recurso a que pertence o comentário
    //for soft delete
    deleted: Boolean,
    deleteDate : String,
    deletedBy : String, 
})


module.exports = mongoose.model('rating', ratingSchema);