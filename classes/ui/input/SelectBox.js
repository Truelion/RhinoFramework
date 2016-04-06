//= require ui.input.Field

namespace("ui.input.SelectBox", {
    '@inherits' : ui.input.Field,
    '@stylesheets':["SelectBox/skin.css"],
    
    initialize : function() {
        //console.log(this)  
    },
    
    innerHTML:
    '<div>\
        <select>\
            <option selected> Select Box </option>\
            <option>Short Option</option>\
            <option>This Is A Longer Option</option>\
        </select>\
    </div>​'
})
