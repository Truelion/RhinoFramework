namespace("core.ui.WebApplication", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function() {
        this.parent();
        this.setUserAgentClasses();
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

    allowRefreshCycle : function(){
        return true;
    },
    
    onScreenResized : function(){
        console.info("Screen Resized detected by current application: ", this)    
    },

    onRefresh : function(){
        console.info(this.namespace + " onRefresh() handler triggered (app heartbeat).");    
    },

    onResume : function(e){
        console.info(this.namespace + " onResume() handler triggered.");    
    },
    
    onFocus : function(e){
        this.setActivityState(true);
        application.requestRefreshCycle(this);
        console.info(this.namespace + " onFocus() handler triggered");    
    },
    
    
    onBlur : function(e){
        this.setActivityState(false);
        console.info(this.namespace + " onBlur() handler triggered. Inactive.");    
    },
    
    onActivated : function(e){
        console.info(this.namespace + " onActivated() handler triggered. Loaded from disk.");    
    },
    
    run : function() {
        this.dispatchEvent("load", true, true, {component:this});
    },
    
    setActivityState : function(bool){
        this._is_active_and_focused = bool;
    },
    
    isFocused : function(bool){
        return this._is_active_and_focused == true;
    },
    
    
    modalize : function(component){
        //e.preventDefault();
        //e.stopPropagation();
        var modal = new core.ui.ModalScreen;
            modal.setZindex(application.absoluteZindex());
            modal.owner = this;
            modal.appendChild(component.element||component);
            modal.addEventListeners();
            return modal;
    }
});

 
