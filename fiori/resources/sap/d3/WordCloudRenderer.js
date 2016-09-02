/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'], function(q) {
    'use strict';
    var N = {};
    N.render = function(oRm, oControl) {
        if (!oControl.getVisible()) {
            return;
        }
        
        oRm.write("<div"); 
        oRm.writeControlData(oControl);  // writes the Control ID and enables event handling - important!        
        oRm.addStyle("width", oControl.getWidth());
        oRm.addStyle("height", oControl.getHeight());        
        oRm.writeStyles();
        oRm.write(">");
        oRm.write("</div>");
    }
    ;
    return N;
}, true);