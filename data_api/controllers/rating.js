var Rating = require('../models/rating')

// List all ratings
module.exports.list = () => {
    return Rating
        .find()
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get rating by id
module.exports.getRating = id => {
    return Rating.findOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get ratings by Resource id
module.exports.getRatingOfResource = resource_id => {
    return Rating.find({resourceId : resource_id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Add new rating
module.exports.addRating = ratingData => {
    const newRating = new Rating(ratingData);
    return newRating.save()
      .then(resposta => {
        return resposta
      })
      .catch(erro => {
        throw erro
      })
}

// Generic update 
module.exports.updateRating = (id, info) => {
    return Rating.updateOne({_id:id}, info)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Hard delete
module.exports.deleteRatingHard = id => {
    return Rating.deleteOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Soft delete
module.exports.deleteRatingSoft = (id, info) => {
    return Rating.updateOne({_id:id}, info)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

