//= require SimpleTemplateEngine
//= require ui.models.ComponentModel
//= require w3c.traits.CSSStyleUtilities
//= require w3c.components.Node

namespace("w3c.HtmlComponent", {
    '@inherits':    w3c.Node,
    '@cascade' :    false,
	'@traits'  :    [w3c.CSSStyleUtilities],
	'@model'   :    ui.models.ComponentModel,
	'@stylesheets': [],
	'@htmlparser' : SimpleTemplateEngine,
	
	preInitialize : function(model, element, domready_func) {
        try {
            var self=this;
            if(element && element.prototype instanceof w3c.Node){return;}
            this.setDomReadyCallback(domready_func);
            this.onHashChanged_Handler = this.onHashChanged.bind(this);
            this.onPreRender(model, element);
            this.setModel(model);
            this.setElement(element);
            this.setPrototypeInstance();
            this.setNamespace();
            this.setUUID();
            this.rerouteEvents();
            this.setStyleDocuments();
            this.renderDOMTree();
            
            // this.initializeChildComponents();
            // this.initialize(this.model, this.element);
        } 
        catch(e){
            var msg = this.namespace + ".prototype.preInitialize() - " + e.message;
            try{console.error(msg, this)} catch(e){};
        }
        return this;
    },
    
    initialize : function(model, element, domready_func) {
        
        return this;
    },
    
    setDomReadyCallback : function(cb){
        this.domReadyHandler = cb;
    },
    
    onDomReady : function(el){
        this.onRender(this.model, this.element);
        
        if(this.domReadyHandler){
            this.domReadyHandler(el, this);
        }
        try{
            this.initializeChildComponents();
            this.initializeTraits();
            this.initialize(this.model, this.element);
        }catch(e){
            var msg = this.namespace + ".prototype.preInitialize() - " + e.message;
            try{console.error(msg)} catch(e){};
        }
    },

    
    setStyleDocuments : function(){
        this.createStyleDocument();
        this.setClassList();
        this.loadcss(this.__getInheritableStylesheets());
    },
    
    getComponentByQuery : function(cssSelector){
    	var el = this.querySelector(cssSelector);
    	return (el)? el.prototype:el;
    },
    
    onPreRender : function(model, element){},
    
    onRender: function(componentModel, componentElement){
        this.dispatchEvent("rendered",true,true,{});
    },
    
    dispose : function(){
    	application.removeEventListener("statechanged", this.onHashChanged_Handler, false);
    },
	
	setClassList : function(){
		//classList is defined in w3c.CSSStyleUtilities.__getInheritableStylesheets();
		if(!this.classList){
			var ancestor	= this.ancestor;
	        var classes 	= [];
	        var ancestors 	= [];
	        var stylesheets = [];
	        
	        if(this["@cascade"]) {
	        	while(ancestor){
	        		classes.unshift(ancestor.prototype.classname);
	        		ancestor = (ancestor.prototype["@cascade"])?
	        			ancestor.prototype.ancestor:null;
	        		if(!ancestor) break;
		        }
	        }
	        this.classList = classes;
	        this.classList.push(this.classname);
       	}
	    if(!this["@cascade"]) {
	    	this.addClass(this.classname);
	    }
	    else {
        	this.addClass(this.classList.join(" "), this.element);
	    }
	},
	
	initializeChildComponents : function(el){
	    el = el||this;
		var self=this;
		this.components = {};
		var _childNodes = el.querySelectorAll("*[namespace]");
			for(var i=0; i<=_childNodes.length-1; i++){
				var node = _childNodes[i];
				if(!node || node.nodeType != 1) { continue };
                if(node.prototype && (node.prototype instanceof w3c.Node)){continue};
                if(node.inProgress) {continue};
                node.inProgress=true;
                var ns      = node.getAttribute("namespace");
                var Class   = NSRegistry[ns];
                var cid     = node.getAttribute("name");
                var f = function(el){};
                if(Class && node) {
                	var component = new Class(null, node, f);
               		self.components[cid] = component;
                }
			};
	},
	
	onHashChanged : function(e){
		
	},
	
	rerouteEvents : function(){
		var self=this;
		application.addEventListener("statechanged", this.onHashChanged_Handler, false);
	    
		this.addEventListener("mouseover", function(e){
			var relTarget = e.relatedTarget;
      		if (self.element === relTarget || self.hasChildNode(relTarget)){ return; }
			else{ self.dispatchEvent("hoverover", true, true, {})}
		}, true);
		
		this.addEventListener("mouseout", function(e){
			var relTarget = e.relatedTarget;
      		if (self.element === relTarget || self.hasChildNode(relTarget)){ return; }
			else{ self.dispatchEvent("hoverout", true, true, {})}
		}, true);
	},
	
	zIndex : function(element){
		element = element||this.element;
		if(!this.globalzindex){this.globalzindex=0};
		this.globalzindex = this.globalzindex + 1;
		return this.globalzindex;
	},
	
	nodeIndex : function(){
		var index = -1;
		var nodes = this.element.parentNode.childNodes;
		for (var i = 0; i<=nodes.length-1; i++) {
			if(!nodes[i] || nodes[i].nodeType != 1){continue}
			index++;
		    if (nodes[i] == this.element){break;}
		}
		return index;
	},
	
	parentComponent : function(element){
		element = element||this.element;
		var parent = element.parentNode;
		while(parent){
			if(parent && parent.prototype && parent.getAttribute("namespace")){
				break;
			} else {
				parent = parent.parentNode;
			}
		}
		return parent;
	},
	
	offset : function(elem) {
		elem = elem||this.element;;
	
		var x = elem.offsetLeft;
		var y = elem.offsetTop;
	
		while (elem = elem.offsetParent) {
			x += elem.offsetLeft;
			y += elem.offsetTop;
		}
	
		return { left: x, top: y };
	},

	/*setID : function(id){
		id = id||this.get("id");
		this.id = id;
		this.element.setAttribute("id", id);
	},*/
	
	innerHTML : "<div></div>",
	
	setModel : function(jsonobj) {
		jsonobj = jsonobj||{};
		this.model = (jsonobj && jsonobj instanceof this["@model"]) ?
			jsonobj : new this["@model"](jsonobj||{}, this.element);
		return this.model;
	},
	
	setElement : function(element){
	    var canvas, el;
		el = this.element = element||document.createElement("div");
		if(this.element.prototype){return this.element;}
		return this.element;
    },
    
    renderDOMTree : function(){
        var el = this.element;
        var self=this;
        
        var canvas = this.querySelector(".canvas")||this.firstChild(null,true);
        this.canvas = canvas;
        
        if(el.childNodes.length<=0 || !canvas){
            if(!canvas){
                canvas=document.createElement("div"); 
                el.appendChild(canvas);  
            }
            this.canvas = canvas;
         
            //var path = el.getAttribute("href")||this["@href"];
            var path = this.constructor.prototype["@href"];
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
                            //if (this.status == 200) {
                                var htmltext = this.responseText;
                                self.constructor.prototype.innerHTML = htmltext;
                                self.constructor.prototype["@href"]=null;
                                var view = self.parseElement();
                                canvas.appendChild(view);
                                self.innerHTML=canvas.outerHTML;
                                self.onDomReady(el);          
                            //}
                        }
                    }
                    oXMLHttpRequest.send(null);
            } else {
               var view = this.parseElement();
               canvas.appendChild(view);
               self.onDomReady(el);
            }
        }
        else {
            self.onDomReady(el);
        }
        
        this.addClass("canvas", canvas);
        return el;
    },
	
	setUUID : function(){
		var uuid = Math.uuid(16);
		this.cuuid = uuid; // "c" for control
		this.element.setAttribute("cuuid", uuid);
	},
	
	setNamespace : function(){
		this.element.setAttribute("namespace", this.namespace);
	},
	
	getNamespace : function(){
		return this.element.getAttribute("namespace");
	},
	
	getPrototypeInstance : function(){
		return this.element.prototype;
	},
	
	setPrototypeInstance : function(){
		this.element.prototype = this;
	},
	
	get : function(key){
		return this.model.get(key)
	},
	
	set : function(key,val) {
		this.model.set(key,val);
	},
	
	getTemplateParser : function(){
	   return this["@htmlparser"];
	},
	
	parseTemplate : function (template, _json) {
	    var engine = this.getTemplateParser();
	    if(!"parseTemplate" in engine){
	        throw new Error("parseTemplate(templateString, data) method not implemented by the Template Engine api", engine);
	    }
		return (engine.parseTemplate(template,this.model.data) || "");
	},

	parseElement : function (template, json){
	    var templateString = (typeof this.innerHTML === "function") ?
            this.innerHTML() : this.innerHTML;
            
	     var html = this.parseTemplate(templateString, json);
		 if (html && html.length > 0) {return html.toHtmlElement()}
		 else {
		 	throw new Error(this.namespace + "#parseElement(template, json). Invalid xhtml generated from 'template' string. Value of 'html' is: "+ html);
		 }
	},
	
	resetzindex : function(){
		this.element.style["zIndex"] = 0;
	},
	
	cloneNode : function() {
		var elm   = this.element.cloneNode(true);
		var model = {}.extend(this.model.model);//js.extend({},this.model.model);
		var clone = new this.constructor(model||{},elm);
		return clone;
	},
	
	bind : function(accessor, events){
	 	this.set(accessor);		
	 	var self=this;							//STEP 1: Update self using accessor
	 	accessor.model.addEventListener("changed:" + accessor.jsonpath,function(){	//STEP 2: listen to data model for changes
	 		self.set(accessor);
	 	},false);
	 	
	 	if(events) {											//STEP 3: is it 2-way binding?
	 		events = [].concat(events);								//step a: foreach dom event[] (ex: 'keyup')
	 		for(var i=0; i<=events.length-1; i++){						//step b: add listener
		 		this.addEventListener(events[i], function(e){
		 			accessor.set(self.get(accessor.jsonpath, accessor, e));						//step c: update accessor
		 		},false);
	 		}
	 	}
	 },
	
	set : function(accessor){},
	
	get : function(keypath, accessor, e){},
	
	relativeToAbsoluteFilePath : function(path){
        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        
        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + this.namespace.replace(".","/","g") + "/");
        } 
        else if(path.indexOf("http") == 0){
            return path;//.replace("./", appconfig.apppath + "/" + ns.replace(".","/","g") + "/");
        }
        else{
            if(path.indexOf(appconfig.apppath)<0){
                path = apppath + path
            }
        }
        path = /http:/.test(path)? path : path.replace("//","/");
        return path;
    }
});
