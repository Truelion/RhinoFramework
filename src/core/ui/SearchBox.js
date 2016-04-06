/**
 * core.ui.SearchBox is the search component that appears at the top of the screen
 * @example
 * var app = new core.ui.SearchBox;
 * @class
 */
namespace("core.ui.SearchBox", 
{
    '@inherits'     : core.ui.WebComponent,
    '@stylesheets'  : [],
    "@cascade"      : true,
    
    
    /**
     * The constructor which runs when a new instance of core.ui.SearchBox is created
     * @example
     * var app = new core.ui.SearchBox;
     * @return {core.ui.SearchBox}
     */
    initialize : function(){
        this.parent();
        this.searchBoxInput     = this.querySelector("input");
        this.searchButton       = this.querySelector("#app-search-button");
        this.searchBoxInput.addEventListener("keyup", this.onEnterKeySearch.bind(this), false);
        this.searchButton.addEventListener("click", this.onStartSearch.bind(this), true);
        application.addEventListener("search", this.onSearchEventDetected.bind(this), false);
        application.addEventListener("searchcomplete", this.onSearchCompleteEventDetected.bind(this), false);

        this.restoreSearchKeywordDisplay();
    },


    restoreSearchKeywordDisplay : function(){ 
      try{
        var hash = location.hash.replace("#","");
        var appinfo = rison.decode(decodeURIComponent(hash));
        if(appinfo){
          this.searchBoxInput.value = appinfo.keyword||"";
        }
      }
      catch(e){}
    },

    onSearchEventDetected : function(e){
        this.onStartSearch(e)
    },

    onSearchCompleteEventDetected : function(){
        this.searchButton.prototype.reset();
    },

    onEnterKeySearch : function(e){
        if(e.keyCode == 13) {
            this.onStartSearch(e)
        } 
    },

    spinIcon : function(){
      this.searchButton.prototype.spin("fa-search");
    },
    
    onStartSearch : function(e){
       var self=this;
       this.spinIcon();

       self.searchBoxInput.blur();
         Session.State.resetSearchResults = true;
         application.dispatchEvent("openapp", true, true, {
            appref : "apps/SearchResults", 
            keyword : self.searchBoxInput.value
         });
    }
});
