
namespace("ui.input.ButtonGroup", 
{
	'@inherits' :	ui.input.Field,
	'@stylesheets':	[
		'ButtonGroup/skin.css'
	],
	
	
	onConfigureSelector : function onConfigureSelector(argument) {
	   return {
	       on: "click",
	       namespace : "button",
	       selections: []
	   };
	},
	
	innerHTML:
	'<div>\
		<button class="back"></button>\
		<button class="plus"></button>\
		<button class="minus"></button>\
		<button class="next"></button>\
	</div>'
});
