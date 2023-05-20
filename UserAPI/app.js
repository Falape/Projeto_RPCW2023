var express = require('express'),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    createError = require('http-errors'),
    logger = require('morgan');
require('dotenv').config({ path: '.env' })

var userRouter = require('./routes/user/user');
var adminRouter = require('./routes/admin/admin');
var apiRouter = require('./routes/api/api');

var mongoBD = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB;
mongoose.connect(mongoBD, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console,'Error connecting to MongoBD'));
db.once('open', function() {
  console.log("Conexão ao MongoBD realizada com sucesso!");
})

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));

app.use(logger('dev'));


app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);

app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 599);
  res.render('error');
});
  

module.exports = app;
