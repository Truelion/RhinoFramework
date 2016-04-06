
//check for requirejs
if ( typeof require  === "function" && typeof define === "function") {
    if(appconfig.require){require.config(appconfig.require);}
    var _namespace   = window.namespace;
    window.namespace = function(ns, def) {
        define(def["@requires"] || [], function() {
            if (def["@inherits"]) {
                def["@inherits"] = window.NSRegistry[def["@inherits"]];
            };
            return _namespace(ns, def);
        });
    };
};

