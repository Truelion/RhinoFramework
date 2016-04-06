//= require ui.models.BooleanSelectionModel

namespace("ui.input.ToggleSwitch", 
{
	'@inherits'	: 	ui.input.Field,
	'@traits' :		[ui.models.BooleanSelectionModel],
	'@stylesheets':	[ 
		'ToggleSwitch/skin.css'
	],
	
	'@constants' : {
		OFF	: "Turn Off",
		ON	: "Turn On"
	},

	initialize : function(){
		this.input = this.querySelector("button");
		this.label = this.querySelector(".label");
		this.label.innerHTML = this.getAttribute("label")||"Label";
		this.caption = this.querySelector(".caption");
		this.addEventListener("toggled", this.onToggle, false);
		this.render();
	},
	
	render : function(e) {
		var status = this.selected?"-on":"-off";
		this.removeClass("-off");
		this.removeClass("-on");
		this.addClass(status);
		//this.removeClass((!this.selected)?"on":"off");
		this.set(this.selected);
		this.caption.innerHTML = status.replace("-","").capitalize();
		//this.setCaption();
	},
	
	mouseenter : function(){
		this.setCaption();
	},
	
	onToggle : function(e) {
		this.render(e);
	},
	
	setCaption : function(str){
		this.caption.innerHTML = (this.selected) ? 
			this["@constants"].OFF://else
			this["@constants"].ON;
	},
	
	mouseleave : function(){/*this.removeClass("mouseover");*/},
	
	
	set : function(val){
		this.input.value = val;
	},
	
	get : function(){
		return this.input.value;
	},
	
	innerHTML:
	'<div>\
		<label class="label">Enable Option:</label>\
		<span class="interior">\
			<span class="caption"></span>\
			<button></button>\
		</span>\
	</div>'
});
