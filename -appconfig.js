
Config = {};

Config.Notifications = {};
Config.Notifications.ENABLED = true;

Config.Activities = {
	LOGIN : "activities/Login",
	MAIN : "activities/TodoMVC"
};


Config.Applications = {
	LOGIN : "login.html",
	MAIN : "index.html"
};

Config.Tracking = {
	AUTH_KEYS : {
		DEBUG 				: "M1C01228-8E93-4X27-B54B-D49339AZ7CE8"
	},
	
	ENABLED : false,
	ENABLE_CLEAR_DATA_POPUP : false,
	TRANSFORMER : "AnalyticsTransformer",
	SERVICE_DEBUG_URI : "",
	SERVICE_PROD_URI  : "",
	XHR_TRANSPORT_METHOD: "POST"
};
Config.Tracking.AUTH_KEY = Config.Tracking.AUTH_KEYS.DEBUG;


Config.StorageManager = {
	ENABLED: true,
	STORE_KEY: ("TODO_" + Config.Tracking.AUTH_KEY),
	PARTITION_SIZE : 4000,//kb,
	WARNING_THRESHOLD_CAPACITY : .80,
	CAPACITY_WARNING_MSG : "CAPACITY WARNING:\nStorage Quota Exceeded!",
	CAPACITY_CHECK_TIMER_INTERVAL : 1200000,//Check storage space every 20mins 
	DO_CAPACITY_CHECK_ON_STARTUP: true
};


Config.NetDetect = {
	ENABLED: false,
	INTERVAL : 7000,
	HEARTBEAT_DEBUG_URI : "resources/data/heartbeat.json",
	HEARTBEAT_PROD_URI  : "resources/data/heartbeat.json"
}




