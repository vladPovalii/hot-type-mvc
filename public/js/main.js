require.config({
	paths: {
		"jquery": "libs/jquery/jquery",
		"underscore": "libs/underscore/underscore",
		"backbone": "libs/backbone/backbone"
	},
	shim: {
		"underscore": {
			exports: "_"
		},
		"backbone": {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		}
	}
});

require(["jquery", "underscore", "backbone"], function($, _, Backbone){
	$(function() {
		/* for future sync with server
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
		*/

		var FIRST_TYPE = true;

		var TypeModel = Backbone.Model.extend({});

		var TypeView = Backbone.View.extend({
			
			tagName: "div",

			tpl: _.template($('#item-template').html()),
			
			className: "type-item",

			getTarget: function(){
				return $("#target_input")[0].value;
			},

			initialize: function(){
				this.render();
			},

			inputCheck: function(type_str) {
				if(type_str === this.getTarget()){
					return true;
				}else{
					return false;
				}
			},

			render: function(){
				var type_str = this.model.get("value")
				var type_list = document.querySelector(".type-list");
				this.$el.html(this.tpl({value: type_str}));
				if(!this.inputCheck(type_str)){
					this.el.classList.add("type-item--striked");
				}
				if(FIRST_TYPE){
					type_list.appendChild(this.el);	
					FIRST_TYPE = false;		
				}else{
					type_list.insertBefore(this.el, type_list.childNodes[0]);
				}
				return this;
			}
		});

		$("#target_form").submit(function(event) {
			event.preventDefault();
		});
		
		$("#type_form").submit(function(event) {
			var submit_str = event.target[0].value;
			if(submit_str !== ""){
					var word = new TypeModel({"value" : submit_str});
					var wordView = new TypeView({"model": word});
					event.target[0].value = "";
					event.preventDefault();
			}else{
				event.preventDefault();
			}
		});
	});
});