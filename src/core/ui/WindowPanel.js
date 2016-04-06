//=require core.ui.Panel
namespace("core.ui.WindowPanel", {
    '@inherits' : core.ui.Panel,
    "@cascade"  : true,
    
    onResizePanel : function(){
       this.dispatchEvent("resizeapp", true, true, {component:this})
    },
    
    onClosePanel : function(){
        this.dispatchEvent("close", true, true, {component:this})
    }
});