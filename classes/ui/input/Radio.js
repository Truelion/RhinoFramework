//= require ui.models.BooleanSelectionModel

namespace("ui.input.Radio",
{
	'@inherits'		 :  ui.input.Field,
	"@stylesheets" : ["Radio/skin.css"],
	'@traits' :		[ui.models.BooleanSelectionModel],
	
	initialize : function(){
		this.input = this.querySelector('input');
		this.label = this.querySelector('.label');
		this.labelString = this.getAttribute("label");
		this.label.innerHTML = this.labelString;
		this.addEventListener("toggled", this.onRender, false);
	},
	
	get : function(){
		return this.input.checked == true;
	},
	
	onRender : function(e) {
	    if(e.eventPhase == 2) {
	    if(e.defaultPrevented()) {return false;}
	    //alert(e.phaseName + e.eventPhase)
		if(this.hasClass("checked")){this.removeClass("checked")}
		else {this.addClass("checked")};
		this.input.checked = this.hasClass("checked");
		}
	},
	
	set : function(bool, _dispatchEvent){
		if(typeof bool == "boolean"){
			this.input.checked = bool;
			if(true == bool) {
				if (!this.hasClass("checked")) {
					this.addClass("checked")
				}
			}
			else{ this.removeClass("checked")}
		};
		
		if (_dispatchEvent) {
			this.dispatchEvent("check", true, true, {
				target: this,
				value: this.input.checked
			});
		}
		
	},
	
	innerHTML:
	'<div>\
		<label class="label">Checkbox</label>\
		<div class="knob"><span class="indicator"></span></div>\
		<input type="radio"/>\
	</div>'
});