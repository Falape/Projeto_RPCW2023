var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: '.env' })

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

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/resource', resourceRouter);
app.use('/comment', commentRouter);
app.use('/rating', ratingRouter);

module.exports = app;
