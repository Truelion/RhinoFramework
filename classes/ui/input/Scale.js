//=require ui.models.DragModel
//=require ui.input.Slider

namespace("ui.input.Scale", 
{
	'@inherits'    : ui.input.Slider,
	'@stylesheets' : ['Scale/skin.css'],

    onPress : function onPress (e) {
        this.lastHandleWidth = this.getBoundingClientRect(e.data.handle.element).width;
        this.addClass("active");
    },
    
    onMove : function (e) {
        var width = this.lastHandleWidth + e.data.deltaX;
        var maxWith = this.getBoundingClientRect().width-8;
        var minWidth = 8;
        if(width >=maxWith) {width=maxWith}
        if(width <= minWidth) {width=minWidth}
        e.data.handle.element.style.width = width + "px";
    },
    
    onRelease : function onRelease(e) {
       this.removeClass("active");
    },
    
    
	innerHTML:
    '<div>\
        <label>Scale:</label>\
		<span class="handle"><div class="needle"></div></span>\
    </div>'
});
