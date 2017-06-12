namespace("core.traits.InitializeApplicationData");

core.traits.InitializeApplicationData = {
	initialize : function () {
		this.onDownloadApplicationData();
	},

	onDownloadApplicationData : function(){
        // application.db = {};
        // application.db.user = core.data.StorageManager.get("user");
        Session.user = core.data.StorageManager.get("user");
        Session.State.currentLanguage = core.data.StorageManager.get("currentLanguage");
        application.dispatchEvent("ready", true, true, {});
    }
};