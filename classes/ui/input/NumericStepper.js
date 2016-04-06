namespace("ui.input.NumericStepper",
{	
    '@inherits'    	: ui.input.Field,
    '@cascade'		: true,
    '@stylesheets' 	: [ "NumericStepper/skin.css" ],
    
    
    initialize : function(){
    	this.input 		= this.querySelector("input");
    	this.upButton 	= this.querySelector(".up");
    	this.dnButton 	= this.querySelector(".down");
    	this.stepTimerID= null;
    	
    	this.addEventListener("mousedown", 	this.onDown.bind(this), 	false, this.dnButton);
    	this.addEventListener("mouseup", 	this.onReleased.bind(this), false, this.dnButton);
    	this.addEventListener("mousedown", 	this.onUp.bind(this), 		false, this.upButton);
    	this.addEventListener("mouseup", 	this.onReleased.bind(this), false, this.upButton);
    	this.addEventListener("hoverout", 	this.onReleased, 			false);
    	this.addEventListener("keydown", 	this.onKeyDown.bind(this), 	false, this.input);
    	this.addEventListener("keyup", 		this.onReleased.bind(this), false, this.input);
    },

    onReleased : function(){
    	window.clearInterval(this.stepTimerID);
    	this.stepTimerID=null;
    },
    
    onUp : function(){
    	if(!this.stepTimerID){
    		this.stepTimerID = window.setInterval(this.onUp.bind(this), 100);
		}
		
    	var count = parseInt(this.input.value,10);
    	if(count >=0){
    		count = count+1;
    		this.input.value = count;
		}
    },
    
    onKeyDown : function(e){
    	console.log("Keycode:" + e.keyCode)
    },
    
    
    onDown : function(){
    	if(!this.stepTimerID){
    		this.stepTimerID = window.setInterval(this.onDown.bind(this), 100);
		}
		
		var count = this.input.value;
    	if(count <= 0){
    		return;
    	}
    	else {
    		count = count-1;
    		this.input.value = count;
    	}
    },
    
    innerHTML:
    '<div>\
    	<label>Test:</label>\
		<input type="text" value="0"/>\
		<div class="knobs">\
			<div class="up knob">&#9650;</div>\
			<div class="down knob">&#9660;</div>\
		</div>\
	</div>'
});
    