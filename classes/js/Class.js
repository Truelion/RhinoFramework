/*
    Copyright © 2013 ΩF:∅ Working Group contributors.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, including 
    without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
    NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

; (function(env) {
    var importedFiles={};
    var Class;
    env.NSRegistry = env.NSRegistry||{};
    env.Class = Class = function(){};
        Class.prototype = {
            preInitialize: function(){
                var res = this.initialize.apply(this, arguments);
                this.initializeTraits(arguments);
                return res;
            },
            
            initialize       : function() {return this;},
            
            hasOwnMember : function(key){
                try{return this.constructor.prototype.hasOwnProperty(key)}
                catch(e){return this.hasOwnProperty(key);}
            },
            
            initializeTraits : function(){
                var traits = this["@traits"]||[];
                for(var i=0; i<=traits.length-1; i++){
                    var trait = traits[i];
                    if(typeof trait == "function"){
                        new trait(this,arguments);
                    }
                    else if(trait && trait.initialize) {}
                }
            }
        };
    
    
    env.namespace = function(ns, def){
        if(def && typeof def == "object"){
            def.namespace = ns;
            def.classname = /([a-zA-Z]*)$/.test(ns) ? RegExp.$1:"Anonymous";
        }
        var n = createNS(ns);
        env.NSRegistry[ns] = n[0][n[1]] = def ?
            createClass(def,ns) : {};
    };
    
    
    var createNS = function(aNamespace){
        var scope       = env;
        var parts       = aNamespace.split(/\./g); 
        var classname   = parts.pop();
            
        for (var i = 0; i <= parts.length - 1; i++) {
            scope = scope[parts[i]]||(scope[parts[i]] = {});
        };
        return [scope,classname];
    };
    
    /*var createClass = function(properties){
        if(typeof properties == "function"){return properties}
        var obj = (properties["@inherits"]||Class);
        var traits = (properties["@traits"]||{});
        if (typeof(obj) === "function") {
            var F = function(){}; //optimization
                F.prototype = obj.prototype;
                
            var klass = function() {
                return this.preInitialize.apply(this, arguments);
            };
            klass.prototype = new F();
            inheritProperties(klass.prototype, properties);
            klass.prototype.constructor = klass;
            klass.prototype.ancestor = obj;
            inheritTraits(klass.prototype, traits);
        }
        return klass;
    };*/
    
    var createClass = function(properties, ns){
        if(typeof properties == "function"){return properties}
        loadImports(properties, ns);
        delete properties["@imports"];
        delete properties["@import"];
        var obj = properties["@inherits"];
        //(properties["@inherits"]||Class);
        /*if(!properties["@inherits"] && ("@inherits" in properties) && properties["@imports"]){
            loadImports(properties["@imports"], ns);
            obj = properties["@inherits"];
            alert(properties["@inherits"])
        } else{
            properties["@inherits"] = Class;
            obj = properties["@inherits"];
        }
        delete properties["@imports"];*/
       if(!("@inherits" in properties)) {
           obj = properties["@inherits"] = Class;
       }
       else if(typeof obj == "string") {
           var inheritedNS = obj;
           obj = properties["@inherits"] = (NSRegistry[obj]);
           if(!obj){
               throw new TypeError(ns + " inherits from a class, " +inheritedNS + " - that is not defined")
           }
       }
       else {
           obj = properties["@inherits"] = (properties["@inherits"]);
           if(!obj){
               throw new TypeError(ns + " inherits from a class that is not defined.")
           }
       }
        
        var traits = (properties["@traits"]||{});
        if (typeof(obj) === "function") {
            var F = function(){}; //optimization
                F.prototype = obj.prototype;
                
            var klass = function() {
                return this.preInitialize.apply(this, arguments);
            };
            klass.prototype = new F();
            inheritProperties(klass.prototype, properties);
            klass.prototype.constructor = klass;
            klass.prototype.ancestor = obj;
            inheritTraits(klass.prototype, traits);
        }
        return klass;
    };
    
    var loadImports = function(properties, ns){
        var amdSupported = true;
        var forceImports = false;
        
        if(appconfig && ("AMD" in appconfig) && appconfig.AMD==false){
            amdSupported=false;
        }
        if(!("@forceimports" in properties) || properties["@forceimports"]==false){
            forceImports=false;
        } else {
            forceImports=true;
        }
        if(!amdSupported && !forceImports) {return}

        var imports = properties["@imports"]||properties["@import"]||[];
        for(var i=0; i<=imports.length-1; i++){
           imports[i] = relativeToAbsoluteFilePath(imports[i], ns);
        }
        for(var i=0; i<=imports.length-1; i++) {
            if(importedFiles[imports[i]]) {
               //console.info("@imports from cache:",imports[i]);
               continue;
            } else{
                 var  oXMLHttpRequest = new XMLHttpRequest;
                 oXMLHttpRequest.open("GET", imports[i], false);
                 oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
                 oXMLHttpRequest.onreadystatechange  = function() {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        var head   = document.getElementsByTagName("head").item(0);
                        var scripts = head.getElementsByTagName("script");
                        var script = document.createElement("script");
                            script.setAttribute("type", "text/javascript");
                            script.setAttribute("charset", (config.charset || "utf-8"));
                            script.text = this.responseText;
                            head.appendChild(script);
                            //console.info("@imports loaded:",imports[i]);
                            importedFiles[imports[i]]=true;
                    }
                 }
                 oXMLHttpRequest.send(null);
            }
        }
    };
    
    var relativeToAbsoluteFilePath = function(path){
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
    };
    
    var inheritTraits = function(klass, properties){
        var _traits = properties; 
        if (_traits) {
            var traits = [];
            if (_traits.reverse) {
                traits = traits.concat(_traits.reverse());}
            else {traits.push(_traits);}
            var trait;
            for (var i = 0; (trait = traits[i]); i++) {
                if (typeof trait == "object") {
                    inheritProperties(klass, trait)
                }
            }
        }
        return klass;
    };
        
    var inheritProperties = function(dest, src, fname){
        if (!src || !dest) {return;}
        if (arguments.length === 3) {
            var ancestor    = dest[fname], 
                descendent  = src[fname], 
                method      = descendent;
                
            descendent = function() {
                var ref     = this.parent;
                this.parent = ancestor;
                var result  = method.apply(this, arguments);
                if(ref) {
                    this.parent = ref;
                }
                else { delete this.parent }
                return result;
            };
            descendent.valueOf  = function() { return method;};
            descendent.toString = function() { return method.toString();};
            dest[fname] = descendent;
        }
        else {
            for (var prop in src) {
                if (dest[prop] && typeof(src[prop]) === 'function') { 
                    inheritProperties(dest, src, prop);
                }
                else { dest[prop] = src[prop]; }
            }
        }
        return dest;
    };
})(this);
