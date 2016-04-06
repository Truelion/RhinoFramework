namespace("core.ui.RecentAppsSelectBox", 
{
    '@inherits'     : core.ui.SelectBox,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function(){
        this.parent();
        this.recent_apps_template = this.querySelector("#recent-apps-template");
         
        this.templates = {};
        this.templates["recent-apps"] = {
            template:this.recent_apps_template,
            div:"#recent-apps-container"
        };

        /*application.addEventListener("appopened", function(e){
          console.log(e)
        }, false)*/
    },

    renderOptions:function(){
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
                        //self.renderList(data)
                        self.data=data;
                        self.renderList(self.data)
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

    selectChild : function(li){
        
    },
    
    add : function(appInstance){
        var uri = this.element.getAttribute("data-uri");
        var newEntry = {
            name:appInstance["@title"]||appInstance.classname,
            appref:appInstance.namespace.replace(".","/"),
            time:new Date().toLocaleString()
        };
        
        var action = new core.http.WebAction(uri, {action:"insert", item:newEntry});
            action.invoke({
                onSuccess  : this.onRecentAppLogged.bind(this, newEntry),
                onFailure  : this.onRecentAppLogFailure.bind(this),
                onRejected : this.onRecentAppLogFailure.bind(this)
            });
    },
    
    onRecentAppLogged : function(newEntry, r, responseText){
        try{
            var data = JSON.parse(responseText);
            if(data && typeof data =="object"){
                this.data.result.currently_running.push(newEntry);
                this.renderList(this.data);
            }
        }
        catch(e){
            alert("error loading report");
            console.error(e.message,responseText);
        }
    },
    
    onRecentAppLogFailure : function(){
        
    },
    
    remove : function(appref){
        for(var i=0; i<=this.data.result.currently_running.length-1; i++){
            var item = this.data.result.currently_running[i];
            if (item && item.appref == appref){
                this.data.result.currently_running.splice(i,1);
                break;
            } 
        }
        this.renderList(this.data);
    },
    
    onItemSelected : function(e){
        var target = e.target;
        if(target.classList.contains("close-app-button")){
            var _ns = target.parentNode.getAttribute("data-app-ref");
                //_ns = _ns.replace("/",".");
            this.dispatchEvent("releaseapp", true,true, {ns:_ns.replace("/",".")});
            //target.parentNode.parentNode.removeChild(target.parentNode);
            this.remove(_ns);
        }
        else {
            while(!target.classList.contains("item")){
                target = target.parentNode;
                if(target.tagName.toLowerCase() == "ul"){
                    target=null;
                    break;
                }
            }
            if(target){
                var appRef = target.getAttribute("data-app-ref");
                if(appRef && appRef.length >0){
                    this.dispatchEvent("openapp", true, true, {appref:appRef});
                }
            }
        }
    },

    renderList : function(data){
        this.renderTemplate(data, "recent-apps");
        if(this.count){
            this.count.innerHTML = data.result.currently_running.length;
        }
    },
    
    renderTemplate : function(data, templateName, cssSelector){
        var templateDefinition = this.templates[templateName];
        if(!templateDefinition){
            alert("error, no '" +templateName+ "' template found to render data");
            return;
        } 
        var text = Kruntch.Apply(templateDefinition.template.innerHTML, data);
        var d = document.createElement("div");
        d.innerHTML = text;
        var container = this.querySelector(templateDefinition.div);
            container.innerHTML="";
            container.appendChild(d);
    }
});