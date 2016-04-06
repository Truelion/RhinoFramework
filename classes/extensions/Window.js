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