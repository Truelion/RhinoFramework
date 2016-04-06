//= require ui.input.Button

namespace("ui.input.MenuButton", 
{
	'@inherits' :	ui.input.Button,
	'@stylesheets':	['MenuButton/skin.css'],
	'@cascade':true,
	
	label : "Submit This",

	innerHTML:
	'<div>\
		<div class="interior button">\
            <span class="icon"></span>\
            <span class="label"></span>\
        </div>\
	</div>'
});
