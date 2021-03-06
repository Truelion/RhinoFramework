//=require core.data.EventBus

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