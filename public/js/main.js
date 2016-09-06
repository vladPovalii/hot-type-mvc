var header = document.querySelector("h1");
header.innerHTML = "atata";


var TargetModel = Backbone.Model.extend({});

var TargetCollection = Backbone.Collection.extend({
	model: TargetModel,
	url: 'http://localhost:3000/api/targets'
});

var targetCollection = new TargetCollection;
targetCollection.fetch();
console.log(TargetCollection.length);