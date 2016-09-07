
var header = document.querySelector("h1");
header.innerHTML = "atata";

Backbone.Model.prototype.idAttribute = '_id';
var TargetModel = Backbone.Model.extend({});

var TargetCollection = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/targets'
});

var targetCollection = new TargetCollection;
targetCollection.fetch({
	success: function(response) {
		_.each(response.toJSON(), function(item) {
			console.log('Successfully GOT blog with _id: ' + item._id);
		})
	},
	error: function() {
		console.log('Failed to get blogs!');
	}
});
