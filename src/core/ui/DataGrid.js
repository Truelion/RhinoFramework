

namespace("core.ui.DataGrid", 
{
    '@inherits' : core.ui.WebComponent,
    '@cascade'  : true,
    '@stylesheets' :["~/resources/[$theme]/DataGrid.css"],
    '@traits' : [core.traits.EventTracker],
    
    initialize : function(){
        this.addEventListener("click",      this.onClickDetected.bind(this), false);
        this.addEventListener("cellclick",  this.onCellClicked.bind(this), false);
        this.addEventListener("columnclick",this.onColumnHeaderClicked.bind(this), false);
        this.addEventListener("columnsort", this.onSortByColumnClicked.bind(this), false);
        this.addEventListener("gridaction", this.onGridCellAction.bind(this), false);
        this.addEventListener("dblclick",   this.onGridCellDblClick.bind(this), false);
        this.addEventListener("change",     this.onDataChanged.bind(this), false);
    },

    onDataChanged : function(e){
        var _cell = this.getParentCell(e.target);
        if(_cell && _cell.classList.contains("cell")){
            var _row = _cell.parentNode;
            this.dispatchEvent("datachanged", true, true, {
                row : _row, 
                cell: _cell,
                target:e.target
            });
        } else if(_cell && _cell.classList.contains("column")){
            var a = _cell.getAttribute("data-action");
            if(a){
                this.dispatchEvent("filter", true, true, {
                    name : _cell.getAttribute("data-filter-name"),
                    value : e.target.value
                });
            }
        }
    },

    onGridCellAction : function(e){
        console.warn(e.data)
    },

    getParentCell : function(target){
        var el = target;
        while(el && el.classList){
            if(el.classList.contains("DataGrid")){
                el=null;
                break;
            } 
            else if(el.classList.contains("cell")||el.classList.contains("column")){
                break;
            }
            el = el.parentNode;
        }
        return el;
    },

    onGridCellDblClick : function(){

    },

    onClickDetected : function(e){
        var cell = this.getParentCell(e.target);
        if(cell){
            var cl = cell.classList;
            if(cl.contains("cell")){
                var _row = cell.parentNode;
                if(cl.contains("action")){
                    var b = cell.querySelector(".button");
                    var a = cell.getAttribute("data-action");
                    this.dispatchEvent("gridaction", true, true, {
                        row : _row, 
                        cell: cell,
                        button : b,
                        action : a
                    });
                    this.dispatchEvent(a, true, true, {
                        row : _row, 
                        cell: cell,
                        button : b,
                        action : a
                    });
                }
                this.dispatchEvent("cellclick", true, true, {row:_row, "cell":cell})
            }
            else if(cl.contains("column")||cl.contains("column-label")) {
                var _header = cell.parentNode;
                this.dispatchEvent("columnclick", true, true, {header:_header, column:cell});
                this.dispatchEvent("columnsort", true, true, {header:_header, column:cell, attribute: cell.getAttribute("data-name")});
                // var a = cell.getAttribute("data-action");
                // if(a){
                //     this.dispatchEvent("filter", true, true, {
                //         userid : e.target.value
                //     });
                // }
            }
        }
    },

    onCellClicked : function(e){
        var data = e.data||{};
        if(data.row) {
            if(this.lastRow){
                this.lastRow.classList.remove("selected");
            }
            data.row.classList.add("selected");
            this.lastRow = data.row;
            this.dispatchEvent("select", true, true, {row:data.row, cell:data.cell})
        }
    },

    onSortByColumnClicked : function(e){
        var attrb = e.data.attribute;
        if(this.dataController) {
            this.dataController.sort(attrb);
        }
    },

    onColumnHeaderClicked : function(e){
        //logic to sort by column
    },

    onRenderData : function(data, init_children_components){
        this.parent(data,true); //init_children_components forced to true for progress bar
    },

    
    innerHTML: ""
});
