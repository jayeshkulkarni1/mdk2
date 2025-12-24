sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/SearchField',
    'sap/ui/model/type/String',
    'sap/ui/table/Column',
    'sap/ui/comp/smartvariants/PersonalizableInfo',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/m/MessageBox",
    "fdpdashboard/model/formatter",
    "sap/ui/core/UIComponent",
    'sap/m/TablePersoController',
    './DemoPersoService',
    'sap/m/library',
    'sap/m/p13n/MetadataHelper',
    'sap/m/p13n/Engine',
    'sap/m/p13n/SelectionController',
	'sap/m/p13n/SortController',
	'sap/m/p13n/GroupController'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, SearchField, TypeString, UIColumn, PersonalizableInfo, Filter, FilterOperator,  MessageBox, formatter, UIComponent, TablePersoController, DemoPersoService, mlibrary, MetadataHelper, Engine, SelectionController, SortController, GroupController) {
        "use strict";
        var i18n;
        var ResetAllMode = mlibrary.ResetAllMode;
        return Controller.extend("fdpdashboard.controller.Dashboard", {
            formatter: formatter,
            onInit: function () {
                // var oData = {
                //     results: [
                //         { SalesOrder: "10000000", salesOrderItem: "001", salesOrg: "D", size: "1.75", city: "Walldorf" },
                //         { SalesOrder: "10000001", salesOrderItem: "001", salesOrg: "D", size: "1.85", city: "Walldorf" },
                //         { SalesOrder: "10000002", salesOrderItem: "001", salesOrg: "D", size: "1.95", city: "Walldorf" },
                //         { SalesOrder: "10000003", salesOrderItem: "001", salesOrg: "D", size: "1.65", city: "Walldorf" },
                //         { SalesOrder: "10000004", salesOrderItem: "001", salesOrg: "D", size: "1.55", city: "Walldorf" }
                //     ]
                // };
                // var oModel = new JSONModel(oData);
                // this.getView().setModel(oModel, "TableDataModel");


                // init and activate controller
                // var oThis =this;
                // this._oTPC = new TablePersoController({
                // table: oThis.getView().byId("table"),
                // //specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
                // componentName: "demoApp",
                // resetAllMode: ResetAllMode.ServiceReset,
                // persoService: DemoPersoService
                //     }).activate();
                //  this._registerForP13n();
                i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.getVariants();
                this.filters();
                this.read("/BusinessScenarioSet", [], "bindBusinessScenerionBox");
                this.read("/SalesOrgSet", [], "createSaleOrgDialog");
                this.read("/OrderTypeSet", [], "createOrderTypeDialog");
                this.read("/DivisionSet", [], "divisionDialog");
                this.read("/Sold_ToSet", [], "createSoldToDialog");
                this.read("/Ship_ToSet", [], "createShipToDialog");
                this.read("/Sales_OrderSet", [], "createSalesOrderDialog");
                this.read("/ContractSet", [], "createContractDialog");
                this.read("/Customer_PoSet", [], "createCustomerPODialog");
                this.read("/PlantSet", [], "createPlantDialog");
                this.read("/SalesOfficeSet", [], "createSalesOfficeDialog");
                this.read("/SalesGroupSet", [], "createSalesGroupDialog");
                this.layoutData();
               
                this.defaultTokens();
               // this._registerForP13n();
                
            },
        //     _registerForP13n: function() {
        //     var oTable = this.byId("table");

		// 	this.oMetadataHelper = new MetadataHelper([
		// 		{key: "SalesOrder", label: "Sales Order", path: "SalesOrder"},
		// 		{key: "SalesOrderItem", label: "Sales Order Item", path: "SalesOrderItem"}
		// 	]);

        //     Engine.register(oTable, {
		// 		helper: this.oMetadataHelper,
		// 		controller: {
		// 			Columns: new SelectionController({
		// 				targetAggregation: "columns",
		// 				control: oTable
		// 			}),
		// 			Sorter: new SortController({
		// 				control: oTable
		// 			}),
		// 			Groups: new GroupController({
		// 				control: oTable
		// 			})
		// 		}
		// 	});

		// 	Engine.attachStateChange(this.handleStateChange.bind(this));
		// },
        // handleStateChange: function(oEvt) {
		// 	var oTable = this.byId("table");
		// 	var oState = oEvt.getParameter("state");

		// 	oTable.getColumns().forEach(function(oColumn){
		// 		oColumn.setVisible(false);
		// 		oColumn.setSorted(false);
		// 	});

		// 	oState.Columns.forEach(function(oProp, iIndex){
		// 		var oCol = this.byId(oProp.key);
		// 		oCol.setVisible(true);

		// 		oTable.removeColumn(oCol);
		// 		oTable.insertColumn(oCol, iIndex);
		// 	}.bind(this));

		// 	var aSorter = [];
		// 	oState.Sorter.forEach(function(oSorter) {
		// 		var oColumn = this.byId(oSorter.key);
		// 		oColumn.setSorted(true);
		// 		oColumn.setSortOrder(oSorter.descending ? tableLibrary.SortOrder.Descending : tableLibrary.SortOrder.Ascending);
		// 		aSorter.push(new Sorter(this.oMetadataHelper.getProperty(oSorter.key).path, oSorter.descending));
		// 	}.bind(this));
		// 	oTable.getBinding("rows").sort(aSorter);
		// },

		// openPersoDialog: function(oEvt) {
		// 	var oTable = this.byId("table");

		// 	Engine.show(oTable, ["Columns", "Sorter", "Groups"], {
		// 		contentHeight: "35rem",
		// 		contentWidth: "32rem",
		// 		source: oEvt.getSource()
		// 	});
		// },

            defaultTokens: function () {
                this.getView().byId("orderTypeInput").addToken(new sap.m.Token({
                    key: "ZOR",
                    text: "Standard Sales Order"
                }));
            },
            // onPersoButtonPressed: function (oEvent) {
            //     this._oTPC.openDialog();
            // },

            // onTablePersoRefresh: function () {
            //     DemoPersoService.resetPersData().done(
            //         function () {
            //             this._oTPC.refresh();
            //         }.bind(this)
            //     );
            // },

            // onTableGrouping: function (oEvent) {
            //     this._oTPC.setHasGrouping(oEvent.getSource().getSelected());
            // },
            onDetailsPress: function (oEvt) {
                var object = oEvt.getSource().getBindingContext('TableDataModel').getObject();
                console.log(object);
                var model = new JSONModel(object);
                this.getOwnerComponent().setModel(model, "DetailModel");
                this.getRouter().navTo("Detail");
            },
            getRouter: function () {
                return UIComponent.getRouterFor(this);
            },
            filters: function () {
                var filters = [{
                    "SalesOrg": "",
                    "OrderCreateDateFrom": null,
                    "OrderCreateDateTo": null,
                    "OrderType": "",
                    "SalesOffice": "",
                    "SalesGroup": "",
                    "Division": "",
                    "SoldTo": "",
                    "ShipTo": "",
                    "SalesOrder": "",
                    "CallByDate": null,
                    "Contract": "",
                    "CustomerPO": "",
                    "ExSpaceIndictor": "",
                    "Plant": "",
                    "BusScenerio": "",
                    "PricedDate": null
                }];
                var fModel = new JSONModel(filters[0]);
                this.getOwnerComponent().setModel(fModel, "FiltersModel");
            },
            read: function (sEntity, filters, callBackFn) {
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
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
            onExport: function (oEvent) {

                var table = this.getView().byId("table");
                var rows = table.getBinding("rows").getContexts();
                var arr = [];
                rows.forEach(function (f) {
                    var obj = {};
                    this.addField(obj, "salesOrder", "SalesOrder", f);
                    this.addField(obj, "salesOrderItem", "SalesOrderItem", f);
                    this.addField(obj, "salesOrg", "SalesOrg", f);
                    this.addField(obj, "salesOrgName", "SalesOrgName", f);
                    this.addField(obj, "division", "Division", f);
                    this.addField(obj, "divisionName", "DivisionName", f);
                    this.addField(obj, "distributionChannel", "DistributionChannel", f);
                    this.addField(obj, "distributionChannelName", "DistributionChannelName", f);
                    this.addField(obj, "orderType", "OrderType", f);
                    this.addField(obj, "orderCreatDate", "OrderCreateDate", f);
                    this.addField(obj, "soldTo", "SoldTo", f);
                    this.addField(obj, "soldToName", "SoldToName", f);
                    this.addField(obj, "shipTo", "ShipTo", f);
                    this.addField(obj, "shipToName", "ShipToName", f);
                    this.addField(obj, "shipToCity", "ShipToCity", f);
                    this.addField(obj, "shipToRegion", "ShipToRegion", f);
                    this.addField(obj, "orderQty", "SalesOrderQty", f);
                    this.addField(obj, "unit", "Unit", f);
                    this.addField(obj, "matnr", "Material", f);
                    this.addField(obj, "materialDesc", "MaterialDesc", f);
                    this.addField(obj, "currency", "Currency", f);
                    this.addField(obj, "plant", "DelvPlant", f);
                    this.addField(obj, "customerPo", "CustomerPo", f);
                    this.addField(obj, "callByDate", "CallByDate", f);
                    this.addField(obj, "exSpaceInd", "ExSpace", f);
                    this.addField(obj, "message", "Message", f);
                    this.addField(obj, "configQty", "ConfirmedQty", f);
                    this.addField(obj, "customerPoItem", "CustomerPoItem", f);
                    this.addField(obj, "srvRendDate", "SrvRendDate", f);
                    this.addField(obj, "fpdStatus", "FpdStatus", f);
                    this.addField(obj, "fpdFinalPrice", "FpdFinalPrice", f);
                    this.addField(obj, "nonNegoPrice", "Finalprice_Pricefx", f); 
                    this.addField(obj, "salesOrderStock", "SalesOrderStock", f);
                    this.addField(obj, "sto", "Sto", f);
                    this.addField(obj, "stoItem", "StoItem", f);
                    this.addField(obj, "stoDelv", "StoDelv", f);
                    this.addField(obj, "stoDelvItem", "StoDelvItem", f);
                    this.addField(obj, "contract", "Contract", f);
                    this.addField(obj, "contractType", "ContractType", f);
                    this.addField(obj, "contractValidFrom", "ContractValidFrom", f);
                    this.addField(obj, "contractValidTo", "ContractValidTo", f);
                    this.addField(obj, "contractItem", "ContractItem", f);
                    this.addField(obj, "salesOffice", "SalesOffice", f);
                    this.addField(obj, "salesOfficeDesc", "SalesOfficeDesc", f);
                    this.addField(obj, "salesGroup", "SalesGroup", f);
                    this.addField(obj, "salesGroupName", "SalesGroupDesc", f);
                    this.addField(obj, "salesDistrict", "SalesDistrict", f);
                    this.addField(obj, "salesDistrictDesc", "SalesDistrictDesc", f);
                    this.addField(obj, "reqDelvDate", "ReqDelvDate", f);
                    this.addField(obj, "priceDate", "PricedDate", f);
                    this.addField(obj, "csrNumber", "CsrNumber", f);
                    this.addField(obj, "csrName", "CsrName", f);
                    this.addField(obj, "inco1", "Inco1", f);
                    this.addField(obj, "inco2", "Inco2", f);
                    this.addField(obj, "paymentTerms", "PaymentTerms", f);
                    this.addField(obj, "paymentTermsDesc", "PaymentTermsDesc", f);
                    this.addField(obj, "shipConditions", "ShipConditions", f);
                    this.addField(obj, "shipConditionsDesc", "ShipConditionsDesc", f);
                    this.addField(obj, "bpAgreement", "BpAgreement", f);
                    arr.push(obj)
                }.bind(this))

                // Convert JSON to Excel workbook using sheetJs
                var workbook = XLSX.utils.book_new();
                var worksheet = XLSX.utils.json_to_sheet(arr);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
                // Save the workbook as an Excel file
                XLSX.writeFile(workbook, "data.xlsx");

            },
            addField: function (obj, field, property, f) {
                if (this.getView().byId(property).getVisible()) {
                    obj[i18n.getText(field)] = f.getObject()[property];
                }
            },
            // createColumnConfig: function () {
            //     var aCols = [];

            //     aCols.push({
            //         property: 'SalesOrder'
            //     });
            //     aCols.push({
            //         property: 'SalesOrderItem'
            //     });
            //     aCols.push({
            //         property: 'SalesOrg'
            //     });
            //     aCols.push({
            //         property: 'Division'
            //     });
            //     aCols.push({
            //         property: 'OrderType'
            //     });
            //     aCols.push({
            //         property: 'OrderCreateDate'
            //     });
            //     aCols.push({
            //         property: 'SoldTo'
            //     });
            //     aCols.push({
            //         property: 'ShipTo'
            //     });
            //     aCols.push({
            //         property: 'SalesOrderQty'
            //     });
            //     aCols.push({
            //         property: 'Material'
            //     });
            //     aCols.push({
            //         property: 'DelvPlant'
            //     });
            //     aCols.push({
            //         property: 'CsrNumber'
            //     });
            //     aCols.push({
            //         property: 'Message'
            //     });
            //     aCols.push({
            //         property: 'ConfirmedQty'
            //     });
            //     aCols.push({
            //         property: 'ExSpace'
            //     });
            //     aCols.push({
            //         property: 'FpdStatus'
            //     });
            //     aCols.push({
            //         property: 'SalesOrderStock'
            //     });
            //     aCols.push({
            //         property: 'Sto'
            //     });
            //     aCols.push({
            //         property: 'StoItem'
            //     });
            //     aCols.push({
            //         property: 'StoDelv'
            //     });
            //     aCols.push({
            //         property: 'StoDelvItem'
            //     });
            //     aCols.push({
            //         property: 'PricedDate'
            //     });
            //     return aCols;

            // },
            onSearch: function () {
                var orderCreationControl = this.getView().byId("orderCreationDate");
                orderCreationControl.setValueState("None");
                if (!orderCreationControl.getValue()) {
                    orderCreationControl.setValueState("Error");
                    return;
                }

                var filters = [];
                var filterData = this.getOwnerComponent().getModel("FiltersModel").getData();
                var salesOrgTokens = this.getView().byId("salesOrgInput").getTokens();
                if (salesOrgTokens.length > 0) {
                    this.createFilters(salesOrgTokens, filters, "SalesOrg");
                }
                var orderTypeTokens = this.getView().byId("orderTypeInput").getTokens();
                if (orderTypeTokens.length > 0) {
                    this.createFilters(orderTypeTokens, filters, "OrderType");
                }
                var salesOrderTokens = this.getView().byId("salesOrderInput").getTokens();
                if (salesOrderTokens.length > 0) {
                    this.createFilters(salesOrderTokens, filters, "SalesOrder");
                }
                var divisionTokens = this.getView().byId("divisionInput").getTokens();
                if (divisionTokens.length > 0) {
                    this.createFilters(divisionTokens, filters, "Division");
                }
                var soldToTokens = this.getView().byId("soldToInput").getTokens();
                if (soldToTokens.length > 0) {
                    this.createFilters(soldToTokens, filters, "SoldTo");
                }
                var shipToTokens = this.getView().byId("shipToInput").getTokens();
                if (shipToTokens.length > 0) {
                    this.createFilters(shipToTokens, filters, "ShipTo");
                }

                var contractTokens = this.getView().byId("contractInput").getTokens();
                if (contractTokens.length > 0) {
                    this.createFilters(contractTokens, filters, "Contract");
                }
                var customerPOTokens = this.getView().byId("customerPOInput").getTokens();
                if (customerPOTokens.length > 0) {
                    this.createFilters(customerPOTokens, filters, "CustomerPo");
                }
                var plantTokens = this.getView().byId("plantInput").getTokens();
                if (plantTokens.length > 0) {
                    this.createFilters(plantTokens, filters, "DelvPlant");
                }

                var salesOfficeTokens = this.getView().byId("salesOfficeInput").getTokens();
                if (salesOfficeTokens.length > 0) {
                    this.createFilters(salesOfficeTokens, filters, "SalesOffice");
                }
                var salesGroupTokens = this.getView().byId("salesGroupInput").getTokens();
                if (salesGroupTokens.length > 0) {
                    this.createFilters(salesGroupTokens, filters, "SalesGroup");
                }
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                var oFilter = new sap.ui.model.Filter('OrderCreateDate', sap.ui.model.FilterOperator.BT, dateFormat.format(filterData.OrderCreateDateFrom), dateFormat.format(filterData.OrderCreateDateTo));
                filters.push(oFilter);
                if (filterData.CallByDateFrom && filterData.CallByDateTo) {
                    var oFilter = new sap.ui.model.Filter('CallByDate', sap.ui.model.FilterOperator.BT, dateFormat.format(filterData.CallByDateFrom), dateFormat.format(filterData.CallByDateTo));
                    filters.push(oFilter);
                }
                if (filterData.PricedDateFrom && filterData.PricedDateTo) {
                    var oFilter = new sap.ui.model.Filter('PricedDate', sap.ui.model.FilterOperator.BT, dateFormat.format(filterData.PricedDateFrom), dateFormat.format(filterData.PricedDateTo));
                    filters.push(oFilter);
                }
                if (filterData.ExSpaceIndictor) {
                    var ex = filterData.ExSpaceIndictor === "Yes" ? 'X' : '';
                    var oFilter = new sap.ui.model.Filter('ExSpace', sap.ui.model.FilterOperator.EQ, ex);
                    filters.push(oFilter);
                }
                // var businesScenerio = this.getView().byId("busScenerioBox").getSelectedKey();
                if (filterData.BusScenerio) {
                    var oFilter = new sap.ui.model.Filter('BusinessScenario', sap.ui.model.FilterOperator.EQ, filterData.BusScenerio);
                    filters.push(oFilter);
                }
                sap.ui.core.BusyIndicator.show()
                this.read("/OrderListDetailsSet", filters, "bindTable");
                this.getView().byId("table").setVisible(true);
                //this.getView().byId("table").setSelectedIndex(-1);
                //if (flag === undefined) {
                this.resetLayout();
                this.onLayoutChange();
                //}

            },
            createFilters: function (tokens, filters, field) {
                tokens.forEach(function (e) {
                    var properties = e.data("range")
                    if (properties) {
                        if (properties.operation === "BT") {
                            var oFilter = new Filter({
                                path: properties.keyField,
                                operator: FilterOperator[properties.operation],
                                value1: properties.value1,
                                value2: properties.value2
                            });
                        }
                        else {
                            var oFilter = new Filter({
                                path: properties.keyField,
                                operator: FilterOperator[properties.operation],
                                value1: properties.value1
                            });
                        }
                        filters.push(oFilter);
                    }
                    else {
                        var oFilter = new Filter(field, FilterOperator.EQ, e.getKey());
                        filters.push(oFilter);
                    }
                })
            },
            bindTable: function (oData) {
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "TableDataModel");
                console.log(oData);
            },
            bindBusinessScenerionBox: function (oData) {
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "BSDataModel");
            },

            onMovetoStocks: function (oEvt) {
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }
                var arr = [];
                var table = this.getView().byId("table");
                selectedItems.forEach(function (s) {
                    var obj = {
                        Id: true,
                        Salesorder: table.getContextByIndex(s).getObject().SalesOrder,
                        Salesitem: table.getContextByIndex(s).getObject().SalesOrderItem
                    };
                    arr.push(obj);
                })
                var payload = {
                    "Id": true,
                    "MoveToSOSet": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/Move_To_SOSet", payload)
                    .then(function (data) {
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
            },
            onCreateSTO: function (oEvt) {
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }
                var arr = [];
                var table = this.getView().byId("table");
                selectedItems.forEach(function (s) {
                    var obj = {
                        Id: true,
                        Salesorder: table.getContextByIndex(s).getObject().SalesOrder,
                        Salesitem: table.getContextByIndex(s).getObject().SalesOrderItem
                    };
                    arr.push(obj);
                })
                var payload = {
                    "Id": true,
                    "CreatestoSet": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/Create_stoSet", payload)
                    .then(function (data) {
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
            },
            onStoDelivery: function (oEvt) {
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }
                var arr = [];
                var table = this.getView().byId("table");
                selectedItems.forEach(function (s) {
                    var obj = {
                        Id: true,
                        Salesorder: table.getContextByIndex(s).getObject().SalesOrder,
                        Salesitem: table.getContextByIndex(s).getObject().SalesOrderItem
                    };
                    arr.push(obj);
                })
                var payload = {
                    "Id": true,
                    "createstodeliverySet": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/create_sto_deliverySet", payload)
                    .then(function (data) {
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
            },
            onExecuteAllSteps: function (oEvt) {
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }
                var arr = [];
                var table = this.getView().byId("table");
                selectedItems.forEach(function (s) {
                    var obj = {
                        Id: true,
                        Salesorder: table.getContextByIndex(s).getObject().SalesOrder,
                        Salesitem: table.getContextByIndex(s).getObject().SalesOrderItem
                    };
                    arr.push(obj);
                })
                var payload = {
                    "Id": true,
                    "executeallstepsSet": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/execute_all_stepsSet", payload)
                    .then(function (data) {
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
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
                //this.getView().byId("layout").setSelectedKeys([]);
                this.getView().byId("salesOrgInput").removeAllTokens();
                this.getView().byId("orderTypeInput").removeAllTokens();
                this.getView().byId("divisionInput").removeAllTokens();
                this.getView().byId("salesOfficeInput").removeAllTokens();
                this.getView().byId("salesGroupInput").removeAllTokens();
                this.getView().byId("soldToInput").removeAllTokens();
                this.getView().byId("shipToInput").removeAllTokens();
                this.getView().byId("salesOrderInput").removeAllTokens();
                this.getView().byId("contractInput").removeAllTokens();
                this.getView().byId("customerPOInput").removeAllTokens();
                this.getView().byId("plantInput").removeAllTokens();

                // this.resetLayout();

                aData.forEach(function (oDataObject) {
                    var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                    var multiFilters = ["Sales Org", "Order Type", "Division", "Sold-To", "Ship-To", "Sales Order", "Contract", "Sales Office", "Sales Group"];
                    if (multiFilters.includes(oDataObject.fieldName)) {

                        if (oDataObject.fieldData.length) {
                            oControl.removeAllTokens();
                            oDataObject.fieldData.forEach(function (f) {
                                var otoken1 = new sap.m.Token({
                                    key: f.key,
                                    text: f.text
                                });
                                oControl.addToken(otoken1);
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

            getFiltersWithValues: function () {
                var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();
                    var multiFilters = ["Sales Org", "Order Type", "Division", "Sold-To", "Ship-To", "Sales Order", "Contract", "Sales Office", "Sales Group"];
                    if (multiFilters.includes(oFilterGroupItem.getName())) {
                        if (oControl && oControl.getTokens().length > 0) {
                            // oControl.removeAllTokens();
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
            onExit: function () {
                //  this.oModel = null;
                this.oSmartVariantManagement = null;
                // this.oExpandedLabel = null;
                // this.oSnappedLabel = null;
                this.oFilterBar = null;
                this.oTable = null;
                this._oTPC.destroy();
            },

            fetchData: function () {
                var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                    var multiFilters = ["Sales Org", "Order Type", "Division", "Sold-To", "Ship-To", "Sales Order", "Contract", "Sales Office", "Sales Group"];
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
                    } else {
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

            // _registerForP13n: function () {
            //     var oTable = this.byId("table");
            //     this.oMetadataHelper = new MetadataHelper([
            //         { key: "SalesOrder", label: "Sales Order", path: "SalesOrder" },
            //         { key: "SalesOrderItem", label: "Sales Order Item", path: "SalesOrderItem" },
            //         { key: "SalesOrg", label: "Sales Organisation", path: "SalesOrg" },
            //         { key: "ShipTo", label: "Ship- To", path: "ShipTo" },
            //         { key: "CsrNumber", label: "Customer PO #", path: "CsrNumber" },
            //         { key: "Material", label: "Material", path: "Material" },
            //         { key: "DelvPlant", label: "Plant", path: "DelvPlant" },
            //         { key: "SalesOrderQty", label: "Order Qty", path: "SalesOrderQty" },
            //         { key: "ConfirmedQty", label: "Conf Qty", path: "ConfirmedQty" },
            //         { key: "ExSpace", label: "Ex-Space Indicator", path: "ExSpace" },
            //         { key: "CallByDate", label: "Call By Date", path: "CallByDate" },
            //         { key: "FpdStatus", label: "FPD Status", path: "FpdStatus" },
            //         { key: "Sto", label: "STO", path: "Sto" },
            //         { key: "StoItem", label: "STO Item", path: "StoItem" },
            //         { key: "StoDelv", label: "STO Delivery", path: "StoDelv" },
            //         { key: "StoDelvItem", label: "STO Delivery Item #", path: "StoDelvItem" },
            //         { key: "PricedDate", label: "Priced Date", path: "PricedDate" },
            //         { key: "Message", label: "Message", path: "Message" }

            //     ]);

            //     Engine.register(oTable, {
            //         helper: this.oMetadataHelper,
            //         controller: {
            //             Columns: new SelectionController({
            //                 targetAggregation: "columns",
            //                 control: oTable
            //             }),
            //             Sorter: new SortController({
            //                 control: oTable
            //             }),
            //             Groups: new GroupController({
            //                 control: oTable
            //             })
            //         }
            //     });

            //     Engine.attachStateChange(this.handleStateChange.bind(this));
            // },

            // openPersoDialog: function (oEvt) {
            //     var oTable = this.byId("table");

            //     Engine.show(oTable, ["Columns", "Sorter", "Groups"], {
            //         contentHeight: "35rem",
            //         contentWidth: "32rem",
            //         source: oEvt.getSource()
            //     });
            // },

            // _getKey: function (oControl) {
            //     return this.getView().getLocalId(oControl.getId());
            // },

            // handleStateChange: function (oEvt) {
            //     var oTable = this.byId("table");
            //     var oState = oEvt.getParameter("state");

            //     oTable.getColumns().forEach(function (oColumn, iIndex) {
            //         oColumn.setVisible(false);
            //     });

            //     oState.Columns.forEach(function (oProp, iIndex) {
            //         var oCol = this.byId(oProp.key);
            //         oCol.setVisible(true);

            //         var iOldIndex = oTable.getColumns().indexOf(oCol);

            //         oTable.removeColumn(oCol);
            //         oTable.insertColumn(oCol, iIndex);

            //         oTable.getItems().forEach(function (oItem) {
            //             if (oItem.isA("sap.m.ColumnListItem")) {
            //                 var oCell = oItem.getCells()[iOldIndex];
            //                 oItem.removeCell(oCell);
            //                 oItem.insertCell(oCell, iIndex);
            //             }
            //         });
            //     }.bind(this));

            //     var aSorter = [];
            //     oState.Sorter.forEach(function (oSorter) {
            //         aSorter.push(new Sorter(this.oMetadataHelper.getPath(oSorter.key), oSorter.descending));
            //     }.bind(this));

            //     oState.Groups.forEach(function (oGroup) {
            //         aSorter.push(new Sorter(this.oMetadataHelper.getPath(oGroup.key), oGroup.descending, true));
            //     }.bind(this));

            //     oTable.getBinding("items").sort(aSorter);

            // },
            updateExSpaceIndicator: function (oEvt) {
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }
                var arr = [];
                var table = this.getView().byId("table");
                var options = ['X', 'Y', '1', '2'];
                selectedItems.forEach(function (s) {
                    var obj = {
                        order: table.getContextByIndex(s).getObject().SalesOrder,
                        item: table.getContextByIndex(s).getObject().SalesOrderItem,
                        exSpace: options.includes(table.getContextByIndex(s).getObject().ExSpace) ? 'Yes' : 'No'
                    };
                    arr.push(obj);
                }.bind(this));
                var oModel = new JSONModel(arr);
                this.getView().setModel(oModel, "exSpaceDialogModel");
                var oView = this.getView();
                if (!this.oExSpacePDialog) {
                    this.oExSpacePDialog = this.loadFragment({
                        id: oView.getId(),
                        name: "fdpdashboard.fragments.exSpace"
                    });

                }

                this.oExSpacePDialog.then(function (oDialog) {
                    this.oDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    this.oDialog.open();
                    this.DialogID = oDialog;
                }.bind(this));
            },

            openUpdateCallByDateDialog: function (oEvt) {
               
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                var table = this.getView().byId("table");
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }
                var arr = [];
                selectedItems.forEach(function (s) {
                    var obj = {
                        order: table.getContextByIndex(s).getObject().SalesOrder,
                        item: table.getContextByIndex(s).getObject().SalesOrderItem,
                        date: table.getContextByIndex(s).getObject().CallByDate,
                        minDate: new Date()
                    };
                    arr.push(obj);
                })
                var oModel = new JSONModel(arr);
                this.getView().setModel(oModel, "callByDateDialogModel");
                var oView = this.getView();
                if (!this.oMPDialog) {
                    this.oMPDialog = this.loadFragment({
                        id: oView.getId(),
                        name: "fdpdashboard.fragments.updateCallByDate"
                    });

                }
                this.oMPDialog.then(function (oDialog) {
                    this.oDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    this.oDialog.open();
                    this.DialogID = oDialog;
                }.bind(this));
            },
            openUpdateCallForPriceChinaDialog: function (oEvt) {
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                var table = this.getView().byId("table");
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }


                var arr = [];
                selectedItems.forEach(function (s) {
                    var obj = {
                        order: table.getContextByIndex(s).getObject().SalesOrder,
                        item: table.getContextByIndex(s).getObject().SalesOrderItem,
                        date: table.getContextByIndex(s).getObject().CallByDate,
                        minDate: new Date(),
                        finalPrice: table.getContextByIndex(s).getObject().FpdFinalPrice
                    };
                    arr.push(obj);
                })
                var oModel = new JSONModel(arr);
                this.getView().setModel(oModel, "callForPriceChinaDialogModel");


                //var orders = this.getView().getModel("callForPriceChinaDialogModel").getData();
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                var newArr = [];
                arr.forEach(function (t) {
                    var obj = {
                        "Relation_Id": true,
                        "Orderid": t.order,
                        "Orderitem": t.item
                    }

                    newArr.push(obj);
                })
                var payload = {
                    "Relation_Id": true,
                    "Nav_UpdatePriceChinaTvarvc": newArr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                oModel.setUseBatch(false);
                this.oDataUpdateCall(oModel, "/UpdatePriceChinaTvarvcDeepSet", payload)
                    .then(function (data) {
                        console.log(data);
                        var errCount = 0;
                        data.Nav_UpdatePriceChinaTvarvc.results.forEach(function (row) {
                            if (row.Message === "Error") {
                                errCount = errCount + 1;
                            }
                        })
                        if (errCount > 0) {
                            MessageBox.error("Order doesn't fullfil required condition");
                        }
                        else {
                            this.oCPDialog.then(function (oDialog) {
                                this.oDialog = oDialog;
                                this.getView().addDependent(oDialog);
                                this.oDialog.open();
                                this.DialogID = oDialog;
                            }.bind(this));
                        }
                        // }.bind(this));
                    }.bind(this))
                    .catch(function (e) {
                        MessageBox.error("Order doesn't fullfil required condition");
                    })



                var oView = this.getView();
                if (!this.oCPDialog) {
                    this.oCPDialog = this.loadFragment({
                        id: oView.getId(),
                        name: "fdpdashboard.fragments.updateCallForPriceChina"
                    });

                }

            },
            UpdatePriceChina: function (oEvt) {
                var orders = this.getView().getModel("callForPriceChinaDialogModel").getData();
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                var arr = [];
                orders.forEach(function (t) {
                    var obj = {
                        "Relation_Id": true,
                        "Orderid": t.order,
                        "Orderitem": t.item,
                        "Negotiatedprice_CSR": t.finalPrice,
                        "FPDpricedbydate": t.date
                    }

                    arr.push(obj);
                })
                var payload = {
                    "Relation_Id": true,
                    "Nav_UpdatePriceChina": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/UpdatePriceChinaDeepSet", payload)
                    .then(function (data) {
                        this.DialogID.close();
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
            },
            UpdateCallByDat1e: function (oEvt) {
                var items = oEvt.getSource().getParent().getContent()[0].getItems();
                var flag = false;
                items.forEach(function (t) {
                    if (t.getCells()[2].getValue() === "") {
                        t.getCells()[2].setValueState("Error");
                        flag = true;
                    }
                    else {
                        t.getCells()[2].setValueState("None");
                    }
                })
                if (flag) {
                    MessageBox.warning("Please provide valid date");
                    return;
                }
                var orders = this.getView().getModel("callByDateDialogModel").getData();
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                var arr = [];
                orders.forEach(function (t) {
                    var obj = {
                        "Id": true,
                        "Orderid": t.order,
                        "Orderitem": t.item,
                       // "Calldate": "2023-01-01"
                         "Calldate": t.date  //Defect GPT 372699  --Jayesh
                    }
                    arr.push(obj);
                })
                var payload = {
                    "Id": true,
                    "CallbydateSet": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/Call_By_DateSet", payload)
                    .then(function (data) {
                        this.DialogID.close();
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
            },
            UpdateExSpaceIndictr: function (oEvt) {
                var items = oEvt.getSource().getParent().getContent()[0].getItems();
                var flag = false;
                items.forEach(function (t) {
                    if (t.getCells()[2].getSelectedKey() === "") {
                        t.getCells()[2].setValueState("Error");
                        flag = true;
                    }
                    else {
                        t.getCells()[2].setValueState("None");
                    }
                })
                if (flag) {
                    MessageBox.warning("Please select Ex-Space Indicator");
                    return;
                }

                var orders = this.getView().getModel("exSpaceDialogModel").getData();
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                var arr = [];

                orders.forEach(function (t) {
                    var obj = {
                        "Id": true,
                        "Orderid": t.order,
                        "Orderitem": t.item,
                        "ExInd": t.exSpace === "Yes" ? 'X' : ''
                    }
                    arr.push(obj);
                })
                var payload = {
                    "Id": true,
                    "ExindSet": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");

                this.oDataUpdateCall(oModel, "/EX_SP_INDICATORSet", payload)
                    .then(function (data) {
                        this.DialogID.close();
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        MessageBox.error(i18n.getText("techError"));
                        this.onSearch();
                    }.bind(this))
            },
            openUpdateCallByPriceDialog: function (oEvt) {
               
                var selectedItems = this.getView().byId("table").getSelectedIndices();
                var table = this.getView().byId("table");
                if (!selectedItems.length) {
                    MessageBox.warning(i18n.getText("orderSelMsg"));
                    return;
                }


                var arr = [];
               // var validationFailed = false;
                selectedItems.forEach(function (s) {
                    var object = table.getContextByIndex(s).getObject();
                    // if (object.BusinessScenario === "FPD" && object.Division !== "30") {
                    //     validationFailed = true;
                    // }
                    // var obj = {
                    //     order: object.SalesOrder,
                    //     item: object.SalesOrderItem,
                    //     date: object.CallByDate,
                    //     minDate: new Date(),
                    //     finalPrice: object.FpdFinalPrice,
                    //     sfdcPrice: object.Finalprice_Pricefx
                    // };
                    var obj = {
                        "Relation_Id": true,
                        "Orderid": object.SalesOrder,
                        "Orderitem": object.SalesOrderItem,
                        "Finalprice_PriceFX": "0",
                        "FPDpricedbydate": "",
                        "Message": ""
                    };
                    arr.push(obj);
                })
                // if (validationFailed) {
                //     MessageBox.error(i18n.getText("validationMsg1"));
                //     return;
                // }
                sap.ui.core.BusyIndicator.show();
                var payload = {
                    "Relation_Id": true,
                    "Nav_UpdatePriceFPD_SFDC": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                oModel.setUseBatch(false);
                oModel.create("/UpdatePriceFPD_SFDCDeepSet", payload, {
                    method: "POST",
                    success: function (data) {
                        console.log(data)

                        var oModel = new JSONModel(data.Nav_UpdatePriceFPD_SFDC.results);
                        data.Nav_UpdatePriceFPD_SFDC.results.forEach(function (row) {
                            row.FinalPrice = row.Finalprice_PriceFX;
                        })
                        this.getView().setModel(oModel, "callForPriceDialogModel");
                        this.oUPDialog.then(function (oDialog) {
                            this.oDialog = oDialog;
                            this.getView().addDependent(oDialog);
                            this.oDialog.open();
                            this.DialogID = oDialog;
                        }.bind(this));
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (error) {
                        console.log(error)
                        sap.ui.core.BusyIndicator.hide();
                        //MessageBox.error(error);
                        var table = JSON.parse(error.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                    }
                });


                // this.oDataUpdateCall(oModel, "/UpdatePriceFPD_SFDCDeepSet", payload)
                //     .then(function (data) {
                //         console.log(data);
                //         var results = data.Nav_UpdatePriceFPD_SFDC.results;

                //         var oModel = new JSONModel(results);
                //         this.getView().setModel(oModel, "callForPriceDialogModel");
                //         this.oUPDialog.then(function (oDialog) {
                //             this.oDialog = oDialog;
                //             this.getView().addDependent(oDialog);
                //             this.oDialog.open();
                //         }.bind(this));

                //         // var obj = {
                //         //     order: object.SalesOrder,
                //         //     item: object.SalesOrderItem,
                //         //     date: object.CallByDate,
                //         //     minDate: new Date(),
                //         //     finalPrice: object.FpdFinalPrice,
                //         //     sfdcPrice: object.Finalprice_Pricefx
                //         // };
                //     }.bind(this))
                //     .catch(function (e) {
                //         MessageBox.error("Error fetching data");
                //     })


                var oView = this.getView();
                if (!this.oUPDialog) {
                    this.oUPDialog = this.loadFragment({
                        id: oView.getId(),
                        name: "fdpdashboard.fragments.updateCallByPrice"
                    });

                }

            },
            UpdateCallByPric1e: function (oEvt) {
                var orders = this.getView().getModel("callForPriceDialogModel").getData();
                console.log(orders);
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                var arr = [];
                orders.forEach(function (t) {
                    var obj = {
                        "Relation_Id": true,
                        "Orderid": t.Orderid,
                        "Orderitem": t.Orderitem,
                        "Finalprice_PriceFX": t.Finalprice_PriceFX,
                        "Negotiatedprice_CSR": t.FinalPrice,
                        "FPDpricedbydate": t.FPDpricedbydate,
                        "Status": t.Message,
                        "LoopActive": "A"
                    }

                    if(t.Message !== "Error"){

                    arr.push(obj);
                    }
                })
                var payload = {
                    "Relation_Id": true,
                    "Nav_UpdatePriceFPD": arr

                };
                var oModel = this.getOwnerComponent().getModel("FDPODataModel");
                this.oDataUpdateCall(oModel, "/UpdatePriceFPDDeepSet", payload)
                    .then(function (data) {
                        this.DialogID.close();
                        MessageBox.success(i18n.getText("uSucess"));
                        this.onSearch();
                    }.bind(this))
                    .catch(function (e) {
                        var table = JSON.parse(e.responseText).error.innererror.errordetails;
                        var message = "";
                        table.forEach(function (t) {
                            message = message + "\n" + t.message;
                        })
                        MessageBox.error(message);
                        this.onSearch();
                    }.bind(this))
            },


            closeUpdateCallByDate: function (oEvt) {
                oEvt.getSource().getParent().close();
            },

            oDataUpdateCall: function (oModel, sPath, obj) {
                return new Promise(function (resolve, reject) {
                    oModel.create(sPath, obj, {
                        method: "POST",
                        success: function (data) {
                            resolve(data);
                        },
                        error: function (error) {
                            reject(error);
                        }
                    });
                })
            },

            //Search HElps
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
                this._oMultiInput.setTokens(aTokens);
                this.onCloseDialog();
            },

            onValueHelpCancelPress: function () {
                this.onCloseDialog();
            },
            onCloseDialog: function () {
                if (this._oMultiInput.getId().includes("salesOrgInput")) {
                    this._oVHD.close();
                }
                else if (this._oMultiInput.getId().includes("orderTypeInput")) {
                    this._oVHDoT.close();
                }
                else if (this._oMultiInput.getId().includes("divisionInput")) {
                    this._oVHDDiv.close();
                }
                else if (this._oMultiInput.getId().includes("soldToInput")) {
                    this._oVHDSoldTo.close();
                }
                else if (this._oMultiInput.getId().includes("shipToInput")) {
                    this._oVHDShipTo.close();
                }
                else if (this._oMultiInput.getId().includes("salesOrderInput")) {
                    this._oVHDSalesOrder.close();
                }
                else if (this._oMultiInput.getId().includes("contractInput")) {
                    this._oVHDContract.close();
                }
                else if (this._oMultiInput.getId().includes("customerPOInput")) {
                    this._oVHDCustomerPO.close();
                }
                else if (this._oMultiInput.getId().includes("plantInput")) {
                    this._oVHDPlant.close();
                }
                else if (this._oMultiInput.getId().includes("salesGroupInput")) {
                    this._oVHDSalesGroup.close();
                }
                else if (this._oMultiInput.getId().includes("salesOfficeInput")) {
                    this._oVHDSalesOffice.close();
                }
            },
            onFilterBarSearch: function (oEvent) {
                var sSearchQuery;
                var aSelectionSet = oEvent.getParameter("selectionSet");
                if (this._oMultiInput.getId().includes("salesOrgInput")) {
                    sSearchQuery = this._oBasicSearchField.getValue();
                }
                if (this._oMultiInput.getId().includes("orderTypeInput")) {
                    sSearchQuery = this._oBasicSearchFieldOt.getValue();
                }
                if (this._oMultiInput.getId().includes("divisionInput")) {
                    sSearchQuery = this._oBasicSearchFieldDiv.getValue();
                }
                if (this._oMultiInput.getId().includes("soldToInput")) {
                    sSearchQuery = this._oBasicSearchFieldSoldTo.getValue();
                }
                if (this._oMultiInput.getId().includes("shipToInput")) {
                    sSearchQuery = this._oBasicSearchFieldShipTo.getValue();
                }
                if (this._oMultiInput.getId().includes("salesOrderInput")) {
                    sSearchQuery = this._oBasicSearchFieldSalesOrder.getValue();
                }
                if (this._oMultiInput.getId().includes("contractInput")) {
                    sSearchQuery = this._oBasicSearchFieldContract.getValue();
                }
                if (this._oMultiInput.getId().includes("plantInput")) {
                    sSearchQuery = this._oBasicSearchFieldPlant.getValue();
                }
                if (this._oMultiInput.getId().includes("salesOfficeInput")) {
                    sSearchQuery = this._oBasicSearchFieldSalesOffice.getValue();
                }
                if (this._oMultiInput.getId().includes("salesGroupInput")) {
                    sSearchQuery = this._oBasicSearchFieldSalesGroup.getValue();
                }
                if (this._oMultiInput.getId().includes("customerPOInput")) {
                    sSearchQuery = this._oBasicSearchFieldCustomerPO.getValue();
                }

                var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                    if (oControl.getValue()) {
                        aResult.push(new Filter({
                            path: oControl.getName(),
                            operator: FilterOperator.Contains,
                            value1: oControl.getValue()
                        }));
                    }

                    return aResult;
                }, []);
                var oVHD;
                if (this._oMultiInput.getId().includes("salesOrgInput")) {
                    oVHD = this._oVHD;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Vkorg", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Vtext", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("orderTypeInput")) {
                    oVHD = this._oVHDoT;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Auart", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Bezei", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("divisionInput")) {
                    oVHD = this._oVHDDiv;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Spart", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Vtext", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("soldToInput")) {
                    oVHD = this._oVHDSoldTo;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Kunnr", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Name1", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("shipToInput")) {
                    oVHD = this._oVHDShipTo;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Kunnr", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Name1", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("salesOrderInput")) {
                    oVHD = this._oVHDSalesOrder;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Vbeln", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Name1", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("contractInput")) {
                    oVHD = this._oVHDContract;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Vbeln", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Name1", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("customerPOInput")) {
                    oVHD = this._oVHDCustomerPO;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Bstkd", operator: FilterOperator.Contains, value1: sSearchQuery })
                            //  new Filter({ path: "Name1", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }
                if (this._oMultiInput.getId().includes("plantInput")) {
                    oVHD = this._oVHDPlant;
                    aFilters.push(new Filter({
                        filters: [
                            new Filter({ path: "Werks", operator: FilterOperator.Contains, value1: sSearchQuery }),
                            new Filter({ path: "Name1", operator: FilterOperator.Contains, value1: sSearchQuery })
                        ],
                        and: false
                    }));
                }

                this._filterTable(oVHD, new Filter({
                    filters: aFilters,
                    and: true
                }));
            },
            _filterTable: function (oVHD, oFilter) {
                oVHD.getTableAsync().then(function (oTable) {
                    if (oTable.bindRows) {
                        oTable.getBinding("rows").filter(oFilter);
                    }
                    if (oTable.bindItems) {
                        oTable.getBinding("items").filter(oFilter);
                    }
                    oVHD.update();
                });
            },
            handleSalesOrgF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.pDialog) {
                    this.pDialog.then(function (sDialog) {
                        sDialog.open();
                    });
                }
            },
            handleOrderTypeF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.oTDialog) {
                    this.oTDialog.then(function (_oTDialog) {
                        _oTDialog.open();
                    });
                }
            },
            handleDivisionF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.divisDialog) {
                    this.divisDialog.then(function (_divisDialog) {
                        _divisDialog.open();
                    });
                }
            },
            handleSalesOfficeF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.salesOfficeDialog) {
                    this.salesOfficeDialog.then(function (_salesOfficeDialog) {
                        _salesOfficeDialog.open();
                    });
                }
            },
            handleSalesGroupF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.salesGroupDialog) {
                    this.salesGroupDialog.then(function (_salesGroupDialog) {
                        _salesGroupDialog.open();
                    });
                }
            },
            handleSoldToF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.soldToDialog) {
                    this.soldToDialog.then(function (_soldToDialog) {
                        _soldToDialog.open();
                    });
                }
            },
            handleShipToF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.shipToDialog) {
                    this.shipToDialog.then(function (_shipToDialog) {
                        _shipToDialog.open();
                    });
                }
            },
            handleSalesOrderF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.salesOrderDialog) {
                    this.salesOrderDialog.then(function (_salesOrderDialog) {
                        _salesOrderDialog.open();
                    });
                }
            },
            handleContractF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.contractDialog) {
                    this.contractDialog.then(function (_contractDialog) {
                        _contractDialog.open();
                    });
                }
            },
            handleCustomerPOF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.customerPODialog) {
                    this.customerPODialog.then(function (_customerPODialog) {
                        _customerPODialog.open();
                    });
                }
            },
            handlePlantF4: function (oEvt) {
                this._oMultiInput = oEvt.getSource();
                if (this.plantDialog) {
                    this.plantDialog.then(function (_plantDialog) {
                        _plantDialog.open();
                    });
                }
            },
            createSaleOrgDialog: function (oData) {
                this._oBasicSearchField = new SearchField();
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.salesOrgF4"
                    });
                }
                this.pDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHD = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Sales Organisation",
                        key: "Vkorg",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchField);
                    this._oBasicSearchField.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label: i18n.getText("salesOrg"), template: "Vkorg" }));
                            oTable.addColumn(new UIColumn({ label: i18n.getText("name"), template: "Vtext" }));
                        }
                        oDialog.update();
                    }.bind(this));


                }.bind(this));
            },
            createOrderTypeDialog: function (oData) {
                this._oBasicSearchFieldOt = new SearchField();
                if (!this.oTDialog) {
                    this.oTDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.orderTypeF4"
                    });
                }
                this.oTDialog.then(function (_oTDialog) {
                    var oFilterBar = _oTDialog.getFilterBar();
                    this._oVHDoT = _oTDialog;
                    this.getView().addDependent(_oTDialog);
                    _oTDialog.setRangeKeyFields([{
                        label: "Order Type",
                        key: "Auart",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldOt);
                    this._oBasicSearchFieldOt.attachSearch(function () {
                        oFilterBar.search();
                    });

                    _oTDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label: i18n.getText("orderType"), template: "Auart" }));
                            oTable.addColumn(new UIColumn({ label: i18n.getText("name"), template: "Bezei" }));
                        }
                        _oTDialog.update();
                    }.bind(this));


                }.bind(this));
            },
            divisionDialog: function (oData) {
                this._oBasicSearchFieldDiv = new SearchField();
                if (!this.divisDialog) {
                    this.divisDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.divisionF4"
                    });
                }
                this.divisDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDDiv = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Division",
                        key: "Spart",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldDiv);
                    this._oBasicSearchFieldDiv.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("division"), template: "Spart" }));
                            oTable.addColumn(new UIColumn({ label :i18n.getText("name"), template: "Vtext" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createShipToDialog: function (oData) {
                this._oBasicSearchFieldShipTo = new SearchField();
                if (!this.shipToDialog) {
                    this.shipToDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.shipToF4"
                    });
                }
                this.shipToDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDShipTo = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Ship To",
                        key: "Kunnr",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldShipTo);
                    this._oBasicSearchFieldShipTo.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("shipTo"), template: "Kunnr" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Name1" }));
                        }
                        oDialog.update();
                    }.bind(this));

                }.bind(this));
            },
            createSoldToDialog: function (oData) {
                this._oBasicSearchFieldSoldTo = new SearchField();
                if (!this.soldToDialog) {
                    this.soldToDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.soldToF4"
                    });
                }
                this.soldToDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDSoldTo = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Sold To",
                        key: "Kunnr",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldSoldTo);
                    this._oBasicSearchFieldSoldTo.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label: i18n.getText("soldTo"), template: "Kunnr" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Name1" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createSalesOrderDialog: function (oData) {
                this._oBasicSearchFieldSalesOrder = new SearchField();
                if (!this.salesOrderDialog) {
                    this.salesOrderDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.salesOrderF4"
                    });
                }
                this.salesOrderDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDSalesOrder = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Sales Order",
                        key: "Vbeln",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldSalesOrder);
                    this._oBasicSearchFieldSalesOrder.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("salesOrder"), template: "Vbeln" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Vbeln" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createContractDialog: function (oData) {
                this._oBasicSearchFieldContract = new SearchField();
                if (!this.contractDialog) {
                    this.contractDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.contractF4"
                    });
                }
                this.contractDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDContract = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Contract",
                        key: "Vbeln",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldContract);
                    this._oBasicSearchFieldContract.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("contract"), template: "Vbeln" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Vbeln" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createCustomerPODialog: function (oData) {
                this._oBasicSearchFieldCustomerPO = new SearchField();
                if (!this.customerPODialog) {
                    this.customerPODialog = this.loadFragment({
                        name: "fdpdashboard.fragments.customerPOF4"
                    });
                }
                this.customerPODialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDCustomerPO = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Customer PO",
                        key: "Bstkd",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldCustomerPO);
                    this._oBasicSearchFieldCustomerPO.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("customerPO"), template: "Bstkd" }));
                            //  oTable.addColumn(new UIColumn({ label: "Name", template: "Name1" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createPlantDialog: function (oData) {
                this._oBasicSearchFieldPlant = new SearchField();
                if (!this.plantDialog) {
                    this.plantDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.plantF4"
                    });
                }
                this.plantDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDPlant = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Plant",
                        key: "Werks",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldPlant);
                    this._oBasicSearchFieldPlant.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("plant"), template: "Werks" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Name1" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createSalesOfficeDialog: function (oData) {
                this._oBasicSearchFieldSalesOffice = new SearchField();
                if (!this.salesOfficeDialog) {
                    this.salesOfficeDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.salesOfficeF4"
                    });
                }
                this.salesOfficeDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDSalesOffice = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Sales Office",
                        key: "Vkbur",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldSalesOffice);
                    this._oBasicSearchFieldSalesOffice.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("salesOffice"), template: "Vkbur" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Bezei" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            createSalesGroupDialog: function (oData) {
                this._oBasicSearchFieldSalesGroup = new SearchField();
                if (!this.salesGroupDialog) {
                    this.salesGroupDialog = this.loadFragment({
                        name: "fdpdashboard.fragments.salesGroupF4"
                    });
                }
                this.salesGroupDialog.then(function (oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHDSalesGroup = oDialog;
                    this.getView().addDependent(oDialog);
                    oDialog.setRangeKeyFields([{
                        label: "Sales Group",
                        key: "Vkgrp",
                        type: "string",
                        typeInstance: new TypeString({}, {
                            maxLength: 7
                        })
                    }]);
                    oFilterBar.setFilterBarExpanded(false);
                    oFilterBar.setBasicSearch(this._oBasicSearchFieldSalesGroup);
                    this._oBasicSearchFieldSalesGroup.attachSearch(function () {
                        oFilterBar.search();
                    });

                    oDialog.getTableAsync().then(function (oTable) {
                        var oModel = new JSONModel(oData);
                        oTable.setModel(oModel);
                        if (oTable.bindRows) {
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function () {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({ label:i18n.getText("salesGroup"), template: "Vkgrp" }));
                            oTable.addColumn(new UIColumn({ label:i18n.getText("name"), template: "Bezei" }));
                        }
                        oDialog.update();
                    }.bind(this));
                }.bind(this));
            },
            onFilterTable: function (oEvent) {
                if (oEvent.getParameters().refreshButtonPressed) {
                    this.onRefresh();
                } else {
                    var aTableSearchState = [];
                    var sQuery = oEvent.getParameter("query");

                    if (sQuery && sQuery.length > 0) {
                        var aFilters = [];
                        aFilters.push(new Filter({
                            filters: [
                                new Filter({ path: "SalesOrder", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "SalesOrderItem", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "SalesOrg", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "Division", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "OrderType", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "SoldTo", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "ShipTo", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "SalesOrderQty", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "Material", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "DelvPlant", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "CsrNumber", operator: FilterOperator.Contains, value1: sQuery }),
                                new Filter({ path: "Message", operator: FilterOperator.Contains, value1: sQuery })

                            ],
                            and: false
                        }));
                        aTableSearchState = [aFilters];
                    }
                    this._applySearch(aTableSearchState);
                }

            },

            /**
             * Event handler for refresh event. Keeps filter, sort
             * and group settings and refreshes the list binding.
             * @public
             */
            onRefresh: function () {
                var oTable = this.byId("table");
                oTable.getBinding("items").refresh();
            },


            _applySearch: function (aTableSearchState) {
                var oTable = this.byId("table");
                //  oViewModel = this.getModel("worklistView");
                oTable.getBinding("items").filter(aTableSearchState, "Application");
                // changes the noDataText of the list in case there are no filter results
                // if (aTableSearchState.length !== 0) {
                //     oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
                // }
            },

            layoutData: function () {
                var data = {
                    "Columns": [
                        {
                            "ID": "SalesOrder",
                            "Text": i18n.getText("salesOrder")
                        },
                        {
                            "ID": "SalesOrderItem",
                            "Text": i18n.getText("salesOrderItem")
                        },
                        {
                            "ID": "SalesOrg",
                            "Text": i18n.getText("salesOrg")
                        },
                        {
                            "ID": "Division",
                            "Text": i18n.getText("division")
                        },
                        {
                            "ID": "OrderType",
                            "Text": i18n.getText("orderType")
                        },
                        {
                            "ID": "OrderCreateDate",
                            "Text": i18n.getText("orderCreatDate")
                        },
                        {
                            "ID": "SoldTo",
                            "Text": i18n.getText("soldTo")
                        },
                        {
                            "ID": "ShipTo",
                            "Text": i18n.getText("shipTo")
                        },
                        {
                            "ID": "SalesOrderQty",
                            "Text": i18n.getText("orderQty")
                        },
                        {
                            "ID": "Material",
                            "Text": i18n.getText("matnr")
                        },
                        {
                            "ID": "MaterialDesc",
                            "Text": i18n.getText("materialDesc")
                        }, {
                            "ID": "DelvPlant",
                            "Text": i18n.getText("plant")
                        },
                        {
                            "ID": "CsrNumber",
                            "Text":i18n.getText("csrNumber")
                        },
                        {
                            "ID": "Message",
                            "Text": i18n.getText("message")
                        },
                        {
                            "ID": "ConfirmedQty",
                            "Text": i18n.getText("configQty")
                        },
                        {
                            "ID": "ExSpace",
                            "Text": i18n.getText("exSpaceInd")
                        },
                        {
                            "ID": "CallByDate",
                            "Text": i18n.getText("callByDate")
                        },
                        {
                            "ID": "FpdStatus",
                            "Text": i18n.getText("fpdStatus")
                        },
                        {
                            "ID": "SalesOrderStock",
                            "Text": i18n.getText("salesOrderStock")
                        },
                        {
                            "ID": "StoDelvItem",
                            "Text": i18n.getText("stoDelvItem")
                        },
                        {
                            "ID": "StoDelv",
                            "Text": i18n.getText("stoDelv")
                        },
                        {
                            "ID": "Sto",
                            "Text": i18n.getText("sto")
                        },
                        {
                            "ID": "Contract",
                            "Text":i18n.getText("contract")
                        },
                        {
                            "ID": "ContractType",
                            "Text": i18n.getText("contractType")
                        },
                        {
                            "ID": "ContractValidFrom",
                            "Text": i18n.getText("contractValidFrom")
                        },
                        {
                            "ID": "ContractValidTo",
                            "Text": i18n.getText("contractValidTo")
                        },
                        {
                            "ID": "PricedDate",
                            "Text": i18n.getText("pricedDate")
                        },
                        {
                            "ID": "ContractItem",
                            "Text": i18n.getText("contractItem")
                        },
                        {
                            "ID": "SalesOffice",
                            "Text": i18n.getText("salesOffice")
                        },
                        {
                            "ID": "SalesGroup",
                            "Text": i18n.getText("salesGroup")
                        },
                        
                        {
                            "ID": "SalesOrgName",
                            "Text": i18n.getText("salesOrgName")
                        },
                        {
                            "ID": "DivisionName",
                            "Text": i18n.getText("divisionName")
                        },
                        {
                            "ID": "DistributionChannel",
                            "Text": i18n.getText("distributionChannel")
                        },
                        {
                            "ID": "DistributionChannelName",
                            "Text": i18n.getText("distributionChannelName")
                        },
                        {
                            "ID": "BusinessScenario",
                            "Text": i18n.getText("busScenerio")
                        },
                        {
                            "ID": "SoldToName",
                            "Text":  i18n.getText("soldToName")
                        },
                        {
                            "ID": "ShipToName",
                            "Text":  i18n.getText("shipToName")
                        },
                        {
                            "ID": "ShipToCity",
                            "Text":  i18n.getText("shipToCity")
                        },
                        {
                            "ID": "ShipToRegion",
                            "Text":  i18n.getText("shipToRegion")
                        },
                        {
                            "ID": "Unit",
                            "Text":  i18n.getText("unit")
                        },
                        {
                            "ID": "Currency",
                            "Text":  i18n.getText("currency")
                        },
                        {
                            "ID": "CustomerPoItem",
                            "Text":  i18n.getText("customerPoItem")
                        },
                        {
                            "ID": "SrvRendDate",
                            "Text":  i18n.getText("srvRendDate")
                        },
                        {
                            "ID": "CsrNumber",
                            "Text":  i18n.getText("csrNumber")
                        },
                        {
                            "ID": "CsrName",
                            "Text":  i18n.getText("csrName")
                        },
                        {
                            "ID": "SalesDistrict",
                            "Text": i18n.getText("salesDistrict")
                        },
                        
                        {
                            "ID": "ReqDelvDate",
                            "Text": i18n.getText("reqDelvDate")
                        }, {
                            "ID": "CustomerPo",
                            "Text": i18n.getText("customerPo")
                        }, {
                            "ID": "StoItem",
                            "Text": i18n.getText("stoItem")
                        }, {
                            "ID": "SalesOfficeDesc",
                            "Text": i18n.getText("salesOfficeDesc")
                        }, {
                            "ID": "SalesGroupDesc",
                            "Text": i18n.getText("salesGroupDesc")
                        }, {
                            "ID": "SalesDistrictDesc",
                            "Text": i18n.getText("salesDistrictDesc")
                        }, {
                            "ID": "Inco1",
                            "Text": i18n.getText("inco1")
                        }, {
                            "ID": "Inco2",
                            "Text": i18n.getText("inco2")
                        }, {
                            "ID": "PaymentTerms",
                            "Text": i18n.getText("paymentTerms")
                        }, {
                            "ID": "PaymentTermsDesc",
                            "Text": i18n.getText("paymentTermsDesc")
                        }, {
                            "ID": "ShipConditions",
                            "Text": i18n.getText("shipConditions")
                        }, {
                            "ID": "FpdFinalPrice",
                            "Text": i18n.getText("fpdFinalPrice")
                        },{
                            "ID": "Finalprice_Pricefx",
                            "Text": i18n.getText("nonNegoPrice")
                        }, {
                            "ID": "BpAgreement",
                            "Text": i18n.getText("bpAgreement")
                        },
                        {
                            "ID": "ShipConditionsDesc",
                            "Text": i18n.getText("shipConditionsDesc")
                        },

                        {
                            "ID": "LastUpdatedOn",
                            "Text": i18n.getText("lastUpdatedOn")
                        }, {
                            "ID": "LastUpdatedTime",
                            "Text": i18n.getText("lastUpdatedOnTime")
                        }
                    ],
                    "exSpace": [
                        {
                            "text": "Yes"
                        },
                        {
                            "text": "No"
                        }
                    ]
                }

                var oModel = new JSONModel(data);
                this.getView().setModel(oModel, "LocalModel");
                var columns = data.Columns;
                var cols = [];
                columns.forEach(function (c, i) {
                    if (i < 13) {
                        cols.push(c.ID);
                    }
                })
                this.getView().byId("layout").setSelectedKeys(cols);

            }
            });
    });
