/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"oupptp./z_ptp_planners_cockpit/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
