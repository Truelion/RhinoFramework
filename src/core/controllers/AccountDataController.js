//=require core/vo/Account

namespace("core.controllers.AccountDataController", {
    '@inherits' : core.controllers.DataController,
    CONFIG:ROUTES.DATA.ACCOUNTS,

	initialize : function(host, async){
		this.parent(host, async);
		if(!this.getData()){
			this.load(this.CONFIG);
		}
	},

	getUserByRole : function(role){
		if(this.getData()){
			var items = this.getData().items;
			var item = null;
			var found = null;

			for(var i=0; i<=items.length-1; i++) {
				item = items[i];
				if(item) {
					if(item.role.toLowerCase() == role.toLowerCase()) {
						found = item;
						break;
					}
				}
			}
			return found;
		}
	},
	
	getCurrentUser : function(){
		return this.getUserById(Session.user.id);
	},

	getUserById : function(id){
		if(this.getData()){
			var items = this.getData().items;
			var item = null;
			var found = null;

			for(var i=0; i<=items.length-1; i++) {
				item = items[i];
				if(item) {
					if(item.id == id) {
						found = item;
						break;
					}
				}
			}
			return found;
		}
	},

	getUserByAccount : function(username, password){
		console.info("Searching for a user by username, password");
		if(this.getData()){
			var items = this.getData().items;
			var item = null;
			var found = null;

			for(var i=0; i<=items.length-1; i++) {
				item = items[i];
				if(item) {
					if(item.username == username && item.password == password) {
						found = item;
						break;
					}
				}
			}
			return found;
		}
	},

	getAllUsers : function(){
		var items = this.getData().items;
		return items||[];
	}
});