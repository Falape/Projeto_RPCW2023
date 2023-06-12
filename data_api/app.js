var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: '.env' })

console.log('MONGO_HOST: ' + process.env.MONGO_HOST)
console.log('MONGO_PORT: ' + process.env.MONGO_PORT)
console.log('MONGO_DB: ' + process.env.MONGO_DB)

// connection to MongoDB
var mongoose = require('mongoose')
var mongoDB = 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection
db.on('error', function(){
    console.error.bind(console, 'MongoDB: Connection error occurred...')})
db.on('open', () => {
    console.log('MongoDB: Connection established successfully...')})

var resourceRouter = require('./routes/resourceRoute');
var commentRouter = require('./routes/commentRoute');
var ratingRouter = require('./routes/ratingRoute');
var fileRouter = require('./routes/fileRoute');
var apiRouter = require('./routes/apiRoute');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/resource', resourceRouter);
app.use('/comment', commentRouter);
app.use('/rating', ratingRouter);
app.use('/file', fileRouter);
app.use('/api', apiRouter);

module.exports = app;
