var Resource = require('../models/resource')
var commentModel = require('../models/comment')
var ratingModel = require('../models/rating')

// List all resources
module.exports.list = (fields) => {
    return Resource
        .find(fields)  //filtra por parametros
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
    console.log("INFO IN CONTROLLER:",info)
    return Resource.updateOne({_id:id}, {$set: info})
        .then(() =>{
            return Resource.findOne({_id:id})
        })
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
module.exports.deleteResourceSoft = (id, info) => {
    return Resource.updateOne({_id:id}, info)
        .then(() =>{
            return Resource.findOne({_id:id})
        })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}


/*This controller deletes every document related to the resource on ther other collections*/
module.exports.deleteResourceMEGA = async (id) => {
    try {
      // Remove associated comments and ratings
      await commentModel.deleteMany({ resourceId: id });
      await ratingModel.deleteMany({ resourceId: id });
  
      // Remove the resource
      const result = await Resource.deleteOne({ _id: id });
  
      // Return the result of the resource deletion
      return result;
    } catch (error) {
      throw error;
    }
  };
