
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


