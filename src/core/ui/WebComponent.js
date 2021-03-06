//= require core.ui.HtmlComponent

namespace("core.ui.WebComponent", 
{
    '@inherits' : core.ui.HtmlComponent,
    '@stylesheets' : [],
    "@cascade"  : true,
    
    onRenderData : function(data, initChildComponents){
        this.initTemplateDefinitions(data);
        this.renderTemplate(data, data.table, initChildComponents);
    },

    initTemplateDefinitions : function(data){
        if(!this.templates){
            this.templates = {};
        }

        if(!this.templates[data.table]){
            this.templates[data.table] = {
                template : this.querySelector("#" + data.table + "-template"),
                div : this.querySelector("#" + data.table + "-container")||this.querySelector("#" + data.table)
            };
        }
        return this.templates;
    },
    
    renderTemplate : function(data, templateName, initChildComponents, autoInsert){
        initChildComponents = typeof initChildComponents=="boolean"?initChildComponents:false;
        autoInsert = typeof autoInsert=="boolean"?autoInsert:true;
        
        var templates = this.initTemplateDefinitions(data);

        var templateDefinition = templates[templateName];
        if(!templateDefinition){
            alert("error, no '" +templateName+ "' template found to render data");
            return;
        } 
        
        if(!templateDefinition.template){
            throw new Error("No matching template found in html to render/populate data for template named: '" + templateName + "' in component: " + this.namespace, this);
        }
        if(!templateDefinition.div){
            throw new Error("No matching template container found in html to render/populate data for template named: '" + templateName + "' in component: " + this.namespace + "\nExpectting a <div> container to wrap a template", this);
        }

        if(templateDefinition.template.parentNode){
            templateDefinition.template.parentNode.removeChild(templateDefinition.template);
        }
        // var text = Kruntch.Apply(templateDefinition.template.innerHTML, data);
        var text = this.parseTemplate(templateDefinition.template.innerHTML, data);
        var d = document.createElement(templateDefinition.parentTagName||"div");
        d.innerHTML = text;
        
        var container = d;
        if(!container){
            throw new Error("No matching template container found in html to render/populate data for template named: '" + templateName + "' in component: " + this.namespace + "\nExpectting a <div> container to wrap a template", this);
        }

        if(autoInsert){
            if(typeof templateDefinition.div == "string"){
                container = this.querySelector(templateDefinition.div);
            } else{
                container = templateDefinition.div;
            }
            if(!container){
                throw new Error("No matching template container found in html to render/populate data for template named: '" + templateName + "' in component: " + this.namespace, this);
            }
            if(templateDefinition.parentTagName){
                container.innerHTML="";
                container.appendChild(d);
            } else{
                container.innerHTML=d.innerHTML;
            }
        }
        if(initChildComponents){
            this.initializeChildComponents(container);
        }
        return container;
    },

    renderDOMTree : function(){
        var el = this.element;
        var self=this;
        
        var firstChild = this.firstChild(null,true);
        var path = this.constructor.prototype["@template-uri"]||
                   (function(){
                    console.warn(self.namespace + " - '@href' Class-definition attribute is a deprecated name. Use '@template-uri' for improved clarity."); 
                    return self.constructor.prototype["@href"]}());


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
                                htmltext = htmltext.replace("[$theme]",self.resourcepath("[$theme]"),"igm");
                                htmltext = htmltext.replace("[$icon]",self.resourcepath("[$icon]"),"igm")
                            self.constructor.prototype.innerHTML = htmltext;
                            self.constructor.prototype["@href"]=null;
                            self.constructor.prototype["@template-uri"]=null;
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
        //this.addClass("canvas", canvas);
        this.canvas = canvas;
        return el;
    },
    
    renderNode : function(data, templateName, initChildComponents){
        return this.renderTemplate(data, templateName, initChildComponents, false);
    },
    
    onFocus : function(){},
    
    getModalValue : function() {
        console.info("Implement getModalValue() in " + this.namespace + " to return a value when the modal is confirmed as OK/Save.")
        return null;
    },
    
    getPreviousSibling : function(n) {
        x = n.previousSibling;
        while (x && x.nodeType != 1) {
            x = x.previousSibling;
        }
        return x;
    },
    
    getNextSibling : function(n) {
        if (n != null){
            x = n.nextSibling;
            while (x != null && x.nodeType != 1) {
                x = x.nextSibling;
            }
            return x;
        }
    },

    innerHTML:
    '<div></div>'
});
