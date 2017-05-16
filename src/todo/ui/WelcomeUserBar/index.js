

namespace("todo.ui.WelcomeUserBar", 
{
    '@inherits'     : core.ui.WebComponent,
    '@cascade'      : true,
    '@stylesheets'  : ["src/./index.css"],
    '@href'         : "src/./index.html",
    '@imports'      : [],
    //'@traits'       : [core.traits.EventTracker],

    initialize : function(){
        this.parent();
        this.counterLabel = this.querySelector("#user-assigned-todo-count");
        this.todos = new todo.controllers.TodoListDataController();
        this.todos.addEventListener("insert", this.onUpdateCount.bind(this), false);
        this.todos.addEventListener("updated", this.onUpdateCount.bind(this), false);
        this.todos.addEventListener("removed", this.onUpdateCount.bind(this), false);
        this.counterLabel.addEventListener("click", this.onCounterClicked.bind(this), false);
        this.onDownloadComplete();
    },

    onCounterClicked : function(e){
        var params = application.getLocationHash();
            params.where = "userid";
            params.value = String(Session.user.id);
            params.status = "active";
            params.rid = Math.uuid(3);
        application.setLocationHash(params);
    },

    onUpdateCount : function(){
        var items = this.todos.getData().items.where("$.status == 'active' && $.userid == " + Session.user.id);
        this.counterLabel.innerHTML = items.length;
        (items.length > 0) ?
            this.counterLabel.classList.add("assigned"):
            this.counterLabel.classList.remove("assigned");
    },

    onDownloadComplete : function(data){
        this.onUpdateCount();
        this.querySelector("#logged-in-userphoto").src = Session.user.photo_src;
        this.querySelector("#logged-in-username").innerHTML = Session.user.fullname
    }
 });