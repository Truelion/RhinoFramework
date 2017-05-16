namespace("js.Reflection");
js.Reflection = {
	getMethodString : function(){
		var str="";
		var exclusion = ["@inherits", "@cascade", "@stylesheets", "namespace", "classname", "constructor","getMethodString","source","ancestor"]
		var proto = this.constructor.prototype;
		var definitions = [];
		
		var src = function(obj){
			if(typeof obj == "object") {
				return JSON.stringify(obj)
			}
			else if(typeof obj =="string"){
				return "\"" + obj.toString() + "\""
			}
			else {return obj}
		};
		
		for(var key in proto){
		    if(proto.hasOwnMember(key) && exclusion.indexOf(key) < 0) {
		        definitions.push("\t" + key + " : " + src(proto[key]))
		    }
		}
		
		
		
		return definitions.join(",\n")+"\n";
	},
	
	source : function(){
		return "namespace('" + this.namespace + "', {\n" +
			"\t'@inherits' :  " + this.ancestor.prototype.namespace + ",\n" +
			"\t'@cascade' :  " + this["@cascade"] + ",\n" +
			"\t'@stylesheets' :  ['" + this["@stylesheets"].join("','") + "'],\n" +
			this.getMethodString() +
		"})"
	}
}
