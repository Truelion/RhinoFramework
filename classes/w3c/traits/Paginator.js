function Paginator(options) {
    this.data = options.data;
    this.pageSize = options.pageSize;
    this.currentPage=0;
};

Paginator.prototype.next = function(){
    if(this.currentPage==this.totalpages()){this.currentPage--};
    var d = this.data.slice(this.currentPage*this.pageSize, (this.currentPage+1)*this.pageSize);
    this.currentPage++;
    return d
};

Paginator.prototype.previous = function(){
    if(this.currentPage<=1){this.currentPage=1;}
    else{this.currentPage--}
    var previousPage = this.currentPage;
    var d = this.data.slice((previousPage*this.pageSize)-this.pageSize, (previousPage)*this.pageSize);
    return d
};

Paginator.prototype.pagenumber = function(){
	return this.currentPage;
};

Paginator.prototype.totalpages = function(){
	return Math.ceil(this.data.length/this.pageSize);
}

Paginator.prototype.islastpage = function(){
	return this.currentPage >= this.totalpages();
};

Paginator.prototype.isfirstpage = function(){
	return this.currentPage <= 1;
};

Paginator.prototype.resetindex = function(){
	this.currentPage = 0;
};

Paginator.prototype.resizepage = function(size){
	this.pageSize = size || this.pageSize;
	this.resetindex();
};