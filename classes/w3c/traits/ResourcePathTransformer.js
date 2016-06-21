namespace("w3c.traits.ResourcePathTransformer");

w3c.traits.ResourcePathTransformer = {
    resourcepath : function resourcepath(filepath){
        var apppath = appconfig.apppath||"";
        filepath = filepath.replace("[$theme]", ("themes/"+appconfig.theme));
        filepath = filepath.replace("[$icon]",  ("themes/"+appconfig.theme) + "/images/icons/");

        var path = apppath + filepath;
        return this.relativeToAbsoluteFilePath(path);
    },
    
    relativeToAbsoluteFilePath : function(path){
        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        
        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + this.namespace.replace(/\./gim,"/") + "/");
        } 
        else if(path.indexOf("http") == 0){
            return path;//.replace("./", appconfig.apppath + "/" + ns.replace(".","/","g") + "/");
        }
        else{
            if(path.indexOf(appconfig.apppath)<0){
                path = apppath + path
            }
        }
        path = /http:/.test(path)? path : path.replace("//","/");
        return path;
    }
};