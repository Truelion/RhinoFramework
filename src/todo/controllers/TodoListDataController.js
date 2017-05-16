

namespace("todo.controllers.TodoListDataController", {
    '@inherits' : core.controllers.LocalStorageDataController,
    CONFIG:ROUTES.DATA.TODO_LIST,


	initialize : function(host, async){
		this.parent(host, async);
	},

	clearCompleted : function(){
		this.removeByQuery("$.status == 'completed'");
	}
});