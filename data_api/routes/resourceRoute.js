var express = require('express');
var router = express.Router();
var resourceController = require('../controllers/resource')
var noticiaController = require('../controllers/noticia')
const { checkValidTokenAdmin, checkValidTokenProducer, checkValidToken } = require('../javascript/validateToken');

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */

/* List all resources. */
router.post('/', function (req, res) {
    console.log("BODY:", req.body)
    re_data = {
        title: req.body.title,
        author: req.body.author,
        uploadedBy: req.body.uploadedBy,
        uploadedByUsername: req.body.uploadedByUsername,
        type: req.body.type,
        public: req.body.public, // default is public or must come in request
        dateCreated: req.body.dateCreated,
        path: req.body.path,
        browserSupported: req.body.browserSupported,
        updateDate: req.body.updateDate,
        deleted: req.body.deleted,
        deleteDate: req.body.deleteDate,
        deletedBy: req.body.deletedBy
    }

    //console.log("RE_DATA:", re_data)

    // if field is undefined or null, delete it from object
    //Object.keys(re_data).forEach(key => re_data[key] === undefined ? delete re_data[key] : '');
    Object.keys(re_data).forEach(key => {
        if (re_data[key] === undefined || re_data[key] === null) {
            delete re_data[key];
        }
    });

    //console.log("RE_DATA FILTRADA:", re_data)

    resourceController.list(re_data)
        .then(resources => {
            res.status(200).jsonp(resources)
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
            res.status(200).jsonp(resources)
        })
        .catch(error => {
            res.status(502).jsonp({ error: error, message: "Error getting resource..." })
        })
});

/* Add new resource */
router.post('/add', checkValidTokenProducer, function (req, res) {
    //check for required fields
    const requiredFields = ['title', 'type', 'uploadedBy', 'uploadedByUsername'];
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
        author: req.body.author || null,
        uploadedBy: req.payload._id,
        uploadedByUsername: req.body.uploadedByUsername,
        type: req.body.type,
        public: req.body.public == null ? true : req.body.public, // default is public or must come in request
        dateCreated: new Date().toISOString().substring(0, 16),
        path: req.body.path,
        browserSupported: req.body.browserSupported,
        deleted: false,
        deleteDate: null,
        deletedBy: null
    }
    resourceController.addResource(re_data)
        .then(resource => {
            // adicionar noticia
            ra_data = {
                title: resource.title,
                uploadedBy: resource.uploadedBy,
                uploadedByUsername: resource.uploadedByUsername,
                resourceId: resource._id,
                type: resource.type,
                public: resource.public,
                dateCreated: resource.dateCreated
            }
            console.log("NOTICIA_data: ", ra_data)
            noticiaController.addNoticia(ra_data)
                .then(noticia => {
                    console.log("noticia added: ", noticia)
                    res.status(200).jsonp(resource)
                    console.log("resource added: ", resource)
                    //res.status(200).jsonp(noticia)
                })
                .catch(error => {
                    console.log("error adding noticia: ", error)
                    res.status(200).jsonp(resource)
                    //res.status(504).jsonp({ error: error, message: "Error adding noticia..." })
                })
            
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error adding resource..." })
        })
});

/* Update resource information */
router.put('/edit/:id', checkValidTokenProducer, function (req, res) {

    //user id is in req.payload._id
    //user role is in req.payload.role
    //user username is in req.payload.username

    re_id = req.params.id

    // Se não for admin, tenho que verificar se quem quer editar é o dono do recurso
    if (req.payload.role != "admin") {
        rec = resourceController.getResource(re_id)
        if (rec.uploadedBy != req.payload._id && rec.uploadedByUsername != req.payload.username) {
            return res.status(401).jsonp({ error: `Unauthorized to edit this resource...` });
        }
    }

    const possibleFields = ['title', 'author', 'public', 'path'];
    // get fields from body, if not present in request, it will be changed.
    info = {
        title: req.body.title,
        author: req.body.author,
        public: req.body.public,
        updateDate: new Date().toISOString().substring(0, 16),
        path: req.body.path
    }

    // check if all fields are null
    let allNull = true
    for (let field of possibleFields) {
        if (info[field] != undefined) {
            allNull = false
            break
        }
    }
    if (allNull) {
        return res.status(400).jsonp({ error: `No fields to update... Possible choices = ['title', 'author', 'public']` });
    }


    console.log(info)
    resourceController.updateResource(re_id, info)
        .then(resources => {
            console.log(resources)
            res.status(200).jsonp(resources)
        })
        .catch(error => {
            res.status(504).jsonp({ error: error, message: "Error editing resource..." })
        })
});



// delete resource (hard)
router.delete('/delete/hard/:id', checkValidTokenAdmin, function (req, res) {
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
router.delete('/delete/soft/:id', checkValidTokenProducer, function (req, res) {
    //user id is in req.payload._id
    //user role is in req.payload.role
    //user username is in req.payload.username
    re_id = req.params.id

    // Se não for admin, tenho que verificar se quem quer apagar é o dono do recurso
    if (req.payload.role != "admin") {
        rec = resourceController.getResource(re_id)
        if (rec.uploadedBy != req.payload._id && rec.uploadedByUsername != req.payload.username) {
            return res.status(401).jsonp({ error: `Unauthorized to edit this resource...` });
        }
    }

    info = {
        deleted: true,
        deleteDate: new Date().toISOString().substring(0, 16),
        deletedBy: req.payload._id
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
