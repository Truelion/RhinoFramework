//= require Observer
//= require ui.models.ComponentModel

namespace('ui.models.DataModel', {
	'@inherits': ui.models.ComponentModel,

	initialize : function(data, spec){
		this.data = data;
		this.spec=spec;
		this.accessor = new ui.models.Accessor(this.data,this,"")
	},
	
	get : function(keypath){
		var accessor = this.accessor.get(keypath);
		return accessor;
	},
	
	set : function(keypath, value, index){
		var accessor = this.accessor.get(keypath);
		var retVal = accessor.set(value, index);
		return accessor;
	},
	
	proxy : function(keypath){
		return this.spec[keypath];
	},
	
	encode : function(formatType){
		return this.accessor.encode(formatType||"json")
	}
});


