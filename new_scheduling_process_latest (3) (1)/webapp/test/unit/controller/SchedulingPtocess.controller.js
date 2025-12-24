/*global QUnit*/

sap.ui.define([
	"schedulingprocess/schedulingprocess/controller/SchedulingPtocess.controller"
], function (Controller) {
	"use strict";

	QUnit.module("SchedulingPtocess Controller");

	QUnit.test("I should test the SchedulingPtocess controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
