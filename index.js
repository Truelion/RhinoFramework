//=require src/core/traits/AutomaticallyOpenHelpWizardOnce.js


namespace("examples.TodoMVC",
{
    '@inherits' : core.Application,
    '@cascade'  : true,
    '@stylesheets' : [],
    
    '@traits':[
        core.traits.EventBus,
        core.traits.HttpEventBus,
        core.traits.HtmlNotifications,
        core.traits.InitializeApplicationData,
        UrlHashState
    ],

    MAIN_ACTIVITY : Config.Activities.MAIN,

    initialize : function(){
        this.parent(arguments);
        
        this.httpbus.subscribe({
            channels: [
                'demo_todomvc_create',
                'demo_todomvc_assign' ]
        });
    },


    isNotificationsEnabled : function(){
        return Config.Notifications.ENABLED;
    },
    

    innerHTML:
	'<div></div>'
});
