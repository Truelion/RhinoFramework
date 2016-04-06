namespace("core.ui.Button", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    
    initialize : function(){
        this.parent();
        this.iconEl = this.querySelector(".icon");
        if(this.iconEl){
            this.classList = this.iconEl.classList;
        }
        ///this.addEventListener
    },
    
    disable : function(){
        this.element.classList.add("disabled");
    },
    
    enable : function(){
        this.element.classList.remove("disabled");
    },
    
    spin : function(cls){
        this.originalClass = cls;
        this.iconEl.classList.remove(cls);
        this.iconEl.classList.add("fa-spinner");
        this.iconEl.classList.add("aimation-rotate");
    },
    
    reset : function(cls){
        this.iconEl.classList.add(this.originalClass);
        this.iconEl.classList.remove("fa-spinner");
        this.iconEl.classList.remove("aimation-rotate");
    },

    setLabel : function(str){
        var label = this.querySelector(".label");
        if(label){ label.innerHTML = str; }
    }
});