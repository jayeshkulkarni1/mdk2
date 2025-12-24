//Begin the code
//  Workbench TR : DA1K909941 
//   OTC_I658 - New  View O9 Data  added as part of new changes 
sap.ui.define([
    "./BaseController",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/comp/smartvariants/PersonalizableInfo",
    "sap/ui/core/Core",
    "schedulingprocess/schedulingprocess/model/formatter",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, UIComponent, JSONModel, MessageBox, PersonalizableInfo, Core, formatter) {
        "use strict";
        var i18n;
        var messageManager;
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.ViewO9Data", {
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
                var oDataModel = this.getOwnerComponent().getModel("ViewO9DataModel");
                //Reading the entity and passing to model with createWeekDialog from base ccontroller
                this.read("/ETS_WEEKSet", [], oDataModel, "createWeekDialog");

                var SearchHelpModel = this.getOwnerComponent().getModel("SearchHelpModel");


                // settting business model for Business scenario formatter
                SearchHelpModel.read("/ETS_BUSINESS_SCENARIOSet", {
                    success: function (data) {
                        var businessModel = new JSONModel(data.results);
                        this.getView().setModel(businessModel, "businessModel");
                        console.log(businessModel.oData);
                    }.bind(this),
                    error: function (error) {

                    }
                })
                var model = new JSONModel({});
                this.getOwnerComponent().setModel(model, "tableFilterModel");
            },
            onAfterRendering: function(){

            },
            //Passing Header Filters to the table on click of go event to get table data
            onSearch: function () {
                // Prepare UI controls instances
                var weekCtrl = this.getView().byId("weekInput");
                //Get the ODataModel
                var oDataModel = this.getOwnerComponent().getModel("ViewO9DataModel");
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
                this.resetLayout();
                this.onLayoutChange();
                //Passing filters, oDatamodel and binding the table
                this.read("/ETS_O9LOGSet", filters, oDataModel, "bindTable");
            },
            onLayoutChange: function (oEvt) {
                //Get the selected keys through layout input field.
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
            //Setting the model to the table and binding to view page
            bindTable: function (oData) {
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "ViewO9DataTableModel");
                if (oData.results.length) {
                    this.getView().byId("table").setVisible(true);
                    this.getView().byId("SimulateButton").setVisible(true);
                    this.applySchedFilters();
                } else {
                    this.getView().byId("table").setVisible(false);
                    this.getView().byId("SimulateButton").setVisible(false);
                    MessageBox.information(i18n.getText("noRecords"));
                }

                console.log(oData);
            },
            bindWeekCombo: function (oData) {
                console.log(oData);
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "WeeksModel");

            },
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
                            "ID": "BlockFlag",
                            "Text": i18n.getText("contractBlockFlag")
                        },
                        {
                            "ID": "Rank",
                            "Text": i18n.getText("rank")
                        },
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
                            "ID": "ValidFrom",
                            "Text": i18n.getText("validfrom")
                        },
                        {
                            "ID": "ValidTo",
                            "Text": i18n.getText("validto")
                        },
                        {
                            "ID": "OrdQty",
                            "Text": i18n.getText("openQty")
                        },
                        {
                            "ID": "CustomerReqQty",
                            "Text": i18n.getText("customerReqQty")
                        },
                        {
                            "ID": "Uom",
                            "Text": i18n.getText("uom")
                        },
                        {
                            "ID": "AmConfQty",
                            "Text": i18n.getText("AmConfQty")
                        },
                        {
                            "ID": "MosSchdQty",
                            "Text": i18n.getText("MosSchdQty")
                        },
                        {
                            "ID": "ConsumeQty",
                            "Text": i18n.getText("ConsumeQty")
                        },
                        {
                            "ID": "BacklogQty",
                            "Text": i18n.getText("BacklogQty")
                        },
                        
                        // Begin the code Defect - GPT - 28372
                        // Work Bench TR : DA1K916990 
                        // New changes to add layout for table columns
                        {
                            "ID": "MON_QTY",
                            "Text": i18n.getText("mon")
                        },
                        {
                            "ID": "MON_PACK",
                            "Text": i18n.getText("monPack")
                        },
                        {
                            "ID": "TUE_QTY",
                            "Text": i18n.getText("tue")
                        },
                        {
                            "ID": "TUE_PACK",
                            "Text": i18n.getText("tuePack")
                        },
                        {
                            "ID": "WED_QTY",
                            "Text": i18n.getText("wed")
                        },
                        {
                            "ID": "WED_PACK",
                            "Text": i18n.getText("wedPack")
                        },
                        {
                            "ID": "THU_QTY",
                            "Text": i18n.getText("thu")
                        },
                        {
                            "ID": "THU_PACK",
                            "Text": i18n.getText("thuPack")
                        },
                        {
                            "ID": "FRI_QTY",
                            "Text": i18n.getText("fri")
                        },
                        {
                            "ID": "FRI_PACK",
                            "Text": i18n.getText("friPack")
                        },
                        {
                            "ID": "SAT_QTY",
                            "Text": i18n.getText("sat")
                        },
                        {
                            "ID": "SAT_PACK",
                            "Text": i18n.getText("satPack")
                        },
                        {
                            "ID": "SUN_QTY",
                            "Text": i18n.getText("sun")
                        },
                        {
                            "ID": "SUN_PACK",
                            "Text": i18n.getText("sunPack")
                        },
                        {
                            "ID": "LAST_DEL_PT",
                            "Text": i18n.getText("lastDelPoint")
                        },
                        {
                            "ID": "ConfirmQtyO9",
                            "Text": i18n.getText("O9ConfirmQty")
                        },
                        {
                            "ID": "O9_MON",
                            "Text": i18n.getText("o9Mon")
                        },
                        {
                            "ID": "O9_TUE",
                            "Text": i18n.getText("o9Tue")
                        },
                        {
                            "ID": "O9_WED",
                            "Text": i18n.getText("o9Wed")
                        },
                        {
                            "ID": "O9_THU",
                            "Text": i18n.getText("o9Thu")
                        },  {
                            "ID": "O9_FRI",
                            "Text": i18n.getText("o9Fri")
                        },
                        {
                            "ID": "O9_SAT",
                            "Text": i18n.getText("o9Sat")
                        },  {
                            "ID": "O9_SUN",
                            "Text": i18n.getText("o9Sun")
                        },
                        // End the code Defect - GPT - 28372
                        // Work Bench TR : DA1K916990 
                        // New changes to add layout for table columns
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
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
          
            //Method used for export Functionality to each field from entity properties with i18n instances
            addField: function (obj, field, property, f) {
                console.log(property);
                if (this.getView().byId(property).getVisible()) {
                    var value=f.getObject()[property];
                    var fieldsWithoutFormatting = ["Material","MaterialDesc","ConsumeQty","BlockFlag","ExpiredContractFlag","AccMngName","BusinessScenario","Incoterms","BulkFlag","ShipToName","ShiptoId", "BusProcess","Week","FutureContractFlag","ValidTo","RemainingQty","ValidFrom","DocType", "BulkFlag","Item","ContractNumber","SoldToId","ShipToId","NetworkPlant","FormulaKey","ManagerId","FormulaKeyDesc","Plant","Rank","LAST_DEL_PT"];
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
            //Simulate method used for pass week filter to the backend. Based on backend calucaltions

            onSimulate: function () {
                var weekCtrl = this.getView().byId("weekInput");
                var oDataModel = this.getOwnerComponent().getModel("ViewO9DataModel");
                weekCtrl.setValueState("None");
                if (weekCtrl.getTokens().length === 0) {
                    weekCtrl.setValueState("Error");
                    return;
                }

                var filters = [];
                //Get the tokens
                var weekTokens = this.getView().byId("weekInput").getTokens();
                if (weekTokens.length > 0) {
                    this.createFilters(weekTokens, filters, "Week");

                }
                //Passing the entity set to the filters with model
                this.submitOData("/ETS_ORDER_REQSet", filters, oDataModel);
            },
            //Using this method for read call and will trigger success or error message
            submitOData: function (sEntity, filters, oModel) {
                var oModel = this.getOwnerComponent().getModel("ViewO9DataModel");
                oModel.read(sEntity, {
                    filters: filters,
                    success: function () {
                        MessageBox.success(i18n.getText("simulateMSg"));

                    },
                    error: function () {
                        MessageBox.error(i18n.getText("technicalError"));

                    }
                });
            },
            //Export functionality used to export the table data
            onExport: function () {
                var table = this.getView().byId("table");
                var rows= table.getBinding('rows').getContexts(0, 999999);
                var arr = [];
                rows.forEach(function (f) {
                    var obj = {};
                    this.addField(obj, "week", "Week", f);
                    this.addField(obj, "salesandDistributionDocNum", "ContractNumber", f);
                    this.addField(obj, "itemNumberofsdDoc", "Item", f);
                    this.addField(obj, "managerId", "ManagerId", f);
                    this.addField(obj, "businessScenario", "BusinessScenario", f);
                      //  Begin the code 
                     // Work Bench TR : DA1K912060
                    // New changes to add table column for Business Process 
                    this.addField(obj, "busProcess", "BusProcess", f);
                    //End the code
                    this.addField(obj, "contractBlockFlag", "BlockFlag", f);
                    this.addField(obj, "rank", "Rank", f);
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
                    this.addField(obj, "validfrom", "ValidFrom", f);
                    this.addField(obj, "validto", "ValidTo", f);
                    this.addField(obj, "openQty", "OrdQty", f);
                    this.addField(obj, "customerReqQty", "CustomerReqQty", f);
                    this.addField(obj, "uom", "Uom", f);
                    this.addField(obj, "AmConfQty", "AmConfQty", f);
                    this.addField(obj, "MosSchdQty", "MosSchdQty", f);
                    this.addField(obj, "ConsumeQty", "ConsumeQty", f);
                    this.addField(obj, "BacklogQty", "BacklogQty", f);
                    
                    //  Begin the code Defect - GPT - 28372
                    // Work Bench TR : DA1K916990 
                    // New changes to add table columns 
                    this.addField(obj, "mon", "MON_QTY", f);
                    this.addField(obj, "monPack", "MON_PACK", f);
                    this.addField(obj, "tue", "TUE_QTY", f);
                    this.addField(obj, "tuePack", "TUE_PACK", f);
                    this.addField(obj, "wed", "WED_QTY", f);
                    this.addField(obj, "wedPack", "WED_PACK", f);
                    this.addField(obj, "thu", "THU_QTY", f);
                    this.addField(obj, "thuPack", "THU_PACK", f);
                    this.addField(obj, "fri", "FRI_QTY", f);
                    this.addField(obj, "friPack", "FRI_PACK", f);
                    this.addField(obj, "sat", "SAT_QTY", f);
                    this.addField(obj, "satPack", "SAT_PACK", f);
                    this.addField(obj, "sun", "SUN_QTY", f);
                    this.addField(obj, "sunPack", "SUN_PACK", f);
                    this.addField(obj, "lastDelPoint", "LAST_DEL_PT", f);
                    this.addField(obj, "O9ConfirmQty", "ConfirmQtyO9", f);
                    this.addField(obj, "o9Mon", "O9_MON", f);
                    this.addField(obj, "o9Tue", "O9_TUE", f);
                    this.addField(obj, "o9Wed", "O9_WED", f);
                    this.addField(obj, "o9Thu", "O9_THU", f);
                    this.addField(obj, "o9Fri", "O9_FRI", f);
                    this.addField(obj, "o9Sat", "O9_SAT", f);
                    this.addField(obj, "o9Sun", "O9_SUN", f);
                    // End the code Defect - GPT - 28372
                    // Work Bench TR : DA1K916990 
                    // New changes to add table columns 
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
