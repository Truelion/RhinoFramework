namespace("core.ui.Panel", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    
    initialize : function(){
        this.title          = this.querySelector(".title");
        this.container      = this.querySelector(".panel-container");
        this.resizeButton   = this.querySelector(".panel-options .resize.button");
        this.closeButton    = this.querySelector(".panel-options .close.button");
        this.cancelButton    = this.querySelector(".button-bar .cancel.button");
        
        if(this.resizeButton){
            this.resizeButton.addEventListener("click", this.onResizePanel.bind(this), false);
        }
        if(this.closeButton){
            this.closeButton.addEventListener("click", this.onClosePanel.bind(this), false);
        }
        if(this.cancelButton){
            this.cancelButton.addEventListener("click", this.onCancelPanel.bind(this), false);
        }
    },
    
    onResizePanel : function(){
          
    },
    
    onClosePanel : function(){
        
    },
    
    onCancelPanel : function(e){
        this.dispatchEvent("panelcanceled",true,true,{component:this});
    },
    
    setTitle : function(strTitle){
        this.title.innerHTML = strTitle;
    },
    
    getTitle : function(strTitle){
        return this.title.getAttribute("data-title")||this.title.innerHTML;
    },
    
    appendChild : function(el){
        this.container.appendChild(el.element||el);
    },
    
    innerHTML:
    '<div class="panel">\
        <div class="title panel-title"></div>\
        <div class="panel-container"></div>\
    </div>'
});