namespace("core.data.CircularBuffer",{
  initialize : function(size, arr){
    this.size = size||20000;
    this.buf = (arr||new Array());
    this.readI = 0;
    this.writeI = 0;
    this.trim()
  },
  
  trim : function(){
    this.buf.splice(this.size);
  },
  
  read : function(){
    var o = this.buf[this.readI];
    this.readI = (this.readI+1)%this.size;
    return o;
  },
  
  write : function(o, callback){
    if(o instanceof Array){this.writeArray(o);return};
    this.buf[this.writeI] = o;
    this.writeI = (this.writeI+1)%this.size;
    callback(this);
  },

  writeArray : function(arr){
    for(var i=0; i<=arr.length-1; i++){
      var o = arr[i];
      this.write(o);
    }
  },

  isFull : function(){
    return this.buf.length == this.size;
  },

  data : function(){
    return this.buf;
  }
});
