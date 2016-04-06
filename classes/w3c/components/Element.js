//= require w3c.components.Node

namespace("w3c.Element", {
	'@inherits' : w3c.Node,
	
	/*initialize : function(element) {
        try {
            this.element = element;
        } 
        catch(e){
            var msg = this.namespace + "#preInitialize() - " + e.message;
            try{console.error(msg)} catch(e){};
            throw e;
        }
        return this;
    },*/
    
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
	
	setAttribute : function(attrName, attrValue, element){
		element = element||this.element;
		return element.setAttribute(attrName, attrValue);
	},
	
	getAttributes : function(element){
	    element = element||this.element;
        var arr = [];
        for (var i=0, attrs=element.attributes, l=attrs.length; i<l; i++){
            arr.push({nodeName:attrs[i].nodeName, nodeValue:(attrs[i].value||attrs[i].nodeValue)});
        }
        return arr;
	},
	
	setAttributes : function(attrbs, element){
	    element = element||this.element;
		for(var i=0; i<=attrbs.length-1; i++) {
			if (attrbs[i] && attrbs[i].nodeName != "cuuid") {
				this.setAttribute(attrbs[i].nodeName, (attrbs[i].value||attrbs[i].nodeValue));
			}
		}
	},
	
	removeAttributes : function(attrbs, element){
        element = element||this.element;
        for(var i=0; i<=attrbs.length-1; i++) {
            if (attrbs[i] && attrbs[i].nodeName != "cuuid") {
                this.removeAttribute(attrbs[i].nodeName,element);
            }
        }
    },
	
	removeAttribute : function(attrName, element){
		element = element||this.element;
		return element.removeAttribute(attrName);
	},
	
	getAttributeNode : function(){
		throw new Error("w3c.Element#getAttributeNode() not yet implemented");
	},
	
	setAttributeNode : function(){
		throw new Error("w3c.Element#setAttributeNode() not yet implemented");
	},
	
	removeAttributeNode : function(){
		throw new Error("w3c.Element#removeAttributeNode() not yet implemented");
	},
	
	getElementsByTagName : function(tagname, element){
		element = element||this.element;
		return element.getElementsByTagName(tagname);
	},
	
	normalize : function(){
		throw new Error("w3c.Element#normalize() not yet implemented");
	},
	
	getElementsByAttribute: function(strTagName, strAttributeName, strAttributeValue){
   	    var oElm = this.element;
    	var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    	var arrReturnElements = new Array();
    	var oAttributeValue = (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)") : null;
    	var oCurrent;
    	var oAttribute;
    	for(var i=0; i<arrElements.length; i++){
    		oCurrent = arrElements[i];
    		oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
    		if(typeof oAttribute == "string" && oAttribute.length > 0){
    			if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))){
    				arrReturnElements.push(oCurrent);
    			}
    		}
    	}
    	return arrReturnElements;
    },
	
	hasChildNode : function (_child, _parent) {
		_parent = _parent||this.element;
		if (_parent === _child) { return false; }
	      while (_child && _child !== _parent) { _child = _child.parentNode; }
	   return _child === _parent;
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
	}
});
