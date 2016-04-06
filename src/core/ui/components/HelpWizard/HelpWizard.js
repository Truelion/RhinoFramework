namespace("core.ui.components.HelpWizard", {
    '@inherits' : core.ui.WebComponent,
    "@cascade"  : true,
    '@stylesheets' :["src/core/ui/components/HelpWizard/HelpWizard.css"],
    "@href": "src/core/ui/components/HelpWizard/HelpWizard.html",
    
    initialize : function(){
        this.componentOverlay = this.querySelector("#ui-helpwizard-component-overlay");
        this.componentTooltip = this.querySelector("#ui-helpwizard-component-overlay-tooltip");
        this.toolTipContainer = this.querySelector("#ui-helpwizard-tooltip-text");
        
        this.previousArrow = this.querySelector(".previous.arrow");
        this.nextArrow = this.querySelector(".next.arrow");
        this.last_index=-1;
        
        this.previousArrow.addEventListener("click", this.onGotoPrevious.bind(this), false);
        this.nextArrow.addEventListener("click", this.onGotoNext.bind(this), false);
        
        this.addEventListener("click", this.onActionClicked.bind(this), false);
        this.addEventListener("dblclick", this.onCloseHelp.bind(this), false);
        this.addEventListener("nextstep", this.onMovedNext.bind(this), false);
        this.addEventListener("previousstep", this.onMovedPrevious.bind(this), false);
    },

    onCloseHelp : function(e){
        this.deactivate();
    },
    
    activate : function(){
        var self=this;
        this.element.classList.add("active");  
        setTimeout(function(){
            self.nextArrow.classList.add("animated");
            self.nextArrow.classList.add("bounce"); 
        },300)
    },
    
    deactivate : function(){
        this.setHardwareAcceleration(false);
        this.resetLastStep();
        this.element.classList.remove("active");  
        this.previousArrow.classList.remove("bounce");   
        this.nextArrow.classList.remove("bounce");   
    },
    
    isActive : function(){
        return this.element.classList.contains("active"); 
    },
    
    onActionClicked : function(e){
        var _action = e.target.getAttribute("action");
        if(_action){
            this.dispatchEvent(_action,true,true,{action:_action, originalEvent:e, target:e.target});
        }
    },
    
    onGotoNext : function(){
        this.next();    
    },
    
    onGotoPrevious : function(){
        this.previous();    
    },
    
    onMovedNext : function(){
        this.setButtons();
    },
    
    onMovedPrevious : function(){
        this.setButtons();
    },
    
    setSteps : function(divs){
        var items=divs||[];
        this.divs = [];
        for(var i=0; i<=items.length-1;i++){
            items[i].scrollIntoView(true);
            var coords = this.getBoundingClientRect(items[i]);
            if(coords.width==0 && coords.height==0){continue;}
            else{
                items[i]._coords=coords;
                this.divs.push(items[i])
            }
        }
        this.sort();
        this.toggleButtonVisibility();
    },

    toggleButtonVisibility : function(){
        if(this.divs.length==1){
            this.previousArrow.style.display="none"
            this.nextArrow.style.display="none"
        }
    },
    
    sort : function(){
        function compare(a,b) {
          var i = a.getAttribute("data-helpindex");
          var j = b.getAttribute("data-helpindex");
          if (i < j)
             return -1;
          if (i > j)
            return 1;
          return 0;
        }
        this.divs.sort(compare);
        console.info("sorted list", this.divs)
    },
    
    setIndex : function(i){
        if(typeof i == "number"){
            this.last_index=i;
        } else if(typeof i == "string"){ 
            var items = this.divs;
            for(var j=0; j<=items.length-1;j++){
                var helpkey = items[j].getAttribute("data-helpkey");
                if(helpkey){
                    if(i.toLowerCase() == helpkey.toLowerCase()){
                        this.last_index=j-1;
                        break;
                    }
                }
            }
        } else {
            this.last_index=-1;
        }
    },
    
    setButtons : function(){
        var self=this;
        if(this.last_index == 0){
            this.previousArrow.classList.add("disabled");
        } else {
            this.previousArrow.classList.remove("disabled");
            this.previousArrow.classList.add("animated");
            setTimeout(function(){self.previousArrow.classList.add("bounce");},300);
        }
        if(this.divs && this.divs.length > 0) {
            this.nextArrow.classList.remove("disabled");
        }
        if(this.last_index >= this.divs.length-1){
            this.nextArrow.classList.add("disabled");
            this.previousArrow.classList.remove("disabled");
        }
    },
    
    next : function(i){
        i=(i||this.last_index+1);
        i = (i > this.divs.length-1) ? this.divs.length:i;
        if(this.divs && this.divs[i]){
            this.resetLastStep();
            this.renderStep(this.divs[i]);
            this.last_index=i;
            this.dispatchEvent("nextstep",true,true,{});
        }
    },
    
    previous : function(i){
        i=(i||this.last_index-1);
        i = (i < 0) ? 0:i;
        if(this.divs && this.divs[i]){
            this.resetLastStep();
            this.renderStep(this.divs[i]);
            this.last_index=i;
            this.dispatchEvent("previousstep",true,true,{});
        }
    },
    
    resetLastStep : function(){
        if(this.last_step_data){
            this.last_step_data.div.classList.remove(this.last_step_data.posType)
        }
    },
    
    setHardwareAcceleration : function(bool){
        this.__is_hardware_accelarated__ = bool;
    },
    
    isHardwareAccelerated : function(bool){
        return this.__is_hardware_accelarated__ == true;
    },
    
    renderStep : function(step){
        step.scrollIntoView(true);
        var div = step;//this.divs[i];
        var coords = div._coords||this.getBoundingClientRect(div);
        var posType = window.getComputedStyle(div,null).getPropertyValue("position");
        console.warn("div",[div,coords])
        this.componentOverlay.style.width=coords.width+"px";
        this.componentOverlay.style.height=coords.height+"px";
        if(this.isHardwareAccelerated()){
            this.componentOverlay.style["transform".toVendorPrefix()]="translate3d("+coords.left +"px,"+ coords.top+"px,0)";
        } else{
            this.componentOverlay.style.left = coords.left + "px"
            this.componentOverlay.style.top  = coords.top  + "px"   
        }
        
        var t="";
        
        if(posType=="relative"||posType=="static") {
            //div.classList.add("helpon_relative")
            t="helpon_relative"
        }
        else if(posType=="absolute"){
            //div.classList.add("helpon_absolute")
            t="helpon_absolute"
        }
        else if(posType=="fixed"){
            //div.classList.add("helpon_fixed")
            t=helpon_fixed;
        }
        else {
            console.warn("unable to determin positioning-type of the current element,", div)
        }
        div.classList.add(t)
        this.setToolTip(step);
        this.last_step_data = {
            div:step,
            posType:t
        }
    },
    
    setToolTip : function(step){
        this.toolTipContainer.innerHTML = step.getAttribute("data-helptext");
        this.setTooltipPosition(step);
        console.info("tooltip coords",this.getBoundingClientRect(this.componentTooltip))
    },
    
    setTooltipPosition : function(step){
        var defaultCardinal = step.getAttribute("data-cardinal-position");
        var stepCoords = step._coords||this.getBoundingClientRect(step);
        var viewPortStyle = window.getComputedStyle(document.body,null);//.getPropertyValue("height")
        var vpWidth  = parseInt(viewPortStyle.getPropertyValue("width"),10);
        var vpHeight = parseInt(viewPortStyle.getPropertyValue("height"),10);
        if(isNaN(vpWidth)||isNaN(vpHeight)){
            return;
        }
        else{
            var tooptipPosition="south";
            var directions = {
                north:  stepCoords.top,
                south:  vpHeight-stepCoords.bottom,
                east:   vpWidth-stepCoords.right,
                west:   stepCoords.left
            };
            var max = Math.max(directions.north, directions.south, directions.east, directions.west);
            for(var d in directions){
                if(directions[d] == max){
                    tooptipPosition = d;
                    break;
                }
            }
            this.componentOverlay.setAttribute("data-cardinal-position",defaultCardinal?defaultCardinal:tooptipPosition);
            //step.scrollIntoView(true);
        }
    },
    
    innerHTML:
    '<div></div>'        
});