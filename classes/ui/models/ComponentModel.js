//= require Observer

namespace('ui.models.ComponentModel', {
	"@traits": [new Observer],
	
	/*preInitialize: function(data, element) {
		this.resetListeners();
		this.resetModel(data);
		this.setElement(element);
		this.initialize(data, element);
	},*/

	initialize: function(data, element) {
		this.resetListeners();
		this.resetModel(data);
		this.setElement(element);
		//this.initialize(data, element);
	},
	
	setElement : function(element){
		this.element = element||this;
	},
	
    
	start: function() {},
	
	resetListeners: function() {
		this.observations = [];
		this.subscribers = {};
	},
	
	resetModel: function(data) {
		this.data = data;
	},
	
	set: function(prop, value) {
		this.data[prop] = value;
		this.dispatchEvent("modelchanged", {
			model: this,
			name: prop
		});
	},
	
	get: function(prop) {
		return this.data[prop]; 
    },
	
	isValid: function() {
        var self = this;
		return true;
	},

	find: function(jsonquery) {
		
	},
	
	registerUI:function(){},
	
	resolve: function(path, obj){
			var scope       = obj||window;
			var nsParts     = path.split(/\./); 
			//console.warn(nsParts)
			for (var i = 0; i <= nsParts.length - 1; i++) {
					if(i >= nsParts.length - 1) {
						return scope[nsParts[i]]
					}
					else {
		            	scope = scope[nsParts[i]];
		           }
                            //console.info(scope)
			};
			return scope; 
	}
});
