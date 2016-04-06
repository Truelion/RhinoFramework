
namespace("ui.input.StarRating", 
{
	'@inherits'    : w3c.HtmlComponent,
	'@stylesheets' : ['StarRating/skin.css'],
	'@cascade'	   : true,

	initialize : function(){
		this.elements["label"].innerHTML = this.getLabelText();
		this.addEventDelegate(".star:click", this.onStarClicked.bind(this), false)
	},
	
	onStarClicked : function(e){
		var starElement = e.target;	
		var index = parseInt(starElement.innerHTML,10);
		var stars = this.querySelectorAll(".star");
			for(var i=0; i<=index; i++){
				if(index == i){break;}
				this.addClass("active",stars[i])
			}
		//console.info("rated: " + index)
		this.dispatchEvent("rated", true, true, {rating:index})
	},
	
	getLabelText : function(){
		return this.getAttribute("label") || "Rate This";
	},

	innerHTML:
	"<div>\
		<label name='label'></label>\
		<ul>\
		  <li><a href='#' title='Rate this 1 star out of 5' class='one-star  star'>1</a></li>\
		  <li><a href='#' title='Rate this 2 stars out of 5' class='two-stars star'>2</a></li>\
		  <li><a href='#' title='Rate this 3 stars out of 5' class='three-stars star'>3</a></li>\
		  <li><a href='#' title='Rate this 4 stars out of 5' class='four-stars star'>4</a></li>\
		  <li><a href='#' title='Rate this 5 stars out of 5' class='five-stars star'>5</a></li>\
		</ul>\
	</div>"
});
