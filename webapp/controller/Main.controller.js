sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "oup/ptp/zptpplannerscockpit/model/formatter",
    "sap/m/BusyDialog",
    //"oup/ptp/zptpplannerscockpit/view/fragment.BusyDialog",
  ],
  function (Controller, Fragment, formatter, BusyDialog) {
    "use strict";
    var _oView = null;
    var _oRadioGroup = null;
    var _oDynamicContainer = null;
    var _oReqWlkListModel = null;
    var _oMatListModel = null;
    var _oCombinationModel = null;
    var _oDynamicFilterContainer = null;
    var _oBusyDialog = null;
    return Controller.extend("oup.ptp.zptpplannerscockpit.controller.Main", {
      formatter: formatter,

      onInit: function () {
        _oView = this.getView();
        _oRadioGroup = _oView.byId("reportTypeId");
        _oDynamicContainer = _oView.byId("dynamicTableId");

        _oDynamicFilterContainer = _oView.byId("dynamicTableIdFilter");
        _oReqWlkListModel = this.getOwnerComponent().getModel("ReqWlkList");
        _oMatListModel = this.getOwnerComponent().getModel("MatList");
        _oCombinationModel = this.getOwnerComponent().getModel("Combination");
        _oBusyDialog = new BusyDialog();
        _oBusyDialog.open();
        this.onInitLoadRadioBtn();

        //this.getOwnerComponent().setModel(_oReqWlkListModel);
        // jQuery.sap.delayedCall(10, this, function () {
        //   _oRadioGroup.fireSelect({
        //     selectedIndex: 0,
        // });
        //});
      },
      fullScreenToggledPress: function (oEvent) {
        if (oEvent.getParameters().fullScreen) {
          oEvent.getSource().getTable().setVisibleRowCount(16);
        } else {
          oEvent.getSource().getTable().setVisibleRowCount(10);
        }
      },

      onInitLoadRadioBtn: function () {
        var that = this;
        var _oDynamicRadioBtnContainer = this.getView().byId("dynamicRadioBtn");
        var sFragmentRedio =
          "oup.ptp.zptpplannerscockpit.view.fragment.RadioBtn";
        var sFragmentName =
          "oup.ptp.zptpplannerscockpit.view.fragment.ReqWlkList";
        var sFragmentFilterName =
          "oup.ptp.zptpplannerscockpit.view.fragment.ReqWlkListFilter";

        this.getView().setModel(_oReqWlkListModel);

        Fragment.load({
          name: sFragmentName,
          controller: this,
        }).then(function (oFragment) {
          _oDynamicContainer.addItem(oFragment);
          var oContentTable = oFragment.getItems()[0];
          oContentTable.attachBusyStateChanged(that._onBusyStateChanged);
        });

        Fragment.load({
          name: sFragmentFilterName,
          controller: this,
        }).then(function (oFragment) {
          _oDynamicFilterContainer.addItem(oFragment);
        });

        Fragment.load({
          name: sFragmentRedio,
          controller: this,
        }).then(function (oFragment) {
          _oDynamicRadioBtnContainer.addItem(oFragment);
          _oBusyDialog.close();
        });
      },
      onReportTypeSelect: function (oEvent) {
        var that = this;
        var iSelectedIndex = oEvent.getParameter("selectedIndex");
        var sText = oEvent.getSource().getButtons()[iSelectedIndex].getText();
        var sFragmentName = "oup.ptp.zptpplannerscockpit.view.fragment.";
        var sFragmentFilterName = "oup.ptp.zptpplannerscockpit.view.fragment.";

        // destroy dynamic container items
        _oDynamicContainer.destroyItems();
        _oDynamicFilterContainer.destroyItems();

        if (sText === "Requisitions Worklist") {
          sFragmentName += "ReqWlkList";
          sFragmentFilterName += "ReqWlkListFilter";
          // this._onLoadPO();
        } else if (sText === "Materials List") {
          sFragmentName += "MatList";
          sFragmentFilterName += "MatListFilter";
          // this._onLoadPR();
        } else if (sText === "Combination") {
          sFragmentName += "Combination";
          sFragmentFilterName += "CombinationFilter";
        }

        Fragment.load({
          name: sFragmentFilterName,
          controller: this,
        }).then(function (oFragment) {
          if (sText === "Requisitions Worklist") {
            // that.getView().setModel(_oReqWlkListModel);
          } else if (sText === "Materials List") {
            //   that.getView().setModel(_oMatListModel);
          } else if (sText === "Combination") {
            //     that.getView().setModel(_oCombinationModel);
          }
          _oDynamicFilterContainer.addItem(oFragment);
        });
        Fragment.load({
          name: sFragmentName,
          controller: this,
        }).then(function (oFragment) {
          if (sText === "Requisitions Worklist") {
            that.getView().setModel(_oReqWlkListModel);
          } else if (sText === "Materials List") {
            that.getView().setModel(_oMatListModel);
          } else if (sText === "Combination") {
            that.getView().setModel(_oCombinationModel);
          }
          _oDynamicContainer.addItem(oFragment);
          var oContentTable = oFragment.getItems()[0];
          oContentTable.attachBusyStateChanged(that._onBusyStateChanged);
        });
      },

      handlePurchaseReqPress: function (oEvent) {
        var oSource = oEvent.getSource();
        var bMaterial = oSource.data("MATERIAL") === "Material";
        var oBindingContext = oSource.getBindingContext();
        var oBindingContextData = oBindingContext.getObject();

        var CreationDate = oBindingContextData.CreationDate;
        var DeliveryDate = oBindingContextData.DeliveryDate;
        var MRPController = oBindingContextData.MRPController;
        var MRPController_Text = oBindingContextData.MRPController_Text;
        var Market = oBindingContextData.Market;
        var McoQty = oBindingContextData.McoQty;
        var PackInfo = oBindingContextData.PackInfo;
        var Plant = oBindingContextData.Plant;
        var Plant_Text = oBindingContextData.Plant_Text;
        var PurchaseRequisition = oBindingContextData.PurchaseRequisition;
        var PurchaseRequisitionItem =
          oBindingContextData.PurchaseRequisitionItem;
        var PurchaseRequisitionReleaseDate =
          oBindingContextData.PurchaseRequisitionReleaseDate;
        var RequestedQuantity = oBindingContextData.RequestedQuantity;
        var RequirementTracking = oBindingContextData.RequirementTracking;
        var Status = oBindingContextData.Status;
        var Status_Text = oBindingContextData.Status_Text;
        var Stock = oBindingContextData.Stock;
        var VelocityCostCode = oBindingContextData.VelocityCostCode;
        var ZZ1_ABCIndicator_PRD = oBindingContextData.ZZ1_ABCIndicator_PRD;
        var ZZ1_ABCIndicator_PRD_Text =
          oBindingContextData.ZZ1_ABCIndicator_PRD_Text;
        var ZZ1_IMPRESSION_NUM_PRI = oBindingContextData.ZZ1_IMPRESSION_NUM_PRI;

        var oTarget = {
          semanticObject: "PurchaseRequisition",
          action: "releaseSingle",
        };

        // update date to ISO Date String
        if (CreationDate) {
          CreationDate = CreationDate.toISOString();
        }
        if (DeliveryDate) {
          DeliveryDate = DeliveryDate.toISOString();
        }
        if (PurchaseRequisitionReleaseDate) {
          PurchaseRequisitionReleaseDate =
            PurchaseRequisitionReleaseDate.toISOString();
        }

        var oParams = {
          CreationDate,
          DeliveryDate,
          MRPController,
          MRPController_Text,
          Market,
          McoQty,
          PackInfo,
          Plant,
          Plant_Text,
          PurchaseRequisition,
          PurchaseRequisitionItem,
          PurchaseRequisitionReleaseDate,
          RequestedQuantity,
          RequirementTracking,
          Status,
          Status_Text,
          Stock,
          VelocityCostCode,
          ZZ1_ABCIndicator_PRD,
          ZZ1_ABCIndicator_PRD_Text,
          ZZ1_IMPRESSION_NUM_PRI,
        };

        if (bMaterial) {
          var Material = oBindingContextData.Material;
          var Material_Text = oBindingContextData.Material_Text;

          oParams.Material = Material;
          oParams.Material_Text = Material_Text;
        } else {
          var Product = oBindingContextData.Product;
          var Product_Text = oBindingContextData.Product_Text;

          oParams.Material = Product;
          oParams.Material_Text = Product_Text;
        }

        var sParams = "";
        for (const property in oParams) {
          sParams += `${property}=${oParams[property]}&`;
        }

        if (sParams.length > 0) {
          // remove trailing '&'
          sParams = sParams.substr(0, sParams.length - 1);
        }

        // launch the application in new tab
        sap.m.URLHelper.redirect(
          `#${oTarget.semanticObject}-${oTarget.action}?${sParams}`,
          true /*new window*/
        );
      },

      handleMaterialPress: function (oEvent) {
        var oSource = oEvent.getSource();
        var bMaterial = oSource.data("MATERIAL") === "Material";
        var oBindingContext = oSource.getBindingContext();
        var oBindingContextData = oBindingContext.getObject();

        var CreationDate = oBindingContextData.CreationDate;
        var DeliveryDate = oBindingContextData.DeliveryDate;
        var MRPController = oBindingContextData.MRPController;
        var MRPController_Text = oBindingContextData.MRPController_Text;
        var Market = oBindingContextData.Market;
        var McoQty = oBindingContextData.McoQty;
        var PackInfo = oBindingContextData.PackInfo;
        var Plant = oBindingContextData.Plant;
        var Plant_Text = oBindingContextData.Plant_Text;
        var PurchaseRequisition = oBindingContextData.PurchaseRequisition;
        var PurchaseRequisitionItem =
          oBindingContextData.PurchaseRequisitionItem;
        var PurchaseRequisitionReleaseDate =
          oBindingContextData.PurchaseRequisitionReleaseDate;
        var RequestedQuantity = oBindingContextData.RequestedQuantity;
        var RequirementTracking = oBindingContextData.RequirementTracking;
        var Status = oBindingContextData.Status;
        var Status_Text = oBindingContextData.Status_Text;
        var Stock = oBindingContextData.Stock;
        var VelocityCostCode = oBindingContextData.VelocityCostCode;
        var ZZ1_ABCIndicator_PRD = oBindingContextData.ZZ1_ABCIndicator_PRD;
        var ZZ1_ABCIndicator_PRD_Text =
          oBindingContextData.ZZ1_ABCIndicator_PRD_Text;
        var ZZ1_IMPRESSION_NUM_PRI = oBindingContextData.ZZ1_IMPRESSION_NUM_PRI;

        var oTarget = {
          semanticObject: "Material",
          action: "manage",
        };

        // update date to ISO Date String
        if (CreationDate) {
          CreationDate = CreationDate.toISOString();
        }
        if (DeliveryDate) {
          DeliveryDate = DeliveryDate.toISOString();
        }
        if (PurchaseRequisitionReleaseDate) {
          PurchaseRequisitionReleaseDate =
            PurchaseRequisitionReleaseDate.toISOString();
        }

        var oParams = {
          CreationDate,
          DeliveryDate,
          MRPController,
          MRPController_Text,
          Market,
          McoQty,
          PackInfo,
          Plant,
          Plant_Text,
          PurchaseRequisition,
          PurchaseRequisitionItem,
          PurchaseRequisitionReleaseDate,
          RequestedQuantity,
          RequirementTracking,
          Status,
          Status_Text,
          Stock,
          VelocityCostCode,
          ZZ1_ABCIndicator_PRD,
          ZZ1_ABCIndicator_PRD_Text,
          ZZ1_IMPRESSION_NUM_PRI,
        };

        if (bMaterial) {
          var Material = oBindingContextData.Material;
          var Material_Text = oBindingContextData.Material_Text;

          oParams.Product = Material;
          oParams.Material_Text = Material_Text;
        } else {
          var Product = oBindingContextData.Product;
          var Product_Text = oBindingContextData.Product_Text;

          oParams.Product = Product;
          oParams.Material_Text = Product_Text;
        }

        var sParams = "";
        for (const property in oParams) {
          sParams += `${property}=${oParams[property]}&`;
        }

        if (sParams.length > 0) {
          // remove trailing '&'
          sParams = sParams.substr(0, sParams.length - 1);
        }

        // launch the application in new tab
        sap.m.URLHelper.redirect(
          `#${oTarget.semanticObject}-${oTarget.action}?${sParams}`,
          true /*new window*/
        );
      },

      handleMaterialListPress: function (oEvent) {
        var oSource = oEvent.getSource();
        var oBindingContext = oSource.getBindingContext();
        var oBindingContextData = oBindingContext.getObject();

        var MRPController = oBindingContextData.MRPController;
        var MRPController_Text = oBindingContextData.MRPController_Text;
        var Market = oBindingContextData.Market;
        var PackInfo = oBindingContextData.PackInfo;
        var Plant = oBindingContextData.Plant;
        var Plant_Text = oBindingContextData.Plant_Text;
        var Product = oBindingContextData.Product;
        var Product_Text = oBindingContextData.Product_Text;
        var Stock = oBindingContextData.Stock;
        var VelocityCostCode = oBindingContextData.VelocityCostCode;
        var ZZ1_ABCIndicator_PRD = oBindingContextData.ZZ1_ABCIndicator_PRD;
        var ZZ1_ABCIndicator_PRD_Text =
          oBindingContextData.ZZ1_ABCIndicator_PRD_Text;

        var oTarget = {
          semanticObject: "Material",
          action: "manage",
        };

        var oParams = {
          MRPController,
          MRPController_Text,
          Market,
          PackInfo,
          Plant,
          Plant_Text,
          Product,
          Product_Text,
          Stock,
          VelocityCostCode,
          ZZ1_ABCIndicator_PRD,
          ZZ1_ABCIndicator_PRD_Text,
        };

        var sParams = "";
        for (const property in oParams) {
          sParams += `${property}=${oParams[property]}&`;
        }

        if (sParams.length > 0) {
          // remove trailing '&'
          sParams = sParams.substr(0, sParams.length - 1);
        }

        // launch the application in new tab
        sap.m.URLHelper.redirect(
          `#${oTarget.semanticObject}-${oTarget.action}?${sParams}`,
          true /*new window*/
        );
      },

      handleLinkPress: function (oEvent) {
        var sPath = oEvent.getSource().getBindingContext().sPath;
        var that = this;
        if (!this._pDialog) {
          this._pDialog = Fragment.load({
            id: this.getView().getId(),
            name: "oup.ptp.zptpplannerscockpit.view.fragment.PackInfo",
            controller: this,
          }).then(function (oDialog) {
            //oDialog.setModel(oView.getModel());
            return oDialog;
          });
        }

        this._pDialog.then(
          function (oDialog) {
            oDialog.setModel(that.getView().getModel());

            var oSmartTableHeader = this.getView().byId("headPackInfo");

            var oSmartTableItem = this.getView().byId("ItemPackInfo");

            oSmartTableHeader
              .getTable()
              .bindRows(sPath + "/to_Header", null, null);
            oSmartTableItem.getTable().bindRows(sPath + "/to_Item", null, null);
            oSmartTableItem
              .getTable()
              .attachBusyStateChanged(that._onBusyStateChanged);

            oSmartTableHeader
              .getTable()
              .attachBusyStateChanged(that._onBusyStateChanged);

            oDialog.open();
          }.bind(this)
        );
      },
      onOKPressed: function () {
        this._pDialog.then(
          function (oDialog) {
            //	this._configDialog(oButton, oDialog);
            oDialog.close();
          }.bind(this)
        );
      },
      onPress: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oItem = oEvent.getSource();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var index = oItem.getSelectedIndex();
        if (index >= 0) {
          oRouter.navTo("ObjectPage", {
            obejctPath: oItem.getBinding().aKeys[index],
          });
        }
        //oItem.getParent().removeSelections();
      },
      onPressMat: function (oEvent) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oItem = oEvent.getSource();
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var index = oItem.getSelectedIndex();
        if (index >= 0) {
          oRouter.navTo("ObjectMatPage", {
            obejctPathMat: oItem.getBinding().aKeys[index],
          });
        }

        // oItem.getParent().removeSelections();
      },
      onPressComb: function (oEvent) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        const sPath = oEvent.getParameter("rowContext").getPath();

        oRouter.navTo("ObjectCombPage", {
          obejctPath: encodeURIComponent(sPath),
        });

        // var oItem = oEvent.getSource();
        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        // var index = oItem.getSelectedIndex();
        // if (index >= 0) {
        //   var aPurchaseRequisition = oEvent
        //     .getSource()
        //     .getParent()
        //     .getTable()
        //     .getContextByIndex(index)
        //     .getProperty("PurchaseRequisition");

        //   if (aPurchaseRequisition !== "") {
        //     oRouter.navTo("ObjectCombPage", {
        //       obejctPath: oItem.getBinding().aKeys[index],
        //     });
        //     //oItem.getParent().removeSelections();
        //   } else {
        //     var aProduct = oEvent
        //       .getSource()
        //       .getParent()
        //       .getTable()
        //       .getContextByIndex(index)
        //       .getProperty("Product");
        //     var aPlant = oEvent
        //       .getSource()
        //       .getParent()
        //       .getTable()
        //       .getContextByIndex(index)
        //       .getProperty("Plant");

        //     var sPath =
        //       "ZPTP_C_PLN_COMB(Product='" +
        //       aProduct +
        //       "',Plant='" +
        //       aPlant +
        //       "')";
        //     oRouter.navTo("ObjectCombPage", {
        //       obejctPath: sPath,
        //     });
        //   }
        // }
      },
      _onBusyStateChanged: function (oEvent) {
        var bBusy = oEvent.getParameter("busy");
        if (!bBusy && !this._bColumnOptimizationDone) {
          var oTable = oEvent.getSource();
          var oTpc = null;
          if (sap.ui.table.TablePointerExtension) {
            oTpc = new sap.ui.table.TablePointerExtension(oTable);
          } else {
            oTpc = new sap.ui.table.extensions.Pointer(oTable);
          }
          var aColumns = oTable.getColumns();
          for (var i = aColumns.length; i >= 0; i--) {
            oTpc.doAutoResizeColumn(i);
          }
          //This line can be commented if you want the columns to be adjusted on every scroll
          //this._bColumnOptimizationDone = true;
        }
      },
      fnColumnResize: function (oEvent) {
        oEvent.getSource().attachBusyStateChanged(this._onBusyStateChanged);
        var a = 10;
      },
    });
  }
);
