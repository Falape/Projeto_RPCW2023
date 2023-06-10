var express = require('express');
var router = express.Router();
var fileController = require('../controllers/file')
const { checkValidTokenAdmin, checkValidTokenProducer, checkValidToken } = require('../javascript/validateToken');

/* AFTER TESTS, INCLUDE TOKEN VERIFICATION ON ALL BELLOW */



/* Get file by id */
router.get('/:id', function (req, res) {
    ra_id = req.params.id
    fileController.getFile(ra_id)
        .then(file => {
            res.status(202).jsonp(file)
        })
        .catch(error => {
            res.status(502).jsonp({ error: error, message: "Error getting file..." })
        })
});

/* Get files by resource ID*/
router.get('/resource/:id', function (req, res) {
    ra_id = req.params.id
    fileController.getFileOfResource(ra_id)
        .then(files => {
            res.status(203).jsonp(files)
        })
        .catch(error => {
            res.status(503).jsonp({ error: error, message: "Error getting files of resource..." })
        })
});

/* Add new file, com o id do recurso */
router.post('/add/:id', checkValidToken, function (req, res) {
    //check for required fields
    const requiredFields = ['fileName', 'type', 'path', 'browserSupported'];
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
        fileName : req.body.fileName,
        resourceId: req.params.id,
        type: req.body.type,
        path: req.body.path,
        browserSupported: req.body.browserSupported,
    }
    fileController.addFile(ra_data)
        .then(file => {
            console.log("file added: ", file)
            res.status(200).jsonp(file)
        })
        .catch(error => {
            res.status(504).jsonp({ error: error, message: "Error adding file..." })
        })
});




// delete file (hard), fica para testes...
router.delete('/delete/hard/:id', checkValidTokenAdmin, function (req, res) {
    ra_id = req.params.id
    fileController.deleteFileHard(ra_id)
        .then(file => {
            res.status(206).jsonp(file)
        })
        .catch(error => {
            res.status(506).jsonp({ error: error, message: "Error (hard) deleting file..." })
        })
});



module.exports = router;
