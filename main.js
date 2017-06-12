appconfig = window.appconfig||{};

//----------EXTENSIONS----------------
//= require core/extensions/Math
//= require core/extensions/Object
//= require core/extensions/String
//= require core/extensions/Document
//= require core/extensions/Function
//= require core/extensions/Array
//= require core/extensions/Window

//--------------LIBS------------------
//= require libs/Observer
//= require libs/Ecmascript6ClassTranspiler.js
//= require core/lang/Class
//= require core/lang/Trait
//= require core/http/XmlHttpRequest
//= require core/http/WebAction
//= require core/http/WebIterator
//= require core/http/ClassLoader
//= require core/http/ScriptLoader
//= require core/http/Router
//= require core/traits/EventBus
//= require core/traits/ResourcePathTransformer
//= require core/traits/InitializeApplicationData
//= require core/data/StorageManager
//= require libs/rison.js
//= require libs/Device
//= require libs/Cookie
//= require libs/UserAgent.js
//= require libs/Kruntch-1.2.0.js
//= require core/traits/UrlHashState.js
//= require core/traits/Paginator.js


//-------------------MODELS--------------------
//= require core/vo/Model
//= require core/vo/Account


//----------------CONTROLLERS------------------
//= require core/controllers/DataController
//= require core/controllers/AccountDataController
//= require core/controllers/LocalStorageDataController
//= require core/controllers/SessionDataController

//---------------------UI----------------------
//= require core/ui/WebComponent
//= require core/ui/WebApplication
//= require core/ui/Panel
//= require core/ui/WindowPanel
//= require core/ui/ModalScreen


//-----------------BOOTLOADER------------------
//= require bootloader



namespace("core.Application", {
	'@inherits' : core.ui.WebComponent,
    '@cascade'  : true,
    '@traits'   : [],
    '@stylesheets' : [],
    
    MAIN_ACTIVITY : Config.Activities.MAIN,

    preInitialize : function(model, element) {
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        core.data.StorageManager.initialize(Config.StorageManager.STORE_KEY);
        this.session = new core.controllers.SessionDataController;
        window.addEventListener ("load", this.onLoad.bind(this), true);
        window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        this.parent(model, element.body||element);
        return this;
    },


    onPause : function(){
        alert(this.namespace)
    },


    initialize : function () {
    	var self = this;
        this.parent(arguments);
        
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.addEventListener("appopened", this.onApplicationOpened.bind(this), false);
        this.addEventListener("openapp", this.onLaunchWebApplication.bind(this), false);
        this.addEventListener("beforeopen", this.onBeforeApplicationOpened.bind(this), false);

        this.initAgentClasses();
        this.intiDefaultApp();
    },

    intiDefaultApp : function(){
        var defaultHashPath = rison.encode({appref:this.MAIN_ACTIVITY});
        var h = window.location.hash;
        if(!h||(h && h.length <=0)){
            window.location.hash = defaultHashPath;
        }
    },

    logout : function(){
        location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")";
    },

    onBeforeApplicationOpened : function(e){
        if(!this.isUserAccountAvailable()){
            e.preventDefault();
            e.stopPropagation();
            location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")";
        } else{
            this.account.touch();
            if(e.data.appref){
                if(e.data.appref == Config.Activities.LOGIN){
                    e.preventDefault();
                    e.stopPropagation();
                    location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")";
                }
            }
        }
    },

    isUserAccountAvailable : function(){
        console.warn("core.Application::isUserAccountAvailable() - Deprecated. Use #isUserSessionValid()");
        return this.isUserSessionValid();

        // if(!this.account) {
        //     this.account = new core.vo.Account(this.db.user);
        // };
        // return this.account.isValid();
    },

    isUserSessionValid : function(){
        var user = this.session.get("user");
        this.account = new core.vo.Account(user);
        return this.account.isValid();
        //return false;
    },

    open : function(data){
        if(data.appref == Config.Activities.LOGIN){
            location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")"
        } else {
            this.dispatchEvent("openapp", true, true, data);
        }
    },

    onLaunchWebApplication : function(e){
        this.openApplication(e);
    },

    onApplicationOpened : function(e){
        if(e.data && e.data.appref){
            var appref = this.getWebApplicationInfoByRef(e.data.appref);
            var ns = appref.namespace;
            var instance = this.getApplicationInstance(ns);
            if(instance && instance.onResume) {
                instance.onResume(e);
            }
        }
    },

    openApplication : function(e){
        if(e.cancelable){
            var evt = this.dispatchEvent("beforeopen",true,true, e.data);
            if(evt.defaultPrevented){
                console.info("openApplication(e) was prevented from running by another process\
                    listening to the 'beforeopen' event. Original event is: ", e);
                return;
            };
        }

        var appref = e.data.appref;
        var appInfo = this.getWebApplicationInfoByRef(appref);
        
        if(!appInfo) {
            console.warn("There is no application defined for id/ref: " + (appref));
            return;
        };
        this.globalApplicationSpinner.classList.add("active");
        this.doAppLoadTest(e,appInfo);
    },

    doAppLoadTest : function(e,appInfo) {
        var self=this;
        var force = (typeof e.data.force == "boolean")?e.data.force:false;
            self.createApplicationInstance(appInfo, function(appInstance){
                var appContainer = document.querySelector(".application-container")||self.element;
                if(self.currentRunningApplication && 
                    self.currentRunningApplication.namespace != appInstance.namespace){
                    self.blurCurrentRunningApplication(e);
                }
                appContainer.innerHTML = "";
                appContainer.appendChild(appInstance.element);
                self.currentRunningApplication = appInstance;
                self.globalApplicationSpinner.classList.remove("active");
                appContainer.classList.add("active");
                self.dispatchEvent("appopened", true,true, e.data);
            }, force, e);
    },

    requestRefreshCycle : function(app){
        this.currentRunningApplication = app;
    },

    blurCurrentRunningApplication : function(e){
        var appContainer = document.querySelector(".application-container")||this.element;
        var currentApp = this.currentRunningApplication;
        if(currentApp){
            alert("unload currentRunningApplication: " + this.currentRunningApplication.namespace)
            this.currentRunningApplication.onBlur(e);
            appContainer.removeChild(this.currentRunningApplication.element);
            appContainer.innerHTML = "";
        } else{
            appContainer.innerHTML = "";
        }
        this.currentRunningApplication = null;
        this.dispatchEvent("appunload", true, true, {});
    },

    createApplicationInstance : function(appInfo, callback, force, e){
        force = (typeof force == "boolean")?force:true;
        var self=this;
        if(!NSRegistry[appInfo.namespace]){
            var c = new core.http.ClassLoader;
            c.addEventListener("load", function(data){
                var d = new NSRegistry[appInfo.namespace];
                    d.onActivated(e);
                if(!force){
                    self.storeApplicationInstance(appInfo.namespace, d);
                }
                d.onFocus(e);
                callback(d);
            }, false);
            c.load(appInfo.namespace)
        } else {
            if(force == false) {
                var d = this.getApplicationInstance(appInfo.namespace);
                if(!d) {
                    d = new NSRegistry[appInfo.namespace];
                    d.onActivated(e);
                } else {
                    console.log("app instance loaded from memory")
                }
                this.storeApplicationInstance(appInfo.namespace, d);
                d.onFocus(e);
                callback(d); return;
            }
            else {
                var d = new NSRegistry[appInfo.namespace];
                    d.onFocus(e);
                    d.onActivated(e);
                callback(d);
            }
        }
    },

    storeApplicationInstance : function(ns, appInstance){
        if(!this.appinstances){
            this.appinstances = {};
        }
        if(!this.appinstances[ns]){
            this.appinstances[ns] = appInstance;
        }  
    },
    
    getApplicationInstance : function(ns){
        if(!this.appinstances){
            this.appinstances = {};
        }
        return this.appinstances[ns]; 
    },
    
    removeApplicationInstance : function(ns){
        console.log("app instance erased from memory")
        if(!this.appinstances){
            this.appinstances = {};
        }
        delete this.appinstances[ns]; 
        var defaultApp = app.constants.DEFAULT_HOME_APP;
        this.dispatchEvent("openapp",true,true,{appref:defaultApp})
    },

    getApplicationInstanceCount : function(){
        var count=0;
        for(var i in this.appinstances){
            count++
        }
        return count;
    },

    getWebApplicationInfoByRef : function(appref){
        appref = appref.replace("/",".","g");
        return {namespace:appref, route:"$."+appref};
    },

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
        this.element.querySelector(".application-container").appendChild(el);
    },

    hideAppSpinner:function(){
        this.element.classList.remove("disabled")
        this.globalApplicationSpinner.classList.remove("active");
    },

    onLoad : function onLoad(e) {
        var self=this;
        setTimeout(function(){
            self.doHashChangedEvent(e);
        }.bind(this),appconfig.foucdelay||1000)
    },

    onRender : function(e){
        this.globalApplicationSpinner   = '<span id="global-application-spinner" class="fa fa-spinner fa-spin"></span>'.toHtmlElement();
        this.element.appendChild(this.globalApplicationSpinner);
        
        var canvas=this.querySelector(".canvas");
        if(canvas){
            canvas.style.visibility="visible";
            setTimeout(function(){canvas.style.opacity=1;},appconfig.foucdelay);
        }
    },

    getLocationHash : function(){
        var hash = location.hash.replace("#","");
        var params = rison.decode(hash);
        return params;
    },

    setLocationHash : function(params){
        location.hash = "#" + rison.encode(params);
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

    setContentView : function(){

    },

    globalzindex : 600000,
    
    absoluteZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    },

    onDeviceReady : function(){
        if(navigator.splashscreen){
            navigator.splashscreen.hide();
        }
    },

    initAgentClasses : function(){
        if(UserAgent.isMobile() || appconfig.ismobile){
            var device =
            UserAgent.isAndroid()?
                "android":
                    UserAgent.isIOS()?
                        "ios":
                           UserAgent.isWindowsMobile()?
                             "iemobile":"computer";
        }
        document.body.setAttribute("browser", browser.DeviceInfo.browser);
        document.body.setAttribute("os", browser.DeviceInfo.OS);
        document.body.setAttribute("device", device);
    },

    initUrlRoutesTable : function(){
        var self = this;
        core.http.UrlRouter.process(ROUTES);
        self.dispatchEvent("routesloaded", true, true, null);
    }
});

