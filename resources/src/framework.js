/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2009 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 * http://www.broofa.com/2008/09/javascript-uuid-function/
 * 
 * 
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 * 
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
; Math.uuid = (function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''); 

  return function (len, radix) {
    var chars = CHARS, uuid = [];
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (var i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (var i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };
})();

// A more compact, but less performant, RFC4122v4 compliant solution:
Math.uuid2 = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
  }).toUpperCase();
};




Math.abbrNum = function(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
};

if (!Object.prototype.extend) {
    Object.defineProperty(Object.prototype, "extend", {
        enumerable : false,
        configurable : true,
        writable : true,
        value : function(source) {
            for (var property in source) {
                this[property] = source[property];}
            return this;
        }
    });
};

if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
        enumerable : false,
        configurable : true,
        writable : false,
        value : function(prop, handler) {
            var oldval = this[prop], newval = oldval, getter = function() {
                return newval;
            }, setter = function(val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            };
            if (delete this[prop]) {// can't watch constants
                Object.defineProperty(this, prop, {
                    get : getter,
                    set : setter,
                    enumerable : true,
                    configurable : true
                });
            }
        }
    });
}

// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
        enumerable : false,
        configurable : true,
        writable : false,
        value : function(prop) {
            var val = this[prop];
            delete this[prop];
            // remove accessors
            this[prop] = val;
        }
    });
}


toQueryString = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push(typeof v == "object" ?
        toQueryString(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

if(!String.prototype.toHtmlElement){
    String.prototype.toHtmlElement = function(){
        var el;
        var _root = document.createElement('div');
            _root.style.display = "none";
            _root.innerHTML = this;
            if(!_root.firstChild || _root.firstChild.nodeType != 1) {
                el = _root;
                el.removeAttribute("style");
            } else {el = _root.firstChild;}
            return el;
    };
}

//Uses createDocumentFragment()
if(!String.prototype.toDomElement){
    String.prototype.toDomElement = function () {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = this.toString();
        var df= document.createDocumentFragment();
            df.appendChild(wrapper);
        return df.firstChild;
    }
}

function getVendorPrefixed(prop){
    var i, 
    s = window.getComputedStyle(document.documentElement, ''), 
    v = ['ms','O','Moz','Webkit'];
    if( prop in s) return prop;
    prop = prop[0].toUpperCase() + prop.slice(1);
    for( i = v.length; i--; )
        if( v[i] + prop in s) return (v[i] + prop);
}

if(!String.prototype.toVendorPrefix){
    String.prototype.toVendorPrefix = function(){
        return getVendorPrefixed(this.toString());
    }
}

if(!String.prototype.htmlEscape){
    String.prototype.htmlEscape = function(){
      return String(this)
                .replace(/&/g, '&amp;',"g")
                .replace(/"/g, '&quot;',"g")
                .replace(/'/g, '&#39;',"g")
                .replace(/</g, '&lt;',"g")
                .replace(/>/g, '&gt;',"g"); 
    }
}

if(!String.prototype.htmlUnescape){
    String.prototype.htmlUnescape = function(){
      return String(this)
                .replace(/&amp;/g, '&',"g")
                .replace(/&quot;/g, '\"',"g")
                .replace(/&#39;/g, '\'',"g")
                .replace(/&lt;/g, '<',"g")
                .replace(/&gt;/g, '>',"g"); 
    }
}

document.createComponent = function(namespace, element, model){
    var Klass = NSRegistry[namespace];
    return new Klass(model,element);
};


/* inspired by https://gist.github.com/1129031 */
/*global document, DOMParser*/
//https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
/*
    parser = new DOMParser();
    doc = parser.parseFromString("<div>asdsda</div>", "text/html");
 */
(function(DOMParser) {
    "use strict";

    var
      proto = DOMParser.prototype
    , nativeParse = proto.parseFromString
    ;

    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser()).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}

    proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var
              doc = document.implementation.createHTMLDocument("")
            ;
                if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                    doc.documentElement.innerHTML = markup;
                }
                else {
                    doc.body.innerHTML = markup;
                }
            return doc;
        } else {
            return nativeParse.apply(this, arguments);
        }
    };
}(DOMParser));

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
            return fToBind.apply(
                        (this instanceof fNOP && oThis) ? this : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments))
                   );
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    fBound.isBound = true;
    fBound.boundedFunction = fToBind;
    return fBound;
  };
};

if (!Function.prototype.debounce) {
    Function.prototype.debounce = function(wait, immediate) {
        var func = this;
        // 'private' variable for instance
        // The returned function will be able to reference this due to closure.
        // Each call to the returned function will share this common timer.
        var timeout;           
    
        // Calling debounce returns a new anonymous function
        return function() {
            // reference the context and args for the setTimeout function
            var context = this, 
            args = arguments;
    
            // this is the basic debounce behaviour where you can call this 
            // function several times, but it will only execute once [after
            // a defined delay]. 
            // Clear the timeout (does nothing if timeout var is undefined)
            // so that previous calls within the timer are aborted.
            clearTimeout(timeout);   
    
            // Set the new timeout
            timeout = setTimeout(function() {
    
                 // Inside the timeout function, clear the timeout variable
                 timeout = null;
    
                 // Check if the function already ran with the immediate flag
                 if (!immediate) {
                   // Call the original function with apply
                   // apply lets you define the 'this' object as well as the arguments 
                   //    (both captured before setTimeout)
                   func.apply(context, args);
                 }
            }, wait);
    
            // If immediate flag is passed (and not already in a timeout)
            //  then call the function without delay
            if (immediate && !timeout) 
                func.apply(context, args);  
         }; 
    }
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
};

if(!Array.prototype.toArray){
    Array.prototype.toArray = function(o){
        return [].slice.call(o,0);
    };
};


if("logging" in appconfig && appconfig.logging != true) {
  for(var k in console){
      console[k]=function(){};
  }
};


//extend obj with proto
$C = function(obj, proto){
   for(var key in proto) {
       if (!obj[key]) {
        obj[key] = proto[key];
       }
   };
   return obj;
};

function $CAST(obj, _class, args){
    if (!obj || (typeof obj != "object")) { return obj;}
    if(obj && obj.nodeType==1){
        if (obj.prototype && (obj.prototype instanceof _class)) {
            return obj.prototype;
        }
        else {
            _class = _class||w3c.Element;
            return new _class((args ||{}), obj);
        }
    }
    else {
        if(obj && (obj instanceof _class)) {
            return obj;
        }
        else {
            _class = _class||w3c.Element;
            return new _class((args ||{}), obj);
        }
    }
};

window.getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};



window.onerror = function(message, url, linenumber) {
  try{console.error("JavaScript error: " + message + " on line " + linenumber + " for " + url)}
  catch(e){}
};


;( function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());




prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();



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

namespace("js.Trait", {
	initialize : function(){}
});

namespace("browser.DeviceInfo");
browser.DeviceInfo = {
	initialize : function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1) {
					return data[i].identity;
				}
			}
			else 
				if (dataProp) {
					return data[i].identity;
				}
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) {
			return;
		};
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "MSIE",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]
};
browser.DeviceInfo.initialize();


// require EcmaScriptTemplates
// require mustache
// require Kruntch


var Observer = function() {
    this.observations = [];
    this.subscribers  = {};
};
 
var Observation = function(name, func) {
    this.name = name;
    this.func = func;
};
 
Observer.prototype = {
    addEventListener : function(eventName, callback, capture){
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];}
        this.subscribers[eventName].push(new Observation(eventName, callback));
    },
    
    dispatchEvent : function(eventName, data, scope) {
        scope = (scope||this||window);
        var funcs = this.subscribers[eventName]||[];
   	        funcs.forEach(function notify_observer(observer) { 
                observer.func.call(scope, data); 
            });  
    },
    
    removeEventListener : function(eventName, callback){
        var subscribers = this.subscribers[eventName]||[];
            subscribers.remove(function(i) {
                return i.name === eventName && i.func === callback;
            });
    }
};


namespace('ui.models.ComponentModel', {
	"@traits": [new Observer],
	
	/*preInitialize: function(data, element) {
		this.resetListeners();
		this.resetModel(data);
		this.setElement(element);
		this.initialize(data, element);
	},*/

	initialize: function(data, element) {
		this.resetListeners();
		this.resetModel(data);
		this.setElement(element);
		//this.initialize(data, element);
	},
	
	setElement : function(element){
		this.element = element||this;
	},
	
    
	start: function() {},
	
	resetListeners: function() {
		this.observations = [];
		this.subscribers = {};
	},
	
	resetModel: function(data) {
		this.data = data;
	},
	
	set: function(prop, value) {
		this.data[prop] = value;
		this.dispatchEvent("modelchanged", {
			model: this,
			name: prop
		});
	},
	
	get: function(prop) {
		return this.data[prop]; 
    },
	
	isValid: function() {
        var self = this;
		return true;
	},

	find: function(jsonquery) {
		
	},
	
	registerUI:function(){},
	
	resolve: function(path, obj){
			var scope       = obj||window;
			var nsParts     = path.split(/\./); 
			//console.warn(nsParts)
			for (var i = 0; i <= nsParts.length - 1; i++) {
					if(i >= nsParts.length - 1) {
						return scope[nsParts[i]]
					}
					else {
		            	scope = scope[nsParts[i]];
		           }
                            //console.info(scope)
			};
			return scope; 
	}
});

SimpleTemplateEngine = {
    parseTemplate : function(templateString, data){
        return templateString;
    }
};


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


namespace("w3c.CSSSelectors");

w3c.CSSSelectors = {
	querySelectorAll : function(cssSelector, element){
		element = element || this.element;
		if(document.querySelectorAll) {
			return [].toArray(element.querySelectorAll(cssSelector))}
		else {
			throw new Error("'#querySelectorAll()' api not defined")
		}
	},
	
	querySelector : function(cssSelector, element){
		element = element || this.element;
		if(document.querySelector) {
			return element.querySelector(cssSelector);}
		else {
			throw new Error("'#querySelector()' api not defined");
		}
	}
};



namespace("w3c.Node", {
    '@traits': [w3c.CSSSelectors],
	
    /*preInitialize : function(model, element){
        this.element = element;
        this.model 	 = model;
        this.initialize(model, element)
    },
    
    initialize : function(model, element){
    	
    },*/
    
    addEventListener : function(type, callback, capture, element){
    	capture = (typeof capture == "boolean") ? capture : false;
    	element = element||this.element;
    	if(callback && !callback.isBound) {
			callback = callback.bind(this);
		}
		
		return element.addEventListener(type, callback, capture);
    },
    
    removeEventListener : function(type, callback, capture, element){
    	element = element||this.element;
    	return element.removeEventListener(type, callback, capture)
    },
    
    /*addEventDelegate : function(className, type, callback, capture){
		var self = this;
		className = className.replace(".","");
		if(!this.delegates) {
			this.delegates={}
		};
		if(!this.delegates[type]) {
			this.delegates[type]=[]
		};
		this.delegates[type].push({
			className:className,
			callback:callback,
			capture:capture
		});
		
		this.addEventListener(type, function(e){
			if(!self.delegates[type]) { return }
			else {
				var handlers = self.delegates[type];
				for(var i=0; i<=handlers.length-1; i++) {
					var handler = handlers[i];
					if(e.target && self.hasClass(handler.className, e.target)) {
						handler.callback(e);
					}
				}
			}
		}, capture);
	},*/
    
    dispatchEvent : function(type, bubbles, cancelable, eventdata, element){
    	element 	= element||this.element;
    	bubbles 	= (typeof bubbles 	 == "boolean") ? bubbles 	: true;
    	cancelable 	= (typeof cancelable == "boolean") ? cancelable : true;
    	var evt 	= document.createEvent("Event");
		evt.initEvent(type, bubbles, cancelable);
		evt.data 	= eventdata;
		
		element.dispatchEvent(evt);
		return evt;
    },
    
    createEvent : function(type, bubbles, cancelable, eventdata){
    	bubbles 	= (typeof bubbles 	 == "boolean") ? bubbles 	: true;
    	cancelable 	= (typeof cancelable == "boolean") ? cancelable : true;
    	var evt 	= document.createEvent("Event");
			evt.initEvent(type, bubbles, cancelable);
			evt.data= eventdata;
		return evt;
    },
    
    
    parentNode: function(element){
    	element = element||this.element;
		return element.parentNode;
    },
    
    childNodes: function(element){
    	element = element||this.element;
		return element.childNodes;
    },
    
    firstChild: function(element, elementOnly){
		element = element||this.element;
        var fc = element.firstChild;
        if(elementOnly) {
	        while (fc&&fc.nodeType != 1) {
	            fc = fc.nextSibling;
	        }
        }
        return fc;
    },
    
    lastChild: function(element, elementOnly){
		element = element||this.element;
        var lc = element.lastChild;
        if(elementOnly) {
	        while (lc.nodeType != 1) {
	            lc = lc.previousSibling;
	        }
        }
        return lc;
    },
    
    hasChildNode : function (child, parent) {
		parent = parent||this.element;
		if (parent === child) { 
			return false; 
		}
		while (child && child !== parent) { 
			child = child.parentNode; 
		}
	   return child === parent;
	},
    
    previousSibling: function(element, elementOnly){
		element = element || this.element;
		element = element.previousSibling;
		var args = arguments;
        if(elementOnly) {
	        while (element && element.nodeType != 1) {
	        	element = element.previousSibling
	        }
       	}
        return element;
    },
    
    nextSibling: function(element, elementOnly){
		element = element || this.element;
		element = element.nextSibling;
		if(elementOnly) {
	        while (element && element.nodeType != 1) {
	        	element = element.nextSibling
	        }
       	}
		return element;
    },
    
    attributes: function(){
		element = element || this.element;
		return element.attributes;
    }, //NamedNodeMap
    
    ownerDocument: function(element){
    	element = element || this.element;
		return element.ownerDocument;
    },
    
	insertBefore: function(newNode, refNode){
		var el = refNode||this.element;
		return el.parentNode.insertBefore(newNode, el);
    },
	
	insertAfter : function(newNode, refNode) {
		var el = refNode||this.element;
		return el.parentNode.insertBefore(newNode, this.nextSibling(el));
	},
	
	swapNode : function(b) {
	    var a = this.element;
	    var t = a.parentNode.insertBefore(document.createTextNode(""), a);
	    b.parentNode.insertBefore(a, b);
	    t.parentNode.insertBefore(b, t);
	    t.parentNode.removeChild(t);
	    return this;
	},
    
    replaceChild : function(newChild, oldChild){
    	oldChild = oldChild||this.element;
		return oldChild.parentNode.replaceChild(newChild, oldChild);
	},
    
    removeChild : function(element){
		element = element||this.element;
		return element.parentNode.removeChild(element);
	},
    
    appendChild : function(child, slot, element){
		element = element||this.element;
		slot = (typeof slot === "string") ? this.querySelector(slot) : slot;
		slot = (slot)? slot:element;
		slot.appendChild((child instanceof w3c.Node || child.element) ? child.element:child);
		return child;
	},
    
    hasChildNodes: function(){
		return (this.childNodes().length > 0);
    },
    
    cloneNode : function(deep){
		deep = (typeof deep !== "undefined")? deep:true;
		return new this.constructor({}, this.element.cloneNode(deep));
	},
    
    getBoundingClientRect : function(element) {
        element = element||this.element;
        if (element.getBoundingClientRect) {
            // (1)
            var box = element.getBoundingClientRect();
            
            var body    = document.body
            var docElem = document.documentElement
            
            // (2)
            var scrollTop   = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft  = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            
            // (3)
            var clientTop   = docElem.clientTop || body.clientTop || 0
            var clientLeft  = docElem.clientLeft || body.clientLeft || 0
            
            // (4)
            var top  = box.top  + (scrollTop  - clientTop);
            var left = box.left + (scrollLeft - clientLeft);
            
            return { 
                top: Math.round(top), 
                left: Math.round(left),
                right:  Math.round(box.right),
                bottom:  Math.round(box.bottom),
                width : Math.round(box.right - left),
                height: Math.round(box.bottom - top)
            }
        }
        else {
            //console.warn(this.namespace + "#getBoundingClientRect() - not supported by 'this.element' node on this device.")
            var top=0, left=0, right=0, bottom=0, width=0, height=0;
            while(element) {
                top  = top  + parseInt(element.offsetTop, 10);
                left = left + parseInt(element.offsetLeft,10);
                right = left + element.offsetWidth;
                bottom = top + element.offsetHeight;
                width = element.offsetWidth;
                height = element.offsetHeight;
                element = element.offsetParent;       
            };
            return {top: top, left: left, right:right, bottom:bottom, width:width, height:height};
        }
    },
    
    hittest : function(component) {
        if(!component){ return false }
        var compare,bounds;
        if( component instanceof w3c.Node){
            compare = component.getBoundingClientRect();
        }
        else if(component && ("left" in component) && ("top" in component)){
            compare = component;
        }
        else {
            throw new Error(this.namespace + "#hittest(component); expected an instance of\
            w3c.Node or {top:<int>, left:<int>}");
        }
        bounds = this.getBoundingClientRect();
        return (compare.left > bounds.left && compare.top > bounds.top && compare.left < bounds.right && compare.top < bounds.bottom);
    },
    
    getAttribute : function(attrName, element){
        element = element||this.element;
        if(element && typeof element == "string") {
            element = this.querySelector(element)||this.element;
        }
        var val = element.getAttribute(attrName);
        if(isNaN(val) == false && (/^\d+$/.test(val))) {
            return parseInt(val, 10);
        } else {
            return val;
        }
    }
});


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



namespace("ui.Application", 
{
	'@inherits' : w3c.HtmlComponent,
	'@stylesheets' : [
	   "resources/css/reset.css",
       "resources/css/framework.css"
    ],
    
    
    preInitialize : function(model, element) {
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        StorageManager.initialize(appconfig.namespace+"_"+ (appconfig.appid||Math.uuid2()) );
        
        if(window.addEventListener){
            window.addEventListener ("load", this.onLoad.bind(this), true);
            window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        }
        this.parent(model, element);
        this.setSpinner();
        this.showSpinner();
        this.setBrowserClassname();
        return this;
    },

    /*initialize : function(model, element){
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        
        if(window.addEventListener){
            window.addEventListener ("load", this.onLoad.bind(this), true);
            window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        }
        this.parent(model, element);
        this.setSpinner();
        this.showSpinner();
        this.setBrowserClassname();
        return this;
    },*/
    
    setSpinner : function (){
        var el = '<div class="bubblingG">\
                    <span id="bubblingG_1"></span>\
                    <span id="bubblingG_2"></span>\
                    <span id="bubblingG_3"></span>\
                  </div>'.toHtmlElement();
        this.spinner = el;
    },
    
    getSpinner : function (){
        return this.spinner.cloneNode(true);
    },
    
    showSpinner: function(){
        var el = this.getSpinner();
        this.currentSpinner = el;
        this.element.appendChild(el);
    },
    
    onLoad : function onLoad(e) {
        var self=this;
        var canvas=this.canvas;//this.querySelector(".canvas");
        var spinner = this.currentSpinner;
        setTimeout(function(){
            canvas.style.visibility="visible";
            canvas.style.opacity=1;
            self.removeChild(spinner);
            self.dispatchEvent("loaded", false, false, {event:e});
            self.doHashChangedEvent(e);
        }.bind(this),appconfig.foucdelay||1000)
    },
    
    doHashChangedEvent : function(){
        var hash = location.hash.substring(1);
        if(hash && hash.length > 0) {
            this.onLocationHashChanged(location);
        }
    },
    
    onLocationHashChanged : function(e){
        this.dispatchEvent("statechanged", false, false, {event:e})
    },
    
    generateSkin : function(){
        var skin = "";
        var a = [].toArray(document.getElementsByTagName("style"))
        
        for(var i=0; i<=a.length-1; i++){
            if(!a[i].getAttribute("component")) {continue;}
            skin += a[i].innerHTML
        }
        console.log(skin)
    },
    
    setBrowserClassname : function(){
        try {
            this.addClass(browser.DeviceInfo.OS, document.body);
            this.addClass(browser.DeviceInfo.browser, document.body);
            document.body.setAttribute("browser", browser.DeviceInfo.browser);
            document.body.setAttribute("os", browser.DeviceInfo.OS);
            this.addClass("application")
        } catch(e) {
            try{
                console.warn("There was a problem setting the agent/device information on the <body> tag.")
                console.warn(" |--> " + e.message)
            } catch(e){}
        }
    },
    
    globalzindex : 600000,
    
    absoluteZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    },

    
    innerHTML:"<div></div>",
    
    cssText:
    'body > .canvas {\
        visibility: hidden;\
        opacity: 0;\
        transition: opacity 2s;\
        -webkit-transition:opacity 2s;\
        -o-transition:opacity 2s;\
        -moz-transition:opacity 2s;\
        -ms-transition:opacity 2s;\
    }'
});


//////////////////////////////////////////////////
//
//  the stringifier is based on
//    http://json.org/json.js as of 2006-04-28 from json.org
//  the parser is based on 
//    http://osteele.com/sources/openlaszlo/json
//

if (typeof rison == 'undefined')
    window.rison = {};

/**
 *  rules for an uri encoder that is more tolerant than encodeURIComponent
 *
 *  encodeURIComponent passes  ~!*()-_.'
 *
 *  we also allow              ,:@$/
 *
 */
rison.uri_ok = {  // ok in url paths and in form query args
            '~': true,  '!': true,  '*': true,  '(': true,  ')': true,
            '-': true,  '_': true,  '.': true,  ',': true,
            ':': true,  '@': true,  '$': true,
            "'": true,  '/': true
};

/*
 * we divide the uri-safe glyphs into three sets
 *   <rison> - used by rison                         ' ! : ( ) ,
 *   <reserved> - not common in strings, reserved    * @ $ & ; =
 *
 * we define <identifier> as anything that's not forbidden
 */

/**
 * punctuation characters that are legal inside ids.
 */
// this var isn't actually used
//rison.idchar_punctuation = "_-./~";  

(function () {
    var l = [];
    for (var hi = 0; hi < 16; hi++) {
        for (var lo = 0; lo < 16; lo++) {
            if (hi+lo == 0) continue;
            var c = String.fromCharCode(hi*16 + lo);
            if (! /\w|[-_.\/~]/.test(c))
                l.push('\\u00' + hi.toString(16) + lo.toString(16));
        }
    }
    /**
     * characters that are illegal inside ids.
     * <rison> and <reserved> classes are illegal in ids.
     *
     */
    rison.not_idchar = l.join('')
    //idcrx = new RegExp('[' + rison.not_idchar + ']');
    //console.log('NOT', (idcrx.test(' ')) );
})();
//rison.not_idchar  = " \t\r\n\"<>[]{}'!=:(),*@$;&";
rison.not_idchar  = " '!:(),*@$";


/**
 * characters that are illegal as the start of an id
 * this is so ids can't look like numbers.
 */
rison.not_idstart = "-0123456789";


(function () {
    var idrx = '[^' + rison.not_idstart + rison.not_idchar + 
               '][^' + rison.not_idchar + ']*';

    rison.id_ok = new RegExp('^' + idrx + '$');

    // regexp to find the end of an id when parsing
    // g flag on the regexp is necessary for iterative regexp.exec()
    rison.next_id = new RegExp(idrx, 'g');
})();

/**
 * this is like encodeURIComponent() but quotes fewer characters.
 *
 * @see rison.uri_ok
 *
 * encodeURIComponent passes   ~!*()-_.'
 * rison.quote also passes   ,:@$/
 *   and quotes " " as "+" instead of "%20"
 */
rison.quote = function(x) {
    if (/^[-A-Za-z0-9~!*()_.',:@$\/]*$/.test(x))
        return x;

    return encodeURIComponent(x)
        .replace(/%2C/g, ',')
        .replace(/%3A/g, ':')
        .replace(/%40/g, '@')
        .replace(/%24/g, '$')
        .replace(/%2F/g, '/')
        .replace(/%20/g, '+');
};


//
//  based on json.js 2006-04-28 from json.org
//  license: http://www.json.org/license.html
//
//  hacked by nix for use in uris.
//

(function () {
    var sq = { // url-ok but quoted in strings
               "'": true,  '!': true
    },
    s = {
            array: function (x) {
                var a = ['!('], b, f, i, l = x.length, v;
                for (i = 0; i < l; i += 1) {
                    v = x[i];
                    f = s[typeof v];
                    if (f) {
                        v = f(v);
                        if (typeof v == 'string') {
                            if (b) {
                                a[a.length] = ',';
                            }
                            a[a.length] = v;
                            b = true;
                        }
                    }
                }
                a[a.length] = ')';
                return a.join('');
            },
            'boolean': function (x) {
                if (x)
                    return '!t';
                return '!f'
            },
            'null': function (x) {
                return "!n";
            },
            number: function (x) {
                if (!isFinite(x))
                    return '!n';
                // strip '+' out of exponent, '-' is ok though
                return String(x).replace(/\+/,'');
            },
            object: function (x) {
                if (x) {
                    if (x instanceof Array) {
                        return s.array(x);
                    }
                    // WILL: will this work on non-Firefox browsers?
                    if (typeof x.__prototype__ === 'object' && typeof x.__prototype__.encode_rison !== 'undefined')
                        return x.encode_rison();

                    var a = ['('], b, f, i, v, ki, ks=[];
                    for (i in x)
                        ks[ks.length] = i;
                    ks.sort();
                    for (ki = 0; ki < ks.length; ki++) {
                        i = ks[ki];
                        v = x[i];
                        f = s[typeof v];
                        if (f) {
                            v = f(v);
                            if (typeof v == 'string') {
                                if (b) {
                                    a[a.length] = ',';
                                }
                                a.push(s.string(i), ':', v);
                                b = true;
                            }
                        }
                    }
                    a[a.length] = ')';
                    return a.join('');
                }
                return '!n';
            },
            string: function (x) {
                if (x == '')
                    return "''";

                if (rison.id_ok.test(x))
                    return x;

                x = x.replace(/(['!])/g, function(a, b) {
                    if (sq[b]) return '!'+b;
                    return b;
                });
                return "'" + x + "'";
            },
            undefined: function (x) {
                throw new Error("rison can't encode the undefined value");
            }
        };


    /**
     * rison-encode a javascript structure
     *
     *  implemementation based on Douglas Crockford's json.js:
     *    http://json.org/json.js as of 2006-04-28 from json.org
     *
     */
    rison.encode = function (v) {
        return s[typeof v](v);
    };

    /**
     * rison-encode a javascript object without surrounding parens
     *
     */
    rison.encode_object = function (v) {
        if (typeof v != 'object' || v === null || v instanceof Array)
            throw new Error("rison.encode_object expects an object argument");
        var r = s[typeof v](v);
        return r.substring(1, r.length-1);
    };

    /**
     * rison-encode a javascript array without surrounding parens
     *
     */
    rison.encode_array = function (v) {
        if (!(v instanceof Array))
            throw new Error("rison.encode_array expects an array argument");
        var r = s[typeof v](v);
        return r.substring(2, r.length-1);
    };

    /**
     * rison-encode and uri-encode a javascript structure
     *
     */
    rison.encode_uri = function (v) {
        return rison.quote(s[typeof v](v));
    };

})();




//
// based on openlaszlo-json and hacked by nix for use in uris.
//
// Author: Oliver Steele
// Copyright: Copyright 2006 Oliver Steele.  All rights reserved.
// Homepage: http://osteele.com/sources/openlaszlo/json
// License: MIT License.
// Version: 1.0


/**
 * parse a rison string into a javascript structure.
 *
 * this is the simplest decoder entry point.
 *
 *  based on Oliver Steele's OpenLaszlo-JSON
 *     http://osteele.com/sources/openlaszlo/json
 */
rison.decode = function(r) {
    var errcb = function(e) { throw Error('rison decoder error: ' + e); };
    var p = new rison.parser(errcb);
    return p.parse(r);
};

/**
 * parse an o-rison string into a javascript structure.
 *
 * this simply adds parentheses around the string before parsing.
 */
rison.decode_object = function(r) {
    return rison.decode('('+r+')');
};

/**
 * parse an a-rison string into a javascript structure.
 *
 * this simply adds array markup around the string before parsing.
 */
rison.decode_array = function(r) {
    return rison.decode('!('+r+')');
};


/**
 * construct a new parser object for reuse.
 *
 * @constructor
 * @class A Rison parser class.  You should probably 
 *        use rison.decode instead. 
 * @see rison.decode
 */
rison.parser = function (errcb) {
    this.errorHandler = errcb;
};

/**
 * a string containing acceptable whitespace characters.
 * by default the rison decoder tolerates no whitespace.
 * to accept whitespace set rison.parser.WHITESPACE = " \t\n\r\f";
 */
rison.parser.WHITESPACE = "";

// expose this as-is?
rison.parser.prototype.setOptions = function (options) {
    if (options['errorHandler'])
        this.errorHandler = options.errorHandler;
};

/**
 * parse a rison string into a javascript structure.
 */
rison.parser.prototype.parse = function (str) {
    this.string = str;
    this.index = 0;
    this.message = null;
    var value = this.readValue();
    if (!this.message && this.next())
        value = this.error("unable to parse string as rison: '" + rison.encode(str) + "'");
    if (this.message && this.errorHandler)
        this.errorHandler(this.message, this.index);
    return value;
};

rison.parser.prototype.error = function (message) {
    if (typeof(console) != 'undefined')
        console.log('rison parser error: ', message);
    this.message = message;
    return undefined;
}
    
rison.parser.prototype.readValue = function () {
    var c = this.next();
    var fn = c && this.table[c];

    if (fn)
        return fn.apply(this);

    // fell through table, parse as an id

    var s = this.string;
    var i = this.index-1;

    // Regexp.lastIndex may not work right in IE before 5.5?
    // g flag on the regexp is also necessary
    rison.next_id.lastIndex = i;
    var m = rison.next_id.exec(s);

    // console.log('matched id', i, r.lastIndex);

    if (m.length > 0) {
        var id = m[0];
        this.index = i+id.length;
        return id;  // a string
    }

    if (c) return this.error("invalid character: '" + c + "'");
    return this.error("empty expression");
}

rison.parser.parse_array = function (parser) {
    var ar = [];
    var c;
    while ((c = parser.next()) != ')') {
        if (!c) return parser.error("unmatched '!('");
        if (ar.length) {
            if (c != ',')
                parser.error("missing ','");
        } else if (c == ',') {
            return parser.error("extra ','");
        } else
            --parser.index;
        var n = parser.readValue();
        if (typeof n == "undefined") return undefined;
        ar.push(n);
    }
    return ar;
};

rison.parser.bangs = {
    t: true,
    f: false,
    n: null,
    '(': rison.parser.parse_array
}

rison.parser.prototype.table = {
    '!': function () {
        var s = this.string;
        var c = s.charAt(this.index++);
        if (!c) return this.error('"!" at end of input');
        var x = rison.parser.bangs[c];
        if (typeof(x) == 'function') {
            return x.call(null, this);
        } else if (typeof(x) == 'undefined') {
            return this.error('unknown literal: "!' + c + '"');
        }
        return x;
    },
    '(': function () {
        var o = {};
        var c;
        var count = 0;
        while ((c = this.next()) != ')') {
            if (count) {
                if (c != ',')
                    this.error("missing ','");
            } else if (c == ',') {
                return this.error("extra ','");
            } else
                --this.index;
            var k = this.readValue();
            if (typeof k == "undefined") return undefined;
            if (this.next() != ':') return this.error("missing ':'");
            var v = this.readValue();
            if (typeof v == "undefined") return undefined;
            o[k] = v;
            count++;
        }
        return o;
    },
    "'": function () {
        var s = this.string;
        var i = this.index;
        var start = i;
        var segments = [];
        var c;
        while ((c = s.charAt(i++)) != "'") {
            //if (i == s.length) return this.error('unmatched "\'"');
            if (!c) return this.error('unmatched "\'"');
            if (c == '!') {
                if (start < i-1)
                    segments.push(s.slice(start, i-1));
                c = s.charAt(i++);
                if ("!'".indexOf(c) >= 0) {
                    segments.push(c);
                } else {
                    return this.error('invalid string escape: "!'+c+'"');
                }
                start = i;
            }
        }
        if (start < i-1)
            segments.push(s.slice(start, i-1));
        this.index = i;
        return segments.length == 1 ? segments[0] : segments.join('');
    },
    // Also any digit.  The statement that follows this table
    // definition fills in the digits.
    '-': function () {
        var s = this.string;
        var i = this.index;
        var start = i-1;
        var state = 'int';
        var permittedSigns = '-';
        var transitions = {
            'int+.': 'frac',
            'int+e': 'exp',
            'frac+e': 'exp'
        };
        do {
            var c = s.charAt(i++);
            if (!c) break;
            if ('0' <= c && c <= '9') continue;
            if (permittedSigns.indexOf(c) >= 0) {
                permittedSigns = '';
                continue;
            }
            state = transitions[state+'+'+c.toLowerCase()];
            if (state == 'exp') permittedSigns = '-';
        } while (state);
        this.index = --i;
        s = s.slice(start, i)
        if (s == '-') return this.error("invalid number");
        return Number(s);
    }
};
// copy table['-'] to each of table[i] | i <- '0'..'9':
(function (table) {
    for (var i = 0; i <= 9; i++)
        table[String(i)] = table['-'];
})(rison.parser.prototype.table);

// return the next non-whitespace character, or undefined
rison.parser.prototype.next = function () {
    var s = this.string;
    var i = this.index;
    do {
        if (i == s.length) return undefined;
        var c = s.charAt(i++);
    } while (rison.parser.WHITESPACE.indexOf(c) >= 0);
    this.index = i;
    return c;
};

Array.prototype.where = function(exp){
    var exp = new Function("$", "return " + exp);
    var arr=[];
    for(var i=0; i<=this.length-1; i++){
        if(exp(this[i])){
            arr.push(this[i])
        }
    }
    return arr;
};



StorageManager = {
  initialize : function(key){
    this.key=key;
    var str = localStorage.getItem(key)||"{}";
    this.data = JSON.parse(str);
  },
  
  reset : function(ns, persist){
      persist = typeof persist=="boolean"?persist:false;
      this.data[ns] = null;
      delete this.data[ns];
      if(persist){
        StorageManager.persist();
      }
  },
  
  find : function(ns, id){
    return this.data[ns]||[];
  },
  
  commit : function(){
      StorageManager.persist();
  },
  
  persist : function(){
    localStorage.setItem(this.key, JSON.stringify(this.data))
  },
  
  store : function(ns, obj, persist){
    persist = typeof persist=="boolean"?persist:false;
    if(!obj||!ns){return}
    if(!obj.oid){
        obj.oid = Math.uuid(8);
    }
    //var objkey = this.key+"."+ns;
    //console.log("objkey:",objkey)
    var arr = this.data[ns]//localStorage.getItem(objkey);
    //console.log("ref:",ref)
    var item_exists=false;
    //var arr;

    if(arr && arr.length > 0){
      //arr = JSON.parse(ref);
      //console.log("arr:",arr)
      //alert(arr.length)
      //if(arr && arr.length > 0){
        for (var i = 0; i <= arr.length-1; i++){
          var item = arr[i];
          //alert(item)
          if(obj.oid){
              if(item.oid == obj.oid){
                arr[i] = obj;
                item_exists=true;
                //break;
              }
          }
        }
      //}
      if(!item_exists){
        //alert("bucket found but item dont exist");
        // if(!obj.oid){
            // obj.oid = Math.uuid(8);
        // }
        //arr = arr.concat(obj);
        //this.data[ns] = arr;
        this.data[ns].push(obj)
        //localStorage.setItem(objkey, JSON.stringify(arr));
      }
    } else {
      //alert("bucket not defined. Creating bucket and inserting item")
      var arr = [];
      // if(!obj.oid){
          // obj.oid = Math.uuid(8);
      // }
      arr = arr.concat(obj);
      this.data[ns] = arr;
      //localStorage.setItem(objkey, JSON.stringify(arr))
    }
    if(persist){
        StorageManager.persist();
    }
  },
  
  remove : function(ns, persist){
    persist = typeof persist=="boolean"?persist:false;
    //var objkey = this.key+"."+ns
    var ref = this.data[ns];//localStorage.getItem(objkey);
    if(ref){
      //var arr = JSON.parse(ref);
      return {
        where : function(exp){
          var res = ref.where(exp);
          for (var i = 0; i <= res.length-1; i++){
            var item = res[i];
            for (var j = 0; j <= ref.length-1; j++){
              var storedItem = ref[j];
              if(item && (item.oid == storedItem.oid)){
                ref.splice(j,1);
              }
            }
          }
          if(persist){
            StorageManager.persist();
          }
          //console.warn("new arr",arr)
          //StorageManager.reset(ns)
          //StorageManager.store(ns,arr)
        }
      };
    }
    return {
        where : function(exp){
            return []
        }
    };
  }
};


namespace("core.data.Accessor", {
    '@traits' : [new Observer],

    list:{},
    subscribers: {},
    observations: [],

    initialize : function(data) {
        this.path = "";
        this.data = data;
        delete this.subscribers;
        delete this.observations;
    },
    setPath : function(p) {
        this.path += p
    },
    getPath : function(p) {
        return this.path
    },
    resolve : function(path, obj) {
        var list = this.constructor.prototype.list;

        if (!list[path]) {
          var scope = obj || this.data||window;
          var nsParts = path.split(/\./);
          for (var i = 0; i <= nsParts.length - 1; i++) {
              if (i >= nsParts.length - 1) {
                  scope = scope[nsParts[i]];
                  break;
              } else {
                  scope = scope[nsParts[i]];
              }
          };
          var a = new core.data.Accessor(scope);
          var prefix = (this.getPath().length > 0) ? this.getPath() + "." : "";
          a.setPath(prefix + path);
          a.parent = this;
          return a;
        }
        else{
          return list[path];
        }
    },

    get : function(path) {
        var list = this.constructor.prototype.list;
        if (!list[path]) {
            var exp = new Function("$", "return $." + path);
            var r = exp(this.data);
            var a = new core.data.Accessor(r);
            list[path] = a;
            var prefix = (this.getPath().length > 0) ? this.getPath() + "." : "";
            a.setPath(prefix + path);
            list[prefix + path] = a;

            a.parent = this;
            return a;
        } else {
            return list[path];
        }
    },

    set : function(path, val, _owner) {
        _owner = _owner||null;
        if(arguments.length==1){
          var _old = this.data;
          var _new = arguments[0];
          this.data = _new;
          this.dispatchEvent("changed", {
              newvalue : _new,
              oldvalue : _old,
              key : this.path,
              owner:_owner
          });
          this.dispatchEvent("changed:" + this.path, {
              newvalue : _new,
              oldvalue : _old,
              key : this.path,
              owner:_owner
          });
        }
        else {        
          var a = this;
          var old = a.data[path];
          a.data[path] = val;
          var p = this;
          do {
              p = p.parent
          } while(p && p.parent)
          this.dispatchEvent("changed", {
              newvalue : val,
              oldvalue : old,
              key : path,
              owner:_owner
          });

          if(this.path){
            //if(!p){return a}
            this.dispatchEvent("changed:" + this.path, {
                newvalue : val,
                oldvalue : old,
                key : this.path,
                owner:_owner
            });
            this.dispatchEvent("changed:" + (this.path + "." + path), {
                newvalue : val,
                oldvalue : old,
                key : (this.path + "." + path),
                owner:_owner
            });
          }
          return a
      }
    },
  
    where : function(exp){
      var exp = new Function("$", "return " + exp);
      var arr=[];
      var data = this.data;
      if(data instanceof Array){
        for(var i=0; i<=data.length-1; i++){
            if(exp(data[i])){
                var a = new core.data.Accessor(data[i]);
                arr.push(a)
            }
        }
      } else if(typeof data == "object"){
        console.log("No implementation for Object.where")
      }
      return arr;
    }
});



/**
 * InfiniteScroll is a shared trait that can be used by any Class.
 * @example see: apps.SearchResults for implementation use.
 * Classes implementing this trait must provide implementation of a
 * onContentScrolledTop() and onContentScrolledBottom() callbacks which
 * are triggered by this trait at the right moment.
 */

InfiniteScroll = {
    initialize : function(){
        var self=this;
        this.parent();

        var scrollArea = this.getInfiniteScrollableItem();
            scrollArea.addEventListener("scroll", this.onContentScrolled.bind(this).debounce(500), false);

        if(!this.onContentScrolledBottom){
            throw new Error("InfiniteScroll requires " + this.namespace + " to implement the onContentScrolledBottom() callback.")
        }
        if(!this.onContentScrolledTop){
            throw new Error("InfiniteScroll requires " + this.namespace + " to implement the onContentScrolledTop() callback.")
        }

        this.addEventListener("scrolltop", this.onContentScrolledTop.bind(this), false);
        this.addEventListener("scrollbottom", this.onContentScrolledBottom.bind(this).debounce(100), false);
    },

    /**
     * Triggered when user scrolls
     * @param {Event} e - The scroll event
     */
    onContentScrolled : function(e) {
        var scrollPos = this.contentPanel.scrollHeight - this.contentPanel.scrollTop;
        var scrollTop = this.contentPanel.scrollTop;
        var cHeight = this.contentPanel.clientHeight;
        var scrollHeightOffset = (this.contentPanel.scrollHeight-cHeight);
        var n = parseFloat(((scrollTop/scrollHeightOffset)/100)*100).toFixed(1)
        var threshold = parseFloat(n);
            threshold = threshold >= 1?1:threshold;
            threshold = threshold <= 0?0:threshold;

        console.log("scroll threshold",threshold)

        if(threshold ==0){
            this.dispatchEvent("scrolltop", true,true, {value:threshold});
        }
        if(threshold ==1){
            this.dispatchEvent("scrollbottom", true,true, {value:threshold});
        }
    }
};

UserAgent = {
    isIE : function(){
        return /Trident/.test(navigator.userAgent);
    },
    
    isMobile : function(){
       return appconfig.ismobile || /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    isIpad : function(){
       return /iPad/i.test(navigator.userAgent);
    },
    
    isAndroid: function() {
        return /Android/i.test(navigator.userAgent);
    },
    
    isBlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    
    isIOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    
    isWindowsMobile: function() {
        return /IEMobile/i.test(navigator.userAgent);
    }
};

//
// Kruntch.js - 1.2.0
//
// The MIT License (MIT)
//
// Copyright (c) 2013 David Vaccaro
//
// http://www.kruntch.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

(function (Kruntch, undefined) {

    // Private Member Functions
    var keywords = {
        'if': true,
        'for': true,
        'with': true,
        'elseif': true,
        'else': true,
        'first': true,
        'last': true,
        'nth': true,
        'empty': true,
        'apply': true,
        'to': true
    };

    // Determine of the specified charachter is "whitespace"
    function isWhitespace(c) {
        if ((c == ' ') || (c == '\r') || (c == '\n'))
            return true;
        return false;
    };

    // Determine of the specified charachter is "alpha"
    function isAlpha(c) {
        if (((c >= 'a') && (c <= 'z')) ||
            ((c >= 'A') && (c <= 'Z')))
            return true;
        return false;
    };

    // Determine of the specified charachter is "digit"
    function isDigit(c) {
        if ((c >= '0') && (c <= '9'))
            return true;
        return false;
    };

    // Determine of the specified charachter is "alpha-digit"
    function isAlphaDigit(c) {
        if ((isAlpha(c) == true) || (isDigit(c) == true))
            return true;
        return false;
    };

    // Determine if the specified character is a valid "tag" char
    function isID(c) {
        if ((c == ':') || (c == '_') || (c == '-') || (c == '!') || (isAlphaDigit(c) == true))
            return true;
        return false;
    };

    // TemplateTokenizer Priavte Class Definition
    var TemplateTokenizer = function(txt) {

        // Private Data Members
        var index = 0;
        var text = txt;

        // Determine if there are more token data to read
        function hasMoreTokens() {
            if (index >= text.length)
                return false;
            return true;
        };

        // Parse the next token in the stream
        function nextToken() {

            // First, Check the state
            if (this.HasMoreTokens() == false)
                return { text: '', iskeyelement: false };

            // Init the token
            var token = '';

            // Loop until a valid token has been parsed
            while (index < text.length) {

                var isend = false;
                var lhindex = 0;

                // Parse until a < is reached
                while ((index < text.length) && (text.charAt(index) != "<"))
                    token += text.charAt(index++);

                // Look ahead at the element
                lhindex = index;

                // Parse the <KruntchToken>

                // Increment past the <
                lhindex++;

                // Move past any whitespace
                while ((lhindex < text.length) && (isWhitespace(text.charAt(lhindex)) == true))
                    lhindex++;

                // If the first non-whitespace char is /, this is an ending tag
                if (text.charAt(lhindex) == "/") {

                    // Set the flag
                    isend = true;

                    // Move past the /
                    lhindex++;

                    // Move past any additional whitespace
                    while ((lhindex < text.length) && (isWhitespace(text.charAt(lhindex)) == true))
                        lhindex++;

                }

                var tag = '';

                // Accumulate the tag
                while ((lhindex < text.length) && (isID(text.charAt(lhindex)) == true) && (text.charAt(lhindex) != ">"))
                    tag += text.charAt(lhindex++);

                // Format the tag
                tag = tag.trim();

                // If this is a key element, return the prior token
                if (keywords[tag] == true) {

                    if (token != '')
                        return { text: token, iskeyelement: false };
                    else {

                        // Set the index to the look ahead
                        index = lhindex;

                        // Build the token
                        token = "<" + ((isend == true) ? "/" : "") + tag;

                        // Accululate the token to the next >
                        while ((index < text.length) && (text.charAt(index) != ">"))
                            token += text.charAt(index++);

                        // Add the >
                        token += ">";

                        // Increment
                        index++;

                        // If this is a Kruntch element, return
                        return { text: token, iskeyelement: true, isend: isend };

                    }

                }
                else {

                    // Set the index to the look ahead
                    index = lhindex;

                    // Cat on the token
                    if ((tag != '') && (tag != undefined) && (tag != null))
                        token += "<" + ((isend == true) ? "/" : "") + tag;

                }

            }

            // Return any remaining token
            return { text: token, iskeyelement: false };

        };

        // Public interface
        return {
            HasMoreTokens: hasMoreTokens,
            NextToken: nextToken
        };

    };

    // TemplateIO Default Class Definition
    var TemplateIO = function(node) {

        // Private Member Functions

        // Replace the specified "node" with the "replacement"
        // If the replacement is an HTML element object, replace direclty, otherwise, parse
        // and replace with all nodes contained in the replacement
        function setNode(parent, text) {

            // Set the innerHTML
            parent.innerHTML = text;

            // Return
            return;

        };

        // Write out the text
        function writeTemplateText(templateID, text) {

            // Check the state
            if ((node == undefined) || (node == null))
                return;

            // If the output "node" supports "Write", pass the call
            if (node.Write != undefined) {
                node.Write(text);
                return;
            }

            // Set
            setNode(node, text);

            // Return
            return;

        }

        // Load a specified template from the specified template id
        function readTemplateMarkup(templateID) {

            // If the output "node" supports "Read", pass the call
            if ((node != undefined) && (node.Read != undefined)) {
                return node.Read(templateID);
            }

            var allElements = document.getElementsByTagName('*');
            for (var i = 0; i < allElements.length; i++) {
                var id = allElements[i].getAttribute("data-templateid");
                if ((id != undefined) && (id != null) && (id == templateID)) {
                    if (allElements[i].nodeName.toUpperCase() == "TEXTAREA")
                        return allElements[i].value;
                    else
                        return allElements[i].innerHTML;
                }
            }

            // Return
            return '';

        }

        // Public interface
        return {

            Read: readTemplateMarkup,
            Write: writeTemplateText

        };

    };

    // Determine if the string is only a sequence of digits
    function isDigits(str) {
        return /^\d+$/.test(str);
    };

    // Determine if a value is a number
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // Make a copy of an array
    function copyArray(a) {
        return a.slice(0);
    };

    // Merge the members of BOTH the "to" and "from" objects to a third "result" object
    function mergeObjects(toOBJ, fromOBJ) {

        var res = {};

        // Merge the "TO" into the result
        for (m in toOBJ)
            res[m] = toOBJ[m];

        // Merge the "TO" into the result
        for (m in fromOBJ)
            res[m] = fromOBJ[m];

        // Return
        return res;

    };

    // Clone the specified object
    function cloneObject(obj) {
        return mergeObjects({}, obj);
    };

    // Clona the specified template
    function cloneTemplate(tmp) {

        // Clone the template object
        var ctmp = cloneObject(tmp);

        // Create a clean sub-template collection
        ctmp.sub = {};

        // Clone all the sub-templates
        for (var tid in tmp.sub)
            ctmp.sub[tid] = cloneTemplate(tmp.sub[tid]);

        // Return
        return ctmp;

    };

    /**
    * ReplaceAll by Fagner Brack (MIT Licensed)
    * Replaces all occurrences of a substring in a string
    */
    function replaceAll(orig, token, newToken, ignoreCase) {
        var _token;
        var str = orig + "";
        var i = -1;

        if (typeof token === "string") {

            if (ignoreCase) {

                _token = token.toLowerCase();

                while ((
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                )) !== -1
            ) {
                    str = str.substring(0, i) +
                    newToken +
                    str.substring(i + token.length);
                }

            } else {
                return orig.split(token).join(newToken);
            }

        }
        return str;
    };

    // Decode common HTML encoded items such as &amp; &lt; &gt;
    function minorHTMLDecode(str) {
        if (str.indexOf('&') > -1) {
            // Add these on an "as-needed" basis
            str = replaceAll(str, '&amp;', '&', true);
            str = replaceAll(str, '&lt;', '<', true);
            str = replaceAll(str, '&gt;', '>', true);
        }
        return str;
    };

    // Parse the final name of the property string
    function parseValueName(propertyString) {

        // Split the string
        var parts = propertyString.split('.');

        if ((parts == undefined) || (parts == null) || (parts.length == 0))
            return '';

        // Return the last element
        return parts[parts.length - 1];

    };

    // Parse the Name.Name.Name... property string
    // Examples:
    //  1. Name                      = Value
    //  2. Type.Name.toUpperCase     = Object.Value.Function
    //  3. PrimaryVisit.Cost         = Function.Value
    function parseValue(value, propertyString) {

        var last = value;

        // Split the string
        var parts = propertyString.split('.');

        // Loop over the parts
        for (var pi = 0; pi < parts.length; pi++) {

            // Save the last object
            last = value;

            // Walk the value
            value = value[parts[pi]];

            // Call the function (if the value is a function)
            if ((typeof value) == "function")
                value = value.call(last);

        }

        // Replace undefined and null with empty string
        if ((value == undefined) || (value == null))
            value = '';

        // Return
        return value;

    };

    // Test the specified condition against the specified "view" object
    function testCondition(template, view, condition) {
        return (new Function('return (' + template.root.conditions[condition] + ')')).call(view);
    };

    // Test the specified where criteria against the specified "view" object
    function testWhere(template, view, where) {
        return (new Function('return (' + template.root.wheres[where] + ')')).call(view);
    };

    // Select the collection given the collection value, where criteria and sort
    function selectCollection(template, view, value, where) {

        // Declare the result
        var res = {
            items: [],
            names: [],
            lookup: {},
            at: function (i) {

                // If the index is a literal number, index
                if (isNumber(i) == true)
                    return this.items[i];

                // Lookup the value
                return this.lookup[i];

            }
        };

        // Bind to the "each" collection
        var coll = parseValue(view, value);

        // If the collection was NOT found, return the default
        if (coll == undefined)
            return res;

        var collNames = [];

        // If the collection is NOT an array (an object with properties), convert to array
        if (!(coll instanceof Array)) {

            var oitems = [];

            // Create the names array
            collNames = [];

            // Loop over the objects properties
            for (var prop in coll) {

                // Collect the name
                collNames.push(prop);

                // Collect the values
                oitems.push(coll[prop]);

            }

            // Set the collection
            coll = oitems;

        }

        // Filter the collection
        if (where != undefined) {

            // Create the instance of the "filter" function
            var filter = new Function('return (' + template.root.wheres[where] + ')');
            var filtered = [];
            var filteredNames = [];

            // Loop over the collection items
            for (var fi = 0; fi < coll.length; fi++) {

                // Access the object
                var cobj = coll[fi];
                var cname = collNames[fi];

                // The "Root" super-parent of the entire hierarchy
                cobj.Root = view.Root;

                // Set the "special" view properties
                cobj.Parent = view;

                // The "Parents" array containing the list of all parents in the hierarchy
                cobj.Parents = copyArray(view.Parents);
                cobj.Parents.push(view);

                // The "Family" context object that host property accessors for each "each" along the hierarchy
                oitem.Family = view.Family;

                // Apply the filter
                if (filter.call(cobj) == true) {

                    // Select the object that passed the filter
                    filtered.push(cobj);

                    // Select the name that passed the filter (if the name is valid)
                    if ((cname != null) && (cname != null))
                        filteredNames.push(cname);

                }

            }

            // Set the collection
            coll = filtered;
            collNames = filteredNames;

        }

        // Set the result
        res.items = coll;
        res.names = collNames;

        // Build the lookup
        for (var i = 0; i < res.names.length; i++)
            res.lookup[res.names[i]] = res.items[i];

        // Return
        return res;

    };

    // Parse the specified "FOR" template into a processable template
    function makeForTemplateDetails(template) {

        // Create the details object
        var details = { any: undefined, first: undefined, last: undefined, empty: undefined, nth: [] };

        // Loop over the sub-templates
        for (var tid in template.sub) {

            // Access the sub-template
            var subtemplate = template.sub[tid];

            // Establish the "host" property
            subtemplate.host = template;

            // Detarmine if the element is a collection item target
            if (subtemplate.name == "first")
                details.first = subtemplate;
            else if (subtemplate.name == "last")
                details.last = subtemplate;
            else if (subtemplate.name == "empty")
                details.empty = subtemplate;
            else if (subtemplate.name == "nth") {

                // Add the "nth" sub-template
                details.nth.push({ template: subtemplate, every: undefined, at: undefined, where: undefined });

                // Access the root NTH
                var rootNTH = details.nth[details.nth.length - 1];

                // Set the NTH properties
                rootNTH.every = subtemplate.attrs['every'];
                rootNTH.at = subtemplate.attrs['at'];
                rootNTH.where = subtemplate.attrs['where'];

                // Process the "at" attrbiute further if its 0,1,2
                if ((rootNTH.at != undefined) && (rootNTH.at.indexOf(',') > -1)) {

                    // Split the indicies
                    var indicies = rootNTH.at.split(',');

                    // Set the first nth item
                    rootNTH.at = indicies[0];

                    // Loop over the other indicies pushing more NTH items
                    for (var iidx = 1; iidx < indicies.length; iidx++)
                        details.nth.push({ template: cloneTemplate(subtemplate), every: rootNTH.every, at: indicies[iidx], where: rootNTH.where });

                }

            }

        }

        // Create the "any" template
        details.any = cloneObject(template);

        // Establish the "host" property
        details.any.host = template;

        // Clear the sub-templates collection
        details.any.sub = {};

        // Remove ALL the "first", "last", "empty" and "nth" sub-templates
        for (var tid in template.sub) {

            // Access the sub-template
            var subtemplate = template.sub[tid];

            // Remove the "first", "last", "empty" and "nth" sub-template references
            if ((subtemplate.name == "first") || (subtemplate.name == "last") || (subtemplate.name == "empty") || (subtemplate.name == "nth")) {

                // Remove the sub-template key from the template text
                details.any.text = replaceAll(details.any.text, tid, '', true);

            }
            else {

                // Add the unrelated (not "first", "last", "empty" or "nth") sub-template
                details.any.sub[tid] = subtemplate;

            }

        }

        // Determine the template status
        if ((details.first != undefined) || (details.last != undefined) || (details.empty != undefined) || (details.nth.length > 0))
            details.hasTargets = true;
        else
            details.hasTargets = false;

        // Return
        return details;

    };

    // Select the template to use given the specified "for" loop details
    function selectForListTemplate(template, index, total, item) {

        // Generate the template details (if needed)
        if (template.details == undefined)
            template.details = makeForTemplateDetails(template);

        var res = undefined;

        // Check to see if there is any item targets
        if (template.details.hasTargets == true) {

            // Determine which item to use
            if ((template.details.first != undefined) && (index == 0))
                res = template.details.first;
            else if ((template.details.last != undefined) && (index == (total - 1)))
                res = template.details.last;
            else if ((template.details.empty != undefined) && (index == -1) && (total == 0))
                res = template.details.empty;
            else {

                // Loop over the NTH items
                for (var n = 0; n < template.details.nth.length; n++) {

                    // Handle the NTH "EVERY"
                    if ((template.details.nth[n].every != undefined) && ((index % template.details.nth[n].every) == 0)) {

                        // Handle "WHERE" filtering
                        if ((template.details.nth[n].where != undefined) && (testWhere(template, item, template.details.nth[n].where) == false))
                            continue;

                        // Assign the template
                        res = template.details.nth[n].template;

                        // Break
                        break;

                    }

                    // Handle NTH "AT"
                    if ((template.details.nth[n].at != undefined) && (index == template.details.nth[n].at)) {

                        // Handle "WHERE" filtering
                        if ((template.details.nth[n].where != undefined) && (testWhere(template, item, template.details.nth[n].where) == false))
                            continue;

                        // Assign the template
                        res = template.details.nth[n].template;

                        // Break
                        break;

                    }

                    // Handle NTH "WHERE"
                    if ((template.details.nth[n].where != undefined) && (testWhere(template, item, template.details.nth[n].where) == true)) {

                        // Assign the template
                        res = template.details.nth[n].template;

                        // Break
                        break;

                    }

                }

            }

        }

        // If the template was not found, use the "ANY" template so long as there ARE items
        if ((res == undefined) && (total > 0))
            res = template.details.any;

        // Return
        return res;

    };

    // Parse the specified "WITH" template into a processable template
    function makeWithTemplateDetails(template) {

        // Create the details object
        var details = { first: undefined, last: undefined, empty: undefined, nth: [] };

        // Loop over the sub-templates
        for (var tid in template.sub) {

            // Access the sub-template
            var subtemplate = template.sub[tid];

            // Establish the "host" property
            subtemplate.host = template;

            // Detarmine if the template is an item target
            if (subtemplate.name == "first")
                details.first = subtemplate;
            else if (subtemplate.name == "last")
                details.last = subtemplate;
            else if (subtemplate.name == "empty")
                details.empty = subtemplate;
            else if (subtemplate.name == "nth") {

                // Add the "nth" sub-template
                details.nth.push({ template: subtemplate, at: undefined });

                // Access the root NTH
                var rootNTH = details.nth[details.nth.length - 1];

                // Set the NTH properties
                rootNTH.at = subtemplate.attrs['at'];

                // Process the "at" attrbiute further if its 0,1,2
                if ((rootNTH.at != undefined) && (rootNTH.at.indexOf(',') > -1)) {

                    // Split the indicies
                    var indicies = rootNTH.at.split(',');

                    // Set the first nth item
                    rootNTH.at = indicies[0];

                    // Loop over the other indicies pushing more NTH items
                    for (var iidx = 1; iidx < indicies.length; iidx++)
                        details.nth.push({ template: cloneTemplate(subtemplate), at: indicies[iidx] });

                }

            }

        }

        // Return
        return details;

    };

    // Process the specified "IF" template
    function processIF(template) {

        var innerTemplate = null;

        // Test the "if" "condition"
        if (testCondition(template, template.view, template.attrs['condition']) == true) {

            // Clone the current template
            innerTemplate = cloneObject(template);

            // Create a clean sub-template collection
            innerTemplate.sub = {};

            // Remove ALL the "elseif" and "else" sub-templates
            for (var tid in template.sub) {

                // Access the sub-template
                var subtemplate = template.sub[tid];

                // Remove "elseif" and "else"
                if ((subtemplate.name == "elseif") || (subtemplate.name == "else")) {

                    // Clear the sub-template key
                    innerTemplate.text = replaceAll(innerTemplate.text, tid, '', true);

                }
                else {

                    // Add the unrelateed (not "elseif" or "else") sub-template
                    innerTemplate.sub[tid] = subtemplate;

                }

            }

        }
        else {

            var tests = [];

            // Collect all the "elseif"  and final "else" sub-templates
            for (var tid in template.sub) {

                // Access the sub-template
                var subtemplate = template.sub[tid];

                // Push in the proper order, "elseif" then final "else"
                if (subtemplate.name == "elseif")
                    tests.push(subtemplate);
                else if (subtemplate.name == "else") {

                    // Push
                    tests.push(subtemplate);

                    // Break
                    break;

                }

            }

            // Loop over the elseif(s) and else sub-templates
            for (i = 0; i < tests.length; i++) {

                // If the "ELSE" has been reached, exit
                if (tests[i].name == "else") {

                    // Set the template
                    innerTemplate = tests[i];

                    // Break
                    break;

                }

                // Test the "ELSEIF" condition(s)
                if (testCondition(template, template.view, tests[i].attrs['condition']) == true) {

                    // Set the template
                    innerTemplate = tests[i];

                    // Break
                    break;

                }

            }

        }

        // Return
        return ((innerTemplate != null) ? processTemplate(innerTemplate, template.view) : '');

    };

    // Process the specified "FOR" template
    function processFOR(template) {

        var res = '';

        // Select the collection
        var collection = selectCollection(template, template.view, template.attrs['each'], template.attrs['where']);

        // If there are items in the collection process, otherwise, process the "empty" sub-template
        if (collection.items.length > 0) {

            // Loop over the objects
            for (var oidx = 0; oidx < collection.items.length; oidx++) {

                // Access the item
                var oitem = collection.items[oidx];

                // Check the item state
                if ((oitem == null) || (oitem == undefined))
                    continue;

                // Access the item (as a string)
                var oitemStr = oitem.toString();

                // Determine the current "index"
                var idx = (((collection.names != undefined) && (collection.names.length > 0)) ? collection.names[oidx] : (oidx + 1).toString());

                // Determine the current value as a string
                var str = (((oitemStr != undefined) && (oitemStr != ({}).toString())) ? oitemStr : '');

                // Determine the template to use for the item
                var otmpl = selectForListTemplate(template, oidx, collection.items.length, oitem);

                // If a valid template was selected
                if (otmpl != undefined) {

                    // Establish the view "context"
                    var context = {
                        familyName: parseValueName(template.attrs['each'])
                    };

                    // Set the "index", "count" and "str" values
                    otmpl.index = idx;
                    otmpl.count = collection.items.length;
                    otmpl.str = str;

                    // Process the sub-template
                    res += processTemplate(otmpl, oitem, context);

                }

            }

        }
        else {

            // Determine the "empty" template (i.e. "index -1, item count 0" = "Empty")
            var otmpl = selectForListTemplate(template, -1, 0, null);

            // If there is an "empty" template
            if (otmpl != undefined) {

                // Set the "index", "count" and "str" values
                otmpl.index = -1;
                otmpl.count = 0;
                otmpl.str = '';

                // Process the sub-template
                res += processTemplate(otmpl, template.view);

            }

        }

        // Return
        return res;

    };

    // Process the specified "WITH" template
    function processWITH(template) {

        var res = '';

        // Select the collection
        var collection = selectCollection(template, template.view, template.attrs['in'], template.attrs['where']);

        // Generate the template details (if needed)
        if (template.details == undefined)
            template.details = makeWithTemplateDetails(template);

        // If there are items in the collection process, otherwise, process the "empty" sub-template
        if (collection.items.length > 0) {

            // Loop over the NTH items
            for (var nidx = 0; nidx < template.details.nth.length; nidx++) {

                // Access the NTH item
                var oitem = collection.at(template.details.nth[nidx].at);

                // Check the item state
                if ((oitem == null) || (oitem == undefined))
                    continue;

                // Access the item (as a string)
                var oitemStr = oitem.toString();

                // Determine the current "index"
                var idx = template.details.nth[nidx].at;

                // Determine the current value as a string
                var str = (((oitemStr != undefined) && (oitemStr != ({}).toString())) ? oitemStr : '');

                // Determine the template to use for the item
                var otmpl = template.details.nth[nidx].template;

                // Establish the view "context"
                var context = {
                    familyName: parseValueName(template.attrs['in'])
                };

                // Set the "index", "count" and "str" values
                otmpl.index = idx;
                otmpl.count = collection.items.length;
                otmpl.str = str;

                // Process the sub-template
                res += processTemplate(otmpl, oitem, context);

            }
        }
        else {

            // Access the "empty" template
            var otmpl = template.details.empty;

            // If there is a template
            if (otmpl != undefined) {

                // Set the "index", "count" and "str" values
                otmpl.index = -1;
                otmpl.count = 0;
                otmpl.str = '';

                // Process the sub-template
                res += processTemplate(otmpl, template.view);

            }

        }

        // Return
        return res;

    };

    // Process the specified "APPLY" template
    function processAPPLY(template) {

        // Parse the "to" object
        var obj = parseValue(template.view, template.attrs['to']);

        // If the object was NOT found, return the default
        if (obj == undefined)
            return '';

        // Establish the view "context"
        var context = {
            familyName: parseValueName(template.attrs['to'])
        };

        // Process the sub-template
        return processTemplate(template, obj, context);

    };

    // Parse a "sub-template" into a sub-template hierarchy
    function parseSubTemplate(parent, tzr, t) {

        var begin = 0;
        var end = 0;
        var token = t.text;

        // Create an "empty" template
        var template = {
            name: '',
            root: parent.root,
            parent: parent,
            view: undefined,
            text: '',
            attrs: {},
            sub: {}
        }

        // Parse the sub-template name

        // Move past the <
        if (token.charAt(begin) == "<")
            begin++;

        // Move past any whitespace
        while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
            begin++;

        // Collect the element name
        while ((begin < token.length) && (isID(token.charAt(begin)) == true))
            template.name += token.charAt(begin++);

        // Format the template name
        template.name = template.name.toLowerCase();

        // Parse the attributes
        while (begin < token.length) {

            var attr = '';

            // Move past any whitespace
            while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
                begin++;

            // If the end of the template was found, exit
            if ((token.charAt(begin) == "/") || (token.charAt(begin) == ">"))
                break;

            // Collect the attr name
            while ((begin < token.length) && (isID(token.charAt(begin)) == true))
                attr += token.charAt(begin++);

            // Format the attribute name
            attr = attr.toLowerCase();

            // Move past the whitespace
            while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
                begin++;

            // If we hit an =
            if (token.charAt(begin) == "=") {

                // Increment
                begin++;

                // Move past the whitespace
                while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
                    begin++;

                // If we hit a ' or "
                if ((token.charAt(begin) == "\"") || (token.charAt(begin) == "\'")) {

                    // Get the break
                    var brk = token.charAt(begin);

                    // Increment
                    begin++;

                    // Determine the end
                    end = token.indexOf(brk, begin);

                    // Add the attribute
                    template.attrs[attr] = (token.slice(begin, end)).trim();

                    // Increment past the end
                    begin = end + 1;

                }

            }

        }

        // If there is more template tokens to process
        if ((begin == token.length) || (token.charAt(begin) == ">")) {

            // Parse tokens until a closing element is found
            while (tzr.HasMoreTokens() == true) {

                // Get a token
                t = tzr.NextToken();

                // Determine if the token is the start of a new sub-template
                if (t.iskeyelement == true) {

                    // If this is the start of a new sub-template
                    if (t.isend == false) {

                        // Generate a new key
                        var key = '_k1_st_' + (template.root.baseid++).toString();

                        // Parse the sub-template
                        template.sub[key] = parseSubTemplate(template, tzr, t);

                        // Set the key as the token
                        t = { text: key, iskeyelement: false };

                    }
                    else
                        break;

                }

                // Concat the token
                template.text += t.text;

            }

        }

        // Return
        return template;

    };

    // Parse the "root-template" into the root template hierarchy
    function parseRootTemplate(template) {

        // Create the tokenizer
        var tzr = new TemplateTokenizer(template.pre);

        // Init the text member
        template.text = '';

        // Init the collection of sub-templates
        template.sub = {};

        // Parse the "raw" template into its component text and sub-templates
        while (tzr.HasMoreTokens() == true) {

            // Get a token
            var token = tzr.NextToken();

            // Determine if the token is the start of a new sub-template
            if (token.iskeyelement == true) {

                // Generate a new key
                var key = '_k1_st_' + (template.baseid++).toString();

                // Parse the sub-template
                template.sub[key] = parseSubTemplate(template, tzr, token);

                // Set the key as the token
                token = { text: key, iskeyelement: false };

            }

            // Concat the token
            template.text += token.text;

        }

        // Return
        return template;

    };

    // Pre-process the specified template, parsing embedded "properties", "scripts", "code" as well as
    // "conditions" and "where" elements.  Return a "root" template that is ready to process.
    function preProcessTemplate(template) {

        // Establish the template "lookup"
        template.properties = new Object();
        template.scripts = new Object();
        template.code = new Object();
        template.conditions = new Object();
        template.wheres = new Object();

        // Establish the pre-processed
        template.pre = template.raw;

        // Indexes used for parsing
        var begin, end;

        // Loop over all the script segements
        while ((begin = template.pre.indexOf('{{')) >= 0) {

            // Generate a new key
            var key = '_k1_' + (template.baseid++).toString();

            // Determine the end
            end = template.pre.indexOf('}}', begin);

            // Extract the script
            var script = template.pre.slice(begin, end + 2);

            // Return the string with the item replaced
            template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 2)].join('');

            // Add the property into the lookup
            template.scripts[key] = minorHTMLDecode(script.trim());

        }

        // Init the begin
        begin = 0;

        // Loop over all the property segments
        while ((begin = template.pre.indexOf('[', begin)) >= 0) {

            // Determine the end
            end = template.pre.indexOf(']', begin);

            // Extract the property
            var property = template.pre.slice(begin, end + 1);

            // If the porperty name is not a sequence of digits (array index)
            if (isDigits(property.substring(1, property.length - 1).trim()) == false) {

                // Generate a new key
                var key = '_k1_' + (template.baseid++).toString();

                // Return the string with the item replaced
                template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 1)].join('');

                // Add the property into the lookup
                template.properties[key] = property.trim();

            }
            else {

                // Increment the begin
                begin = end;

            }

        }

        // Loop over all the free-code segments
        while ((begin = template.pre.indexOf('{')) >= 0) {

            // Generate a new key
            var key = '_k1_' + (template.baseid++).toString();

            // Determine the end
            end = template.pre.indexOf('}', begin);

            // Extract the property
            var code = template.pre.slice(begin, end + 1);

            // Return the string with the item replaced
            template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 1)].join('');

            // Add the property into the lookup
            template.code[key] = minorHTMLDecode(code.trim());

        }

        // Define parse function
        this.parsePropCodes = function (name) {

            var codes = new Object();

            begin = 0;

            // Loop over all the condition=
            while ((begin = template.pre.indexOf(name, begin)) >= 0) {

                // Move past the whitespace
                while ((isWhitespace(template.pre.charAt(begin)) == false) && (template.pre.charAt(begin) != "="))
                    begin++;

                // Move past the whitespace
                while (isWhitespace(template.pre.charAt(begin)) == true)
                    begin++;

                // If we hit an =
                if (template.pre.charAt(begin) == "=") {

                    // Increment
                    begin++;

                    // Move past the whitespace
                    while (isWhitespace(template.pre.charAt(begin)) == true)
                        begin++;

                    // If we hit a ' or "
                    if ((template.pre.charAt(begin) == "\"") || (template.pre.charAt(begin) == "\'")) {

                        // Get the break
                        var brk = template.pre.charAt(begin);

                        // Increment
                        begin++;

                        // Determine the end
                        end = template.pre.indexOf(brk, begin);

                        // Generate a new key
                        var key = '_k1_' + (template.baseid++).toString();

                        // Extract the snippet
                        var code = template.pre.slice(begin, end);

                        // Return the string with the item replaced
                        template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end)].join('');

                        // Add the property into the lookup
                        codes[key] = minorHTMLDecode(code.trim());

                    }

                }

            }

            // Return
            return codes;

        }

        // Replace "condition" and "where"
        template.conditions = this.parsePropCodes("condition");
        template.wheres = this.parsePropCodes("where");

        // Return
        return template;

    };

    // Open a "root" template, transforming the top level template text into a processable template object.
    function openRootTemplate(tmp, tio) {

        // Create an "empty" template
        var template = {
            tio: tio,
            baseid: (new Date()).getTime(),
            name: 'root',
            raw: undefined,
            pre: undefined,
            root: undefined,
            parent: undefined,
            view: undefined,
            text: '',
            sub: {}
        }

        // Set the root "root"
        template.root = template;

        // Establish the pattern thhat identifies "id" from "raw" temlate
        var pattern = /^[a-z0-9]+$/i;

        // Establish the "raw" template - "id" may be a reference to a "template" located in the DOM or raw HTML template text
        if (pattern.test(tmp) == true)
            template.raw = tio.Read(tmp);
        else
            template.raw = tmp;

        // Pre-Proccess the template
        template = preProcessTemplate(template);

        // Parse the template
        template = parseRootTemplate(template);

        // Return
        return template;

    };

    // Bind the specified "model" object together with the embedded "script" code to generate the "view" object
    function bindView(scripts, model, template, context) {

        // Fully establish the "context"
        if ((context == undefined) || (context == null))
            context = {};

        // The "Root" super-parent of the entire hierarchy
        context.Root = (template.root != undefined) ? template.root.view : undefined;

        // The "Parent" of the item
        context.Parent = (template.parent != undefined) ? template.parent.view : undefined;

        // The "Parents" array containing the list of all parents in the hierarchy
        if ((template.parent != undefined) && (template.parent.view != undefined) && (template.parent.view.Parents != undefined)) {
            context.Parents = copyArray(template.parent.view.Parents);
            context.Parents.push(template.parent.view);
        }
        else
            context.Parents = [];

        // The result view
        var view = context;

        // If the template has yet to parse the binding info, do it!
        if (template.bindings == undefined) {

            // Create the "bindings" collection
            template.bindings = [];

            // Loop over the scripts
            for (var scriptID in scripts) {

                // If the text contains the script,
                if (template.text.indexOf(scriptID) >= 0) {

                    // Add to the bindings
                    template.bindings.push(scriptID);

                    // Replace the script references with ''
                    template.text = replaceAll(template.text, scriptID, '', true);

                }

            }

        }

        // Merge the "model" into the "view"
        view = mergeObjects(view, model);

        // Clear any prior "ready" function
        view.Ready = undefined;

        // Loop over the bindings
        for (var bi = 0; bi < template.bindings.length; bi++) {

            // Get the binnding
            var scriptID = template.bindings[bi];

            // Establish the extension
            var extension = scripts[scriptID];

            // Trim the outer { and } and whitespace
            extension = extension.substring(2, extension.length - 2).trim();

            // Wrap the extension into a function return value
            extension = 'return {' + extension + '}';

            // Parse the extension into an object
            view = mergeObjects(view, (new Function(extension)).call(view));

        }

        // The "Family" context object that host property accessors for each "each" along the hierarchy
        if ((view.familyName != undefined) && (view.familyName != null) && (template.parent != undefined)) {

            // Process the "depluralize" setting
            if ((Kruntch.depluralize == true) && (view.familyName.charAt(view.familyName.length - 1) == 's'))
                view.familyName = view.familyName.substring(0, view.familyName.length - 1);

            // Establish the family (make a context-specific copy)
            view.Family = (template.parent.view.Family != undefined) ? mergeObjects({}, template.parent.view.Family) : {};
            view.Family[view.familyName] = view;

        }
        else if (view.Family == undefined)
            view.Family = {};

        // Return
        return view;

    };

    // Process the specified "template" against the specified "model"
    function processTemplate(template, model, context) {

        // Establish the current "view" model
        template.view = bindView(template.root.scripts, model, template, context);

        // If there is "host" template ("for" and "with" templates), set the host view value as well
        if (template.host != undefined)
            template.host.view = template.view;

        // Copy the template text
        var text = template.text.toString();

        // Loop over the sub-templates of this template
        for (var tid in template.sub) {

            // The result text
            var result = '';

            // Acces the sub-template
            var subtemplate = template.sub[tid];

            // Set the view object
            subtemplate.view =  template.view;

            // Process the construct node types
            if (subtemplate.name == "if")
                result = processIF(subtemplate);
            else if (subtemplate.name == "for")
                result = processFOR(subtemplate);
            else if (subtemplate.name == "with")
                result = processWITH(subtemplate);
            else if (subtemplate.name == "apply")
                result = processAPPLY(subtemplate);

            // Replace the generated text
            text = replaceAll(text, tid, result, true);

        }

        // Loop over the "code" snipptes processing
        for (var codeID in template.root.code) {

            // If the text contains the code,
            if (text.indexOf(codeID) >= 0) {

                // Access the "code"
                var code = template.root.code[codeID];

                // Trim the { and }
                code = code.substring(1, code.length - 1);

                // Replace with the value
                text = replaceAll(text, codeID, (new Function(code)).call(template.view), true);

            }

        }

        // Loop over the "property" processing
        for (var propertyID in template.root.properties) {

            // If the text contains the property,
            if (text.indexOf(propertyID) >= 0) {

                // Access the "property"
                var property = template.root.properties[propertyID];

                // Trim the [ and ] and whitespace
                property = property.substring(1, property.length - 1).trim();

                // Replace with the value
                if (property == "#")
                    text = replaceAll(text, propertyID, template.index, true);
                else if (property == "##")
                    text = replaceAll(text, propertyID, template.count, true);
                else if (property == "$")
                    text = replaceAll(text, propertyID, template.str, true);
                else
                    text = replaceAll(text, propertyID, parseValue(template.view, property), true);

            }

        }

        // Return
        return text;

    };

    // Process the specified "root" template against the specified "model" and optionally send the
    // HTML output to the innerHTML member of the specified "to" node
    function processRoot(id, model, tio) {

        // Open the template
        var template = openRootTemplate(id, tio);

        // Process the template
        var text = processTemplate(template, model);

        // If the "to" instance was specified, "append"
        if ((tio != undefined) && (tio != null))
            tio.Write(id, text);

        // Run any specified "Ready" function
        if (template.view.Ready != undefined)
            template.view.Ready.call(template.view);

        // Return
        return text;

    };

    // Public Member Functions

    // Settings
    Kruntch.depluralize = true;

    // Apply the specified "template" to the specified "model" and return the resultant HTML (or also set the HTML to the innerHTML of the specified "to" HTML node)
    Kruntch.Apply = function (id, to, out, succeeded, failed) {

        var res = '';

        try {

            // Process "synch"
            res = processRoot(id, to, new TemplateIO(out));

            // Call the succeeded handler
            if (succeeded != undefined)
                succeeded(res);

        }
        catch (e)
        {

            // Call the failed handler
            if (failed != null)
                failed(e);

        }

        // Return
        return res;

    };

    // Apply the specified "template" to the specified "model" and return the resultant HTML (or also set the HTML to the innerHTML of the specified "to" HTML node)
    Kruntch.ApplyAsynch = function (id, to, out) {

        // Return a javascript "promise"
        return new Promise(function (resolve, reject) {

            // Clear the stack
            window.setTimeout(function ()  {

                // Call the synch "apply"
                Kruntch.Apply(
                    id,
                    to,
                    out,
                    resolve,
                    reject
                );

            }, 1);

        });

    };

    // Bind the specified "template" to the specified "model" and return the resultant "view" object
    Kruntch.Bind = function (id, model) {
        var template = openRootTemplate(id, new TemplateIO(document, {}));
        return bindView(template.root.scripts, model, template);
    };

} (window.Kruntch = window.Kruntch || {}));

var Draggable = function(hostObject, options){
    this.initialize(hostObject, hostObject.onDragConfigure ?
            hostObject.onDragConfigure():
            options
    );
};


Draggable.prototype = {
    initialize : function (hostObject,options) {
        var self=this;
        this.onMoveHandler      = this.onMoveHandler.bind(this);
        this.onEndHandler       = this.onEndHandler.bind(this);
        this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
        this.onLongHoldHandler  = this.onLongHoldHandler.bind(this);
        this.setElement(hostObject);
        this.setOptions(options);
        this.setMethods();
        this.enable();
    },
    
    onMove : function(e){
        var target = e.data.target;
        var x = e.data.offsetX;
        var y = e.data.offsetY;
        e.target.classList.add("positioned");
        target.style.left = x + "px";
        target.style.top  = y + "px";
    },
    
    onPress         : function(e) {},
    
    onTapHold       : function(e) {},
    
    onDragEnd       : function(e) {
        this.dnd.element.classList.remove("dragging");
    },
    
    onCancelDrag    : function(e) {},
    
    onGrabHold      : function(e) {},
    
    onDragStart : function(e){
        var bounds = this.dnd.getBoundingClientRect(this.dnd.element);
        var draggable = e.data.target;
            draggable.style.left = bounds.left + "px";
            draggable.style.top = bounds.top + "px";
        document.body.appendChild(draggable);
        this.dnd.element.classList.add("dragging");
    },
    
    getDragTarget   : function(e) {
        var target=this.element;
        if(this.options.ghosting){
            target = this.element.cloneNode(true);
            target.classList.add("Ghost");
        }
        return target;
    },
    
    setMethods      : function(){
        this.component.dnd = this; 
        this.element.dnd = this;  
    },
    
    getHandle : function(){
        var handleStr = this.options.draghandle;
        return this.element.querySelector(handleStr)||this.element;
    },
    
    enable : function(){
        var target = this.getHandle();
        target.addEventListener("mousedown", this.onMouseDownHandler, false);
        target.addEventListener("touchstart", this.onMouseDownHandler, false);
    },
    
    disable : function(force){
        document.removeEventListener("mousemove", this.onMoveHandler, false);
        document.removeEventListener("touchmove", this.onMoveHandler, false);
        document.removeEventListener("mouseup",   this.onEndHandler,  false);
        document.removeEventListener("touchend",   this.onEndHandler,  false);
        if(this.options.disposeOnRelease||force==true){
            var target = this.getHandle();
            target.removeEventListener("mousedown",   this.onMouseDownHandler,  false);
            target.removeEventListener("touchstart",  this.onMouseDownHandler,  false);
        }
    },
    
    setOptions : function(options){
        options=options||{};
        this.options={
            ghosting:           (this.element.getAttribute("ghosting")=="false")?false:true,
            holdtodrag:         (this.element.getAttribute("holdtodrag")=="true")?true:false,
            holdtiming:         parseInt(this.element.getAttribute("holdtiming"))||1000,
            holdSensitivity:    parseInt(this.element.getAttribute("holdSensitivity"))||50,
            gridsize:           parseInt(this.element.getAttribute("gridsize"))||100,
            snaptogrid:         (this.element.getAttribute("snaptogrid")=="true")?true:false,
            sticky:             (this.element.getAttribute("sticky")=="true")?true:false,
            disposeOnRelease:false,
            positionable:true,
            draghandle:        this.element.getAttribute("draghandle")
        };
        
        this.extend(this.options,options);
        var component       = this.component; 
        this.onPress        = (this.options.onPress||component.onPress||this.onPress).bind(component);
        this.onTapHold      = (this.options.onTapHold||component.onTapHold||this.onTapHold).bind(component);
        this.onMove         = (this.options.onMove||component.onMove||this.onMove).bind(component);
        this.onCancelDrag   = (this.options.onCancelDrag||component.onCancelDrag||this.onCancelDrag).bind(component);
        this.onGrabHold     = (this.options.onGrabHold||component.onGrabHold||this.onGrabHold).bind(component);
        this.onDragEnd      = (this.options.onDragEnd||component.onDragEnd||this.onDragEnd).bind(component);
        this.onDragStart    = (this.options.onDragStart||component.onDragStart||this.onDragStart).bind(component);
        //this.onGhostDragStart = (this.options.onGhostDragStart||component.onGhostDragStart||this.onGhostDragStart).bind(component);
        this.onMovePosition = (this.options.onMovePosition||component.onMovePosition||this.onMovePosition).bind(component);
        this.onRevertPosition = (this.options.onRevertPosition||component.onRevertPosition||this.onRevertPosition).bind(component);
    },
    
    onRevertPosition : function(){},
    
    onMovePosition : function(e){
        var left = e.data.left;
        var top = e.data.top;
        e.target.classList.add("positioned");
        e.target.style.left = left +"px";
        e.target.style.top  = top  +"px";
    },
    
    
    onMouseDownHandler : function(e){
        //e.preventDefault();
        var self        = this;
        var coords      = this.getMouseCoordinates(e)[0];
        this.startTime  = new Date().getTime();
        this.bounds     = this.getBoundingClientRect(this.element);
        this.startX     = coords.pageX;
        this.startY     = coords.pageY;
        this.deltaX     = 0;
        this.deltaY     = 0;
        this.lastVX     = coords.pageX;
        this.lastVY     = coords.pageY;
        this.canMove    = false;
        this.hasMoved   = false;
        this.isDragging = false;
        this.target     = this.getDragTarget();
        var eventdata   = {
            component:this,
            target:this.target,
            startX:this.startX,
            startY:this.startY,
            deltaX:this.deltaX,
            deltaY:this.deltaY,
            draggable:this.component,
            originalEvent:e
        };
        var pressevent  = this.dispatchEvent("pressed",  true,  true,  eventdata);
        var cancelevt   = this.createEvent("canceldrag", true,  true,  eventdata);
        
        if(!pressevent.defaultPrevented){
            this.onPress(pressevent);
            if(pressevent.defaultPrevented){
                this.element.dispatchEvent(cancelevt);
                this.onCancelDrag(cancelevt);
                return;
            };
            
            document.addEventListener("mousemove", this.onMoveHandler, false);
            document.addEventListener("touchmove", this.onMoveHandler, false);
            document.addEventListener("mouseup",   this.onEndHandler,  false);
            document.addEventListener("touchend",  this.onEndHandler,  false);
            this.longClickTimer = setTimeout(this.onLongHoldHandler,this.options.holdtiming);
        } 
        else {
            this.element.dispatchEvent(cancelevt);
            this.onCancelDrag(cancelevt);
        }
    },
    
    isDraggable : function(deltaX,deltaY){
        if(this.options.holdtodrag){
            return this.canMove;
        } else {
            var delta  = this.options.gridsize;
            var sticky = this.options.sticky;
            if(!sticky){
                return true;
            }
            else{
                return Math.abs(deltaX) > delta || Math.abs(deltaY) > delta; //|| this.canMove;
            }
        }
    },
    
    onLongHoldHandler : function(){
        var self=this;
        var evt = self.dispatchEvent("taphold", true, true, {component:self});
        if(!evt.defaultPrevented){
            self.onTapHold(evt);
            if(evt.defaultPrevented){return;}
            if(self.options.holdtodrag){
                var delta = self.options.holdSensitivity;
                if(Math.abs(self.deltaX) < delta && Math.abs(self.deltaY) < delta){
                    self.canMove=true;
                    var grabevt = self.dispatchEvent("grabhold", true, true, {component:self});
                    if(!grabevt.defaultPrevented){
                        self.onGrabHold(evt);
                    }
                }
            }
        }
   },
    
    onMoveHandler : function(e) {
        e.preventDefault();
        var self    = this;
        var coords  = this.getMouseCoordinates(e)[0];
        this.deltaX = coords.pageX-this.startX;
        this.deltaY = coords.pageY-this.startY;
        this.vx     = coords.pageX - this.lastVX;
        this.vy     = coords.pageY - this.lastVY;
        this.lastVX = coords.pageX;
        this.lastVY = coords.pageY;
        
        if (this.isDraggable(self.deltaX,self.deltaY)) {
            clearTimeout(this.longClickTimer);
            if(!this.isDragging){
                this.isDragging  = true;
                this.hasMoved    = true;
                if(self.options.autoz){
                    this.target.style.zIndex=self.getHighestZindex();
                }
                var dragStartevt = this.dispatchEvent(
                    "dragstart", true, true, { 
                    deltaX  : self.deltaX,
                    deltaY  : self.deltaY,
                    pageX   : coords.pageX,
                    pageY   : coords.pageY,
                    startX  : this.startX,
                    startY  : this.startY,
                    target  : this.target,
                    originalEvent:e,
                    component:this.component,
                });
                if(!dragStartevt.defaultPrevented){
                    this.onDragStart(dragStartevt);
                }
            }
            //window.requestAnimationFrame(function(time){
                if(!self.target){return;}//raf timing bug
                var newcoords = {
                    x : self.bounds.left + self.deltaX, 
                    y : self.bounds.top  + self.deltaY,
                    snapX : self.deltaX,
                    snapY : self.deltaY,
                };
                if(self.options.snaptogrid){
                    self.onSnapToGrid(newcoords);
                }
                
                var dragevt = self.dispatchEvent(
                    "dragging", true, true, { 
                    deltaX  : self.deltaX,
                    deltaY  : self.deltaY,
                    offsetX : newcoords.x,
                    offsetY : newcoords.y,
                    vx      : self.vx,
                    vy      : self.vy,
                    pageX   : coords.pageX,
                    pageY   : coords.pageY,
                    startX  : self.startX,
                    startY  : self.startY,
                    target  : self.target,
                    originalEvent:e,
                    component:self.component,
                });
                //TODO: dispatchEvent(dragevt) here so that it can be canceled 
                (!dragevt.defaultPrevented) ?
                    self.onMove(dragevt):
                    self.onCancelDrag(dragevt);
            //},self.target);
        }
    },
    
    onEndHandler : function(e) {
        //e.preventDefault();
        clearTimeout(this.longClickTimer);
        this.canMove    = false;
        this.isDragging = false;
        this.disable(e);
        
        var coords  = this.getMouseCoordinates(e)[0];
        var distX   = coords.pageX - this.startX;
        var distY   = coords.pageY - this.startY;
        var elapsedTime = new Date().getTime() - this.startTime;
        var allowedTime = 300;
        var restraint = 100;
        var threshold = 10;
        
        var swipeDir="none";
        
        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                swipeDir = (distX < 0)? 'left' : 'right'
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipeDir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
           
        var ghostBounds = this.getBoundingClientRect(this.target);
        if(this.options.ghosting && this.hasMoved){
            try{this.target.parentNode.removeChild(this.target);}
            catch(e){}
        } 
        
        if(this.options.positionable){
            var positionMovedEvt = this.dispatchEvent(
                "moveposition", 
                true, true, {
                component:this.component, 
                originalEvent:e, 
                left:ghostBounds.left,
                top:ghostBounds.top
            });
            if(!positionMovedEvt.defaultPrevented){
                this.onMovePosition(positionMovedEvt);
            }   
        } else {
            this.onRevertPosition(e);
        }
        var endevnt = this.dispatchEvent(
            "enddrag", true, true, {
            component:this.component, 
            vx:this.vx,
            vy:this.vy,
            swipedir:swipeDir,
            elapsedTime:elapsedTime,
            distX:distX,
            distY:distY,
            originalEvent:e
        });
        this.onDragEnd(endevnt);
    },
    
    onSnapToGrid : function(coords,gridSize){
        gridSize = gridSize||this.options.gridsize;
        coords.x = gridSize * Math.round(coords.x/gridSize);
        coords.y = gridSize * Math.round(coords.y/gridSize);
        coords.snapX = gridSize * Math.round(coords.snapX/gridSize);
        coords.snapY = gridSize * Math.round(coords.snapY/gridSize);
        return coords;
    },
    
    getMouseCoordinates : function( event )
    {
        event = event || window.event;
        if(!('ontouchstart' in window) || !('createTouch' in document)) {
            
            return [{
                pageX: event.pageX || (event.clientX + (document.body.scrollLeft||0) + (document.documentElement.scrollLeft||0)),
                pageY: event.pageY || (event.clientY + (document.body.scrollTop||0)  + (document.documentElement.scrollTop||0))
            }];
        }
        else {
            var pos = [], evt, touches;
            touches = (event.touches.length<=0)?event.changedTouches:event.targetTouches;
            for(var t=0, len=touches.length; t<len; t++) {
                evt = touches[t];
                pos.push({ pageX: evt.pageX, pageY: evt.pageY });
            }
            return pos;
        }
    },
    
    getBoundingClientRect : function(element) {
        element = element||this.element;
        if (element.getBoundingClientRect) {
            // (1)
            var box = element.getBoundingClientRect();
            
            var body    = document.body;
            var docElem = document.documentElement;
            
            // (2)
            var scrollTop   = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft  = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            
            // (3)
            var clientTop   = docElem.clientTop || body.clientTop || 0;
            var clientLeft  = docElem.clientLeft || body.clientLeft || 0;
            
            // (4)
            var top  = box.top  + (scrollTop  - clientTop);
            var left = box.left + (scrollLeft - clientLeft);
            
            return { 
                top: Math.round(top), 
                left: Math.round(left),
                right:  Math.round(box.right),
                bottom:  Math.round(box.bottom),
                width : Math.round(box.right - left),
                height: Math.round(box.bottom - top)
            };
        }
        else {
            //console.warn(this.namespace + "#getBoundingClientRect() - not supported by 'this.element' node on this device.")
            var top=0, left=0, right=0, bottom=0, width=0, height=0;
            while(element) {
                top  = top  + parseInt(element.offsetTop, 10);
                left = left + parseInt(element.offsetLeft,10);
                right = left + element.offsetWidth;
                bottom = top + element.offsetHeight;
                width = element.offsetWidth;
                height = element.offsetHeight;
                element = element.offsetParent;       
            };
            return {top: top, left: left, right:right, bottom:bottom, width:width, height:height};
        }
    },
    
    insertAfter : function(newNode, refNode) {
        var el = refNode||this.element;
        return el.parentNode.insertBefore(newNode, this.nextSibling(el));
    },
    
    nextSibling: function(element, elementOnly){
        element = element || this.element;
        element = element.nextSibling;
        if(elementOnly) {
            while (element && element.nodeType != 1) {
                element = element.nextSibling;
            }
        }
        return element;
   },
   
   dispatchEvent : function(type, bubbles, cancelable, eventdata, element){
        element     = element||this.element;
        bubbles     = (typeof bubbles    == "boolean") ? bubbles    : true;
        cancelable  = (typeof cancelable == "boolean") ? cancelable : true;
        var evt     = document.createEvent("Event");
        evt.initEvent(type, bubbles, cancelable);
        evt.data    = eventdata;
        
        element.dispatchEvent(evt);
        return evt;
   },
   

   addEventListener : function(type, callback, capture, element) {
        capture = ( typeof capture == "boolean") ? capture : false;
        element = element || this.element;
        if (callback && !callback.isBound) {
            callback = callback.bind(this);
        }

        return element.addEventListener(type, callback, capture);
    },

   
   createEvent : function(type, bubbles, cancelable, eventdata){
        bubbles     = (typeof bubbles    == "boolean") ? bubbles    : true;
        cancelable  = (typeof cancelable == "boolean") ? cancelable : true;
        var evt     = document.createEvent("Event");
            evt.initEvent(type, bubbles, cancelable);
            evt.data= eventdata;
        return evt;
    },
   
   extend : function(destination, source){
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
   },
   
   setElement : function(hostObject){
        var el = hostObject.element||hostObject;
        if(!el || el.nodeType != 1) {
            throw new Error("Draggable.prototype#setElement(host) - expected argument [host] or [host.element] \
            to be of type Node (where nodeType == 1).");
        }
        el.dnd=this;
        this.element   = el;
        this.component = hostObject;
        return el;
    },
    
    globalzindex : 600000,
    
    getHighestZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    }
};

function abbrNum(number, decPlaces) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
};

namespace("core.tools.Ascii");
core.tools.Ascii = {
	encode : function(str){
		// check to see if param is a string
		if (typeof str == 'string' || str instanceof String) {
			//console.log("encoding data");
			//return (str + '').replace(/'/g, "&#39;").replace(/\\/g, "&#92;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;").replace(/=/g, "&#61;");
			return (str + '').replace(/'/g, "&#39;").replace(/\\/g, "&#92;").replace(/\(/g, "&#40;").replace(/\)/g, "&#41;");
			// Replace symbols with ASCII equivalent
			// Symbols: ' \ ( ) =
		} else {
			console.log("Cannot encode, it's not a string");
		}
    },
	encodeHtml : function(str){
		// check to see if param is a string
		if (typeof str == 'string' || str instanceof String) {
			//console.log("encoding data");
			return (str + '').replace(/</g, "&#60;").replace(/>/g, "&#62;");
			// Replace symbols with ASCII equivalent
			// Symbols: ' \ ( ) =
		} else {
			console.log("Cannot encode, it's not a string");
		}
    },
	decode : function(str){
		if (typeof str == 'string' || str instanceof String) {
			//console.log("decoding data");
			return (str + '').replace(/&#39;/g, "'").replace(/&#92;/g, "\\").replace(/&#40;/g, "(").replace(/&#41;/g, ")").replace(/&#61;/g, "=").replace(/&#60;/g, "<").replace(/&#62;/g, ">");
		} else {
			console.log("Cannot decode, it's not a string");
		}
    }
};	

namespace("core.http.Router", {
    initialize : function(){
        this.routes = {};    
    },
    
    add : function(key, handler){
        this.routes[key] = handler;
    },
    
    contains : function(route){
        return this.routes[route];
    },
    
    
    
    resolve : function(href,matches) {
        if(typeof href == "string" && href.indexOf("$.") == 0){
             var exp = new Function("$", "return " + href);
             href = exp(ROUTES)||href;
        }
        if ( typeof href == "object") {
            return this.resolve_object(href)
        } else {
            for (var regex in this.routes) {
                var entry = this.routes[regex]
                if ( typeof entry == "string") {
                    var exp = new RegExp(regex);
                    var matches = href.match(exp);
                    if (matches && matches.length > 0) {
                        var val = this.routes[regex];
                        if ( typeof val == "function") {
                            return val(href, matches);
                        } else {
                            return val;
                        }
                    }
                }
            }

            return href;
        }
    },

    
    resolve_object : function(OBJ){
        if(OBJ){
            if(!OBJ[appconfig.environment]){
                console.error("No URI/Route defined for: " + appconfig.environment, OBJ)
            }
            return OBJ[appconfig.environment];
        }
        return false;
    },
    
    getParameterSeperator : function(url){
        var sep = (url.indexOf("?")>=0)?"&":"?";
    }
}); 


core.http.UrlRouter = new core.http.Router;
/*core.http.UrlRouter.add("/artist\\?([a-z]+)", function(e, matches){
    //console.log(matches);
    return "resources/data/test.txt"
});
core.http.UrlRouter.add("apps/Desktop/main.js", function(e, matches){
    //console.log(matches);
    return "apps/Desktop/main.js"
});*/

/*********************************************************************
 ::USAGE::
    Abstract class -- not to be used by developers directly. Instead, subclasses
    of this class should be used: Example, see: <<core.http.XMLHttpRequest>>
 **********************************************************************/


namespace("core.http.ResourceLoader", {
    open : function(method, path , async){
        console.info("calling core.http.ResourceLoader with url: ", path)
        var resolvedUrl = core.http.UrlRouter.resolve(path);
        console.log("core.http.ResourceLoader resolved", path, " to " + resolvedUrl)

        return resolvedUrl||path;
    },
    
    send : function(){
        
    },
    
    getDefaultMethod : function(meth){
        /*var method = "GET";
        if(appconfig.environment == "dev"){
            method = "GET"
        }
        else {
            method = meth||"POST"
        }
        return method;*/
        meth = meth||"GET";
        return meth;
    },
    
    getParameterSeperator : function(url){
        var sep = (url.indexOf("?")>=0)?"&":"?";
        return sep;
    }
});

/*********************************************************************
 ::USAGE::
    Abstract class -- not to be used by developers directly. Instead, subclasses
    of this class should be used: Example, see: <<core.http.XMLHttpRequest>>
 **********************************************************************/


namespace("core.http.ResourceLoader", {
    open : function(method, path , async){
        console.info("calling core.http.ResourceLoader with url: ", path)
        var resolvedUrl = core.http.UrlRouter.resolve(path);
        console.log("core.http.ResourceLoader resolved", path, " to " + resolvedUrl)

        return resolvedUrl||path;
    },
    
    send : function(){
        
    },
    
    getDefaultMethod : function(meth){
        /*var method = "GET";
        if(appconfig.environment == "dev"){
            method = "GET"
        }
        else {
            method = meth||"POST"
        }
        return method;*/
        meth = meth||"GET";
        return meth;
    },
    
    getParameterSeperator : function(url){
        var sep = (url.indexOf("?")>=0)?"&":"?";
        return sep;
    }
});


namespace("core.http.ClassLoader", 
{
    '@inherits': core.http.ResourceLoader,
    
    initialize : function(){
        this.readyState = 0;
        this.status     = null;
        this.statusText = null;
        this.headNode   = document.getElementsByTagName("head").item(0);
    },
    
    open : function( iMethod, iURL, iAsync) {
        var url = this.parent(iMethod, iURL , iAsync);
        this.method = "GET";
        this.URL    = url;
    },
    
    send : function() {
        this.script = this.createScript(this.URL);
        var self            = this;
        var onLoad          = function() {
            self.status     = 200;
            self.statusText = "OK";
            self.readyState = 4;
            if (self.onreadystatechange) {
                self.onreadystatechange();
            }
        }
        var onReadyStateChange = function( iEvent ) {
            var e = (iEvent?iEvent:window.event).target?(iEvent?iEvent:window.event).target:(iEvent?iEvent:window.event).srcElement;
            if (e.readyState === "loaded" || e.readyState === "complete") {
                onLoad();
            }
        }
        if (navigator.product === "Gecko") {
            this.script.onload = onLoad;
        }
        else {
            this.script.onreadystatechange = onReadyStateChange;
        }
        
        this.headNode.appendChild(this.script);
        this.readyState = 1;
        if (this.onreadystatechange) {
            this.onreadystatechange(self);
        }
    
    },
    
    createScript : function(_src){
        var head   = document.getElementsByTagName("head").item(0);
        var scripts = head.getElementsByTagName("script");
        var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", (config.charset || "utf-8"));
            script.setAttribute("src", _src);
            return script;
    }
});


/*********************************************************************
 ::USAGE::
 
    var c = new core.http.ClassLoader();
    c.open("GET", "apps/Desktop/main.js");
    c.onreadystatechange = function(){
        if(this.readyState == 4){
            alert(apps.Desktop) //apps.Desktop object should exist
        }
    }
    
    c.send();
 **********************************************************************/



namespace("core.http.XMLHttpRequest", {
    '@inherits': core.http.ResourceLoader,
    
    
    initialize : function(){
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        return this;
    },
    
    addEventListener : function(type, handler, capture){
        capture = (typeof capture == "boolean") ? capture:false;
        this.oXMLHttpRequest.addEventListener(type, handler, capture);
    },
    
    open : function(method, path , async){
        this.method = method||this.getDefaultMethod();
        var url = this.parent(this.method, path , async);
        if(this.method.toLowerCase() == "get"){
            url = url + this.getParameterSeperator(url) + (this.params?toQueryString(this.params):"");
        }

        this.oXMLHttpRequest.open(this.method, url, ((typeof async == "boolean")?async:true));
    },
    
    setRequestHeader : function(prop, value){
        //oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
        if(prop && value){
            this.oXMLHttpRequest.setRequestHeader(prop, value);
        }    
    },
    
    send : function(data){
        var parsedString="";
        if(this.method.toLowerCase()=="post"){
            if(data && typeof data == "object"){
                parsedString = JSON.stringify(data)
            }
            else{
                parsedString=data;
            }
        }
        this.oXMLHttpRequest.send(parsedString);
    },
    
    onstatechange : function(){
        this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },
    
    onreadystatechange : function(){}
});


/*********************************************************************
 ::USAGE::
 
    var  oXMLHttpRequest = new core.http.XMLHttpRequest;
         oXMLHttpRequest.open("GET", "apps/Sample/main.js", true);
         oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
         oXMLHttpRequest.onreadystatechange  = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                console.log(this.responseText)
            }
         }
         oXMLHttpRequest.send(null);
 **********************************************************************/



namespace("core.http.XMLHttpRequest", {
    '@inherits': core.http.ResourceLoader,
    
    
    initialize : function(){
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        return this;
    },
    
    addEventListener : function(type, handler, capture){
        capture = (typeof capture == "boolean") ? capture:false;
        this.oXMLHttpRequest.addEventListener(type, handler, capture);
    },
    
    open : function(method, path , async){
        this.method = method||this.getDefaultMethod();
        var url = this.parent(this.method, path , async);
        if(this.method.toLowerCase() == "get"){
            url = url + this.getParameterSeperator(url) + (this.params?toQueryString(this.params):"");
        }

        this.oXMLHttpRequest.open(this.method, url, ((typeof async == "boolean")?async:true));
    },
    
    setRequestHeader : function(prop, value){
        //oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
        if(prop && value){
            this.oXMLHttpRequest.setRequestHeader(prop, value);
        }    
    },
    
    send : function(data){
        var parsedString="";
        if(this.method.toLowerCase()=="post"){
            if(data && typeof data == "object"){
                parsedString = JSON.stringify(data)
            }
            else{
                parsedString=data;
            }
        }
        this.oXMLHttpRequest.send(parsedString);
    },
    
    onstatechange : function(){
        this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },
    
    onreadystatechange : function(){}
});


/*********************************************************************
 ::USAGE::
 
    var  oXMLHttpRequest = new core.http.XMLHttpRequest;
         oXMLHttpRequest.open("GET", "apps/Sample/main.js", true);
         oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
         oXMLHttpRequest.onreadystatechange  = function() {
            if (this.readyState == XMLHttpRequest.DONE) {
                console.log(this.responseText)
            }
         }
         oXMLHttpRequest.send(null);
 **********************************************************************/


namespace("core.http.WebAction", {
    '@inherits': core.http.XMLHttpRequest,
    
    
    initialize : function(uri, params, config){
        this.parent(uri, params);
        this.uri = uri;
        this.params = params;
        this.config=config||{};
        this.async=true;
        return this;
    },
    
    setAsync : function(bool){
        this.async=bool;
    },
    
    open : function(method, path , async){
        async   = ((typeof async == "boolean")?async:this.async);
        method  = method||this.getDefaultMethod();
        
        //path    = core.http.UrlRouter.resolve(path||this.uri);
        //path    = path + this.createQueryString(method,path,this.params);
        this.async  = async;
        this.method = method;
        path = this.buildPath(path);

        this.oXMLHttpRequest.open(method, path, async);
        return this;
    },

    buildPath : function(path){
        path = core.http.UrlRouter.resolve(path||this.uri);
        if(/\{([a-zA-Z0-9]+)\}/g.test(path)){
            path = this.createRESTfulUrl(path)
        }
        else{
            path  = path + this.createQueryString(this.method,path,this.params);
        }
        return path;
    },

    createRESTfulUrl : function(path){
        var self=this;
        path = path.replace(/\{([a-zA-Z0-9]+)\}/g, function(){
          var propName = arguments[1];
          return (self.params[propName]||"")
        });

        return path;
    },

    setParameter : function(key,value){
        this.params[key]=value;
    },
    
    createRequestHeaders : function(){
        if(appconfig.environment != "dev" && this.method == "POST"){
            this.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }
    },
    
    createQueryString : function(method, url, params){
        if(appconfig.environment == "dev" && method == "GET"){
            return this.getParameterSeperator(url) + (params?toQueryString(params):"");
        } else {
            return "";
        }
    },
    
    createPostParams : function(params){
        if(appconfig.environment != "dev" && this.method == "POST"){
            return (params?toQueryString(params):"");
        } else {
            return "";
        }
    },
    
    invoke : function(options){
        this.options = options;
        this.open();
        try{
            this.createRequestHeaders();
            this.send(this.createPostParams(this.params));
        } catch(e){
            alert("invoke: " +e.message)
        }
    },
    
    onstatechange : function(){
        var r = this.oXMLHttpRequest;
        if(r.readyState == XMLHttpRequest.DONE){
            if(r.status == 0||r.status == 200){
                if(this.isFailure(r)){
                    this.onFailure(r);
                } else{
                    try{
                        var data = JSON.parse(r.responseText);
                        if(data.result && data.result.status == "error"){
                            this.onReject(r,data);
                       } else {
                            if (data.result && data.result.state == "LOGOUT") {
                                // Force user to the login page
                                this.onLogout();
                            } else {
                                this.onSuccess(r);
                            }
                        }
                    } catch(e){
                       this.onReject(r); 
                    }
                }
            }
            else {
                this.onFailure(r);
            }
        }
        //this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },
    
    onLogout : function(){
        console.warn("in logout function!");
        var resolvedUrl = core.http.UrlRouter.resolve("$.DATA.LOGOUT");
        location.href=resolvedUrl;
    },
    
    onReject : function(xhr,data){
        if(this.options.onReject) {this.options.onReject(xhr,data); }
        application.dispatchEvent("notification",true,true,{
            type:"UserError",
            message:data.result.message||"An unknown user error occurred",
            httpresponse:xhr
        }); 
    },
    
    onSuccess : function(xhr){
        this.options.onSuccess(xhr, xhr.responseText);
    },
    
    onFailure : function(xhr){
        var errorMessage = "";
        if(xhr.status == 0||xhr.status == 200){
            if(xhr.responseText.length <=0){
                errorMessage = "200 Unknown Error -- response was empty";
            } else {
                errorMessage="200 Unknown Error: " + xhr.statusText;
            }
        } 
        else if(xhr.status == 400){
            errorMessage = "400 Bad Request -- request contains incorrect syntax";
        }
        else if(xhr.status == 401){
            errorMessage = "401 Unauthorized access to"
        }
        else if(xhr.status == 403){
            errorMessage = "403 Forbidden -- file permission protection"
        }
        else if(xhr.status == 404){
            errorMessage = "404 Service Not Found";
        }
        else if(xhr.status == 500){
            errorMessage = "500 Internal Server Error -- server encountered an unexpected condition"
        }
        else if(xhr.status == 501){
            errorMessage = "501 Not Implemented -- HTTP method not supported"
        }
        else if(xhr.status == 502){
            errorMessage = "502 Bad Gateway -- Error due to improperly configured proxy, server overload or firewall issue"
        }
        else if(xhr.status == 503){
            errorMessage = "503 Temporarily not able to handle requests due to overload or maintenance occuring on server"
        }
        else if(xhr.status == 504){
            errorMessage = "504 Gateway Timeout"
        }
        else if(xhr.status == 507){
            errorMessage = "507 Insufficient Storage -- server is out of free memory"
        }
        else if(xhr.status == 509){
            errorMessage = "509 Bandwidth Exceeded -- bandwidth limit imposed by the system administrator has been reached"
        }
        else if(xhr.status == 510){
            errorMessage = "510 Not Extended -- an extension attached to the HTTP request is not supported"
        }
        else{
            errorMessage=xhr.statusText;
            //console.error(xhr.statusText,xhr);  
        }
        
        if(this.config.handleErrors){
            this.options.onFailure(xhr, xhr.responseText);
        } else {
            if(this.uri != ROUTES.DATA.HEARTBEAT){
                Session.State.lastHttpError = errorMessage;
                application.dispatchEvent("notification",true,true,{
                    type:"NetworkError",
                    message:errorMessage||"An unknown network error occurred",
                    httpresponse:xhr
                });
            }
        }
        console.error(errorMessage, xhr);
    },
    
    isFailure : function(xhr){
        if(xhr.status == 0||xhr.status == 200){
            if(xhr.responseText.length <= 0){
                return true;
            }
            else {
                try{
                   var data = JSON.parse(xhr.responseText);
                   if(data && typeof data == "object"){
                       return false;
                   }
                } catch(e){
                    return true
                }
            }
        } else {
            return true
        }
    }
});



namespace("core.http.WebIterator", {
    '@inherits': core.http.WebAction,
    
    
    initialize : function(uri, params, name, owner){
        this.parent(uri, params);
        this.name=name;
        this.owner=owner;
        this.dir=1;
        return this;
    },

    configureDataMappings : function(mapping){
        this.data_mapping = mapping;
    },
    
    isIterable : function(){
        return true;
    },
    
    totalPages : function(){
        var totalPages = 1;
        if(this.data){
            var totalRecords = this.getTotalRecords();
            totalPages   = totalRecords/this.itemsPerPage();
        }
        return Math.ceil(totalPages);
    },
    
    currentPage : function(){
        var page = this.params.page;
        return page;
    },
    
    itemsPerPage : function(){
        var count = this.accessor.get(this.data_mapping.count).data||this.params.count;
        return count;
    },
    
    isLastPage : function(){
        var currentPage  = this.currentPage();
        return (this.isIterable()==false) || (currentPage == this.totalPages());
    },

    isFirstPage : function(){
        var currentPage  = this.currentPage();
        return (this.isIterable()==false) || currentPage == 1;
    },
    
    updatePagingOptions : function(){
        //var options = this.params.pagingOptions;
        if(this.isIterable()) {
            var currentPage  = this.currentPage();
            if(this.dir==1){
                if(currentPage < this.totalPages()){
                    this.params.page++;
                }
            } else {
                if(currentPage > 1){
                    this.params.page--;
                } else if(currentPage <= 0){
                    this.params.page=1;
                }
            }
        }
    },
    
    next : function(options){
        this.dir=1;
        this.updatePagingOptions();
        this.invoke(options);
    },
    
    previous : function(options){
        this.dir=0;
        this.updatePagingOptions();
        this.invoke(options);
    },
    
    refresh : function(){
        this.invoke();
    },
    
    invoke : function(options){
        /*this.options = options;
        if(this.isIterable()) {
            (this.dir==1)? this.next(options) : this.previous(options);
        }
        else {
            this.parent.invoke.call(this,options);
        }*/
        this.updatePagingOptions();
        this.parent(options);
    },
    
    setDirection : function(num){
        this.dir = (typeof num == "number" && (num >-1 && num <=1))? num:1;
    },
    
    getTotalRecords : function(data, path){
        var total = this.accessor.get(this.data_mapping.total).data||this.data.total;
        return total;
    },
    
    /*onstatechange : function(){
        var r = this.oXMLHttpRequest;
        if(r.readyState == XMLHttpRequest.DONE){
            if(r.status == 0){
                if(r.responseText.length <= 0){
                    this.onFailure(r, r.responseText)
                }
                else if(r.responseText.length > 0){
                    this.onSuccess(r, r.responseText)
                }
            }
            else if(r.status == 200){
                if(r.responseText.length <= 0){
                    this.onFailure(r, r.responseText)
                }
                else if(r.responseText.length > 0){
                    this.onSuccess(r, r.responseText)
                }
            }
            else if(r.status != 200){
                this.onFailure(r, r.responseText)
            }
        }
        //this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },*/
    
    onSuccess : function(r, responseText){
        var data = JSON.parse(r.responseText);
        this.data=data;
        this.accessor = new core.data.Accessor(this.data);
        if(this.isIterable()) {
            (this.dir==1)?
                this.onNext(r, data):
                this.onPrevious(r, data);
        }
        //this.parent.onSuccessHook.call(this,data);
    },
    
    onNext : function(xhr, data){
        console.log("onNext",data);
        this.options.onNext(xhr, data);
    },
    
    onPrevious : function(xhr, data){
        console.log("onPrevious",data);
        this.options.onPrevious(xhr, data);
    },

    
    /*open : function(method, path , async){
        async   = ((typeof async == "boolean")?async:true);
        method  = method||this.getDefaultMethod();
        path    = core.http.UrlRouter.resolve(path||this.uri);
        path    = path + this.createQueryString(method,path,this.params);
        this.async  = async;
        //this.uri    = path;
        this.method = method;
        
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        this.oXMLHttpRequest.open(method, path, async);
        return this;
    }*/
});


/**********************USAGE

var it;

if(!it){
  it = new core.http.WebIterator(ROUTES.DATA.PAGINATION_TEST,{
    page:1,
    count:3
  });
}

it.next()
it.totalPages()
 **************************/

namespace("core.ui.WebComponent", 
{
    '@inherits' : w3c.HtmlComponent,
    '@stylesheets' : [],
    "@cascade"  : true,
    
    
    renderTemplate : function(data, templateName, initChildComponents, autoInsert){
        initChildComponents = typeof initChildComponents=="boolean"?initChildComponents:false;
        autoInsert = typeof autoInsert=="boolean"?autoInsert:true;
        
        var templateDefinition = this.templates[templateName];
        if(!templateDefinition){
            alert("error, no '" +templateName+ "' template found to render data");
            return;
        } 
        if(templateDefinition.template.parentNode){
            templateDefinition.template.parentNode.removeChild(templateDefinition.template);
        }
        var text = Kruntch.Apply(templateDefinition.template.innerHTML, data);
        var d = document.createElement(templateDefinition.parentTagName||"div");
        d.innerHTML = text;
        
        var container = d;
        if(autoInsert){
            if(typeof templateDefinition.div == "string"){
                container = this.querySelector(templateDefinition.div);
            } else{
                container = templateDefinition.div;
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
        //this.addClass("canvas", canvas);
        this.canvas = canvas;
        return el;
    },
    
    renderNode : function(data, templateName, initChildComponents){
        return this.renderTemplate(data, templateName, initChildComponents, false);
    },
    
    setACLControls : function(data){
        if(data.acl){
            for(var key in data.acl){
                var val = data.acl[key];
                if(typeof val =="boolean" && val == false) {
                    var aclElements = this.querySelectorAll("*[data-acl-key='" + key + "']");
                    if(aclElements){
                        for(var i=0; i<=aclElements.length-1; i++){
                            var el = aclElements[i];
                            el.classList.add("acl-hidden");
                        }
                    }
                } else {
                    var aclElements = this.querySelectorAll("*[data-acl-key='" + key + "']");
                    if(aclElements){
                        for(var i=0; i<=aclElements.length-1; i++){
                            var el = aclElements[i];
                            el.classList.remove("acl-hidden");
                        }
                    }
                }
            }
        }
    },
    
    onFocus : function(){},
    
    
    parseElement : function (template, json){
        var templateString = (typeof this.innerHTML === "function") ?
            this.innerHTML() : this.innerHTML;
            var html=templateString;
         //var html = this.parseTemplate(templateString, json);
         html = this.parseTemplate(templateString, json);
         if (html && html.length > 0) {return html.toHtmlElement()}
         else {
            throw new Error(this.namespace + "#parseElement(template, json). Invalid xhtml generated from 'template' string. Value of 'html' is: "+ html);
         }
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



namespace("core.ui.ApplicationBar", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    '@stylesheets' :["~/resources/[$theme]/ApplicationBar.css"],
    
    initialize : function(){
        this.toggleSheenFx  = this.querySelector("#toggle-sheen-effect");
    	this.appTitle = this.querySelector(".screen-title");
        this.startbutton = this.querySelector("#start-icon");
    	this.addEventListener("menuchanged", this.onSlidingMenuChanged.bind(this), false);
        this.startbutton.addEventListener("click", this.onShowStartMenuPanel.bind(this), false);
        application.addEventListener("startmenu", this.onStartMenuVisibilityChanged.bind(this), false);
        this.sheen();
    },

    sheen : function(){
        var self=this;
        
        if(this.sheenInterval){
            clearInterval(this.sheenInterval);
        }
        setTimeout(function(){
            self.toggleSheenFx.classList.add("sheen");
        },1100);
        this.sheenInterval = setInterval(function(){
            //if(!application.currentRunningApplication){//optimization
                self.toggleSheenFx.classList.remove("sheen");
                setTimeout(function(){
                    self.toggleSheenFx.classList.add("sheen");
                },1000);
            //}
        },5000)
    },

    onSlidingMenuChanged : function(e){
    	if(e.data.state=="open"){
    		this.appTitle.style.visibility = "hidden";
    	} else{
    		this.appTitle.style.visibility = "visible";
    	}
    },

    onStartMenuVisibilityChanged : function(e){
        var span = this.startbutton.querySelector("span");
        if(e.data.active == true){
            span.classList.add("fa-toggle-left");    
            span.classList.remove("fa-navicon");
        } else{
            span.classList.add("fa-navicon");
            span.classList.remove("fa-toggle-left");    
        }
    },

    onShowStartMenuPanel : function(e){
        this.dispatchEvent("togglemenu", true, true, {});
    }
});

namespace("core.ui.Button", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    
    initialize : function(){
        this.parent();
        this.iconEl = this.querySelector(".icon");
        if(this.iconEl){
            this.classList = this.iconEl.classList;
        }
        ///this.addEventListener
    },
    
    disable : function(){
        this.element.classList.add("disabled");
    },
    
    enable : function(){
        this.element.classList.remove("disabled");
    },
    
    spin : function(cls){
        this.originalClass = cls;
        this.iconEl.classList.remove(cls);
        this.iconEl.classList.add("fa-spinner");
        this.iconEl.classList.add("aimation-rotate");
    },
    
    reset : function(cls){
        this.iconEl.classList.add(this.originalClass);
        this.iconEl.classList.remove("fa-spinner");
        this.iconEl.classList.remove("aimation-rotate");
    },

    setLabel : function(str){
        var label = this.querySelector(".label");
        if(label){ label.innerHTML = str; }
    }
});

namespace("core.ui.WebApplication", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    initialize : function() {
        this.parent();
        this.setUserAgentClasses();
    },
    
    setUserAgentClasses : function(){
        if(UserAgent.isMobile() || appconfig.ismobile){
            this.element.classList.add("mobile");
            if(UserAgent.isAndroid()){
                this.element.classList.add("android");
            }
            else if(UserAgent.isIOS()){
                this.element.classList.add("ios");
            } 
            else if(UserAgent.isWindowsMobile()){
                this.element.classList.add("iemobile");
            }
        }
    },
    
    onScreenResized : function(){
        console.info("Screen Resized detected by current application: ", this)    
    },
    
    onFocus : function(e){
        this.setActivityState(true);
        application.requestRefreshCycle(this);
        console.info(this.namespace + " is focused");    
    },
    
    
    onBlur : function(e){
        this.setActivityState(false);
        console.info(this.namespace + " is blurred and not running");    
    },
    
    onActivated : function(e){
        console.info(this.namespace + " is activated from disk");    
    },
    
    run : function() {
        this.dispatchEvent("load", true, true, {component:this});
    },
    
    setActivityState : function(bool){
        this._is_active_and_focused = bool;
    },
    
    isFocused : function(bool){
        return this._is_active_and_focused == true;
    },
    
    refresh : function(e){
        console.info(this.namespace + " refreshed");
    },
    
    modalize : function(component){
        //e.preventDefault();
        //e.stopPropagation();
        var modal = new core.ui.ModalScreen;
            modal.setZindex(application.absoluteZindex());
            modal.owner = this;
            modal.appendChild(component.element||component);
            modal.addEventListeners();
            return modal;
    }
});

 

namespace("core.ui.Panel", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    
    initialize : function(){
        this.title          = this.querySelector(".title");
        this.container      = this.querySelector(".panel-container");
        this.resizeButton   = this.querySelector(".panel-options .resize.button");
        this.closeButton    = this.querySelector(".panel-options .close.button");
        this.cancelButton    = this.querySelector(".button-bar .cancel.button");
        
        if(this.resizeButton){
            this.resizeButton.addEventListener("click", this.onResizePanel.bind(this), false);
        }
        if(this.closeButton){
            this.closeButton.addEventListener("click", this.onClosePanel.bind(this), false);
        }
        if(this.cancelButton){
            this.cancelButton.addEventListener("click", this.onCancelPanel.bind(this), false);
        }
    },
    
    onResizePanel : function(){
          
    },
    
    onClosePanel : function(){
        
    },
    
    onCancelPanel : function(e){
        this.dispatchEvent("panelcanceled",true,true,{component:this});
    },
    
    setTitle : function(strTitle){
        this.title.innerHTML = strTitle;
    },
    
    getTitle : function(strTitle){
        return this.title.getAttribute("data-title")||this.title.innerHTML;
    },
    
    appendChild : function(el){
        this.container.appendChild(el.element||el);
    },
    
    innerHTML:
    '<div class="panel">\
        <div class="title panel-title"></div>\
        <div class="panel-container"></div>\
    </div>'
});

namespace("core.ui.Panel", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    
    initialize : function(){
        this.title          = this.querySelector(".title");
        this.container      = this.querySelector(".panel-container");
        this.resizeButton   = this.querySelector(".panel-options .resize.button");
        this.closeButton    = this.querySelector(".panel-options .close.button");
        this.cancelButton    = this.querySelector(".button-bar .cancel.button");
        
        if(this.resizeButton){
            this.resizeButton.addEventListener("click", this.onResizePanel.bind(this), false);
        }
        if(this.closeButton){
            this.closeButton.addEventListener("click", this.onClosePanel.bind(this), false);
        }
        if(this.cancelButton){
            this.cancelButton.addEventListener("click", this.onCancelPanel.bind(this), false);
        }
    },
    
    onResizePanel : function(){
          
    },
    
    onClosePanel : function(){
        
    },
    
    onCancelPanel : function(e){
        this.dispatchEvent("panelcanceled",true,true,{component:this});
    },
    
    setTitle : function(strTitle){
        this.title.innerHTML = strTitle;
    },
    
    getTitle : function(strTitle){
        return this.title.getAttribute("data-title")||this.title.innerHTML;
    },
    
    appendChild : function(el){
        this.container.appendChild(el.element||el);
    },
    
    innerHTML:
    '<div class="panel">\
        <div class="title panel-title"></div>\
        <div class="panel-container"></div>\
    </div>'
});

namespace("core.ui.WindowPanel", {
    '@inherits' : core.ui.Panel,
    "@cascade"  : true,
    
    onResizePanel : function(){
       this.dispatchEvent("resizeapp", true, true, {component:this})
    },
    
    onClosePanel : function(){
        this.dispatchEvent("close", true, true, {component:this})
    }
});

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
        this.cancelButton = this.querySelector(".button-bar .cancel.button");
        this.okButton = this.querySelector(".button-bar .ok.button");
        this.cancelButton.addEventListener("click", this.onModalWantsToExit.bind(this), false);
        this.okButton.addEventListener("click", this.onModalWantsToConfirm.bind(this), false);
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
        this.dispatchEvent("confirmmodal", true, true, e.data);
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

namespace("core.ui.components.HelpWizard", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    '@stylesheets' :["src/core/ui/components/HelpWizard/HelpWizard.css"],
    "@href": "src/core/ui/components/HelpWizard/HelpWizard.html",
    
    initialize : function(){
        this.componentOverlay = this.querySelector("#ui-helpwizard-component-overlay");
        this.componentTooltip = this.querySelector("#ui-helpwizard-component-overlay-tooltip");
        this.toolTipContainer = this.querySelector("#ui-helpwizard-tooltip-text");
        
        this.previousArrow = this.querySelector(".previous.arrow");
        this.nextArrow = this.querySelector(".next.arrow");
        this.last_index=-1;
        
        this.previousArrow.addEventListener("click", this.onGotoPrevious.bind(this), false);
        this.nextArrow.addEventListener("click", this.onGotoNext.bind(this), false);
        
        this.addEventListener("click", this.onActionClicked.bind(this), false);
        this.addEventListener("dblclick", this.onCloseHelp.bind(this), false);
        this.addEventListener("nextstep", this.onMovedNext.bind(this), false);
        this.addEventListener("previousstep", this.onMovedPrevious.bind(this), false);
    },

    onCloseHelp : function(e){
        this.deactivate();
    },
    
    activate : function(){
        var self=this;
        this.element.classList.add("active");  
        setTimeout(function(){
            self.nextArrow.classList.add("animated");
            self.nextArrow.classList.add("bounce"); 
        },300)
    },
    
    deactivate : function(){
        this.setHardwareAcceleration(false);
        this.resetLastStep();
        this.element.classList.remove("active");  
        this.previousArrow.classList.remove("bounce");   
        this.nextArrow.classList.remove("bounce");   
    },
    
    isActive : function(){
        return this.element.classList.contains("active"); 
    },
    
    onActionClicked : function(e){
        var _action = e.target.getAttribute("action");
        if(_action){
            this.dispatchEvent(_action,true,true,{action:_action, originalEvent:e, target:e.target});
        }
    },
    
    onGotoNext : function(){
        this.next();    
    },
    
    onGotoPrevious : function(){
        this.previous();    
    },
    
    onMovedNext : function(){
        this.setButtons();
    },
    
    onMovedPrevious : function(){
        this.setButtons();
    },
    
    setSteps : function(divs){
        var items=divs||[];
        this.divs = [];
        for(var i=0; i<=items.length-1;i++){
            items[i].scrollIntoView(true);
            var coords = this.getBoundingClientRect(items[i]);
            if(coords.width==0 && coords.height==0){continue;}
            else{
                items[i]._coords=coords;
                this.divs.push(items[i])
            }
        }
        this.sort();
        this.toggleButtonVisibility();
    },

    toggleButtonVisibility : function(){
        if(this.divs.length==1){
            this.previousArrow.style.display="none"
            this.nextArrow.style.display="none"
        }
    },
    
    sort : function(){
        function compare(a,b) {
          var i = a.getAttribute("data-helpindex");
          var j = b.getAttribute("data-helpindex");
          if (i < j)
             return -1;
          if (i > j)
            return 1;
          return 0;
        }
        this.divs.sort(compare);
        console.info("sorted list", this.divs)
    },
    
    setIndex : function(i){
        if(typeof i == "number"){
            this.last_index=i;
        } else if(typeof i == "string"){ 
            var items = this.divs;
            for(var j=0; j<=items.length-1;j++){
                var helpkey = items[j].getAttribute("data-helpkey");
                if(helpkey){
                    if(i.toLowerCase() == helpkey.toLowerCase()){
                        this.last_index=j-1;
                        break;
                    }
                }
            }
        } else {
            this.last_index=-1;
        }
    },
    
    setButtons : function(){
        var self=this;
        if(this.last_index == 0){
            this.previousArrow.classList.add("disabled");
        } else {
            this.previousArrow.classList.remove("disabled");
            this.previousArrow.classList.add("animated");
            setTimeout(function(){self.previousArrow.classList.add("bounce");},300);
        }
        if(this.divs && this.divs.length > 0) {
            this.nextArrow.classList.remove("disabled");
        }
        if(this.last_index >= this.divs.length-1){
            this.nextArrow.classList.add("disabled");
            this.previousArrow.classList.remove("disabled");
        }
    },
    
    next : function(i){
        i=(i||this.last_index+1);
        i = (i > this.divs.length-1) ? this.divs.length:i;
        if(this.divs && this.divs[i]){
            this.resetLastStep();
            this.renderStep(this.divs[i]);
            this.last_index=i;
            this.dispatchEvent("nextstep",true,true,{});
        }
    },
    
    previous : function(i){
        i=(i||this.last_index-1);
        i = (i < 0) ? 0:i;
        if(this.divs && this.divs[i]){
            this.resetLastStep();
            this.renderStep(this.divs[i]);
            this.last_index=i;
            this.dispatchEvent("previousstep",true,true,{});
        }
    },
    
    resetLastStep : function(){
        if(this.last_step_data){
            this.last_step_data.div.classList.remove(this.last_step_data.posType)
        }
    },
    
    setHardwareAcceleration : function(bool){
        this.__is_hardware_accelarated__ = bool;
    },
    
    isHardwareAccelerated : function(bool){
        return this.__is_hardware_accelarated__ == true;
    },
    
    renderStep : function(step){
        step.scrollIntoView(true);
        var div = step;//this.divs[i];
        var coords = div._coords||this.getBoundingClientRect(div);
        var posType = window.getComputedStyle(div,null).getPropertyValue("position");
        console.warn("div",[div,coords])
        this.componentOverlay.style.width=coords.width+"px";
        this.componentOverlay.style.height=coords.height+"px";
        if(this.isHardwareAccelerated()){
            this.componentOverlay.style["transform".toVendorPrefix()]="translate3d("+coords.left +"px,"+ coords.top+"px,0)";
        } else{
            this.componentOverlay.style.left = coords.left + "px"
            this.componentOverlay.style.top  = coords.top  + "px"   
        }
        
        var t="";
        
        if(posType=="relative"||posType=="static") {
            //div.classList.add("helpon_relative")
            t="helpon_relative"
        }
        else if(posType=="absolute"){
            //div.classList.add("helpon_absolute")
            t="helpon_absolute"
        }
        else if(posType=="fixed"){
            //div.classList.add("helpon_fixed")
            t=helpon_fixed;
        }
        else {
            console.warn("unable to determin positioning-type of the current element,", div)
        }
        div.classList.add(t)
        this.setToolTip(step);
        this.last_step_data = {
            div:step,
            posType:t
        }
    },
    
    setToolTip : function(step){
        this.toolTipContainer.innerHTML = step.getAttribute("data-helptext");
        this.setTooltipPosition(step);
        console.info("tooltip coords",this.getBoundingClientRect(this.componentTooltip))
    },
    
    setTooltipPosition : function(step){
        var defaultCardinal = step.getAttribute("data-cardinal-position");
        var stepCoords = step._coords||this.getBoundingClientRect(step);
        var viewPortStyle = window.getComputedStyle(document.body,null);//.getPropertyValue("height")
        var vpWidth  = parseInt(viewPortStyle.getPropertyValue("width"),10);
        var vpHeight = parseInt(viewPortStyle.getPropertyValue("height"),10);
        if(isNaN(vpWidth)||isNaN(vpHeight)){
            return;
        }
        else{
            var tooptipPosition="south";
            var directions = {
                north:  stepCoords.top,
                south:  vpHeight-stepCoords.bottom,
                east:   vpWidth-stepCoords.right,
                west:   stepCoords.left
            };
            var max = Math.max(directions.north, directions.south, directions.east, directions.west);
            for(var d in directions){
                if(directions[d] == max){
                    tooptipPosition = d;
                    break;
                }
            }
            this.componentOverlay.setAttribute("data-cardinal-position",defaultCardinal?defaultCardinal:tooptipPosition);
            //step.scrollIntoView(true);
        }
    },
    
    innerHTML:
    '<div></div>'        
});

/**
 * The UrlHashState constructor runs during parent app initialize().
 * It is triggered before the app is unloaded or when app is first loaded.
 * It detects any hash/fragments in the url and will auto-launch the
 * matching app with params.
 *
 * @example
 * http://localhost:3000/#(appref:apps/SearchResults,keyword:'28.119783899999998, -81.4444443')
 * A url like this, when pasted into the address bar and executed will trigger the UrlHashState
 * trait to spawn up a new instance of the app, apps/SearchResults and pass inthe keyword
 * params into the app.
 */

UrlHashState = {
    initialize : function(){
      var self=this;
       this.parent();
       this.addEventListener('showdashboard', this.onReturnToDashboardHash.bind(this), false);
       this.addEventListener("appopened", this.onApplicationOpened2.bind(this), false);
       this.initializeURLHashing();
       window.onbeforeunload = function () {
           if(self.isLoggedIn) {
               return "Exit? If you leave now, any unsaved data will be lost."
           }
           else{
                
           }
       }
    },
    
    onApplicationOpened2 : function(e){
        window.location.hash = rison.encode(e.data);   
    },
    
    initializeURLHashing : function(){
        var self=this;
        var defaultHashPath = rison.encode({appref:"apps/Desktop"});
        
        this.addEventListener("statechanged", function(){
            var currentHash = window.location.hash;
                currentHash = currentHash.replace("#","");
            var appinfo     = rison.decode(decodeURIComponent(currentHash));

            if(!appinfo || !appinfo.appref){
              window.location.hash=defaultHashPath;
            }
            else if(appinfo && appinfo.appref && appinfo.appref.length>0){
              var ns = appinfo.appref.replace("/",".");
              var app = self.currentRunningApplication;
              if(!app || app.namespace != ns){
                  self.dispatchEvent("openapp",true,true,appinfo)
              }
            }
        }.debounce(300), false);

        var h = window.location.hash;
        if(!h||(h && h.length <=0)){
            window.location.hash = defaultHashPath;
        }
    },
    
    
    onReturnToDashboardHash : function(e){
        var defaultHashPath = rison.encode({appref:app.constants.DEFAULT_HOME_APP});
        window.location.hash = defaultHashPath;
    } 
};



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

document.addEventListener("DOMContentLoaded", function(){ 
	function bootup(){
		var timerId;
		var Application = NSRegistry[window.appconfig.namespace];
		if( Application) {
			timerId && clearTimeout(timerId);
			window.application = new Application(window.appconfig, document.body);
		}
		else { timerId = setTimeout(bootup,200) }
	};	
	
	bootup();
}, false);




namespace("framework.Application",
{
    '@inherits' : ui.Application,
    '@cascade'  : false,
    '@stylesheets' : [],

    APP_REFRESH_INTERVAL:5000,
    
    onLine : true,
    isLoggedIn : true,
    
    initialize : function(model, element) {
        var self = this;
        this.parent(model, element);
 
        
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        console.info("DEVICE RESOLUTION:", window.innerWidth + " x " + window.innerHeight);
        this.setUserAgentClasses();
        this.initializeUrlRoutesTable();
        this.initializeHeartBeatMonitor();

        //STATE
        this.recentAppsSelector         = this.querySelector(".Navigator .RecentAppsSelectBox");
        this.startMenu                  = this.querySelector(".ApplicationBar .StartMenu");
        this.searchBox                  = this.querySelector(".SearchBox");
        this.wallpaper                  = this.querySelector("#wallpaper");
        this.globalApplicationSpinner   = this.querySelector("#global-application-spinner");
        this.appsScreen                 = this.querySelector(".application-container");
        
        //EVENTS
        this.addEventListener("appopened", this.onApplicationOpened.bind(this), false);
        if(this.searchBox){
            this.searchBox.addEventListener("focus", this.onSearchBoxFocused.bind(this), false);
        }

        this.addEventListener("startmenu", this.onStartMenuActionReceived.bind(this), false);
        this.addEventListener("notification", this.onNotificationReceived.bind(this), false);
        this.addEventListener('showdashboard', this.onReturnToDashboard.bind(this), false);
        this.addEventListener('fullscreenmode', this.onToggleFullscreen.bind(this), false);
        this.addEventListener("modalize", this.onModalize.bind(this), false);
        this.addEventListener("openapp", this.onLaunchWebApplication.bind(this), false);
        this.addEventListener("closehelp", this.onCloseHelpWizard.bind(this), false);
        this.addEventListener("loaded",this.onApplicationLoaded.bind(this), false);
        document.addEventListener("fullscreenchange", this.onFullscreenChanged.bind(this),false);
        document.addEventListener("webkitfullscreenchange", this.onFullscreenChanged.bind(this),false);
        document.addEventListener("mozfullscreenchange", this.onFullscreenChanged.bind(this),false);
        document.addEventListener("MSFullscreenChange", this.onFullscreenChanged.bind(this),false);
        window.addEventListener("resize", this.onWindowResized.bind(this).debounce(700), false);
        this.addEventListener("sessionloaded",this.onApplicationSessionLoaded.bind(this), false);
        this.addEventListener("logout",this.onApplicationLogout.bind(this), false);
        this.addEventListener("releaseapp", this.onReleaseApp.bind(this), false);

        this.addEventListener("openmenu", this.onShowStartMenu.bind(this), false);
        this.addEventListener("togglemenu", this.onToggleStartMenu.bind(this), false);
        this.addEventListener("hidemenu", this.onHideStartMenu.bind(this), false);

        this.bootup();
    },

    onDeviceReady : function(){
        if(navigator.splashscreen){
            navigator.splashscreen.hide();
        }
    },

    onToggleStartMenu : function(e){
        this.startMenu.prototype.toggle();
    },

    onShowStartMenu : function(e){
        this.startMenu.prototype.show();
    },

    onHideStartMenu : function(e){
        this.startMenu.prototype.hide();
    },

    onStartMenuActionReceived : function(e){
        setTimeout(function(){
            if(e.data.active){
                this.wallpaper.classList.add("blurred");
                this.appsScreen.style.visibility="hidden"
            } else{
                this.wallpaper.classList.remove("blurred")
                this.appsScreen.style.visibility="visible"
            }
        }.bind(this),100);
    },
    
    setModalScreen : function(modalScreen){
        this.element.appendChild(modalScreen.element);
        this.element.classList.add("modalized");
    },
    
    removeModalScreen : function(modalScreen){
        this.element.removeChild(modalScreen.element);
        var nextModal = this.querySelector(".ModalScreen");
        if(!nextModal){
            this.element.classList.remove("modalized");
        }
    },
    
    onApplicationOpened : function(e){},
    
    
    onApplicationSessionLoaded : function(){
        var self=this;
        if(appconfig.appref){
            this.dispatchEvent("openapp",true,true,{appref:appconfig.appref})
        };
        this.dispatchEvent("appready",true,true,{});
    },
    
    initializeHeartBeatMonitor : function(){
        if(!appconfig.heartbeat){
            return;
        }
        var self=this;
        if (navigator.onLine) {
            this.onLine=true;
        }
        
        window.addEventListener('online', function(e) {
          self.onLine=true;
          application.dispatchEvent("connection",true,true,{status:"online"});
        }, false);
        
        window.addEventListener('offline', function(e) {
          self.onLine=false;
          application.dispatchEvent("connection",true,true,{status:"offline"});
        }, false);

        var dispatchOfflineNotification = function(){
            if(self.onLine){
                self.onLine=false;
                application.dispatchEvent("connection",true,true,{status:"offline"});
                application.dispatchEvent("notification",true,true,{
                  type:"NetworkOffline",
                  message:"Working offline -- detected connection failure, unable to reach server.",
                  httpresponse:null
                });
            }
            doHeartBeatCall(randomHeartBeatTiming(1000,1500));
        };
        
        var randomHeartBeatTiming = function(min, max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        
        var dispatchSessionNotification = function(session){
            if(!session) {
                if(self.isLoggedIn) {
                    self.isLoggedIn = false;
                    application.dispatchEvent("session",true,true,{status:false});
                    application.dispatchEvent("notification",true,true,{
                      type:"Warning",
                      message:"Session expired. Login to prevent data loss.",
                      httpresponse:null,
                      forceclose:true
                    });
                }
            } else {
                if(!self.isLoggedIn) {
                    self.isLoggedIn = true;
                    application.dispatchEvent("session",true,true,{status:true});
                    application.dispatchEvent("notification",true,true,{
                      type:"Information",
                      message:"Welcome back " + Session.State.AccountProfile.firstname,
                      httpresponse:null
                    });
                }
            }
        };
        
        var dispatchOnlineNotification = function(r, responseText){
            if(!self.onLine){
                self.onLine=true;
                Session.State.lastHttpError="";
                application.dispatchEvent("connection",true,true,{status:"online"});
                application.dispatchEvent("notification",true,true,{
                  type:"NetworkOnline",
                  message:"Working online - we're back up and running.",
                  httpresponse:null
                });
            }
            try{
                var data = JSON.parse(responseText);
                if(data && data.result){
                    if("session" in data.result){
                        var session = data.result.session;
                        dispatchSessionNotification(session);
                    } else{
                        dispatchSessionNotification(true);
                    }
                }
            } catch(e){
               dispatchSessionNotification(false);
                console.error(e)
            }
            if(!self.isLoggedIn){
                doHeartBeatCall(randomHeartBeatTiming(1000,1500));
            }
            else{
                doHeartBeatCall(randomHeartBeatTiming(5000,10000));
            }
        };
        
        var doHeartBeatCall = function(seconds){
            setTimeout(function(){
                var action = new core.http.WebAction(ROUTES.DATA.HEARTBEAT, {
                    guid:Math.uuid(8),
                    type:"heartbeat",
                    error:Session.State.lastHttpError||"",
                    profile_id:Session.State.AccountProfile.profile_id
                }, {handleErrors:true});
                action.invoke({
                    onSuccess  : dispatchOnlineNotification,
                    onFailure  : dispatchOfflineNotification,
                    onRejected : dispatchOfflineNotification
                });
            }, seconds)
        };
        doHeartBeatCall(randomHeartBeatTiming(5000,10000))
    },
    
    onReleaseApp : function(e){
        //debugger;
        var self=this;
        var ns = e.data.ns;
        this.removeApplicationInstance(ns);
        if(self.currentRunningApplication){
            if(ns == self.currentRunningApplication.namespace){
                setTimeout(function(){
                    self.onReturnToDashboard()
                },100);
            }
        }
    },
    
    onSearchBoxFocused : function(){
        this.startMenu.prototype.onHideStartMenuPanel();    
    },
    
    setUserAgentClasses : function(){
        if(UserAgent.isMobile() || appconfig.ismobile){
            this.element.classList.add("mobile");
            if(UserAgent.isAndroid()){
                this.element.classList.add("android");
            }
            else if(UserAgent.isIOS()){
                this.element.classList.add("ios");
            } 
            else if(UserAgent.isWindowsMobile()){
                this.element.classList.add("iemobile");
            }
        }
    },
    
    onApplicationLogout : function(){
        var doit = confirm("Do you wish to exit this application?");
        if(doit){
            var resolvedUrl = core.http.UrlRouter.resolve("$.DATA.LOGOUT");
            location.href=resolvedUrl;
        }    
    },
    
    
    bootup : function(){
        var self=this;
        
        //just to get the css to load.
        new core.ui.Notification({type:"Information", message:""},null);

        if(appconfig.appref){
            this.element.classList.add("spa");
        }
        setTimeout(function() {
            self.beginVisitorSession();
            self.beginAppRefreshInterval();
        },400);
    },
    
    onWindowResized : function(e){
        console.warn("Resize detected")
        this.onCloseHelpWizard();
        if(this.currentRunningApplication && this.currentRunningApplication.isFocused()){
            this.currentRunningApplication.onScreenResized()
        }
        this.dispatchEvent("screensized", true,true,{})
    },

    
    getHelpWizard : function(){
        this.__help_wizard_ = new core.ui.components.HelpWizard;
        return this.__help_wizard_;
    },
    
    onCloseHelpWizard : function(e){
        if(this.__help_wizard_){
            if(this.__help_wizard_.element && this.__help_wizard_.element.parentNode){
                this.__help_wizard_.deactivate();
                this.__help_wizard_.element.parentNode.removeChild(this.__help_wizard_.element);
            }
        }
    },

    onApplicationLoaded : function(){},

    
    onFullscreenChanged : function(e){
        var _FullScreenElement =    document.fullscreenElement||
                                    document.webkitFullscreenElement||
                                    document.mozFullScreenElement||
                                    document.msFullscreenElement;
        var toggleButton = this.fullscreenToggleButton;
        if(toggleButton){
            if(_FullScreenElement){
                this.fullscreenToggleButton.classList.add("selected");
            }  else{
                this.fullscreenToggleButton.classList.remove("selected");
            }
        }
    },
    
    onToggleFullscreen : function(e){
        //debugger;
        if(!appconfig.fullscreenmode){return}
        //if(!UserAgent.isMobile()){return}
        var el = this.element;
        var _FullScreenEnabled =    document.fullscreenEnabled||
                                    document.webkitFullscreenEnabled || 
                                    document.mozFullScreenEnabled ||
                                    document.msFullscreenEnabled;
                                    
        var _FullScreenElement =    document.fullscreenElement||
                                    document.webkitFullscreenElement||
                                    document.mozFullScreenElement||
                                    document.msFullscreenElement;
                                    
        var _CancelFullScreen  =    document.exitFullscreen||
                                    document.webkitExitFullscreen||
                                    document.mozCancelFullScreen||
                                    document.msExitFullscreen;
                                    
        var _RequestFullScreen =    el.requestFullscreen||
                                    el.webkitRequestFullscreen||
                                    el.mozRequestFullScreen||
                                    el.msRequestFullscreen;
                                    
        if(!_FullScreenEnabled){
            console.warn("Fullscreen mode not supported in your browser.");
            return;
        }
        
        if((_FullScreenElement||this.isFullScreen) && e.data.force == false){
            _CancelFullScreen.call(document);
            this.isFullScreen=false;
        } else {
            if(_RequestFullScreen){
                _RequestFullScreen.call(el);
                this.isFullScreen = true;
            }
        }
        if(!this.fullscreenToggleButton){
            this.fullscreenToggleButton=e.data.button;
        }
    },
    
    onNotificationReceived : function(e){
        if(e.data.type == "NetworkError"){
            console.error(e.data.message, e.data);
            this.hideBlankState();
        }
        else if(e.data.type=="UserError"){
            console.warn("User Error:\n"+e.data.message);
        }
        else{
            console.log("Notification:\n"+e.data.message);
        } 
        if(e.data.type != "NetworkError"){
            this.querySelector("#desktop-notifications").appendChild(
                new core.ui.Notification({
                    type:e.data.type, 
                    appref:e.data.appref, 
                    title:e.data.title,
                    message:e.data.message,
                    forceclose:(typeof (e.data.forceclose == "boolean")) ? e.data.forceclose:false
                },null).element
            );
        }
    },

    
    beginAppRefreshInterval : function(){
        var self=this;
        setInterval(function(){
            if(self.currentRunningApplication && self.currentRunningApplication.isFocused()){
                self.currentRunningApplication.refresh();    
            }
        }, this.APP_REFRESH_INTERVAL);
    },
    
    requestRefreshCycle : function(app){
        this.currentRunningApplication = app;
    },
    
    beginVisitorSession : function(id, full){
        var uri = this.element.getAttribute("data-uri");
        var action = new core.http.WebAction(uri||ROUTES.DATA.PROFILE, {});

            action.invoke({
                onSuccess  : this.onVisitorSessionLoaded.bind(this,full),
                onFailure  : this.onVisitorSessionFailure.bind(this),
                onRejected : this.onVisitorSessionFailure.bind(this)
            });
    },
    
    onVisitorSessionFailure : function(r,text){
        console.error("failed to load visitor profile: " + text, r);
    },
    
    onVisitorSessionLoaded : function(full,response, responseText){
        try{
            var data = JSON.parse(responseText);
            if(typeof data == "object"){
                this.storeAccountProfileInSession(data);
                this.setDesktopTheme(data);
            }
        }
        catch(e){
            alert("error downloading users profile");
            console.error(e.message,responseText);
        }
    },
    
    storeAccountProfileInSession : function(data){
        if(Session) {
            Session.State.AccountProfile = data;
            Session.State.CurrentProfile = data;
            this.dispatchEvent("sessionloaded", true, true, {profile:data});
        }
    },

    
    onModalize : function(){},
    
    onReturnToDashboard : function(e){
        this.onResetDesktopView();
        this.blurCurrentRunningApplication(e);
        this.currentRunningApplication = null;
    },
    
    initializeUrlRoutesTable : function(){
        for(var KEY in ROUTES) {
           if(typeof ROUTES[KEY] == "object"){
                core.http.UrlRouter.add(ROUTES[KEY])
           } 
           else if(typeof ROUTES[KEY] == "string"){
               core.http.UrlRouter.add(KEY, ROUTES[KEY])
           }
        }
    },
    
    
    initializeApplicationShortcuts : function(){},
    
    addKeyBoardEventListeners : function(){
        var self=this;
        
        window.addEventListener( "keyup", function(e){
             e.preventDefault();
             
            if(e.keyCode == 39){//RIGHT
                self.dispatchEvent("rightkeyup",true,true,{originalEvent:e});
            } else if(e.keyCode == 37){//LEFT
                self.dispatchEvent("leftkeyup",true,true,{originalEvent:e});
                if(self.currentRunningApplication){return;}
            }
            else if(e.keyCode == 38){//TOP
                self.dispatchEvent("topkeyup",true,true,{originalEvent:e});
                if(self.currentRunningApplication){return;}
            }
            else if(e.keyCode == 40){//BOTTOM
                self.dispatchEvent("bottomkeyup",true,true,{originalEvent:e});
                if(self.currentRunningApplication){return;}
            } 
            else if(e.keyCode == 27){ //ESC
                self.dispatchEvent("esckeyup",true,true,{originalEvent:e});
                self.onReturnToDashboard();
            }
         }, false )
    },
    
    /*getSpinner : function (){
        var el = '<div id="spinner-splash-intro">\
                    <div class="bubblingG">\
                       <span id="bubblingG_1"></span>\
                       <span id="bubblingG_2"></span>\
                       <span id="bubblingG_3"></span>\
                    </div>\
                    <div id="spinner-splash-logo"></div>\
                  </div>'.toHtmlElement();
        return el;
    },*/

    getSpinner : function (){
        var el = '<div id="spinner-splash-intro">\
                    <div class="spinner">\
                      <div class="rect1"></div>\
                      <div class="rect2"></div>\
                      <div class="rect3"></div>\
                      <div class="rect4"></div>\
                      <div class="rect5"></div>\
                    </div>\
                    <div id="spinner-splash-logo"></div>\
                  </div>'.toHtmlElement();
        return el;
    },


    onLaunchWebApplication : function(e){
        this.openApplication(e);
    },
    
    
    openApplication : function(e){
        var appInfo;
        var appID = e.data.appID;
        var appref = e.data.appref;
        if(appID){
           appInfo = this.getWebApplicationInfoById(appID);
        } else if(appref){
            appInfo = this.getWebApplicationInfoByRef(appref);
        }
        
        if(!appInfo) {
            console.warn("There is no application defined for id/ref: " + (appID||appref));
            alert("There is no application defined for id: " + (appID||appref))
            return;
        }
        //this.appsScreen.classList.add("inactive");
        this.globalApplicationSpinner.classList.add("active");
        setTimeout(function(){
            this.doAppLoadTest(e,appInfo);
        }.bind(this),400);
    },
    
    showAppSpinner:function(bool){
        if(bool){
            this.element.classList.add("disabled")
        } else {
            this.element.classList.remove("disabled")
        }
        this.globalApplicationSpinner.classList.add("active");
    },
    
    hideAppSpinner:function(){
        this.element.classList.remove("disabled")
        this.globalApplicationSpinner.classList.remove("active");
    },
    
    showBlankState:function(){
        this.showAppSpinner();
        document.body.style.pointerEvents = "none";
        document.body.style.opacity = "0.5";
    },
    
    hideBlankState:function(){
        this.hideAppSpinner();
        document.body.style.pointerEvents = "auto";
        document.body.style.opacity = "1";
    },
    
    
    getWebApplicationInfoById : function(appId){
        var appdata = this.getApplicationInfoDefinitions();
        return appdata[appId];
    },
    
    getWebApplicationInfoByRef : function(appref){
        appref = appref.replace("/",".","g");
        return {namespace:appref, route:"$."+appref};
    },
    
    doAppLoadTest : function(e,appInfo) {
        var force = (typeof e.data.force == "boolean")?e.data.force:false;
        var self=this;
            self.createApplicationInstance(appInfo, function(appInstance){
                //alert(appInfo.namespace)
                var appContainer = document.querySelector(".running.application-container");
                self.blurCurrentRunningApplication(e,appContainer);
                appContainer.appendChild(appInstance.element);
                self.globalApplicationSpinner.classList.remove("active");
                appContainer.classList.add("active");
                currentApp = null;
                self.dispatchEvent("appopened", true,true, e.data);
            }, force, e);
    },
    
    blurCurrentRunningApplication : function(e, appContainer){
        var appContainer = appContainer||document.querySelector(".running.application-container");
        var currentApp = appContainer.querySelector(".WebApplication");
        if(currentApp){
            currentApp.prototype.onBlur(e);
            appContainer.removeChild(currentApp);
            appContainer.innerHTML = "";
        } else{
            appContainer.innerHTML = "";
        }
        currentApp = null;
    },
    
    createApplicationInstance : function(appInfo, callback, force, e){
        force = (typeof force == "boolean")?force:true;
        var self=this;
        if(!NSRegistry[appInfo.namespace]){
            var c = new core.http.ClassLoader();
                c.open("GET", appInfo.route);
                c.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        var d = new NSRegistry[appInfo.namespace];
                            d.onActivated(e);
                        if(!force){
                            self.storeApplicationInstance(appInfo.namespace, d);
                        }
                        setTimeout(function(){
                            d.onFocus(e);
                            callback(d);
                        },1000);//1000 to fully render 
                    }
                }
                c.send();
        } else {
            if(force == false) {
                var d = this.getApplicationInstance(appInfo.namespace);
                if(!d) {
                    d = new NSRegistry[appInfo.namespace];
                    d.onActivated(e);
                }
                this.storeApplicationInstance(appInfo.namespace, d);
                d.onFocus(e);
                callback(d); return;
            }
            else {
                var d = new NSRegistry[appInfo.namespace];
                    d.onFocus(e);
                    d.onActivated(e);
                callback(d);
            }
        }
    },

    storeApplicationInstance : function(ns, appInstance){
        if(!this.appinstances){
            this.appinstances = {};
        }
        if(!this.appinstances[ns]){
            this.appinstances[ns] = appInstance;
            this.recentAppsSelector.prototype.add(appInstance);
        }  
    },
    
    getApplicationInstance : function(ns){
        console.log("app instance loaded from cache")
        if(!this.appinstances){
            this.appinstances = {};
        }
        return this.appinstances[ns]; 
    },
    
    removeApplicationInstance : function(ns){
        console.log("app instance erased from memory")
        if(!this.appinstances){
            this.appinstances = {};
        }
        delete this.appinstances[ns]; 

        //if(this.getApplicationInstanceCount() <=0){
            var defaultApp = app.constants.DEFAULT_HOME_APP;
            this.dispatchEvent("openapp",true,true,{appref:defaultApp})
        //}
    },

    getApplicationInstanceCount : function(){
        var count=0;
        for(var i in this.appinstances){
            count++
        }
        return count;
    },
    
    onResetDesktopView : function(){
        this.currentRunningApplication=null;
        Session.State.CurrentProfile = Session.State.AccountProfile;
        document.querySelector(".running.application-container").classList.remove("active");
        
        setTimeout(function(){
            this.globalApplicationSpinner.classList.remove("active");
        }.bind(this),50)
    },
    
    
    setDesktopTheme : function(data){
        if("theme" in data){
            var theme = data.theme;
            if(theme){
                var wallpaperNode = this.querySelector("#wallpaper");
                var applicationBar = this.querySelector(".ApplicationBar");
                
                if(theme.whitelabel_logo){}
                if(theme.enable_wallpaper){
                    wallpaperNode.style.backgroundImage="url(" + theme.wallpaper +")";
                } else {
                    wallpaperNode.style.backgroundImage = "none";
                    wallpaperNode.style.backgroundColor = theme.background_color;
                }
                //wallpaperNode.style.opacity = theme.background_brightness;
                var alphaVal = theme.window_alpha.replace(".","");
                applicationBar.classList.add("alpha"+alphaVal);
                
            }
        }
    },

    
    innerHTML:
    '<div>test</div>'
});