
ROUTES = {
    apps : {
        Profile: {
            dev : appconfig.apppath + "apps/Profile/main.js",
            staging : appconfig.apppath + "apps/Profile/main.js",
            test : "",
            prod: ""
        }
    },
    
    HTML : {
        
    },
    
    DATA:{        
        RECENTAPPS : {
            dev: appconfig.apppath + "resources/data/recent-apps.json",
            staging: "index.php?page=desktop/recent",
            test:"",
            prod:""
        },
        
        PROFILE : {
            dev: appconfig.apppath + "resources/data/user-profile.json",
            staging: "index.php?page=desktop/apps/profile/profile",
            test:"",
            prod:""
        },
        
		START_MENU : {
            dev: appconfig.apppath + "resources/data/start-menu.json",
            staging: appconfig.apppath + "resources/data/start-menu.json",
            test:"",
            prod:""
        },

        HEARTBEAT : {
            dev: appconfig.apppath + "resources/data/heartbeat.json",
            staging: "index.php?page=public/hb",
            test:"",
            prod:""
        }
    }
};
