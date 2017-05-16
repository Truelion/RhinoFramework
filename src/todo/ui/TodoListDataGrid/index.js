

namespace("todo.ui.TodoListDataGrid", 
{
    '@inherits'     : core.ui.DataGrid,
    '@cascade'      : true,
    '@stylesheets'  : ["src/./index.css"],
    '@imports'      : [],
    //'@traits'       : [core.traits.EventTracker],
    '@href'         : "src/./index.html",

    initialize : function(){
        this.parent(arguments);
    }
 });