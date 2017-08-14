//=require core/controllers/DataController


/**
Used for reading, writing, modifying leave_requests.
See 'resources/data/leave_requests.json'. This controller
loads the resource once and allows manipulation
of the result set.

See README
**/
namespace("core.controllers.StorageController", {
    '@inherits' : core.controllers.DataController,
    CONFIG: ROUTES.DATA.SESSION,

	initialize : function(host, async){
		this.parent(host, false);
		if(!this.getData()){
			this.load(this.CONFIG);
		}
	},

	mergeWithStorage : function(){

		var items = this.getData().items;
		var stored_items = core.data.StorageManager.get(this.table);
		if(stored_items && stored_items.length>0){
			stored_items.forEach(function(item){
				items.push(item);
			})
		}
	},

	onDataReceived : function(_data, xhr){
        var self=this;

        _data = this.onInitializeModelDataObjects(_data);
        this.setData(_data.table, _data);
        _data = this.getData();

        this.paginator = new core.traits.Paginator({
            data : _data.items,
            pageSize : 3,
            currentPage:0
        });
        this.mergeWithStorage();
        this.dispatchEvent("loaded", {data:_data, response:xhr, fromcache:false}, this);


        if(this.host){
            if(this.host.onDownloadComplete){
                console.warn(self.host.namespace + "#onDownloadComplete() - Deprecated. Use addEventListener('loaded', callback, false) to be notified when data is loaded and ready for use.");
                setTimeout(function(){
                    self.host.onDownloadComplete(_data, self);
                },100);
            }
            else {
                console.warn(this.host.namespace + " should implement #onDownloadComplete(_data) to be notified when the data controller has loaded it's data and ready for use.");
            }
        }
    },

    set : function(key,data){
        core.data.StorageManager.set(key, data, true);
    },

    get : function(key){
        return core.data.StorageManager.get(key);
    },

	insert : function(obj){
		var data = this.getData();
		var item = null;

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
                this.dispatchEvent("insert", val, this);
                item = obj.value();
            } else {
                console.error(this.namespace + "#insert(obj) - Object of type <" + obj.namespace + "> being inserted is not valid.", obj);
            }
        }

		if(item) {
			core.data.StorageManager.store(data.table, item, true);
		} else {
			console.error("Hmm, object didn't save right.", data);
		}
		return item;
	},

    find : function(whereCondition){//ex: .find("$.status == 'Approved'")
        var data = this.getData();
        return data.items.where(whereCondition);
    }
});