sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    'sap/ui/model/json/JSONModel',
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "fdpdashboard/model/formatter"
], function (Controller, History, JSONModel, UIComponent, MessageBox, formatter) {
    "use strict";
    var view;
    var localModel;
    var messageManager;
    var i18n;
    return Controller.extend("fdpdashboard.controller.Detail", {
        formatter: formatter,
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("Detail").attachMatched(this._onRouteMatched, this);
            view = this.getView();
            i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        _onRouteMatched: function (oEvent) {

        },

        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("Home");
        }

    });
});
