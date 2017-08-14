
TemplateEnginePlugins = {
	Kruntch : {
		name : "Kruntch",
		ext : ".kruntch",
		parseTemplate : function(templateString, data){
			if(Kruntch) {
	    		var text = Kruntch.Apply(templateString, data);
	        	return text;
	    	} else {
	    		console.warn("TemplateEnginePlugins.parseTemplate() - Kruntch template api not defined.");
	    		return templateString;
	    	}
	    },
	    isAvailable : function(){
	    	return (typeof Kruntch !== 'undefined' && Kruntch !== null)
	    }
	},

	Mustache : {
		name : "Mustache",
		ext : ".mustache",
		parseTemplate : function(templateString, data){
			if(Mustache) {
	    		var text = Mustache.render(templateString, data);
	        	return text;
	    	} else {
	    		console.warn("TemplateEnginePlugins.parseTemplate() - Mustache template api not defined.");
	    		return templateString;
	    	}
	    },
	    isAvailable : function(){
	    	return (typeof Mustache !== 'undefined' && Mustache !== null)
	    }
	},

	Handlebars : {
		name : "Handlebars",
		ext : ".handlebars",
		parseTemplate : function(templateString, data){
			if(Handlebars) {
				var template = Handlebars.compile(templateString);
				var text    = template(data);
	        	return text;
	    	} else {
	    		console.warn("TemplateEnginePlugins.parseTemplate() - Handlebars template api not defined.");
	    		return templateString;
	    	}
	    },
	    isAvailable : function(){
	    	return (typeof Handlebars !== 'undefined' && Handlebars !== null)
	    }
	}
};
