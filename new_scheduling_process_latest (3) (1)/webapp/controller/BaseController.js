sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/SearchField',
    'sap/ui/model/type/String',
    'sap/ui/table/Column',
    "sap/ui/core/Fragment",
    "schedulingprocess/schedulingprocess/model/formatter"
  ],
  function (Controller, UIComponent, JSONModel, Filter, FilterOperator, SearchField, TypeString, UIColumn, Fragment, formatter) {
    "use strict";
    var i18n;
    return Controller.extend("schedulingprocess.schedulingprocess.controller.BaseController", {
      formatter: formatter,
      onInit: function () {
        i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },
      onQuotaDetails: function () {
        this.getRouter().navTo("QuotaTable");
      },
      //Begin the code
      // Workbench TR : DA1K909941
      // OTC_I658 - New Button View O9 Data functionality added as part of new changes 
      onViewO9DataDetails: function () {
        this.getRouter().navTo("ViewO9Data");
      },
      //End the code
      onContractSelectionPress: function () {
        const weekSelection = {
          week : this.getView().byId("weekInput").getTokens()
       };
        var oModel = new JSONModel(weekSelection);
        sap.ui.getCore().setModel(oModel, "weekSelectionModel"); 
        this.getRouter().navTo("ContractSelection");
        
      },
      onViewSalesOrderStatusPress: function () {
        this.getRouter().navTo("ViewSalesOrderStatus");
      },
      //Begin the code
      // Workbench TR : DA1K909941
      //OTC_I655 -New Button ViewoOpenContracts functionality added as part of new changes
      onViewOpenContractsPress: function () {
        this.getRouter().navTo("ViewOpenContracts");
      },
      //End the code
      onDigitalHub: function (oEvt) {
        var object = oEvt.getSource().getBindingContext('TableScheduleModel').getObject();
        console.log(object);
        var model = new JSONModel(object);
        this.getOwnerComponent().setModel(model, "RowDetailsModel");
        this.getRouter().navTo("OrderRequest");
        if (oEvt.getSource().getId().includes("custReqQtyLink")) {
          var obj = {
            /* Editable Logic*/
                // Begin the code Defect - GPT-30476
                // Work Bench TR : DA1K916990 
                // New changes to add layout for table columns
            "NfeCustomer": true,
            "NfeBilDoc": true,
            "shipTo": true,
            "priceToCustomer": true,
            "contractReq": true,
            "contractItem": true,
            "cuttingQty": false,
            "mon": false,
            "tues": false,
            "wed": false,
            "thurs": false,
            "fri": false,
            "sat": false,
            "sun": false,
            "bagsSelected": false,
            "AmConfQty": true,
            "ReqDelDat": true,
            "PackRequested": true,
            "PoNo": true,
            "PaymentTermsn": true,
            "DelInstr": true,
            "SelfConsInd": true,
            "BackLogQty":false,
            "CNPJ_NO": true,
            /* Editable Logic*/

            /* Visible Logic*/
            ReqIdVisible: true,
            createdVisible: false,
            NfeCustomerVisible: true,
            NfeBillingVisible: true,
            WeekVisible: false,
            ManagerIdVisible: false,
            AccountMngVisible: true,
            PlantGrpVisible: true,
            PlantVisible: true,
            CustomerIdVisible: false,
            SoldToNameVisible: true,
            MaterialVisible: true,
            MaterialDescVisible: true,
            FormulaKeyVisible: false,
            FormulaKeyDescVisible: false,
            IncotermsVisible: true,
            BusinessScenarioVisible: true,
            CustomerReqQtyVisible: true,
            PrevDueQtyVisible: true,
            AmConfQtyVisible: true,
            CurrentDueQtyVisible: true,
            ReqDelDatVisible: true,
            ReqDelDayVisible: true,
            PackRequestedVisible: true,
            CuttingQtyVisible: false,
            CuttingQtyMonVisible: false,
            PoNoVisible: true,
            ProtocolIDVisible: true,
            PaymentTermsnVisible: false,
            SelfConsIndVisible: true,
            DelInstrVisible: false,
            ContractReqVisible: true,
            ContractItemNoVisible: true,
            ShipToVisible: true,
            ProtocolPriceVisible: true,
            ContractFinalizedVisible: false,
            SoCreatedVisible: false,
            SoItemVisible: false,
            ContractSelErrorVisible: false,
            SoCreErrorVisible: false,
            BackLogQtyVisible: false,
            CNPJVisible:true
            /* Visible Logic*/
          };

        }
        else if (oEvt.getSource().getId().includes("confirmedQtyLink")) {
          var obj = {
            /* Editable Logic*/
            "NfeCustomer": false,
            "NfeBilDoc": false,
            "shipTo": false,
            "priceToCustomer": false,
            "contractReq": false,
            "contractItem": false,
            "cuttingQty": true,
            "mon": true,
            "tues": true,
            "wed": true,
            "thurs": true,
            "fri": true,
            "sat": true,
            "sun": true,
            "bagsSelected": true,
            "AmConfQty": false,
            "ReqDelDat": false,
            "PackRequested": false,
            "PoNo": false,
            "PaymentTermsn": false,
            "DelInstr": false,
            "SelfConsInd": false,
            "BackLogQty":false,
            "CNPJ_NO": true,
            /* Editable Logic*/
          
            /* Visible Logic*/
            ReqIdVisible: true,
            createdVisible: false,
            NfeCustomerVisible: false,
            NfeBillingVisible: false,
            WeekVisible: false,
            ManagerIdVisible: false,
            AccountMngVisible: false,
            PlantGrpVisible: true,
            PlantVisible: true,
            CustomerIdVisible: false,
            SoldToNameVisible: true,
            MaterialVisible: true,
            MaterialDescVisible: true,
            FormulaKeyVisible: false,
            FormulaKeyDescVisible: false,
            IncotermsVisible: false,
            BusinessScenarioVisible: false,
            CustomerReqQtyVisible: false,
            PrevDueQtyVisible: false,
            AmConfQtyVisible: true,
            CurrentDueQtyVisible: false,
            ReqDelDatVisible: true,
            ReqDelDayVisible: false,
            PackRequestedVisible: false,
            CuttingQtyVisible: true,
            CuttingQtyMonVisible: true,
            PoNoVisible: false,
            ProtocolIDVisible: false,
            PaymentTermsnVisible: false,
            SelfConsIndVisible: false,
            DelInstrVisible: false,
            ContractReqVisible: true,
            ContractItemNoVisible: true,
            ShipToVisible: false,
            ProtocolPriceVisible: false,
            ContractFinalizedVisible: false,
            SoCreatedVisible: false,
            SoItemVisible: false,
            ContractSelErrorVisible: false,
            SoCreErrorVisible: false,
            BackLogQtyVisible: false,
            CNPJVisible:false
            /* Visible Logic*/
          };
        }
        else if (oEvt.getSource().getId().includes("contractLink")) {
          var obj = {
            /* Editable Logic*/
            "NfeCustomer": false,
            "NfeBilDoc": false,
            "shipTo": false,
            "priceToCustomer": false,
            "contractReq": false,
            "contractItem": false,
            "cuttingQty": false,
            "mon": false,
            "tues": false,
            "wed": false,
            "thurs": false,
            "fri": false,
            "sat": false,
            "sun": false,
            "bagsSelected": false,
            "AmConfQty": false,
            "ReqDelDat": false,
            "PackRequested": false,
            "PoNo": false,
            "PaymentTermsn": false,
            "DelInstr": false,
            "SelfConsInd": false,
            "BackLogQty":false,
            "CNPJ_NO": true,
            /* Editable Logic*/


            /* Visible Logic*/
            ReqIdVisible: true,
            createdVisible: false,
            NfeCustomerVisible: false,
            NfeBillingVisible: false,
            WeekVisible: false,
            ManagerIdVisible: false,
            AccountMngVisible: false,
            PlantGrpVisible: true,
            PlantVisible: true,
            CustomerIdVisible: false,
            SoldToNameVisible: true,
            MaterialVisible: true,
            MaterialDescVisible: true,
            FormulaKeyVisible: false,
            FormulaKeyDescVisible: false,
            IncotermsVisible: false,
            BusinessScenarioVisible: false,
            CustomerReqQtyVisible: false,
            PrevDueQtyVisible: false,
            AmConfQtyVisible: true,
            CurrentDueQtyVisible: false,
            ReqDelDatVisible: false,
            ReqDelDayVisible: false,
            PackRequestedVisible: false,
            CuttingQtyVisible: true,
            CuttingQtyMonVisible: true,
            PoNoVisible: false,
            ProtocolIDVisible: false,
            PaymentTermsnVisible: false,
            SelfConsIndVisible: false,
            DelInstrVisible: false,
            ContractReqVisible: false,
            ContractItemNoVisible: false,
            ShipToVisible: false,
            ProtocolPriceVisible: false,
            ContractFinalizedVisible: true,
            SoCreatedVisible: true,
            SoItemVisible: true,
            ContractSelErrorVisible: true,
            SoCreErrorVisible: true,
            BackLogQtyVisible:false,
            CNPJVisible:false
            /* Visible Logic*/
          };
        }
        else {
          var obj = {
            /* Editable Logic*/
            "NfeCustomer": false,
            "NfeBilDoc": false,
            "shipTo": false,
            "priceToCustomer": false,
            "contractReq": false,
            "contractItem": false,
            "cuttingQty": false,
            "mon": false,
            "tues": false,
            "wed": false,
            "thurs": false,
            "fri": false,
            "sat": false,
            "sun": false,
            "bagsSelected": false,
            "AmConfQty": false,
            "ReqDelDat": false,
            "PackRequested": false,
            "PoNo": false,
            "PaymentTermsn": false,
            "DelInstr": false,
            "SelfConsInd": false,
            "BackLogQty":false,
            "CNPJ_NO": true,
            /* Editable Logic*/


            /* Visible Logic*/
            ReqIdVisible: true,
            createdVisible: false,
            NfeCustomerVisible: false,
            NfeBillingVisible: false,
            WeekVisible: false,
            ManagerIdVisible: false,
            AccountMngVisible: false,
            PlantGrpVisible: true,
            PlantVisible: true,
            CustomerIdVisible: false,
            SoldToNameVisible: true,
            MaterialVisible: true,
            MaterialDescVisible: true,
            FormulaKeyVisible: false,
            FormulaKeyDescVisible: false,
            IncotermsVisible: false,
            BusinessScenarioVisible: false,
            CustomerReqQtyVisible: false,
            PrevDueQtyVisible: false,
            AmConfQtyVisible: true,
            CurrentDueQtyVisible: false,
            ReqDelDatVisible: false,
            ReqDelDayVisible: false,
            PackRequestedVisible: false,
            CuttingQtyVisible: true,
            CuttingQtyMonVisible: true,
            PoNoVisible: false,
            ProtocolIDVisible: false,
            PaymentTermsnVisible: false,
            SelfConsIndVisible: false,
            DelInstrVisible: false,
            ContractReqVisible: false,
            ContractItemNoVisible: false,
            ShipToVisible: false,
            ProtocolPriceVisible: false,
            ContractFinalizedVisible: false,
            SoCreatedVisible: true,
            SoItemVisible: true,
            ContractSelErrorVisible: false,
            SoCreErrorVisible: true,
            BackLogQtyVisible:true,
            CNPJVisible:false
            /* Visible Logic*/
          };
        }
        var model = new JSONModel(obj);
        this.getOwnerComponent().setModel(model, "DisplayModel");
        
      },

      getRouter: function () {
        return UIComponent.getRouterFor(this);
      },

      handleAccManagerF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.pDialog) {
          this.pDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },
      handleIncotermsF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.incoDialog) {
          this.incoDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },
      handleWeekF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.weekDialog) {
          this.weekDialog.then(function (Dialog) {
            Dialog.open();
          });
        }
      },
      //  Begin the code 
      //                 OTC_I655: Workbench TR : DA1K909941
      //                   New F4 help added as part of new changes 
      handleSingleWeekF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.weekDialog) {
          this.weekDialog.then(function (Dialog) {
            Dialog.open();
          });
        }
      },
      //End the code
      handlePlantF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.plantDialog) {
          this.plantDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },

      handlePlantGroupF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.plantGroupDialog) {
          this.plantGroupDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },
      handleFormulaKeyF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.formulaKeyDialog) {
          this.formulaKeyDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },
      handleCustomerF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.customerDialog) {
          this.customerDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },
      handleMaterialF4: function (oEvt) {
        this._oMultiInput = oEvt.getSource();
        if (this.materialDialog) {
          this.materialDialog.then(function (sDialog) {
            sDialog.open();
          });
        }
      },
      onValueHelpOkPress: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        this._oMultiInput.setTokens(aTokens);
        this.onCloseDialog();
      },
      onValueHelpOkPressContract: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        if (aTokens.length > 1) {
          sap.m.MessageToast.show(i18n.getText("oneContract"));
        }
        else {
          this._oMultiInput.setValue(aTokens[0].getProperty("key"));
          this.onCloseDialog();
          this.row.ContractItemNo = aTokens[0].getProperty("text").split("(")[0].trim();
        }
      },
      onValueHelpOkPressShipTo: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        if (aTokens.length > 1) {
          sap.m.MessageToast.show(i18n.getText("oneShipTo"));
        }
        else {
          this._oMultiInput.setValue(aTokens[0].getProperty("key"));
          this.onCloseDialog();
        }
      },
      onColumnFreeze: function (oEvt) {
        var oTable = oEvt.getSource().getParent().getParent();
        var value = parseInt(oEvt.getSource().getValue());
        if (isNaN(value)) {
          oTable.setFixedColumnCount(0);
        }
        else {
          oTable.setFixedColumnCount(value);
        }
      },
      onValueHelpCancelPress: function () {
        this.onCloseDialog();
      },
      onCloseDialog: function () {
        if (this._oMultiInput.getId().includes("accMngInput")) {
          this._oVHD.close();
        }
        else if (this._oMultiInput.getId().includes("plantInput")) {
          this._oVHDPlant.close();
        }
        else if (this._oMultiInput.getId().includes("plantGroupInput")) {
          this._oVHDPlantGroup.close();
        }
        else if (this._oMultiInput.getId().includes("formulaKeyInput")) {
          this._oVHDFormulaKey.close();
        }
        else if (this._oMultiInput.getId().includes("customerInput")) {
          this._oVHDCustomer.close();
        }
        else if (this._oMultiInput.getId().includes("materialInput")) {
          this._oVHDMaterial.close();
        }
        else if (this._oMultiInput.getId().includes("weekInput")) {
          this._oVHDWeek.close();
        }
        else if (this._oMultiInput.getId().includes("incotermsInput")) {
          this._oVHDInco.close();
        }
        else if (this._oMultiInput.getId().includes("contractInput")) {
          this._oVHDContract.close();
        }
        else if (this._oMultiInput.getId().includes("shipToInput")) {
          this._oVHDShipTo.close();
        }

      },
      onFilterBarSearch: function (oEvent) {
        var sSearchQuery;
        var aSelectionSet = oEvent.getParameter("selectionSet");
        if (this._oMultiInput.getId().includes("accMngInput")) {
          sSearchQuery = this._oBasicSearchField.getValue();
        }

        if (this._oMultiInput.getId().includes("plantInput")) {
          sSearchQuery = this._oBasicSearchFieldPlant.getValue();
        }
        if (this._oMultiInput.getId().includes("plantGroupInput")) {
          sSearchQuery = this._oBasicSearchFieldPlantGroup.getValue();
        }
        if (this._oMultiInput.getId().includes("formulaKeyInput")) {
          sSearchQuery = this._oBasicSearchFieldFormulaKey.getValue();
        }
        if (this._oMultiInput.getId().includes("customerInput")) {
          sSearchQuery = this._oBasicSearchFieldCustomer.getValue();
        }
        if (this._oMultiInput.getId().includes("materialInput")) {
          sSearchQuery = this._oBasicSearchFieldMaterial.getValue();
        }
        if (this._oMultiInput.getId().includes("weekInput")) {
          sSearchQuery = this._oBasicSearchFieldWeek.getValue();
        }
        if (this._oMultiInput.getId().includes("weekInput")) {
          sSearchQuery = this._oBasicSearchFieldWeek.getValue();
        }
        if (this._oMultiInput.getId().includes("incotermsInput")) {
          sSearchQuery = this._oBasicSearchFieldInco.getValue();
        }
        if (this._oMultiInput.getId().includes("contractInput")) {
          sSearchQuery = this._oBasicSearchFieldContract.getValue();
        }
        if (this._oMultiInput.getId().includes("shipToInput")) {
          sSearchQuery = this._oBasicSearchFieldShipTo.getValue();
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
        if (this._oMultiInput.getId().includes("accMngInput")) {
          oVHD = this._oVHD;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "KUNNR", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "NAME", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("plantInput")) {
          oVHD = this._oVHDPlant;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "werks", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "Name", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("plantGroupInput")) {
          oVHD = this._oVHDPlantGroup;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "PLANT_GRP", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "Text", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("formulaKeyInput")) {
          oVHD = this._oVHDFormulaKey;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "FKEY", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "FDESC", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("customerInput")) {
          oVHD = this._oVHDCustomer;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "kunnr", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "Name", operator: FilterOperator.Contains, value1: sSearchQuery }),
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("materialInput")) {
          oVHD = this._oVHDMaterial;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "matnr", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "maktx", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("weekInput")) {
          oVHD = this._oVHDWeek;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "Week", operator: FilterOperator.Contains, value1: sSearchQuery }),
              new Filter({ path: "Current_Week", operator: FilterOperator.Contains, value1: sSearchQuery }),
             
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("incotermsInput")) {
          oVHD = this._oVHDInco;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "INCOTERMSCLASSIFICATION", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("contractInput")) {
          oVHD = this._oVHDContract;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "ContractNumber", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        if (this._oMultiInput.getId().includes("shipToInput")) {
          oVHD = this._oVHDShipTo;
          aFilters.push(new Filter({
            filters: [
              new Filter({ path: "ShipTo", operator: FilterOperator.Contains, value1: sSearchQuery })
            ],
            and: false
          }));
        }
        // if (this._oMultiInput.getId().includes("weekInput")) {
        //   oVHD = this._oVHDWeek;
        //   aFilters.push(new Filter({
        //     filters: [
        //       new Filter({ path: "Week", operator: FilterOperator.Contains, value1: sSearchQuery })
        //     ],
        //     and: false
        //   }));
        // }
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
      onCancelDH: function () {
        this.getRouter().navTo("RouteSchedulingPtocess");
      },
      createContractDialog: function (oData) {
        this._oBasicSearchFieldContract = new SearchField();  //
        if (!this.contractDialog) {
          this.contractDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.contractF4"
          });
        }
        this.contractDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDContract = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Contract",
            key: "ContractNumber",
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
              oTable.addColumn(new UIColumn({ label: "Contract", template: "ContractNumber" }));
              oTable.addColumn(new UIColumn({ label: "Item", template: "Item" }));
            //    Begin the code.
            // PCN#419 - Adding validation for MosSchdQty field
            // Work Bench TR - DA1K923658 
              oTable.addColumn(new UIColumn({ label: "Open Qty", template: "OpenQty" }));
              //End the code
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createShipToDialog: function (oData) {
        this._oBasicSearchFieldShipTo = new SearchField();  //
        if (!this.shipToDialog) {
          this.shipToDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.shipToF4"
          });
        }
        this.shipToDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDShipTo = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "ShipTo",
            key: "ShipTo",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(true);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldShipTo);
          // this._oBasicSearchFieldShipTo.attachSearch(function () {
          //   oFilterBar.search();
          // });

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
              oTable.addColumn(new UIColumn({ label: "ShipTo", template: "ShipTo" }));
              oTable.addColumn(new UIColumn({ label: "Name", template: "Name" }));
              oTable.addColumn(new UIColumn({ label: "City", template: "City" }));
              oTable.addColumn(new UIColumn({ label: "PostalCode", template: "PostalCode" }));
              oTable.addColumn(new UIColumn({ label: "SearchTerm", template: "SearchTerm" }));
            }
            oDialog.update();
            //  oDialog.open();
          }.bind(this));


        }.bind(this));
      },
      createWeekDialog: function (oData) {
        this._oBasicSearchFieldWeek = new SearchField();
        if (!this.weekDialog) {
          this.weekDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.weekF4"
          });
        }
        this.weekDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDWeek = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Week",
            key: "Week",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldWeek);
          this._oBasicSearchFieldWeek.attachSearch(function () {
            oFilterBar.search();
          });

          oDialog.getTableAsync().then(function (oTable) {

            // var weekSelection = sap.ui.getCore().getModel("weekSelectionModel").getData().week;
            // weekSelection = weekSelection[0].getText()[0];

            // var tempData = oData.results;
            // for (let i=0; i<tempData.length; i++){
            //   if (tempData[i].Current_Week != weekSelection){
            //     tempData.splice(i, 1);
            //   }
            // }
            var oModel = new JSONModel(oData);
            oTable.setModel(oModel);
            if (oTable.bindRows) {
              oTable.bindAggregation("rows", {
                path:"/results",
                events: {
                  dataReceived: function () {
                    oDialog.update();
                  }
                }
              });
              oTable.addColumn(new UIColumn({ label: "Week", template: "Week" }));
              
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createWeekDialogSendDataO9: function(oData){
        this._oBasicSearchFieldWeek = new SearchField();
        if (!this.weekDialog) {
          this.weekDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.weekF4"
          });
        }
        this.weekDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDWeek = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Week",
            key: "Week",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldWeek);
          this._oBasicSearchFieldWeek.attachSearch(function () {
            oFilterBar.search();
          });

          oDialog.getTableAsync().then(function (oTable) {

            var weekSelection = sap.ui.getCore().getModel("weekSelectionModel").getData().week;
            weekSelection = weekSelection[0].getText()[0];

            var tempData = oData.results;
            for (let i=0; i<tempData.length; i++){
              if (tempData[i].Current_Week != weekSelection){
                tempData.splice(i, 1);
              }
            }
            var oModel = new JSONModel(oData);
            oTable.setModel(oModel);
            if (oTable.bindRows) {
              oTable.bindAggregation("rows", {
                path:"/results",
                events: {
                  dataReceived: function () {
                    oDialog.update();
                  }
                }
              });
              // oTable.removeAllCoumns();
              if(oTable.getColumns().length>0){
                oTable.removeAllCoumns();
              }
              oTable.addColumn(new UIColumn({ label: "Week", template: "Week" }));
              
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createSingleWeekDialog: function (oData) {
        this._oBasicSearchFieldWeek = new SearchField();
        if (!this.weekDialog) {
          this.weekDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.weekF4SingleSelect"
          });
        }
        this.weekDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDWeek = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Week",
            key: "Week",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldWeek);
          this._oBasicSearchFieldWeek.attachSearch(function () {
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
              oTable.addColumn(new UIColumn({ label: "Week", template: "Week" }));
              oTable.addColumn(new UIColumn({ label: "Current Week", template: "Current_Week" }));
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createAccManagerDialog: function (oData) {
        this._oBasicSearchField = new SearchField();
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.accManagerF4"
          });
        }
        this.pDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHD = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Account Manager",
            key: "KUNNR",
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
              oTable.addColumn(new UIColumn({ label: "Account Manager", template: "KUNNR" }));
              oTable.addColumn(new UIColumn({ label: "Name", template: "NAME" }));
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createPlantDialog: function (oData) {
        this._oBasicSearchFieldPlant = new SearchField();
        if (!this.plantDialog) {
          this.plantDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.plantF4"
          });
        }
        this.plantDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDPlant = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Plant",
            key: "werks",
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
              oTable.addColumn(new UIColumn({ label: "Plant", template: "werks" }));
              oTable.addColumn(new UIColumn({ label: "Name", template: "Name" }));
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createPlantGroupDialog: function (oData) {
        this._oBasicSearchFieldPlantGroup = new SearchField();
        if (!this.plantGroupDialog) {
          this.plantGroupDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.plantGroupF4"
          });
        }
        this.plantGroupDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDPlantGroup = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Plant Group",
            key: "PLANT_GRP",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldPlantGroup);
          this._oBasicSearchFieldPlantGroup.attachSearch(function () {
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
              oTable.addColumn(new UIColumn({ label: "Plant Group", template: "PLANT_GRP" }));
              oTable.addColumn(new UIColumn({ label: "Plant Group Description", template: "Text" }));

            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createFormulaKeyDialog: function (oData) {
        this._oBasicSearchFieldFormulaKey = new SearchField();
        if (!this.formulaKeyDialog) {
          this.formulaKeyDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.formulaKeyF4"
          });
        }
        this.formulaKeyDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDFormulaKey = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Formula Key",
            key: "FKEY",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldPlantGroup);
          this._oBasicSearchFieldPlantGroup.attachSearch(function () {
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
              oTable.addColumn(new UIColumn({ label: "Formula Key", template: "FKEY" }));
              oTable.addColumn(new UIColumn({ label: "Description", template: "FDESC" }));
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createCustomerDialog: function (oData) {
        this._oBasicSearchFieldCustomer = new SearchField();
        if (!this.customerDialog) {
          this.customerDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.customerF4"
          });
        }
        this.customerDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDCustomer = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Customer",
            key: "kunnr",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldCustomer);
          this._oBasicSearchFieldCustomer.attachSearch(function () {
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
              oTable.addColumn(new UIColumn({ label: "Customer", template: "kunnr" }));
              oTable.addColumn(new UIColumn({ label: "Name", template: "Name" }));
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createMaterialDialog: function (oData) {
        this._oBasicSearchFieldMaterial = new SearchField();
        if (!this.materialDialog) {
          this.materialDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.materialF4"
          });
        }
        this.materialDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDMaterial = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "Material",
            key: "matnr",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldMaterial);
          this._oBasicSearchFieldMaterial.attachSearch(function () {
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
              oTable.addColumn(new UIColumn({ label: "Material", template: "matnr" }));
              oTable.addColumn(new UIColumn({ label: "Description", template: "maktx" }));
            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
      },
      createIncotermDialog: function (oData) {
        this._oBasicSearchFieldInco = new SearchField();
        if (!this.incoDialog) {
          this.incoDialog = this.loadFragment({
            name: "schedulingprocess.schedulingprocess.fragments.incotermF4"
          });
        }
        this.incoDialog.then(function (oDialog) {
          var oFilterBar = oDialog.getFilterBar();
          this._oVHDInco = oDialog;
          this.getView().addDependent(oDialog);
          oDialog.setRangeKeyFields([{
            label: "INCOTERMS CLASSIFICATION",
            key: "INCOTERMSCLASSIFICATION",
            type: "string",
            typeInstance: new TypeString({}, {
              maxLength: 7
            })
          }]);
          oFilterBar.setFilterBarExpanded(false);
          oFilterBar.setBasicSearch(this._oBasicSearchFieldInco);
          this._oBasicSearchFieldInco.attachSearch(function () {
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
              oTable.addColumn(new UIColumn({ label: "INCOTERMS CLASSIFICATION", template: "INCOTERMSCLASSIFICATION" }));
              oTable.addColumn(new UIColumn({ label: "INCOTERMS CLASSIFICATION NAME", template: "Incotermsclassificationname" }));

            }
            oDialog.update();
          }.bind(this));


        }.bind(this));
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
      createFiltersMargin: function (control, filters, value) {
        if(isNaN(control)){
          var oFilter = new Filter(value, FilterOperator.EQ, "0.0");
          filters.push(oFilter);
        }else{
        var oFilter = new Filter(value, FilterOperator.EQ, control);
        filters.push(oFilter);
        }
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
      onMessagePopOver: function (oEvent) {
        this.oMessagePopover.openBy(oEvent.getSource());
      },
      createMessagePopOver: function () {
        if (!this.oMessagePopover) {
          this.oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "schedulingprocess.schedulingprocess.fragments.MessagePopover", this);
          this.getView().addDependent(this.oMessagePopover);
        }
        return this.oMessagePopover;
      }



    });
  }
);
