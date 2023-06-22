var express = require('express');
var router = express.Router();
var commentController = require('../controllers/comment')
const { checkValidTokenAdmin, checkValidTokenProducer, checkValidToken } = require('../javascript/validateToken');

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */

/* List all comments. */
router.post('/', function (req, res) {

    ra_data = {
        postedBy: req.body.postedBy,
        postedByUsername: req.body.postedByUsername,
        content: req.body.content,
        dateCreated: req.body.dateCreated,
        resourceId: req.params.id,
        updateDate: req.body.updateDate,
        deleted: req.body.deleted,
        deleteDate: req.body.deleteDate,
        deletedBy: req.body.deletedBy,
    }

    // if field is undefined, delete it from object
    //Object.keys(ra_data).forEach(key => ra_data[key] === undefined ? delete ra_data[key] : '');

    Object.keys(ra_data).forEach(key => {
        if (ra_data[key] === undefined || ra_data[key] === null) {
            delete ra_data[key];
        }
    });


    commentController.list(ra_data)
        .then(comments => {
            res.status(201).jsonp(comments)
        })
        .catch(error => {
            res.status(501).jsonp({ error: error, message: "Error getting comments..." })
        })
});

/* Get comment by id */
router.get('/:id', function (req, res) {
    ra_id = req.params.id
    commentController.getComment(ra_id)
        .then(comment => {
            res.status(202).jsonp(comment)
        })
        .catch(error => {
            res.status(502).jsonp({ error: error, message: "Error getting comment..." })
        })
});

/* Get comments resource*/
router.get('/resource/:id', function (req, res) {
    ra_id = req.params.id
    commentController.getCommentOfResource(ra_id)
        .then(comments => {
            res.status(203).jsonp(comments)
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error getting comments of resource..." })
        })
});

/* Add new comment */
router.post('/add/:id', checkValidToken, function (req, res) {
    //check for required fields
    const requiredFields = ['content',];
    const missingFields = [];
    for (let field of requiredFields) {
        if (!req.body[field])
            missingFields.push(field);
    }
    if (missingFields.length > 0) {
        res.status(400).jsonp({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // get fields from body
    ra_data = {
        author: req.payload.username,
        postedBy: req.payload._id,
        postedByUsername: req.payload.username,
        content: req.body.content,
        dateCreated: new Date().toISOString().substring(0, 16),
        resourceId: req.params.id,
        deleted: false,
        deleteDate: null,
        deletedBy: null
    }
    commentController.addComment(ra_data)
        .then(comment => {
            console.log("comment added: ", comment)
            res.status(200).jsonp(comment)
        })
        .catch(error => {
            res.status(504).jsonp({ error: error, message: "Error adding comment..." })
        })
});

/* Update comment information */
router.put('/edit/:id', checkValidToken, function (req, res) {
    //user id is in req.payload._id
    //user role is in req.payload.role
    //user username is in req.payload.username
    ra_id = req.params.id

    // Se não for admin, tenho que verificar se quem quer apagar é o dono do recurso
    if (req.payload.role != "admin") {
        rec = commentController.getComment(ra_id)
        if (rec.uploadedBy != req.payload._id && rec.uploadedByUsername != req.payload.username) {
            return res.status(401).jsonp({ error: `Unauthorized to edit this resource...` });
        }
    }

    info = {
        postedBy: req.body.postedBy, // se for alterado pelo admin, não deve alerar o postedby
        content: req.body.content,
        dateCreated: req.body.dateCreated,
        resourceId: req.body.resourceId,
    }
    commentController.updateComment(ra_id, info)
        .then(comment => {
            res.status(205).jsonp(comment)
        })
        .catch(error => {
            res.status(505).jsonp({ error: error, message: "Error editing comment..." })
        })
});



// delete comment (hard)
router.delete('/delete/hard/:id', checkValidTokenAdmin, function (req, res) {
    ra_id = req.params.id
    commentController.deleteCommentHard(ra_id)
        .then(comment => {
            res.status(206).jsonp(comment)
        })
        .catch(error => {
            res.status(506).jsonp({ error: error, message: "Error (hard) deleting comment..." })
        })
});

// delete comment (soft)
router.delete('/delete/soft/:id', checkValidToken, function (req, res) {
    //user id is in req.payload._id
    //user role is in req.payload.role
    //user username is in req.payload.username
    ra_id = req.params.id

    // Se não for admin, tenho que verificar se quem quer apagar é o dono do recurso
    commentController.getComment(ra_id)
        .then(rec => {
            console.log("rec: ", rec)
            console.log("req.payload._id: ", req.payload._id)
            if (rec.postedBy != req.payload._id) {
                return res.status(401).jsonp({ error: `Unauthorized to delete this comment..` });
            }


            info = {
                deleted: true,
                deleteDate: new Date().toISOString().substring(0, 16),
                deletedBy: req.payload._id
            }
            commentController.deleteCommentSoft(ra_id, info)
                .then(comment => {
                    res.status(207).jsonp(comment)
                })
                .catch(error => {
                    res.status(507).jsonp({ error: error, message: "Error (soft) deleting comment..." })
                })
        })
        .catch(error => {
            res.status(507).jsonp({ error: error, message: "Error (soft) deleting comment..." })
        })
});

module.exports = router;
