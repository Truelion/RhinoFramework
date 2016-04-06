namespace("ui.containers.Card", 
{
    '@inherits' : w3c.HtmlComponent,
    '@cascade'  : true,
    '@stylesheets': [
        'Card/skin.css'
    ],
    
    
    initialize : function(){
    	this.canvas = this.querySelector(".canvas");
    	this.addEventListener("click", this.onFlip, false);
    },
    
    onFlip : function(e){
    	this.toggleClass("flipped",this.canvas)
    },
    
    innerHTML:
    '<div class="canvas">\
    	<div class="face front">Flip Over</div>\
    	<div class="face back">Hello World</div>\
    </div>'
});
