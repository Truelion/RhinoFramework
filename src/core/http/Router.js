namespace("core.http.Router", {
    initialize : function(){
        this.routes = {};    
    },
    
    add : function(key, handler){
        this.routes[key] = handler;
    },
    
    contains : function(route){
        return this.routes[route];
    },
    
    
    
    resolve : function(href,matches) {
        if(typeof href == "string" && href.indexOf("$.") == 0){
             var exp = new Function("$", "return " + href);
             href = exp(ROUTES)||href;
        }
        if ( typeof href == "object") {
            return this.resolve_object(href)
        } else {
            for (var regex in this.routes) {
                var entry = this.routes[regex]
                if ( typeof entry == "string") {
                    var exp = new RegExp(regex);
                    var matches = href.match(exp);
                    if (matches && matches.length > 0) {
                        var val = this.routes[regex];
                        if ( typeof val == "function") {
                            return val(href, matches);
                        } else {
                            return val;
                        }
                    }
                }
            }

            return href;
        }
    },

    
    resolve_object : function(OBJ){
        if(OBJ){
            if(!OBJ[appconfig.environment]){
                console.error("No URI/Route defined for: " + appconfig.environment, OBJ)
            }
            return OBJ[appconfig.environment];
        }
        return false;
    },
    
    getParameterSeperator : function(url){
        var sep = (url.indexOf("?")>=0)?"&":"?";
    }
}); 


core.http.UrlRouter = new core.http.Router;
/*core.http.UrlRouter.add("/artist\\?([a-z]+)", function(e, matches){
    //console.log(matches);
    return "resources/data/test.txt"
});
core.http.UrlRouter.add("apps/Desktop/main.js", function(e, matches){
    //console.log(matches);
    return "apps/Desktop/main.js"
});*/