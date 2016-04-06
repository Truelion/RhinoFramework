namespace("w3c.CSSStyleUtilities");

w3c.CSSStyleUtilities = {
	__getInheritableStylesheets : function(){
		var ancestor	= this.ancestor;
        var classes 	= [];
        var ancestors 	= [];
        var stylesheets = [];
        
        if(this["@cascade"]) {
        	while(ancestor){
        		classes.unshift(ancestor.prototype.classname);
        		var styles = ancestor.prototype["@stylesheets"]||[];
        		//stylesheets = stylesheets.concat(styles)
	                ancestors.unshift(ancestor);
	                for(var i=0; i<=styles.length-1; i++){ 
	             		stylesheets.push(styles[i]); 	 
	             	}
	             	
        		if(ancestor.prototype["@cascade"]) {
			    	ancestor = ancestor.prototype.ancestor;
	            }
	            else { ancestor=null; break; }
	        };
        	stylesheets = stylesheets.concat(this["@stylesheets"]||[]);
        }
        else {
            stylesheets = ([].concat(this["@stylesheets"]||[]));
        }
        this.classList = classes;
        this.classList.push(this.classname);
        return stylesheets;
    },
    
    loadcss: function(url){
	    var self=this;
	    var usingSking=false;
	    var stylesheets = window.loaded_stylesheets;
	    if (!stylesheets) {
            window.loaded_stylesheets = {};
            stylesheets = window.loaded_stylesheets;}
        
        if(stylesheets[url]){self.__onStylesheetLoaded(stylesheets[url]); return;}   
	    if((appconfig.skin && stylesheets[appconfig.skin])){
	        return;
	    }
	    if(appconfig.skin && !stylesheets[appconfig.skin]) {url=appconfig.skin; usingSking=true;}
		var something_went_wrong = "Error loading stylesheets. Expected an array of style urls or a single url to a stylesheet for this component.";
		var styles = (url||this["@stylesheets"]);

		if(styles) {
			if(styles instanceof Array) {
				for(var i=0; i<=styles.length-1; i++) {
					this.loadcss(styles[i]);
				}
			}
			else if(typeof styles === "string" && styles.indexOf("http://") != 0) {
				var path = this.resourcepath(styles);
				var stylenode= document.createElement('style');
				    stylenode.setAttribute("type", 'text/css');
					stylenode.setAttribute("rel", 'stylesheet');
					stylenode.setAttribute("href", path);
					stylenode.setAttribute("media", 'all');
					stylenode.setAttribute("component", this.namespace||"");
					//head.appendChild(stylenode);
					this.appendStyleSheet(stylenode);
					stylesheets[styles] = stylenode;
					var oXMLHttpRequest;
    					try{
                            oXMLHttpRequest = new core.http.XMLHttpRequest;
                        } catch(e){
                            oXMLHttpRequest = new XMLHttpRequest;
                        };
                        oXMLHttpRequest.open("GET", path, true);
                        oXMLHttpRequest.setRequestHeader("Content-type", "text/css");
                        oXMLHttpRequest.onreadystatechange  = function() {
                            if (this.readyState == XMLHttpRequest.DONE) {
                                //if (this.status == 200) {
                                    var _cssText = self.cssTransform(this.responseText);
                                    self.setCssTextAttribute(_cssText, stylenode); 
                                    self.__onStylesheetLoaded(stylenode);           
                                //}
                            }
                        }
                        oXMLHttpRequest.send(null);
			}
			else if(styles && styles.indexOf("http:") == 0){
		        var cssNode = document.createElement('link');
		        cssNode.type = 'text/css';
				cssNode.setAttribute("component", this.namespace||"");
		        cssNode.rel = 'stylesheet';
		        cssNode.href = this.resourcepath(styles);
		       	this.appendStyleSheet(cssNode);
				stylesheets[styles] = cssNode;
				self.__onStylesheetLoaded(cssNode);
			}
			else{
				try{console.warn("Unable to resolve path to stylesheet. Invalid uri: '" + styles + "'")} catch(e){}
			}
		}
		else {}
		
    },
    
    cssTransform : function(_cssText){
		var self=this;
		try{
    		_cssText = _cssText.replace(/resource\(([A-Z0-9a-z\'\"\s\_\.\/\\\-.]*)\)/img, function(){
    		    return "url(" + self.resourcepath(arguments[1]) + ")"
    		});
		} catch(e){console.warn("CSS parse warning: unable to parse custom css function 'resourcepath()'")}
		return _cssText;
	},
    
    onStylesheetLoaded : function (style){},
    
    __onStylesheetLoaded : function(style){
    	this.onStylesheetLoaded(style)
    },
    
    setCssTextAttribute : function(_cssText, stylenode){
		if (stylenode && stylenode.styleSheet) {
            stylenode.styleSheet.cssText = _cssText;
        }
        else {
            stylenode.appendChild(document.createTextNode(_cssText));
        }
	},
    
    resourcepath : function resourcepath(filepath){
        //var nspath = this.namespace.replace(/\./g,"/");
        var apppath = appconfig.apppath||"";
        var path = apppath + filepath.replace("[$theme]", ("themes/"+appconfig.theme));
        return this.relativeToAbsoluteFilePath(path);
    },
    
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
    },
    
	getStyle : function (styleProp, element) {
	    element = element||this.element;
        if (element.currentStyle){
            var y = element.currentStyle[styleProp];
        }
        else if (window.getComputedStyle) {
            var y = document.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp);
        }
        return y;
	},
	
	up : function(classname, element){
	  	classname = classname.replace(".","");
	  	element   = element||this.element;
	  	while(element && !this.hasClass(classname,element)){
	  		element=element.parentNode;
		};
	  	return element;
	},
	
	down : function(classname, element){
		element   = element||this.element;
	  	return this.querySelector(classname, element);
	},
	
	addClass: function(name, element) {
		element = element||this.element;
		
		if (!this.hasClass(name, element)) { 
			element.className += (element.className ? ' ' : '') + name; 
		}
	},
	
	hasClass : function (name, element) {
		element = element || this.element;
	  //return ((element || this.element).className.indexOf(classname) >= 0);
		return new RegExp('(\\s|^)'+name+'(\\s|$)').test(element.className);
	},
	
	removeClass : function(name, element){
		element = element||this.element;
		if (this.hasClass(name, element)) {
      		element.className = element.className.replace(
      			new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
   		}
	},
	
	toggleClass : function(className, element){
		element = element||this.element;
		if(this.hasClass(className,element)) {
    		this.removeClass(className,element)
    	}
    	else{
    		this.addClass(className,element)
    	}
	},
	
	createStyleDocument : function (callback) {
		window.loadedstylesheets = window.loadedstylesheets||{};
		if(window.loadedstylesheets[this.namespace]) {
			return;
		}
		var cssCode 		= (this.cssText && this.cssText.indexOf("<%") >= 0) ?
			this.parseTemplate(this.cssText,{}):
			this.cssText;
			
		if(!cssCode || cssCode.length <= 0) { return };
		this.stylesheet = document.createElement('style');
		this.stylesheet.setAttribute("type", 'text/css');
		this.stylesheet.setAttribute("rel", 'stylesheet');
		this.stylesheet.setAttribute("component", this.namespace||"");
		
		
        if (this.stylesheet.styleSheet) {
            this.stylesheet.styleSheet.cssText = cssCode;
        }
        else {
            this.stylesheet.appendChild(document.createTextNode(cssCode));
        }
        this.appendStyleSheet(this.stylesheet)
		window.loadedstylesheets[this.namespace] = true;
		return this.stylesheet;
	},
	
	appendStyleSheet : function(stylesheet){
		var headNode 		= application.head;
		var configscript 	= application.configscript;
		headNode.insertBefore(stylesheet, configscript);
	}
};
