var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// get cfg with connection information 
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// connect to mongoDB
mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db);
/*
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected!");
});
*/
var Schema = mongoose.Schema;

var TargetSchema = new Schema({
  value: String
});

mongoose.model('Target', TargetSchema);
var Target = mongoose.model('Target');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

//route for the target words
app.get('/api/targets', function(req, res) {
  Target.find(function(err, docs) {
    docs.forEach(function(item) {
      console.log("Received a GET request for _id: " + item._id);
    })
    res.send(docs);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
