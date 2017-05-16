
Session = {};
Session.State = {};
app={};
app.constants={};
Session.Demo = {};
Session.Debug = {};

/* App Constants */
app.constants.DEFAULT_HOME_APP 	= "activities/TodoMVC";
app.constants.EMPLOYEE 			= "Employee";
app.constants.MANAGER 			= "Manager";
app.constants.ADMIN 			= "Admin";



/* Session State */
Session.State.appname 		= "OneService Portal Demo"
Session.State.build 		= "20170502-2";
Session.State.version 		= "3.0";
Session.State.buildstring 	= Session.State.appname + " v" + Session.State.version + " (" + Session.State.build + ")";
Session.State.Timeout 		= "1 day"; //'mins', 'days' or 'hours'
Session.State.AccountProfile= {};
Session.State.CurrentProfile= {};
Session.BasePath = "";//see: 'index.html'
Session.State.currentLanguage = "it-it";
Session.Demo[Session.State.currentLanguage] = {
	version: Session.State.version,
	build : Session.State.build
};



// Session.Demo[Session.Constants.Languages.EN_CA] = {country:"Canada", language:"English", version:"1.0", build:"20160119-1"};
// Session.Demo[Session.Constants.Languages.EN_FR] = {country:"Canada", language:"French", version:"1.0", build:"20160119-1"};
Session.Debug = { 
	disableLogging : true, 
	production : false
};

