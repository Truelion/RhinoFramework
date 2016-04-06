namespace("core.ui.SelectBox", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function(){
        this.ul     = this.querySelector("ul");
        this.label  = this.querySelector(".label");
        this.count  = this.querySelector(".count");
        this.readonly = this.element.getAttribute("readonly");
        this.refreshable = this.element.getAttribute("data-refresh");
        this.refresh_interval = this.element.getAttribute("data-refresh-interval");
        
        application.addEventListener("connection", this.onNetworkConnectionChanged.bind(this), false);
        this.addEventListener("click", this.onItemSelected.bind(this), false);
        this.renderOptions();
        this.setRefreshTimer();
    },
    
    onNetworkConnectionChanged : function(e){
        if(e.data.status == "offline"){
            if(this.count) { this.count.innerHTML = "Offline"}
        } else{
            this.renderOptions();
        }
    },
    
    setRefreshTimer : function(){
        var self=this;
        if(this.refreshable == "true"){
            var interval = parseInt(this.refresh_interval,10);
            setInterval(function(){
                self.renderOptions();
            }, interval)
        }
    },
    
    onItemSelected : function(e){
        this.selectChild(e.target)
    },
    
    selectChild : function(li){
        if(this.readonly != "true"){
            if(this.lastSelected) {
                this.lastSelected.classList.remove("selected");
            }
            //this.lastSelected.classList.remove("selected");
            if(li.classList.contains("item")){
            li.classList.add("selected");
            this.lastSelected = li;
            this.label.innerHTML = li.innerHTML.toUpperCase(); 
            }
        }
    },
    
    renderOptions:function(){
        if(!application.onLine){
            return;
        }

        var enabled = this.element.getAttribute("enabled");
        if(enabled){
            if(enabled.toLowerCase() == "false"||enabled.toLowerCase() == "0"){
                return;
            }
        }
        var self=this;
        var uri = this.element.getAttribute("data-uri");
        
        var a = new core.http.WebAction(uri,{});
        a.invoke({
            onSuccess  : function(r, responseText){
                try{
                    var data = JSON.parse(responseText);
                    if(data.result){
                        self.renderList(data)
                    }
                }
                catch(e){
                    alert("error");
                    console.error(e.message,responseText)
                }
            },
            onFailure  : function(r, text){
                alert("failed: " + text)
            },
            onRejected : function(){}
        })
    },
    
    renderList : function(items){
        this.ul.innerHTML ="";
        if(items){
            for(var i=0; i<=items.length-1; i++){
                var item = items[i];
                var li = document.createElement("li");
                var label = document.createElement("div");//document.createTextNode(item.name);
                    label.classList.add("select-label");
                    label.innerHTML = item.name;
                var info = document.createElement("div");
                    info.classList.add("menu-item-info");
                    info.innerHTML = item.time;
                li.appendChild(label);
                li.appendChild(info);
                if(item["default"]){
                    li.classList.add("selected");
                    this.selectChild(li)
                }
                this.ul.appendChild(li)
            }
        }
        if(this.count){
            this.count.innerHTML = items.length;
        }
    }
});
