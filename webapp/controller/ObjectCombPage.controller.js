sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "oup/ptp/zptpplannerscockpit/model/formatter",
  ],
  function (
    Controller,
    Fragment,
    History,
    Filter,
    MessageBox,
    MessageToast,
    formatter
  ) {
    "use strict";

    var _oCombinationModel = null;
    let _bAutCostCalc = false;

    return Controller.extend(
      "oup.ptp.zptpplannerscockpit.controller.ObjectMatPage",
      {
        formatter: formatter,
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          _oCombinationModel = this.getOwnerComponent().getModel("Combination");

          this.getView().setModel(_oCombinationModel);

          // set binding
          this.getView()
            .byId("_idPTPRELREQComb")
            .setModel(this.getOwnerComponent().getModel("RelReq"));

          oRouter
            .getRoute("ObjectCombPage")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
          this._sPath = decodeURIComponent(
            oEvent.getParameter("arguments").obejctPath
          );
          // if (this._sPath === undefined) {
          //   this._sPath = oEvent.mParameters.arguments.obejctPath;
          // }

          // set timeout for async call after 1 second
          setTimeout(() => this.onAfterMatched(), 1000);
        },

        fullScreenToggledPress: function (oEvent) {
          if (oEvent.getParameters().fullScreen) {
            oEvent.getSource().getTable().setVisibleRowCount(14);
          } else {
            oEvent.getSource().getTable().setVisibleRowCount(5);
          }
        },

        onAfterMatched: function () {
          var sPath = this._sPath;

          _oCombinationModel.read(sPath, {
            success: (oData) => {
              if (!oData) {
                return;
              }

              // trigger table rebind
              const oRelReqTable = this.getView().byId("_idPTPRELREQComb");

              oRelReqTable
                .getTable()
                .bindRows(
                  `/ZPTP_C_REL_REQ(P_Material='${oData.Product}',P_Plant='${oData.Plant}')/Set`,
                  null,
                  null
                );
            },
            error: (_oError) => {},
          });

          this.getView().bindElement({
            path: sPath,
            events: {
              dataReceived: (_) => {
                _bAutCostCalc = true;

                // trigger automatic cost calc
                const oCostSegBtn = this.getView().byId("comb-cost-seg-btn-id");
                const oItem = oCostSegBtn.getItems()[0];
                oCostSegBtn.setSelectedItem(oItem);
                oCostSegBtn.setSelectedKey("A");
                oCostSegBtn.fireSelectionChange({
                  item: oItem,
                });
              },
            },
          });

          try {
            this.getView()
              .byId("_idpreviousReprintComb")
              .getTable()
              .bindRows(sPath + "/to_PrePrnt", null, null);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idSalesIBPForecastComb")
              .getTable()
              .bindRows(sPath + "/to_Forecast", null, null);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idISBNTextComb")
              .getTable()
              .bindRows(sPath + "/to_Description", null, null);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idStockDetailsComb")
              .getTable()
              .bindRows(sPath + "/to_StockOvp", null, null);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idCostComb")
              .getTable()
              .bindRows(sPath + "/to_Costs", null, null);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idSalesIBPForecastComb")
              .getItems()[1]
              .attachBusyStateChanged(this._onBusyStateChanged);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idpreviousReprintComb")
              .getItems()[1]
              .attachBusyStateChanged(this._onBusyStateChanged);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idPTPRELREQComb")
              .getItems()[1]
              .attachBusyStateChanged(this._onBusyStateChanged);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idStockDetailsComb")
              .getItems()[1]
              .attachBusyStateChanged(this._onBusyStateChanged);
          } catch (error) {
            // no catch block
          }

          try {
            this.getView()
              .byId("_idCostComb")
              .getTable()
              .attachBusyStateChanged(this._onBusyStateChanged);
          } catch (error) {
            // no catch block
          }

          this.fnDescriptionPack(sPath, "to_PackInfo");
          this.fnDescriptionMarket(sPath, "to_Market");
          this.fnDescriptionProductType(sPath, "to_ProductType");
        },

        fnDescriptionPack: function (sPath, aNav) {
          var that = this;
          var oDataModel = this.getView().getModel();
          that.getView().byId("_iddescPackinfoComb").setText("");

          oDataModel.read(sPath + "/" + aNav, {
            async: false,
            success: function (oData) {
              if (oData !== undefined) {
                that
                  .getView()
                  .byId("_iddescPackinfoComb")
                  .setText(
                    oData.SAP_Description + "(" + oData.ZPACK_INFO + ")"
                  );
              } //successful Read in the server
            },
            error: function (oError) {},
          });
        },

        fnDescriptionMarket: function (sPath, aNav) {
          var that = this;
          var oDataModel = this.getView().getModel();
          that.getView().byId("_IdMarketComb").setText("");

          oDataModel.read(sPath + "/" + aNav, {
            async: false,

            success: function (oData) {
              if (oData !== undefined) {
                that
                  .getView()
                  .byId("_IdMarketComb")
                  .setText(
                    oData.SAP_Description + "(" + oData.ZMARKET_SECTOR + ")"
                  );
              } //successful Read in the server
            },
            error: function (oError) {},
          });
        },

        fnDescriptionProductType: function (sPath, aNav) {
          var that = this;
          var oDataModel = this.getView().getModel();
          that.getView().byId("idProductTypeComb").setText("");

          oDataModel.read(sPath + "/" + aNav, {
            async: false,

            success: function (oData) {
              if (oData !== undefined) {
                that
                  .getView()
                  .byId("idProductTypeComb")
                  .setText(
                    oData.SAP_Description + "(" + oData.ZPRODUCT_TYPE + ")"
                  );
              } //successful Read in the server
            },
            error: function (oError) {},
          });
        },

        onNavBack: function (oEvent) {
          var oHistory = History.getInstance();
          var sPreviousHash = oHistory.getPreviousHash();

          if (sPreviousHash !== undefined) {
            window.history.go(-1);
          } else {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMain", true);
          }
        },

        onPressISBN: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          var oItem = oEvent.getSource();
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          var aISbn = oEvent
            .getSource()
            .getBindingContext()
            .getProperty("Isbn");
          var aPlant = this.getView().getBindingContext().getProperty("Plant");
          var aPath =
            "zptp_c_mat_list(Product='" + aISbn + "',Plant='" + aPlant + "')";
          oRouter.navTo("ObjectMatPage", {
            obejctPathMat: aPath,
          });
        },

        fnZINF: function (oEvent) {
          var aMaterialNumber = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read material number
          var aPlant = this.getView().getBindingContext().getProperty("Plant"); // read Plant
          var asorg = this.getView()
            .getBindingContext()
            .getProperty("ProductSalesOrg");
          var adistChanl = this.getView()
            .getBindingContext()
            .getProperty("ProductDistributionChnl");

          var oTarget = {
            semanticObject: "MATINQ",
            action: "manage",
          };

          var oParams = {
            ISBN: aMaterialNumber,
            Plant: aPlant,
            SalesOrganization: asorg,
            DistributionChannel: adistChanl,
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
            /*new window*/ true
          );

          // read Distribution Channel
          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "MATINQ",
          //                 action: "manage",
          //             },
          //             params: {
          //                 ISBN: aMaterialNumber,
          //                 Plant: aPlant,
          //                 SalesOrganization: asorg,
          //                 DistributionChannel: adistChanl,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // });
        },

        fnZPST: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID
          var aPlant = this.getView().getBindingContext().getProperty("Plant");
          var asorg = this.getView()
            .getBindingContext()
            .getProperty("ProductSalesOrg");
          var adistChanl = this.getView()
            .getBindingContext()
            .getProperty("ProductDistributionChnl");
          var oTarget = {
            semanticObject: "ZPSR",
            action: "manage",
          };

          var oParams = {
            Product: aMaterial,
            Plant: aPlant,
            sorg: asorg,
            distChanl: adistChanl,
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
            /*new window*/ true
          );

          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "ZPSR",
          //                 action: "manage",
          //             },
          //             params: {
          //                 Product: aMaterial,
          //                 Plant: aPlant,
          //                 sorg: asorg,
          //                 distChanl: adistChanl,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnChangeMaterial: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "Material",
            action: "manage",
          };

          var oParams = {
            Material: aMaterial,
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
            /*new window*/ true
          );

          //     var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "Material",
          //                 action: "manage",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnOpenPurchaseOrder: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "PurchaseOrderItem",
            action: "monitorPurDocItems",
          };

          var oParams = {
            Material: aMaterial,
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
            /*new window*/ true
          );

          //     var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service

          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "PurchaseOrderItem",
          //                 action: "monitorPurDocItems",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnBackorderDetails: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "SalesOrder",
            action: "ssb_Backorders",
          };

          var oParams = {
            Material: aMaterial,
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
            /*new window*/ true
          );

          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "SalesOrder",
          //                 action: "ssb_Backorders",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnMaterialRequirementList: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product");
          var aPlant = this.getView().getBindingContext().getProperty("Plant");
          // var aMRPController = this.getView()
          //     .getBindingContext()
          //     .getProperty("MRPController");

          var oTarget = {
            semanticObject: "Material",
            action: "manageStock",
          };

          var oParams = {
            Material: aMaterial,
            Plant: aPlant,
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
            /*new window*/ true
          );

          // read PurchaseOrder from OData path Product/SupplierID
          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "Material",
          //                 action: "manageStock",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //                 Plant: aPlant,
          //                 //MRPArea: aMRPController,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnRequisition: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product");
          var aPlant = this.getView().getBindingContext().getProperty("Plant");
          var aPurchaseRequisition = this.getView()
            .getBindingContext()
            .getProperty("PurchaseRequisition");

          var aPurchaseRequisitionItem = this.getView()
            .getBindingContext()
            .getProperty("PurchaseRequisitionItem");
          // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "PurchaseRequisition",
            action: "maintain",
          };

          var oParams = {
            Material: aMaterial,
            Plant: aPlant,
            PurchaseRequisition: aPurchaseRequisition,
            PurchaseRequisitionItem: aPurchaseRequisitionItem,
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
            /*new window*/ true
          );

          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "PurchaseRequisition",
          //                 action: "maintain",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //                 Plant: aPlant,
          //                 PurchaseRequisition: aPurchaseRequisition,
          //                 PurchaseRequisitionItem: aPurchaseRequisitionItem,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          //}); // navigate to Supplier application
        },

        fnCreateRequisition: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "PurchaseRequisition",
            action: "create",
          };

          var oParams = {
            Material: aMaterial,
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
            /*new window*/ true
          );

          //     var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "PurchaseRequisition",
          //                 action: "create",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnCreatePurchaseOrder: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material"); // read PurchaseOrder from OData path Product/SupplierID
          var oTarget = {
            semanticObject: "PurchaseOrder",
            action: "create",
          };

          var oParams = {
            Material: aMaterial,
            "sap-ui-tech-hint": "GUI",
            uitype: "advanced",
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
            /*new window*/ true
          );
        },

        fnStockMovement: function (oEvent) {
          var aPurchaseOrder = this.extensionAPI
            .getSelectedContexts()[0]
            .getProperty("PurchaseOrder"); // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "Material",
            action: "displayStockOverview",
          };

          var oParams = {
            PurchaseOrder: aPurchaseOrder,
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
            /*new window*/ true
          );
          //     var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "Material",
          //                 action: "displayStockOverview",
          //             },
          //             params: {
          //                 PurchaseOrder: aPurchaseOrder,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        fnStockOverview: function (oEvent) {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID

          var oTarget = {
            semanticObject: "Material",
            action: "displayStockOverview",
          };

          var oParams = {
            Material: aMaterial,
            "sap-ui-tech-hint": "GUI",
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
            /*new window*/ true
          );

          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service
          // var hash =
          //     (oCrossAppNavigator &&
          //         oCrossAppNavigator.hrefForExternal({
          //             target: {
          //                 semanticObject: "Material",
          //                 action: "displayStockOverview",
          //             },
          //             params: {
          //                 Material: aMaterial,
          //             },
          //         })) ||
          //     ""; // generate the Hash to display a Supplier

          // oCrossAppNavigator.toExternal({
          //     target: {
          //         shellHash: hash,
          //     },
          // }); // navigate to Supplier application
        },

        //onBeforeRebind: function (oEvent) {
        //  var mBindingParams = oEvent.getParameter("bindingParams");
        // mBindingParams.parameters["expand"] = "to_PrePrnt";
        //},

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

        onOKPressed: function () {
          this._pDialog.then(
            function (oDialog) {
              //	this._configDialog(oButton, oDialog);
              oDialog.close();
            }.bind(this)
          );
        },

        handlePurchaseOrderPress: function (oEvent) {
          var oSource = oEvent.getSource();
          var oBindingContext = oSource.getBindingContext();
          var oBindingContextData = oBindingContext.getObject();

          var Margin = oBindingContextData.Margin;
          var Material = oBindingContextData.Material;
          var NetPriceAmount = oBindingContextData.NetPriceAmount;
          var OrderPriceUnit = oBindingContextData.OrderPriceUnit;
          var OrderQuantity = oBindingContextData.OrderQuantity;
          var PurchaseOrder = oBindingContextData.PurchaseOrder;
          var PurchaseOrderDate = oBindingContextData.PurchaseOrderDate;
          var PurchaseOrderQuantityUnit =
            oBindingContextData.PurchaseOrderQuantityUnit;
          var Supplier = oBindingContextData.Supplier;
          var Supplier_Text = oBindingContextData.Supplier_Text;
          var ZZ1_IMPRESSION_NUM_PDI =
            oBindingContextData.ZZ1_IMPRESSION_NUM_PDI;

          if (PurchaseOrderDate) {
            PurchaseOrderDate = PurchaseOrderDate.toISOString();
          }

          var oTarget = {
            semanticObject: "PurchaseOrder",
            action: "manage",
          };

          var oParams = {
            Margin,
            Material,
            NetPriceAmount,
            OrderPriceUnit,
            OrderQuantity,
            PurchaseOrder,
            PurchaseOrderDate,
            PurchaseOrderQuantityUnit,
            Supplier,
            Supplier_Text,
            ZZ1_IMPRESSION_NUM_PDI,
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
          var sPath = this.getView().getBindingContext().sPath;
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
              oSmartTableItem
                .getTable()
                .bindRows(sPath + "/to_Item", null, null);
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

        onButtonPress: function (oEvent) {
          var oButton = oEvent.getSource();
          this.byId("actionSheet").openBy(oButton);
        },

        onCostSelectChange: function (oEvent) {
          const sKey = oEvent.getParameter("item").getKey();

          // Automatic Cost Calc.
          if (sKey === "A") {
            this.handleAutCostCalc();
          }
          // Manual Cost Calc.
          else if (sKey === "B") {
            this.handleManCostCalc();
          }
          // Compare ELT Est.
          else {
            this.handleCompareEst();
          }
        },

        handleAutCostCalc: function () {
          var oData = this.getView().getBindingContext().getObject();
          var oDataModel = this.getView().getModel();
          var aFilters = [];

          // purchase requisition
          aFilters.push(
            new Filter("PurchaseRequisition", "EQ", oData.PurchaseRequisition)
          );

          // purchase requisition item
          aFilters.push(
            new Filter(
              "PurchaseRequisitionItem",
              "EQ",
              oData.PurchaseRequisitionItem
            )
          );

          // start busy indicator
          sap.ui.core.BusyIndicator.show(0);

          // read values
          oDataModel.read("/ZPTP_C_RFQ_COST", {
            filters: aFilters,
            success: function (oDataResponse) {
              try {
                var aData = oDataResponse.results || [];

                // table instance
                var oTable = this.getView().byId("_idCostComb").getTable();

                // get rows
                var aRows = oTable.getRows();

                for (let index = 0; index < aRows.length; index++) {
                  // rows
                  const oRow = aRows[index];

                  // row cells
                  var aCells = oRow.getCells();

                  if (index === 0) {
                    // unit cost
                    aCells[0].setText(parseFloat(aData[0].UnitCost).toFixed(2));

                    // quantity
                    aCells[1].setText(parseFloat(aData[0].Quantity).toFixed(2));

                    // production cost total
                    aCells[2].setText(
                      parseFloat(aData[0].ProductionCostTotal).toFixed(2)
                    );

                    // total income
                    aCells[3].setText(
                      parseFloat(aData[0].TotalIncome).toFixed(2)
                    );

                    // margin
                    aCells[4].setText(parseFloat(aData[0].Margin).toFixed(2));

                    // margin  %
                    aCells[5].setText(
                      parseFloat(aData[0].MarginPercentage).toFixed(2)
                    );
                  } else {
                    // unit cost
                    aCells[0].setText("");

                    // quantity
                    aCells[1].setText("");

                    // production cost total
                    aCells[2].setText("");

                    // total income
                    aCells[3].setText("");

                    // margin
                    aCells[4].setText("");

                    // margin  %
                    aCells[5].setText("");
                  }
                }

                if (!_bAutCostCalc) {
                  MessageToast.show(
                    "Automatic cost calculation has updated cost table successfully"
                  );
                }

                _bAutCostCalc = false;

                // stop busy indicator
                sap.ui.core.BusyIndicator.hide();
              } catch (error) {
                // stop busy indicator
                sap.ui.core.BusyIndicator.hide();
              }
            }.bind(this),
            error: function (_oErrorResponse) {
              // stop busy indicator
              sap.ui.core.BusyIndicator.hide();
            },
          });
        },

        handleManCostCalc: function (oEvent) {
          // var aMaterial = oEvent.getSource().getBindingContext().getProperty("matnr");
          // var aPlant    = this.getView().getBindingContext().getProperty("Plant");

          if (!this._pMarginCostDialog) {
            this._pMarginCostDialog = Fragment.load({
              id: this.getView().getId(),
              name: "oup.ptp.zptpplannerscockpit.view.fragment.MarginCost",
              controller: this,
            }).then(function (oDialog) {
              //oDialog.setModel(oView.getModel());
              return oDialog;
            });
          }

          this._pMarginCostDialog.then(
            function (oDialog) {
              oDialog.open();
            }.bind(this)
          );
        },

        handleCompareEst: function () {
          var oData = this.getView().getBindingContext().getObject();
          var oDataModel = this.getView().getModel();
          var aFilters = [];

          // material
          aFilters.push(new Filter("Product", "EQ", oData.Product));

          // impression no.
          aFilters.push(
            new Filter("Impression", "EQ", oData.ZZ1_IMPRESSION_NUM_PRI)
          );

          // start busy indicator
          sap.ui.core.BusyIndicator.show(0);

          // read values
          oDataModel.read("/ZPTP_C_ELT_COST_EST", {
            filters: aFilters,
            success: function (oDataResponse) {
              try {
                var aData = oDataResponse.results || [];

                // table instance
                var oTable = this.getView().byId("_idCostComb").getTable();

                for (let index = 0; index < aData.length; index++) {
                  // restrict to max count of 3
                  if (index === 3) {
                    break;
                  }

                  const oData = aData[index];

                  // first row
                  var oRow = oTable.getRows()[index];

                  // row cells
                  var aCells = oRow.getCells();

                  // unit cost - UnitCost
                  aCells[0].setText(parseFloat(oData.ProdCostUnit).toFixed(2));

                  // quantity
                  aCells[1].setText(parseFloat(oData.Quantity).toFixed(2));

                  // production cost total
                  aCells[2].setText(
                    parseFloat(oData.ProductionCostTotal).toFixed(2)
                  );

                  // total income
                  aCells[3].setText(parseFloat(oData.TotalIncome).toFixed(2));

                  // margin
                  aCells[4].setText(parseFloat(oData.Margin).toFixed(2));

                  // margin  %
                  aCells[5].setText(
                    parseFloat(oData.MarginPercentage).toFixed(2)
                  );
                }

                // display message
                if (aData.length > 0) {
                  const sMessage = aData[0].Message;

                  if (sMessage) {
                    MessageBox.information(sMessage);
                  } else {
                    MessageToast.show(
                      "Compare ELT estimates cost calculation has updated cost table successfully"
                    );
                  }
                } else {
                  const oCostSegBtn = this.getView().byId(
                    "comb-cost-seg-btn-id"
                  );
                  const oItem = oCostSegBtn.getItems()[0];
                  oCostSegBtn.setSelectedItem(oItem);
                  oCostSegBtn.setSelectedKey("A");

                  // hide message
                  _bAutCostCalc = true;

                  // display not loaded message
                  MessageToast.show("Production cost is not loaded yet");
                }

                // stop busy indicator
                sap.ui.core.BusyIndicator.hide();
              } catch (error) {
                // stop busy indicator
                sap.ui.core.BusyIndicator.hide();
              }
            }.bind(this),
            error: function (_oErrorResponse) {
              // stop busy indicator
              sap.ui.core.BusyIndicator.hide();
            },
          });
        },

        onOKMarginPressed: function () {
          this._pMarginCostDialog.then((oDialog) => {
            var oView = this.getView();
            var vFirstCost =
              parseFloat(oView.byId("idFirstCost").getValue()) || 0;
            var vPPBCost = parseFloat(oView.byId("idPPBCost").getValue()) || 0;
            var vFreightCost =
              parseFloat(oView.byId("idFreight").getValue()) || 0;
            var vRoyalty = parseFloat(oView.byId("idRoyalty").getValue()) || 0;
            var vDiscount =
              parseFloat(oView.byId("idDiscount").getValue()) || 0;
            var vUnitSale =
              parseFloat(oView.byId("idUnitSale").getValue()) || 0;
            var vRetailPrice =
              parseFloat(oView.byId("idRetailPrice").getValue()) || 0;

            // new logic
            var vProductionCostTotal = vFirstCost + vPPBCost + vFreightCost;
            var vDiscountCalc = (vRetailPrice * vDiscount) / 100;
            var vTotalIncome = vUnitSale * (vRetailPrice - vDiscountCalc);

            var vProductionCostUnit = vProductionCostTotal / vUnitSale;
            var vProductionCostTotalNew =
              vUnitSale * vProductionCostUnit + vTotalIncome * (vRoyalty / 100);
            var vFinalMargin = vTotalIncome - vProductionCostTotalNew;

            var oTable = oView.byId("_idCostComb").getTable();
            var aRows = oTable.getRows();

            for (let index = 0; index < aRows.length; index++) {
              const oRow = aRows[index];
              var aCells = oRow.getCells();

              if (index === 0) {
                // production unit cost
                aCells[0].setText(vProductionCostUnit.toFixed(2));

                // quantity
                aCells[1].setText(vUnitSale);

                // production cost total
                aCells[2].setText(vProductionCostTotalNew.toFixed(2));

                // total income
                aCells[3].setText(vTotalIncome.toFixed(2));

                // margin
                aCells[4].setText(vFinalMargin.toFixed(2));

                // margin  %
                aCells[5].setText(
                  ((vFinalMargin / vTotalIncome) * 100).toFixed(2)
                );
              } else {
                // production unit cost
                aCells[0].setText("");

                // quantity
                aCells[1].setText("");

                // production cost total
                aCells[2].setText("");

                // total income
                aCells[3].setText("");

                // margin
                aCells[4].setText("");

                // margin  %
                aCells[5].setText("");
              }
            }

            //	this._configDialog(oButton, oDialog);
            oDialog.close();
          });
        },

        onCancelMarginPressed: function () {
          this._pMarginCostDialog.then((oDialog) => {
            const oCostSegBtn = this.getView().byId("comb-cost-seg-btn-id");
            const oItem = oCostSegBtn.getItems()[0];
            oCostSegBtn.setSelectedItem(oItem);
            oCostSegBtn.setSelectedKey("A");
            oDialog.close();
          });
        },
      }
    );
  }
);
