var createError = require('http-errors'),
    User = require("./models/user"),
    express = require('express'),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passport = require("passport"),
    path = require('path'),
    logger = require('morgan'),
    jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' })

var index = require('./routes/index');
var adminRouter = require('./routes/admin');


var mongoBD = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB;
mongoose.connect(mongoBD, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console,'Error connecting to MongoBD'));
db.once('open', function() {
  console.log("Conexão ao MongoBD realizada com sucesso!")
})


var app = express();

//must see if it will cause any problem when adding other type od logins such as facebook, google, etc
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));


app.use(require("express-session")({
  secret: process.env.COOKIES_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(logger('dev'));
// app.use(express.json()); //same thing as the body-parser...check
// app.use(express.urlencoded({ extended: false }));


app.use('/admin', adminRouter);
app.use('/', index);


// catch 404 and forward to error handler
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
