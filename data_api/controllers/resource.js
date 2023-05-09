var Resource = require('../models/resource')

// List all resources
module.exports.list = () => {
    return Resource
        .find()
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get resource by id
module.exports.getResource = id => {
    return Resource.findOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Add new resource
module.exports.addResource = resourceData => {
    const newResource = new Resource(resourceData);
    return newResource.save()
      .then(resposta => {
        return resposta
      })
      .catch(erro => {
        throw erro
      })
}

// Generic update 
module.exports.updateResource = (id, info) => {
    return Resource.updateOne({_id:id}, info)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Hard delete
module.exports.deleteResourceHard = id => {
    return Resource.deleteOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Soft delete
module.exports.deleteResourceSoft = (id, user_id, date) => {
    return Resource.updateOne({_id:id}, {deleted : true, deletedBy: user_id, deleteDate: date})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

