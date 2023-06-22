var Noticia = require('../models/noticia')

// List all noticias, pode ficar para testes...
module.exports.list = (fields) => {
    return Noticia
        .find(fields)  //filtra por parametros
        .sort({dateCreated: -1})  // sorts in descending order (noticias mais recentes primeiro)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get noticia by id
module.exports.getNoticia = id => {
    return Noticia.findOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get noticias by Resource id
module.exports.getNoticiaOfResource = resource_id => {
    return Noticia.find({resourceId : resource_id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Add new noticia
module.exports.addNoticia = noticiaData => {
    const newNoticia = new Noticia(noticiaData);
    return newNoticia.save()
      .then(resposta => {
        return resposta
      })
      .catch(erro => {
        throw erro
      })
}


// Hard delete Para testes
module.exports.deleteNoticiaHard = id => {
    return File.deleteOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}


