var express = require('express');
var router = express.Router();
var noticiaController = require('../controllers/noticia')
const { checkValidTokenAdmin, checkValidTokenProducer, checkValidToken } = require('../javascript/validateToken');

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */


router.post('/', checkValidToken, function (req, res) {

    noticia_data = {
        title : req.body.title,
        uploadedBy: req.body.uploadedBy,
        uploadedByUsername: req.body.uploadedByUsername,
        resourceId: req.body.id,
        type: req.body.type,
        public: req.body.public,
        dateCreated: req.body.dateCreated,
    }

    // if field is undefined, delete it from object
    //Object.keys(ra_data).forEach(key => ra_data[key] === undefined ? delete ra_data[key] : '');

    Object.keys(noticia_data).forEach(key => {
        if(noticia_data[key] === undefined || noticia_data[key] === null) {
            delete noticia_data[key];
        }
    });


    noticiaController.list(noticia_data)
        .then(noticias => {
            res.status(201).jsonp(noticias)
        })
        .catch(error => {
            res.status(501).jsonp({ error: error, message: "Error getting noticias..." })
        })
});

/* Get noticia by id */
router.get('/:id', checkValidToken, function (req, res) {
    ra_id = req.params.id
    noticiaController.getNoticia(ra_id)
        .then(noticia => {
            res.status(202).jsonp(noticia)
        })
        .catch(error => {
            res.status(502).jsonp({ error: error, message: "Error getting noticia..." })
        })
});

/* Get noticias by resource ID*/
router.get('/resource/:id', checkValidToken, function (req, res) {
    ra_id = req.params.id
    noticiaController.getNoticiaOfResource(ra_id)
        .then(noticias => {
            res.status(203).jsonp(noticias)
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error getting noticias of resource..." })
        })
});

/* Add new noticia, com o id do recurso */
router.post('/add/:id', checkValidToken, function (req, res) {
    console.log("req.body: ", req.body)
    //check for required fields
    const requiredFields = ['title', 'type', 'public', 'uploadedByUsername'];
    const missingFields = [];
    for (let field of requiredFields) {
        if (!req.body[field]) 
            missingFields.push(field);
    }
    if (missingFields.length > 0) {
        res.status(400).jsonp({ error: `Missing required fields: ${missingFields.join(', ')}` });
        return;
    }

    // get fields from body
    ra_data = {
        title : req.body.title,
        uploadedBy: req.payload._id,
        uploadedByUsername: req.body.uploadedByUsername,
        resourceId: req.params.id,
        type: req.body.type,
        public: req.body.public,
        dateCreated: new Date().toISOString().substring(0, 16)
    }
    noticiaController.addNoticia(ra_data)
        .then(noticia => {
            console.log("noticia added: ", noticia)
            res.status(200).jsonp(noticia)
        })
        .catch(error => {
            res.status(504).jsonp({ error: error, message: "Error adding noticia..." })
        })
});




// delete noticia (hard), fica para testes...
router.delete('/delete/hard/:id', checkValidTokenAdmin, function (req, res) {
    ra_id = req.params.id
    noticiaController.deleteNoticiaHard(ra_id)
        .then(noticia => {
            res.status(206).jsonp(noticia)
        })
        .catch(error => {
            res.status(506).jsonp({ error: error, message: "Error (hard) deleting noticia..." })
        })
});



module.exports = router;
