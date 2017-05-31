appconfig = window.appconfig||{};

//----------EXTENSIONS----------------
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
                if(source.hasOwnProperty(property)){
                    this[property] = source[property];
                }
            }
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
};


if (!Object.prototype.addChangeListener) {
    Object.defineProperty(Object.prototype, "addChangeListener", {
        enumerable : false,
        configurable : true,
        writable : true,
        value : function(prop, handler) {
            var oldval = this[prop], 
                newval = oldval, 
                getter = function() {
                    return newval;
                }, 
                setter = function(val) {
                    oldval = newval;
                    var self=this;
                    setTimeout(function(){
                        handler.call(self, prop, oldval, val);
                    },100);
                    return newval = val;//handler.call(this, prop, oldval, val);
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
};


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
};

//Uses createDocumentFragment()
if(!String.prototype.toDomElement){
    String.prototype.toDomElement = function () {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = this.toString();
        var df= document.createDocumentFragment();
            df.appendChild(wrapper);
        return df.firstChild;
    }
};

function getVendorPrefixed(prop){
    var i, 
    s = window.getComputedStyle(document.documentElement, ''), 
    v = ['ms','O','Moz','Webkit'];
    if( prop in s) return prop;
    prop = prop[0].toUpperCase() + prop.slice(1);
    for( i = v.length; i--; )
        if( v[i] + prop in s) return (v[i] + prop);
};

if(!String.prototype.toVendorPrefix){
    String.prototype.toVendorPrefix = function(){
        return getVendorPrefixed(this.toString());
    }
};


if(!String.prototype.htmlEscape){
    String.prototype.htmlEscape = function(){
      return String(this)
                .replace(/&/g, '&amp;',"g")
                .replace(/"/g, '&quot;',"g")
                .replace(/'/g, '&#39;',"g")
                .replace(/</g, '&lt;',"g")
                .replace(/>/g, '&gt;',"g"); 
    }
};

if(!String.prototype.htmlUnescape){
    String.prototype.htmlUnescape = function(){
      return String(this)
                .replace(/&amp;/g, '&',"g")
                .replace(/&quot;/g, '\"',"g")
                .replace(/&#39;/g, '\'',"g")
                .replace(/&lt;/g, '<',"g")
                .replace(/&gt;/g, '>',"g"); 
    }
};


if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
};


String.prototype.toLocaleString = function(){
  var key = this.toString();
  if(Session && Session.Localization && Session.State && Session.State.currentLanguage){
    if(Session.Localization[Session.State.currentLanguage]){
      return Session.Localization[Session.State.currentLanguage][key]||
             Session.Localization[Session.State.currentLanguage][key.toLowerCase()]||key;
    } else {
      return key;
    }
  }
  else {
    return key;
  }
};


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


if(!Function.prototype.delay){
  Function.prototype.delay = function(millisec, scope) {
    scope = scope||this;
    // Remove the seconds from the parameters to pass the this function.
    var args = [].slice.call(arguments, 2);
    // Call this function with the specified parameters in the specified amount
    // of seconds.
    var fnThis = this;
    return setTimeout(function() {
      fnThis.apply(scope, args);
    }, millisec);
  };
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


if(!Array.prototype.where){
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
}

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


//--------------LIBS------------------

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

//require core.data.CircularBuffer

function Ecmascript6ClassTranspiler(){};
Ecmascript6ClassTranspiler.prototype.transpile = function(src, doc){
	//if(doc){this.transpileDocument(); return;}
	//if(!src || !src.indexOf("@transpile") >=0){return src;}
	if(src.indexOf("@transpile") == -1) {return src;}

	var func = /(function|[A-Za-z\s?]*)(\([a-zA-Z]*\))\{/gm;
	src = src.replace(func, function(fullmatch, funcName, argments, index, match){
	    return  (/function/gm.test(funcName))? (funcName + argments + "{") : (funcName + " : function" + argments + "{")
	});

	var clsNm = /class\s+([A-Za-z\.]+)[\n\s]*(extends\s([A-Za-z\.]+))?[\s\n]*(with\s+([A-Za-z\.\,\s]+))?\{/gm;
	src = src.replace(clsNm, function(fullmatch, classNm, _extends, ext, withStatement, withClasses){
	    //alert("withClasses: " + withClasses);
	    var inherits = ext? ("'@inherits' : " + ext + ",\n"):"";
	    var mixins = withClasses? ("'@traits' : [" + withClasses + "],\n"):"";
	    return " namespace('" +  classNm + "', {" + inherits + mixins;
	});

	var staticMembers = /static\s+([A-Za-z\s?]*)/gm;
	src = src.replace(staticMembers, function(fullmatch, funcName){
	    return  ("'@static " + funcName.trim() + "'").trim();
	});


	var commaDelemiter = /\}([\n\s]*\b[a-zA-Z\s]*)\:\s*function/gm;
	src = src.replace(commaDelemiter, function(fullmatch, closingCurly){
	    return fullmatch.replace("}","},");
	});

	var cctor = /constructor\s?/gm;
	src = src.replace(cctor, function(fullmatch, argments){
	    return  "initialize"
	});

	var superParent = /super([\.A-Za-z0-9]*)?/gm;
	src = src.replace(superParent, function(fullmatch, superParentStatement){
		//alert(fullmatch);
		if(fullmatch) { return "this.parent"}
	    return ""
	});

	src = src.replace(/['"]\@transpile['"][;]*/,"");

	return src + ");\n";
};

Ecmascript6ClassTranspiler.prototype.transpileDocument = function(){
	var self=this;
	var scripts = document.querySelectorAll("script[type='text/es6']");
		scripts = [].slice.call(scripts,0);
		//alert(scripts.length)
	for (var i=0; i<=scripts.length-1; i++) {
		var _script = scripts[i];
		this.Read(_script.getAttribute("src"), function(src){
			var transpiledSrc = self.Build(src);
			//alert("inline src: \n" + transpiledSrc);
			//script.setAttribute("type", "text/javascript");
			//script.setAttribute("charset", (config.charset || "utf-8"));
			//_script.removeAttribute("src");
			_script.parentNode.removeChild(_script);
			//script.text = transpiledSrc;

			var head   = document.getElementsByTagName("head").item(0);
			var script = document.createElement("script");
				script.setAttribute("type", "text/javascript");
				script.setAttribute("charset", (config.charset || "utf-8"));
				script.text = transpiledSrc;
				head.appendChild(script);
		})
	}
};

Ecmascript6ClassTranspiler.prototype.Build = function(source){
	var self=this;
	var finished = false;
    var reg 	 = /\/\/\=\s*require\s([0-9A-Za-z\-\_\.\/\\]*)/im; ///\'@require\s([0-9A-Za-z\-\_\.\/\\]*)\'/im;
    var usages   = {};

    var code = source;
    do {
    	code = code.replace(reg, function(fullmatch, _namespace, index, match){
            //var path = namespace;//self.ResolvePath(namespace);
            var s;
        	//if(!usages[path]) {
				//usages[path] = true;
				self.TryRead(_namespace, function(src){
					s = src;
				}, function(failure){s=failure});
			//} else {s=""}
            return s||"";
        });
        finished = (!reg.test(code)) ? 1:0; 
    }
    while (!finished);
    return code
};

Ecmascript6ClassTranspiler.prototype.ResolvePath = function(nsPath){
    var path = (/\.js$/.test(nsPath)) ? 
    	nsPath : "src/" + (nsPath.replace(/\./ig, "/") + ".js");
    return path;
};


Ecmascript6ClassTranspiler.prototype.Read = function(path, cbSuccess, cbFailure){
  var self=this;
  var oXMLHttpRequest = new XMLHttpRequest;
  		try {
	        oXMLHttpRequest.open("GET", path, false);
	        oXMLHttpRequest.setRequestHeader("Content-type", "text/javascript");
	        oXMLHttpRequest.onreadystatechange  = function() {
	            if (this.readyState == XMLHttpRequest.DONE) {
	                if(this.status == 200 || this.status == 0) {
	                  var _src=this.responseText;
	                  if(_src && _src.length > 0){
	                      _src = self.transpile(_src);
	                      cbSuccess(_src);
	                  }
	                  else{
	                    cbFailure? cbFailure(_src,oXMLHttpRequest):null;
	                  }
	                }
	                else {
	                  cbFailure? cbFailure(this.statusText,this):null;
	                }
	            }
	         }
	         oXMLHttpRequest.send(null);
     	} catch(e){
     		console.warn(e.message + ": " + path)
     		//alert(e.message + ": " + path)
     		cbFailure? cbFailure(null,oXMLHttpRequest):null;
     	}
};


Ecmascript6ClassTranspiler.prototype.TryRead = function(_namespace, cbS, cbF){
  var self = this;
  var paths = [];
  if(/\.js$/.test(_namespace)){
  	paths.push(_namespace);
  } else{
	  var classname_path = ("src/" + _namespace.replace(/\./g,"/") + ".js");
	  var filename_path  = ("src/" + _namespace.replace(/\./g,"/") + "/index.js");
	  paths.push(classname_path);
	  paths.push(filename_path);
  }
  var used = [];
  var success=false;
  var src = "";

  var succCb = function(_src){//success
    src = _src;
    success = true;
  };

  var failCb = function(_src){//failure
    success = false;
  };

  for(var i=0; i<=paths.length-1; i++){
    var path = paths[i];
    if(used.indexOf(path) >=0){continue}
    used.push(path);
    this.Read(path,succCb,failCb);
    if(success) {break;}
  };

  success ? 
    cbS(src): 
    cbF("//Unable to load <" + _namespace + "> from: " + paths.join(" Or "));
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
            inheritTraits(klass.prototype, traits);
            inheritProperties(klass.prototype, properties);
            klass.prototype.constructor = klass;
            klass.prototype.ancestor = obj;
            inheritStaticMembers(klass, obj, properties);
            // inheritTraits(klass.prototype, traits);
        }
        return klass;
    };

    var inheritStaticMembers = function(klass, ancestor, properties){
        for(var key in ancestor) {
            if(ancestor.hasOwnProperty(key)) {
                klass[key] = ancestor[key];
            }
        }
        for(var key in properties) {
            if(key.indexOf('@static ')>=0 && properties.hasOwnProperty(key)) {
                var propName = key.split(/\s+/)[1];
                klass[propName] = properties[key];
            }
        }
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
                            script.setAttribute("charset", (appconfig.charset || "utf-8"));
                            var _src=this.responseText;
                            //if(_src.indexOf("class") >=0){
                                //debugger;
                                var ecmaTranspiler = new Ecmascript6ClassTranspiler;
                                _src = ecmaTranspiler.transpile(_src);
                                _src = ecmaTranspiler.Build(_src);
                                //alert(_src)
                            //}
                            script.text = _src;
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
            path = path.replace("./", apppath + this.namespace.replace(/\./gim,"/") + "/");
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
        meth = meth||"GET";
        return meth;
    },
    
    getParameterSeperator : function(url){
        var sep = (url.indexOf("?")>=0)?"&":"?";
        return sep;
    }
});


namespace("core.http.XMLHttpRequest", {
    '@inherits': core.http.ResourceLoader,
    
    
    initialize : function(){
        this.async = true;
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        return this;
    },
    
    addEventListener : function(type, handler, capture){
        capture = (typeof capture == "boolean") ? capture:false;
        this.oXMLHttpRequest.addEventListener(type, handler, capture);
    },
    
    /*open : function(method, path , async){
        this.method = method||this.getDefaultMethod();
        var url = this.parent(this.method, path , async);
        if(this.method.toLowerCase() == "get"){
            url = url + this.getParameterSeperator(url) + (this.params?toQueryString(this.params):"");
        }

        this.oXMLHttpRequest.open(this.method, url, ((typeof async == "boolean")?async:true));
    },*/

    open : function(method, path , async, params){
        async   = ((typeof async == "boolean")?async:this.async);
        method  = method||this.getDefaultMethod();
        
        //path    = core.http.UrlRouter.resolve(path||this.uri);
        //path    = path + this.createQueryString(method,path,this.params);
        this.async  = async;
        this.method = method;
        this.params = params||{};
        path = this.buildPath(path);

        this.oXMLHttpRequest.open(method, path, async);
        return this;
    },

    buildPath : function(path){
        path = core.http.UrlRouter.resolve(path||this.uri);
        if(/\{([a-zA-Z0-9\.]+)\}/g.test(path)){
            path = this.createRESTfulUrl(path)
        }
        else{
            path  = path + this.createQueryString(this.method,path,this.params);
        }
        return path;
    },

    createRESTfulUrl : function(path){
        var self=this;
        path = path.replace(/\{([a-zA-Z0-9\.]+)\}/g, function(){
          var propName = arguments[1];
          return (self.params[propName]||eval(propName)||"")
        });

        return path;
    },

    createQueryString : function(method, url, params){
        if(appconfig.environment == "dev" && method == "GET"){
            return this.getParameterSeperator(url) + (params?toQueryString(params):"");
        } else {
            return "";
        }
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
        this.async = true;
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        return this;
    },
    
    addEventListener : function(type, handler, capture){
        capture = (typeof capture == "boolean") ? capture:false;
        this.oXMLHttpRequest.addEventListener(type, handler, capture);
    },
    
    /*open : function(method, path , async){
        this.method = method||this.getDefaultMethod();
        var url = this.parent(this.method, path , async);
        if(this.method.toLowerCase() == "get"){
            url = url + this.getParameterSeperator(url) + (this.params?toQueryString(this.params):"");
        }

        this.oXMLHttpRequest.open(this.method, url, ((typeof async == "boolean")?async:true));
    },*/

    open : function(method, path , async, params){
        async   = ((typeof async == "boolean")?async:this.async);
        method  = method||this.getDefaultMethod();
        
        //path    = core.http.UrlRouter.resolve(path||this.uri);
        //path    = path + this.createQueryString(method,path,this.params);
        this.async  = async;
        this.method = method;
        this.params = params||{};
        path = this.buildPath(path);

        this.oXMLHttpRequest.open(method, path, async);
        return this;
    },

    buildPath : function(path){
        path = core.http.UrlRouter.resolve(path||this.uri);
        if(/\{([a-zA-Z0-9\.]+)\}/g.test(path)){
            path = this.createRESTfulUrl(path)
        }
        else{
            path  = path + this.createQueryString(this.method,path,this.params);
        }
        return path;
    },

    createRESTfulUrl : function(path){
        var self=this;
        path = path.replace(/\{([a-zA-Z0-9\.]+)\}/g, function(){
          var propName = arguments[1];
          return (self.params[propName]||eval(propName)||"")
        });

        return path;
    },

    createQueryString : function(method, url, params){
        if(appconfig.environment == "dev" && method == "GET"){
            return this.getParameterSeperator(url) + (params?toQueryString(params):"");
        } else {
            return "";
        }
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
    
    
    initialize : function(uri, params, config, async){
        this.parent(uri, params);
        this.uri = uri;
        this.params = params;
        this.config=config||{};
        this.async=((typeof async == "boolean")?async:true);;
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
        if(/\{([a-zA-Z0-9\.]+)\}/g.test(path)){
            path = this.createRESTfulUrl(path)
        }
        else{
            path  = path + this.createQueryString(this.method,path,this.params);
        }
        return path;
    },

    createRESTfulUrl : function(path){
        var self=this;
        path = path.replace(/\{([a-zA-Z0-9\.]+)\}/g, function(){
          var propName = arguments[1];
          var propval = "";
          try{
            propval = eval(propName);
          } catch(e){propval=""};
          
          return (self.params[propName]||propval)
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
                        if(typeof data != "object"){
                            this.onReject(r,data);
                       } else {
                            if (data) {
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
    
    onReject : function(xhr){
        if(this.options.onReject) {this.options.onReject(xhr); }
        application.dispatchEvent("notification",true,true,{
            type:"UserError",
            message:("An http error occurred:\n" + xhr.responseText),
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
        this.configureDataMappings({
            total:"total", 
            count:"count"
        });
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
        /*var count = this.data_mapping.count||this.params.count;
        return count;*/
        var count_json_path = this.data_mapping.count;
        var f = new Function("$", "return $." + count_json_path);
        return f(this.data);
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
        var total_json_path = this.data_mapping.total;
        var f = new Function("$", "return $." + total_json_path);
        return f(this.data);
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
    }

    
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

namespace("core.http.ClassLoader", 
{
    '@traits': [new Observer],

    initialize : function(){
        this.observations = [];
        this.subscribers  = {};
        return this;
    },
    
    load : function(_namespace,filepath) {
        var self = this;
        var src;
        //var nsPath = filepath?filepath:("src/" + _namespace.replace(/\./g,"/") + ".js");
        var cbSuccess = function(src){
            src = es6Transpiler.Build(src);
            var head   = document.getElementsByTagName("head").item(0);
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("charset", (config.charset || "utf-8"));
            script.text = src;
            head.appendChild(script);
            if(NSRegistry[_namespace]) {
                var data = {Class: NSRegistry[_namespace], source: src, path: filepath};
                self.dispatchEvent("load", data, self)
            } else {
                
            }
        };

        var cfFailure = function(src, xhr){
            self.dispatchEvent("fail", xhr, self)
        }
        var es6Transpiler = new Ecmascript6ClassTranspiler();
            filepath?
                es6Transpiler.Read(filepath,cbSuccess, cfFailure):
                es6Transpiler.TryRead(_namespace,cbSuccess, cfFailure);

            
    }
});


/*********************************************************************
 ::USAGE::
 
    var c = new core.http.ClassLoader;
    
    c.addEventListener("load", function(data){
        console.info(data)
    });
    c.addEventListener("fail", function(){
        alert("failed")
    });
    
    c.load("com.Employee")
 **********************************************************************/



namespace("core.http.ScriptLoader", 
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
 
    var c = new core.http.ScriptLoader();
    c.open("GET", "apps/Desktop/main.js");
    c.onreadystatechange = function(){
        if(this.readyState == 4){
            alert(apps.Desktop) //apps.Desktop object should exist
        }
    }
    
    c.send();
 **********************************************************************/

namespace("core.http.Router", {
    initialize : function(){
        this.routes = {};    
    },

    process : function(ROUTES){
        for(var KEY in ROUTES) {
           if(typeof ROUTES[KEY] == "object"){
                this.add(ROUTES[KEY])
           } 
           else if(typeof ROUTES[KEY] == "string"){
               this.add(KEY, ROUTES[KEY])
           }
        }
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

namespace("core.traits.EventBus", {
	subscribers : {},
	observers:[],

	initialize : function(host){
		this.host = host;
		this.host.bus = this;
	},
	
	addEventListener : function(eventName, cb){
		if(!this.subscribers[eventName]){
			this.subscribers[eventName] = [];
		}
		this.subscribers[eventName].push({name:eventName, callback:cb});
	},
	
	dispatchEvent : function(eventName, bubbles, cancelable, data, scope) {
        scope = (scope||this.host||this||window);
        var ns = scope.namespace||"";
        	ns = ns.length > 0 ? (ns + "::"):ns;
        var observers = this.subscribers[ns+eventName]||[];
        for(var i=0; i<=observers.length-1; i++){
        	var observer = observers[i];
        	observer.callback.call(scope, data); 
        } 
   },
   
   removeEventListener : function(eventName, callback){
        var observers = this.subscribers[eventName]||[];
        for(var i=0; i<=observers.length-1; i++){
        	var observer = observers[i];
        	if(observer.name == eventName && observer.callback == callback) {
        		observers.splice(i,1);
        	}
        }
    }
});

namespace("core.traits.ResourcePathTransformer");

core.traits.ResourcePathTransformer = {
    resourcepath : function (filepath, ns){
        filepath = filepath||"";
        var apppath = appconfig.apppath||"";
        filepath = filepath.replace("[$theme]", ("themes/"+appconfig.theme));
        filepath = filepath.replace("[$icon]",  ("themes/"+appconfig.theme) + "/images/icons/");

        var path = apppath + filepath;
        return this.relativeToAbsoluteFilePath(path, ns);
    },
    
    relativeToAbsoluteFilePath : function(path, ns){
        var apppath = appconfig.apppath? (appconfig.apppath + "/") : "";
        ns = ns||this.namespace;

        if(path.indexOf("~/") >= 0){
            path = path.replace("~/", apppath);
        } else if(path.indexOf("./") >= 0){
            path = path.replace("./", apppath + ns.replace(/\./gim,"/") + "/");
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
};

namespace("core.traits.InitializeApplicationData");

core.traits.InitializeApplicationData = {
	initialize : function () {
        this.parent();
		this.onDownloadApplicationData();
	},

	onDownloadApplicationData : function(){
        application.db = {};
        application.db.user = core.data.StorageManager.get("db.user");
        Session.user = application.db.user;
        application.dispatchEvent("ready", true, true, {});
    }
};

namespace("core.EventBus");
core.EventBus = {
	subscribers : {},
	observers:[],
	
	addEventListener : function(eventName, cb){
		if(!this.subscribers[eventName]){
			this.subscribers[eventName] = [];
		}
		this.subscribers[eventName].push({name:eventName, callback:cb});
	},
	
	dispatchEvent : function(eventName, bubbles, cancelable, data, scope) {
        scope = (scope||this||window);
        var observers = this.subscribers[eventName]||[];
        for(var i=0; i<=observers.length-1; i++){
        	var observer = observers[i];
        	observer.callback.call(scope, data); 
        } 
   },
   
    removeEventListener : function(eventName, callback){
        var observers = this.subscribers[eventName]||[];
        for(var i=0; i<=observers.length-1; i++){
        	var observer = observers[i];
        	if(observer.name == eventName && observer.callback == callback) {
        		observers.splice(i,1);
        	}
        }
    }
};


namespace("core.data.StorageManager");
core.data.StorageManager = {
  isInitialized : false,

  initialize : function(key){
    if(this.isInitialized){
      console.warn("core.data.StorageManager: already initialized");
      return this;
    } else {
      this.key=key;
      var str = localStorage.getItem(key)||"{}";
      this.data = JSON.parse(str);
      this.initStorageCapacity();
      this.startCapacityCheckTimer();
      if(Config.StorageManager.DO_CAPACITY_CHECK_ON_STARTUP){
        this.thresholdCapacityCheck();
      }
      this.isInitialized=true;
    }
  },

  startCapacityCheckTimer : function(){
    var self=this;
    this.timer = setInterval(function(){
      self.thresholdCapacityCheck();
    },Config.StorageManager.CAPACITY_CHECK_TIMER_INTERVAL);
  },
  
  initStorageCapacity : function(){
    var str = JSON.stringify(this.data);
    var byt = str.length*2;
    var kbs = byt/1024;
    var mbs = kbs/1024;
    var max = Config.StorageManager.PARTITION_SIZE;
    this.size = {
      used : kbs,
      free : max-kbs, //4,800kb
      total: max
    };
    core.EventBus.dispatchEvent("storage:changed", true, true, this.size, this);
  },


  reset : function(ns, persist){
      persist = (typeof persist=="boolean")?persist:false;
      if(!this.data) { this.data = {}};
      this.data[ns] = null;
      delete this.data[ns];
      if(persist){
        this.persist();
      }
      this.initStorageCapacity();
  },

  clean : function(){
    localStorage.setItem(this.key,"{}");
    var str = localStorage.getItem(this.key)||"{}";
    this.data = JSON.parse(str);
    this.initStorageCapacity();
  },
  
  find : function(ns, id){
    return this.data[ns]||[];
  },
  
  commit : function(){
      this.persist();
  },

  getKBytes : function(obj){
    if(!obj){return 0;}
    var byt = JSON.stringify(obj).length*2;
    return byt/1024;//in kb
  },

  canFit : function(obj){
    if(!obj) { return true}
    var kbs = this.getKBytes(obj);
    if(kbs > this.size.free){
      return false;
    }
    return true;
  },

  exceedsTotalQuota : function(obj){
    var kbs = this.getKBytes(obj);
    return kbs > this.size.total;
  },

  thresholdCapacityCheck : function(obj){
    var val = this.size.used/this.size.total;
    if(val >= Config.StorageManager.WARNING_THRESHOLD_CAPACITY) {
      alert(Config.StorageManager.CAPACITY_WARNING_MSG);
    }
  },

  set : function(ns, obj, persist){
    persist = typeof persist=="boolean"?persist:false;
    if(this.canFit(obj)){
      this.data[ns] = obj;
      (persist && this.persist());
      this.initStorageCapacity();
    } else {
      console.warn("Object cannot fit into storage space");
    }
  },

  get : function(ns){
    return this.data[ns];
  },

  persist : function(){
    try {
        localStorage.setItem(this.key, JSON.stringify(this.data))
    } catch(e){
        console.error(e);
    }
  },
  
  store : function(ns, obj, persist){
    this.data[ns] = (this.data[ns]||[]);
    
    if(this.canFit(obj)) {      
      this.data[ns].unshift(obj);
      (persist && this.persist());
      this.initStorageCapacity();
    } else {
      if(!this.exceedsTotalQuota(obj)) {
        if(this.data[ns].length > 0){
          console.warn("STORAGE SPACE LIMIT: New data will be stored at the head, the oldest item will be popped off the tail end.");
          this.data[ns].pop();
          this.initStorageCapacity();
          this.store(ns, obj, persist);
        } else {
          throw new Error("The object/data being stored is larger than the total capacity of the allocated localStorage space of: " + this.size.total + "kb")
        }
      }
      else {
        throw new Error("The object/data being stored is larger than the total capacity of the allocated localStorage space of: " + this.size.total + "kb")
      }
    }
  },

  
  remove : function(ns, persist){
    persist = typeof persist=="boolean"?persist:false;
    var ref = this.data[ns];
    var self=this;
    if(ref){
      return {
        all : function(){
          self.data[ns] = null;
          if(persist){
            core.data.StorageManager.persist();
          }
          core.data.StorageManager.initStorageCapacity();
        },

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
            core.data.StorageManager.persist();
          }
          core.data.StorageManager.initStorageCapacity();
        }
      };
    }
    return {
        where : function(exp){
            return []
        },
        all : function(){
          return true;
        }
    };
  }
};

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

/*!
 * JavaScript Cookie v2.1.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init (converter) {
        function api (key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                    attributes.path    && '; path=' + attributes.path,
                    attributes.domain  && '; domain=' + attributes.domain,
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var name = parts[0].replace(rdecode, decodeURIComponent);
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                        cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api(key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));

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

/**
 * The UrlHashState constructor runs during parent app initialize().
 * It is triggered before the app is unloaded or when app is first loaded.
 * It detects any hash/fragments in the url and will auto-launch the
 * matching app with params.
 *
 * @example
 * A url like this, when pasted into the address bar and executed will trigger the UrlHashState
 * trait to spawn up a new instance of the app, apps/SearchResults and pass inthe keyword
 * params into the app.
 */

UrlHashState = {
    initialize : function(){
      var self=this;
       this.parent();
       //this.addEventListener('showdashboard', this.onReturnToDashboardHash.bind(this), false);
       this.addEventListener("appopened", this.onApplicationOpened2.bind(this), false);
       this.initializeURLHashing();
       window.onbeforeunload = function () {
           /*if(self.isLoggedIn) {
               return "Exit? If you leave now, any unsaved data will be lost."
           }
           else{
                
           }*/
       }
    },
    
    onApplicationOpened2 : function(e){
        window.location.hash = rison.encode(e.data);   
    },
    
    initializeURLHashing : function(){
        var self=this;
        var defaultHashPath = rison.encode({appref:app.constants.DEFAULT_HOME_APP});
        this.addEventListener("statechanged", function(){
            var currentHash = window.location.hash||"";
                currentHash = currentHash.replace("#","");
            var appinfo;

            if(currentHash.indexOf("?")==0){
              var json = self.QueryStringToJSON(currentHash.substr(1));
              var encodedVal = rison.encode(json);
              currentHash = encodedVal;
            }
            
            try {
              appinfo = rison.decode(decodeURIComponent(currentHash));
            } catch(e){
              if(!appinfo || !appinfo.appref){
                window.location.hash=defaultHashPath;
              }
            }

            if(appinfo && appinfo.appref && appinfo.appref.length>0){
              var ns = appinfo.appref.replace("/",".");
              var app = self.currentRunningApplication;
              if(!app || app.namespace != ns){
                  self.dispatchEvent("openapp",true,true,appinfo)
              }
              else if(app && app.namespace == ns){
                    app.onResume({data:appinfo})
                  //self.dispatchEvent("openapp",true,true,appinfo)
              }
            }
        }, false);

        // var h = window.location.hash;
        // if(!h||(h && h.length <=0)){
        //     window.location.hash = defaultHashPath;
        // }
    },


    QueryStringToJSON : function(qs) {
      qs = qs || location.search.slice(1);

      var pairs = qs.split('&');
      var result = {};
      pairs.forEach(function(pair) {
          var pair = pair.split('=');
          var key = pair[0];
          var value = decodeURIComponent(pair[1] || '');

            if( result[key] ) {
                if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                    result[key].push( value );
                } else {
                    result[key] = [ result[key], value ];
                }
            } else {
                result[key] = value;
            }
        });

        return JSON.parse(JSON.stringify(result));
    },
    
    
    onReturnToDashboardHash : function(e){
        var defaultHashPath = rison.encode({appref:app.constants.DEFAULT_HOME_APP});
        window.location.hash = defaultHashPath;
    } 
};

namespace("core.traits.Paginator", {
    '@traits' : [new Observer],

    initialize : function (options) {
        this.data = options.data;
        this.pageSize = options.pageSize;
        this.currentPage=("currentPage" in options)? options.currentPage:0;
    },

    next : function(){
        if(this.currentPage==this.totalpages()){this.currentPage--};
        var d = this.data.slice(this.currentPage*this.pageSize, (this.currentPage+1)*this.pageSize);
        this.currentPage++;
        this.dispatchEvent("change", {type: "next", currentPage:this.currentPage});
        this.dispatchEvent("next", {currentPage:this.currentPage});
        return d;
    },

    update : function(){
        var d = this.data.slice((this.currentPage-1)*this.pageSize, (this.currentPage)*this.pageSize);
        this.dispatchEvent("change", {type: "next", currentPage:this.currentPage});
        return d;
    },

    previous : function(){
        if(this.currentPage<=1){this.currentPage=1;}
        else{this.currentPage--}
        var previousPage = this.currentPage;
        var d = this.data.slice((previousPage*this.pageSize)-this.pageSize, (previousPage)*this.pageSize);
        this.dispatchEvent("change", {type: "previous", currentPage:this.currentPage});
        this.dispatchEvent("previous", {currentPage:this.currentPage});
        return d;
    },

    pagenumber : function(){
        return this.currentPage;
    },

    totalpages : function(){
        return Math.ceil(this.data.length/this.pageSize);
    },

    totalrecords : function(){
        return this.data.length;//Math.ceil(this.data.length/this.pageSize);
    },

    islastpage : function(){
        return this.currentPage >= this.totalpages();
    },

    isfirstpage : function(){
        return this.currentPage <= 1;
    },

    resetindex : function(){
        this.currentPage = 0;
    },

    first : function(){
        this.resetindex();
        this.dispatchEvent("change", {type: "first", currentPage:this.currentPage});
    },

    last : function(){
        this.currentPage = this.totalpages();
        this.dispatchEvent("change", {type: "last", currentPage:this.currentPage});
    },

    resizepage : function(size){
        this.pageSize = size || this.pageSize;
        this.resetindex();
        this.dispatchEvent("change", {type: "resize", currentPage:this.currentPage});
    },

    pagesize : function(){
        return this.pageSize;
    }
});



//-------------------MODELS--------------------
namespace("core.vo.Model", {
	initialize : function (data) {
		this.data = data;
		
		if(this.data && !"id" in this.data){
			this.data.id = Math.uuid(8);
		}

		for(var key in this.data){
			if(this.data.hasOwnProperty(key)){
				this[key] = this.data[key];
			}
		}
		return this;
	},

	isValid : function(){
		return true;
	},

	value : function(){
		return this.data;
	},

	getBlankCopy : function(){
		for(var key in this.data){
			if(this.data.hasOwnProperty(key)){
				this.data[key] = "";
			}
		}
		/*for(var key in data){
			if(data.hasOwnProperty(key)){
				this.data[key] = data[key];
			}
		}*/
		this.data.id = Math.uuid(8);
		return this.data;
	}
})



namespace("core.vo.Account", {
	'@inherits' : core.vo.Model,

	initialize : function (data) {
		if(!data) {return}
		this.parent(data);
		if(!this.data.last_login_date) {
			this.data.last_login_date = new Date().getTime();
		}
	},

	isValid : function(){
		if(!this.data || 
		   !this.data.last_login_date || 
		   !this.data.username) {
			return false;
		}
		else {
			var lastDate = new Date(this.data.last_login_date);
			var today = new Date();
			var millisec = today - lastDate;
			//var minutes = (millisec / (1000 * 60)).toFixed(1);
			var timeout = Session.State.Timeout||"20 mins";
			var timeout_regx = timeout.match(/([0-9]+)\s([A-Za-z]+)/);
			var duration;
			var unitType = timeout_regx[2];
			var unitVal = parseInt(timeout_regx[1]);

			if(unitType.indexOf("day")>=0){
				duration = Math.round(millisec / 86400000); // days
			}
			else if(unitType.indexOf("min")>=0){
				duration = (millisec / (1000 * 60)).toFixed(1); //minutes
			}
			else if(unitType.indexOf("hour")>=0){
				duration = Math.round((millisec % 86400000) / 3600000); // hours
			}
			else {
				duration = (millisec / (1000 * 60)).toFixed(1); //minutes
			}
			if(duration > unitVal){
				return false;
			}
			else {
				return true;
			}
		}
	},

	touch : function(){
		this.data.last_login_date = new Date().getTime();
		core.data.StorageManager.commit();
	}
});



//----------------CONTROLLERS------------------


namespace("core.controllers.DataController", {
    '@datatype' : core.vo.Model,
    '@traits'   : [Observer.prototype],
    observations : [],
    subscribers  : {},
    //'@imports'  : ["~/src/core/traits/localStorageData.js"],


    initialize : function(host, async){
        var self=this;
        this.host = host;
        this.async = typeof async == "boolean"?async:false;
        return this;
    },

    load : function(uri, params){
        var self=this;
            params=params||{};
        var a = new core.http.WebAction(uri,params,{},this.async);
        a.invoke({
            onSuccess  : this.onDownloaded.bind(this),
            onFailure  : this.onDownloadFailure.bind(this),
            onRejected : this.onDownloadFailure.bind(this)
        })
    },

    getRouteConfig : function(){
        return this.CONFIG ?
            this.CONFIG.config : null;
    },

    getData : function(){
        var config = this.getRouteConfig();
        var table_name = config ? config.table:this.table;

        return application.db[table_name];
    },

    setData : function(name,data){
        this.table = name;
        application.db[name] = data;
    },

    onDownloaded : function(r, responseText){
        try{
            try{
                var data = JSON.parse(responseText);
            }
            catch(e) {
                console.error(e.message, e);
            }
            if(data){
                this.onDataReceived(data, r);
            }
        }
        catch(e){
            //alert("error downloading " + this.namespace + " data");
            console.error(e.message,responseText)
        }
    },

    onDataReceived : function(data, xhr){
        var self=this;
        //this.table_name = data.table;
        data = this.onInitializeModelDataObjects(data);
        this.setData(data.table, data);

        data = this.getData();

        //this.data = application.db[data.table] = this.onInitializeModelDataObjects(data);

        this.paginator = new core.traits.Paginator({
            data : data.items,
            pageSize : 3,
            currentPage:0
        });

        if(this.host){
            if(this.host.onDownloadComplete){
                setTimeout(function(){
                    self.host.onDownloadComplete(data, self);
                },100);
            }
            else {
                console.warn(this.host.namespace + " should implement #onDownloadComplete(data) to be notified when the data controller has loaded it's data and ready for use.");
            }
        }
    },

    onInitializeModelDataObjects : function(data){
        /*var tablename = data.table;
        var items = data.items||[];
        for(var i=0; i<=items.length-1; i++) {
            var item = items[i];
            var Model = this['@datatype'];
            var modelObject = new Model(item);
            data.items.splice(i,1, modelObject);
        }
        debugger;*/
        return data;
    },

    onDownloadFailure : function(r, responseText){
        //alert("error downloading " + this.namespace + " data");
        console.error("onDownloadFailure(): ", responseText)
    },

    getItemById : function (id) {
        var data = this.getData();
        if(data){
            var items = data.items;
            var item = null;

            for(var i=0; i<=items.length-1; i++) {
                item = items[i];
                if(item && item.id == id) {
                    break;
                }
            }
            return item;
        }
    },

    getItemCopy : function(){
        var data = this.getData();
        var data_COPY = {};
        var item = data.items[0];
        for(var key in item){
            if(item.hasOwnProperty(key)){
                data_COPY[key] = item[key];
            }
        }
        return data_COPY;
    },

    getItemByIndex : function(index){
        var data = this.getData();
        return data.items[index]
    },

    sort : function(attrb, sorterFunc){
        var data = this.getData();
        sorterFunc = sorterFunc||function (a, b) {
          if (a[attrb] > b[attrb]) {
            return 1;
          }
          if (a[attrb] < b[attrb]) {
            return -1;
          }
          // a must be equal to b
          return 0;
        };

        console.info("sorting items by column attrb: " + attrb)
        data.items.sort(sorterFunc);
    },

    insert : function(obj){
        var data = this.getData();
        if(!obj instanceof this['@datatype']) {
            throw new Error("<obj> being inserted should be of type <core.vo.Model> or an object that inherits from it.");
        } 
        else {
            if(obj.isValid()){
                var val = obj.value();
                if(!val.id){
                    val.id = Math.uuid(8);
                }
                data.items.push(obj.value());
                application.bus.dispatchEvent("insert", true, true, val, this);
                this.dispatchEvent("insert", val, this);
                return obj.value();
            }
        }
    },

    getFilteredDataset : function(column_name, value){
        var data = this.getData();
        value = (value||"").toLowerCase();
        var dataset = JSON.parse(JSON.stringify(data));
        dataset.items = [];
        if(data){
            var items = data.items;
            var item = null;

            for(var i=0; i<=items.length-1; i++) {
                item = items[i];
                if(item) {
                    var val = (item[column_name]||"").toLowerCase();
                    if(val.indexOf(value) >=0){
                        dataset.items.push(item);
                    }
                }
            }
        };

        function updateColumnFilterValue(dataset, column_name, value){
            for(var j=0; j<=dataset.columns.length-1; j++ ){
                var column = dataset.columns[j];
                if(column.path == column_name){
                    column.filter.value = value;
                }
            }
            return dataset;
        };

        dataset = updateColumnFilterValue(dataset, column_name, value);
        return dataset;
    },

    getEmptyDataSet : function(){
        var dataset = JSON.parse(JSON.stringify(this.getData()));
        dataset.items = [];
        return dataset;
    },

    remove : function(id, items){
        var data = this.getData();
        items = items||data.items;
        var item = null;
        var removed=false;

        for(var i=0; i<=items.length-1; i++) {
            item = items[i];
            if(item && item.id == id) {
                data.items.splice(i,1);
                this.dispatchEvent("removed", item, this);
                removed = true;
                break;
            }
        }
        return removed;
    },

    update : function(sourceObj){
        var existingObj = this.getItemById(sourceObj.id);
        existingObj.extend(sourceObj);
        return existingObj;
    },

    removeByQuery : function(query){
        var data  = this.getData();
        var items = data.items.where(query);
        for(var i=0; i<=items.length-1; i++){
            var item = items[i];
            var inx = data.items.indexOf(item);
            if(inx>=0){
                data.items.splice(inx,1);
            }
        }
        this.dispatchEvent("removed", true, this);
    }
});



namespace("core.controllers.AccountDataController", {
    '@inherits' : core.controllers.DataController,
    CONFIG:ROUTES.DATA.ACCOUNTS,

	initialize : function(host, async){
		this.parent(host, async);
		if(!this.getData()){
			this.load(this.CONFIG);
		}
	},

	getUserByRole : function(role){
		if(this.getData()){
			var items = this.getData().items;
			var item = null;
			var found = null;

			for(var i=0; i<=items.length-1; i++) {
				item = items[i];
				if(item) {
					if(item.role.toLowerCase() == role.toLowerCase()) {
						found = item;
						break;
					}
				}
			}
			return found;
		}
	},
	
	getCurrentUser : function(){
		return this.getUserById(Session.user.id);
	},

	getUserById : function(id){
		if(this.getData()){
			var items = this.getData().items;
			var item = null;
			var found = null;

			for(var i=0; i<=items.length-1; i++) {
				item = items[i];
				if(item) {
					if(item.id == id) {
						found = item;
						break;
					}
				}
			}
			return found;
		}
	},

	getUserByAccount : function(username, password){
		console.info("Searching for a user by username, password");
		if(this.getData()){
			var items = this.getData().items;
			var item = null;
			var found = null;

			for(var i=0; i<=items.length-1; i++) {
				item = items[i];
				if(item) {
					if(item.username == username && item.password == password) {
						found = item;
						break;
					}
				}
			}
			return found;
		}
	},

	getAllUsers : function(){
		var items = this.getData().items;
		return items||[];
	}
});



namespace("core.controllers.LocalStorageDataController", {
    '@inherits' : core.controllers.DataController,


    initialize : function(host, async){
        this.parent(host, async);
        if(!this.getData()){
			this.load(this.CONFIG);
		}
    },

    load : function(uri, params){
        try{
        	var results_array = core.data.StorageManager.find(this.getRouteConfig().table);
        	this.onDownloaded(null,results_array);
    	} catch(e){
    		this.onDownloadFailure();
    	}
    },

    getRouteConfig : function(){
        return this.CONFIG ?
            this.CONFIG.config : null;
    },

    getData : function(){
        var config = this.getRouteConfig();
        var table_name = config ? config.table:this.table;

        return application.db[table_name];
    },

    setData : function(name,data){
        this.table = name||this.getRouteConfig().table;
        application.db[this.table] = data;
    },

    onDownloaded : function(r, results_array){
        try{
            try{
                var dataset = {
                	table : this.getRouteConfig().table,
                	columns : [],
                	items : results_array||[]
                }
            }
            catch(e) {
                console.error(e.message, e);
            }
            if(dataset){
                this.onDataReceived(dataset, r);
            }
        }
        catch(e){
            console.error(e.message,responseText)
        }
    },

    onDataReceived : function(data, xhr){
        var self=this;
        
        this.setData(data.table, data);
        data = this.onInitializeModelDataObjects(this.getData());

        this.paginator = new core.traits.Paginator({
            data : data.items,
            pageSize : 3,
            currentPage:0
        });

        if(this.host){
            if(this.host.onDownloadComplete){
                setTimeout(function(){
                    self.host.onDownloadComplete(data, self);
                },100);
            }
            else {
                console.warn(this.host.namespace + " should implement #onDownloadComplete(data) to be notified when the data controller has loaded it's data and ready for use.");
            }
        }
    },

    onInitializeModelDataObjects : function(data){
        /*var tablename = data.table;
        var items = data.items||[];
        for(var i=0; i<=items.length-1; i++) {
            var item = items[i];
            var Model = this['@datatype'];
            var modelObject = new Model(item);
            data.items.splice(i,1, modelObject);
        }
        debugger;*/
        return data;
    },

    onDownloadFailure : function(r, responseText){
        console.error("onDownloadFailure(): ", responseText)
    },

    insert : function(newDoc){
        var data = this.getData();
        if(newDoc){
            newDoc.id = newDoc.id||this.UUID();
            var exist = data.items.where("$.id == '" + newDoc.id + "'")[0];
            if(!exist) {
                data.items.push(newDoc);
                //core.data.StorageManager.store(this.getRouteConfig().table, newDoc);
                core.data.StorageManager.set(this.getRouteConfig().table, data.items);
                core.data.StorageManager.commit();
                application.bus.dispatchEvent("insert", true, true, newDoc, this);
                this.dispatchEvent("insert", newDoc, this);
                return newDoc;
            }
            return exist;
        }
    },

    update : function(sourceObj){
        var item = this.parent(sourceObj);
        var data = this.getData();
        core.data.StorageManager.set(this.getRouteConfig().table, data.items);
        core.data.StorageManager.commit();
        this.dispatchEvent("updated", item, this);
    },

    set : function(key, obj, persist){
        core.data.StorageManager.set(key,obj, true);//force persistence for this trait
    },

    get : function(key){
        return core.data.StorageManager.get(key);
    },

    removeDocumentById : function(id){
        this.remove(id);
    },

    remove : function(id){
        var removed = this.parent(id);
        if(removed) {
        	core.data.StorageManager.set(this.getRouteConfig().table, this.getData().items);
        	core.data.StorageManager.commit();
        }
    },

    removeByQuery : function(query){
        this.parent(query);
        core.data.StorageManager.set(this.getRouteConfig().table, this.getData().items);
        core.data.StorageManager.commit();
    },

    UUID : function(){
        return Math.uuid(8);
    },

    clear : function(){
        this.getData().items = [];
        core.data.StorageManager.set(this.getRouteConfig().table, []);
        core.data.StorageManager.commit();
    }
});



//---------------------UI----------------------
SimpleTemplateEngine = {
    parseTemplate : function(templateString, data){
        return templateString;
    }
};



namespace('core.models.ComponentModel', {
	"@traits": [new Observer],


	initialize: function(data, element) {
		this.resetListeners();
		this.resetModel(data);
		this.setElement(element);
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



namespace("core.traits.CSSStyleUtilities");

core.traits.CSSStyleUtilities = {
	__getInheritableStylesheets : function(){
        var ancestor    = this.ancestor;
        var classes     = [];
        var ancestors   = [];
        var stylesheets = [];
        
        //debugger;
        if(this["@cascade"]) {
            while(ancestor){
                classes.unshift(ancestor.prototype.classname);
                var styles = ancestor.prototype["@stylesheets"]||[];
                //stylesheets = stylesheets.concat(styles)
                    ancestors.unshift(ancestor);
                    for(var i=0; i<=styles.length-1; i++){ 
                        stylesheets.push(this.relativeToAbsoluteFilePath(styles[i], ancestor.prototype.namespace));     
                    }
                    
                if(ancestor.prototype["@cascade"]) {
                    ancestor = ancestor.prototype.ancestor;
                }
                else { ancestor=null; break; }
            };

            var this_styles = this["@stylesheets"]||[];
            for(var i=0; i<=this_styles.length-1; i++){ 
                stylesheets.unshift(this.relativeToAbsoluteFilePath(this_styles[i],this.namespace));     
            }
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
        
        //alert("stylesheets[url]: " + (stylesheets[url]||url))
        if(stylesheets[url]){
            self.__onStylesheetLoaded(stylesheets[url]); 
            return;
        }   
        if((appconfig.skin && stylesheets[appconfig.skin])){
            return;
        }
        if(appconfig.skin && !stylesheets[appconfig.skin]) {url=appconfig.skin; usingSking=true;}
        var something_went_wrong = "Error loading stylesheets. Expected an array of style urls or a single url to a stylesheet for this component.";
        var styles = (url||this["@stylesheets"]);

        if(styles) {
            if(styles instanceof Array) {
                styles = styles.reverse();
                for(var i=0; i<=styles.length-1; i++) {
                    //debugger;
                    var path = styles[i];//this.resourcepath(styles[i]);
                    this.loadcss(path);
                }
            }
            else if(typeof styles === "string" && styles.indexOf("http://") != 0) {
                //var path = this.resourcepath(styles);
                var path = styles;
                if(stylesheets[path]){return}
                    
                var stylenode= document.createElement('style');
                    stylenode.setAttribute("type", 'text/css');
                    stylenode.setAttribute("rel", 'stylesheet');
                    stylenode.setAttribute("href", path);
                    stylenode.setAttribute("media", 'all');
                    stylenode.setAttribute("component", this.namespace||"");
                    //head.appendChild(stylenode);
                    this.appendStyleSheet(stylenode);
                    stylesheets[path] = stylenode;
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
    		_cssText = _cssText.replace(/resource\(([A-Z0-9a-z\'\"\s\_\.\/\\\-.\$\[\]]*)\)/img, function(){
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
		return (element.className.indexOf(name) >=0)//new RegExp('(\\s|^)'+name+'(\\s|$)').test(element.className);
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


namespace("core.ui.Node", {
    
    addEventListener : function(type, callback, capture, element){
    	capture = (typeof capture == "boolean") ? capture : false;
    	element = element||this.element;
    	if(callback && !callback.isBound) {
			callback = callback.bind(this);
		}
		
		return element.addEventListener(type, callback, capture);
    },

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
    },
    
    removeEventListener : function(type, callback, capture, element){
    	element = element||this.element;
    	return element.removeEventListener(type, callback, capture)
    },
    
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
		slot.appendChild((child instanceof core.ui.Node || child.element) ? child.element:child);
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
        if( component instanceof core.ui.Node){
            compare = component.getBoundingClientRect();
        }
        else if(component && ("left" in component) && ("top" in component)){
            compare = component;
        }
        else {
            throw new Error(this.namespace + "#hittest(component); expected an instance of\
            core.ui.Node or {top:<int>, left:<int>}");
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


namespace("core.ui.HtmlComponent", {
    '@inherits':    core.ui.Node,
    '@cascade' :    false,
	'@traits'  :    [
		core.traits.ResourcePathTransformer, 
		core.traits.CSSStyleUtilities
	],
	'@model'   :    core.models.ComponentModel,
	'@stylesheets': [],
	'@htmlparser' : SimpleTemplateEngine,
	
	preInitialize : function(model, element, domready_func) {
        try {
            var self=this;
            if(element && element.prototype instanceof core.ui.Node){return;}
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
        } 
        catch(e){
            var msg = this.namespace + ".prototype.preInitialize() - " + e.message;
            console.error(msg, this);
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

    getComponentByNamespace : function(namespace){
    	var el = this.querySelector("*[namespace='" + namespace + "']");
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
		//classList is defined in core.traits.CSSStyleUtilities.__getInheritableStylesheets();
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
                if(node.prototype && (node.prototype instanceof core.ui.Node)){continue};
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
	
	get : function(keypath, accessor, e){}

});


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
        var text = Kruntch.Apply(templateDefinition.template.innerHTML, data);
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
                                htmltext = htmltext.replace("[$theme]",self.resourcepath("[$theme]"),"igm");
                                htmltext = htmltext.replace("[$icon]",self.resourcepath("[$icon]"),"igm")
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
    
    getModalValue : function() {
        console.info("Implement getModalValue() in " + this.namespace + " to return a value when the modal is confirmed as OK/Save.")
        return null;
    },
    
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

    allowRefreshCycle : function(){
        return true;
    },
    
    onScreenResized : function(){
        console.info("Screen Resized detected by current application: ", this)    
    },

    onRefresh : function(){
        console.info(this.namespace + " onRefresh() handler triggered (app heartbeat).");    
    },

    onResume : function(e){
        console.info(this.namespace + " onResume() handler triggered.");    
    },
    
    onFocus : function(e){
        this.setActivityState(true);
        application.requestRefreshCycle(this);
        console.info(this.namespace + " onFocus() handler triggered");    
    },
    
    
    onBlur : function(e){
        this.setActivityState(false);
        console.info(this.namespace + " onBlur() handler triggered. Inactive.");    
    },
    
    onActivated : function(e){
        console.info(this.namespace + " onActivated() handler triggered. Loaded from disk.");    
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
    '@stylesheets' :["~/resources/[$theme]/Panel.css"],
    
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



//-----------------BOOTLOADER------------------
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
			window.application = new Application(window.appconfig, document);
		}
		else { timerId = setTimeout(bootup,100) }
	};	
	
	bootup();
}, false);




namespace("core.Application", {
	'@inherits' : core.ui.WebComponent,
    '@cascade'  : true,
    '@traits'   : [],
    '@stylesheets' : [],
    
    MAIN_ACTIVITY : Config.Activities.MAIN,

    preInitialize : function(model, element) {
        window.application  = this;
        this.head           = document.getElementsByTagName("head")[0];
        this.configscript   = document.querySelector("script[id='config']")||
                              document.querySelector("script");
        core.data.StorageManager.initialize(Config.StorageManager.STORE_KEY);
        window.addEventListener ("load", this.onLoad.bind(this), true);
        window.addEventListener ("hashchange", this.onLocationHashChanged.bind(this), true);
        this.parent(model, element.body||element);
        return this;
    },


    initialize : function () {
    	var self = this;
        this.parent(arguments);
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        this.addEventListener("appopened", this.onApplicationOpened.bind(this), false);
        this.addEventListener("openapp", this.onLaunchWebApplication.bind(this), false);
        this.addEventListener("beforeopen", this.onBeforeApplicationOpened.bind(this), false);

        this.initAgentClasses();
        this.intiDefaultApp();
    },

    intiDefaultApp : function(){
        debugger;
        var defaultHashPath = rison.encode({appref:this.MAIN_ACTIVITY});
        var h = window.location.hash;
        if(!h||(h && h.length <=0)){
            window.location.hash = defaultHashPath;
        }
    },

    logout : function(){
        location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")";
    },

    onBeforeApplicationOpened : function(e){
        if(!this.isUserAccountAvailable()){
            e.preventDefault();
            e.stopPropagation();
            location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")";
        } else{
            this.account.touch();
            if(e.data.appref){
                if(e.data.appref == Config.Activities.LOGIN){
                    e.preventDefault();
                    e.stopPropagation();
                    location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")";
                }
            }
        }
    },

    isUserAccountAvailable : function(){
        if(!this.account) {
            this.account = new core.vo.Account(this.db.user);
        };
        return this.account.isValid();
    },

    open : function(data){
        if(data.appref == Config.Activities.LOGIN){
            location.href = Config.Applications.LOGIN + "#(appref:" + Config.Activities.LOGIN + ")"
        } else {
            this.dispatchEvent("openapp", true, true, data);
        }
    },

    onLaunchWebApplication : function(e){
        this.openApplication(e);
    },

    onApplicationOpened : function(e){
        if(e.data && e.data.appref){
            var appref = this.getWebApplicationInfoByRef(e.data.appref);
            var ns = appref.namespace;
            var instance = this.getApplicationInstance(ns);
            if(instance && instance.onResume) {
                instance.onResume(e);
            }
        }
    },

    openApplication : function(e){
        if(e.cancelable){
            var evt = this.dispatchEvent("beforeopen",true,true, e.data);
            if(evt.defaultPrevented){
                console.info("openApplication(e) was prevented from running by another process\
                    listening to the 'beforeopen' event. Original event is: ", e);
                return;
            };
        }

        var appref = e.data.appref;
        var appInfo = this.getWebApplicationInfoByRef(appref);
        
        if(!appInfo) {
            console.warn("There is no application defined for id/ref: " + (appref));
            return;
        };
        this.globalApplicationSpinner.classList.add("active");
        this.doAppLoadTest(e,appInfo);
    },

    doAppLoadTest : function(e,appInfo) {
        var self=this;
        var force = (typeof e.data.force == "boolean")?e.data.force:false;
            self.createApplicationInstance(appInfo, function(appInstance){
                var appContainer = document.querySelector(".running.application-container")||self.element;
                self.blurCurrentRunningApplication(e,appContainer);
                appContainer.appendChild(appInstance.element);
                self.globalApplicationSpinner.classList.remove("active");
                appContainer.classList.add("active");
                currentApp = null;
                self.dispatchEvent("appopened", true,true, e.data);
            }, force, e);
    },

    requestRefreshCycle : function(app){
        this.currentRunningApplication = app;
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
        this.dispatchEvent("appunload", true, true, {});
    },

    createApplicationInstance : function(appInfo, callback, force, e){
        force = (typeof force == "boolean")?force:true;
        var self=this;
        if(!NSRegistry[appInfo.namespace]){
            var c = new core.http.ClassLoader;
            c.addEventListener("load", function(data){
                var d = new NSRegistry[appInfo.namespace];
                    d.onActivated(e);
                if(!force){
                    self.storeApplicationInstance(appInfo.namespace, d);
                }
                setTimeout(function(){
                    d.onFocus(e);
                    callback(d);
                },500);//1000 to fully render 
            }, false);
            c.load(appInfo.namespace)
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
        }  
    },
    
    getApplicationInstance : function(ns){
        console.log("app instance loaded from memory")
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
        var defaultApp = app.constants.DEFAULT_HOME_APP;
        this.dispatchEvent("openapp",true,true,{appref:defaultApp})
    },

    getApplicationInstanceCount : function(){
        var count=0;
        for(var i in this.appinstances){
            count++
        }
        return count;
    },

    getWebApplicationInfoByRef : function(appref){
        appref = appref.replace("/",".","g");
        return {namespace:appref, route:"$."+appref};
    },

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
        this.element.querySelector(".application-container").appendChild(el);
    },

    hideAppSpinner:function(){
        this.element.classList.remove("disabled")
        this.globalApplicationSpinner.classList.remove("active");
    },

    onLoad : function onLoad(e) {
        var self=this;
        setTimeout(function(){
            self.doHashChangedEvent(e);
        }.bind(this),appconfig.foucdelay||1000)
    },

    onRender : function(e){
        this.globalApplicationSpinner   = '<span id="global-application-spinner" class="fa fa-spinner fa-spin"></span>'.toHtmlElement();
        this.element.appendChild(this.globalApplicationSpinner);
        
        var canvas=this.querySelector(".canvas");
        if(canvas){
            canvas.style.visibility="visible";
            setTimeout(function(){canvas.style.opacity=1;},appconfig.foucdelay);
        }
    },

    getLocationHash : function(){
        var hash = location.hash.replace("#","");
        var params = rison.decode(hash);
        return params;
    },

    setLocationHash : function(params){
        location.hash = "#" + rison.encode(params);
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

    setContentView : function(){

    },

    globalzindex : 600000,
    
    absoluteZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    },

    onDeviceReady : function(){
        if(navigator.splashscreen){
            navigator.splashscreen.hide();
        }
    },

    initAgentClasses : function(){
        if(UserAgent.isMobile() || appconfig.ismobile){
            var device =
            UserAgent.isAndroid()?
                "android":
                    UserAgent.isIOS()?
                        "ios":
                           UserAgent.isWindowsMobile()?
                             "iemobile":"computer";
        }
        document.body.setAttribute("browser", browser.DeviceInfo.browser);
        document.body.setAttribute("os", browser.DeviceInfo.OS);
        document.body.setAttribute("device", device);
    },

    initUrlRoutesTable : function(){
        var self = this;
        core.http.UrlRouter.process(ROUTES);
        self.dispatchEvent("routesloaded", true, true, null);
    }
});
