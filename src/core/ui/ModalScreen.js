namespace("core.ui.ModalScreen", 
{
    '@inherits'     : w3c.HtmlComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function() {
        this.canvas.addEventListener("click", this.onModalWantsToExit.bind(this), false);
        this.addEventListener("exit", this.onExitModal.bind(this), false);
        this.addEventListener("confirm", this.onConfirmModal.bind(this),false)
    },


    addEventListeners : function(){
        var self=this;
        setTimeout(function(){
            self.cancelButton = self.querySelector(".button-bar .cancel.button");
            self.okButton = self.querySelector(".button-bar .ok.button");
            self.cancelButton && self.cancelButton.addEventListener("click", self.onModalWantsToExit.bind(self), false);
            self.okButton && self.okButton.addEventListener("click", self.onModalWantsToConfirm.bind(self), false);
        }, 500);
    },

    onModalWantsToExit : function(e){
        this.onExitModal(e)
    },

    onModalWantsToConfirm : function(e){
        this.onConfirmModal(e);
    },
    
    onExitModal : function(e){
        e.preventDefault();
        e.stopPropagation();
        var evt = this.dispatchEvent("exitmodal", true, true, e.data);
        if(!evt.defaultPrevented) {
            this.close();
        }
    },
    
    onConfirmModal : function(e){
        e.preventDefault();
        e.stopPropagation();
        var evt = this.dispatchEvent("confirmmodal", true, true, this.componentOwner.getModalValue());
        
        if(!evt.defaultPrevented) {
            this.close();
        }
    },
    
    close : function(){
        try{application.removeModalScreen(this);}
        catch(e){}

    },
    
    open : function(e){
        application.setModalScreen(this);
        try { this.componentOwner.onFocus(e) }
        catch(err){
            console.error(err.message)
        }
    },
    
    setZindex : function(index){
        this.element.style.zIndex = index;
    },
    
    appendChild : function(el) {
        this.element.appendChild(el.element||el);
        this.setComponent(el);
    },
    
    setComponent : function(el){
        this.componentOwner = el instanceof core.ui.WebComponent?el:el.prototype;
    },
    
    innerHTML:
    '<div></div>'
    
});