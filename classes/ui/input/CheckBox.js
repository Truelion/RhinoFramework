//= require ui.models.BooleanSelectionModel


namespace("ui.input.CheckBox",
{
	'@inherits'		 :  ui.input.Field,
	"@stylesheets" : ['CheckBox/skin.css'],
	'@traits' :		 [ui.models.BooleanSelectionModel],

    
	initialize : function(){
		this.input = this.querySelector('input');
		this.addEventListener("toggled", this.onRender, false);
		window.checkbox = this;
		this.setLabel();
	},
	
	setLabel : function(){
	   this.label = this.querySelector('label');
       this.label.innerHTML = (this.getAttribute("label")||"Missing Label")  
	},

	onRender : function(e) {
		console.log("checked")
	    //if(e.eventPhase == 2) {
    		if(this.hasClass("checked")){this.removeClass("checked")}
    		else {this.addClass("checked")};
    		this.input.checked = this.hasClass("checked");
		//}
	},

	innerHTML:
	'<div>\
		<label class="label">Checkbox</label>\
		<div class="knob"><span class="indicator"></span></div>\
		<input type="checkbox"/>\
	</div>',
	
	cssText:
	'.CheckBox {\
		border:1px solid red;\
	}'
});
