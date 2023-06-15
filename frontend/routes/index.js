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


router.get('/recursos', function(req, res, next) {

  rcs = [
    {title: "rec1", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec2", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec3", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec4", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec5", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec6", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec7", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec8", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec9", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
    {title: "rec10", uploadedByUsername: "admin", type: "video", creationDate: "2021-05-01"},
  ]

  res.render('list_resources2', { resources: rcs});
});

module.exports = router;
