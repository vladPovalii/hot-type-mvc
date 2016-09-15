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

		var AppView = Backbone.View.extend({
			el: "#app",

			events: {
				"keypress #type_input": "addType"
			},

			initialize: function(argument) {
				this.$target_input = $("#target_input");
				this.$type_input = $("#type_input");
				this.$stopwatch_start = $("#start");
				this.$stopwatch_reset = $("#reset");
			},

			targetSubmit: function(event){
				event.preventDefault();
			},

			addType: function(event){
				// TODO 
				// add check for target input
				var ENTER_KEY = 13;
				if(event.which !== ENTER_KEY /*|| !this.$type_input.val()*/ ){
					if(!this.$type_input.val()){
						this.timestamp = Date.now();
						this.$stopwatch_start.click();
					}
					return;
				}
				var type = new TypeModel({
					"type": this.$type_input.val(),
					"target": this.$target_input.val(),
					"time": Date.now() - this.timestamp
				});
				var typeView = new TypeView({"model": type});
				this.timestamp = 0;
				this.$stopwatch_reset.click();
				this.$type_input.val("");
			}

		});

		var TypeView = Backbone.View.extend({
			
			tagName: "div",

			tpl: _.template($('#item-template').html()),
			
			className: "type-item",

			initialize: function(){
				this.render();
			},

			render: function(){
				var type_str = this.model.get("type");
				var target_str = this.model.get("target");
				var type_time = this.model.get("time");
				var type_list = document.querySelector(".type-list");
				this.$el.html(this.tpl({value: type_str}));
				if(type_str !== target_str){
					this.el.classList.add("type-item--striked");
				}
				if(FIRST_TYPE){
					type_list.appendChild(this.el);	
					FIRST_TYPE = false;		
				}else{
					type_list.insertBefore(this.el, type_list.childNodes[0]);
				}
				console.log(type_time);
				return this;
			}
		});
		var appView = new AppView(); 
	});
});