
namespace("ui.input.TextField", 
{
	'@inherits' :	ui.input.Field,
	'@stylesheets':	[
		'TextField/skin.css'
	],
	
	initialize : function(){
		this.input = this.querySelector("input");
		this.error = this.querySelector(".error");
		this.addEventListener("keyup", this.onValidate, false);
		this.test = "";
	},
	
	onValidate : function(){
		/*if(!/^[A-Za-z\s]*$/.test(this.input.value)){
			this.error.style.display = "block";
		}
		else {
			this.error.style.display = "none";
		}*/
	},

	set : function(accessor){
		var input = this.querySelector("input[data-bind='" + accessor.jsonpath + "']")
		input.value = accessor.value();
	},
	
	get : function(){
		return this.input.value;
	},
	
	innerHTML:
	'<div>\
		<label>Firstname:</label>\
		<input type="text" data-bind="person.name"/>\
		<div class="button">\
			<span class="icon">&#9660;</span>\
		</div>\
	</div>'
});
