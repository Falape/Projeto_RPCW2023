var User = require('../models/comment')

module.exports.list = () => {
    return User
        .find()
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}


module.exports.getUser = id => {
    return User.findOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}


module.exports.updateUser = (id, info) => {
    return User.updateOne({_id:id}, info)
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.deleteUser = id => {
    return User.updateOne({_id:id})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

module.exports.updateUsertatus = (id, status) => {
    return User.updateOne({_id:id}, {active:status})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            throw erro
        })
}

