//=require core.controllers.DataController

namespace("core.controllers.LocalStorageDataController", {
    '@inherits' : core.controllers.DataController,


    initialize : function(host, async){
        this.parent(host, async);
        if(!this.getData()){
			this.load(this.CONFIG);
		}
    },

    load : function(uri, params, force){
        force = (typeof force == "boolean") ? force:false;
        uri = uri || this.CONFIG;

        if(!this.getData() || force){
            try{
            	var results_array = core.data.StorageManager.find(this.getRouteConfig().table);
            	this.onDownloaded(null,results_array);
        	} catch(e){
        		this.onDownloadFailure();
        	}
        } else {
            this.dispatchEvent("loaded", {data:this.getData(), response:null, fromcache:true}, this);
        }
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
        this.table = name||this.getRouteConfig().table;
        application.db[this.table] = data;
    },

    onDownloaded : function(r, results_array){
        var dataset;
        try{
            try{
                dataset = {
                	table : this.getRouteConfig().table,
                	columns : [],
                	items : results_array||[]
                }
            }
            catch(e) {
                console.error(e.message, e);
            }
            if(dataset){
                this.onDataReceived(dataset, r);
            }
        }
        catch(e){
            console.error(e.message,responseText)
        }
    },

    onDataReceived : function(data, xhr){
        var self=this;
        
        this.setData(data.table, data);
        data = this.onInitializeModelDataObjects(this.getData());

        this.paginator = new core.traits.Paginator({
            data : data.items,
            pageSize : 3,
            currentPage:0
        });
        this.dispatchEvent("loaded", {data:this.getData(), response:null, fromcache:true}, this);

        if(this.host){
            if(this.host.onDownloadComplete){
                setTimeout(function(){
                    console.warn(self.host.namespace + "#onDownloadComplete() - Deprecated. Use addEventListener('loaded', callback, false) to be notified when data is loaded and ready for use.");
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
        console.error("onDownloadFailure(): ", responseText)
    },

    insert : function(newDoc){
        var data = this.getData();
        if(newDoc){
            newDoc.id = newDoc.id||this.UUID();
            var exist = data.items.where("$.id == '" + newDoc.id + "'")[0];
            if(!exist) {
                data.items.push(newDoc);
                //core.data.StorageManager.store(this.getRouteConfig().table, newDoc);
                core.data.StorageManager.set(this.getRouteConfig().table, data.items);
                core.data.StorageManager.commit();
                application.bus.dispatchEvent("insert", true, true, newDoc, this);
                this.dispatchEvent("insert", newDoc, this);
                return newDoc;
            }
            return exist;
        }
    },

    update : function(sourceObj){
        var item = this.parent(sourceObj);
        var data = this.getData();
        core.data.StorageManager.set(this.getRouteConfig().table, data.items);
        core.data.StorageManager.commit();
        this.dispatchEvent("updated", item, this);
    },

    set : function(key, obj, persist){
        core.data.StorageManager.set(key,obj, true);//force persistence for this trait
    },

    get : function(key){
        return core.data.StorageManager.get(key);
    },

    removeDocumentById : function(id){
        this.remove(id);
    },

    remove : function(id){
        var removed = this.parent(id);
        if(removed) {
        	core.data.StorageManager.set(this.getRouteConfig().table, this.getData().items);
        	core.data.StorageManager.commit();
        }
    },

    removeByQuery : function(query){
        this.parent(query);
        core.data.StorageManager.set(this.getRouteConfig().table, this.getData().items);
        core.data.StorageManager.commit();
    },

    UUID : function(){
        return Math.uuid(8);
    },

    clear : function(){
        this.getData().items = [];
        core.data.StorageManager.set(this.getRouteConfig().table, []);
        core.data.StorageManager.commit();
    }
});