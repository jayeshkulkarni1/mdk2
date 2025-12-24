sap.ui.define([], function(){
    "use strict";
    return {

        formatDate : function(date){
            try {
                var newDate =  date.substr(6,2) + "." + date.substr(4,2) + "."+ date.substr(0,4)  ;
                return newDate;
            }catch(err){
                return "";
            }
        },
        formatTime : function(time){
            try {
                time =time.toString();
                var newTime =   time.substr(0,2) + ":" + time.substr(3,2) + ":"+ time.substr(4,2);
                return newTime;
            }catch(err){
                return "";
            }
        },
        spaceIndicator : function(ind){
            try {
                if(ind === "X" || ind === "Y" || ind === "1" || ind ==="2"){
                    return "Yes";
                }
                else {
                    return "No"
                }
            }catch(err){
                return "";
            }
        },

    };
})