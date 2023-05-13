var express = require('express');
var router = express.Router();
var commentController = require('../controllers/comment')

function verifyAccess(req, res, next) {
  var myToken = req.query.token || req.body.token
  if(myToken) {
    jwt.verify(myToken, 'rpcw2023', function(err, payload) {
      if(err){
        res.status(401).jsonp({error:err})
      }
      else {
        req.payload = payload;
        next()
      }
    })
  }
  else {
    res.status(401).jsonp({ error: 'No token provided' });
  }
}

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */

/* List all comments. */
router.get('/', function (req, res) {
    commentController.list()
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
router.post('/add/:id', function (req, res) {
    //check for required fields
    const requiredFields = ['postedBy', 'content',];
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
        postedBy: req.body.postedBy,
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
router.put('/edit/:id', function (req, res) {
    ra_id = req.params.id
    info = {
        postedBy: req.body.postedBy,
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
router.delete('/delete/hard/:id', function (req, res) {
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
router.delete('/delete/soft/:id', function (req, res) {
    ra_id = req.params.id
    info = {
        deleted: true,
        deleteDate: new Date().toISOString().substring(0, 16),
        deletedBy: req.body.deletedBy
    }
    commentController.deleteCommentSoft(ra_id, info)
        .then(comment => {
            res.status(207).jsonp(comment)
        })
        .catch(error => {
            res.status(507).jsonp({ error: error, message: "Error (soft) deleting comment..." })
        })
});

module.exports = router;
