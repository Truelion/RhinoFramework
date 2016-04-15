//= require extensions/Math
//= require extensions/Object
//= require extensions/String
//= require extensions/Document
//= require extensions/Function
//= require extensions/Array
//= require extensions/Window


//= require js.Class
//= require js.Trait
//= require Device

// require EcmaScriptTemplates
// require mustache
// require Kruntch

//= require ui.models.ComponentModel
//= require w3c.components.HtmlComponent
//= require ui.Application

//=require src/libs/rison.js
//=require src/core/libs/StorageManager.js
//=require src/core/data/Accessor.js
//=require src/core/traits/InfiniteScroll.js
//=require src/core/libs/UserAgent.js
//=require src/libs/Kruntch-1.2.0.js
//=require src/core/libs/Draggable.js
//=require src/core/libs/abbrNum.js
//=require src/core/libs/AsciiLib.js
//=require src/core/http/Router.js
//=require src/core/http/ResourceLoader.js
//=require src/core/http/ClassLoader.js
//=require src/core/http/XmlHttpRequest.js
//=require src/core/http/WebAction.js
//=require src/core/http/WebIterator.js
//=require src/core/ui/WebComponent.js
//=require src/core/ui/ApplicationBar.js
//=require src/core/ui/Button.js
//=require src/core/ui/WebApplication.js
//=require src/core/ui/Panel.js
//=require src/core/ui/WindowPanel.js
//=require src/core/ui/Notification.js
//=require src/core/ui/ModalScreen.js
//=require src/core/ui/components/HelpWizard/HelpWizard.js
//=require src/core/traits/UrlHashState.js


//= require boot.main



namespace("framework.Application",
{
    '@inherits' : ui.Application,
    '@cascade'  : false,
    '@stylesheets' : [],

    APP_REFRESH_INTERVAL:5000,
    
    onLine : true,
    isLoggedIn : true,
    
    initialize : function(model, element) {
        var self = this;
        this.parent(model, element);
 
        
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        console.info("DEVICE RESOLUTION:", window.innerWidth + " x " + window.innerHeight);
        this.setUserAgentClasses();
        this.initializeUrlRoutesTable();
        this.initializeHeartBeatMonitor();

        //STATE
        this.recentAppsSelector         = this.querySelector(".Navigator .RecentAppsSelectBox");
        this.startMenu                  = this.querySelector(".ApplicationBar .StartMenu");
        this.searchBox                  = this.querySelector(".SearchBox");
        this.wallpaper                  = this.querySelector("#wallpaper");
        this.globalApplicationSpinner   = this.querySelector("#global-application-spinner");
        this.appsScreen                 = this.querySelector(".application-container");
        
        //EVENTS
        this.addEventListener("appopened", this.onApplicationOpened.bind(this), false);
        if(this.searchBox){
            this.searchBox.addEventListener("focus", this.onSearchBoxFocused.bind(this), false);
        }

        this.addEventListener("startmenu", this.onStartMenuActionReceived.bind(this), false);
        this.addEventListener("notification", this.onNotificationReceived.bind(this), false);
        this.addEventListener('showdashboard', this.onReturnToDashboard.bind(this), false);
        this.addEventListener('fullscreenmode', this.onToggleFullscreen.bind(this), false);
        this.addEventListener("modalize", this.onModalize.bind(this), false);
        this.addEventListener("openapp", this.onLaunchWebApplication.bind(this), false);
        this.addEventListener("closehelp", this.onCloseHelpWizard.bind(this), false);
        this.addEventListener("loaded",this.onApplicationLoaded.bind(this), false);
        document.addEventListener("fullscreenchange", this.onFullscreenChanged.bind(this),false);
        document.addEventListener("webkitfullscreenchange", this.onFullscreenChanged.bind(this),false);
        document.addEventListener("mozfullscreenchange", this.onFullscreenChanged.bind(this),false);
        document.addEventListener("MSFullscreenChange", this.onFullscreenChanged.bind(this),false);
        window.addEventListener("resize", this.onWindowResized.bind(this).debounce(700), false);
        this.addEventListener("sessionloaded",this.onApplicationSessionLoaded.bind(this), false);
        this.addEventListener("logout",this.onApplicationLogout.bind(this), false);
        this.addEventListener("releaseapp", this.onReleaseApp.bind(this), false);

        this.addEventListener("openmenu", this.onShowStartMenu.bind(this), false);
        this.addEventListener("togglemenu", this.onToggleStartMenu.bind(this), false);
        this.addEventListener("hidemenu", this.onHideStartMenu.bind(this), false);

        this.bootup();
    },

    onDeviceReady : function(){
        if(navigator.splashscreen){
            navigator.splashscreen.hide();
        }
    },

    onToggleStartMenu : function(e){
        this.startMenu.prototype.toggle();
    },

    onShowStartMenu : function(e){
        this.startMenu.prototype.show();
    },

    onHideStartMenu : function(e){
        this.startMenu.prototype.hide();
    },

    onStartMenuActionReceived : function(e){
        setTimeout(function(){
            if(e.data.active){
                this.wallpaper.classList.add("blurred");
                this.appsScreen.style.visibility="hidden"
            } else{
                this.wallpaper.classList.remove("blurred")
                this.appsScreen.style.visibility="visible"
            }
        }.bind(this),100);
    },
    
    setModalScreen : function(modalScreen){
        this.element.appendChild(modalScreen.element);
        this.element.classList.add("modalized");
    },
    
    removeModalScreen : function(modalScreen){
        this.element.removeChild(modalScreen.element);
        var nextModal = this.querySelector(".ModalScreen");
        if(!nextModal){
            this.element.classList.remove("modalized");
        }
    },
    
    onApplicationOpened : function(e){},
    
    
    onApplicationSessionLoaded : function(){
        var self=this;
        if(appconfig.appref){
            this.dispatchEvent("openapp",true,true,{appref:appconfig.appref})
        };
        this.dispatchEvent("appready",true,true,{});
    },
    
    initializeHeartBeatMonitor : function(){
        if(!appconfig.heartbeat){
            return;
        }
        var self=this;
        if (navigator.onLine) {
            this.onLine=true;
        }
        
        window.addEventListener('online', function(e) {
          self.onLine=true;
          application.dispatchEvent("connection",true,true,{status:"online"});
        }, false);
        
        window.addEventListener('offline', function(e) {
          self.onLine=false;
          application.dispatchEvent("connection",true,true,{status:"offline"});
        }, false);

        var dispatchOfflineNotification = function(){
            if(self.onLine){
                self.onLine=false;
                application.dispatchEvent("connection",true,true,{status:"offline"});
                application.dispatchEvent("notification",true,true,{
                  type:"NetworkOffline",
                  message:"Working offline -- detected connection failure, unable to reach server.",
                  httpresponse:null
                });
            }
            doHeartBeatCall(randomHeartBeatTiming(1000,1500));
        };
        
        var randomHeartBeatTiming = function(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        
        var dispatchSessionNotification = function(session){
            if(!session) {
                if(self.isLoggedIn) {
                    self.isLoggedIn = false;
                    application.dispatchEvent("session",true,true,{status:false});
                    application.dispatchEvent("notification",true,true,{
                      type:"Warning",
                      message:"Session expired. Login to prevent data loss.",
                      httpresponse:null,
                      forceclose:true
                    });
                }
            } else {
                if(!self.isLoggedIn) {
                    self.isLoggedIn = true;
                    application.dispatchEvent("session",true,true,{status:true});
                    application.dispatchEvent("notification",true,true,{
                      type:"Information",
                      message:"Welcome back " + Session.State.AccountProfile.firstname,
                      httpresponse:null
                    });
                }
            }
        };
        
        var dispatchOnlineNotification = function(r, responseText){
            if(!self.onLine){
                self.onLine=true;
                Session.State.lastHttpError="";
                application.dispatchEvent("connection",true,true,{status:"online"});
                application.dispatchEvent("notification",true,true,{
                  type:"NetworkOnline",
                  message:"Working online - we're back up and running.",
                  httpresponse:null
                });
            }
            try{
                var data = JSON.parse(responseText);
                if(data && data.result){
                    if("session" in data.result){
                        var session = data.result.session;
                        dispatchSessionNotification(session);
                    } else{
                        dispatchSessionNotification(true);
                    }
                }
            } catch(e){
               dispatchSessionNotification(false);
                console.error(e)
            }
            if(!self.isLoggedIn){
                doHeartBeatCall(randomHeartBeatTiming(1000,1500));
            }
            else{
                doHeartBeatCall(randomHeartBeatTiming(5000,10000));
            }
        };
        
        var doHeartBeatCall = function(seconds){
            setTimeout(function(){
                var action = new core.http.WebAction(ROUTES.DATA.HEARTBEAT, {
                    guid:Math.uuid(8),
                    type:"heartbeat",
                    error:Session.State.lastHttpError||"",
                    profile_id:Session.State.AccountProfile.profile_id
                }, {handleErrors:true});
                action.invoke({
                    onSuccess  : dispatchOnlineNotification,
                    onFailure  : dispatchOfflineNotification,
                    onRejected : dispatchOfflineNotification
                });
            }, seconds)
        };
        doHeartBeatCall(randomHeartBeatTiming(5000,10000))
    },
    
    onReleaseApp : function(e){
        //debugger;
        var self=this;
        var ns = e.data.ns;
        this.removeApplicationInstance(ns);
        if(self.currentRunningApplication){
            if(ns == self.currentRunningApplication.namespace){
                setTimeout(function(){
                    self.onReturnToDashboard()
                },100);
            }
        }
    },
    
    onSearchBoxFocused : function(){
        this.startMenu.prototype.onHideStartMenuPanel();    
    },
    
    setUserAgentClasses : function(){
        if(UserAgent.isMobile() || appconfig.ismobile){
            this.element.classList.add("mobile");
            if(UserAgent.isAndroid()){
                this.element.classList.add("android");
            }
            else if(UserAgent.isIOS()){
                this.element.classList.add("ios");
            } 
            else if(UserAgent.isWindowsMobile()){
                this.element.classList.add("iemobile");
            }
        }
    },
    
    onApplicationLogout : function(){
        var doit = confirm("Do you wish to exit this application?");
        if(doit){
            var resolvedUrl = core.http.UrlRouter.resolve("$.DATA.LOGOUT");
            location.href=resolvedUrl;
        }    
    },
    
    
    bootup : function(){
        var self=this;
        
        //just to get the css to load.
        new core.ui.Notification({type:"Information", message:""},null);

        if(appconfig.appref){
            this.element.classList.add("spa");
        }
        setTimeout(function() {
            self.beginVisitorSession();
            self.beginAppRefreshInterval();
        },400);
    },
    
    onWindowResized : function(e){
        console.warn("Resize detected")
        this.onCloseHelpWizard();
        if(this.currentRunningApplication && this.currentRunningApplication.isFocused()){
            this.currentRunningApplication.onScreenResized()
        }
        this.dispatchEvent("screensized", true,true,{})
    },

    
    getHelpWizard : function(){
        this.__help_wizard_ = new core.ui.components.HelpWizard;
        return this.__help_wizard_;
    },
    
    onCloseHelpWizard : function(e){
        if(this.__help_wizard_){
            if(this.__help_wizard_.element && this.__help_wizard_.element.parentNode){
                this.__help_wizard_.deactivate();
                this.__help_wizard_.element.parentNode.removeChild(this.__help_wizard_.element);
            }
        }
    },

    onApplicationLoaded : function(){},

    
    onFullscreenChanged : function(e){
        var _FullScreenElement =    document.fullscreenElement||
                                    document.webkitFullscreenElement||
                                    document.mozFullScreenElement||
                                    document.msFullscreenElement;
        var toggleButton = this.fullscreenToggleButton;
        if(toggleButton){
            if(_FullScreenElement){
                this.fullscreenToggleButton.classList.add("selected");
            }  else{
                this.fullscreenToggleButton.classList.remove("selected");
            }
        }
    },
    
    onToggleFullscreen : function(e){
        //debugger;
        if(!appconfig.fullscreenmode){return}
        //if(!UserAgent.isMobile()){return}
        var el = this.element;
        var _FullScreenEnabled =    document.fullscreenEnabled||
                                    document.webkitFullscreenEnabled || 
                                    document.mozFullScreenEnabled ||
                                    document.msFullscreenEnabled;
                                    
        var _FullScreenElement =    document.fullscreenElement||
                                    document.webkitFullscreenElement||
                                    document.mozFullScreenElement||
                                    document.msFullscreenElement;
                                    
        var _CancelFullScreen  =    document.exitFullscreen||
                                    document.webkitExitFullscreen||
                                    document.mozCancelFullScreen||
                                    document.msExitFullscreen;
                                    
        var _RequestFullScreen =    el.requestFullscreen||
                                    el.webkitRequestFullscreen||
                                    el.mozRequestFullScreen||
                                    el.msRequestFullscreen;
                                    
        if(!_FullScreenEnabled){
            console.warn("Fullscreen mode not supported in your browser.");
            return;
        }
        
        if((_FullScreenElement||this.isFullScreen) && e.data.force == false){
            _CancelFullScreen.call(document);
            this.isFullScreen=false;
        } else {
            if(_RequestFullScreen){
                _RequestFullScreen.call(el);
                this.isFullScreen = true;
            }
        }
        if(!this.fullscreenToggleButton){
            this.fullscreenToggleButton=e.data.button;
        }
    },
    
    onNotificationReceived : function(e){
        if(e.data.type == "NetworkError"){
            console.error(e.data.message, e.data);
            this.hideBlankState();
        }
        else if(e.data.type=="UserError"){
            console.warn("User Error:\n"+e.data.message);
        }
        else{
            console.log("Notification:\n"+e.data.message);
        } 
        if(e.data.type != "NetworkError"){
            this.querySelector("#desktop-notifications").appendChild(
                new core.ui.Notification({
                    type:e.data.type, 
                    appref:e.data.appref, 
                    title:e.data.title,
                    message:e.data.message,
                    forceclose:(typeof (e.data.forceclose == "boolean")) ? e.data.forceclose:false
                },null).element
            );
        }
    },

    
    beginAppRefreshInterval : function(){
        var self=this;
        setInterval(function(){
            if(self.currentRunningApplication && self.currentRunningApplication.isFocused()){
                self.currentRunningApplication.refresh();    
            }
        }, this.APP_REFRESH_INTERVAL);
    },
    
    requestRefreshCycle : function(app){
        this.currentRunningApplication = app;
    },
    
    beginVisitorSession : function(id, full){
        var uri = this.element.getAttribute("data-uri");
        var action = new core.http.WebAction(uri||ROUTES.DATA.PROFILE, {});

            action.invoke({
                onSuccess  : this.onVisitorSessionLoaded.bind(this,full),
                onFailure  : this.onVisitorSessionFailure.bind(this),
                onRejected : this.onVisitorSessionFailure.bind(this)
            });
    },
    
    onVisitorSessionFailure : function(r,text){
        console.error("failed to load visitor profile: " + text, r);
    },
    
    onVisitorSessionLoaded : function(full,response, responseText){
        try{
            var data = JSON.parse(responseText);
            if(typeof data == "object"){
                this.storeAccountProfileInSession(data);
                this.setDesktopTheme(data);
            }
        }
        catch(e){
            alert("error downloading users profile");
            console.error(e.message,responseText);
        }
    },
    
    storeAccountProfileInSession : function(data){
        if(Session) {
            Session.State.AccountProfile = data;
            Session.State.CurrentProfile = data;
            this.dispatchEvent("sessionloaded", true, true, {profile:data});
        }
    },

    
    onModalize : function(){},
    
    onReturnToDashboard : function(e){
        this.onResetDesktopView();
        this.blurCurrentRunningApplication(e);
        this.currentRunningApplication = null;
    },
    
    initializeUrlRoutesTable : function(){
        for(var KEY in ROUTES) {
           if(typeof ROUTES[KEY] == "object"){
                core.http.UrlRouter.add(ROUTES[KEY])
           } 
           else if(typeof ROUTES[KEY] == "string"){
               core.http.UrlRouter.add(KEY, ROUTES[KEY])
           }
        }
    },
    
    
    initializeApplicationShortcuts : function(){},
    
    addKeyBoardEventListeners : function(){
        var self=this;
        
        window.addEventListener( "keyup", function(e){
             e.preventDefault();
             
            if(e.keyCode == 39){//RIGHT
                self.dispatchEvent("rightkeyup",true,true,{originalEvent:e});
            } else if(e.keyCode == 37){//LEFT
                self.dispatchEvent("leftkeyup",true,true,{originalEvent:e});
                if(self.currentRunningApplication){return;}
            }
            else if(e.keyCode == 38){//TOP
                self.dispatchEvent("topkeyup",true,true,{originalEvent:e});
                if(self.currentRunningApplication){return;}
            }
            else if(e.keyCode == 40){//BOTTOM
                self.dispatchEvent("bottomkeyup",true,true,{originalEvent:e});
                if(self.currentRunningApplication){return;}
            } 
            else if(e.keyCode == 27){ //ESC
                self.dispatchEvent("esckeyup",true,true,{originalEvent:e});
                self.onReturnToDashboard();
            }
         }, false )
    },
    
    /*getSpinner : function (){
        var el = '<div id="spinner-splash-intro">\
                    <div class="bubblingG">\
                       <span id="bubblingG_1"></span>\
                       <span id="bubblingG_2"></span>\
                       <span id="bubblingG_3"></span>\
                    </div>\
                    <div id="spinner-splash-logo"></div>\
                  </div>'.toHtmlElement();
        return el;
    },*/

    getSpinner : function (){
        var el = '<div id="spinner-splash-intro">\
                    <div class="spinner">\
                      <div class="rect1"></div>\
                      <div class="rect2"></div>\
                      <div class="rect3"></div>\
                      <div class="rect4"></div>\
                      <div class="rect5"></div>\
                    </div>\
                    <div id="spinner-splash-logo"></div>\
                  </div>'.toHtmlElement();
        return el;
    },


    onLaunchWebApplication : function(e){
        this.openApplication(e);
    },
    
    
    openApplication : function(e){
        var appInfo;
        var appID = e.data.appID;
        var appref = e.data.appref;
        if(appID){
           appInfo = this.getWebApplicationInfoById(appID);
        } else if(appref){
            appInfo = this.getWebApplicationInfoByRef(appref);
        }
        
        if(!appInfo) {
            console.warn("There is no application defined for id/ref: " + (appID||appref));
            alert("There is no application defined for id: " + (appID||appref))
            return;
        }
        //this.appsScreen.classList.add("inactive");
        this.globalApplicationSpinner.classList.add("active");
        setTimeout(function(){
            this.doAppLoadTest(e,appInfo);
        }.bind(this),400);
    },
    
    showAppSpinner:function(bool){
        if(bool){
            this.element.classList.add("disabled")
        } else {
            this.element.classList.remove("disabled")
        }
        this.globalApplicationSpinner.classList.add("active");
    },
    
    hideAppSpinner:function(){
        this.element.classList.remove("disabled")
        this.globalApplicationSpinner.classList.remove("active");
    },
    
    showBlankState:function(){
        this.showAppSpinner();
        document.body.style.pointerEvents = "none";
        document.body.style.opacity = "0.5";
    },
    
    hideBlankState:function(){
        this.hideAppSpinner();
        document.body.style.pointerEvents = "auto";
        document.body.style.opacity = "1";
    },
    
    
    getWebApplicationInfoById : function(appId){
        var appdata = this.getApplicationInfoDefinitions();
        return appdata[appId];
    },
    
    getWebApplicationInfoByRef : function(appref){
        appref = appref.replace("/",".","g");
        return {namespace:appref, route:"$."+appref};
    },
    
    doAppLoadTest : function(e,appInfo) {
        var force = (typeof e.data.force == "boolean")?e.data.force:false;
        var self=this;
            self.createApplicationInstance(appInfo, function(appInstance){
                //alert(appInfo.namespace)
                var appContainer = document.querySelector(".running.application-container");
                self.blurCurrentRunningApplication(e,appContainer);
                appContainer.appendChild(appInstance.element);
                self.globalApplicationSpinner.classList.remove("active");
                appContainer.classList.add("active");
                currentApp = null;
                self.dispatchEvent("appopened", true,true, e.data);
            }, force, e);
    },
    
    blurCurrentRunningApplication : function(e, appContainer){
        var appContainer = appContainer||document.querySelector(".running.application-container");
        var currentApp = appContainer.querySelector(".WebApplication");
        if(currentApp){
            currentApp.prototype.onBlur(e);
            appContainer.removeChild(currentApp);
            appContainer.innerHTML = "";
        } else{
            appContainer.innerHTML = "";
        }
        currentApp = null;
    },
    
    createApplicationInstance : function(appInfo, callback, force, e){
        force = (typeof force == "boolean")?force:true;
        var self=this;
        if(!NSRegistry[appInfo.namespace]){
            var c = new core.http.ClassLoader();
                c.open("GET", appInfo.route);
                c.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        var d = new NSRegistry[appInfo.namespace];
                            d.onActivated(e);
                        if(!force){
                            self.storeApplicationInstance(appInfo.namespace, d);
                        }
                        setTimeout(function(){
                            d.onFocus(e);
                            callback(d);
                        },1000);//1000 to fully render 
                    }
                }
                c.send();
        } else {
            if(force == false) {
                var d = this.getApplicationInstance(appInfo.namespace);
                if(!d) {
                    d = new NSRegistry[appInfo.namespace];
                    d.onActivated(e);
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
            this.recentAppsSelector.prototype.add(appInstance);
        }  
    },
    
    getApplicationInstance : function(ns){
        console.log("app instance loaded from cache")
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

        //if(this.getApplicationInstanceCount() <=0){
            var defaultApp = app.constants.DEFAULT_HOME_APP;
            this.dispatchEvent("openapp",true,true,{appref:defaultApp})
        //}
    },

    getApplicationInstanceCount : function(){
        var count=0;
        for(var i in this.appinstances){
            count++
        }
        return count;
    },
    
    onResetDesktopView : function(){
        this.currentRunningApplication=null;
        Session.State.CurrentProfile = Session.State.AccountProfile;
        document.querySelector(".running.application-container").classList.remove("active");
        
        setTimeout(function(){
            this.globalApplicationSpinner.classList.remove("active");
        }.bind(this),50)
    },
    
    
    setDesktopTheme : function(data){
        if("theme" in data){
            var theme = data.theme;
            if(theme){
                var wallpaperNode = this.querySelector("#wallpaper");
                var applicationBar = this.querySelector(".ApplicationBar");
                
                if(theme.whitelabel_logo){}
                if(theme.enable_wallpaper){
                    wallpaperNode.style.backgroundImage="url(" + theme.wallpaper +")";
                } else {
                    wallpaperNode.style.backgroundImage = "none";
                    wallpaperNode.style.backgroundColor = theme.background_color;
                }
                //wallpaperNode.style.opacity = theme.background_brightness;
                var alphaVal = theme.window_alpha.replace(".","");
                applicationBar.classList.add("alpha"+alphaVal);
                
            }
        }
    },

    
    innerHTML:
    '<div>test</div>'
});
