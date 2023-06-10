var mongoose = require('mongoose'), 
    Schema = mongoose.Schema

var fileSchema = new Schema({
    fileName: { type: String, required: true},
    //author: String, // autor do recurso, pode não haver.
    resourceId: { type: Schema.Types.ObjectId, ref: 'resource', required: true }, // ID do recurso a que pertence o comentário
    type: { type: String, required: true },
    path: { type: String, required: true },
    browserSupported : { type: Boolean, required: true },
})


module.exports = mongoose.model('file', fileSchema)

