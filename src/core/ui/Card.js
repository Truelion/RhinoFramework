namespace("core.ui.Card", 
{
    '@inherits' : core.ui.WebComponent,
    '@cascade'  : true,

    initialize : function(){
        this.canvas = this.querySelector(".canvas");
        this.addEventListener("click", this.onFlip, false);
    },
    
    onFlip : function(e){
        //this.flip();
        //this.canvas.style["transform".toVendorPrefix()] = "rotateY( 180deg )"
    },
    
    flip : function(){
        this.toggleClass("flipped",this.canvas);
    },
    
    flipToBack : function(){
        if(!this.canvas.classList.contains("flipped")){
            this.canvas.classList.add("flipped")
        }
    },
    
    flipToFront : function(){
        if(this.canvas.classList.contains("flipped")){
            this.canvas.classList.remove("flipped")
        }
    },
    
    innerHTML:
    '<div class="canvas">\
        <div class="face front">Flip Over</div>\
        <div class="face back">Hello World</div>\
    </div>'
});
