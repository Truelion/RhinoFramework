
namespace("ui.input.Button", 
{
	'@inherits' :	ui.input.Field,
	'@stylesheets':	['Button/skin.css'],
	'@cascade':true,
	
	test : "Submit This",
	
	initialize : function(){
		this.addEventListener("mousedown", this.onMouseDown, false);
		this.addEventListener("mouseup", this.onMouseUp, false);
		this.setLabel();
		 //console.info(this.getBoundingClientRect())    
	},
	
	setLabel : function(str){
		this.labelString = str||this.getAttribute("label");
		this.label = this.querySelector('.label');
		if(this.label.textContent.length <=0){
		  this.label.innerHTML = this.labelString;
	    }
	},
	
	onRenderComplete : function(){
	    var self=this;
	    console.info(self.getBoundingClientRect())   
		
	},
	
	onShowBounds : function(e){
       //console.info(this.getBoundingClientRect())
	},
	
	onMouseDown : function(e){
	    console.log("pressed")
	},
	
	onMouseUp : function(){
	},
	
	innerHTML:
	'<div>\
		<div class="interior button">\
			<span class="icon"></span>\
			<span class="label"></span>\
		</div>\
	</div>'
	
});
