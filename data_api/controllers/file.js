var File = require('../models/file')

// List all files, pode ficar para testes...
module.exports.list = (fields) => {
    return File
        .find(fields)  //filtra por parametros
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get file by id
module.exports.getFile = id => {
    return File.findOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get files by Resource id
module.exports.getFileOfResource = resource_id => {
    return File.find({resourceId : resource_id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Add new file
module.exports.addFile = fileData => {
    const newFile = new File(fileData);
    return newFile.save()
      .then(resposta => {
        return resposta
      })
      .catch(erro => {
        throw erro
      })
}


// Hard delete Para testes
module.exports.deleteFileHard = id => {
    return File.deleteOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}


