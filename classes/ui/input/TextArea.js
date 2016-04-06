
namespace("ui.controls.TextArea", {
	'@inherits'	:   w3c.HtmlComponent,
	'@cascade'  :   true,
	'@stylesheets': [ 'TextArea/skin.css' ],
	
	
	initialize : function(){
		this.maxlength = this.getAttribute("maxlength", "textarea");
		this.addEventListener("keydown", this.onLimit, false);
		this.addEventListener("keypress", this.onLimit, false);
		this.addEventListener("keypup", this.onLimit, false);
		window.tt = this;
	},
	
	onLimit : function(e){
		//console.log(" - typeof " + (typeof this.maxlength))
		var textarea = e.target||e.srcElement;
		//alert(textarea)
		if(textarea.value.length == this.maxlength){return}
		else{textarea.value = textarea.value.substr(0, this.maxlength);}
		//this.removeEventListener("keydown", this.onLimit, false)
	},
	
	innerHTML :
	'<textarea maxlength="1"></textarea>'
});
