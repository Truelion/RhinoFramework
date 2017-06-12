//= require core/controllers/LocalStorageDataController

/**
See README
**/

namespace("core.controllers.SessionDataController", {
    '@inherits' : core.controllers.LocalStorageDataController,
    CONFIG: ROUTES.DATA.SESSION,


	initialize : function(host, async){
		this.parent(host, async);
	}
});