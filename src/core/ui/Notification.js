namespace("core.ui.Notification", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    '@stylesheets' :["resources/[$theme]/Notification.css"],
    
    
    initialize : function(model,element){
        this.parent();
        this.closeButton = this.querySelector(".fa-close");
        this.titleNode = this.querySelector(".notification-title");
        this.msgNode = this.querySelector(".notification-message");
        this.iconNode = this.querySelector(".icon");

        this.appref = model.data.appref;
        this.forceclose = model.data.forceclose;
        this.titleNode.innerHTML = model.data.title||model.data.type;
        this.msgNode.innerHTML = model.data.message;
        this.element.classList.add(model.data.type);
        this.closeButton.addEventListener("click", this.kill.bind(this),false);
        this.addEventListener("click", this.onNotificationClicked.bind(this), false);
        this.setIcon(model.data.type);
        
        if(!this.forceclose){
            this.timer = setTimeout(function(){
                this.kill();        
            }.bind(this),10000);
        }
    },

    onNotificationClicked : function(e){
        if(e.target.classList.contains("fa-close")){return}
        else{
            if(this.appref){
                application.dispatchEvent("openapp", true, true, {appref:this.appref});
            }
        }
    },

    
    setIcon : function(type){
        if(type.toLowerCase().indexOf("error")>0){
            this.iconNode.classList.add("fa-warning");
        }
        else if(type == "Warning"){
            this.iconNode.classList.add("fa-warning");
        }
        else if(type == "Information"){
            this.iconNode.classList.add("fa-info-circle");
        }
        else if(type == "NetworkOffline"){
            this.iconNode.classList.add("fa-signal");
        }
        else {
            this.iconNode.classList.add("fa-info-circle");
        }
    },
    
    kill : function(){
        clearTimeout(this.timer);
        if(this.element.parentNode){
            this.element.parentNode.removeChild(this.element);
        }
        this.element=null;
        this.closeButton=null;
        this.titleNode=null;
        this.msgNode=null;
        this.iconNode=null;
    },
    
    innerHTML:
    '<div>\
        <span class="fa fa-fw icon"></span>\
        <div class="notification-title-bar">\
            <span class="notification-title"></span><span class="fa fa-close"></span></div>\
        <div class="notification-message"></div>\
    </div>'
});
