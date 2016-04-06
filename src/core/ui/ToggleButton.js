namespace("core.ui.ToggleButton", {
    '@inherits' : core.ui.Button,
    "@cascade"  : true,
    
    initialize : function(){
        this.parent();
        this.iconEl = this.querySelector(".icon");
        this.addEventListener("click", this.onToggle.bind(this), false);
    },
    
    onToggle : function(e){
        var cList = this.element.classList;
        if(cList.contains("active")){
            cList.remove("active")
        } else {
            cList.add("active")
        }
        this.dispatchEvent("toggled", true, true, {active: cList.contains("active")})
    }
});