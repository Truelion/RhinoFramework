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
            self.cancelButton.addEventListener("click", self.onModalWantsToExit.bind(self), false);
            self.okButton.addEventListener("click", self.onModalWantsToConfirm.bind(self), false);
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
        this.dispatchEvent("exitmodal", true, true, e.data);
        this.close();
    },
    
    onConfirmModal : function(e){
        e.preventDefault();
        e.stopPropagation();
        this.dispatchEvent("confirmmodal", true, true, this.componentOwner.getModalValue());
        this.close();
    },
    
    close : function(){
        //this.owner.element.removeChild(this.element);
        //application.element.removeChild(this.element);
        try{application.removeModalScreen(this);}
        catch(e){}

    },
    
    open : function(e){
        //this.owner.element.appendChild(this.element);
        //application.element.appendChild(this.element);
        application.setModalScreen(this);
        this.componentOwner.onFocus(e);
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