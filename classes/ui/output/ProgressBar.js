
namespace("ui.output.ProgressBar", 
{
	'@inherits' :	ui.input.Field,
	'@stylesheets':	[
		'ProgressBar/skin.css'
	],

	initialize : function(){
		this.progress = this.querySelector(".progress");
		this.caption = this.querySelector(".caption");
		this.addEventListener("click", this.onBeforeProgressStarted.debounce(2700,true), false);	
		this.addEventListener("progressstarted", this.onRender, false);
	},
	
	onBeforeProgressStarted : function() {
		this.dispatchEvent("progressstarted", true, true, {target:this, value:"complete"});
	},
	
	onRender : function(){
		var self=this;
		this.removeClass("success",this.caption);
		//$(this.progress).css("width", "0%");
		var animator = this.getAnimator(this.progress);
		animator.set('width', '0%').duration(0).end(
		    function(){self.getAnimator(self.progress).set('width', '100%').duration('1s').end(onEnd)}
		)
		var onEnd = function(){
            self.caption.innerHTML = "Successfully Initialized!";
            self.dispatchEvent("progresscomplete", true, true, {target:self, value:"complete"});
            self.addClass("success", self.caption);
        };
	},
	
	set : function(val){
		this.input.value = val;
	},
	
	get : function(){
		return this.input.value;
	},
	
	innerHTML:
	'<div>\
		<span class="progress"></span>\
		<span class="caption">0% Loaded...</span>\
	</div>'
});
