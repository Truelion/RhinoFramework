
namespace("ui.input.DatePicker", 
{
	'@inherits' 	: ui.input.TextField,
	'@stylesheets'	: ['DatePicker/skin.css'],
	'@cascade'		: true,
	
    
	initialize : function(){
	    var self=this;
	    this.addEventListener("hoverout", this.onHideCalendar, true);
        
		this.selectorbutton = this.querySelector(".selector-button");
		this.selectorbutton.addEventListener("mousedown", this.onMouseDown.bind(this), false);
		application.addEventListener("click", this.onHideCalendar.bind(this), true)
	},
	
	onHideCalendar : function(e){
	    var self=this;
	    if(e.target == document.body || e.target instanceof ui.input.Calendar){
            var cal = self.querySelector(".Calendar");
            var animator = self.getAnimator(cal);
               animator.set("display","none").end()
        }
	},
	
	onMouseDown : function(e){
	    var cal = this.querySelector(".Calendar");
	    var animator = this.getAnimator(cal);
	       animator.set("display","block").set("z-index", application.absoluteZindex()).end();
	},
	
	innerHTML:
	'<div>\
		<label>Event Date:</label>\
		<div namespace="ui.input.Calendar"></div>\
		<input type="text"/>\
		<div class="button selector-button">\
			<span class="icon"></span>\
		</div>\
	</div>'
	
});
