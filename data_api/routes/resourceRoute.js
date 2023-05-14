var express = require('express');
var router = express.Router();
var resourceController = require('../controllers/resource')
const { checkValidTokenAdmin, checkValidTokenConsumer, checkValidToken } = require('../javascript/validateToken');

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */

/* List all resources. */
router.get('/', function (req, res) {
    resourceController.list()
        .then(resources => {
            res.status(201).jsonp(resources)
        })
        .catch(error => {
            res.status(501).jsonp({ error: error, message: "Error getting resources..." })
        })
});

/* Get resource by id */
router.get('/:id', function (req, res) {
    re_id = req.params.id
    resourceController.getResource(re_id)
        .then(resources => {
            res.status(202).jsonp(resources)
        })
        .catch(error => {
            res.status(502).jsonp({ error: error, message: "Error getting resource..." })
        })
});

/* Add new resource */
router.post('/add', checkValidTokenConsumer, function (req, res) {
    //check for required fields
    const requiredFields = ['title', 'type', 'path', 'browserSupported'];
    const missingFields = [];
    for (let field of requiredFields) {
        if (!req.body[field]) 
            missingFields.push(field);
    }
    if (missingFields.length > 0) {
        return res.status(400).jsonp({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    // get fields from body, if not present in request, it will be null
    re_data = {
        title: req.body.title,
        author: req.payload.username || null,
        uploadedBy: req.payload._id,
        type: req.body.type,
        public: req.body.public || true, // default is public or must come in request
        dateCreated: new Date().toISOString().substring(0, 16),
        path: req.body.path,
        browserSupported: req.body.browserSupported,
        deleted: false,
        deleteDate: null,
        deletedBy: null
    }
    resourceController.addResource(re_data)
        .then(resource => {
            res.status(203).jsonp(resource)
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error adding resource..." })
        })
});

/* Update resource information */
router.put('/edit/:id', function (req, res) {
    re_id = req.params.id

    // get fields from body, if not present in request, it will be changed.
    info = {
        title: req.body.title,
        author: req.body.author,
        uploadedBy: req.body.uploadedBy,
        type: req.body.type,
        public: req.body.public,
        dateCreated: req.body.dateCreated,
        path: req.body.path,
        browserSupported: req.body.browserSupported,
    }
    resourceController.updateResource(re_id, info)
        .then(resources => {
            res.status(200).jsonp(resources)
        })
        .catch(error => {
            res.status(504).jsonp({ error: error, message: "Error editing resource..." })
        })
});



// delete resource (hard)
router.delete('/delete/hard/:id', function (req, res) {
    re_id = req.params.id
    resourceController.deleteResourceMEGA(re_id)
        .then(resources => {
            res.status(205).jsonp(resources)
        })
        .catch(error => {
            res.status(505).jsonp({ error: error, message: "Error (hard) deleting resource..." })
        })
});

// delete resource (soft)
router.delete('/delete/soft/:id', function (req, res) {
    re_id = req.params.id
    info = {
        deleted: true,
        deleteDate: new Date().toISOString().substring(0, 16),
        deletedBy: req.body.deletedBy
    }
    resourceController.deleteResourceSoft(re_id, info)
        .then(resources => {
            res.status(206).jsonp(resources)
        })
        .catch(error => {
            res.status(506).jsonp({ error: error, message: "Error (soft) deleting resource..." })
        })
});


module.exports = router;
