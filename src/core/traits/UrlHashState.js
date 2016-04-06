/**
 * The UrlHashState constructor runs during parent app initialize().
 * It is triggered before the app is unloaded or when app is first loaded.
 * It detects any hash/fragments in the url and will auto-launch the
 * matching app with params.
 *
 * @example
 * http://localhost:3000/#(appref:apps/SearchResults,keyword:'28.119783899999998, -81.4444443')
 * A url like this, when pasted into the address bar and executed will trigger the UrlHashState
 * trait to spawn up a new instance of the app, apps/SearchResults and pass inthe keyword
 * params into the app.
 */

UrlHashState = {
    initialize : function(){
      var self=this;
       this.parent();
       this.addEventListener('showdashboard', this.onReturnToDashboardHash.bind(this), false);
       this.addEventListener("appopened", this.onApplicationOpened2.bind(this), false);
       this.initializeURLHashing();
       window.onbeforeunload = function () {
           if(self.isLoggedIn) {
               return "Exit? If you leave now, any unsaved data will be lost."
           }
           else{
                
           }
       }
    },
    
    onApplicationOpened2 : function(e){
        window.location.hash = rison.encode(e.data);   
    },
    
    initializeURLHashing : function(){
        var self=this;
        var defaultHashPath = rison.encode({appref:"apps/Desktop"});
        
        this.addEventListener("statechanged", function(){
            var currentHash = window.location.hash;
                currentHash = currentHash.replace("#","");
            var appinfo     = rison.decode(decodeURIComponent(currentHash));

            if(!appinfo || !appinfo.appref){
              window.location.hash=defaultHashPath;
            }
            else if(appinfo && appinfo.appref && appinfo.appref.length>0){
              var ns = appinfo.appref.replace("/",".");
              var app = self.currentRunningApplication;
              if(!app || app.namespace != ns){
                  self.dispatchEvent("openapp",true,true,appinfo)
              }
            }
        }.debounce(300), false);

        var h = window.location.hash;
        if(!h||(h && h.length <=0)){
            window.location.hash = defaultHashPath;
        }
    },
    
    
    onReturnToDashboardHash : function(e){
        var defaultHashPath = rison.encode({appref:app.constants.DEFAULT_HOME_APP});
        window.location.hash = defaultHashPath;
    } 
};
