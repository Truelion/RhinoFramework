//= require ui.models.DragModel

namespace("ui.models.ColumnDragModel", 
{
    '@inherits':ui.models.DragModel,
    '@description' : [
        {   
            name: "onBeforeDragModelInitialized",
            required:true,
            type : Function,
            description: "ui.models.ColumnDragModel expected onBeforeDragModelInitialized() to be implemented",
            arguments:[
                {name:"scope", description:"", type:""}
            ]
        }
    ]
});
