namespace("core.vo.Model", {
	initialize : function (data) {
		this.data = data;
		
		if(this.data && !"id" in this.data){
			this.data.id = Math.uuid(8);
		}

		for(var key in this.data){
			if(this.data.hasOwnProperty(key)){
				this[key] = this.data[key];
			}
		}
		return this;
	},

	isValid : function(){
		return true;
	},

	value : function(){
		return this.data;
	},

	getBlankCopy : function(){
		for(var key in this.data){
			if(this.data.hasOwnProperty(key)){
				this.data[key] = "";
			}
		}
		/*for(var key in data){
			if(data.hasOwnProperty(key)){
				this.data[key] = data[key];
			}
		}*/
		this.data.id = Math.uuid(8);
		return this.data;
	}
})