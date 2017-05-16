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






