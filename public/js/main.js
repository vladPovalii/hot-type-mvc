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

require(["jquery", "underscore", "backbone","libs/introjs/intro.min" ], function($, _, Backbone, Introjs){
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

		var TypeCollection = Backbone.Collection.extend({
			model : TypeModel,

			initialize: function(){
				this.view = new TypeCollectionView();
			},

			addType: function(type){
				this.view.renderType(type)
			}
		});

		var AppView = Backbone.View.extend({
			el: "#app",

			events: {
				"keypress #type_input": "addType",
				"click #type_input": "typeClicked",
			},

			typeClicked: function(){
				if (this.introEnabled){
					this.intro.exit();
					this.introEnabled = false;
				}
			},

			introEnabled: false,

			initialize: function() {
				this.collection = new TypeCollection();
				this.collection.on("add", this.collection.addType);
				this.$target_input = $("#target_input");
				this.$type_input = $("#type_input");
				this.$stopwatch_start = $("#start");
				this.$stopwatch_reset = $("#reset");
				this.introEnabled = true;
				this.intro = Introjs();
				this.intro.start();
			},

			formatTimestamp(timestamp){
				var spl = (timestamp/1000).toString().split(".");
				if(spl[0] === "0"){
					spl[0] = "00";
				}else if(spl[0].length === 1){
					spl[0] = "0" + spl[0];
				}
				if(spl[1] === "0"){
					spl[1] = "000"
				}else if(spl[1].length === 1){
					spl[1] = spl[1] + "00"
				}else if(spl[1].length === 2){
					spl[1] = spl[1] + "0"
				}
				return spl[0] + ":" + spl[1];
			},
			
			addType: function(event){
				var ENTER_KEY = 13;
				if(event.which === ENTER_KEY && !this.$type_input.val()){
					return;
				}

				if(event.which !== ENTER_KEY){
					if(!this.$type_input.val()){
						this.timestamp = Date.now();
						this.$stopwatch_start.click();
					}
					return;
				}
				/*
				var type = new TypeModel({
					"type": this.$type_input.val(),
					"isCorrect": this.$target_input.val(),
					"time": Date.now() - this.timestamp
				});
				*/
				this.collection.add({
					"type": this.$type_input.val(),
					"isCorrect": this.$target_input.val() === this.$type_input.val(),
					"time": this.formatTimestamp(Date.now() - this.timestamp)
				});

				//var typeView = new TypeView({"model": type});
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

			},

			render: function(model){
				if(!model.get("isCorrect")){
					this.el.classList.add("type-item--striked");
					this.$el.html(this.tpl({
						value: model.get("type"),
						time: ""
					}));
				}else{
					var time_str = model.get("time");
					this.$el.html(this.tpl({
						value: model.get("type"),
						time: model.get("time")
					}));
				}
				return this.el;
			}
		});

		var TypeCollectionView = Backbone.View.extend({
			el: ".type-list",	

			initialize: function(){
				this.typeView = new TypeView();
			},

			render: function(){

			},

			renderType: function(type){
				typeEl = this.typeView.render(type);
				if(FIRST_TYPE){
					this.el.appendChild(typeEl);	
					FIRST_TYPE = false;		
				}else{
					this.el.insertBefore(typeEl, this.el.childNodes[2]);
				}
			}
		})

		var appView = new AppView(); 
	});
});