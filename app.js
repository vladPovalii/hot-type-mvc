var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// get cfg with connection information 
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

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

mongoose.model('targets', TargetSchema);
var targets = mongoose.model('targets');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ROUTES

//route for the target words
app.get('/api/targets', function(req, res) {
  targets.find(function(err, docs) {
    docs.forEach(function(item) {
      console.log("Received a GET request for _id: " + item._id);
    })
    res.send(docs);
  });
});

/*
app.post('/api/blogs', function(req, res) {
  console.log('Received a POST request:')
  for (var key in req.body) {
    console.log(key + ': ' + req.body[key]);
  }
  var blog = new Blog(req.body);
  blog.save(function(err, doc) {
    res.send(doc);
  });
});

app.delete('/api/blogs/:id', function(req, res) {
  console.log('Received a DELETE request for _id: ' + req.params.id);
  Blog.remove({_id: req.params.id}, function(err, doc) {
    res.send({_id: req.params.id});
  });
});

app.put('/api/blogs/:id', function(req, res) {
  console.log('Received an UPDATE request for _id: ' + req.params.id);
  Blog.update({_id: req.params.id}, req.body, function(err) {
    res.send({_id: req.params.id});
  });
});
*/

var port = 3000;

app.listen(port);
console.log('server on ' + port);