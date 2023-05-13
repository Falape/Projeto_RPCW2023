var express = require('express');
var router = express.Router();
var ratingController = require('../controllers/rating');
const rating = require('../models/rating');

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

/* List all ratings. */
router.get('/', function (req, res) {
    ratingController.list()
        .then(ratings => {
            res.status(201).jsonp(ratings)
        })
        .catch(error => {
            res.status(501).jsonp({ error: error, message: "Error getting ratings..." })
        })
});

/* Get rating by id */
router.get('/:id', function (req, res) {
    ra_id = req.params.id
    ratingController.getRating(ra_id)
        .then(rating => {
            res.status(202).jsonp(rating)
        })
        .catch(error => {
            res.status(502).jsonp({ error: error, message: "Error getting rating..." })
        })
});

/* Get ratings resource*/
router.get('/resource/:id', function (req, res) {
    ra_id = req.params.id
    ratingController.getRatingOfResource(ra_id)
        .then(ratings => {
            res.status(203).jsonp(ratings)
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error getting ratings of resource..." })
        })
});

/* Add new rating */
router.post('/add/:id', function (req, res) {
    //check for required fields
    const requiredFields = ['postedBy', 'value'];
    const missingFields = [];
    for (let field of requiredFields) {
        if (!req.body[field]) 
            missingFields.push(field);
    }
    if (missingFields.length > 0) {
        return res.status(400).jsonp({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    if (req.body.value < 0 || req.body.value > 5) { //valor do rating tem de ser entre 0 e 5
        return res.status(401).jsonp({ message: "Rating value should be between 0 and 5." });
    }
    // get fields from body
    ra_data = {
        postedBy: req.body.postedBy,
        value: req.body.value,
        dateCreated: new Date().toISOString().substring(0, 16),
        resourceId: req.params.id,
        deleted: false,
        deleteDate: null,
        deletedBy: null
    }
    ratingController.addRating(ra_data)
        .then(rating => {
            res.status(200).jsonp(rating)
        })
        .catch(error => {
            res.status(504).jsonp({ error: error, message: "Error adding rating..." })
        })
});

/* Update rating information */
router.put('/edit/:id', function (req, res) {
    ra_id = req.params.id
    if(req.body.value){
        if (req.body.value < 0 || req.body.value > 5) {
            return res.status(400).jsonp({ error: 'Rating value should be between 0 and 5.' });
        }
    }
    info =  {
        postedBy: req.body.postedBy,
        value: req.body.value,
        dateCreated: req.body.dateCreated,
        resourceId: req.body.resourceId,
    }
    ratingController.updateRating(ra_id, info)
        .then(rating => {
            res.status(205).jsonp(rating)
        })
        .catch(error => {
            res.status(505).jsonp({ error: error, message: "Error editing rating..." })
        })
});



// delete rating (hard)
router.delete('/delete/hard/:id', function (req, res) {
    ra_id = req.params.id
    ratingController.deleteRatingHard(ra_id)
        .then(rating => {
            res.status(206).jsonp(rating)
        })
        .catch(error => {
            res.status(506).jsonp({ error: error, message: "Error (hard) deleting rating..." })
        })
});

// delete rating (soft)
router.delete('/delete/soft/:id', function (req, res) {
    ra_id = req.params.id
    info = {
        deleted: true,
        deleteDate: new Date().toISOString().substring(0, 16),
        deletedBy: req.body.deletedBy
    }
    ratingController.deleteRatingSoft(ra_id, info)
        .then(rating => {
            res.status(207).jsonp(rating)
        })
        .catch(error => {
            res.status(507).jsonp({ error: error, message: "Error (soft) deleting rating..." })
        })
});


module.exports = router
