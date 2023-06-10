var express = require('express');
var router = express.Router();
var resourceController = require('../controllers/resource')

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

module.exports = router;
