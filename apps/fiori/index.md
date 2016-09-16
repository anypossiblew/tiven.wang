---
layout: laboratory
title: SAP Fiori Laboratory by Tiven
excerpt: "A Laboratory for Fiori usage by Tiven"
tags: [SAP, Fiori, UI5, ERP]
laboratory:
  title: "SAP Fiori Laboratory"
  description: "SAP Fiori Developer With 5 Years experience on web development.Mobile API,Mobile Payment,Create Payment API"
projects:
  - title: "My Fiori Resume"
    description: "my resume developed using SAP Fiori"
    page: "/fiori/"
    previewImage: "/apps/map/images/thumbs/01.jpg"
  - title: "Fiori App"
    description: "App developed using SAP Fiori 2"
    page: "app/"
    previewImage: "/apps/map/images/thumbs/02.jpg"
---

```javascript
sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "QuickStartApplication/model/models"
], function(UIComponent, Device, models) {
  "use strict";

  return UIComponent.extend("QuickStartApplication.Component", {

    metadata: {
      manifest: "json"
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {
      // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);

      // set the device model
      this.setModel(models.createDeviceModel(), "device");
    }
  });

});
```
