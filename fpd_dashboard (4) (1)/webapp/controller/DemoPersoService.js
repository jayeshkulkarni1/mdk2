sap.ui.define(['sap/ui/thirdparty/jquery'],
	function(jQuery) {
	"use strict";

	// Very simple page-context personalization
	// persistence service, not for productive use!
	var DemoPersoService = {

		oData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "demoApp-table-SalesOrderItem",
					order: 2,
					text: "Sales Order Item",
					visible: true
				},
				{
					id: "demoApp-table-SalesOrder",
					order: 1,
					text: "Sales Order",
					visible: true
				},
				// {
				// 	id: "perso-table-SalesOrg",
				// 	order: 3,
				// 	text: "Sales Organisation",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Division",
				// 	order: 4,
				// 	text: "Division",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-OrderType",
				// 	order: 5,
				// 	text: "Order Type",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-OrderCreateDate",
				// 	order: 6,
				// 	text: "Order Creation Date",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-SoldTo",
				// 	order: 7,
				// 	text: "Sold To",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-ShipTo",
				// 	order: 8,
				// 	text: "Ship To",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-SalesOrderQty",
				// 	order: 9,
				// 	text: "Sales Order Quantity",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Material",
				// 	order: 10,
				// 	text: "Material",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-DelvPlant",
				// 	order: 11,
				// 	text: "Plant",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-CsrNumber",
				// 	order: 12,
				// 	text: "Customer PO",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-CallByDate",
				// 	order: 13,
				// 	text: "Call By Date",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-ExSpace",
				// 	order: 14,
				// 	text: "Ex Space Indicator",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Message",
				// 	order: 15,
				// 	text: "Message",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-ConfirmedQty",
				// 	order: 16,
				// 	text: "Confirmed Quantity",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-FpdStatus",
				// 	order: 17,
				// 	text: "Status",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-SalesOrderStock",
				// 	order: 18,
				// 	text: "Sales Order Stock",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-Sto",
				// 	order: 19,
				// 	text: "Sto",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-StoItem",
				// 	order: 20,
				// 	text: "Sto Item",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-StoDelv",
				// 	order: 21,
				// 	text: "Sto Delivery",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-StoDelvItem",
				// 	order: 22,
				// 	text: "Sto Delivery Item",
				// 	visible: false
				// },
				// {
				// 	id: "perso-table-PricedDate",
				// 	order: 23,
				// 	text: "Priced Date",
				// 	visible: false
				// }
			]
		},

		oResetData : {
			_persoSchemaVersion: "1.0",
			aColumns : [
				{
					id: "demoApp-table-SalesOrderItem",
					order: 2,
					text: "Sales Order Item",
					visible: true
				},
				{
					id: "demoApp-table-SalesOrder",
					order: 1,
					text: "Sales Order",
					visible: true
				},
				// {
				// 	id: "perso-table-SalesOrg",
				// 	order: 3,
				// 	text: "Sales Organisation",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Division",
				// 	order: 4,
				// 	text: "Division",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-OrderType",
				// 	order: 5,
				// 	text: "Order Type",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-OrderCreateDate",
				// 	order: 6,
				// 	text: "Order Creation Date",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-SoldTo",
				// 	order: 7,
				// 	text: "Sold To",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-ShipTo",
				// 	order: 8,
				// 	text: "Ship To",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-SalesOrderQty",
				// 	order: 9,
				// 	text: "Sales Order Quantity",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Material",
				// 	order: 10,
				// 	text: "Material",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-DelvPlant",
				// 	order: 11,
				// 	text: "Plant",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-CsrNumber",
				// 	order: 12,
				// 	text: "Customer PO",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-CallByDate",
				// 	order: 13,
				// 	text: "Call By Date",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-ExSpace",
				// 	order: 14,
				// 	text: "Ex Space Indicator",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Message",
				// 	order: 15,
				// 	text: "Message",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-ConfirmedQty",
				// 	order: 16,
				// 	text: "Confirmed Quantity",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-FpdStatus",
				// 	order: 17,
				// 	text: "Status",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-SalesOrderStock",
				// 	order: 18,
				// 	text: "Sales Order Stock",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-Sto",
				// 	order: 19,
				// 	text: "Sto",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-StoItem",
				// 	order: 20,
				// 	text: "Sto Item",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-StoDelv",
				// 	order: 21,
				// 	text: "Sto Delivery",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-StoDelvItem",
				// 	order: 22,
				// 	text: "Sto Delivery Item",
				// 	visible: true
				// },
				// {
				// 	id: "perso-table-PricedDate",
				// 	order: 23,
				// 	text: "Priced Date",
				// 	visible: true
				// }
			]
		},


		getPersData : function () {
			var oDeferred = new jQuery.Deferred();
			if (!this._oBundle) {
				this._oBundle = this.oData;
			}
			oDeferred.resolve(this._oBundle);
			// setTimeout(function() {
			// 	oDeferred.resolve(this._oBundle);
			// }.bind(this), 2000);
			return oDeferred.promise();
		},

		setPersData : function (oBundle) {
			var oDeferred = new jQuery.Deferred();
			this._oBundle = oBundle;
			oDeferred.resolve();
			return oDeferred.promise();
		},

		getResetPersData : function () {
			var oDeferred = new jQuery.Deferred();

			// oDeferred.resolve(this.oResetData);

			setTimeout(function() {
				oDeferred.resolve(this.oResetData);
			}.bind(this), 2000);

			return oDeferred.promise();
		},

		resetPersData : function () {
			var oDeferred = new jQuery.Deferred();

			//set personalization
			this._oBundle = this.oResetData;

			//reset personalization, i.e. display table as defined
			//this._oBundle = null;

			oDeferred.resolve();

			// setTimeout(function() {
			// 	this._oBundle = this.oResetData;
			// 	oDeferred.resolve();
			// }.bind(this), 2000);

			return oDeferred.promise();
		},

		//this caption callback will modify the TablePersoDialog' entry for the 'Weight' column
		//to 'Weight (Important!)', but will leave all other column names as they are.
		getCaption : function (oColumn) {
			if (oColumn.getHeader() && oColumn.getHeader().getText) {
				if (oColumn.getHeader().getText() === "Sales Order") {
					return "Weight (Important!)";
				}
			}
			return null;
		},

		getGroup : function(oColumn) {
			if ( oColumn.getId().indexOf('SalesOrder') != -1 ||
					oColumn.getId().indexOf('SalesOrg') != -1) {
				return "Primary Group";
			}
			return "Secondary Group";
		}
	};

	return DemoPersoService;

});
