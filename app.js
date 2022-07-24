require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var mediaRouter = require('./routes/media');

var app = express();
var cors = require('cors')

app.use(logger('dev'));
app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({ extended: false, limit: '500mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/media', mediaRouter);
app.use(cors([
{origin:'http://localhost:3000'},
]))
module.exports = app;
