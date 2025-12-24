sap.ui.define(
    [
      "./BaseController",
        "sap/ui/core/UIComponent"
    ],
    function(BaseController, UIComponent) {
      "use strict";
  
      return BaseController.extend("schedulingprocess.schedulingprocess.controller.App", {
        onInit() {
        },
        onQuotaDetails: function () {
          this.getRouter().navTo("QuotaTable");
      },
      onDigitalHub: function () {
          this.getRouter().navTo("OrderRequest");
      },
      getRouter: function () {
          return UIComponent.getRouterFor(this);
      }
      });
    }
  );
  