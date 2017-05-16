/* These ROUTES define URI's for any resource (json, css, html, js)
 * that may be used by the application. Each route has one URI for
 * each environment. Hardcoded url's are not recommended in the app.

 * Only the URI for the current environment is used. For example,
 * To get a list of employee ACCOUNTS (resources/data/user-{role}.json),
 * a call like this is crafted internally inside a data controller:



    var params = {role : "Employee"};   //'role' is a token in the route
    var async = true;
    var req = new core.http.WebAction(ROUTES.DATA.ACCOUNTS, params, {}, async);
        req.invoke({
            onSuccess  : dataReady,
            onFailure  : failure,
            onRejected : failure
        });

        var failure     = function(xhr, responseText){};
        var dataReady   = function(xhr, responseText){
            var data = JSON.parse(responseText);
        };


    Internally, our apps usually will not craft low-level XHR requests
    like these because it is handled by the <core.data.DataController>
    base-class. Since all DataControllers (Ex: AccountsDataController)
    are sub-classes of the baseclass <DataController>, only the route needs
    to be provided by the controllers, the base class preforms the 
    low-level requests and supplies back parsed JSON data.

    The object-oriented approach to work with employee accounts will
    look like this in our demo code:

    var accountsDataController = new core.data.AccountDataController;
        accountsDataController.getEmployeeByRole("Employee");

 */



ROUTES = {
    apps: {
        Login: {
            dev : appconfig.apppath + "src/activities/Login/index.js",
            staging : appconfig.apppath + "src/activities/Login/index.js",
            test : appconfig.apppath + "src/activities/Login/index.js",
            prod : appconfig.apppath + "src/activities/Login/index.js"
        },
        TodoMVC: {
            dev : appconfig.apppath + "src/activities/TodoMVC/index.js",
            staging : appconfig.apppath + "src/activities/TodoMVC/index.js",
            test : appconfig.apppath + "src/activities/TodoMVC/index.js",
            prod : appconfig.apppath + "src/activities/TodoMVC/index.js"
        }
    },
    HTML : {
        LOGIN: {
            dev : appconfig.apppath + "src/activities/Login/index.html",
            staging : appconfig.apppath + "src/activities/Login/index.html",
            test : appconfig.apppath + "src/activities/Login/index.html",
            prod : appconfig.apppath + "src/activities/Login/index.html"
        }
    },
    
    DATA:{
        TODO_LIST : {
            config : {
                table: "todo_list"
            },
            dev: appconfig.apppath + "resources/data/todo_list.json",
            staging: appconfig.apppath + "resources/data/todo_list.json",
            test : appconfig.apppath + "resources/data/todo_list.json",
            prod : appconfig.apppath + "resources/data/todo_list.json"
        },
        ACCOUNTS : {
            config : {
                table: "accounts"
            },
            dev: appconfig.apppath + "resources/data/accounts.json",
            staging: appconfig.apppath + "resources/data/accounts.json",
            test : appconfig.apppath + "resources/data/accounts.json",
            prod : appconfig.apppath + "resources/data/accounts.json"
        },
		MEGA_MENU : {
            config : {
                table: "mega-menu"
            },
            dev: appconfig.apppath + "resources/data/megamenu-{role}.json",
            staging: appconfig.apppath + "resources/data/megamenu-{role}.json",
            test : appconfig.apppath + "resources/data/megamenu-{role}.json",
            prod : appconfig.apppath + "resources/data/megamenu-{role}.json"
        }
    }
};
