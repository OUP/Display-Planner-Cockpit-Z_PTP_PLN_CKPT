sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";
  return Controller.extend("oup.ptp.zptpplannerscockpit.controller.App", {
    onInit: function () {
      var _oReqWlkListModel = this.getOwnerComponent().getModel("ReqWlkList");
      this.getOwnerComponent().setModel(_oReqWlkListModel);

      // apply content density mode to root view
      this.getView().addStyleClass(
        this.getOwnerComponent().getContentDensityClass()
      );
    },
  });
});
