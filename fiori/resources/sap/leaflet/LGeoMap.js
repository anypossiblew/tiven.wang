/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control'], function(q, C) {
    'use strict';
    var LGeoMap = C.extend('sap.leaflet.LGeoMap', {
        metadata: {
            properties: {
                "width" : {type : "sap.ui.core.CSSSize", defaultValue : "100%"},
        	"height" : {type : "sap.ui.core.CSSSize", defaultValue : "400px"},
        	"crs": {type: "string"},
        	"draggable": {type: "boolean", defaultValue: true},
        	"zoomable": {type: "boolean", defaultValue: true},
        	"centerLat": {type: "float", defaultValue: "0"},
        	"centerLng": {type: "float", defaultValue: "0"},
        	"zoom": {type: "int", defaultValue: "3"}
            },
            aggregations: {},  
	      events: {
	        "mapmouseover": {},
	        "mapmouseout": {},
	        "mapclick": {} 
	      }  
        }
    });
    LGeoMap.prototype.onBeforeRendering = function() {
        this._detachEventListeners();
    }
    ;
    LGeoMap.prototype.onAfterRendering = function() {
        var containerId = this.getId();
      //var center = (this._center) ? this._center : L.latLng(0, -10);
      //var zoom = (this._zoom) ? this._zoom : 2;
      var center = L.latLng(this.getCenterLat(), this.getCenterLng());
      var zoom = this.getZoom();
      var options = {
      	zoom: zoom,
      	center: [this.getCenterLat(), this.getCenterLng()]
      };
      if(this.getCrs()) {
        options.crs = L.CRS[this.getCrs()];
      }
      
      var map = this.map = L.map(containerId, options);
      	var baiduLayer = new L.TileLayer.BaiduLayer("Satellite.Map");
	map.addLayer(baiduLayer);
	map.addLayer(new L.TileLayer.BaiduLayer("Satellite.Road"));
	L.marker(L.latLng(31.207391, 121.608203)).bindPopup('I\'m working in SAP Labs!').addTo(map);
      // apply draggable and zoomable
//      this._applyDraggable();
//      this._applyZoomable();
      this._attachEventListeners();
	setTimeout(function (){
		map.invalidateSize();
	}, 1000);
	
    }
    ;
    LGeoMap.prototype.init = function() {
        //this.data('sap-ui-fastnavgroup', 'true', true);
    }
    ;

    LGeoMap.prototype.exit = function() {
        this._detachEventListeners();
    }
    ;
        
    LGeoMap.prototype._attachEventListeners = function() {      
      if (this.map) {        
//        this.map.on('moveend', jQuery.proxy(this._onMoveEnd, this));
//        this.map.on('zoomend', jQuery.proxy(this._onZoomEnd, this));
      }
    },

    LGeoMap.prototype._detachEventListeners = function() {
      if (this.map) {
//        this.map.off('moveend', jQuery.proxy(this._onMoveEnd, this));
//        this.map.off('zoomend', jQuery.proxy(this._onZoomEnd, this));
      }      
    }
    ;
   
    return LGeoMap;
}, true);
