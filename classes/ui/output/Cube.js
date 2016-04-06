
namespace("ui.output.Cube", 
{
	'@inherits' :	w3c.HtmlComponent,
	'@stylesheets':	[
		'Cube/skin.css'
	],
	
	innerHTML:
	'<div>\
		<div class="front wall">1</div>\
		<div class="back wall">2</div>\
		<div class="right wall">3</div>\
		<div class="left wall">4</div>\
		<div class="top wall">5</div>\
		<div class="bottom wall">6</div>\
	</div>'
});
