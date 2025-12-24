sap.ui.define([
    "./BaseController",
    'sap/ui/model/json/JSONModel',
    'sap/ui/comp/smartvariants/PersonalizableInfo',
    "sap/m/MessageBox",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/core/Core",
    "schedulingprocess/schedulingprocess/model/formatter",
    'sap/ui/core/Fragment'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, JSONModel, PersonalizableInfo, MessageBox, Message, library, Core, formatter, Fragment) {
        "use strict";
        var i18n;
        var MessageType = library.MessageType;
        var messageManager;
        var messages = [];
        var authModel;
        var arr = [];
        //var a,b;
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.SchedulingPtocess", {
            formatter: formatter,
            onInit: function () {

                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.getVariants();
                messageManager = Core.getMessageManager();
                messageManager.removeAllMessages();
                messageManager.registerObject(this.getView(), true);
                this.getView().setModel(messageManager.getMessageModel(), "message");
                this.createMessagePopOver();
                this.layoutData();
                var oDataModel = this.getOwnerComponent().getModel("SearchHelpModel");

                // oDataModel.read("/ETS_BUSINESS_SCENARIOSet", {
                //     success: function (data) {
                //         var businessSchModel = new JSONModel(data.results);
                //         this.getView().setModel(businessSchModel, "businessSchModel");
                //     }.bind(this),
                //     error: function () {
                //     }
                // })

                // settting business model for Business scenario formatter
                oDataModel.read("/ETS_BUSINESS_SCENARIOSet", {
                    success: function (data) {
                        var businessModel = new JSONModel(data.results);
                        this.getView().setModel(businessModel, "businessModel");
                    }.bind(this),
                    error: function () {
                    }
                })

                //setting auth model for hiding buttons
                oDataModel.read("/ETY_AUTH_CHKSet", {
                    success: function (data) {
                        authModel = new JSONModel(data.results);
                        this.getView().setModel(authModel, "authModel");
                        var authFlagArray = data.results;

                        if (authFlagArray[0].AuthFlag !== "X") {
                            this.getView().byId("plantFilter").setVisible(false);
                        }

                    }.bind(this),
                    error: function (error) {
                        console.log(error)
                    }
                })


                this.read("/ETY_SCH_WEEKSet", [], "createSingleWeekDialog", oDataModel);
                this.read("/ETS_ACCMANAGER_VH", [], "createAccManagerDialog", oDataModel);
                this.read("/ETS_PLANT_VH", [], "createPlantDialog", oDataModel);
                this.read("/ETS_PLANT_GRP", [], "createPlantGroupDialog", oDataModel);
                this.read("/ETS_FORMULA_KEY", [], "createFormulaKeyDialog", oDataModel);
                this.read("/ETS_CUSTOMER_VH", [], "createCustomerDialog", oDataModel);
                this.read("/ETS_MATERIAL_VH", [], "createMaterialDialog", oDataModel);
                this.getVariants();
                var oRouter = this.getRouter();
                oRouter.getRoute("RouteSchedulingPtocess").attachMatched(this._onRouteMatched, this);

                // custom method for getWeek()
                Date.prototype.getWeek = function () {
                    var date = new Date(this.getTime());
                    date.setHours(0, 0, 0, 0);
                    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
                    var yearStart = new Date(date.getFullYear(), 0, 1);
                    var weekNumber = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
                    return weekNumber;
                };

                var model = new JSONModel({});
                this.getOwnerComponent().setModel(model, "tableFilterModel");
            },
            _onRouteMatched: function (oEvent) {
                this.onSearch(false, true);
            },
            //Begin the code.
            //PCN#419 -OTC_E491 : Adding validation for MosSchdQty field
            //Work Bench TR - DA1K923658
            onMosQtyEntry: function (oEvent) {
                var oSelectedMosQty = Number(oEvent.getSource().getBinding("value").getContext().getProperty("MosSchdQty"));
                var oSelectedAvlSchdQty = Number(oEvent.getSource().getBinding("value").getContext().getProperty("AvlSchdQty"));
                var oInputField = oEvent.getSource();
                var oSave = this.getView().byId("SaveButton");
                if (oSelectedAvlSchdQty < oSelectedMosQty) {
                    MessageBox.error(i18n.getText("mosQtyerror"));
                    oInputField.setValueState("Error");
                    oInputField.setValue(0.00);
                    oSave.setEnabled(false);
                } else {
                    oInputField.setValueState("None");
                    oSave.setEnabled(true);
                }
            },
            //End the code.
            onSave: function () {
                var oModel = this.getOwnerComponent().getModel("ScheduleModel");
                var logTable = this.getView().getModel("TableScheduleModel").getProperty("/LogTable/results");
                var scheduleTable = this.getView().getModel("TableScheduleModel").getProperty("/ScheduleTable/results");
                var marginPayload = "0.000";
                if (this.getView().byId("marginInput").getValue().length > 0) {
                    marginPayload = this.getView().byId("marginInput").getValue();
                }
                var payload = {
                    "Action": "SAVE",
                    "Week": "",
                    "ManagerId": "",
                    "Plant": "",
                    "CustomerId": "",
                    "Material": "",
                    "FormulaKey": "",
                    "Incoterms": "",
                    "Margin": marginPayload,
                    "BusinessScenario": "",
                    "NetworkPlant": "",
                    "HeadToScheduleLogSet": logTable,
                    "HeadToScheduleSet": scheduleTable,
                    "HeadToReturnSet": []
                };

                this.oDataUpdateCall(oModel, "/ETS_HEADERSet", payload)
                    .then(function (data) {
                        if (data.HeadToReturnSet.results) {
                            messageManager.removeAllMessages();
                            messages = [];
                            data.HeadToReturnSet.results.forEach(function (m) {
                                var type;
                                if (m.Type === "S") {
                                    type = MessageType.Success;
                                }
                                else {
                                    type = MessageType.Error
                                }
                                var oMessage = new Message({
                                    message: m.Message,
                                    type: type
                                });
                                messages.push(oMessage);
                                messageManager.addMessages(messages);
                            })

                        }
                        MessageBox.success(i18n.getText("reqProcessed"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        MessageBox.error(i18n.getText("reqerror"));
                    })
            },
            getVariants: function (aData) {
                this.applyData = this.applyData.bind(this);
                this.fetchData = this.fetchData.bind(this);
                this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
                this.oSmartVariantManagement = this.getView().byId("svm");
                this.oFilterBar = this.getView().byId("mainPagefilterbar");
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
                this.getView().setModel(this.getOwnerComponent().getModel("tableFilterModel"), "tableFilterModel");
            },
            applySchedFilters: function () {
                try {
                    var tableId = this.getView().byId("table");
                    var data = this.getView().getModel("tableFilterModel").getData();
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
            // Workbench TR : DA1K909941 
            // Begin of code for OTC_I658 - added as part of new changes

            hideWeekFields: function () {
                // setting the editable property of the MosaicQty column.

                var oData = {
                    editable: true
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "mosaicQtyColModel");

                var authModel = this.getView().getModel("authModel").oData;

                //getting instances of all buttons from table toolbar
                var viewopenContractUiTableBtn = this.getView().byId("openContractUiTable");
                var viewO9Btn = this.getView().byId("viewO9");
                var quotaDetailsBtn = this.getView().byId("quotaDetails");
                var contractSelectionBtn = this.getView().byId("contractSelection");
                var orderCreationBtn = this.getView().byId("orderCreation");
                var saveBtn = this.getView().byId("SaveButton");
                var viewsalesOrderBtn = this.getView().byId("openViewSalesOrderStatusUiTable");

                var btnArray = [viewopenContractUiTableBtn, viewO9Btn, quotaDetailsBtn, contractSelectionBtn, orderCreationBtn, saveBtn, viewsalesOrderBtn]

                var weekInput = this.getView().byId("weekInput").getTokens();
                var temp = weekInput[0].getText().split('-')[0];
                var selectedWeekNumber = temp.slice(-2);
                var currentDate = new Date();
                //Enable buttons for Execution week & Planned week
                // Begin the code Defect - GPT - 28372
                // Work Bench TR : DA1K916990 
                var weekNumber = currentDate.getWeek();

                var planningWeekNumber = weekNumber + 1;
                if (weekNumber == 56) {
                    planningWeekNumber = 1
                }

                if (selectedWeekNumber != weekNumber && selectedWeekNumber != planningWeekNumber) {

                    //changing the MosaicQty column enabled property
                    this.getView().getModel("mosaicQtyColModel").oData.editable = false;
                    this.getView().getModel("mosaicQtyColModel").refresh(true);

                    for (var i = 0; i < btnArray.length; i++) {
                        btnArray[i].setVisible(false);
                    }
                } else if (selectedWeekNumber == weekNumber || selectedWeekNumber == planningWeekNumber) {
                    if (authModel[1].AuthFlag !== "X") {
                        this.getView().byId("openContractUiTable").setVisible(false);
                    }
                    if (authModel[2].AuthFlag !== "X") {
                        this.getView().byId("viewO9").setVisible(false);
                    }
                    if (authModel[3].AuthFlag !== "X") {
                        this.getView().byId("quotaDetails").setVisible(false);
                    }
                    if (authModel[4].AuthFlag !== "X") {
                        this.getView().byId("contractSelection").setVisible(false);
                    }
                    if (authModel[5].AuthFlag !== "X") {
                        this.getView().byId("orderCreation").setVisible(false);
                    }
                   
                    this.getView().getModel("authModel").refresh(true);
                }
                // End the code Defect - GPT - 28372
                // Work Bench TR : DA1K916990 
            },

            // Workbench TR : DA1K909941 
            // End of code for OTC_I658 - added as part of new changes
            onSearch: function (param1, param2) {

                // if(!param2){
                var accMangCtrl = this.getView().byId("accMngInput");
                accMangCtrl.setValueState("None");

                if (accMangCtrl.getTokens().length === 0) {
                    accMangCtrl.setValueState("Error");
                    return;
                }
                //  }
                var weekCtrl = this.getView().byId("weekInput");
                weekCtrl.setValueState("None");
                if (weekCtrl.getTokens().length === 0) {
                    weekCtrl.setValueState("Error");
                    return;
                }
                var filters = [];
                //  Workbench TR : DA1K909941
                // Begin of code OTC_I655 New week filter  added as part of new changes  
                var weekTokens = this.getView().byId("weekInput").getTokens();
                if (weekTokens.length > 0) {
                    this.createFilters(weekTokens, filters, "Week");

                }
                //Begin the code
                //Removed validations as part of GPT -32491
                //Workbench TR : DA1K919630
                var marginInput = parseInt(this.getView().byId("marginInput").getValue());
                this.createFiltersMargin(marginInput, filters, "Margin");
                //end the code
                //end the code
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
                this.resetLayout();
                this.onLayoutChange();
                this.readTable("/ETS_HEADERSet", filters, "bindTable");
                this.hideWeekFields();

            },
            onLayoutChange: function (oEvt) {
                var selectedKeys = this.getView().byId("layout").getSelectedKeys();
                selectedKeys.forEach(function (f) {
                    try {
                        this.getView().byId(f).setVisible(true);
                    }
                    catch (err) { }
                }.bind(this))

            },
            resetLayout: function () {
                var columnsIds = this.getView().getModel("LocalModel").getData();
                columnsIds.Columns.forEach(function (f) {
                    try {
                        this.getView().byId(f.ID).setVisible(false);
                    }
                    catch (err) { }

                }.bind(this))
            },


            bindTable: function (oData) {
                try {
                    // oData.results[0].HeadToScheduleSet.results.forEach(function(row,i){
                    //     row.Index = i;
                    // })
                    var oModel = new JSONModel(oData.results[0].HeadToScheduleSet);
                    //oModel.setSizeLimit(20000);
                    this.getView().setModel(oModel, "TableScheduleModel");

                    this.getView().byId("table").setVisible(true);
                    var weekInput = this.getView().byId("weekInput").getTokens();
                    var temp = weekInput[0].getText().split('-')[0];
                    var selectedWeekNumber = temp.slice(-2);
                    var currentDate = new Date();
                    var weekNumber = currentDate.getWeek();
                    var planningWeekNumber = weekNumber + 1;
                    if (weekNumber == 56) {
                        planningWeekNumber = 1
                    }
                   
                    var authModel = this.getView().getModel("authModel").oData;
                    
                    if (selectedWeekNumber != weekNumber && selectedWeekNumber != planningWeekNumber) {
                        //set save button to false for past weeks
                        this.getView().byId("SaveButton").setVisible(false);
                    } else {
                        if (authModel[1].AuthFlag !== "X") {
                            this.getView().byId("openContractUiTable").setVisible(false);
                        }else{
                            this.getView().byId("openContractUiTable").setVisible(true);
                        }
                        if (authModel[2].AuthFlag !== "X") {
                            this.getView().byId("viewO9").setVisible(false);
                        }else{
                            this.getView().byId("viewO9").setVisible(true);
                        }
                        if (authModel[3].AuthFlag !== "X") {
                            this.getView().byId("quotaDetails").setVisible(false);
                        }else{
                            this.getView().byId("quotaDetails").setVisible(true);
                        }
                        if (authModel[4].AuthFlag !== "X") {
                            this.getView().byId("contractSelection").setVisible(false);
                        }else{
                            this.getView().byId("contractSelection").setVisible(true);
                        }
                        if (authModel[5].AuthFlag !== "X") {
                            this.getView().byId("orderCreation").setVisible(false);
                        }else{
                            this.getView().byId("orderCreation").setVisible(true);
                        }
                       
                        this.getView().getModel("authModel").refresh(true);
                        this.getView().byId("SaveButton").setVisible(true);
                    }
                    
                    console.log(oData);

                    oModel.setProperty("/ScheduleTable", oData.results[0].HeadToScheduleSet);
                    oModel.setProperty("/LogTable", oData.results[0].HeadToScheduleLogSet);

                }
                catch (err) {
                    console.log(err);
                    this.getView().byId("table").setVisible(false);
                    this.getView().byId("SaveButton").setVisible(false);
                    MessageBox.information(i18n.getText("noRecords"));
                }
            },
            readTable: function (sEntity, filters, callBackFn) {
                var oModel = this.getOwnerComponent().getModel("ScheduleModel");

                oModel.read(sEntity, {
                    filters: filters,
                    urlParameters: { "$expand": "HeadToScheduleSet,HeadToScheduleLogSet,HeadToReturnSet" },
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
            openExecuteCuttingDialog: function (oEvt) {

                var oModel = this.getOwnerComponent().getModel("ScheduleModel");
                var logTable = this.getView().getModel("TableScheduleModel").getProperty("/LogTable/results");
                var scheduleTable = this.getView().getModel("TableScheduleModel").getProperty("/ScheduleTable/results");
                var payload = {
                    "Action": "CUTTING",
                    "Week": "",
                    "ManagerId": "",
                    "Plant": "",
                    "CustomerId": "",
                    "Material": "",
                    "FormulaKey": "",
                    "Incoterms": "",
                    "BusinessScenario": "",
                    "NetworkPlant": "",
                    "HeadToScheduleLogSet": logTable,
                    "HeadToScheduleSet": scheduleTable,
                    "HeadToReturnSet": []
                };
                this.oDataUpdateCall(oModel, "/ETS_HEADERSet", payload)
                    .then(function (data) {
                        // var that =this;
                        if (data.HeadToReturnSet.results) {
                            messageManager.removeAllMessages();
                            messages = [];
                            data.HeadToReturnSet.results.forEach(function (m) {
                                var type;
                                if (m.Type === "S") {
                                    type = MessageType.Success;
                                }
                                else {
                                    type = MessageType.Error
                                }
                                var oMessage = new Message({
                                    message: m.Message,
                                    type: type
                                });
                                messages.push(oMessage);
                                messageManager.addMessages(messages);
                            })

                        }
                        MessageBox.success(i18n.getText("reqProcessed"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        MessageBox.error(i18n.getText("reqerror"));
                    })
            },
            executeCuttingLogic: function (oEvt) {
                oEvt.getSource().getParent().close();
            },
            createAutomateOrders: function (oEvt) {
                var accountMngFromId, accountMngToId;
                var oModel = this.getOwnerComponent().getModel("OrderModel");
                var table = oEvt.getSource().getParent().getContent()[0];
                table.getRows()[0].getCells()[1].setValueState("None");
                var weekNoFrom = table.getRows()[0].getCells()[1].getValue();
                var accountMangFrom = table.getRows()[1].getCells()[1].getValue().split("(")[0];
                var tableModel = this.getView().getModel("TableScheduleModel").getData().results;
                for (let i = 0; i < tableModel.length; i++) {
                    if (tableModel[i].AccMngName === accountMangFrom) {
                        accountMngFromId = tableModel[i].ManagerId;
                        break;
                    }
                }
                var plantFrom = table.getRows()[2].getCells()[1].getValue();
                var netwPlantFrom = table.getRows()[3].getCells()[1].getValue();
                var materialFrom = table.getRows()[4].getCells()[1].getValue();
                var formulaKeyFrom = table.getRows()[5].getCells()[1].getValue();
                var incotermsFrom = table.getRows()[6].getCells()[1].getValue();
                var weekNoTo = table.getRows()[0].getCells()[2].getValue();
                var accountMangTo = table.getRows()[1].getCells()[2].getValue().split("(")[0];
                for (let i = 0; i < tableModel.length; i++) {
                    if (tableModel[i].AccMngName === accountMangTo) {
                        accountMngToId = tableModel[i].ManagerId;
                        break;
                    }
                }
                var plantTo = table.getRows()[2].getCells()[2].getValue();
                var netwPlantTo = table.getRows()[3].getCells()[2].getValue();
                var materialTo = table.getRows()[4].getCells()[2].getValue();
                var formulaKeyTo = table.getRows()[5].getCells()[2].getValue();
                var incotermsTo = table.getRows()[6].getCells()[2].getValue();
                if (!weekNoFrom) {
                    table.getRows()[0].getCells()[1].setValueState("Error");
                    return;
                }
                var filters = [];
                if (weekNoFrom || weekNoTo) {
                    this.addFilter(filters, 'WeekNum', weekNoFrom, weekNoTo);
                }
                // if (groupFrom || groupTo) {
                //     this.addFilter(filters, 'Group', groupFrom, groupTo);
                // }
                if (accountMangFrom || accountMangTo) {
                    this.addFilter(filters, 'Manager', parseInt(accountMngFromId), parseInt(accountMngToId));
                }
                if (plantFrom || plantTo) {
                    this.addFilter(filters, 'Plant', plantFrom, plantTo);
                }
                if (netwPlantFrom || netwPlantTo) {
                    this.addFilter(filters, 'NetworkPlant', netwPlantFrom, netwPlantTo);
                }
                if (materialFrom || materialTo) {
                    this.addFilter(filters, 'Material', materialFrom, materialTo);
                }
                if (formulaKeyFrom || formulaKeyTo) {
                    this.addFilter(filters, 'FormulaKey', formulaKeyFrom, formulaKeyTo);
                }
                if (incotermsFrom || incotermsTo) {
                    this.addFilter(filters, 'Incoterms', incotermsFrom, incotermsTo);
                }
                sap.ui.core.BusyIndicator.show();
                oEvt.getSource().getParent().close();
                this.createOrders("/Create_SOSet", filters, oModel);
            },
            createOrders: function (sEntity, filters, oModel) {

                oModel.read(sEntity, {
                    filters: filters,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        //Begin the code.
                        //PCN#419 - OTC_E522 "Adding validation for ErrReqid field
                        //Work Bench TR - DA1K923658
                        if (oData.results[0].ErrReqid != "") {
                            MessageBox.error(i18n.getText("failedRequId") + oData.results[0].ErrReqid);
                        }
                        //End the code
                        if (oData.results[0].NoRecord === true) {
                            MessageBox.error(i18n.getText("orderCreationError1"));
                        }
                        else {
                            if (oData.results[0].SOnum !== "") {
                                MessageBox.success(i18n.getText("uSucess"));
                            } else {
                                MessageBox.error(i18n.getText("orderCreationError2"));
                            }
                        }
                    }.bind(this),
                    error: function (err) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            addFilter: function (filters, field, value1, value2) {
                var oFilter;
                if (value1 && value2) {
                    oFilter = new sap.ui.model.Filter(field, sap.ui.model.FilterOperator.BT, value1, value2);
                }
                else {
                    if (value1)
                        oFilter = new sap.ui.model.Filter(field, sap.ui.model.FilterOperator.EQ, value1);
                    else
                        oFilter = new sap.ui.model.Filter(field, sap.ui.model.FilterOperator.EQ, value2);
                }

                filters.push(oFilter);
            },
            read: function (sEntity, filters, callBackFn, oModel) {

                oModel.read(sEntity, {
                    filters: filters,
                    success: function (oData) {
                        if (callBackFn) {
                            this[callBackFn](oData);
                        }
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (err) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            orderCreationSuccess: function () {
                MessageBox.success(i18n.getText("uSucess"));
            },
            onOrderCreationPress: function () {
                var data = this.getView().getModel("TableScheduleModel").getData();
                var materials = [], Weeks = [], Managers = [], Plants = [], NetwPlants = [], FormulaKeys = [], Incoterms = [];
                data.results.forEach(function (d) {

                    var obj = {
                        value: d.Material
                    }
                    materials.push(obj);
                    var obj = {
                        value: d.Week
                    }
                    Weeks.push(obj);
                    var obj = {
                        value: d.AccMngName + "(" + d.ManagerId + ")"
                    }
                    Managers.push(obj);
                    var obj = {
                        value: d.Plant
                    }
                    Plants.push(obj);

                    var obj = {
                        value: d.NetworkPlant
                    }
                    NetwPlants.push(obj);
                    var obj = {
                        value: d.FormulaKey
                    }
                    FormulaKeys.push(obj);
                    var obj = {
                        value: d.Incoterms
                    }
                    Incoterms.push(obj);

                })
                var uniqueMaterials = materials.filter((obj, index) => {
                    return index === materials.findIndex(o => obj.value === o.value);
                });
                var uniqueWeeks = Weeks.filter((obj, index) => {
                    return index === Weeks.findIndex(o => obj.value === o.value);
                });
                var uniqueManagers = Managers.filter((obj, index) => {
                    return index === Managers.findIndex(o => obj.value === o.value);
                });
                var uniquePlants = Plants.filter((obj, index) => {
                    return index === Plants.findIndex(o => obj.value === o.value);
                });
                var uniqueNetwPlants = NetwPlants.filter((obj, index) => {
                    return index === NetwPlants.findIndex(o => obj.value === o.value);
                });
                var uniqueFormulaKeys = FormulaKeys.filter((obj, index) => {
                    return index === FormulaKeys.findIndex(o => obj.value === o.value);
                });
                var uniqueIncoterms = Incoterms.filter((obj, index) => {
                    return index === Incoterms.findIndex(o => obj.value === o.value);
                });

                console.log(materials);
                var Items = [
                    {
                        "ProductId": "Week Number *",
                        "From": "",
                        "To": "",
                        "Options": uniqueWeeks

                    },
                    // {
                    //     "ProductId": "Group",
                    //     "From": "",
                    //     "To": "",
                    //     "Options": ""

                    // },
                    {
                        "ProductId": "Account Manager",
                        "From": "",
                        "To": "",
                        "Options": uniqueManagers

                    },
                    {
                        "ProductId": "Plant",
                        "From": "",
                        "To": "",
                        "Options": uniquePlants

                    },
                    {
                        "ProductId": "Network of Plant ",
                        "From": "",
                        "To": "",
                        "Options": uniqueNetwPlants

                    },
                    {
                        "ProductId": "Material",
                        "From": "",
                        "To": "",
                        "Options": uniqueMaterials


                    },
                    {
                        "ProductId": "Formula Key",
                        "From": "",
                        "To": "",
                        "Options": uniqueFormulaKeys


                    },
                    {
                        "ProductId": "Incoterms",
                        "From": "",
                        "To": "",
                        "Options": uniqueIncoterms


                    }
                ];
                var oModel = new JSONModel();
                oModel.setProperty("/Items", Items);
                this.getView().setModel(oModel, "AutoOrderModel");

                var oView = this.getView();
                if (!this.oOCSDialog) {
                    this.oOCSDialog = this.loadFragment({
                        id: oView.getId(),
                        name: "schedulingprocess.schedulingprocess.fragments.orderCreation"
                    });

                }
                this.oOCSDialog.then(function (_oDialog) {
                    this._oDialog = _oDialog;
                    this.getView().addDependent(_oDialog);
                    this._oDialog.open();
                }.bind(this));
            },
            addField: function(obj, field, property, f) {
                console.log(property);
                if (this.getView().byId(property).getVisible()) {
                    var value = f.getObject()[property];
                    var fieldsWithoutFormatting = ["Material", "MaterialDesc", "BusinessScenario","BusProcess","Week","AccMngName", "BacklogOrderDetails", "BlockedReason", "FormulaKey", "NetworkPlant", "ManagerId", "SoCreated", "FormulaKeyDesc", "CustomerId", "Plant", "FinalizedContract"];
             
                    // Check if the property needs formatting
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
                //Begin the code 
                //Work bench TR - DA1K922201
                //Download the excel up to "999999" rows
                var rows = table.getBinding('rows').getContexts(0, 999999);
                //End the code
                var arr = [];
                rows.forEach(function (f) {
                    try {
                        var obj = {};
                        this.addField(obj, "week", "Week", f);
                        this.addField(obj, "accountMngID", "ManagerId", f);
                        this.addField(obj, "accountMngName", "AccMngName", f);
                        this.addField(obj, "netwrkOfPlant", "NetworkPlant", f);
                        this.addField(obj, "plant", "Plant", f);
                        this.addField(obj, "soldToPartyID", "CustomerId", f);
                        this.addField(obj, "soldToPrtyName", "SoldToName", f);
                        this.addField(obj, "totalAvailCredLmt", "CreditLimit", f);
                        this.addField(obj, "matnr", "Material", f);
                        this.addField(obj, "matnrDesc", "MaterialDesc", f);
                        this.addField(obj, "formulaKey", "FormulaKey", f);
                        this.addField(obj, "formulaDesc", "FormulaKeyDesc", f);
                        this.addField(obj, "incoTerm", "Incoterms", f);
                        this.addField(obj, "businScen", "BusinessScenario", f);
                        //  Begin the code 
                        // Work Bench TR : DA1K912060
                        // New changes to add table column for Business Process 
                        this.addField(obj, "busProcess", "BusProcess", f);
                        //End the code
                        this.addField(obj, "openQty", "OpenQty", f);
                        this.addField(obj, "blkQty", "BlockedQty", f);
                        this.addField(obj, "blkreason", "BlockedReason", f);
                        this.addField(obj, "expContQty", "ExpiredContractQty", f);
                        this.addField(obj, "futContQty", "FutureContractQty", f);
                        this.addField(obj, "availableToSchedule", "AvlSchdQty", f);
                        this.addField(obj, "packQty", "PackedQty", f);
                        this.addField(obj, "bulkQty", "BulkQty", f);
                        this.addField(obj, "quota", "QuotaO9", f);
                        this.addField(obj, "custReqQty", "DhCustReqQty", f);
                        this.addField(obj, "protocolQtyReq", "ProtocolQty", f);
                        // OTC_I658: Workbench TR : DA1K909941
                        // New column added as part of new changes 
                        this.addField(obj, "MosSchdQty", "MosSchdQty", f);
                        this.addField(obj, "amReqQty", "AmReqQty", f);
                        this.addField(obj, "totConQty", "TotConfirmedQty", f);
                        this.addField(obj, "bigbagscif", "TotalBigBagQty", f);
                        this.addField(obj, "smallbagscif", "TotalSmallBagQty", f);
                        this.addField(obj, "bulkcif", "TotalBulkQty", f);

                        this.addField(obj, "mon", "MonDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsMonAm", f);
                        this.addField(obj, "smallbag", "SmallBagsMonAm", f);
                        this.addField(obj, "bulk", "BulkMonAm", f);

                        this.addField(obj, "tue", "TueDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsTueAm", f);
                        this.addField(obj, "smallbag", "SmallBagsTueAm", f);
                        this.addField(obj, "bulk", "BulkTueAm", f);

                        this.addField(obj, "wed", "WedDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsWedAm", f);
                        this.addField(obj, "smallbag", "SmallBagsWedAm", f);
                        this.addField(obj, "bulk", "BulkWedAm", f);

                        this.addField(obj, "thu", "ThuDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsThuAm", f);
                        this.addField(obj, "smallbag", "SmallBagsThuAm", f);
                        this.addField(obj, "bulk", "BulkThuAm", f);

                        this.addField(obj, "fri", "FriDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsFriAm", f);
                        this.addField(obj, "smallbag", "SmallBagsFriAm", f);
                        this.addField(obj, "bulk", "BulkFriAm", f);

                        this.addField(obj, "sat", "SatDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsSatAm", f);
                        this.addField(obj, "smallbag", "SmallBagsSatAm", f);
                        this.addField(obj, "bulk", "BulkSatAm", f);

                        this.addField(obj, "sun", "SunDeliveryQtyAm", f);
                        this.addField(obj, "bigbag", "BigBagsSunAm", f);
                        this.addField(obj, "smallbag", "SmallBagsSunAm", f);
                        this.addField(obj, "bulk", "BulkSunAm", f);

                        this.addField(obj, "conQty", "WeeklyConfQtyAfterCutting", f);
                        this.addField(obj, "finContract", "FinalizedContract", f);
                        this.addField(obj, "soCreated", "SoCreated", f);
                        this.addField(obj, "backlogOrder", "BacklogOrderDetails", f);

                        arr.push(obj)
                    } catch (error) {

                    }

                }.bind(this))

                // Convert JSON to Excel workbook using sheetJs
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(arr);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                // Save the workbook as an Excel file
                XLSX.writeFile(workbook, "data.xlsx");
            },
            layoutData: function () {
                var data = {
                    "Columns": [
                        {
                            "ID": "Week",
                            "Text": i18n.getText("week")
                        },
                        {
                            "ID": "ManagerId",
                            "Text": i18n.getText("salesandDistributionDocNum")
                        },
                        {
                            "ID": "AccMngName",
                            "Text": i18n.getText("accountMngName")
                        },
                        {
                            "ID": "NetworkPlant",
                            "Text": i18n.getText("netwrkOfPlant")
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
                            "ID": "SoldToName",
                            "Text": i18n.getText("soldToPrtyName")
                        },
                        {
                            "ID": "ShiptoId",
                            "Text": i18n.getText("shipTo")
                        },
                        {
                            "ID": "ShipToName",
                            "Text": i18n.getText("shipToName")
                        },
                        {
                            "ID": "CreditLimit",
                            "Text": i18n.getText("totalAvailCredLmt")
                        },
                        {
                            "ID": "Material",
                            "Text": i18n.getText("matnr")
                        }, {
                            "ID": "MaterialDesc",
                            "Text": i18n.getText("matnrDesc")
                        },
                        {
                            "ID": "FormulaKey",
                            "Text": i18n.getText("formulaKey")
                        },
                        {
                            "ID": "FormulaKeyDesc",
                            "Text": i18n.getText("formulaDesc")
                        },
                        {
                            "ID": "Incoterms",
                            "Text": i18n.getText("incoTerm")
                        },
                        {
                            "ID": "BusinessScenario",
                            "Text": i18n.getText("businScen")
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
                            "ID": "OpenQty",
                            "Text": i18n.getText("openQty")
                        },
                        {
                            "ID": "BlockedQty",
                            "Text": i18n.getText("blkQty")
                        },
                        {
                            "ID": "BlockedReason",
                            "Text": i18n.getText("blkreason")
                        },
                        {
                            "ID": "ExpiredContractQty",
                            "Text": i18n.getText("expContQty")
                        },
                        {
                            "ID": "FutureContractQty",
                            "Text": i18n.getText("futContQty")
                        },
                        {
                            "ID": "AvlSchdQty",
                            "Text": i18n.getText("availableToSchedule")
                        },
                        {
                            "ID": "PackedQty",
                            "Text": i18n.getText("packQty")
                        },
                        {
                            "ID": "BulkQty",
                            "Text": i18n.getText("bulkQty")
                        },
                        {
                            "ID": "QuotaO9",
                            "Text": i18n.getText("quota")
                        },
                        {
                            "ID": "DhCustReqQty",
                            "Text": i18n.getText("custReqQty")
                        },
                        {
                            "ID": "ProtocolQty",
                            "Text": i18n.getText("protocolQtyReq")
                        },
                        //  OTC_I658: Workbench TR : DA1K909941
                        // New line item  added as part of new changes 
                        {
                            "ID": "MosSchdQty",
                            "Text": i18n.getText("mosaicSchedQty")
                        },

                        {
                            "ID": "AmReqQty",
                            "Text": i18n.getText("amReqQty")
                        },
                        {
                            "ID": "TotConfirmedQty",
                            "Text": i18n.getText("totConQty")
                        },
                        {
                            "ID": "TotalBigBagQty",
                            "Text": i18n.getText("bigbagscif")
                        },

                        {
                            "ID": "TotalSmallBagQty",
                            "Text": i18n.getText("smallbagscif")
                        },
                        {
                            "ID": "TotalBulkQty",
                            "Text": i18n.getText("bulkcif")
                        },
                        {
                            "ID": "MonDeliveryQtyAm",
                            "Text": i18n.getText("mon")
                        },
                        {
                            "ID": "BigBagsMonAm",
                            "Text": i18n.getText("bigbag")
                        },
                        {
                            "ID": "SmallBagsMonAm",
                            "Text": i18n.getText("smallbag")
                        },
                        {
                            "ID": "BulkMonAm",
                            "Text": i18n.getText("bulk")
                        },
                        {
                            "ID": "TueDeliveryQtyAm",
                            "Text": i18n.getText("tue")
                        },
                        {
                            "ID": "BigBagsTueAm",
                            "Text": i18n.getText("bigbag")
                        },
                        {
                            "ID": "SmallBagsTueAm",
                            "Text": i18n.getText("smallbag")
                        },
                        {
                            "ID": "BulkTueAm",
                            "Text": i18n.getText("bulk")
                        },
                        {
                            "ID": "WedDeliveryQtyAm",
                            "Text": i18n.getText("wed")
                        },
                        {
                            "ID": "BigBagsWedAm",
                            "Text": i18n.getText("bigbag")
                        },
                        {
                            "ID": "SmallBagsWedAm",
                            "Text": i18n.getText("smallbag")
                        },
                        {
                            "ID": "BulkWedAm",
                            "Text": i18n.getText("bulk")
                        },
                        {
                            "ID": "ThuDeliveryQtyAm",
                            "Text": i18n.getText("thu")
                        },
                        {
                            "ID": "BigBagsThuAm",
                            "Text": i18n.getText("bigbag")
                        },

                        {
                            "ID": "SmallBagsThuAm",
                            "Text": i18n.getText("smallbag")
                        }, {
                            "ID": "BulkThuAm",
                            "Text": i18n.getText("bulk")
                        }, {
                            "ID": "FriDeliveryQtyAm",
                            "Text": i18n.getText("fri")
                        }, {
                            "ID": "BigBagsFriAm",
                            "Text": i18n.getText("bigbag")
                        }, {
                            "ID": "SmallBagsFriAm",
                            "Text": i18n.getText("smallbag")
                        }, {
                            "ID": "BulkFriAm",
                            "Text": i18n.getText("bulk")
                        }, {
                            "ID": "SatDeliveryQtyAm",
                            "Text": i18n.getText("sat")
                        }, {
                            "ID": "BigBagsSatAm",
                            "Text": i18n.getText("bigbag")
                        }, {
                            "ID": "SmallBagsSatAm",
                            "Text": i18n.getText("smallbag")
                        }, {
                            "ID": "BulkSatAm",
                            "Text": i18n.getText("bulk")
                        }, {
                            "ID": "SunDeliveryQtyAm",
                            "Text": i18n.getText("sun")
                        }, {
                            "ID": "BigBagsSunAm",
                            "Text": i18n.getText("bigbag")
                        }, {
                            "ID": "SmallBagsSunAm",
                            "Text": i18n.getText("smallbag")
                        }, {
                            "ID": "BulkSunAm",
                            "Text": i18n.getText("bulk")
                        },
                        {
                            "ID": "WeeklyConfQtyAfterCutting",
                            "Text": i18n.getText("conQty")
                        },

                        {
                            "ID": "FinalizedContract",
                            "Text": i18n.getText("finContract")
                        }, {
                            "ID": "SoCreated",
                            "Text": i18n.getText("soCreated")
                        },
                        {
                            "ID": "BacklogOrderDetails",
                            "Text": i18n.getText("backlogOrder")
                        }
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


            onBlockedQtyPress: function (oEvt) {
                var object = oEvt.getSource().getBindingContext('TableScheduleModel').getObject();
                var filters = [];
                var oFilter = new sap.ui.model.Filter('Week', sap.ui.model.FilterOperator.EQ, object.Week);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('ManagerId', sap.ui.model.FilterOperator.EQ, object.ManagerId);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Plant', sap.ui.model.FilterOperator.EQ, object.Plant);
                filters.push(oFilter);
                // var oFilter = new sap.ui.model.Filter('CustomerId', sap.ui.model.FilterOperator.EQ, object.CustomerId);
                // filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Material', sap.ui.model.FilterOperator.EQ, object.Material);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('FormulaKey', sap.ui.model.FilterOperator.EQ, object.FormulaKey);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Incoterms', sap.ui.model.FilterOperator.EQ, object.Incoterms);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('BusinessScenario', sap.ui.model.FilterOperator.EQ, object.BusinessScenario);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('ShiptoId', sap.ui.model.FilterOperator.EQ, object.ShiptoId);
                filters.push(oFilter);

                var oModel = this.getOwnerComponent().getModel("ScheduleModel");
                this.read("/ETS_BLOCK_CONTRACTSet", filters, "bindBlockedDialog", oModel);

            },

            bindBlockedDialog: function (oData) {
                var model = new JSONModel(oData);
                this.getView().setModel(model, "blockedModel");

                console.log(oData);
                if (!this.oOCDialog) {
                    this.oOCDialog = this.loadFragment({
                        id: this.getView().getId(),
                        name: "schedulingprocess.schedulingprocess.fragments.blockedQty",
                        controller: this,
                    });

                }
                this.oOCDialog.then(function (_oDialog) {
                    this._oDialog = _oDialog;
                    this.getView().addDependent(_oDialog);
                    this._oDialog.open();
                }.bind(this));

            },
            onCancelPress: function () {
                this._oOCDialog.then(function (oDialog) {
                    oDialog.close();
                });
            },

            //handling cross app navigation for Display contracts
            onContractNoCrossApp: function (oEvt) {

                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "SalesContract",
                        action: "display"
                    }

                })) || "";

                var url = window.location.href.split('#')[0] + hash;
                sap.m.URLHelper.redirect(url, true);

            },
        });
    });
