//=require core.vo.Model

namespace("todo.models.Todo", {
	'@inherits' : core.vo.Model,

	STATUS_TYPES : [
		"active", 
		"completed"
	],

	initialize : function (data) {
		if(!data) {return}
		this.parent(data);
		return this;
	},

	isValid : function(){
		return (
			this.data &&
			this.data.title != "undefined" && 
			this.data.title.length > 0 &&
			this.isValidStatusType());
	},

	isValidStatusType : function(){
		return this.STATUS_TYPES.indexOf(this.data.status) >=0
	}
});