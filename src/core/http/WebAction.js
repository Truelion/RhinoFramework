//= require core.http.XMLHttpRequest

namespace("core.http.WebAction", {
    '@inherits': core.http.XMLHttpRequest,
    
    
    initialize : function(uri, params, config){
        this.parent(uri, params);
        this.uri = uri;
        this.params = params;
        this.config=config||{};
        this.async=true;
        return this;
    },
    
    setAsync : function(bool){
        this.async=bool;
    },
    
    open : function(method, path , async){
        async   = ((typeof async == "boolean")?async:this.async);
        method  = method||this.getDefaultMethod();
        
        //path    = core.http.UrlRouter.resolve(path||this.uri);
        //path    = path + this.createQueryString(method,path,this.params);
        this.async  = async;
        this.method = method;
        path = this.buildPath(path);

        this.oXMLHttpRequest.open(method, path, async);
        return this;
    },

    buildPath : function(path){
        path = core.http.UrlRouter.resolve(path||this.uri);
        if(/\{([a-zA-Z0-9]+)\}/g.test(path)){
            path = this.createRESTfulUrl(path)
        }
        else{
            path  = path + this.createQueryString(this.method,path,this.params);
        }
        return path;
    },

    createRESTfulUrl : function(path){
        var self=this;
        path = path.replace(/\{([a-zA-Z0-9]+)\}/g, function(){
          var propName = arguments[1];
          return (self.params[propName]||"")
        });

        return path;
    },

    setParameter : function(key,value){
        this.params[key]=value;
    },
    
    createRequestHeaders : function(){
        if(appconfig.environment != "dev" && this.method == "POST"){
            this.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }
    },
    
    createQueryString : function(method, url, params){
        if(appconfig.environment == "dev" && method == "GET"){
            return this.getParameterSeperator(url) + (params?toQueryString(params):"");
        } else {
            return "";
        }
    },
    
    createPostParams : function(params){
        if(appconfig.environment != "dev" && this.method == "POST"){
            return (params?toQueryString(params):"");
        } else {
            return "";
        }
    },
    
    invoke : function(options){
        this.options = options;
        this.open();
        try{
            this.createRequestHeaders();
            this.send(this.createPostParams(this.params));
        } catch(e){
            alert("invoke: " +e.message)
        }
    },
    
    onstatechange : function(){
        var r = this.oXMLHttpRequest;
        if(r.readyState == XMLHttpRequest.DONE){
            if(r.status == 0||r.status == 200){
                if(this.isFailure(r)){
                    this.onFailure(r);
                } else{
                    try{
                        var data = JSON.parse(r.responseText);
                        if(data.result && data.result.status == "error"){
                            this.onReject(r,data);
                       } else {
                            if (data.result && data.result.state == "LOGOUT") {
                                // Force user to the login page
                                this.onLogout();
                            } else {
                                this.onSuccess(r);
                            }
                        }
                    } catch(e){
                       this.onReject(r); 
                    }
                }
            }
            else {
                this.onFailure(r);
            }
        }
        //this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },
    
    onLogout : function(){
        console.warn("in logout function!");
        var resolvedUrl = core.http.UrlRouter.resolve("$.DATA.LOGOUT");
        location.href=resolvedUrl;
    },
    
    onReject : function(xhr,data){
        if(this.options.onReject) {this.options.onReject(xhr,data); }
        application.dispatchEvent("notification",true,true,{
            type:"UserError",
            message:data.result.message||"An unknown user error occurred",
            httpresponse:xhr
        }); 
    },
    
    onSuccess : function(xhr){
        this.options.onSuccess(xhr, xhr.responseText);
    },
    
    onFailure : function(xhr){
        var errorMessage = "";
        if(xhr.status == 0||xhr.status == 200){
            if(xhr.responseText.length <=0){
                errorMessage = "200 Unknown Error -- response was empty";
            } else {
                errorMessage="200 Unknown Error: " + xhr.statusText;
            }
        } 
        else if(xhr.status == 400){
            errorMessage = "400 Bad Request -- request contains incorrect syntax";
        }
        else if(xhr.status == 401){
            errorMessage = "401 Unauthorized access to"
        }
        else if(xhr.status == 403){
            errorMessage = "403 Forbidden -- file permission protection"
        }
        else if(xhr.status == 404){
            errorMessage = "404 Service Not Found";
        }
        else if(xhr.status == 500){
            errorMessage = "500 Internal Server Error -- server encountered an unexpected condition"
        }
        else if(xhr.status == 501){
            errorMessage = "501 Not Implemented -- HTTP method not supported"
        }
        else if(xhr.status == 502){
            errorMessage = "502 Bad Gateway -- Error due to improperly configured proxy, server overload or firewall issue"
        }
        else if(xhr.status == 503){
            errorMessage = "503 Temporarily not able to handle requests due to overload or maintenance occuring on server"
        }
        else if(xhr.status == 504){
            errorMessage = "504 Gateway Timeout"
        }
        else if(xhr.status == 507){
            errorMessage = "507 Insufficient Storage -- server is out of free memory"
        }
        else if(xhr.status == 509){
            errorMessage = "509 Bandwidth Exceeded -- bandwidth limit imposed by the system administrator has been reached"
        }
        else if(xhr.status == 510){
            errorMessage = "510 Not Extended -- an extension attached to the HTTP request is not supported"
        }
        else{
            errorMessage=xhr.statusText;
            //console.error(xhr.statusText,xhr);  
        }
        
        if(this.config.handleErrors){
            this.options.onFailure(xhr, xhr.responseText);
        } else {
            if(this.uri != ROUTES.DATA.HEARTBEAT){
                Session.State.lastHttpError = errorMessage;
                application.dispatchEvent("notification",true,true,{
                    type:"NetworkError",
                    message:errorMessage||"An unknown network error occurred",
                    httpresponse:xhr
                });
            }
        }
        console.error(errorMessage, xhr);
    },
    
    isFailure : function(xhr){
        if(xhr.status == 0||xhr.status == 200){
            if(xhr.responseText.length <= 0){
                return true;
            }
            else {
                try{
                   var data = JSON.parse(xhr.responseText);
                   if(data && typeof data == "object"){
                       return false;
                   }
                } catch(e){
                    return true
                }
            }
        } else {
            return true
        }
    }
});
