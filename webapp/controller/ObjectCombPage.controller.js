sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "oup/ptp/zptpplannerscockpit/model/formatter",
  ],
  function (Controller, Fragment, History, formatter) {
    "use strict";
    var _oCombinationModel = null;

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
          this._sPath = oEvent.getParameter("arguments").objectPath;
          if (this._sPath === undefined) {
            this._sPath = oEvent.mParameters.arguments.obejctPath;
          }
          this.onAfterMatched();
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

          this.getView().bindElement({
            path: "/" + sPath,
            events: {
              dataRequested: () => {
                // before odata call
              },
              dataReceived: (oDataResponse) => {
                const oData = oDataResponse.getParameter("data");

                if(!oData) {
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
            },
          });

          this.getView()
            .byId("_idpreviousReprintComb")
            .getTable()
            .bindRows("/" + sPath + "/to_PrePrnt", null, null);
          // this.getView().byId("_idpreviousReprint").bindRows("/");

          //var aPath = "/" + sPath + "/to_Forecast";
          this.getView()
            .byId("_idSalesIBPForecastComb")
            .getTable()
            .bindRows("/" + sPath + "/to_Forecast", null, null);
          this.getView()
            .byId("_idISBNTextComb")
            .getTable()
            .bindRows("/" + sPath + "/to_Description", null, null);
          this.getView()
            .byId("_idStockDetailsComb")
            .getTable()
            .bindRows("/" + sPath + "/to_StockOvp", null, null);
          this.getView()
            .byId("_idCostComb")
            .getTable()
            .bindRows("/" + sPath + "/to_Costs", null, null);

          //   this.getView()
          //     .byId("_idPTPRELREQComb")
          //     .getTable()
          //     .bindRows("/" + sPath + "/to_Relreq", null, null);

          this.getView()
            .byId("_idSalesIBPForecastComb")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);
          this.getView()
            .byId("_idpreviousReprintComb")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.getView()
            .byId("_idPTPRELREQComb")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);
          this.getView()
            .byId("_idStockDetailsComb")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);
          this.getView()
            .byId("_idCostComb")
            .getTable()
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.fnDescriptionPack(sPath, "to_PackInfo");
          this.fnDescriptionMarket(sPath, "to_Market");
          this.fnDescriptionProductType(sPath, "to_ProductType");
        },
        fnDescriptionPack: function (sPath, aNav) {
          var that = this;
          var oDataModel = this.getView().getModel();
          that.getView().byId("_iddescPackinfoComb").setText("");

          oDataModel.read("/" + sPath + "/" + aNav, {
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

          oDataModel.read("/" + sPath + "/" + aNav, {
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

          oDataModel.read("/" + sPath + "/" + aNav, {
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
        handlePressMargin: function (oEvent) {
          // var aMaterial = oEvent.getSource().getBindingContext().getProperty("matnr");
          // var aPlant    = this.getView().getBindingContext().getProperty("Plant");
          var that = this;

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
        onOKMarginPressed: function () {
          var that = this;
          this._pMarginCostDialog.then(
            function (oDialog) {
              var vFirstCost = this.getView().byId("idFirstCost").getValue();
              var vPPBCost = this.getView().byId("idPPBCost").getValue();
              var vFreight = this.getView().byId("idFreight").getValue();
              var vRoyalty = this.getView().byId("idRoyalty").getValue();
              var vDiscount = this.getView().byId("idDiscount").getValue();
              var vUnitSale = this.getView().byId("idUnitSale").getValue();
              var vRetailPrice = this.getView()
                .byId("idRetailPrice")
                .getValue();

              var vProductionCostTotal =
                parseFloat(vFirstCost) +
                parseFloat(vPPBCost) +
                parseFloat(vFreight);

              var vRoyaltyValue =
                (vProductionCostTotal * parseInt(vRoyalty)) / 100;
              var vTotalCost = vProductionCostTotal + vRoyaltyValue;
              var vDiscountValue =
                (parseInt(vRetailPrice) * parseInt(vDiscount)) / 100;
              var vTotalIncome =
                parseInt(vUnitSale) * (vRetailPrice - vDiscountValue);

              var vFinalMargin = vTotalIncome - vTotalCost;
              that
                .getView()
                .byId("_idCostComb")
                .getTable()
                .getRows()[0]
                .getCells()[2]
                .setText(vFinalMargin);
              //	this._configDialog(oButton, oDialog);
              oDialog.close();
            }.bind(this)
          );
        },
      }
    );
  }
);
