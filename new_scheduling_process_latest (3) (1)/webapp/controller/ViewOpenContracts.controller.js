//Begin the code
//  Workbench TR : DA1K909941 
//   OTC_I658 - New  View O9 Data  added as part of new changes 
sap.ui.define([
    "./BaseController",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/message/Message",
    "sap/ui/core/Core",
    "schedulingprocess/schedulingprocess/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, UIComponent, JSONModel, MessageBox, PersonalizableInfo, Message, Core, formatter) {
        "use strict";
        var i18n;
        var messageManager;
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.ViewOpenContracts", {
            formatter: formatter,
            onInit: function () {
                // Prepare UI controls instances
                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                messageManager = Core.getMessageManager();
                messageManager.removeAllMessages();
                messageManager.registerObject(this.getView(), true);
                this.getView().setModel(messageManager.getMessageModel(), "message");
                this.createMessagePopOver();
                this.layoutData();
                //calling  OData service from the model
                var oDataModel = this.getOwnerComponent().getModel("ScheduleModel");
                //Reading the entity and passing to model with createWeekDialog from base ccontroller
                this.read("/ETY_WEEKSet", [], oDataModel, "createWeekDialog");
                var model = new JSONModel({});
                this.getOwnerComponent().setModel(model, "tableFilterModel");
            },
            //Passing Header Filters to the table on click of go event to get table data
            onSearch: function () {
                // Prepare UI controls instances
                var weekCtrl = this.getView().byId("weekInput");
                //Get the ODataModel
                var oDataModel = this.getOwnerComponent().getModel("ScheduleModel");
               
                weekCtrl.setValueState("None");
                //Get the Filter Tokens
                if (weekCtrl.getTokens().length === 0) {
                    weekCtrl.setValueState("Error");
                    return;
                }

                var filters = [];
                //Get the Filter Tokens
                var weekTokens = this.getView().byId("weekInput").getTokens();
                if (weekTokens.length > 0) {
                    //Passing week filter tokens to create filter method
                    this.createFilters(weekTokens, filters, "Week");

                }
                var marginInput = parseInt(this.getView().byId("marginInput").getValue());
                this.createFiltersMargin(marginInput,filters,"Margin");
                this.bindWeekCombo();
                this.resetLayout();
                this.onLayoutChange();
                
                //Passing filters, oDatamodel and binding the table
                this.read("/ETS_SCHEDULE_LOGSet", filters, oDataModel,"bindTable");
            },
            //Setting the model to the table and binding to view page
            bindTable: function (oData) {
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "ViewOpenContractsModel");
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
            onLayoutChange: function (oEvt) {
                //Get the selected keys through layout fields.
                var selectedKeys = this.getView().byId("layout").getSelectedKeys();
                selectedKeys.forEach(function (f) {
                    try {
                        this.getView().byId(f).setVisible(true);
                    }
                    catch (err) { }
                }.bind(this))

            },
            //Reset the layout fields
            resetLayout: function () {
                var columnsIds = this.getView().getModel("LocalModel").getData();
                columnsIds.Columns.forEach(function (f) {
                    try {
                        this.getView().byId(f.ID).setVisible(false);
                    }
                    catch (err) { }

                }.bind(this))
            },
            //Using this method for read call and will trigger the callback function
            read: function (sEntity, filters, oModel, callBackFn) {
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
    
             //Preapre Layout fields for each table column
             layoutData: function () {
                var data = {
                    "Columns": [
                        {
                            "ID": "Week",
                            "Text": i18n.getText("week")
                        },
                        //Adding margin column Defect Fix : 1887 for OTC_I55 object Work Bench TR : DA1K911309 
                        {
                            "ID": "Margin",
                            "Text": i18n.getText("amount")
                        },
                        {
                            "ID": "ContractNumber",
                            "Text": i18n.getText("salesandDistributionDocNum")
                        },
                        {
                            "ID": "Item",
                            "Text": i18n.getText("itemNumberofsdDoc")
                        },
                        {
                            "ID": "ManagerId",
                            "Text": i18n.getText("accountMngID")
                        },
                        {
                            "ID": "BusinessScenario",
                            "Text": i18n.getText("businessScenario")
                        },
                          //  Begin the code 
                     // Work Bench TR : DA1K912060
                    // New changes to add table column for Business Process 
                        {
                            "ID": "BusProcess",
                            "Text": i18n.getText("busProcess")
                        },
                        //End the code.
                        {
                            "ID": "Plant",
                            "Text": i18n.getText("plant")
                        },
                        {
                            "ID": "NetworkPlant",
                            "Text": i18n.getText("NetworkPlant")
                        },

                        {
                            "ID": "SoldToId",
                            "Text": i18n.getText("soldToPartyID")
                        },
                        {
                            "ID": "ShiptoId",
                            "Text": i18n.getText("shiptoPartyID")
                        },
                        {
                            "ID": "SoldToName",
                            "Text": i18n.getText("soldToPrtyName")
                        },

                        {
                            "ID": "ShipToName",
                            "Text": i18n.getText("shipToPrtyName")
                        },
                        {
                            "ID": "Material",
                            "Text": i18n.getText("matnr")
                        },
                        {
                            "ID": "FormulaKey",
                            "Text": i18n.getText("formulaKey")
                        },
                        {
                            "ID": "Incoterms",
                            "Text": i18n.getText("incoterms")
                        },
                        {
                            "ID": "AccMngName",
                            "Text": i18n.getText("accountMngName")
                        },
                        {
                            "ID": "MaterialDesc",
                            "Text": i18n.getText("matnrDesc")
                        },
                        {
                            "ID": "FormulaKeyDesc",
                            "Text": i18n.getText("formulaDesc")
                        },
                        {
                            "ID": "OrdQty",
                            "Text": i18n.getText("orderQty")
                        },
                        {
                            "ID": "BlockFlag",
                            "Text": i18n.getText("blockFlag")
                        },
                        {
                            "ID": "ExpiredContractFlag",
                            "Text": i18n.getText("expContQty")
                        },
                        {
                            "ID": "FutureContractFlag",
                            "Text": i18n.getText("futContQty")
                        },
                        {
                            "ID": "BulkFlag",
                            "Text": i18n.getText("bulkflag")
                        },
                        {
                            "ID": "DocType",
                            "Text": i18n.getText("docType")
                        },
                        {
                            "ID": "ValidFrom",
                            "Text": i18n.getText("validfrom")
                        },
                        {
                            "ID": "ValidTo",
                            "Text": i18n.getText("validto")
                        },
                        {
                            "ID": "RemainingQty",
                            "Text": i18n.getText("remainingQty")
                        }, 
                    ]
                }

                var oModel = new JSONModel(data);
                this.getView().setModel(oModel, "LocalModel");
                var columns = data.Columns;
                var cols = [];
                columns.forEach(function (c, i) {
                    //  if (i < 13) {
                    cols.push(c.ID);
                    // }
                })
                this.getView().byId("layout").setSelectedKeys(cols);

            },
            addField: function (obj, field, property, f) {
                console.log(property);
                if (this.getView().byId(property).getVisible()) {
                    var value=f.getObject()[property];
                    var fieldsWithoutFormatting = ["Material","MaterialDesc","BlockFlag", "ShipToName","AccMngName","BusinessScenario","ShiptoId","Incoterms","BulkFlag", "BusProcess","Week","ExpiredContractFlag","FutureContractFlag","ValidTo","ValidFrom","DocType","BulkFlag","Item","ContractNumber","SoldToId","ShipToId","NetworkPlant","FormulaKey","ManagerId","FormulaKeyDesc","Plant"];
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

       
            //Export functionality used to export the table data
            onExport: function () {
                var table = this.getView().byId("table");
                var rows= table.getBinding('rows').getContexts(0, 999999);
                var arr = [];
                rows.forEach(function (f) {
                    var obj = {};
                    this.addField(obj, "week", "Week", f);
                      //Begin the code
                //Added Margin field in excel as part of GPT -32491
                //Workbench TR : DA1K919630
                    this.addField(obj, "amount", "Margin", f);
                    //end the code.
                    this.addField(obj, "salesandDistributionDocNum", "ContractNumber", f);
                    this.addField(obj, "itemNumberofsdDoc", "Item", f);
                    this.addField(obj, "accountMngID", "ManagerId", f);
                    this.addField(obj, "businessScenario", "BusinessScenario", f);
                      //  Begin the code 
                     // Work Bench TR : DA1K912060
                    // New changes to add table column for Business Process 
                    this.addField(obj, "busProcess", "BusProcess", f);
                    //End the code.
                    this.addField(obj, "plant", "Plant", f);
                    this.addField(obj, "NetworkPlant", "NetworkPlant", f);
                    this.addField(obj, "soldToPartyID", "SoldToId", f);
                    this.addField(obj, "shiptoPartyID", "ShiptoId", f);
                    this.addField(obj, "soldToPrtyName", "SoldToName", f);
                    this.addField(obj, "shipToPrtyName", "ShipToName", f);
                    this.addField(obj, "matnr", "Material", f);
                    this.addField(obj, "formulaKey", "FormulaKey", f);
                    this.addField(obj, "incoterms", "Incoterms", f);
                    this.addField(obj, "accountMngName", "AccMngName", f);
                    this.addField(obj, "matnrDesc", "MaterialDesc", f);
                    this.addField(obj, "formulaDesc", "FormulaKeyDesc", f);
                    this.addField(obj, "orderQty", "OrdQty", f);
                    this.addField(obj, "blockFlag", "BlockFlag", f);
                    this.addField(obj, "expContQty", "ExpiredContractFlag", f);
                    this.addField(obj, "futContQty", "FutureContractFlag", f);
                    this.addField(obj, "bulkflag", "BulkFlag", f);
                    this.addField(obj, "docType", "DocType", f);
                    this.addField(obj, "validfrom", "ValidFrom", f);
                    this.addField(obj, "validto", "ValidTo", f);
                    this.addField(obj, "remainingQty", "RemainingQty", f);
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
//End the code
