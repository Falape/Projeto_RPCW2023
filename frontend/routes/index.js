var express = require('express');
const resource = require('../../data_api/models/resource');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/recurso', function(req, res, next) {
  resourcee = {
    title: "Recurso 1",
    uploadedByUsername: "admin",
    type: "video",
    public: true,
    creationDate: "2021-05-01",
    updateDate: "2021-05-01",
    rating: 2.5,
  }
  fls = [
    {name: "file1", type: "video", browserSupported: true},
    {name: "file2", type: "video", browserSupported: false},
    {name: "file3", type: "video", browserSupported: true},
  ]
  res.render('resource', { resource: resourcee, files: fls });
});

router.get('/files', function(req, res, next) {
  fls = [
    {name: "file1", type: "video", browserSupported: true},
    {name: "file2", type: "video", browserSupported: false},
    {name: "file3", type: "video", browserSupported: true},
  ]
  res.render('tabelaFiles', { files: fls });
});

module.exports = router;
