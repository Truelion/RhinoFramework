namespace("ui.models.BooleanSelectionModel", {});
ui.models.BooleanSelectionModel = {
	initialize : function () {
		this.selected = false;
		this.addEventListener("click", this.onToggleState, false);
	},
	
	onToggleState : function() {
		this.selected = (this.selected)? false:true;
		this.dispatchEvent(
			"toggled", 
			true, 
			true,
			{value: this.selected}
		);
	},
	
	set : function(val) {
		this.selected=val;
		this.onToggleState();
	},
	
	get : function(){
		return this.selected;
	}
};
