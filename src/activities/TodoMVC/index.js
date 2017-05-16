
namespace("activities.TodoMVC",
{
    '@inherits' : core.ui.WebApplication,
    "@cascade"  : true,
    '@href'     : "src/./index.html",
    '@title'    : "Todo MVC",
    '@stylesheets' : [ "src/./index.css" ],
    '@imports'  : [],
    '@traits'   : [],


    initialize : function() {
        this.parent(arguments);
        var self            = this;
        this.httpbus        = application.httpbus;
        this.input          = this.querySelector("#new-todo");
        this.buttonBar      = this.querySelector("#footer");
        this.clearButton    = this.querySelector("#clear-completed");
        this.todos          = new todo.controllers.TodoListDataController(this);
        this.dgrid          = this.querySelector("#todo-list");
        this.input.focus.delay(700,this.input);

        this.todos.addEventListener("insert",       this.onInsert.bind(this), false);
        this.todos.addEventListener("removed",      this.onRemove.bind(this), false);
        this.todos.addEventListener("updated",      this.onUpdate.bind(this), false);
        this.dgrid.addEventListener("gridaction",   this.onCellAction.bind(this), false);
        this.dgrid.addEventListener("datachanged",  this.onCellChanged.bind(this), false);
        this.dgrid.addEventListener("filter",       this.onFilterDataset.bind(this), false);
        this.input.addEventListener("keyup",        this.onKeyUp.bind(this), false);
        this.buttonBar.addEventListener("click",    this.onApplyStatusFilter.bind(this), false);
        this.clearButton.addEventListener("click",  this.onClearCompleted.bind(this), false);
        this.httpbus.addEventListener("message",    this.onHttpEventReceived.bind(this), false);
    },

    onHttpEventReceived : function(e){
        if(e.channel == "demo_todomvc_assign"){
            if(e.message.userid == Session.user.id){
                this.todos.update(e.message);
                application.notifications.show("A Todo was assigned to you");
            }
        }
        else if(e.channel == "demo_todomvc_create") {
            var todo = this.todos.getItemById(e.message.id);
            if(!todo || !todo.id != e.message.id) {
                this.todos.insert(e.message);
                if(e.message.ownerid != Session.user.id){
                    application.notifications.show("A new Todo was created by: " + e.message.ownerid);
                }
            }
        }
    },

    onApplyStatusFilter : function(e){
        var el = e.target;
        if(el.classList.contains("status-filter-button")){
            location.hash = el.getAttribute("href");
        }
    },

    onClearCompleted : function(){
        var doit = confirm("Clear all completed items?");
        doit && this.todos.clearCompleted();
    },

    onFilterDataset : function(e){
        var params = application.getLocationHash();
            params.where = e.data.name;
            params.value = e.data.value;
        application.setLocationHash(params);
    },

    onCellChanged : function(e){
        var self=this;
        var row = e.data.row;
        var target = e.data.target;
        var id = row.getAttribute("data-id");
        var todo = this.todos.getItemById(id);

        if(target.classList.contains("label")){
            todo.title = target.value;
            this.todos.update(todo);
        } 
        else if(target.classList.contains("user-assignment")){
            todo.userid = target.value;
            todo.from_uid = Session.user.id;
            this.todos.update(todo);
            this.httpbus.dispatchEvent("demo_todomvc_assign", todo);
        }
        this.onAfterAssignment(id);
    },

    onAfterAssignment : function(todo_id){
        var self = this;
        (function(){
            var row = self.querySelector(".row[data-id='"+todo_id+"']");
            var sel = row.querySelector("select");
            sel.focus();
        }).delay(300);
    },

    onCellAction : function(e){
        switch(e.data.action) {
            case "toggle":
                this.onToggleCompletionStatus(e);
                break;
            case "destroy":
                this.onDestroy(e);
                break;
        }
    },

    onDestroy : function(e){
        var row = e.data.row;
        this.todos.remove(row.getAttribute("data-id"))
    },

    onToggleCompletionStatus : function(e){
        var self=this;
        var cell    = e.data.cell;
        var row     = e.data.row;
        var id      = row.getAttribute("data-id");
        var check   = cell.querySelector("input");
            check.checked ?
                row.classList.add("completed"):
                row.classList.remove("completed");

        
        var todo = this.todos.getItemById(row.getAttribute("data-id"));
        todo.status = check.checked ?
            "completed":
            "active";
        this.todos.update(todo);
        this.onAfterStatusChanged(id);
        
    },

    onAfterStatusChanged : function(todo_id){
        var self = this;
        (function(){
            var row = self.querySelector(".row[data-id='" + todo_id + "']");
            var check = row.querySelector("input.toggle");
            check.focus();
        }).delay(300)
    },

    onResume : function(e){
        var status = e.data.status;
        var d = this.todos.getData();
        var items = (!status||status=="all")?
            d.items:
            d.items.where("$.status == '" + status + "'");

            items = (e.data.where && e.data.value.length > 0)?
                items.where("$." +e.data.where + " == " + e.data.value):
                items;

        this.onRenderData({
            table : "todo_list",
            items : items
        },true);

        document.querySelector("#username_filter select").value = e.data.value||"";
        this.onHighlightFilterButton(status);
    },

    onHighlightFilterButton : function(status){
        if(this.last_status_button){
            this.last_status_button.classList.remove("selected");
        }
        var a = this.querySelector("#filters #"+status + " .status-filter-button");
        if(a) {
            a.classList.add("selected");
            this.last_status_button = a;
        }
    },

    onInsert :function(todo){
        this.onRenderData(this.todos.getData(), true);
        this.onUpdateButtonBar();
    },

    onRemove : function(){
        this.onRenderData(this.todos.getData(),true);
        this.onUpdateButtonBar();
    },

    onUpdate : function(){
        this.onRenderData(this.todos.getData(),true);
        this.onUpdateButtonBar();
    },
    

    onDownloadComplete : function(d){
        this.onRenderData(d, true);
        this.onUpdateButtonBar();
    },

    onUpdateButtonBar : function(){
        var count   = this.todos
            .getData()
            .items
            .where("$.status=='active'").length;

        this.onRenderData({
            table : "button_bar",
            activeTodoCount : count
        });
    },

    onRenderData : function(data, initChildren){
        this.parent(data, initChildren);
        var cl      = this.element.classList;
        var items   = this.todos.getData().items;
        
        (items.length > 0) ?
            cl.remove("compactview") :
            cl.add("compactview");
    },

    onKeyUp : function(e){
        if(e.keyCode == 13){
            var data = {
                title:this.input.value,
                status : "active",
                ownerid:Session.user.id
            };
            var _todo = new todo.models.Todo(data);
            if(_todo.isValid()){
                this.todos.insert(_todo.data);
                this.onAfterCreate(_todo.data);
            } else {
                alert("invalid todo entry")
            }
        }
    },

    onAfterCreate : function(todo){
        this.input.value = "";
        this.httpbus.dispatchEvent("demo_todomvc_create", todo);
    },

    innerHTML:
    '<div></div>'
});



