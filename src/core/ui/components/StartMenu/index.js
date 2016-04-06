namespace("core.ui.StartMenu", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets' :["src/core/ui/components/StartMenu/index.css"],
    "@cascade"      : true,
    "@href"         : "src/core/ui/components/StartMenu/index.html",

   
    initialize : function(){
        this.parent();
        this._template = this.querySelector("#start-menu-template");
        this.draggable = new Draggable(this);

        this.templates = {};
        this.templates["start-menu"] = {
            template:this._template,
            div:"#start-menu-container"
        };
        
        this.start_menu_panel = this.querySelector("#start-menu-panel");
        this.logo = this.querySelector("#start-menu-logo");
        this.ul = this.querySelector("ul");
        this.logo.addEventListener("click", this.onHideStartMenuPanel.bind(this), false);

        this.ul.addEventListener("click", this.onOpenApplication.bind(this), false);
        application.addEventListener("openapp", this.onApplicationOpened.bind(this), false);

        this.downloadStartMenu();
        this.setMenuPosition();
        this.fixMenuLogo();
        application.addEventListener("screensized", this.onScreenSizeChanged.bind(this), false);
    },

    fixMenuLogo : function(){
        var img = this.logo.querySelector("img");
            img.src = img.getAttribute("data-src");
    },

    toggle : function(){
        var cl = this.element.classList;
        if(cl.contains("active")){
            this.hide()
        } else{
            this.show()
        }
    },

    show : function(){
        this.element.classList.add("active");
        this.dispatchEvent("startmenu",true,true,{active:this.element.classList.contains("active")});
    },


    hide : function(){
        this.element.classList.remove("active");
        this.dispatchEvent("startmenu",true,true,{active:this.element.classList.contains("active")})
    },

    onScreenSizeChanged : function(e){
        this.setMenuPosition();
    },

    setMenuPosition : function(){
        var transform = "transform".toVendorPrefix();
        var wInnerWidth = window.innerWidth;
        this.element.style[transform] = "translate3d(-" + wInnerWidth + "px, 0px, 0px)";
    },

    renderDOMTree : function(){
        var el = this.element;
        var self=this;
        
        var firstChild = this.firstChild(null,true);
        var path = this.constructor.prototype["@href"];

        if(!firstChild){
            if(path) {
                var oXMLHttpRequest;
                try{
                    oXMLHttpRequest = new core.http.XMLHttpRequest;
                } catch(e){
                    oXMLHttpRequest = new XMLHttpRequest;
                };
                    path = (typeof path=="string")?this.relativeToAbsoluteFilePath(path):path;
                    oXMLHttpRequest.open("GET", path, true);
                    oXMLHttpRequest.setRequestHeader("Content-type", "text/plain");
                    oXMLHttpRequest.onreadystatechange  = function() {
                        if (this.readyState == XMLHttpRequest.DONE) {
                            var htmltext = this.responseText;
                            self.constructor.prototype.innerHTML = htmltext;
                            self.constructor.prototype["@href"]=null;
                            var view = self.parseElement();
                            self.element.appendChild(view);
                            self.innerHTML=self.element.outerHTML;
                            self.onDomReady(el);          
                        }
                    }
                    oXMLHttpRequest.send(null);
            } else {
               var view = this.parseElement();
               self.element.appendChild(view);
               self.onDomReady(el);
            }
        }
        else {
            self.onDomReady(el);
        }
        
        var canvas = this.firstChild(null,true)
        this.addClass("canvas", canvas);
        this.canvas = canvas;
        return el;
    },

    onPress: function(){
        this.startCoords = this.dnd.getBoundingClientRect(this.element);
        console.log(this.startCoords)
    },

    onMove : function(e){
        var target = e.data.target;
        var x = e.data.offsetX;
        var y = e.data.offsetY;
    },

    onMovePosition : function(e){},

    onDragEnd       : function(e) {
        this.element.classList.remove("dragging");
       // this.element.classList.add("destination");
        this.coords = this.dnd.getBoundingClientRect(this.element);
        var canvasHeight = this.dnd.getBoundingClientRect(document.body).height;
        var boxPos = (this.coords.top);
        
        if(e.data.swipedir == "up" ){
            
        } else if(e.data.swipedir == "down" ){
            
        }
        else if(e.data.swipedir == "right" ){
            this.dispatchEvent("showmenu",true,true,{});
        } 
        else if(e.data.swipedir == "left" ){
            this.dispatchEvent("hidemenu",true,true,{});
        } else {
            if(boxPos > canvasHeight/2){
                
            } else if (boxPos < canvasHeight/2){
                
            }
            else {
                
            }
        }
    },
    
    onDragStart : function(e){
        this.element.classList.add("dragging");
    },
    
    onRevertPosition : function(){},


    
    downloadStartMenu : function(){
        var self=this;
        var uri = this.element.getAttribute("data-uri");
        var a = new core.http.WebAction(uri,{});
        a.invoke({
            onSuccess  : this.onStartMenuDownloaded.bind(this),
            onFailure  : this.onStartMenuDownloadFailure.bind(this),
            onRejected : this.onStartMenuDownloadFailure.bind(this)
        })
    },
    
    onStartMenuDownloaded : function(r, responseText){
        
        try{
            var data = JSON.parse(responseText);
            if(data.result){
                //self.renderList(data)
                this.data=data;
                this.renderMenu(data)
            }
        }
        catch(e){
            alert("error downloading start menu");
            console.error(e.message,responseText)
        }
    },
    
    renderMenu : function(data){
        this.renderTemplate(data, "start-menu");
    },
    
    onStartMenuDownloadFailure : function(r, responseText){
        alert("error downloading start menu");
        console.error("onStartMenuDownloadFailure(): ", responseText)
    },
    
    onApplicationOpened : function(){
        this.onHideStartMenuPanel();
    },
    
    onShowStartMenuPanel : function(e){
        var startMenuPanel = this.querySelector("#start-menu-panel");
        var start_button_icon = this.startbutton.querySelector("img");
        
        if(!this.startMenuOpen){
            this.element.classList.add("active");
            this.startMenuOpen=true;
        } else {
            this.element.classList.remove("active");
            this.startMenuOpen=false;
        }
        this.dispatchEvent("startmenu",true,true,{active:this.element.classList.contains("active")})
    },
    
    onHideStartMenuPanel : function(){
        this.hide();
    },
    
    onOpenApplication : function(e){
        var appRef = e.target.getAttribute("data-app-ref");
        var href = e.target.getAttribute("href");
        
        if(appRef && appRef.length>0){
            this.dispatchEvent("openapp", true, true, {appref:appRef});
            this.onHideStartMenuPanel();
        } else if(href && href.length>0){
            if(href.indexOf("$.DATA.")>=0){
                var url = core.http.UrlRouter.resolve(href);
                if(url){
                    setTimeout(function(){
                        window.open(url,"_system", 'location=yes');
                    },200);
                } else {
                    console.error("No Route defined for href: " + href);
                }
            } else{
                window.open(href,"_system", 'location=yes');
            }
        }
    }
}); 
