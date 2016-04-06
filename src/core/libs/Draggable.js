var Draggable = function(hostObject, options){
    this.initialize(hostObject, hostObject.onDragConfigure ?
            hostObject.onDragConfigure():
            options
    );
};


Draggable.prototype = {
    initialize : function (hostObject,options) {
        var self=this;
        this.onMoveHandler      = this.onMoveHandler.bind(this);
        this.onEndHandler       = this.onEndHandler.bind(this);
        this.onMouseDownHandler = this.onMouseDownHandler.bind(this);
        this.onLongHoldHandler  = this.onLongHoldHandler.bind(this);
        this.setElement(hostObject);
        this.setOptions(options);
        this.setMethods();
        this.enable();
    },
    
    onMove : function(e){
        var target = e.data.target;
        var x = e.data.offsetX;
        var y = e.data.offsetY;
        e.target.classList.add("positioned");
        target.style.left = x + "px";
        target.style.top  = y + "px";
    },
    
    onPress         : function(e) {},
    
    onTapHold       : function(e) {},
    
    onDragEnd       : function(e) {
        this.dnd.element.classList.remove("dragging");
    },
    
    onCancelDrag    : function(e) {},
    
    onGrabHold      : function(e) {},
    
    onDragStart : function(e){
        var bounds = this.dnd.getBoundingClientRect(this.dnd.element);
        var draggable = e.data.target;
            draggable.style.left = bounds.left + "px";
            draggable.style.top = bounds.top + "px";
        document.body.appendChild(draggable);
        this.dnd.element.classList.add("dragging");
    },
    
    getDragTarget   : function(e) {
        var target=this.element;
        if(this.options.ghosting){
            target = this.element.cloneNode(true);
            target.classList.add("Ghost");
        }
        return target;
    },
    
    setMethods      : function(){
        this.component.dnd = this; 
        this.element.dnd = this;  
    },
    
    getHandle : function(){
        var handleStr = this.options.draghandle;
        return this.element.querySelector(handleStr)||this.element;
    },
    
    enable : function(){
        var target = this.getHandle();
        target.addEventListener("mousedown", this.onMouseDownHandler, false);
        target.addEventListener("touchstart", this.onMouseDownHandler, false);
    },
    
    disable : function(force){
        document.removeEventListener("mousemove", this.onMoveHandler, false);
        document.removeEventListener("touchmove", this.onMoveHandler, false);
        document.removeEventListener("mouseup",   this.onEndHandler,  false);
        document.removeEventListener("touchend",   this.onEndHandler,  false);
        if(this.options.disposeOnRelease||force==true){
            var target = this.getHandle();
            target.removeEventListener("mousedown",   this.onMouseDownHandler,  false);
            target.removeEventListener("touchstart",  this.onMouseDownHandler,  false);
        }
    },
    
    setOptions : function(options){
        options=options||{};
        this.options={
            ghosting:           (this.element.getAttribute("ghosting")=="false")?false:true,
            holdtodrag:         (this.element.getAttribute("holdtodrag")=="true")?true:false,
            holdtiming:         parseInt(this.element.getAttribute("holdtiming"))||1000,
            holdSensitivity:    parseInt(this.element.getAttribute("holdSensitivity"))||50,
            gridsize:           parseInt(this.element.getAttribute("gridsize"))||100,
            snaptogrid:         (this.element.getAttribute("snaptogrid")=="true")?true:false,
            sticky:             (this.element.getAttribute("sticky")=="true")?true:false,
            disposeOnRelease:false,
            positionable:true,
            draghandle:        this.element.getAttribute("draghandle")
        };
        
        this.extend(this.options,options);
        var component       = this.component; 
        this.onPress        = (this.options.onPress||component.onPress||this.onPress).bind(component);
        this.onTapHold      = (this.options.onTapHold||component.onTapHold||this.onTapHold).bind(component);
        this.onMove         = (this.options.onMove||component.onMove||this.onMove).bind(component);
        this.onCancelDrag   = (this.options.onCancelDrag||component.onCancelDrag||this.onCancelDrag).bind(component);
        this.onGrabHold     = (this.options.onGrabHold||component.onGrabHold||this.onGrabHold).bind(component);
        this.onDragEnd      = (this.options.onDragEnd||component.onDragEnd||this.onDragEnd).bind(component);
        this.onDragStart    = (this.options.onDragStart||component.onDragStart||this.onDragStart).bind(component);
        //this.onGhostDragStart = (this.options.onGhostDragStart||component.onGhostDragStart||this.onGhostDragStart).bind(component);
        this.onMovePosition = (this.options.onMovePosition||component.onMovePosition||this.onMovePosition).bind(component);
        this.onRevertPosition = (this.options.onRevertPosition||component.onRevertPosition||this.onRevertPosition).bind(component);
    },
    
    onRevertPosition : function(){},
    
    onMovePosition : function(e){
        var left = e.data.left;
        var top = e.data.top;
        e.target.classList.add("positioned");
        e.target.style.left = left +"px";
        e.target.style.top  = top  +"px";
    },
    
    
    onMouseDownHandler : function(e){
        //e.preventDefault();
        var self        = this;
        var coords      = this.getMouseCoordinates(e)[0];
        this.startTime  = new Date().getTime();
        this.bounds     = this.getBoundingClientRect(this.element);
        this.startX     = coords.pageX;
        this.startY     = coords.pageY;
        this.deltaX     = 0;
        this.deltaY     = 0;
        this.lastVX     = coords.pageX;
        this.lastVY     = coords.pageY;
        this.canMove    = false;
        this.hasMoved   = false;
        this.isDragging = false;
        this.target     = this.getDragTarget();
        var eventdata   = {
            component:this,
            target:this.target,
            startX:this.startX,
            startY:this.startY,
            deltaX:this.deltaX,
            deltaY:this.deltaY,
            draggable:this.component,
            originalEvent:e
        };
        var pressevent  = this.dispatchEvent("pressed",  true,  true,  eventdata);
        var cancelevt   = this.createEvent("canceldrag", true,  true,  eventdata);
        
        if(!pressevent.defaultPrevented){
            this.onPress(pressevent);
            if(pressevent.defaultPrevented){
                this.element.dispatchEvent(cancelevt);
                this.onCancelDrag(cancelevt);
                return;
            };
            
            document.addEventListener("mousemove", this.onMoveHandler, false);
            document.addEventListener("touchmove", this.onMoveHandler, false);
            document.addEventListener("mouseup",   this.onEndHandler,  false);
            document.addEventListener("touchend",  this.onEndHandler,  false);
            this.longClickTimer = setTimeout(this.onLongHoldHandler,this.options.holdtiming);
        } 
        else {
            this.element.dispatchEvent(cancelevt);
            this.onCancelDrag(cancelevt);
        }
    },
    
    isDraggable : function(deltaX,deltaY){
        if(this.options.holdtodrag){
            return this.canMove;
        } else {
            var delta  = this.options.gridsize;
            var sticky = this.options.sticky;
            if(!sticky){
                return true;
            }
            else{
                return Math.abs(deltaX) > delta || Math.abs(deltaY) > delta; //|| this.canMove;
            }
        }
    },
    
    onLongHoldHandler : function(){
        var self=this;
        var evt = self.dispatchEvent("taphold", true, true, {component:self});
        if(!evt.defaultPrevented){
            self.onTapHold(evt);
            if(evt.defaultPrevented){return;}
            if(self.options.holdtodrag){
                var delta = self.options.holdSensitivity;
                if(Math.abs(self.deltaX) < delta && Math.abs(self.deltaY) < delta){
                    self.canMove=true;
                    var grabevt = self.dispatchEvent("grabhold", true, true, {component:self});
                    if(!grabevt.defaultPrevented){
                        self.onGrabHold(evt);
                    }
                }
            }
        }
   },
    
    onMoveHandler : function(e) {
        e.preventDefault();
        var self    = this;
        var coords  = this.getMouseCoordinates(e)[0];
        this.deltaX = coords.pageX-this.startX;
        this.deltaY = coords.pageY-this.startY;
        this.vx     = coords.pageX - this.lastVX;
        this.vy     = coords.pageY - this.lastVY;
        this.lastVX = coords.pageX;
        this.lastVY = coords.pageY;
        
        if (this.isDraggable(self.deltaX,self.deltaY)) {
            clearTimeout(this.longClickTimer);
            if(!this.isDragging){
                this.isDragging  = true;
                this.hasMoved    = true;
                if(self.options.autoz){
                    this.target.style.zIndex=self.getHighestZindex();
                }
                var dragStartevt = this.dispatchEvent(
                    "dragstart", true, true, { 
                    deltaX  : self.deltaX,
                    deltaY  : self.deltaY,
                    pageX   : coords.pageX,
                    pageY   : coords.pageY,
                    startX  : this.startX,
                    startY  : this.startY,
                    target  : this.target,
                    originalEvent:e,
                    component:this.component,
                });
                if(!dragStartevt.defaultPrevented){
                    this.onDragStart(dragStartevt);
                }
            }
            //window.requestAnimationFrame(function(time){
                if(!self.target){return;}//raf timing bug
                var newcoords = {
                    x : self.bounds.left + self.deltaX, 
                    y : self.bounds.top  + self.deltaY,
                    snapX : self.deltaX,
                    snapY : self.deltaY,
                };
                if(self.options.snaptogrid){
                    self.onSnapToGrid(newcoords);
                }
                
                var dragevt = self.dispatchEvent(
                    "dragging", true, true, { 
                    deltaX  : self.deltaX,
                    deltaY  : self.deltaY,
                    offsetX : newcoords.x,
                    offsetY : newcoords.y,
                    vx      : self.vx,
                    vy      : self.vy,
                    pageX   : coords.pageX,
                    pageY   : coords.pageY,
                    startX  : self.startX,
                    startY  : self.startY,
                    target  : self.target,
                    originalEvent:e,
                    component:self.component,
                });
                //TODO: dispatchEvent(dragevt) here so that it can be canceled 
                (!dragevt.defaultPrevented) ?
                    self.onMove(dragevt):
                    self.onCancelDrag(dragevt);
            //},self.target);
        }
    },
    
    onEndHandler : function(e) {
        //e.preventDefault();
        clearTimeout(this.longClickTimer);
        this.canMove    = false;
        this.isDragging = false;
        this.disable(e);
        
        var coords  = this.getMouseCoordinates(e)[0];
        var distX   = coords.pageX - this.startX;
        var distY   = coords.pageY - this.startY;
        var elapsedTime = new Date().getTime() - this.startTime;
        var allowedTime = 300;
        var restraint = 100;
        var threshold = 10;
        
        var swipeDir="none";
        
        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                swipeDir = (distX < 0)? 'left' : 'right'
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipeDir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
           
        var ghostBounds = this.getBoundingClientRect(this.target);
        if(this.options.ghosting && this.hasMoved){
            try{this.target.parentNode.removeChild(this.target);}
            catch(e){}
        } 
        
        if(this.options.positionable){
            var positionMovedEvt = this.dispatchEvent(
                "moveposition", 
                true, true, {
                component:this.component, 
                originalEvent:e, 
                left:ghostBounds.left,
                top:ghostBounds.top
            });
            if(!positionMovedEvt.defaultPrevented){
                this.onMovePosition(positionMovedEvt);
            }   
        } else {
            this.onRevertPosition(e);
        }
        var endevnt = this.dispatchEvent(
            "enddrag", true, true, {
            component:this.component, 
            vx:this.vx,
            vy:this.vy,
            swipedir:swipeDir,
            elapsedTime:elapsedTime,
            distX:distX,
            distY:distY,
            originalEvent:e
        });
        this.onDragEnd(endevnt);
    },
    
    onSnapToGrid : function(coords,gridSize){
        gridSize = gridSize||this.options.gridsize;
        coords.x = gridSize * Math.round(coords.x/gridSize);
        coords.y = gridSize * Math.round(coords.y/gridSize);
        coords.snapX = gridSize * Math.round(coords.snapX/gridSize);
        coords.snapY = gridSize * Math.round(coords.snapY/gridSize);
        return coords;
    },
    
    getMouseCoordinates : function( event )
    {
        event = event || window.event;
        if(!('ontouchstart' in window) || !('createTouch' in document)) {
            
            return [{
                pageX: event.pageX || (event.clientX + (document.body.scrollLeft||0) + (document.documentElement.scrollLeft||0)),
                pageY: event.pageY || (event.clientY + (document.body.scrollTop||0)  + (document.documentElement.scrollTop||0))
            }];
        }
        else {
            var pos = [], evt, touches;
            touches = (event.touches.length<=0)?event.changedTouches:event.targetTouches;
            for(var t=0, len=touches.length; t<len; t++) {
                evt = touches[t];
                pos.push({ pageX: evt.pageX, pageY: evt.pageY });
            }
            return pos;
        }
    },
    
    getBoundingClientRect : function(element) {
        element = element||this.element;
        if (element.getBoundingClientRect) {
            // (1)
            var box = element.getBoundingClientRect();
            
            var body    = document.body;
            var docElem = document.documentElement;
            
            // (2)
            var scrollTop   = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft  = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            
            // (3)
            var clientTop   = docElem.clientTop || body.clientTop || 0;
            var clientLeft  = docElem.clientLeft || body.clientLeft || 0;
            
            // (4)
            var top  = box.top  + (scrollTop  - clientTop);
            var left = box.left + (scrollLeft - clientLeft);
            
            return { 
                top: Math.round(top), 
                left: Math.round(left),
                right:  Math.round(box.right),
                bottom:  Math.round(box.bottom),
                width : Math.round(box.right - left),
                height: Math.round(box.bottom - top)
            };
        }
        else {
            //console.warn(this.namespace + "#getBoundingClientRect() - not supported by 'this.element' node on this device.")
            var top=0, left=0, right=0, bottom=0, width=0, height=0;
            while(element) {
                top  = top  + parseInt(element.offsetTop, 10);
                left = left + parseInt(element.offsetLeft,10);
                right = left + element.offsetWidth;
                bottom = top + element.offsetHeight;
                width = element.offsetWidth;
                height = element.offsetHeight;
                element = element.offsetParent;       
            };
            return {top: top, left: left, right:right, bottom:bottom, width:width, height:height};
        }
    },
    
    insertAfter : function(newNode, refNode) {
        var el = refNode||this.element;
        return el.parentNode.insertBefore(newNode, this.nextSibling(el));
    },
    
    nextSibling: function(element, elementOnly){
        element = element || this.element;
        element = element.nextSibling;
        if(elementOnly) {
            while (element && element.nodeType != 1) {
                element = element.nextSibling;
            }
        }
        return element;
   },
   
   dispatchEvent : function(type, bubbles, cancelable, eventdata, element){
        element     = element||this.element;
        bubbles     = (typeof bubbles    == "boolean") ? bubbles    : true;
        cancelable  = (typeof cancelable == "boolean") ? cancelable : true;
        var evt     = document.createEvent("Event");
        evt.initEvent(type, bubbles, cancelable);
        evt.data    = eventdata;
        
        element.dispatchEvent(evt);
        return evt;
   },
   

   addEventListener : function(type, callback, capture, element) {
        capture = ( typeof capture == "boolean") ? capture : false;
        element = element || this.element;
        if (callback && !callback.isBound) {
            callback = callback.bind(this);
        }

        return element.addEventListener(type, callback, capture);
    },

   
   createEvent : function(type, bubbles, cancelable, eventdata){
        bubbles     = (typeof bubbles    == "boolean") ? bubbles    : true;
        cancelable  = (typeof cancelable == "boolean") ? cancelable : true;
        var evt     = document.createEvent("Event");
            evt.initEvent(type, bubbles, cancelable);
            evt.data= eventdata;
        return evt;
    },
   
   extend : function(destination, source){
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
   },
   
   setElement : function(hostObject){
        var el = hostObject.element||hostObject;
        if(!el || el.nodeType != 1) {
            throw new Error("Draggable.prototype#setElement(host) - expected argument [host] or [host.element] \
            to be of type Node (where nodeType == 1).");
        }
        el.dnd=this;
        this.element   = el;
        this.component = hostObject;
        return el;
    },
    
    globalzindex : 600000,
    
    getHighestZindex : function(nodeReference){
        this.globalzindex = this.globalzindex + 1;
        return this.globalzindex;
    }
};