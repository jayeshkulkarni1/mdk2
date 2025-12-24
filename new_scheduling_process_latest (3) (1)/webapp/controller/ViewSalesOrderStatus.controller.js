//Begin the code
//  Workbench TR : DA1K909941 
//   OTC_I658 - New  View O9 Data  added as part of new changes 
sap.ui.define([
    "./BaseController",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/core/Core",
    "schedulingprocess/schedulingprocess/model/formatter",
    'sap/ui/comp/smartvariants/PersonalizableInfo',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, UIComponent, JSONModel, MessageBox, Core, formatter, PersonalizableInfo) {
        "use strict";
        var i18n;
        var messageManager;
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.ViewSalesOrderStatus", {
            formatter: formatter,
            onInit: function () {
                // Prepare UI controls instances
                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.getVariants();
                messageManager = Core.getMessageManager();
                messageManager.removeAllMessages();
                messageManager.registerObject(this.getView(), true);
                this.getView().setModel(messageManager.getMessageModel(), "message");
                this.createMessagePopOver();
                this.layoutData();


              
                //calling  OData service from the model
                var oDataModel = this.getOwnerComponent().getModel("ViewSalesOrderStatusModel");
              
                //Reading the entity and passing to model with createWeekDialog from base ccontroller
                this.read("/ETY_SCH_WEEKSet", [],  oDataModel, "createSingleWeekDialog",);
                this.read("/ETS_ACCMANAGER_VH", [], oDataModel, "createAccManagerDialog");
                this.read("/ETS_PLANT_VH", [], oDataModel, "createPlantDialog");
                this.read("/ETS_PLANT_GRP", [],oDataModel, "createPlantGroupDialog" );
                this.read("/ETS_FORMULA_KEY", [], oDataModel,"createFormulaKeyDialog" );
                this.read("/ETS_CUSTOMER_VH", [], oDataModel,"createCustomerDialog" );
           
                this.getVariants();
                var model = new JSONModel({});
                this.getOwnerComponent().setModel(model, "tableFilterModel");

                var searchHelpModel = this.getOwnerComponent().getModel("SearchHelpModel");
                searchHelpModel.read("/ETS_BUSINESS_SCENARIOSet", {
                    success: function (data) {
                        var businessScenario = new JSONModel(data.results);
                        this.getView().setModel(businessScenario, "businessModel");
                        // this.getView().getModel("businessScenarioModel").setProperty("/bIsChecklistLoaded", true);
                    }.bind(this),
                    error: function () {
                        
                    }
                })
                
            },
            getVariants: function (aData) {
                this.applyData = this.applyData.bind(this);
                this.fetchData = this.fetchData.bind(this);
                this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
                this.oSmartVariantManagement = this.getView().byId("svm");
                this.oFilterBar = this.getView().byId("viewOpencontractsFilter");
                this.oTable = this.getView().byId("table");
                this.oFilterBar.registerFetchData(this.fetchData);
                this.oFilterBar.registerApplyData(this.applyData);
                this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

                var oPersInfo = new PersonalizableInfo({
                    type: "filterBar",
                    keyName: "myPersKey",
                    dataSource: "",
                    control: this.oFilterBar
                });
                this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
                this.oSmartVariantManagement.initialise(function () { }, this.oFilterBar);
            },

            applyData: function (aData) {
                this.getView().byId("weekInput").removeAllTokens();
                this.getView().byId("accMngInput").removeAllTokens();
                this.getView().byId("plantInput").removeAllTokens();
                this.getView().byId("plantGroupInput").removeAllTokens();
                this.getView().byId("formulaKeyInput").removeAllTokens();
                this.getView().byId("customerInput").removeAllTokens();
                this.getView().byId("materialInput").removeAllTokens();
                aData.forEach(function (oDataObject) {
                    var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                    var multiFilters = ["Week", "Account Manager", "Plant","Plant Group", "Formula", "Customer", "Material"];
                    if (multiFilters.includes(oDataObject.fieldName)) {

                        if (oDataObject.fieldData.length) {
                            oControl.removeAllTokens();
                            oDataObject.fieldData.forEach(function (f) {
                                var otoken1 = new sap.m.Token({
                                    key: f.key,
                                    text: f.text
                                });

                                oControl.addToken(otoken1,);
                            })

                        }
                    }
                    else if (oDataObject.fieldName === "Layout") {
                        oControl.setSelectedKeys(oDataObject.fieldData);
                        oDataObject.fieldData.forEach(function (f) {
                            try {
                                this.getView().byId(f).setVisible(true);
                            } catch (err) {

                            }

                        }.bind(this))
                    }

                    else {
                        oControl.setValue(oDataObject.fieldData);
                    }
                }, this);
            },
            getFiltersWithValues: function () {
                var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();
                    var multiFilters = ["Week", "Account Manager", "Plant", "Plant Group", "Formula", "Customer", "Material"];
                    if (multiFilters.includes(oFilterGroupItem.getName())) {
                        if (oControl && oControl.getTokens().length > 0) {
                            aResult.push(oFilterGroupItem);
                        }
                    }
                    else if (oFilterItem.getName() === "Layout") {
                        if (oControl && oControl.getSelectedKeys().length > 0) {
                            aResult.push(oFilterGroupItem);
                        }
                    }

                    else {
                        if (oControl && oControl.getValue().length > 0) {
                            aResult.push(oFilterGroupItem);
                        }
                    }

                    return aResult;
                }, []);

                return aFiltersWithValue;
            },
            fetchData: function () {
                var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                    var multiFilters = ["Week", "Account Manager", "Plant", "Plant Group", "Formula", "Customer", "Material"];
                    if (multiFilters.includes(oFilterItem.getName())) {
                        var tokens = oFilterItem.getControl().getTokens();
                        if (tokens.length) {
                            var data = [];
                            tokens.forEach(function (t) {
                                var obj = {
                                    key: t.getProperty("key"),
                                    text: t.getProperty("text")
                                }
                                data.push(obj);
                            })

                            aResult.push({
                                groupName: oFilterItem.getGroupName(),
                                fieldName: oFilterItem.getName(),
                                fieldData: data
                            });
                        }
                    }
                    else if (oFilterItem.getName() === "Layout") {
                        var tokens = oFilterItem.getControl().getSelectedKeys();
                        aResult.push({
                            groupName: oFilterItem.getGroupName(),
                            fieldName: oFilterItem.getName(),
                            fieldData: oFilterItem.getControl().getSelectedKeys()
                        });
                    }
                    else {
                        aResult.push({
                            groupName: oFilterItem.getGroupName(),
                            fieldName: oFilterItem.getName(),
                            fieldData: oFilterItem.getControl().getValue()
                        });
                    }
                    return aResult;
                }, []);

                return aData;
            },

            //Passing Header Filters to the table on click of go event to get table data
            onSearch: function () {
                // Prepare UI controls instances
                var weekCtrl = this.getView().byId("weekInput");
                //Get the ODataModel
             
                var oDataModel = this.getOwnerComponent().getModel("ViewSalesOrderStatusModel");
                weekCtrl.setValueState("None");
                //Get the Filter Tokens
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
                //Get the Filter Tokens
                var weekTokens = this.getView().byId("weekInput").getTokens();
                if (weekTokens.length > 0) {
                    //Passing week filter tokens to create filter method
                    this.createFilters(weekTokens, filters, "Week");

                }

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
                var plantGroupTokens = this.getView().byId("plantGroupInput").getTokens();
                if (plantGroupTokens.length > 0) {
                    this.createFilters(plantGroupTokens, filters, "NetworkPlant");
                }
                this.bindWeekCombo();
                this.resetLayout();
                this.onLayoutChange();

                
                //Passing filters, oDatamodel and binding the table
                this.read("/ETY_DH_VIEWSet", filters,oDataModel,"bindTable");
            },
            //Setting the model to the table and binding to view page
            bindTable: function (oData) {
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "ViewSalesOrderStatusModel");
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
                var oModel = this.getOwnerComponent().getModel("ViewSalesOrderStatusModel");
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

             // Begin the code
            // Defect GPT Fix 33806 -- Persisting filters state while navigating back
            // Workbench TR - DA1K922221
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
            //End the code
            //Defect GPT -33806  -- Persisting filters state while navigating back

    
             //Preapre Layout fields for each table column
             layoutData: function () {
                var data = {
                    "Columns": [
                        {"ID": "ReqId",
                        "Text": i18n.getText("dhReqId")

                        },
                        {
                            "ID": "Week",
                            "Text": i18n.getText("scheduleWeek")
                        },

                        {
                            "ID": "ManagerId",
                            "Text": i18n.getText("accmgr")
                        },

                        {
                            "ID": "Plant",
                            "Text": i18n.getText("plant")
                        },

                        {
                            "ID": "CustomerId",
                            "Text": i18n.getText("soldToPartyID")
                        },
                        {
                            "ID": "ShiptoId",
                            "Text": i18n.getText("shiptoPartyID")
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
                            "Text": i18n.getText("incomTerm")
                        },

                        {
                            "ID": "BusinessScenario",
                            "Text": i18n.getText("businScen")
                        },

                        {"ID": "CreatedOn",
                        "Text": i18n.getText("created")

                        },
                        {"ID": "CreatedBy",
                        "Text": i18n.getText("createdBy")

                        },
                        {"ID": "CreatedVia",
                        "Text": i18n.getText("createdVia")

                        },
                        {
                            "ID": "NfeCoopCustomer",
                            "Text": i18n.getText("nfeCustomer")
                        },
                        {
                            "ID": "Nfebilling",
                            "Text": i18n.getText("nfeBilling")
                        },
                        {
                            "ID": "CustMatnr",
                            "Text": i18n.getText("custmtnr")
                        },
                        {
                            "ID": "AccMngName",
                            "Text": i18n.getText("accountMngName")
                        },
                        {
                            "ID": "NetworkPlant",
                            "Text": i18n.getText("NetworkPlant")
                        },
                        {
                            "ID": "SoldToName",
                            "Text": i18n.getText("soldToName")
                        },
                        {
                            "ID": "ShipToName",
                            "Text": i18n.getText("shipToName")
                        },
                        {
                            "ID": "MaterialDesc",
                            "Text": i18n.getText("matnrDesc")
                        },
                        {
                            "ID": "UOM",
                            "Text": i18n.getText("uom")
                        },
                        {
                            "ID": "PackType",
                            "Text": i18n.getText("packType")
                        },
                        
                        {
                            "ID": "FormulaKeyDesc",
                            "Text": i18n.getText("formulaDesc")
                        },

                        {
                            "ID": "GenPricePerunit",
                            "Text": i18n.getText("genPricePerunit")
                        },
                        {
                            "ID": "TotPrice",
                            "Text": i18n.getText("totalPrice")
                        },
                        {
                            "ID": "CustomerReqQty",
                            "Text": i18n.getText("custReqQty")
                        },
                        {
                            "ID": "PrevDueQty",
                            "Text": i18n.getText("prevDue")
                        },
                       
                        {
                            "ID": "AmConfQty",
                            "Text": i18n.getText("amConQty")
                        },
                        {
                            "ID": "CurrentDueQty",
                            "Text": i18n.getText("currDue")
                        },
                        {
                            "ID": "ContractOpenQty",
                            "Text": i18n.getText("contractOpenQty")
                        },
                        {
                            "ID": "ReqDelDat",
                            "Text": i18n.getText("delDate")
                        },
                        {
                            "ID": "ReqDelDay",
                            "Text": i18n.getText("day")
                        },
                        {
                            "ID": "PackRequested",
                            "Text": i18n.getText("packing")
                        },
                        {
                            "ID": "CuttingQty",
                            "Text": i18n.getText("cuttingQty")
                        },
                        {
                            "ID": "CuttingQtyMon",
                            "Text": i18n.getText("mon")
                        },
                        {
                            "ID": "CuttingQtyTue",
                            "Text": i18n.getText("tue")
                        },
                        {
                            "ID": "CuttingQtyWed",
                            "Text": i18n.getText("wed")
                        },
                        {
                            "ID": "CuttingQtyThur",
                            "Text": i18n.getText("thu")
                        },
                        {
                            "ID": "CuttingQtyFri",
                            "Text": i18n.getText("fri")
                        },
                        {
                            "ID": "CuttingQtySat",
                            "Text": i18n.getText("sat")
                        },
                        {
                            "ID": "CuttingQtySun",
                            "Text": i18n.getText("sun")
                        },
                        {
                            "ID": "PackingSel",
                            "Text": i18n.getText("bagSelect")
                        },
                        {
                            "ID": "ContractReq",
                            "Text": i18n.getText("reqContract")
                        },
                        {
                            "ID": "ContractItemNo",
                            "Text": i18n.getText("conItem")
                        },
                        {
                            "ID": "ShipTo",
                            "Text": i18n.getText("shipToProtocol")
                        },
                        {
                            "ID": "ProtocolPrice",
                            "Text": i18n.getText("priceToCust")
                        },
                        {
                            "ID": "ContractFinalized",
                            "Text": i18n.getText("finContract")
                        },
                        {
                            "ID": "DelInstr",
                            "Text": i18n.getText("delInd")
                        },
                        {
                            "ID": "Mot",
                            "Text": i18n.getText("mot")
                        },
                        {
                            "ID": "PoNo",
                            "Text": i18n.getText("poNo")
                        },
                        {
                            "ID": "PaymentTermsn",
                            "Text": i18n.getText("paymentTermsn")
                        },
                        {
                            "ID": "SoCreated",
                            "Text": i18n.getText("soCreated")
                        },
                        {
                            "ID": "SoItem",
                            "Text": i18n.getText("soItem")
                        },
                        {
                            "ID": "ReasonForRejection",
                            "Text": i18n.getText("reasonRejection")
                        },
                        {
                            "ID": "ContractSelError",
                            "Text": i18n.getText("conSelectionError")
                        },
                        {
                            "ID": "SoCreError",
                            "Text": i18n.getText("soCreationLog")
                        },
                        {
                            "ID": "SelfConsInd",
                            "Text": i18n.getText("selfConsInd")
                        },
                        {
                            "ID": "AutoGenInd",
                            "Text": i18n.getText("autoGenInd")
                        },
                        {
                            "ID": "Currency",
                            "Text": i18n.getText("curreny")
                        },
                        {
                            "ID": "ProtocolId",
                            "Text": i18n.getText("protocolNo")
                        },
                       
                        {
                            "ID": "BackLogQty",
                            "Text": i18n.getText("BacklogQty")
                        },
                        {
                            "ID": "BacklogOrder",
                            "Text": i18n.getText("backlogOrder")
                        },
                        {
                            "ID": "BacklogItem",
                            "Text": i18n.getText("backlogItem")
                        },
                        {
                            "ID": "NFE_BILLING_DATE",
                            "Text": i18n.getText("nfebillingdate")
                        },
                        {
                            "ID": "CNPJ_NO",
                            "Text": i18n.getText("cnpjNumber")
                        },
                       
                       
                        {"ID": "SO_STATUS",
                        "Text": i18n.getText("soStatus")

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

        //Method used for export Functionality to each field from entity properties with i18n instances
        addField: function (obj, field, property, f) {
            console.log(property);
            if (this.getView().byId(property).getVisible()) {
                var value=f.getObject()[property];
                var fieldsWithoutFormatting = ["Material","MaterialDesc","ProtocolId","CustMatnr","Nfebilling","ShiptoId","NFE_BILLING_DATE","ReqDelDay","Mot","NfeCoopCustomer","PoNo","BusinessScenario","Week","ReqId","CreatedOn","CreatedBy","CreatedVia","AccMngName","Item","Margin","ContractNumber","ShipToName","SoldToName","PaymentTermsn","CustomerId","NetworkPlant","FormulaKey","Incoterms","UOM","packType","ManagerId","FormulaKeyDesc","Plant",
            "PackingSel","ReqDelDat","SelfConsInd","AutoGenInd","BacklogOrder","BacklogItem","Currency","DelInstr","ContractReq", "PackRequested","ContractItemNo","SoCreated","SoItem","ContractSelError","SoCreError","CNPJ_NO","ReasonForRejection","SO_STATUS","ShipTo"];
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

                    this.addField(obj, "dhReqId", "ReqId", f);
                    this.addField(obj, "scheduleWeek", "Week", f);
                    this.addField(obj, "accmgr", "ManagerId", f);
                    this.addField(obj, "plant", "Plant", f);
                    this.addField(obj, "soldToPartyID", "CustomerId", f);
                    this.addField(obj, "shiptoPartyID", "ShiptoId", f);
                    this.addField(obj, "matnr", "Material", f);
                    this.addField(obj, "formulaKey", "FormulaKey", f);
                    this.addField(obj, "incomTerm", "Incoterms", f);
                    this.addField(obj, "businScen", "BusinessScenario", f);
                    this.addField(obj, "created", "CreatedOn", f);
                    this.addField(obj, "createdBy", "CreatedBy", f);
                    this.addField(obj, "createdVia", "CreatedVia", f);
                    this.addField(obj, "nfeCustomer", "NfeCoopCustomer", f);
                    this.addField(obj, "nfeBilling", "Nfebilling", f);
                    this.addField(obj, "custmtnr", "CustMatnr", f);
                    this.addField(obj, "accountMngName", "AccMngName", f);
                    this.addField(obj, "NetworkPlant", "NetworkPlant", f);
                    this.addField(obj, "soldToName", "SoldToName", f);
                    this.addField(obj, "shipToName", "ShipToName", f);
                    this.addField(obj, "matnrDesc", "MaterialDesc", f);
                    this.addField(obj, "formulaDesc", "FormulaKeyDesc", f);
                    this.addField(obj, "uom", "UOM", f);
                    this.addField(obj, "packType", "PackType", f);
                    this.addField(obj, "genPricePerunit", "GenPricePerunit", f);
                    this.addField(obj, "totalPrice", "TotPrice", f);
                    this.addField(obj, "custReqQty", "CustomerReqQty", f);
                    this.addField(obj, "prevDue", "PrevDueQty", f);
                    this.addField(obj, "amConQty", "AmConfQty", f);
                    this.addField(obj, "currDue", "CurrentDueQty", f);
                    this.addField(obj, "contractOpenQty", "ContractOpenQty", f);
                    this.addField(obj, "delDate", "ReqDelDat", f);
                    this.addField(obj, "day", "ReqDelDay", f);
                    this.addField(obj, "packing", "PackRequested", f);
                    this.addField(obj, "cuttingQty", "CuttingQty", f);
                    this.addField(obj, "mon", "CuttingQtyMon", f);
                    this.addField(obj, "tue", "CuttingQtyTue", f);
                    this.addField(obj, "wed", "CuttingQtyWed", f);
                    this.addField(obj, "thu", "CuttingQtyThur", f);
                    this.addField(obj, "fri", "CuttingQtyFri", f);
                    this.addField(obj, "sat", "CuttingQtySat", f);
                    this.addField(obj, "sun", "CuttingQtySun", f);
                    this.addField(obj, "bagSelect", "PackingSel", f);
                    this.addField(obj, "reqContract", "ContractReq", f);
                    this.addField(obj, "conItem", "ContractItemNo", f);
                    this.addField(obj, "shipToProtocol", "ShipTo", f);
                    this.addField(obj, "priceToCust", "ProtocolPrice", f);
                    this.addField(obj, "finContract", "ContractFinalized", f);
                    this.addField(obj, "delInd", "DelInstr", f);
                    this.addField(obj, "mot", "Mot", f);
                    this.addField(obj, "poNo", "PoNo", f);
                    this.addField(obj, "paymentTermsn", "PaymentTermsn", f);
                    this.addField(obj, "soCreated", "SoCreated", f);
                    this.addField(obj, "soItem", "SoItem", f);
                    this.addField(obj, "reasonRejection", "ReasonForRejection", f);
                    this.addField(obj, "conSelectionError", "ContractSelError", f);
                    this.addField(obj, "soCreationLog", "SoCreError", f);
                    this.addField(obj, "selfConsInd", "SelfConsInd", f);
                    this.addField(obj, "autoGenInd", "AutoGenInd", f);
                    this.addField(obj, "curreny", "Currency", f);
                    this.addField(obj, "protocolNo","ProtocolId",f);
                    this.addField(obj, "BacklogQty", "BackLogQty", f);
                    this.addField(obj, "backlogOrder", "BacklogOrder", f);
                    this.addField(obj, "backlogItem", "BacklogItem", f);
                    this.addField(obj, "nfebillingdate", "NFE_BILLING_DATE", f);
                    this.addField(obj, "cnpjNumber", "CNPJ_NO", f);
                    this.addField(obj, "soStatus","SO_STATUS",f)
                    //End the code.
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
