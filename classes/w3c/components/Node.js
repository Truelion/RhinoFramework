//= require w3c.traits.CSSSelectors

namespace("w3c.Node", {
    '@traits': [w3c.CSSSelectors],
	
    /*preInitialize : function(model, element){
        this.element = element;
        this.model 	 = model;
        this.initialize(model, element)
    },
    
    initialize : function(model, element){
    	
    },*/
    
    addEventListener : function(type, callback, capture, element){
    	capture = (typeof capture == "boolean") ? capture : false;
    	element = element||this.element;
    	if(callback && !callback.isBound) {
			callback = callback.bind(this);
		}
		
		return element.addEventListener(type, callback, capture);
    },
    
    removeEventListener : function(type, callback, capture, element){
    	element = element||this.element;
    	return element.removeEventListener(type, callback, capture)
    },
    
    /*addEventDelegate : function(className, type, callback, capture){
		var self = this;
		className = className.replace(".","");
		if(!this.delegates) {
			this.delegates={}
		};
		if(!this.delegates[type]) {
			this.delegates[type]=[]
		};
		this.delegates[type].push({
			className:className,
			callback:callback,
			capture:capture
		});
		
		this.addEventListener(type, function(e){
			if(!self.delegates[type]) { return }
			else {
				var handlers = self.delegates[type];
				for(var i=0; i<=handlers.length-1; i++) {
					var handler = handlers[i];
					if(e.target && self.hasClass(handler.className, e.target)) {
						handler.callback(e);
					}
				}
			}
		}, capture);
	},*/
    
    dispatchEvent : function(type, bubbles, cancelable, eventdata, element){
    	element 	= element||this.element;
    	bubbles 	= (typeof bubbles 	 == "boolean") ? bubbles 	: true;
    	cancelable 	= (typeof cancelable == "boolean") ? cancelable : true;
    	var evt 	= document.createEvent("Event");
		evt.initEvent(type, bubbles, cancelable);
		evt.data 	= eventdata;
		
		element.dispatchEvent(evt);
		return evt;
    },
    
    createEvent : function(type, bubbles, cancelable, eventdata){
    	bubbles 	= (typeof bubbles 	 == "boolean") ? bubbles 	: true;
    	cancelable 	= (typeof cancelable == "boolean") ? cancelable : true;
    	var evt 	= document.createEvent("Event");
			evt.initEvent(type, bubbles, cancelable);
			evt.data= eventdata;
		return evt;
    },
    
    
    parentNode: function(element){
    	element = element||this.element;
		return element.parentNode;
    },
    
    childNodes: function(element){
    	element = element||this.element;
		return element.childNodes;
    },
    
    firstChild: function(element, elementOnly){
		element = element||this.element;
        var fc = element.firstChild;
        if(elementOnly) {
	        while (fc&&fc.nodeType != 1) {
	            fc = fc.nextSibling;
	        }
        }
        return fc;
    },
    
    lastChild: function(element, elementOnly){
		element = element||this.element;
        var lc = element.lastChild;
        if(elementOnly) {
	        while (lc.nodeType != 1) {
	            lc = lc.previousSibling;
	        }
        }
        return lc;
    },
    
    hasChildNode : function (child, parent) {
		parent = parent||this.element;
		if (parent === child) { 
			return false; 
		}
		while (child && child !== parent) { 
			child = child.parentNode; 
		}
	   return child === parent;
	},
    
    previousSibling: function(element, elementOnly){
		element = element || this.element;
		element = element.previousSibling;
		var args = arguments;
        if(elementOnly) {
	        while (element && element.nodeType != 1) {
	        	element = element.previousSibling
	        }
       	}
        return element;
    },
    
    nextSibling: function(element, elementOnly){
		element = element || this.element;
		element = element.nextSibling;
		if(elementOnly) {
	        while (element && element.nodeType != 1) {
	        	element = element.nextSibling
	        }
       	}
		return element;
    },
    
    attributes: function(){
		element = element || this.element;
		return element.attributes;
    }, //NamedNodeMap
    
    ownerDocument: function(element){
    	element = element || this.element;
		return element.ownerDocument;
    },
    
	insertBefore: function(newNode, refNode){
		var el = refNode||this.element;
		return el.parentNode.insertBefore(newNode, el);
    },
	
	insertAfter : function(newNode, refNode) {
		var el = refNode||this.element;
		return el.parentNode.insertBefore(newNode, this.nextSibling(el));
	},
	
	swapNode : function(b) {
	    var a = this.element;
	    var t = a.parentNode.insertBefore(document.createTextNode(""), a);
	    b.parentNode.insertBefore(a, b);
	    t.parentNode.insertBefore(b, t);
	    t.parentNode.removeChild(t);
	    return this;
	},
    
    replaceChild : function(newChild, oldChild){
    	oldChild = oldChild||this.element;
		return oldChild.parentNode.replaceChild(newChild, oldChild);
	},
    
    removeChild : function(element){
		element = element||this.element;
		return element.parentNode.removeChild(element);
	},
    
    appendChild : function(child, slot, element){
		element = element||this.element;
		slot = (typeof slot === "string") ? this.querySelector(slot) : slot;
		slot = (slot)? slot:element;
		slot.appendChild((child instanceof w3c.Node || child.element) ? child.element:child);
		return child;
	},
    
    hasChildNodes: function(){
		return (this.childNodes().length > 0);
    },
    
    cloneNode : function(deep){
		deep = (typeof deep !== "undefined")? deep:true;
		return new this.constructor({}, this.element.cloneNode(deep));
	},
    
    getBoundingClientRect : function(element) {
        element = element||this.element;
        if (element.getBoundingClientRect) {
            // (1)
            var box = element.getBoundingClientRect();
            
            var body    = document.body
            var docElem = document.documentElement
            
            // (2)
            var scrollTop   = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft  = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
            
            // (3)
            var clientTop   = docElem.clientTop || body.clientTop || 0
            var clientLeft  = docElem.clientLeft || body.clientLeft || 0
            
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
            }
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
    
    hittest : function(component) {
        if(!component){ return false }
        var compare,bounds;
        if( component instanceof w3c.Node){
            compare = component.getBoundingClientRect();
        }
        else if(component && ("left" in component) && ("top" in component)){
            compare = component;
        }
        else {
            throw new Error(this.namespace + "#hittest(component); expected an instance of\
            w3c.Node or {top:<int>, left:<int>}");
        }
        bounds = this.getBoundingClientRect();
        return (compare.left > bounds.left && compare.top > bounds.top && compare.left < bounds.right && compare.top < bounds.bottom);
    },
    
    getAttribute : function(attrName, element){
        element = element||this.element;
        if(element && typeof element == "string") {
            element = this.querySelector(element)||this.element;
        }
        var val = element.getAttribute(attrName);
        if(isNaN(val) == false && (/^\d+$/.test(val))) {
            return parseInt(val, 10);
        } else {
            return val;
        }
    }
});
