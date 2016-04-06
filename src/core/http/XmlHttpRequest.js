//= require core.http.ResourceLoader

namespace("core.http.XMLHttpRequest", {
    '@inherits': core.http.ResourceLoader,
    
    
    initialize : function(){
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        return this;
    },
    
    addEventListener : function(type, handler, capture){
        capture = (typeof capture == "boolean") ? capture:false;
        this.oXMLHttpRequest.addEventListener(type, handler, capture);
    },
    
    open : function(method, path , async){
        this.method = method||this.getDefaultMethod();
        var url = this.parent(this.method, path , async);
        if(this.method.toLowerCase() == "get"){
            url = url + this.getParameterSeperator(url) + (this.params?toQueryString(this.params):"");
        }

        this.oXMLHttpRequest.open(this.method, url, ((typeof async == "boolean")?async:true));
    },
    
    setRequestHeader : function(prop, value){
        //oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
        if(prop && value){
            this.oXMLHttpRequest.setRequestHeader(prop, value);
        }    
    },
    
    send : function(data){
        var parsedString="";
        if(this.method.toLowerCase()=="post"){
            if(data && typeof data == "object"){
                parsedString = JSON.stringify(data)
            }
            else{
                parsedString=data;
            }
        }
        this.oXMLHttpRequest.send(parsedString);
    },
    
    onstatechange : function(){
        this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },
    
    onreadystatechange : function(){}
});


/*********************************************************************
 ::USAGE::
 
    var  oXMLHttpRequest = new core.http.XMLHttpRequest;
         oXMLHttpRequest.open("GET", "apps/Sample/main.js", true);
         oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
         oXMLHttpRequest.onreadystatechange  = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                console.log(this.responseText)
            }
         }
         oXMLHttpRequest.send(null);
 **********************************************************************/