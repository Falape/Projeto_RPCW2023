var express = require('express');
var router = express.Router();
var resourceController = require('../controllers/resource');
var commentController = require('../controllers/comment');

// delete resource (hard)
router.delete('/delete/hard/:id', function (req, res) {
    re_id = req.params.id
    resourceController.deleteResourceMEGA(re_id)
        .then(resources => {
            res.status(205).jsonp(resources)
        })
        .catch(error => {
            res.status(505).jsonp({ error: error, message: "Error (hard) deleting resources..." })
        })
});

// delete resource pelo ID do user (hard)
// apaga todos os recursos do user, e os comentarios associados a estes.
router.delete('/delete/hard/user/:id', function (req, res) {
    params = {
        uploadedBy: req.params.id
    }

    // get all resources with user_id
    resourceController.list(params)
    .then(resources => {
        console.log(resources)
        // while resource_list is not empty then delete one by one
        for(let resource of resources){
            resourceController.deleteResourceMEGA2(resource._id)
            .then(res => {
                console.log("deleted resource: " + resource._id)
                //res.status(205).jsonp(resources)
            })
            .catch(error => {
                res.status(505).jsonp({ error: error, message: "Error (hard) deleting resources..." })
            })
        }
        res.status(200).jsonp({ message: "All resources deleted..." })
    })
    .catch(error => { 
        res.status(505).jsonp({ error: error, message: "Error (hard) deleting comments..." })
    })

});


// delete dos comments do prorpio utilizador
// recebe o id do user
router.delete('/delete/hard/comments/:id', function (req, res) {
    params = {
        postedBy: req.params.id
    }

    console.log(params)
    // get comments with user_id
    commentController.list(params)
    .then(comments => {
        console.log(comments)
        for(let comment of comments){
            commentController.deleteCommentHard(comment._id)
            .then(cmt => {
                console.log("deleted comment: " + comment._id)
                //res.status(205).jsonp(resources)
            })
            .catch(error => {
                res.status(505).jsonp({ error: error, message: "Error (hard) deleting comments..." })
            })
        }
        res.status(200).jsonp({ message: "All comments deleted..." })
    })
    .catch(error => { 
        res.status(505).jsonp({ error: error, message: "Error (hard) deleting comments..." })
    })
    // while resource_list is not empty then delete one by one

});

module.exports = router;
