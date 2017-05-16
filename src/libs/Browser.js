Session.Browser = {

	isIE : function (){
		return navigator.userAgent.toUpperCase().indexOf("MSIE") >= 0;
	},
	
	isSafari : function (){
		return ((navigator.userAgent.toUpperCase().indexOf("SAFARI") >= 0) || (navigator.userAgent.toUpperCase().indexOf("IPAD") >= 0));
	},
	
	isFirefox : function (){
		return navigator.userAgent.toUpperCase().indexOf("FIREFOX") >= 0;
	},
	
	isIPad : function (){
		return navigator.userAgent.toUpperCase().indexOf("IPAD") >= 0;
	},
	
	exists : function (element){
		return (typeof(element) != "undefined" && element != null);
	},
	
	addStyleSheet : function (cssHref){
        var element = document.createElement('link');
        element.type = 'text/css';
        element.rel = 'stylesheet';
        element.href = cssHref;
        document.getElementsByTagName('head')[0].appendChild(element);
	},
	
	getBody : function (element){
		if (this.exists(element)){
			if (this.exists(element.contentDocument)){
				// Firefox
				return element.contentDocument;
			}else{
				// IE
				return (element.document)?element.document:element;
			}
		}
		
		return null;
	},
	
	getType : function (element){
	    if(!this.exists(element))return "[object Null]"; // special case
	    return Object.prototype.toString.call(element);
	},

	getElement : function (doc, id){
		if(arguments.length == 1 ){
			id = doc;
			doc = window.document;
		}

		var element = doc.getElementById(id);
		
		if (this.exists(element)){
			return element;
		}else {
			element = doc.getElementsByName(id)[0];
			
			if (this.exists(element)){
				return element;
			}
		}

		return null;
	},

	getDocument : function (id, recurseUp){
		var element = this.getElement(id, recurseUp);
		if (this.exists(element)){
			if (this.exists(element.contentDocument)){
				// Firefox
				return element.contentDocument;
			}else{
				// IE
				return (element.document)?element.document:element;
			}
		}
		
		return null;
	},
	
	addEventListener : function (event, callback, element){
		if (typeof(element) == "undefined"){
			element = window;
		}
		
		if (element.attachEvent){
			//IE
			element.attachEvent(event, callback);
		}else{
			element.addEventListener(event, callback);
		}
	},
	
	getFirstChild : function (element){
		if (element.getFirst){
			return element.getFirst();
		} else if (element.firstChild){
			return element.firstChild;
		}
		
		return null;
	},
	
	getChildren : function (element){
		if (element.getChildren){
			return element.getChildren();
		}else if (element.childNodes){
			return element.childNodes;
		} 
		
		return null;
	},
	
	getParent : function (element){
		if (element.getParent){
			return element.getParent();
		}else if (element.parentNode){
			return element.parentNode;
		} 
		
		return null;
	},	
	
	getNextSibling : function (element){
		if (this.isIE()){
			return element.nextSibling;
		}else {
			return element.nextElementSibling;
		} 
		
		return null;
	}

};