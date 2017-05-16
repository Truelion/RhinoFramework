//=require core.vo.Model

namespace("core.controllers.DataController", {
    '@datatype' : core.vo.Model,
    '@traits'   : [Observer.prototype],
    observations : [],
    subscribers  : {},
    '@imports'  : ["~/src/core/traits/localStorageData.js"],


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