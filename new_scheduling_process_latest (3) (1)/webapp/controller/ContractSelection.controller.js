sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/core/Core"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox, Message, library, Core) {
        "use strict";
        var i18n;
        var MessageType = library.MessageType;
        var messageManager;
        var messages = [];
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.ContractSelection", {
            onInit: function () {
                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                messageManager = Core.getMessageManager();
                messageManager.removeAllMessages();
                messageManager.registerObject(this.getView(), true);
                this.createMessagePopOver();
                this.getView().setModel(messageManager.getMessageModel(), "message");
                var oDataModel = this.getOwnerComponent().getModel("SearchHelpModel");
                var oRouter = this.getRouter();
                oRouter.getRoute("ContractSelection").attachMatched(this._onRouteMatched, this);
                
                // var filters = [];


                // var weekSelection = sap.ui.getCore().getModel("weekSelectionModel").getData().week;
                // if (weekSelection[0].getText()[0] == "E"){
                //     var oFilter = new sap.ui.model.Filter('Current_Week', sap.ui.model.FilterOperator.EQ, true, 'E');
                // }else{
                //     var oFilter = new sap.ui.model.Filter('Current_Week', sap.ui.model.FilterOperator.EQ, true,'P');
                // }
                // filters.push(oFilter);
                

                
            },
            _onRouteMatched: function(){
                var oDataModel = this.getOwnerComponent().getModel("SearchHelpModel");
                this.read("/ETY_O9_WEEKSet", [], "createWeekDialogSendDataO9", oDataModel);
                this.read("/ETS_ACCMANAGER_VH", [], "createAccManagerDialog", oDataModel);
                this.read("/ETS_PLANT_VH", [], "createPlantDialog", oDataModel);
                this.read("/ETS_PLANT_GRP", [], "createPlantGroupDialog", oDataModel);
                this.read("/ETS_FORMULA_KEY", [], "createFormulaKeyDialog", oDataModel);
                this.read("/ETS_CUSTOMER_VH", [], "createCustomerDialog", oDataModel);
                this.read("/ETS_MATERIAL_VH", [], "createMaterialDialog", oDataModel);
                this.read("/ets_incoterm", [], "createIncotermDialog", oDataModel);
            },
            // onAfterRendering: function(){
            //     var oDataModel = this.getOwnerComponent().getModel("SearchHelpModel");
            //     this.read("/ETY_O9_WEEKSet", [], "createWeekDialogSendDataO9", oDataModel);
            //     this.read("/ETS_ACCMANAGER_VH", [], "createAccManagerDialog", oDataModel);
            //     this.read("/ETS_PLANT_VH", [], "createPlantDialog", oDataModel);
            //     this.read("/ETS_PLANT_GRP", [], "createPlantGroupDialog", oDataModel);
            //     this.read("/ETS_FORMULA_KEY", [], "createFormulaKeyDialog", oDataModel);
            //     this.read("/ETS_CUSTOMER_VH", [], "createCustomerDialog", oDataModel);
            //     this.read("/ETS_MATERIAL_VH", [], "createMaterialDialog", oDataModel);
            //     this.read("/ets_incoterm", [], "createIncotermDialog", oDataModel);      
            // },
            read: function (sEntity, filters, callBackFn) {
                var oModel = this.getOwnerComponent().getModel("QuotaModel");
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
            combobox1Select: function (evt) {
                var combobox1 = this.getView().byId("p1");
                if (combobox1.getSelectedItem() !== null) {
                    var selectedItem = combobox1.getSelectedItem().getText();
                    if (selectedItem === "FIFO") {
                        var combobox2LIFO = this.getView().byId("p2").getItemByKey("lifo");
                        combobox2LIFO.setEnabled(false);
                        var combobox2FIFO = this.getView().byId("p2").getItemByKey("fifo");
                        combobox2FIFO.setEnabled(false);
                    } else if (selectedItem === "LIFO") {
                        var combobox2FIFO = this.getView().byId("p2").getItemByKey("fifo");
                        combobox2FIFO.setEnabled(false);
                        this.getView().byId("p2").getItemByKey("lifo").setEnabled(false);
                    } else if (selectedItem === "Margin") {
                        this.getView().byId("p2").getItemByKey("margin").setEnabled(false);
                    }
                } else {
                    this.getView().byId("p2").getItemByKey("lifo").setEnabled(true);
                    this.getView().byId("p2").getItemByKey("fifo").setEnabled(true);
                    this.getView().byId("p2").getItemByKey("margin").setEnabled(true);
                }
            },
            combobox2Select: function (evt) {
                var combobox2 = this.getView().byId("p2");
                if (combobox2.getSelectedItem() !== null) {
                    var selectedItem = combobox2.getSelectedItem().getText();
                    if (selectedItem === "FIFO") {
                        this.getView().byId("p1").getItemByKey("lifo").setEnabled(false);
                        this.getView().byId("p1").getItemByKey("fifo").setEnabled(false);

                    } else if (selectedItem === "LIFO") {
                        this.getView().byId("p1").getItemByKey("fifo").setEnabled(false);
                        this.getView().byId("p1").getItemByKey("lifo").setEnabled(false);

                    } else if (selectedItem === "Margin") {
                        this.getView().byId("p1").getItemByKey("margin").setEnabled(false);
                    }
                } else {
                    this.getView().byId("p1").getItemByKey("lifo").setEnabled(true);
                    this.getView().byId("p1").getItemByKey("fifo").setEnabled(true);
                    this.getView().byId("p1").getItemByKey("margin").setEnabled(true);
                }
            },


            onp1Select: function (evt) {
                this.combobox1Select(evt);
            },
            onp2Select: function (evt) {
                this.combobox2Select(evt);
            },

            onSubmit: function () {
                var weekCtrl = this.getView().byId("weekInput");
                weekCtrl.setValueState("None");
                this.getView().byId("errorMsgStrip").setVisible(false);
                if (weekCtrl.getTokens().length === 0) {
                    weekCtrl.setValueState("Error");
                    this.getView().byId("errorMsgStrip").setVisible(true);
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

                var materialTokens = this.getView().byId("materialInput").getTokens();
                if (materialTokens.length > 0) {
                    this.createFilters(materialTokens, filters, "Material");
                }
                var formulaKeyTokens = this.getView().byId("formulaKeyInput").getTokens();
                if (formulaKeyTokens.length > 0) {
                    this.createFilters(formulaKeyTokens, filters, "FormulaKey");
                }
                var incotermsTokens = this.getView().byId("incotermsInput").getTokens();
                if (incotermsTokens.length > 0) {
                    this.createFilters(incotermsTokens, filters, "Incoterms");
                }
                var weekTokens = this.getView().byId("weekInput").getTokens();
                if (weekTokens.length > 0) {
                    this.createFilters(weekTokens, filters, "Week");

                }
                var priority1 = this.getView().byId("p1").getValue();
                if (priority1) {
                    var oFilter = new sap.ui.model.Filter('Priority1', sap.ui.model.FilterOperator.EQ, priority1);
                    filters.push(oFilter);
                }
                var priority2 = this.getView().byId("p2").getValue();
                if (priority2) {
                    var oFilter = new sap.ui.model.Filter('Priority2', sap.ui.model.FilterOperator.EQ, priority2);
                    filters.push(oFilter);
                }
                var checkbox1 = this.getView().byId("expiredContractCheckBox").getSelected();
                if (checkbox1) {
                    var oFilter = new sap.ui.model.Filter('Incl_Expired', sap.ui.model.FilterOperator.EQ, checkbox1);
                    filters.push(oFilter);
                }
                var checkbox2 = this.getView().byId("futureContractCheckBox").getSelected();
                if (checkbox2) {
                    var oFilter = new sap.ui.model.Filter('Incl_Future', sap.ui.model.FilterOperator.EQ, checkbox2);
                    filters.push(oFilter);
                }
                this.submitOData("/ETS_HEADERSet", filters, "submitSuccess");
            },
            submitOData: function (sEntity, filters, callBackFn) {
                var oModel = this.getOwnerComponent().getModel("ContractSelectionModel");

                oModel.read(sEntity, {
                    filters: filters,
                    urlParameters: { "$expand": "HeadToReturnSet" },
                    success: function (oData) {
                        if (callBackFn) {
                            this[callBackFn](oData);
                        }
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (err) {
                        sap.ui.core.BusyIndicator.hide();

                        MessageBox.error(i18n.getText("techError"));
                    }
                });
            },
            submitSuccess: function (data) {
                if (data.results[0].HeadToReturnSet.results) {
                    messageManager.removeAllMessages();
                    messages = [];
                    data.results[0].HeadToReturnSet.results.forEach(function (m) {
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
                    }.bind(this))

                }
                MessageBox.success(i18n.getText("reqProcessed"));
            }




        });
    });
