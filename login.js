//=require src/core/traits/AutomaticallyOpenHelpWizardOnce.js


namespace("apps.Login",
{
    '@inherits' : core.Application,
    '@cascade'  : true,
    '@stylesheets' : [],
    '@traits':[
        core.traits.EventBus,
        UrlHashState,
        core.traits.InitializeApplicationData
    ],

    MAIN_ACTIVITY : Config.Activities.LOGIN,
    
    initialize : function () {
        this.parent();
        this.bus.addEventListener(
            "activities.Login::success", this.onLoginSuccessfull.bind(this), false);
    },

    onBeforeApplicationOpened : function(){},

    onLoginSuccessfull : function(e){
        var account = new core.vo.Account(this.db.user);
            account.touch();
        location.href = "index.html"
    },

    innerHTML:
    '<div></div>'
});
