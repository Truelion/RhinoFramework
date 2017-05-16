//=require core.vo.Model

namespace("core.vo.Account", {
	'@inherits' : core.vo.Model,

	initialize : function (data) {
		if(!data) {return}
		this.parent(data);
		if(!this.data.last_login_date) {
			this.data.last_login_date = new Date().getTime();
		}
	},

	isValid : function(){
		if(!this.data || 
		   !this.data.last_login_date || 
		   !this.data.username) {
			return false;
		}
		else {
			var lastDate = new Date(this.data.last_login_date);
			var today = new Date();
			var millisec = today - lastDate;
			//var minutes = (millisec / (1000 * 60)).toFixed(1);
			var timeout = Session.State.Timeout||"20 mins";
			var timeout_regx = timeout.match(/([0-9]+)\s([A-Za-z]+)/);
			var duration;
			var unitType = timeout_regx[2];
			var unitVal = parseInt(timeout_regx[1]);

			if(unitType.indexOf("day")>=0){
				duration = Math.round(millisec / 86400000); // days
			}
			else if(unitType.indexOf("min")>=0){
				duration = (millisec / (1000 * 60)).toFixed(1); //minutes
			}
			else if(unitType.indexOf("hour")>=0){
				duration = Math.round((millisec % 86400000) / 3600000); // hours
			}
			else {
				duration = (millisec / (1000 * 60)).toFixed(1); //minutes
			}
			if(duration > unitVal){
				return false;
			}
			else {
				return true;
			}
		}
	},

	touch : function(){
		this.data.last_login_date = new Date().getTime();
		core.data.StorageManager.commit();
	}
});