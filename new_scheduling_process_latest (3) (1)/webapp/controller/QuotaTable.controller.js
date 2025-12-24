sap.ui.define([
    "./BaseController",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, UIComponent, JSONModel, MessageBox) {
        "use strict";
        var i18n;
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.OrderRequest", {
            onInit: function () {
                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                var oDataModel = this.getOwnerComponent().getModel("SearchHelpModel");
                this.read("/ETS_WEEKSet", [], "createWeekDialog", oDataModel);
                this.read("/ETS_ACCMANAGER_VH", [], "createAccManagerDialog", oDataModel);
                this.read("/ETS_PLANT_VH", [], "createPlantDialog", oDataModel);
                this.read("/ETS_PLANT_GRP", [], "createPlantGroupDialog", oDataModel);
                this.read("/ETS_FORMULA_KEY", [], "createFormulaKeyDialog", oDataModel);
                this.read("/ETS_CUSTOMER_VH", [], "createCustomerDialog", oDataModel);
                this.read("/ETS_MATERIAL_VH", [], "createMaterialDialog", oDataModel);
                var model = new JSONModel({});
                this.getOwnerComponent().setModel(model, "tableFilterModel");
            },
            onSearch: function () {
                var weekCtrl = this.getView().byId("weekInput");
                weekCtrl.setValueState("None");
                if (weekCtrl.getTokens().length === 0) {
                    weekCtrl.setValueState("Error");
                    return;
                }
                var accMangCtrl = this.getView().byId("accMngInput");
                accMangCtrl.setValueState("None");
                if (accMangCtrl.getTokens().length === 0) {
                    accMangCtrl.setValueState("Error");
                    return;
                }
                var filters = [];
                var accManagTokens = this.getView().byId("accMngInput").getTokens();
                if (accManagTokens.length > 0) {
                    this.createFilters(accManagTokens, filters, "ManagerId");
                }
                var plantTokens = this.getView().byId("plantInput").getTokens();
                if (plantTokens.length > 0) {
                    this.createFilters(plantTokens, filters, "Plant");
                }
                var customerTokens = this.getView().byId("customerInput").getTokens();
                if (customerTokens.length > 0) {
                    this.createFilters(customerTokens, filters, "CustomerId");
                }
                var materialTokens = this.getView().byId("materialInput").getTokens();
                if (materialTokens.length > 0) {
                    this.createFilters(materialTokens, filters, "Material");
                }
                var formulaKeyTokens = this.getView().byId("formulaKeyInput").getTokens();
                if (formulaKeyTokens.length > 0) {
                    this.createFilters(formulaKeyTokens, filters, "FormulaKey");
                }
                var weekTokens = this.getView().byId("weekInput").getTokens();
                if (weekTokens.length > 0) {
                    this.createFilters(weekTokens, filters, "Week");

                }
                this.read("/ETS_ZQUOTA_SCH", filters, "bindTable");
            },
            bindTable: function (oData) {
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "QuotaTableModel");
                if (oData.results.length) {
                    this.getView().byId("table").setVisible(true);
                    this.applySchedFilters();
                } else {
                    this.getView().byId("table").setVisible(false);
                    MessageBox.information(i18n.getText("noRecords"));
                }

                console.log(oData);
            },
            bindWeekCombo: function (oData) {
                console.log(oData);
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "WeeksModel");


            },
            onFilterScheduleTable: function (oEvent) {
                var a = oEvent.getParameters("column");
                var b = oEvent.getParameters("value");
                var data = this.getOwnerComponent().getModel("tableFilterModel").getData();
                if (!data.results) {
                    data.results = [];
                }
                var obj = {
                    "key": a.column.sId.split("--")[2],
                    "value": b.value
                }
                data.results.push(obj);
                this.getOwnerComponent().getModel("tableFilterModel").setData(data);
            },
            applySchedFilters: function () {
                try {
                    var tableId = this.getView().byId("table");
                    var data = this.getOwnerComponent().getModel("tableFilterModel").getData();
                    if (data.results) {
                        data.results.forEach(function (e) {
                            tableId.filter(this.getView().byId(e.key), e.value);
                        }.bind(this))
                    }
                }
                catch (err) {
                    console.log(err);
                }
            },
            read: function (sEntity, filters, callBackFn) {
                var oModel = this.getOwnerComponent().getModel("QuotaModel");
                oModel.read(sEntity, {
                    filters: filters,
                    success: function (oData) {
                        if (callBackFn) {
                            this[callBackFn](oData);
                            this.applySchedFilters();
                        }
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (err) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },


            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },

            addField: function (obj, field, property, f) {
                console.log(property);
                if (this.getView().byId(property).getVisible()) {
                    var value=f.getObject()[property];
                    var fieldsWithoutFormatting = ["Material","MaterialDesc","PlantDesc","CustomerName","FormulaKey","ManagerId","FormulaKeyDesc","Plant"];
                    if (!fieldsWithoutFormatting.includes(property)) {
                        // Set locale to Brazil
                        var oLocale = new sap.ui.core.Locale("pt-BR");
                        // Create number format instance with Brazil format
                        var oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
                            style: "decimal",
                            decimals: 2,
                            groupingEnabled: true,
                            groupingSeparator: ".",
                            decimalSeparator: ","
                        }, oLocale);
             
                        // Format the value
                        value = oNumberFormat.format(value);
                    }
                    obj[i18n.getText(field)] = value;
                }
            },

            onExport: function () {
                var table = this.getView().byId("table");
                var rows= table.getBinding('rows').getContexts(0, 999999);
                var arr = [];
                rows.forEach(function (f) {
                    var obj = {};
                    this.addField(obj, "week", "Week", f);
                    this.addField(obj, "accountMngID", "ManagerId", f);
                    this.addField(obj, "accountMngName", "AccMngName", f);

                    this.addField(obj, "plant", "Plant", f);
                    this.addField(obj, "plantDesc", "PlantDesc", f);
                    this.addField(obj, "matnr", "Material", f);
                    this.addField(obj, "matnrDesc", "MaterialDesc", f);
                    this.addField(obj, "formulaKey", "FormulaKey", f);
                    this.addField(obj, "formulaDesc", "FormulaDesc", f);

                    this.addField(obj, "soldToPartyID", "CustomerName", f);
                    this.addField(obj, "soldToPrtyName", "CustomerName", f);
                    this.addField(obj, "quota", "Quota", f);
                    this.addField(obj, "uom", "Uom", f);
                    this.addField(obj, "creationDate", "CreatedOn", f);

                    arr.push(obj)
                }.bind(this))

                // Convert JSON to Excel workbook using sheetJs
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(arr);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                // Save the workbook as an Excel file
                XLSX.writeFile(workbook, "data.xlsx");
            }

        });
    });
