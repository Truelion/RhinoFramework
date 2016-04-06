namespace("core.ui.Navigator", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,

    initialize : function(){
        this.desktopButton = this.querySelector(".buttons .dashboard");
        this.fullscreenButton = this.querySelector(".buttons .fullscreen");
        this.desktopButton.addEventListener('click', this.onReturnToDashboard.bind(this), false);
        this.fullscreenButton.addEventListener('click', this.onToggleFullscreen.bind(this), false);
    },
    
    onReturnToDashboard : function(){
        this.dispatchEvent("showdashboard",true,true,{component:this});
    },
    
    onToggleFullscreen : function(){
        this.dispatchEvent("fullscreenmode",true,true,{component:this, button:this.fullscreenButton});
    }
});