namespace("core.ui.ModalScreen", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function() {
        document.body.appendChild(this.element);
        // this.canvas.addEventListener("click", this.onModalWantsToExit.bind(this), false);
        // this.addEventListener("exit", this.onExitModal.bind(this), false);
        // this.addEventListener("confirm", this.onConfirmModal.bind(this),false);
        this.addEventListener("click", this.onModalWantsToExit.bind(this),false);
    },


    // addEventListeners : function(){
    //     var self=this;
    //     setTimeout(function(){
    //         self.cancelButton = self.querySelector(".button-bar .cancel.button");
    //         self.okButton = self.querySelector(".button-bar .ok.button");
    //         self.cancelButton && self.cancelButton.addEventListener("click", self.onModalWantsToExit.bind(self), false);
    //         self.okButton && self.okButton.addEventListener("click", self.onModalWantsToConfirm.bind(self), false);
    //     }, 500);
    // },

    isDismissable : function(){
        return true;
    },

    onModalWantsToExit : function(e){
        if(this.isDismissable()) {
            if(e.target.classList.contains("ModalScreen")){
                this.hide();
            }
        }
    },


    hide : function(){
        this.element.classList.remove("active");
    },

    show : function(){
        this.element.classList.add("active");
        this.element.style.zIndex = application.absoluteZindex();
    },

    // onModalWantsToConfirm : function(e){
    //     this.onConfirmModal(e);
    // },
    
    // onExitModal : function(e){
    //     e.preventDefault();
    //     e.stopPropagation();
    //     var evt = this.dispatchEvent("exitmodal", true, true, e.data);
    //     if(!evt.defaultPrevented) {
    //         this.close();
    //     }
    // },
    
    // onConfirmModal : function(e){
    //     e.preventDefault();
    //     e.stopPropagation();
    //     var evt = this.dispatchEvent("confirmmodal", true, true, this.componentOwner.getModalValue());
        
    //     if(!evt.defaultPrevented) {
    //         this.close();
    //     }
    // },
    
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
    '<div></div>',

    cssText : '\
    .ModalScreen {\
        width: 100%;\
        height: 100%;\
        background-color: rgba(0,0,0,.5);\
        left: 0;\
        top: 0;\
        position: fixed;\
        display: none;\
        z-index: 1000;\
    }\
    .ModalScreen > div{\
        top: 50%;\
        left: 50%;\
        transform: translate3d(-50%, -50%,0);\
    }\
    .ModalScreen.active {\
        display: block !important;\
    }'
    
});