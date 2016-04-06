//= require ui.models.BooleanSelectionModel


namespace("ui.input.Calendar",
{
    '@inherits'       :  ui.input.Field,
    "@stylesheets"    : ['Calendar/skin.css'],
    cal_days_labels   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    cal_months_labels : ['January', 'February', 'March', 'April',
                         'May', 'June', 'July', 'August', 'September',
                         'October', 'November', 'December'],
    cal_days_in_month  : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],


    initialize : function(){
        this.realDate = new Date();
        var userDefinedMonth = parseInt(this.getAttribute("month") ,10);
        var userDefinedDate  = parseInt(this.getAttribute("date")  ,10);
        var userDefinedYear  = parseInt(this.getAttribute("year")  ,10);
        var html = this.getCalendarHTML(userDefinedYear, userDefinedMonth, userDefinedDate);

        this.canvas.appendChild(html.toHtmlElement());
        this.elements["back-button"].addEventListener("click", this.onPrevious.bind(this), false);
        this.elements["next-button"].addEventListener("click", this.onNext.bind(this), false);
        /*this.addEventListener("hoverover", function(e) {
            if(e.eventPhase == 2) {} 
        }, false);*/
       
       
        
    },
    
    mouseenter: function(e){
        
        //console.log(e)
    },
    
    onPrevious : function(){
        var month = this.month-1;
        if(month < 0) {month=11;this.year=this.year-1;};
        this.month=month;
        console.log(this.month);
        
        var html = this.getCalendarHTML(this.year, this.month, this.day);
        this.removeChild(this.querySelector(".calendar-table"))
        this.canvas.appendChild(html.toHtmlElement());
    },
    
    onNext : function(){
        var month = this.month+1;
        if(month > 11) {month=0;this.year=this.year+1;};
        this.month=month;
        console.log(this.month);
        
        var html = this.getCalendarHTML(this.year, this.month, this.day);
        this.removeChild(this.querySelector(".calendar-table"))
        this.canvas.appendChild(html.toHtmlElement());
    },
    
    innerHTML : 
    '<div>\
        <label>Calendar:</label>\
        <div class="controls">\
            <span class="back" name="back-button"></span>\
            <span class="next" name="next-button"></span>\
        </div>\
    </div>',
    
    getCalendarHTML : function(_year, _month, _date){
        var cal_current_date;
        if(isNaN(_month)||isNaN(_year)) {
            cal_current_date = new Date();
        }
        else {
            cal_current_date = new Date(_year,_month,(_date||1));
        }

        var day         = cal_current_date.getDate();
        var month       = cal_current_date.getMonth();
        var year        = cal_current_date.getFullYear();
        this.month=month;
        this.year=year;
        this.day = day;
        
        var firstDay    = new Date(year, month, 1);
        var startingDay = firstDay.getDay();
        var monthLength = this.cal_days_in_month[month];
        var realDay     = this.realDate.getDay();
      // compensate for leap year
        if (month == 1) { // February only!
            if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
                monthLength = 29;
            }
        }

        // do the header
        var monthName = this.cal_months_labels[month]
        var html = '<table class="calendar-table">';
        html += '<tr class="month-label"><th colspan="7" class="header">';
        html += '<div class="title-box"><span class="title">'+ monthName + "&nbsp;" + year + '</span></div>';
        html += '</th></tr>';
        html += '<tr class="calendar-header">';
        for (var i = 0; i <= 6; i++) {
            html += '<td class="calendar-header-day' + ((i == realDay && this.realDate.getMonth()==month && this.realDate.getFullYear()==year)? " today":"") + '">';
            html += this.cal_days_labels[i];
            html += '</td>';
        }
        html += '</tr><tr>'; 
        
        
        // fill in the days
        var inc_day = 1;
        var today = "";
        // this loop is for is weeks (rows)
        for (var i = 0; i < 9; i++) {
            // this loop is for weekdays (cells)
            for (var j = 0; j <= 6; j++) {
                //html += '<td class="calendar-day' + ((inc_day == day && this.realDate.getMonth()==month && this.realDate.getFullYear()==year)? " today":"") + '">';
                html += '<td class="calendar-day';
                if (inc_day <= monthLength && (i > 0 || j >= startingDay)) {
                    if(inc_day == day && this.realDate.getMonth()==month && this.realDate.getFullYear()==year){
                        html+=' today">';
                    } else {html+= '">'}
                    
                    html += inc_day;
                    inc_day++;
                }
                else {html+= '">'}
                html += '</td>';
            }
            // stop making rows if we've run out of days
            if (inc_day > monthLength) {
                break;
            } else {
                html += '</tr><tr>';
            }
        }
        html += '</tr></table>'; 
        return html;
    }
});
