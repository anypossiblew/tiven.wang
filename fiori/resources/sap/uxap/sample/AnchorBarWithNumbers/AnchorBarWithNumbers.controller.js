sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/core/mvc/Controller"], function (JSONModel, Controller) {
	"use strict";

	return Controller.extend("sap.uxap.sample.AnchorBarWithNumbers.AnchorBarWithNumbers", {
		onInit: function () {
			var oJsonModel = new JSONModel("./resources/sap/uxap/sample/AnchorBarWithNumbers/HRData.json");

			this.getView().setModel(oJsonModel, "ObjectPageModel");
		},
		
		onPressBookmark: function() {
		    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
	                window.sidebar.addPanel(document.title,window.location.href,'');
	            } else if(window.external && ('AddFavorite' in window.external)) { // IE Favorite
	                window.external.AddFavorite(location.href,document.title); 
	            } else if(window.opera && window.print) { // Opera Hotlist
	                this.title=document.title;
	                return true;
	            } else { // webkit - safari/chrome
	                alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
	            }
		},
		
		onPressPrint: function() {
			window.print();
		}
	});
});
