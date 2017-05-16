

namespace("todo.ui.UserDropdownList", 
{
    '@inherits'     : core.ui.WebComponent,
    '@cascade'      : true,
    '@stylesheets'  : ["src/./index.css"],
    '@imports'      : [],
    //'@traits'       : [core.traits.EventTracker],
    //'@href'         : "src/./index.html",

    initialize : function(){
        this.parent(arguments);
        this.select = this.querySelector("select");
        this.dataController = new core.controllers.AccountDataController;
        this.onRenderData(this.dataController.getData());
    },

    onDownloadComplete : function(data){
    	this.onRenderData(data,true);
    },

    onRenderData : function(data){
        //debugger;
        var selected_user = this.element.getAttribute("data-userid");
        var option_prefix = this.element.getAttribute("data-option-prefix")||"";
        var empty_option =  this.element.getAttribute("data-empty-option");
        if(empty_option){
             var opt = document.createElement("option");
                opt.text = empty_option;
                opt.value = "";
                opt.selected=true;
                this.select.appendChild(opt);

        }
        for(var i=0; i<=data.items.length-1; i++){
            var user = data.items[i];
            var opt = document.createElement("option");
                opt.value = user.id;
                opt.text = option_prefix + user.fullname;
                if(selected_user) {
                    if(user.id == selected_user) {
                        opt.setAttribute("selected",true);
                    }
                }
            this.select.appendChild(opt);
        }
    }
 });