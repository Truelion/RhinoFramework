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
//= require core/data/CircularBuffer
//= require libs/rison.js
//= require libs/Device
//= require libs/Cookie
//= require libs/UserAgent.js
//= require libs/Kruntch-1.2.0.js
//= require libs/TemplateEnginePlugins.js
//= require core/traits/UrlHashState.js
//= require core/traits/Paginator.js


//-------------------MODELS--------------------
//= require core/vo/Model
//= require core/vo/Account


//----------------CONTROLLERS------------------
//= require core/controllers/DataController
//= require core/controllers/AccountDataController
//= require core/controllers/StorageController

//---------------------UI----------------------
//= require core/ui/WebComponent
//= require core/ui/WebApplication
//= require core/ui/Panel
//= require core/ui/WindowPanel


//-----------------BOOTLOADER------------------
//= require bootloader



namespace("core.Application", {
    '@inherits' : core.ui.WebComponent,
    '@cascade'  : true,
    '@traits'   : [],
    '@stylesheets' : [],
    

    preInitialize : function(model, element) {
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        core.data.StorageManager.initialize(Config.StorageManager.STORE_KEY);
        this.session = new core.controllers.StorageController;
        this.parent(model, element.body||element);
        return this;
    },


    initialize : function () {
        var self = this;
        this.parent(arguments);
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.initAgentClasses();
    },

    isUserSessionValid : function(){
        if(!this.account) {
            this.account = new core.vo.Account(this.db.user);
        };
        return this.account.isValid();
    },

    onRender : function(e){
        var self=this;
        setTimeout(function(){self.element.style.opacity=1;},appconfig.foucdelay);
    },

    getLocationHash : function(){
        var hash = location.hash.replace("#","");
        var params = rison.decode(hash);
        return params;
    },

    setLocationHash : function(params){
        location.hash = "#" + rison.encode(params);
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
    }
});

