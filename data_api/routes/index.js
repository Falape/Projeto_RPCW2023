var express = require('express');
var router = express.Router();

/* PARA CADA UMA DESTAS, FALTA VERIFICAR SE TEM ACESSO */

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// List all files
router.get('/files', function(req, res) {
  res.render('index', { title: 'Express' });
});

// Get file by id
// retorna a informação relativa ao ficheiro, não o ficheiro em si
router.get('/files/:id', function(req, res) {
  res.render('index', { title: 'Express' });
});

// add new file
router.post('/files', function(req, res) {
  res.render('index', { title: 'Express' });
});

// update file information
router.PUT('/files/:id', function(req, res) {
  res.render('index', { title: 'Express' });
});

// delete file (soft delete)
router.post('/files/:id', function(req, res) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
