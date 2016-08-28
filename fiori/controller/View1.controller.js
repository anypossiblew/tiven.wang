sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function(Controller, JSONModel, ResourceModel) {
	"use strict";

	return Controller.extend("QuickStartApplication.controller.View1", {
		onInit: function() {
					
			var partitionModel = new JSONModel();
			partitionModel.loadData('./d3/flare.json');
			
			var that = this;
			partitionModel.attachRequestCompleted(function() {
				that.getView().setModel(this, 'partition');
			});
			
		},
		
		onHomePress: function(oEvent) {
			window.location.replace("/");
		}
		
	});

});