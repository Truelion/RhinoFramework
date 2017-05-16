namespace("core.traits.InitializeApplicationData");

core.traits.InitializeApplicationData = {
	initialize : function () {
        this.parent();
		this.onDownloadApplicationData();
	},

	onDownloadApplicationData : function(){
        application.db = {};
        application.db.user = core.data.StorageManager.get("db.user");
        Session.user = application.db.user;
        application.dispatchEvent("ready", true, true, {});
    }
};