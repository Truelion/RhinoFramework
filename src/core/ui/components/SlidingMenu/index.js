namespace("core.ui.SlidingMenu", 
{
    '@inherits'     : core.ui.Navigator,
    '@stylesheets'  : [],
    "@cascade"      : true,
    "@href"         : "src/core/ui/components/SlidingMenu/index.html",

    initialize : function(){
        this.optionsButton = this.querySelector(".buttons .options");
        this.desktopButton = this.querySelector(".buttons .dashboard");
        this.fullscreenButton = this.querySelector(".buttons .fullscreen");
        this.supportButton = this.querySelector("#support");
        this.optionsButton.addEventListener('click', this.onOptionsClicked.bind(this), false);

        if(this.fullscreenButton){
            this.fullscreenButton.addEventListener('click', this.onToggleFullscreen.bind(this), false);
        }
        this.supportButton.addEventListener('click', this.onOpenSupportScreen.bind(this), false);

        this.state="open";
        setTimeout(this.togglePosition.bind(this), 1300);
    },

    onOpenSupportScreen : function(e){
        window.location.href="tel://" + app.constants.company.CUSTOMER_SUPPORT_PHONE;
        this.togglePosition()
    },

    setPosition : function(posX){
        //console.warn("bounding rec", this.getBoundingClientRect())
        var width = this.getBoundingClientRect().width;
        posX = (typeof posX == "number")?posX:width-70;
        //this.element.style.right = -posX + "px"
        //this.state="closed";
        //this.element.style.transform = "translateX(" posX + 'px' ")"
        this.element.style["transform".toVendorPrefix()]="translate3d("+posX +"px,0px,0)";
    },

    togglePosition : function(){
        if(this.state == "closed"){
            this.setPosition(0);
            this.state="open"
        } else{
            this.setPosition();
            this.state="closed"
        }
        this.dispatchEvent("menuchanged",true,true,{state:this.state})
    },

    
    onOptionsClicked : function(){
        this.togglePosition()
        //alert("clicked")
        //this.dispatchEvent("showdashboard",true,true,{component:this});
    },
    
    onToggleFullscreen : function(){
        this.dispatchEvent("fullscreenmode",true,true,{component:this, button:this.fullscreenButton, force:false});
        this.togglePosition()
    }
});