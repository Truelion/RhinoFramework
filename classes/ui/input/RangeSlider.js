//= require ui.models.DragModel


namespace("ui.input.RangeSlider", 
{
	'@inherits'    : ui.input.Slider,
	'@stylesheets' : ['RangeSlider/skin.css'],

	innerHTML:
	'<div>\
		<span class="progress"></span>\
		<pre class="caption">10  20  30  40  50  60  70  80  90  100</pre>\
		<span class="handle one"></span>\
		<span class="handle two"></span>\
	</div>'
});
