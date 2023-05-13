var Comment = require('../models/comment')

// List all comments
module.exports.list = () => {
    return Comment
        .find()
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get comment by id
module.exports.getComment = id => {
    return Comment.findOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Get comments by Resource id
module.exports.getCommentOfResource = resource_id => {
    return Comment.find({resourceId : resource_id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Add new comment
module.exports.addComment = commentData => {
    const newComment = new Comment(commentData);
    return newComment.save()
      .then(resposta => {
        return resposta
      })
      .catch(erro => {
        throw erro
      })
}

// Generic update 
module.exports.updateComment = (id, info) => {
    return Comment.updateOne({_id:id}, info)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Hard delete
module.exports.deleteCommentHard = id => {
    return Comment.deleteOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

// Soft delete
module.exports.deleteCommentSoft = (id, info) => {
    return Comment.updateOne({_id:id}, info)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

