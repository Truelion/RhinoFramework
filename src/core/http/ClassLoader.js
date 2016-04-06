//= require core.http.ResourceLoader

namespace("core.http.ClassLoader", 
{
    '@inherits': core.http.ResourceLoader,
    
    initialize : function(){
        this.readyState = 0;
        this.status     = null;
        this.statusText = null;
        this.headNode   = document.getElementsByTagName("head").item(0);
    },
    
    open : function( iMethod, iURL, iAsync) {
        var url = this.parent(iMethod, iURL , iAsync);
        this.method = "GET";
        this.URL    = url;
    },
    
    send : function() {
        this.script = this.createScript(this.URL);
        var self            = this;
        var onLoad          = function() {
            self.status     = 200;
            self.statusText = "OK";
            self.readyState = 4;
            if (self.onreadystatechange) {
                self.onreadystatechange();
            }
        }
        var onReadyStateChange = function( iEvent ) {
            var e = (iEvent?iEvent:window.event).target?(iEvent?iEvent:window.event).target:(iEvent?iEvent:window.event).srcElement;
            if (e.readyState === "loaded" || e.readyState === "complete") {
                onLoad();
            }
        }
        if (navigator.product === "Gecko") {
            this.script.onload = onLoad;
        }
        else {
            this.script.onreadystatechange = onReadyStateChange;
        }
        
        this.headNode.appendChild(this.script);
        this.readyState = 1;
        if (this.onreadystatechange) {
            this.onreadystatechange(self);
        }
    
    },
    
    createScript : function(_src){
        var head   = document.getElementsByTagName("head").item(0);
        var scripts = head.getElementsByTagName("script");
        var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", (config.charset || "utf-8"));
            script.setAttribute("src", _src);
            return script;
    }
});


/*********************************************************************
 ::USAGE::
 
    var c = new core.http.ClassLoader();
    c.open("GET", "apps/Desktop/main.js");
    c.onreadystatechange = function(){
        if(this.readyState == 4){
            alert(apps.Desktop) //apps.Desktop object should exist
        }
    }
    
    c.send();
 **********************************************************************/
