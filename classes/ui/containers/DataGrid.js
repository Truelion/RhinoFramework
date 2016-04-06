//= require ui.models.ColumnDragModel

namespace("ui.containers.DataGrid", 
{
    '@inherits' : w3c.HtmlComponent,
    '@cascade'  : true,
    '@stylesheets': [
        'DataGrid/skin.css'
    ],
    '@traits'      : [ui.models.ColumnDragModel],
    
    initialize : function(){
        alert("sds")
        this.addEventListener("pressed",   this.onPress,   false);
        this.addEventListener("dragging",  this.onMove,    false);
    },
    
    onTap : function(){
		console.info("Tap")
	},
	
	onTapHold : function(){
		console.log("tap hold")
	},
	
	onRelease : function(){},
    
    onPress : function onPress(e) {
        console.log(e)
    },
    
    onMove : function(e){
        console.log(e)
        e.preventDefault();
        var handle = e.data.handle.element;
        var w = parseInt(this.getStyle("width", handle.parentNode.parentNode));
        if(e.data.offsetX < 100){
            //document.body.style.cursor = "not-allowed";
            return;
        }
        handle.parentNode.parentNode.style.width = e.data.offsetX + "px";
        //handle.parentNode.parentNode.nextSiblingElement.style.width = (parseInt(handle.parentNode.parentNode.nextSiblingElement.style.width,10) - e.data.offsetX) + "px";
    },
    
    onBeforeDragModelInitialized : function onBeforeDragModelInitialized(options){
        var self=this;
        options.raf=true;// uses requestAnimationFrame
        options.gpu = true;
        options.handle = [].toArray(this.querySelectorAll(".handle"));//toArray(this.querySelectorAll(".handle"));
        //console.log(options.handle)
        options.bounds = false;
        return options;
    },
    
    newColumnHeader : function(){
        var head = '<th class="header cell">\
                        <div class="label">\
                            <div class="handle"></div>\
                            <label>{name}</label>\
                        </div>\
                    </th>'
    },
    
    innerHTML:
    '<div class="canvas">\
        <div class="titlebar"><label>DataGrid Sample Demo</label></div>\
		<div class="toolbar"><div namespace="ui.input.MenuButton" label=""></div></div>\
		\
        <table border="1">\
        	<tbody>\
	            <tr class="column-header">\
	                <th class="header cell">\
	                	<div class="label">\
	                		<div class="handle"></div>\
	                		<label>Firstname</label>\
						</div>\
	                </th>\
	                <th class="header cell">\
	                	<div class="label">\
	                		<div  class="handle"></div>\
	                		<label>Lastname</label>\
						</div>\
	                </th>\
	                <th class="header cell">\
	                	<div class="label">\
	                		<div  class="handle"></div>\
	                		<label>Other</label>\
						</div>\
	                </th>\
	            </tr>\
                <tr class="row">\
                    <td class="data cell">Jason</td>\
                    <td class="data cell">Smith</td>\
                    <td class="data cell">Demo</td>\
                </tr>\
                <tr class="row">\
                    <td class="data cell">Ivette</td>\
                    <td class="data cell">Smith</td>\
                    <td class="data cell">Demo</td>\
                </tr>\
                <tr class="row">\
                    <td class="data cell">Jeremiah</td>\
                    <td class="data cell">Smith</td>\
                    <td class="data cell">Demo</td>\
                </tr>\
                <tr class="row">\
                    <td class="data cell">George</td>\
                    <td class="data cell">Smith</td>\
                    <td class="data cell">Demo</td>\
                </tr>\
            </tbody>\
        </table>\
        <div class="pager">\
        	<div class="back button"></div>\
        	<div class="next button"></div>\
        </div>\
    </div>'
});
