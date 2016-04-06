//= require ui.models.DragModel


namespace("ui.input.Slider", 
{
	'@inherits'    : ui.input.Field,
	'@stylesheets' : ['Slider.css'],
	'@traits'      : [ui.models.DragModel],
	
	initialize : function(){
	    /*this.addEventListener("pressed",   this.onPress,   false);
	    this.addEventListener("dragging",  this.onMove,    false);
	    this.addEventListener("released",  this.onRelease, false); 
	    this.addEventListener("render",  this.onRender, false); */
	   // alert("sdsad")
	   this.handles = [].toArray(this.querySelectorAll(".handle"));
	},
	
	onRender : function onRender (e) {
	   if(e.eventPhase==2){
	      
	   }
	},
	
	onTapHold : function(e){
		//alert("holding")	
	},
	
	onTap : function(e){
		//alert("hello")	
	},
	
	onBeforeDragModelInitialized : function onBeforeDragModelInitialized(options) {
        var self=this;
        options.raf=true;// uses requestAnimationFrame
        options.gpu = true;
        options.handle = this.handles;
        options.bounds = [0, function(handle){
            var containerW  = self.getBoundingClientRect(self.canvas).width;
            var handleW     = self.getBoundingClientRect(handle.element).width;
            return (containerW-handleW)-2
        }, 0, 0];//t r b l
        return options;
    },
	
	onPress : function onPress (e) {
	   console.info(e.data.event)
	   var el = e.data.handle.element;
	   var realleft;
	   
	   if(typeof window.getComputedStyle(el).webkitTransform == "string"){
	   		var curTransform = new WebKitCSSMatrix(window.getComputedStyle(el).webkitTransform);
	   		realleft = parseInt(curTransform.m41, 10);
	   		this.realleft = realleft;
	   		console.log(window.getComputedStyle(el).getPropertyValue("-webkit-transform"));
	   } else if(typeof el.style.MozTransform == "string"){
	   		var matrix = window.getComputedStyle(el).getPropertyValue("-moz-transform");
	   			matrix = matrix.replace("matrix(","").replace(")","").split(", ");
	   			this.realleft = parseInt(matrix[4],10);
	   		console.warn(window.getComputedStyle(el).getPropertyValue("-moz-transform"));
	   }
	   
	   
	   //this.realleft = realleft;
	   
	},
	
	
	
	onRelease : function onRelease(e) {

	},
	
	onMove : function onDrag(e) {
	  e.preventDefault();
	  var el = e.data.handle.element;
	  var left = parseInt(this.realleft||0,10) + parseInt(e.data.offsetX,10);
	  if(left <= 0){left=0;}
	  if(left >= 262) {left=262};

	   if(typeof window.getComputedStyle(el).webkitTransform == "string"){
	  		el.style.webkitTransform = 'translate3d(' + (left+"px") +' , 0, 0)';
	   } else if(typeof el.style.MozTransform == "string"){
	   		el.style.MozTransform 	= 'translate3d(' + (left+"px") +' , 0, 0)';
	   } else {
	   		el.style.left = left+"px";
	   }
	},
    
	innerHTML:
	'<div>\
		<label>Slider:</label>\
		<div class="knob handle">\
			<span class="icon"></span>\
		</div>\
	</div>'
});
