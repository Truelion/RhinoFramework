namespace("core.traits.ResourcePathTransformer");

core.traits.ResourcePathTransformer = {
    resourcepath : function (filepath, ns){
        filepath = filepath||"";
        var apppath = appconfig.apppath||"";
        filepath = filepath.replace("[$theme]", ("themes/"+appconfig.theme));
        filepath = filepath.replace("[$icon]",  ("themes/"+appconfig.theme) + "/images/icons/");

        var path = apppath + filepath;
        return this.relativeToAbsoluteFilePath(path, ns);
    },
    
    relativeToAbsoluteFilePath : function(path, ns){
        var self=this;
            var engine = this.getTemplateParser();
            var engineWarningMsg = this.namespace + "#renderDOMTree() - is specifying a template engine api, '" + engine.name + "', that is not found. Defaulting to 'Kruntch'.";
                engine = engine.isAvailable()?
                    engine:
                    (function(){
                        console.warn(engineWarningMsg); 
                        return self.getDefaultTemplateEngine()
                    })();


        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        ns = ns||this.namespace;

        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + ns.replace(/\./gim,"/") + "/");
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
        if(path.indexOf(".html")>=0 && engine != TemplateEnginePlugins.Kruntch){
            path = path.replace(/\.html/, engine.ext+".html");
        }
        return path;
    }
};
