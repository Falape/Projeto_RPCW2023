var mongoose = require('mongoose'), 
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose')

var resourceSchema = new Schema({
    title: { type: String, required: true },
    author: String, // autor do recurso, pode não haver.
    uploadedBy: { type: String, required: true }, // ID do utilizador que fez o upload
    type: { type: String, required: true },  
    public: Boolean, // Se o recurso é público ou não
    dateCreated: String,
    path: { type: String, required: true },
    browserSupported : { type: Boolean, required: true },
    deleted: Boolean,
    deleteDate : String,
    deleteUser : String,
    //classificacao: String, //Ver melhor pois assim não dá para fazer média de resultados
    //nclassicacoes : Number.
    //mediaclassificacao : Number    
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('resource', resourceSchema)

