/*********************************************************************
 ::USAGE::
    Abstract class -- not to be used by developers directly. Instead, subclasses
    of this class should be used: Example, see: <<core.http.XMLHttpRequest>>
 **********************************************************************/


namespace("core.http.ResourceLoader", {
    open : function(method, path , async){
        console.info("calling core.http.ResourceLoader with url: ", path)
        var resolvedUrl = core.http.UrlRouter.resolve(path);
        console.log("core.http.ResourceLoader resolved", path, " to " + resolvedUrl)

        return resolvedUrl||path;
    },
    
    send : function(){
        
    },
    
    getDefaultMethod : function(meth){
        /*var method = "GET";
        if(appconfig.environment == "dev"){
            method = "GET"
        }
        else {
            method = meth||"POST"
        }
        return method;*/
        meth = meth||"GET";
        return meth;
    },
    
    getParameterSeperator : function(url){
        var sep = (url.indexOf("?")>=0)?"&":"?";
        return sep;
    }
});
