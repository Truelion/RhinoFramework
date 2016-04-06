//= require js.Interface


namespace("ui.models.DragModel", 
{
    '@inherits':js.Interface,
    '@description' : [
        {   
            required:true,
            name: "onBeforeDragModelInitialized",
            type : Function,
            description: "ui.models.DragModel expected onBeforeDragModelInitialized() to be implemented",
            arguments:[
                {name:"scope", description:"", type:""}
            ]
        }
    ],
    
    
	initialize : function (hostObject) {
		var self	= this;
		this.component = hostObject;
	    var options = {
            preventDefault:true,
            stopPropagation:true,
            moveThreshold:0,
            minSwipeLength:72,
            minTapMoveDistance:5,
            usebounds:false,
            raf:false,
            gpu:false
       	};
       //	js.extend(options, this.component.onBeforeDragModelInitialized(options));
	    options.extend(this.component.onBeforeDragModelInitialized(options))
        
		this.reset();
	    this.options	= options;
	    this._ondrag    = this._ondrag.bind(this, options);
        this._onrelease = this._onrelease.bind(this, options);
        
        var handles = [].concat(options.handle);
        for(var i=0; i<=handles.length-1; i++) {
            var handle  = $CAST(handles[i], w3c.Node);
            var onpress = this._onpress.bind(this, options, handle);
            	handle.element.addEventListener("mousedown",  onpress, false);
            	handle.element.addEventListener("touchstart", onpress, false);
            	handle.element.onselectstart = function(){return false;};
            	handle.element.onclick = function(){return false;};
        }
	},
	
	reset : function(e){
		if(e){
			this.preventDefault(e,true);
       		this.cancelEvent(e);
		}
       	this.moved=false;
       	this.startMoveTime=null;
       	this.__internal_dragevent=null;
	},
	
	_onpress : function(options, handle, e){
       	this.reset(e);
        var position 		= this._getMouseCoordinates(e)[0];//TODO:Store ref to object not child
        this.position = position;
        this.startMouseX	= position.x;
        this.startMouseY	= position.y;
        //this.lastMouseX		= position.x;
        //this.lastMouseY		= position.y;
        this.lastOffsetLeft	= handle.element.offsetLeft;
        this.lastOffsetTop	=   handle.element.offsetTop;
        this.startMousedownTime = new Date().getTime();
        
        options.activehandle= handle;
       var eventdata = {
            handle:	handle, 
            target:	this.component, 
            x:		position.x, 
            y:		position.y,
            bounds: handle.getBoundingClientRect(),
            event:	e
        };
       var  pressevent = handle.dispatchEvent("pressed", true, true, eventdata);
        if(!pressevent.defaultPrevented){
        	this.component.onPress(pressevent);
            document.addEventListener("mousemove", this._ondrag,	true);
            document.addEventListener("touchmove", this._ondrag,    true);
            document.addEventListener("mouseup",   this._onrelease, true);
            document.addEventListener("touchend",  this._onrelease, true);
        }
      //  setTimeout(this.doTouchHold.bind(this, handle), 700);//TODO:Don't seem right. double-check logic for triggering 'taphold'
	},
	
	onPress:function(e){},
	
	/*doTouchHold : function(handle){//TODO:taphold default behavior should cancel all other drag events and fire release.
		var durationHeldDown = new Date().getTime()-this.startMousedownTime;
		if(!this.moved){
			var tapevent 		= new w3c.CustomEvent("taphold", true, true, {
	            handle:handle, 
	            target:this.component, 
	            x:this.position.x, 
	            y:this.position.y,
	            bounds: handle.getBoundingClientRect()
	        });
	        
	        handle.dispatchEvent(tapevent);
        	if(!tapevent.defaultPrevented()){
        		this.component.onTapHold(tapevent)
        	}
		}
	},
	
	onTapHold : function(){
		
	},*/
	
	onTap : function(){},
	
	_ondrag : function(options, e){
		var self=this;
	    var position 	= this._getMouseCoordinates(e)[0];//TODO:do not store ref to child
	    var nx  		= this.lastOffsetLeft + ((position.x - this.startMouseX));
	    var ny  		= this.lastOffsetTop  + ((position.y - this.startMouseY));
        var maxRight 	= (typeof options.bounds[1] == "function")? options.bounds[1](options.activehandle):options.bounds[1];
        var maxLeft  	= (typeof options.bounds[3] == "function")? options.bounds[3](options.activehandle):options.bounds[3];
        
        //TODO:Why do i need this?
        //this.lastMouseX		= position.x;
        //this.lastMouseY		= position.y;
        if(options.usebounds){
	        if(nx <= maxLeft)  { nx=maxLeft };
	        if(nx >= maxRight) { nx=maxRight};
        }
        var angle 		= this.caluculateAngle(position);//revisit
        var rect 		= options.activehandle.getBoundingClientRect();
        var direction 	= this._directionFromAngle(angle);
        
        //TODO:Also, make sure 'taphold' did'nt fire
        //move threshold
        if (Math.abs(position.x - this.startMouseX) > options.moveThreshold || 
        	Math.abs(position.y - this.startMouseY) > options.moveThreshold) {
			this.moved 	= true;
			this.startMoveTime = new Date().getTime();//TODO:cache this val. do not rewrite it.
			var eventPayload = {
	            handle:options.activehandle, //TODO:use this.activehandle
	            target:this.component, 
	            pageX:position.x, 
	            pageY:position.y,
	            offsetX:nx,
	            offsetY:ny,
	            offsetLeft: this.lastOffsetLeft,
	            offsetTop : this.lastOffsetTop,
	            fingers:(e.touches) ? (e.touches.length) : 1,
	            angle: angle,
	            direction: direction,
	            deltaX:position.x - this.startMouseX,//TODO:Move closer to offsetX,offsetY settings
	            deltaY:position.y - this.startMouseY,
	            bounds: {
	                left 	: Math.floor(rect.left),
	                top 	: Math.floor(rect.top),
	                width 	: Math.floor(rect.right - rect.left),
	                height	: Math.floor(rect.bottom - rect.top)
	            },  
	            event:e
	       };
		        
			/*if(!this.__internal_dragevent){
				this.__internal_dragevent = new w3c.CustomEvent("dragging", true, true, eventPayload);
			}
			else {
				this.__internal_dragevent.data = eventPayload;
			}*/
		};
		
         
       
       //var evt = this.__internal_dragevent;
       var activeHandle = options.activehandle;
       if(this.moved){
	       if(options.raf){
		       window.requestAnimationFrame(function(time){
		       		var evt = activeHandle.dispatchEvent("dragging", true, true, eventPayload);
		       		self.component.onMove(evt);
		       },activeHandle.element);
	       }
       }
	},
	
	onMove : function(e){},
	
	_onrelease : function(options, e){
	    document.removeEventListener("mousemove", this._ondrag,    true);
        document.removeEventListener("touchmove", this._ondrag,    true);
        document.removeEventListener("mouseup",   this._onrelease, true);
        document.removeEventListener("touchend",  this._onrelease, true);
        
        try{
	        var position 	= this._getMouseCoordinates(e)[0]; //incorrect position, use cached position defined in _drag() or...
	        if(!position){
	        	position = {
	        		x:0,y:0//TODO:Incorrect values. Use cached position from above
	        	}
	        }
	        var swipeLength = Math.round(Math.sqrt(Math.pow(position.x - this.startMouseX,2) + Math.pow(position.y - this.startMouseY,2)));
	        
	        

	        var movetime = this.startMousedownTime-new Date().getTime();
	        var moveDistanceX = position.x-this.startMouseX;
	        var moveDistanceY = position.y-this.startMouseY;
	        var velocityX = Math.round(Math.abs(moveDistanceX/movetime));
	        var velocityY = Math.round(Math.abs(moveDistanceY/movetime));
	        var velocity = { x: velocityX, y: velocityY };
	        
	        var durationHeldDown = new Date().getTime()-this.startMousedownTime;
			if((!this.moved || (swipeLength <= this.options.minTapMoveDistance)) && (!durationHeldDown || durationHeldDown<= 500) ){//TODO:Double check logic for tap.
				var tapevent 		= {//TODO:Add more data to event?
		            handle:options.activehandle, 
		            target:this.component, 
		            x:this.position.x, //TODO:x is incorrect
		            y:this.position.y, //TODO:y is incorrect
		            bounds: options.activehandle.getBoundingClientRect()
		        };
		        
		        var evt = options.activehandle.dispatchEvent("tap", true, true, tapevent);
	        	if(!evt.defaultPrevented){
	        		//this.component.onTap(tapevent)
	        	}
			}
			
	        var releaseevent = {
	        	handle:options.activehandle, 
	        	target:this.component, 
	        	moved:this.moved,
	        	swipeDistance:swipeLength,
	        	velocity:velocity
			};
	        var released_evt = options.activehandle.dispatchEvent("released", true, true,releaseevent);
	        this.component.onRelease(released_evt);
	        this.reset();
       	}
       	catch(e){
       		alert(e.message)
       	}
	},
	onRelease : function(e){},
	
	onBeforeDragModelInitialized : function onBeforeDragModelInitialized(options) {
	    return options||{};
	},
	
	_getMouseCoordinates : function _getMouseCoordinates( event )
    {
        event = event || window.event;
        if(!('ontouchstart' in window) || !('createTouch' in document)) {
        	
            return [{
                x: event.pageX || (event.clientX + (document.body.scrollLeft||0) + (document.documentElement.scrollLeft||0)),
                y: event.pageY || (event.clientY + (document.body.scrollTop||0)  + (document.documentElement.scrollTop||0))
            }];
        }
        else {
            var pos = [], evt, touches;
            touches = (event.touches.length<=0)?event.changedTouches:event.targetTouches;
            for(var t=0, len=touches.length; t<len; t++) {
                evt = touches[t];
                pos.push({ x: evt.pageX, y: evt.pageY });
            }
            return pos;
        }
    },
    
    
    _directionFromAngle: function _directionFromAngle(swipeAngle) {
		if ( (swipeAngle <= 45) && (swipeAngle >= 0) ) {
			swipeDirection = 'right';
		} else if ( (swipeAngle <= 360) && (swipeAngle >= 315) ) {
			swipeDirection = 'right';
		} else if ( (swipeAngle >= 135) && (swipeAngle <= 225) ) {
			swipeDirection = 'left';
		} else if ( (swipeAngle > 45) && (swipeAngle < 135) ) {
			swipeDirection = 'down';
		} else {
			swipeDirection = 'up';
		}
		return swipeDirection;
	},
	
	caluculateAngle : function caluculateAngle(position) {
		var X = position.x - this.startMouseX;
		var Y = position.y-this.startMouseY;
		var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
		var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
		swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
		if ( swipeAngle < 0 ) { swipeAngle =  360 - Math.abs(swipeAngle); }
		return swipeAngle;
	},
    
    preventDefault: function(e, selection) {
		if(!e){
			e = window.event;
		}
		if(e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
		
		if(selection && document.selection) {
			document.selection.empty();
		}
	},
	cancelEvent: function(e) {
		if(!e) {
			e = e||window.event;
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		}
		e.cancelBubble = true;
	}
});
