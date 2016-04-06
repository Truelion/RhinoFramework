//= require w3c.components.Element
//= require js.Interface
//= require ui.models.DragModel


namespace("ui.models.DragGestureModel", 
{
    '@inherits':ui.models.DragModel,

	initialize : function (hostObject) {
	    var options;
	    this._ongesturestart	= this._ongesturestart.bind(this);
	    this._ongesturemove    	= this._ongesturemove.bind(this, options);
        this._ongestureend 		= this._ongestureend.bind(this, options);
        
        this.hostObject.addEventListener("pressed", this._ongesturestart, false);
	},
	
	_ongesturestart : function(e){
        var position 		= this._getMouseCoordinates(e)[0];
        this.startMouseX	= position.x;
        this.startMouseY	= position.y;
        this.lastMouseX		= position.x;
        this.lastMouseY		= position.y;
        var onGestureStartEvent = new w3c.CustomEvent("gesturestart", true, true, {
            handle:e.data.handle, 
            target:this.hostObject, 
            startMouseX:this.startMouseX,
            startMouseY:this.startMouseY,
            bounds: this.getBoundingClientRect(),
            event:e
        });
        this.dispatchEvent(onGestureStartEvent);
        if(!onGestureStartEvent.defaultPrevented()){
            document.addEventListener("mousemove", this._ongesturemove,	true);
            document.addEventListener("touchmove", this._ongesturemove, true);
            document.addEventListener("mouseup",   this._ongestureend, 	true);
            document.addEventListener("touchend",  this._ongestureend, 	true);
        }
	},
	
	_ongesturemove : function(options, e){
	    var position 	= this._getMouseCoordinates(e)[0];
	    var nx  		= this.lastOffsetLeft + ((position.x - this.lastMouseX));
	    var ny  		= this.lastOffsetTop  + ((position.y - this.lastMouseY));
        var maxRight 	= (typeof options.bounds[1] == "function")? options.bounds[1](options.activehandle):options.bounds[1];
        var maxLeft  	= (typeof options.bounds[3] == "function")? options.bounds[3](options.activehandle):options.bounds[3];
        
        if(nx <= maxLeft)  { nx=maxLeft; }
        if(nx >= maxRight) { nx=maxRight;}
        var angle 		= this.caluculateAngle(position);//Math.atan2(position.y - this.startMouseY, position.x - this.startMouseX) * 180 / Math.PI;
        var rect 		= options.activehandle.getBoundingClientRect();
        var direction 	= this._directionFromAngle(angle);
        if (Math.abs(position.x - this.startMouseX) > options.moveThreshold || Math.abs(position.y - this.startMouseY) > options.moveThreshold) {
			this.moved = true;
		}
        var dragevent 	= new w3c.CustomEvent("dragging", true, true, {
            handle:options.activehandle, 
            target:this.hostObject, 
            pageX:position.x, 
            pageY:position.y,
            offsetX:nx,
            offsetY:ny,
            offsetLeft: this.lastOffsetLeft,
            offsetTop : this.lastOffsetTop,
            fingers:(e.touches) ? (e.touches.length) : 1,
            angle: angle,
            direction: direction,
            deltaX:position.x - this.lastMouseX,
            deltaY:position.y - this.lastMouseY,
            bounds: {
                left 	:  Math.floor(rect.left),
                top 	: Math.floor(rect.top),
                width 	: Math.floor(rect.right - rect.left),
                height	: Math.floor(rect.bottom - rect.top)
            },  
            event:e
        });
        
       if(this.moved){
	       setTimeout(function(){
	       		options.activehandle.dispatchEvent(dragevent);
	       }, 5)
       }
	},
	
	_ongestureend : function(options, e){
	    document.removeEventListener("mousemove", this._ondrag,    true);
        document.removeEventListener("touchmove", this._ondrag,    true);
        document.removeEventListener("mouseup",   this._onrelease, true);
        document.removeEventListener("touchend",  this._onrelease, true);
            
        var releaseevent = new w3c.CustomEvent("released", true, true, {handle:options.activehandle, target:this.hostObject, moved:this.moved});
        options.activehandle.dispatchEvent(releaseevent);
        this.moved = false;
	}
});
