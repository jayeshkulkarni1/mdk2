sap.ui.define([
    "./BaseController",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/ui/core/Core",
    "schedulingprocess/schedulingprocess/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, UIComponent, JSONModel, MessageBox, Message, library, Core, formatter) {
        "use strict";
        var i18n;
        var MessageType = library.MessageType;
        var messageManager;
        var messages = [];
        return BaseController.extend("schedulingprocess.schedulingprocess.controller.OrderRequest", {
            formatter: formatter,
            onInit: function () {
                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                messageManager = Core.getMessageManager();
                messageManager.removeAllMessages();
                messageManager.registerObject(this.getView(), true);
                this.createMessagePopOver();
                this.getView().setModel(messageManager.getMessageModel(), "message");
                var oRouter = this.getRouter();
                oRouter.getRoute("OrderRequest").attachMatched(this._onRouteMatched, this);
                var model = new JSONModel({});
                this.getOwnerComponent().setModel(model, "tableFilterModel");

            },

            _onRouteMatched: function (oEvent) {
                var rowModel = this.getOwnerComponent().getModel("RowDetailsModel");
                var filters = [];
                var oFilter = new sap.ui.model.Filter('Week', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/Week"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('ManagerId', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/ManagerId"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Plant', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/Plant"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('CustomerId', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/CustomerId"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Material', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/Material"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('FormulaKey', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/FormulaKey"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Incoterms', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/Incoterms"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('BusinessScenario', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/BusinessScenario"));
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('ShiptoId', sap.ui.model.FilterOperator.EQ, rowModel.getProperty("/ShiptoId"));
                filters.push(oFilter);
                var oModel = this.getOwnerComponent().getModel("ScheduleModel");
                this.read("/ETS_DIGITAL_ORDSET", filters, "bindTable", oModel);
                this.contractDialog = null;
            },
            onContractChange: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                var row = oEvt.getSource().getBindingContext("TableDHModel").getObject();
                var filters = [];
                var oFilter = new sap.ui.model.Filter('Week', sap.ui.model.FilterOperator.EQ, row.Week);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('ManagerId', sap.ui.model.FilterOperator.EQ, row.ManagerId);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Plant', sap.ui.model.FilterOperator.EQ, row.Plant);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('CustomerId', sap.ui.model.FilterOperator.EQ, row.CustomerId);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Material', sap.ui.model.FilterOperator.EQ, row.Material);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('FormulaKey', sap.ui.model.FilterOperator.EQ, row.FormulaKey);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('Incoterms', sap.ui.model.FilterOperator.EQ, row.Incoterms);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('BusinessScenario', sap.ui.model.FilterOperator.EQ, row.BusinessScenario);
                filters.push(oFilter);
                var oFilter = new sap.ui.model.Filter('ShiptoId', sap.ui.model.FilterOperator.EQ, row.ShiptoId);
                filters.push(oFilter);
                this.row = row;
                var oModel = this.getOwnerComponent().getModel("SearchHelpModel");
                this.read("/ETS_CONTRACT_VHSet", filters, "bindContractSearchHelp", oModel);


            },
            onShipToChange: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                var row = oEvt.getSource().getBindingContext("TableDHModel").getObject();
                this.row = row;
                var oModel = this.getOwnerComponent().getModel("SearchHelpModel");
                this.read("/ETS_SHIPTO_VHSet", [], "bindShipToSearchHelp", oModel);


            },
            bindShipToSearchHelp: function (oData) {
                console.log("Ship To Search HElp Data", oData)
                if (!this.shipToDialog) {
                    this.createShipToDialog(oData);
                }

                if (this.shipToDialog) {
                    this.shipToDialog.then(function (cDialog) {
                        cDialog.open();
                    });
                }
            },
            bindContractSearchHelp: function (oData) {
                console.log("Contract Search HElp Data", oData)
                if (!this.contractDialog) {
                    this.createContractDialog(oData);
                }

                if (this.contractDialog) {
                    this.contractDialog.then(function (cDialog) {
                        cDialog.open();
                    });
                }
            },
            bindTable: function (oData) {
                var oModel = new JSONModel(oData);
                if (oData.results.length) {
                    // this.cellColorChange(oData.results);
                    oModel.setProperty("/DHTable", oData.results);
                    

                }
                else {
                    var rowModel = this.getOwnerComponent().getModel("RowDetailsModel");
                    var firstRecord = this.createFirstRecord(rowModel.getData())
                    //  firstRecord.index = 0;
                    oModel.setProperty("/DHTable", firstRecord)
                    // this.applySchedFilters();
                }
                oModel.setProperty("/DeleteRows", []);
                this.getView().setModel(oModel, "TableDHModel");
                this.applySchedFilters();
                // this.getView().byId("table").setVisibleRowCount(oData.results.length);
                console.log(oData);
                //this.cellColorChange();
            },

            cellColorChange: function () {
                //var rows =  this.getView().getModel("TableDHModel").getData().DHTable;
                var rows = this.getView().byId("table").getRows();
                rows.forEach(function (row, i) {
                    try {
                        var cells = row.getCells();
                        cells.forEach(function (cell) {
                            if (cell.getId().includes("amconf")) {
                                if (e.QuotaColor === "R") {
                                    cell.removeStyleClass("red");
                                    cell.addStyleClass("red");
                                }
                                if (e.QuotaColor === "G") {
                                    cell.addStyleClass("green");
                                }
                                if (e.QuotaColor === "Y") {
                                    cell.addStyleClass("yellow");
                                }
                            }
                        })

                    } catch (err) {
                        console.log(err);
                    }

                }.bind(this))
            },
            createFirstRecord: function (obj) {
                var arr = [];
                var item = {
                    "ReqId": "S4-0000000000-1-1",
                    "Week": obj.Week,
                    "ManagerId": obj.ManagerId,
                    "Plant": obj.Plant,
                    "CustomerId": obj.CustomerId,
                    "Material": obj.Material,
                    "FormulaKey": obj.FormulaKey,
                    "Incoterms": obj.Incoterms,
                    "BusinessScenario": obj.BusinessScenario,
                    "CreatedOn": new Date(),
                    "CreatedBy": sap.ushell.Container.getService("UserInfo").getId(),
                    "CreatedVia": "SAP",
                    "NfeCoopCustomer": "",
                    "CustMatnr": "",
                    "AccMngName": obj.AccMngName,
                    "NetworkPlant": obj.NetworkPlant,
                    "SoldToName": obj.SoldToName,
                    "MaterialDesc": obj.MaterialDesc,
                    "FormulaKeyDesc": obj.FormulaKeyDesc,
                    "GenPricePerunit": "0",
                    "TotPrice": "0",
                    "CustomerReqQty": "0",
                    "PrevDueQty": "0.00",
                    "AmConfQty": "0",
                    "CurrentDueQty": "0",
                    "ContractOpenQty": "0",
                    "ReqDelDat": "",
                    "ReqDelDay": "",
                    "PackRequested": "",
                    "CuttingQty": "0",
                    "CuttingQtyMon": "0",
                    "CuttingQtyTue": "0",
                    "CuttingQtyWed": "0",
                    "CuttingQtyThur": "0",
                    "CuttingQtyFri": "0",
                    "CuttingQtySat": "0",
                    "CuttingQtySun": "0",
                    "PackingSel": "",
                    "ContractReq": "",
                    "ContractItemNo": "",
                    "ShipTo": "",
                    "ProtocolPrice": "0",
                    "ContractFinalized": "",
                    "DelInstr": "",
                    "Mot": "",
                    "PoNo": "",
                    "PaymentTermsn": "",
                    "SoCreated": "",
                    "SoItem": "",
                    "ReasonForRejection": "",
                    "ContractSelError": "",
                    "SoCreError": "",
                    "NFE_BILLING_DATE": "",
                    "ProtocolId" : "",
                    "BackLogQty": "0",
                    "SelfConsInd": "",
                    "AutoGenInd": "X",
                    "ShiptoId": obj.ShiptoId,
                    "ShipToName": obj.ShipToName,
                    "CNPJ_NO": ""
                    // "QuotaColor":"R",
                    // "ConfQtyColor":"R"
                }
                arr.push(item);
                return arr;
            },
            onSelfConsumptCheckbox: function (oEvt) {
                var value = oEvt.getSource().getSelected();
                oEvt.getSource().getBindingContext("TableDHModel").getObject().SelfConsInd = value === true ? 'X' : '';
            },
            read: function (sEntity, filters, callBackFn, oModel) {

                oModel.read(sEntity, {
                    filters: filters,
                    success: function (oData) {
                        if (callBackFn) {
                            this[callBackFn](oData);
                            //this.applySchedFilters();
                        }
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (err) {
                        sap.ui.core.BusyIndicator.hide();
                    }
                });
            },
            onQuantiyChange: function (oEvt) {
                var index = oEvt.getSource().getParent().getId().slice(-1);
                var data = this.getView().getModel("TableDHModel").getData();
                var row = data.DHTable[index];
                var custQty = Number(row.CustomerReqQty);
                var prevDue = Number(row.PrevDueQty);
                var amqty = Number(row.AmConfQty);
                if (custQty > 0) {
                    var currentDue = custQty + prevDue - amqty;

                    currentDue = Number(parseFloat(currentDue).toFixed(3));
                    data.DHTable[index].CurrentDueQty = currentDue;
                }

                try {
                    var currentRowDHId = row.ReqId.split("-")[1].trim();
                    data.DHTable.forEach(function (r, i) {
                        if (index < i) {
                            //if (r.getCells()[0].getText()) {
                            var nextRowDHId = r.ReqId.split("-")[1].trim();
                            if (nextRowDHId === currentRowDHId && currentDue > 0) {
                                r.PrevDueQty = currentDue;
                                var custQty = Number(r.CustomerReqQty);
                                var amqty = Number(r.AmConfQty);
                                var newCurrentDue = custQty + currentDue - amqty;
                                // if (newCurrentDue > 0) {
                                r.CurrentDueQty = newCurrentDue;
                                currentDue = newCurrentDue;
                            }
                            // }
                        }
                    })
                } catch (err) {
                    console.log(err);
                }
            },
            onAddNewRow: function () {
                var table = this.getView().byId("table");
                var tableData = table.getModel("TableDHModel").getData().DHTable;
                var oLastRow = tableData[tableData.length - 1];
                var oNewRow = Object.assign({}, oLastRow);
                oNewRow.ReqId = "S4-0000000000-1-" + tableData.length;
                oNewRow.CreatedBy = sap.ushell.Container.getService("UserInfo").getId(),
                oNewRow.CreatedVia = "SAP",
                oNewRow.NfeCoopCustomer = "";
                oNewRow.CustomerReqQty = "0";
                oNewRow.PrevDueQty = "0";
                oNewRow.AmConfQty = "0";
                oNewRow.CurrentDueQty = "0";
                oNewRow.ContractOpenQty = "0";
                oNewRow.ReqDelDat = "";
                oNewRow.ReqDelDay = "";
                oNewRow.CuttingQty = "0";
                oNewRow.CuttingQtyMon = "0";
                oNewRow.CuttingQtyTue = "0";
                oNewRow.CuttingQtyWed = "0";
                oNewRow.CuttingQtyThur = "0";
                oNewRow.CuttingQtyFri = "0";
                oNewRow.CuttingQtySat = "0";
                oNewRow.CuttingQtySun = "0";
                oNewRow.PackingSel = "";
                oNewRow.PoNo = "";
                oNewRow.Nfebilling = "";
                oNewRow.ProtocolId = "";
                oNewRow.ContractReq = "";
                oNewRow.ContractItemNo = "";
                oNewRow.ShipTo = "";
                oNewRow.ProtocolPrice = "0";
                oNewRow.ContractFinalized = "";
                oNewRow.SoCreated = "";
                oNewRow.SoItem = "";
                oNewRow.ReasonForRejection = "";
                oNewRow.ContractSelError = "";
                oNewRow.SoCreError = "";
                oNewRow.PackRequested = "";
                oNewRow.AutoGenInd = "X";
                oNewRow.GenPricePerunit = "0";
                oNewRow.TotPrice = "0";
                oNewRow.PrevDueQty = "0";
                oNewRow.AmConfQty = "0";
                oNewRow.CurrentDueQty = "0";
                oNewRow.ContractOpenQty = "0";
                oNewRow.NFE_BILLING_DATE = "";
                oNewRow.BackLogQty ="0";
                oNewRow.CNPJ_NO = "";
                
                tableData.push(oNewRow);
                table.getModel("TableDHModel").refresh(true);

            },
            onDeleteRow: function () {
                var table = this.getView().byId("table");
                var aSelectedItems = table.getSelectedIndices()

                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("No items selected.");
                    return;
                }
                var table = this.getView().byId("table");
                var tableModel = table.getModel("TableDHModel");
                var tableData = table.getModel("TableDHModel").getData().DHTable;
                aSelectedItems = aSelectedItems.reverse();
                aSelectedItems.forEach(function (s) {
                    if (table.getRows()[s].getCells()[0].getText().includes("S4")) {
                        //delete tableData[s].__metadata;
                        var obj = {
                            "ReqId": tableData[s].ReqId,
                            "DeleIndi": "X"
                        }
                        tableModel.getProperty("/DeleteRows").push(obj);
                        tableData.splice(s, 1);

                    }
                });
                tableModel.setProperty("/DHTable", tableData);
                table.getModel("TableDHModel").refresh(true);
                table.clearSelection();
            },

            onSaveDH: function () {
                var oModel = this.getOwnerComponent().getModel("ScheduleModel");
                var tableData=this.getView().getModel("TableDHModel").getProperty("/DHTable");
                //GPT-41368 - Converting PrevDueQty and CurrentDueQty as string.
                tableData.forEach(function(row){
                  row.PrevDueQty=String(row.PrevDueQty);
                  row.CurrentDueQty=String(row.CurrentDueQty);
                })
                var payload = {
                    "COUNTER": "TEST",
                    "HEADTOITEM": [],
                    "DhHdrToReturnSet": [],
                    "DhDeleteRowNav": this.getView().getModel("TableDHModel").getProperty("/DeleteRows")
                };
                tableData.forEach(function(row){
                    payload.HEADTOITEM.push(row);
                })

                this.oDataUpdateCall(oModel, "/ETY_DHHDRSet", payload)
                    .then(function (data) {
                        if (data.DhHdrToReturnSet.results) {
                            messageManager.removeAllMessages();
                            messages = [];
                            data.DhHdrToReturnSet.results.forEach(function (m) {
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
                        this._onRouteMatched();
                    }.bind(this))
                    .catch(function (e) {
                        MessageBox.error(i18n.getText("reqerror"));
                    })

            },
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            
            addField: function (obj, field, property, f) {
                console.log(property);
                if (this.getView().byId(property).getVisible()) {
                    var value=f.getObject()[property];
                    var fieldsWithoutFormatting = ["Material","MaterialDesc","ProtocolId", "Nfebilling","NFE_BILLING_DATE","ReqDelDay","NfeCoopCustomer","PoNo","BusinessScenario","ReqId","CreatedOn","AccMngName","Item","Margin","ContractNumber","ShipTo","ShipToName","SoldToName","PaymentTermsn","SoldToId","ShipToId","NetworkPlant","FormulaKey","Incoterms","ManagerId","FormulaKeyDesc","Plant",
                    "PackingSel","ReqDelDat","SelfConsInd","DelInstr","ContractReq","ContractItemNo","SoCreated","SoItem","ContractSelError","Week","SoCreError","CNPJ_NO","ReasonForRejection"];
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

            onExport: function () {
                var table = this.getView().byId("table");
                var rows= table.getBinding('rows').getContexts(0, 999999);
                var arr = [];
                rows.forEach(function (f) {
                    var obj = {};

                    this.addField(obj, "dhReqId", "ReqId", f);
                    this.addField(obj, "created", "test", f);
                    this.addField(obj, "nfeCustomer", "NfeCoopCustomer", f);
                    this.addField(obj, "nfeBilling", "Nfebilling", f);
                    this.addField(obj, "scheduleWeek", "Week", f);
                    this.addField(obj, "accmgr", "ManagerId", f);
                    this.addField(obj, "accountMngName", "AccMngName", f);
                    this.addField(obj, "plantgrp", "NetworkPlant", f);
                    this.addField(obj, "plant", "Plant", f);
                    this.addField(obj, "soldToID", "CustomerId", f);
                    this.addField(obj, "soldToName", "SoldToName", f);
                    this.addField(obj, "matnr", "Material", f);
                    this.addField(obj, "matnrDesc", "MaterialDesc", f);
                    this.addField(obj, "formulaKey", "FormulaKey", f);
                    this.addField(obj, "formulaDesc", "FormulaKeyDesc", f);
                    this.addField(obj, "inco", "Incoterms", f);
                    this.addField(obj, "businScen", "BusinessScenario", f);
                    this.addField(obj, "custReqQty", "CustomerReqQty", f);
                    this.addField(obj, "prevDue", "PrevDueQty", f);
                    this.addField(obj, "amConQty", "AmConfQty", f);
                    this.addField(obj, "currDue", "CurrentDueQty", f);
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
                    this.addField(obj, "poNo", "PoNo", f);
                    this.addField(obj, "shipTo", "ShiptoId", f);
                    this.addField(obj, "shipToName", "ShipToName", f);
                    this.addField(obj, "paymentTermsn", "PaymentTermsn", f);
                    this.addField(obj, "selfConsInd", "SelfConsInd", f);
                    this.addField(obj, "delInd", "DelInstr", f);
                    this.addField(obj, "reqContract", "ContractReq", f);
                    this.addField(obj, "conItem", "ContractItemNo", f);
                    this.addField(obj, "shipToProtocol", "ShipTo", f);
                    this.addField(obj, "priceToCust", "ProtocolPrice", f);
                    this.addField(obj, "finContract", "ContractFinalized", f);
                    this.addField(obj, "soCreated", "SoCreated", f);
                    this.addField(obj, "soItem", "SoItem", f);
                    this.addField(obj, "conSelectionError", "ContractSelError", f);
                    this.addField(obj, "soCreationLog", "SoCreError", f);
                    this.addField(obj, "nfebillingdate", "NFE_BILLING_DATE", f);
                    this.addField(obj, "BacklogQty", "BackLogQty", f);
                //     Begin the code 
                //    Workbench TR : DA1K919630 
                //     OTC_E491 - GPT -32422 - New Column added as part of new changes  
                    this.addField(obj, "cnpjNumber", "CNPJ_NO", f);
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
