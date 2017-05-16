namespace("ui.models.ArraySelectionModel", {});
ui.models.ArraySelectionModel = {
	initialize : function () {
	    this.config = this.onConfigureSelector();
		this.selections = this.config.selections||[];
		this.addEventListener(this.options.on, this.onToggleState, false);
	},
	
	isSelectable : function isSelectable () {
	   return true;
	},
	
	onToggleState : function() {
	    if(this.isSelectable(e)){}
		//this.selected = (this.selected)? false:true;
		this.dispatchEvent(
			"toggled", 
			true, 
			true,
			{value: this.selected}
		);
	},
	
	set : function(val) {
		this.selected=val;
	}
};
