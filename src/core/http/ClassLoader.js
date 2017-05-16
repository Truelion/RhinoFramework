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
