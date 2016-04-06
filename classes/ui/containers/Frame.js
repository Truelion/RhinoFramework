
namespace("ui.containers.Frame", 
{
    '@inherits' : w3c.HtmlComponent,
    '@cascade'  : true,
    '@stylesheets': [
        'Frame/skin.css'
    ],
    
    innerHTML:
    '<div class="canvas">Hello World</div>',
    
    outerHTML:
    '<div>\
        <div class="backboard">\
            <div class="mat">\
                <div class="canvas"></div>\
            </div>\
        </div>\
    </div>',
    
    setElement : function(element){
        if(!element||element.childNodes.length<=0) {
            if(element) {
                this.element = this.parseElement(this.outerHTML, {});
                var content = this._internal_parseElement();
                var canvas = this.querySelector(".canvas");
                canvas.appendChild(content);
                this.canvas=canvas;
                this.contentElement=content;
                if (element.parentNode) {
                    element.parentNode.replaceChild(this.element, element);
                }
            }
            else if(!element) {
                this.element = this.parseElement(this.outerHTML, {});
                var content = this._internal_parseElement();
                var canvas = this.querySelector(".canvas");
                canvas.appendChild(content);
                this.canvas=canvas;
                this.contentElement=content;
            }
        }
        else if(element && element.childNodes.length > 0) {
           if(element.tagName.toLowerCase() == "body"){
                this.element=this.canvas=this.contentElement = element; 
                return;
           }
           var embed = this.getAttribute("embedded",element);
           
           if(embed=="true") {
                this.element = this.parseElement(this.outerHTML, {});
                var content = element.cloneNode(true);
                var attrbs = this.getAttributes(content);
                this.setAttributes(attrbs);
                this.removeAttributes(attrbs,content);
                            
                this.removeClass(this.classname,  content);//leaves a blank class="" attribute if no other classes exist.
                this.removeAttribute("namespace", content);
                this.removeAttribute("cuuid", content);
                var canvas = this.querySelector(".canvas");
                canvas.appendChild(content);
                this.canvas=canvas;
                this.contentElement=content;
                
                if (element.parentNode) {
                    element.parentNode.replaceChild(this.element, element);
                }
                
                if(!this.querySelector(".canvas:first-child")) {
                    try{console.warn("the component '" + this.namespace + "' is missing a <div class=canvas>...</div> to wrap it's innerHTML")}
                    catch(e){}
                }
           }
           else {
                this.element = element;
           }
        }
    }
});
