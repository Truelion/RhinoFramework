
namespace("ui.input.DropDown", 
{
	'@inherits' :	ui.input.TextField,
	'@stylesheets':	[
		'DropDown/skin.css'
	],
    '@cascade':true,
    
    
	innerHTML:
	'<div>\
		<span class="indicator"><span class="icon"></span></span>\
		<input name="field" type="text" value="Jason Smith">\
		<div class="error">\
			<span class="label">Must be atleast<br/>8 characters!</span>\
		</div>\
		<div class="options Field">\
			<div class="option">Option 1</div>\
			<div class="option">Option 2</div>\
			<div class="option">Option 3</div>\
		</div>\
	</div>'
});
