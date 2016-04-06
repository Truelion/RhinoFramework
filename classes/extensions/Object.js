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