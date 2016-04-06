

namespace("core.ui.ApplicationBar", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    '@stylesheets' :["~/resources/[$theme]/ApplicationBar.css"],
    
    initialize : function(){
        this.toggleSheenFx  = this.querySelector("#toggle-sheen-effect");
    	this.appTitle = this.querySelector(".screen-title");
        this.startbutton = this.querySelector("#start-icon");
    	this.addEventListener("menuchanged", this.onSlidingMenuChanged.bind(this), false);
        this.startbutton.addEventListener("click", this.onShowStartMenuPanel.bind(this), false);
        application.addEventListener("startmenu", this.onStartMenuVisibilityChanged.bind(this), false);
        this.sheen();
    },

    sheen : function(){
        var self=this;
        
        if(this.sheenInterval){
            clearInterval(this.sheenInterval);
        }
        setTimeout(function(){
            self.toggleSheenFx.classList.add("sheen");
        },1100);
        this.sheenInterval = setInterval(function(){
            //if(!application.currentRunningApplication){//optimization
                self.toggleSheenFx.classList.remove("sheen");
                setTimeout(function(){
                    self.toggleSheenFx.classList.add("sheen");
                },1000);
            //}
        },5000)
    },

    onSlidingMenuChanged : function(e){
    	if(e.data.state=="open"){
    		this.appTitle.style.visibility = "hidden";
    	} else{
    		this.appTitle.style.visibility = "visible";
    	}
    },

    onStartMenuVisibilityChanged : function(e){
        var span = this.startbutton.querySelector("span");
        if(e.data.active == true){
            span.classList.add("fa-toggle-left");    
            span.classList.remove("fa-navicon");
        } else{
            span.classList.add("fa-navicon");
            span.classList.remove("fa-toggle-left");    
        }
    },

    onShowStartMenuPanel : function(e){
        this.dispatchEvent("togglemenu", true, true, {});
    }
});
