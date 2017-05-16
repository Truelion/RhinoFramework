//= require events/Observer
//= require ui.models.ComponentModel
//= require dom/knockout

namespace('ui.models.KoModel', {
	'@inherits': ui.models.DataModel,

	initialize : function(options, element){
		/*this.data = options.data;
	    this.pageSize = options.pageSize;
	    this.currentPage=0;*/
	   	this.parent(options);
		for(var key in options){
			if(options[key] instanceof Array) {
				this[key]= ko.observableArray(options[key]);
			}
			else {
				this[key] = ko.observable(options[key]);
			}
	   	}
	   	ko.applyBindings(this,element);
	}
});
