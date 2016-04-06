namespace("core.ui.SearchFilterDialog", 
{
    '@inherits'     : core.ui.WindowPanel,
    '@stylesheets'  : [],
    "@cascade"      : true,


    initialize : function() {
    	this.orderSelect 	= this.querySelector("select#order-filter");
    	this.sortSelect 	= this.querySelector("select#sort-filter");
    	this.okButton		= this.querySelector(".ok.button");
    	this.cancelButton	= this.querySelector(".cancel.button");

    	this.okButton.addEventListener("click", this.onSetFilterSelections.bind(this), false);
    	this.cancelButton.addEventListener("click", this.onUpdateViewFilters.bind(this), false);
    },

    onSetFilterSelections : function(e){
    	//this.accessor.set("order", 	this.orderSelect.value, this);
    	this.accessor.set("order", 	this.sortSelect.value, this);
    },

    onUpdateViewFilters : function(e){
    	if(e && e.owner == this){return}
    	//console.log("onUpdateViewFilters")
    	//this.orderSelect.value 	= this.accessor.data.order;
    	this.sortSelect.value 	= this.accessor.data.order;
    },

    bind : function(accessor) {
    	this.accessor = accessor;
    	this.onUpdateViewFilters(null);
    	this.accessor.addEventListener("changed", this.onUpdateViewFilters.bind(this),false);
    }
});
    
    
