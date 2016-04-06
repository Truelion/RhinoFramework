
namespace("ui.input.RadioGroup", 
{
	'@inherits' :	ui.input.Field,
	'@cascade'  : true,
	'@stylesheets':	[
		'RadioGroup/skin.css'
	],
	
	initialize : function(){
		this.addEventListener("toggled", this.onRadioItemSelected, true);
	},
	
	onRadioItemSelected : function(e){
		var items = this.querySelectorAll(".Radio");
		
		for(var i=0; i<=items.length-1; i++){
			var radio = items[i] && items[i].prototype;
			if( radio) {radio.set(false,false)}
		};

		try{e.target.set(true, false)} catch(e){};
		e.stopPropagation();
		e.preventDefault();
		return false;
	},
	
	get : function(){
		var items = this.querySelectorAll(".Radio");
		for(var i=0; i<=items.length-1; i++){
			var radio = items[i] && items[i].prototype;
			if(radio && radio.get() == true) {
				return radio;
			}
		}
	},
	
	innerHTML:
	'<div>\
		<label>Make a selection:</label>\
		<div namespace="ui.input.Radio" label="Option Test 1"></div>\
    	<div namespace="ui.input.Radio" label="Option Test 2"></div>\
	</div>'
});
