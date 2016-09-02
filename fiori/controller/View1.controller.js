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
			var words = [];
			partitionModel.attachRequestCompleted(function() {
				that.getView().setModel(this, 'partition');
				var data = this.getData();
				extChildren(data);
				var wordsModel = new JSONModel(words);
				that.getView().setModel(wordsModel, 'words');
			});

			function extChildren(data) {
				var size = 0;
				for(var i in data.children) {
					size = size + extChildren(data.children[i]);
				}
				if(!data.size) {
					data.size = size;
				}
				words.push({key: data.name, value: data.size});
				return data.size;
			}
			
		},
		
		onHomePress: function(oEvent) {
			window.location.replace("/");
		}
		
	});

});