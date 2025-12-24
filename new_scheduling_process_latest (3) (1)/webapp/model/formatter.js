sap.ui.define([], function () {
    "use strict";
    return {
        selfConsumpIndic: function (ind) {
            try {
                if (ind === "X") {
                    return true;
                }
                else {
                    return false
                }
            } catch (err) {
                return "";
            }
        },
          //End the code
        businessText: function (value) {
            try{
                var oModel = this.getView().getModel("businessModel");
                var oData = oModel.oData;
                var desc;
                for (var i = 0; i < oData.length; i++) {
                    if (oData[i].BusinessScenario === value) {
                        desc = oData[i].Description;
                    }
                }
                return desc;
            }
            catch(err){
                console.log(err);
            }
          
        },         

        QtyFormatting: function(value) {
            var oLocale = new sap.ui.core.Locale("pt-BR"); // Set the locale to Brazil
            var oNumberFormat = sap.ui.core.format.NumberFormat.getCurrencyInstance({
                style: "decimal",
                decimals: 2,
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ","
            }, oLocale);
         
            return oNumberFormat.format(value);
        }
    };
})