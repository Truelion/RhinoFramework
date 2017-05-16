/*
	Copyright © 2013 ΩF:∅ Working Group contributors.
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
	associated documentation files (the "Software"), to deal in the Software without restriction, including 
	without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
	sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
	subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all copies or substantial 
	portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
	LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
	NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


//= require js.Trait

namespace("js.Interface", {
    "@inherits" : js.Trait,
    '@description' : [],
    
    /*preInitialize : function preInitialize(_host){
        var descriptor = this["@description"];
        if(window.appconfig.debug) {
            for(var i=0; i<=descriptor.length-1; i++) {
                var member = descriptor[i];
                if(member.required) {
                    if(!(member.name in _host)) {
                        try{console.error("Interface Exception in component " + _host.namespace + "\n" + member.description)} catch(e){}
                        return;
                    }
                }
                else if(!(member.required)) {
                    try{console.info("Optional Interface Implementation: The component '" + _host.namespace + "' may optionally override or implement '" + member.name + "' " + member.description )} catch(e){}
                }
            }
        }
        return this.initialize(_host);
    },*/
    
	initialize : function initialize(_host){
        var descriptor = this["@description"];
        if(window.appconfig.debug) {
            for(var i=0; i<=descriptor.length-1; i++) {
                var member = descriptor[i];
                if(member.required) {
                    if(!(member.name in _host)) {
                        try{console.error("Interface Exception in component " + _host.namespace + "\n" + member.description)} catch(e){}
                        return;
                    }
                }
                else if(!(member.required)) {
                    try{console.info("Optional Interface Implementation: The component '" + _host.namespace + "' may optionally override or implement '" + member.name + "' " + member.description )} catch(e){}
                }
            }
        }
        return this;
    }
});
