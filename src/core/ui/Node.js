namespace("core.ui.Node", {
    
    addEventListener : function(type, callback, capture, element){
    	capture = (typeof capture == "boolean") ? capture : false;
    	element = element||this.element;
    	if(callback && !callback.isBound) {
			callback = callback.bind(this);
		}
		
		return element.addEventListener(type, callback, capture);
    },

    querySelectorAll : function(cssSelector, element){
        element = element || this.element;
        if(document.querySelectorAll) {
            return [].toArray(element.querySelectorAll(cssSelector))}
        else {
            throw new Error("'#querySelectorAll()' api not defined")
        }
    },
    
    querySelector : function(cssSelector, element){
        element = element || this.element;
        if(document.querySelector) {
            return element.querySelector(cssSelector);}
        else {
            throw new Error("'#querySelector()' api not defined");
        }
    },
    
    removeEventListener : function(type, callback, capture, element){
    	element = element||this.element;
    	return element.removeEventListener(type, callback, capture)
    },
    
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
		slot.appendChild((child instanceof core.ui.Node || child.element) ? child.element:child);
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
        if( component instanceof core.ui.Node){
            compare = component.getBoundingClientRect();
        }
        else if(component && ("left" in component) && ("top" in component)){
            compare = component;
        }
        else {
            throw new Error(this.namespace + "#hittest(component); expected an instance of\
            core.ui.Node or {top:<int>, left:<int>}");
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
    },

    getParentBySelector : function ( elem, selector ) {
        elem = elem ||this.element;
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }
        return null;
    },

    getAllParentsBySelector : function ( elem, selector ) {
        elem = elem ||this.element;
        var parents = [];
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( selector ) {
                if ( elem.matches( selector ) ) {
                    parents.push( elem );
                }
            } else {
                parents.push( elem );
            }
        }
        return parents;
    },

    getParentBySelectorUntil : function ( elem, terminator, selector ) {
        elem = elem || this.element;
        var parent_node = null;
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( terminator ) {
                if ( elem.matches( terminator ) ) break;
            }
            if ( selector ) {
                if ( elem.matches( selector ) ) {
                    parent_node =  elem;
                    break;
                }
            }
        }
        return parent_node;
    },

    getRealTargetFromEvent : function(e, selector, terminator){
        var el = e.target;
        return this.getParentBySelectorUntil(el, terminator, selector);
    }
});
