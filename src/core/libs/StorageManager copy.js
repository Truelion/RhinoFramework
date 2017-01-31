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

  clean : function(){
    localStorage.setItem(this.key,"{}");
    var str = localStorage.getItem(this.key)||"{}";
    this.data = JSON.parse(str);
  },
  
  find : function(ns, id){
    return this.data[ns]||[];
  },
  
  commit : function(){
      StorageManager.persist();
  },
  
  persist : function(){
    try {
        localStorage.setItem(this.key, JSON.stringify(this.data))
    } catch(e){
        console.error(e);
    }
  },

  set : function(ns, obj, persist){
    persist = typeof persist=="boolean"?persist:false;
    this.data[ns] = obj;
    if(persist){
        StorageManager.persist();
    }
  },

  get : function(ns){
    return this.data[ns];
  },
  
  store : function(ns, obj, persist){
    persist = typeof persist=="boolean"?persist:false;
    if(!ns){return}
    if(typeof obj != "undefined" && obj != null && !obj.oid){
        obj.oid = Math.uuid(8);
    }
    var arr = this.data[ns];
    var item_exists=false;

    if(arr && arr.length > 0){
        for (var i = 0; i <= arr.length-1; i++){
          var item = arr[i];
          if(obj.oid){
              if(item.oid == obj.oid){
                arr[i] = obj;
                item_exists=true;
              }
          }
        }
      if(!item_exists){
        this.data[ns].push(obj)
      }
    } else {
      var arr = [];
      arr = arr.concat(obj);
      this.data[ns] = arr;
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
