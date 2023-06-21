var express = require('express');
var router = express.Router();
var ratingController = require('../controllers/rating');
const rating = require('../models/rating');
const { checkValidTokenAdmin, checkValidTokenProducer, checkValidToken } = require('../javascript/validateToken');

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */

/* List all ratings. */
router.post('/', function (req, res) {

    ra_data = {
        postedBy: req.body.postedBy,
        postedByUsername: req.body.postedByUsername,
        value: req.body.value,
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
        if(ra_data[key] === undefined || ra_data[key] === null) {
            delete ra_data[key];
        }
    });

    ratingController.list(ra_data)
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


/* Get ratings list resource*/
router.get('/resource/list/:id', checkValidToken, function (req, res) {
    ra_id = req.params.id
    ratingController.getRatingOfResource(ra_id)
        .then(ratings => {
            res.status(203).jsonp(ratings)
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error getting ratings of resource..." })
        })
});

/* Get TOTAL rating of a resource*/
router.get('/resource/:id', checkValidToken, function (req, res) {
    ra_id = req.params.id
    ratingController.getRatingOfResource(ra_id)
        .then(ratings => {
            rating_value = 0
            for (let i = 0; i < ratings.length; i++) {
                rating_value += ratings[i].value
            }
            if(ratings.length == 0){
                res.status(203).jsonp(0)
            }else{
                rating_value = rating_value / ratings.length
                res.status(203).jsonp(rating_value)
            }
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error getting ratings of resource..." })
        })
});




/* Add new rating */
router.post('/add/:id', checkValidToken, function (req, res) {
    //check for required fields
    const requiredFields = ['value'];
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

    // check if user already rated this resource
    ratingController.list({postedBy: req.payload._id, resourceId: req.params.id})
        .then(rat => {
            console.log("RAT:", rat)
                // if rat is an empty list, it means that the user didn't rate this resource yet
            if(rat.length > 0){
                ratingController.updateRating(rat[0]._id, {value: req.body.value})
                .then(rating => {
                    res.status(200).jsonp(rating)
                })
                .catch(error => {
                    res.status(504).jsonp({ error: error, message: "Error updating rating..." })
                })
                //return res.status(402).jsonp({ message: "You already rated this resource." });
            }
            else{
                // get fields from body
                ra_data = {
                    postedBy: req.payload._id,
                    postedByUsername: req.payload.username,
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
            }
        })
});

/* Update rating information */
router.put('/edit/:id', checkValidToken, function (req, res) {
    //user id is in req.payload._id
    //user role is in req.payload.role
    //user username is in req.payload.username
    ra_id = req.params.id
    // Se não for admin, tenho que verificar se quem quer editar é o dono do recurso
    if(req.payload.role != "admin"){
        ratingController.getRating(ra_id)
        .then(rec => {
            // console.log("rec = ", rec)
            // console.log("red.postedby = ", rec.postedBy)
            // console.log("req.payload = ", req.payload._id)
            if(rec.postedBy != req.payload._id){
                return res.status(401).jsonp({ error: `Unauthorized to edit this rating...` });
            }
        })
    }

    if(req.body.value){
        if (req.body.value < 0 || req.body.value > 5) {
            return res.status(400).jsonp({ error: 'Rating value should be between 0 and 5.' });
        }
    }

    info =  {
        value: req.body.value,
        updateDate: new Date().toISOString().substring(0, 16),
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
router.delete('/delete/hard/:id', checkValidTokenAdmin, function (req, res) {
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
router.delete('/delete/soft/:id', checkValidToken, function (req, res) {
    //user id is in req.payload._id
    //user role is in req.payload.role
    //user username is in req.payload.username
    ra_id = req.params.id

    // Se não for admin, tenho que verificar se quem quer editar é o dono do recurso
    if(req.payload.role != "admin"){
        ratingController.getRating(ra_id)
        .then(rec => {
            if(rec.postedBy != req.payload._id && rec.postedByUsername != req.payload.username){
                return res.status(401).jsonp({ error: `Unauthorized to delete this rating...` });
            }
        })
    }

    info = {
        deleted: true,
        deleteDate: new Date().toISOString().substring(0, 16),
        deletedBy: req.payload._id
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
