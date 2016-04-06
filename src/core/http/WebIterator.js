//= require core.http.XMLHttpRequest

namespace("core.http.WebIterator", {
    '@inherits': core.http.WebAction,
    
    
    initialize : function(uri, params, name, owner){
        this.parent(uri, params);
        this.name=name;
        this.owner=owner;
        this.dir=1;
        return this;
    },

    configureDataMappings : function(mapping){
        this.data_mapping = mapping;
    },
    
    isIterable : function(){
        return true;
    },
    
    totalPages : function(){
        var totalPages = 1;
        if(this.data){
            var totalRecords = this.getTotalRecords();
            totalPages   = totalRecords/this.itemsPerPage();
        }
        return Math.ceil(totalPages);
    },
    
    currentPage : function(){
        var page = this.params.page;
        return page;
    },
    
    itemsPerPage : function(){
        var count = this.accessor.get(this.data_mapping.count).data||this.params.count;
        return count;
    },
    
    isLastPage : function(){
        var currentPage  = this.currentPage();
        return (this.isIterable()==false) || (currentPage == this.totalPages());
    },

    isFirstPage : function(){
        var currentPage  = this.currentPage();
        return (this.isIterable()==false) || currentPage == 1;
    },
    
    updatePagingOptions : function(){
        //var options = this.params.pagingOptions;
        if(this.isIterable()) {
            var currentPage  = this.currentPage();
            if(this.dir==1){
                if(currentPage < this.totalPages()){
                    this.params.page++;
                }
            } else {
                if(currentPage > 1){
                    this.params.page--;
                } else if(currentPage <= 0){
                    this.params.page=1;
                }
            }
        }
    },
    
    next : function(options){
        this.dir=1;
        this.updatePagingOptions();
        this.invoke(options);
    },
    
    previous : function(options){
        this.dir=0;
        this.updatePagingOptions();
        this.invoke(options);
    },
    
    refresh : function(){
        this.invoke();
    },
    
    invoke : function(options){
        /*this.options = options;
        if(this.isIterable()) {
            (this.dir==1)? this.next(options) : this.previous(options);
        }
        else {
            this.parent.invoke.call(this,options);
        }*/
        this.updatePagingOptions();
        this.parent(options);
    },
    
    setDirection : function(num){
        this.dir = (typeof num == "number" && (num >-1 && num <=1))? num:1;
    },
    
    getTotalRecords : function(data, path){
        var total = this.accessor.get(this.data_mapping.total).data||this.data.total;
        return total;
    },
    
    /*onstatechange : function(){
        var r = this.oXMLHttpRequest;
        if(r.readyState == XMLHttpRequest.DONE){
            if(r.status == 0){
                if(r.responseText.length <= 0){
                    this.onFailure(r, r.responseText)
                }
                else if(r.responseText.length > 0){
                    this.onSuccess(r, r.responseText)
                }
            }
            else if(r.status == 200){
                if(r.responseText.length <= 0){
                    this.onFailure(r, r.responseText)
                }
                else if(r.responseText.length > 0){
                    this.onSuccess(r, r.responseText)
                }
            }
            else if(r.status != 200){
                this.onFailure(r, r.responseText)
            }
        }
        //this.onreadystatechange.call(this.oXMLHttpRequest,this.oXMLHttpRequest);
    },*/
    
    onSuccess : function(r, responseText){
        var data = JSON.parse(r.responseText);
        this.data=data;
        this.accessor = new core.data.Accessor(this.data);
        if(this.isIterable()) {
            (this.dir==1)?
                this.onNext(r, data):
                this.onPrevious(r, data);
        }
        //this.parent.onSuccessHook.call(this,data);
    },
    
    onNext : function(xhr, data){
        console.log("onNext",data);
        this.options.onNext(xhr, data);
    },
    
    onPrevious : function(xhr, data){
        console.log("onPrevious",data);
        this.options.onPrevious(xhr, data);
    },

    
    /*open : function(method, path , async){
        async   = ((typeof async == "boolean")?async:true);
        method  = method||this.getDefaultMethod();
        path    = core.http.UrlRouter.resolve(path||this.uri);
        path    = path + this.createQueryString(method,path,this.params);
        this.async  = async;
        //this.uri    = path;
        this.method = method;
        
        this.oXMLHttpRequest = new XMLHttpRequest;
        this.oXMLHttpRequest.onreadystatechange  = this.onstatechange.bind(this);
        this.oXMLHttpRequest.open(method, path, async);
        return this;
    }*/
});


/**********************USAGE

var it;

if(!it){
  it = new core.http.WebIterator(ROUTES.DATA.PAGINATION_TEST,{
    page:1,
    count:3
  });
}

it.next()
it.totalPages()
 **************************/
