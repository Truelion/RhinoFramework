//= require w3c.components.HtmlComponent

namespace("ui.Application", 
{
	'@inherits' : w3c.HtmlComponent,
	'@stylesheets' : [
	   "resources/css/reset.css",
       "resources/css/framework.css"
    ],
    
    
    preInitialize : function(model, element) {
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        StorageManager.initialize(appconfig.namespace+"_"+ (appconfig.appid||Math.uuid2()) );
        
        if(window.addEventListener){
            window.addEventListener ("load", this.onLoad.bind(this), true);
            window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        }
        this.parent(model, element);
        this.setSpinner();
        this.showSpinner();
        this.setBrowserClassname();
        return this;
    },

    /*initialize : function(model, element){
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        
        if(window.addEventListener){
            window.addEventListener ("load", this.onLoad.bind(this), true);
            window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        }
        this.parent(model, element);
        this.setSpinner();
        this.showSpinner();
        this.setBrowserClassname();
        return this;
    },*/
    
    setSpinner : function (){
        var el = '<div class="bubblingG">\
                    <span id="bubblingG_1"></span>\
                    <span id="bubblingG_2"></span>\
                    <span id="bubblingG_3"></span>\
                  </div>'.toHtmlElement();
        this.spinner = el;
    },
    
    getSpinner : function (){
        return this.spinner.cloneNode(true);
    },
    
    showSpinner: function(){
        var el = this.getSpinner();
        this.currentSpinner = el;
        this.element.appendChild(el);
    },
    
    onLoad : function onLoad(e) {
        var self=this;
        var canvas=this.canvas;//this.querySelector(".canvas");
        var spinner = this.currentSpinner;
        setTimeout(function(){
            canvas.style.visibility="visible";
            canvas.style.opacity=1;
            self.removeChild(spinner);
            self.dispatchEvent("loaded", false, false, {event:e});
            self.doHashChangedEvent(e);
        }.bind(this),appconfig.foucdelay||1000)
    },
    
    doHashChangedEvent : function(){
        var hash = location.hash.substring(1);
        if(hash && hash.length > 0) {
            this.onLocationHashChanged(location);
        }
    },
    
    onLocationHashChanged : function(e){
        this.dispatchEvent("statechanged", false, false, {event:e})
    },
    
    generateSkin : function(){
        var skin = "";
        var a = [].toArray(document.getElementsByTagName("style"))
        
        for(var i=0; i<=a.length-1; i++){
            if(!a[i].getAttribute("component")) {continue;}
            skin += a[i].innerHTML
        }
        console.log(skin)
    },
    
    setBrowserClassname : function(){
        try {
            this.addClass(browser.DeviceInfo.OS, document.body);
            this.addClass(browser.DeviceInfo.browser, document.body);
            document.body.setAttribute("browser", browser.DeviceInfo.browser);
            document.body.setAttribute("os", browser.DeviceInfo.OS);
            this.addClass("application")
        } catch(e) {
            try{
                console.warn("There was a problem setting the agent/device information on the <body> tag.")
                console.warn(" |--> " + e.message)
            } catch(e){}
        }
    },
    
    globalzindex : 600000,
    
    absoluteZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    },

    
    innerHTML:"<div></div>",
    
    cssText:
    'body > .canvas {\
        visibility: hidden;\
        opacity: 0;\
        transition: opacity 2s;\
        -webkit-transition:opacity 2s;\
        -o-transition:opacity 2s;\
        -moz-transition:opacity 2s;\
        -ms-transition:opacity 2s;\
    }'
});
