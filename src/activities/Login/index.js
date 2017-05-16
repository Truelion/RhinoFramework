namespace("activities.Login", {
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : ROUTES.HTML.LOGIN,
    '@stylesheets' :[
        "src/./resources/[$theme]/Login.css"
    ],
    '@title'    : "Login",
    '@traits'   : [],


    initialize : function() {
        this.parent();
        var self=this;
        //this.showHelpWizard(2000); //now opens just once via <AutomaticallyOpenHelpWizardOnce>
        this.resetDemoButton    = this.querySelector("#reset-demo-button");;
        this.loginButton        = this.querySelector("#loginButton");
        this.loginButton.addEventListener("click", this.onLogin.bind(this), false);
        this.resetDemoButton.addEventListener("click", this.onResetDemo.bind(this), false);
        this.dataController = new core.controllers.AccountDataController(this);
    },


    onResetDemo : function(e){
        var self=this;
        var doit = confirm("Reset all local data?");
        if(doit) {
            setTimeout(function(){
                alert("Factory reset completed");
                // self.logEvent({
                //     Type     : "event",
                //     Category : "Login",
                //     Label    : "Demo Reset link clicked",
                //     Action   : "click"
                // });
            },800);
            core.data.StorageManager.clean();
        }
    },

    onShowHelp : function(e){
        this.showHelpWizard(200);
        // this.logEvent({
        //     Type     : "event",
        //     Category : "Login",
        //     Label    : "Help link clicked",
        //     Action   : "click"
        // });
    },

    onFocus : function(){
        var self=this;
        this.parent();
        setTimeout(function(){
            self.element.style.opacity=1;
            // self.logEvent({
            //     Type     : "event",
            //     Category : "Login",
            //     Label    : "Login page loaded",
            //     Action   : "view"
            // });
        },200);
    },

    onDownloadComplete : function(data){
        this.data = data;
        console.warn("Loaded All Employees: ", this.data);
        this.onRenderData(data);
    },

    onRenderData : function(data){
        this.parent(data);
        //this.buildLabel.innerHTML     = Session.State.buildstring;
        //this.copyRightLabel.innerHTML = app.constants.COPY_RIGHT;
    },

    onLogin : function(){
        //this.loginButton.disable();
    	this.username   = this.querySelector("select#username_select");
        this.password = this.querySelector("#userpassword");
    	var employee = this.dataController.getUserByAccount(
            this.username.value, this.password.value
        );

        if(employee) {
            // this.logEvent({
            //     Type     : "event",
            //     Category : "Login",
            //     Label    : "Credentials verified. Login successfull.",
            //     Action   : "click"
            // });
            application.db.user = employee;
            core.data.StorageManager.set("db.user",employee);
            core.data.StorageManager.commit();
            application.bus.dispatchEvent("success",true,true, {}, this);
        }
        else {
            //this.loginButton.enable();
            this.password.classList.add("error");
            console.info("No employee account found for user/pass: ", [this.username.value, this.password.value])
        }
    }
});
