sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/core/routing/History",
    "sap/ui/model/Filter",
    "oup/ptp/zptpplannerscockpit/model/formatter",
  ],
  function (Controller, Fragment, History, Filter, formatter) {
    "use strict";

    return Controller.extend(
      "oup.ptp.zptpplannerscockpit.controller.ObjectPage",
      {
        formatter: formatter,

        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

          // set binding
          this.getView()
            .byId("_idPTPRELREQ")
            .setModel(this.getOwnerComponent().getModel("RelReq"));

          oRouter
            .getRoute("ObjectPage")
            .attachPatternMatched(this._onObjectMatched, this);
        },

        onAfterBinding: function (oEvent) {
          // var oContentTable = this.getView().byId(
          //     "_idpreviousReprint"
          // );
          // oContentTable.attachBusyStateChanged(
          //     this._onBusyStateChanged
          // );
          // var oContentTable = this.getView().byId(
          //     "_idSalesIBPForecastComb"
          // );
          // oContentTable.attachBusyStateChanged(
          //     this._onBusyStateChanged
          // );
          // oContentTable = this.getView().byId("_idStockDetailsComb");
          // oContentTable.attachBusyStateChanged(
          //     this._onBusyStateChanged
          // );
          // oContentTable = this.getView().byId("_idCostComb");
          // oContentTable.attachBusyStateChanged(
          //     this._onBusyStateChanged
          // );
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

                if (!oData) {
                  turn;
                }

                // trigger table rebind
                const oRelReqTable = this.getView().byId("_idPTPRELREQ");

                oRelReqTable
                  .getTable()
                  .bindRows(
                    `/ZPTP_C_REL_REQ(P_Material='${oData.Material}',P_Plant='${oData.Plant}')/Set`,
                    null,
                    null
                  );
              },
            },
          });

          this.getView()
            .byId("_idpreviousReprint")
            .getTable()
            .bindRows("/" + sPath + "/to_PrePrnt", null, null);
          // this.getView().byId("_idpreviousReprint").bindRows("/");

          this.getView()
            .byId("_idpreviousReprint")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.getView()
            .byId("_idSalesIBPForecast")
            .getTable()
            .bindRows("/" + sPath + "/to_Forecast", null, null);

          this.getView()
            .byId("_idISBNText")
            .getTable()
            .bindRows("/" + sPath + "/to_Description", null, null);

          this.getView()
            .byId("_idStockDetails")
            .getTable()
            .bindRows("/" + sPath + "/to_StockOvp", null, null);

          this.getView()
            .byId("_idCost")
            .getTable()
            .bindRows("/" + sPath + "/to_Costs", null, null);

          //   this.getView()
          //     .byId("_idPTPRELREQ")
          //     .getTable()
          //     .bindRows("/" + sPath + "/to_Relreq", null, null);

          this.getView()
            .byId("_idSalesIBPForecast")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.getView()
            .byId("_idPTPRELREQ")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.getView()
            .byId("_idStockDetails")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.getView()
            .byId("_idStockDetails")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.getView()
            .byId("_idCost")
            .getItems()[1]
            .attachBusyStateChanged(this._onBusyStateChanged);

          this.fnDescriptionPack(sPath, "to_PackInfo");
          this.fnDescriptionMarket(sPath, "to_Market");
          this.fnDescriptionProductType(sPath, "to_ProductType");
        },

        fnDescriptionPack: function (sPath, aNav) {
          var that = this;
          var oDataModel = this.getView().getModel();
          that.getView().byId("_iddescPackinfo").setText("");
          oDataModel.read("/" + sPath + "/" + aNav, {
            async: false,

            success: function (oData) {
              if (oData !== undefined) {
                that
                  .getView()
                  .byId("_iddescPackinfo")
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
          that.getView().byId("_IdMarket").setText("");
          oDataModel.read("/" + sPath + "/" + aNav, {
            async: false,

            success: function (oData) {
              if (oData !== undefined) {
                that
                  .getView()
                  .byId("_IdMarket")
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
          that.getView().byId("idProductType").setText("");

          oDataModel.read("/" + sPath + "/" + aNav, {
            async: false,

            success: function (oData) {
              if (oData !== undefined) {
                that
                  .getView()
                  .byId("idProductType")
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

        fullScreenToggledPress: function (oEvent) {
          if (oEvent.getParameters().fullScreen) {
            oEvent.getSource().getTable().setVisibleRowCount(12);
          } else {
            oEvent.getSource().getTable().setVisibleRowCount(5);
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
            .getProperty("Material"); // read material number
          var aPlant = this.getView().getBindingContext().getProperty("Plant"); // read Plant
          var aSalesOrg = this.getView()
            .getBindingContext()
            .getProperty("ProductSalesOrg"); // read Sales Organisation
          var aDistributionChannel = this.getView()
            .getBindingContext()
            .getProperty("ProductDistributionChnl"); // read Distribution Channel

          var oTarget = {
            semanticObject: "MATINQ",
            action: "manage",
          };

          var oParams = {
            ISBN: aMaterialNumber,
            Plant: aPlant,
            SalesOrganization: aSalesOrg,
            DistributionChannel: aDistributionChannel,
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

        fnZPST: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material"); // read PurchaseOrder from OData path Product/SupplierID
          var aPlant = this.getView().getBindingContext().getProperty("Plant");
          var asorg = this.getView()
            .getBindingContext()
            .getProperty("ProductSalesOrg");
          var adistChanl = this.getView()
            .getBindingContext()
            .getProperty("ProductDistributionChnl");

          // var oCrossAppNavigator = sap.ushell.Container.getService(
          //     "CrossApplicationNavigation"
          // ); // get a handle on the global XAppNav service

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
        },

        fnChangeMaterial: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material"); // read PurchaseOrder from OData path Product/SupplierID
          var oCrossAppNavigator = sap.ushell.Container.getService(
            "CrossApplicationNavigation"
          ); // get a handle on the global XAppNav service

          var oTarget = {
            semanticObject: "Material",
            action: "manage",
          };

          var oParams = {
            Product: aMaterial,
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

        fnOpenPurchaseOrder: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material");
          var aCurrency = this.getView()
            .getBindingContext()
            .getProperty("Currency");

          var oTarget = {
            semanticObject: "PurchaseOrderItem",
            action: "monitorPurDocItems",
          };

          var oParams = {
            Material: aMaterial,
            DisplayCurrency: aCurrency,
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

        fnBackorderDetails: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material"); // read PurchaseOrder from OData path Product/SupplierID
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
        },

        fnMaterialRequirementList: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material"); // read PurchaseOrder from OData path Product/SupplierID
          var aPlant = this.getView().getBindingContext().getProperty("Plant");
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
        },

        fnRequisition: function () {
          var aPurchaseRequisition = this.getView()
            .getBindingContext()
            .getProperty("PurchaseRequisition");

          var oTarget = {
            semanticObject: "PurchaseRequisition",
            action: "maintain",
          };

          var oParams = {
            PurchaseRequisition: aPurchaseRequisition,
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

        fnCreateRequisition: function () {
          var aMaterial = this.getView()
            .getBindingContext()
            .getProperty("Material"); // read PurchaseOrder from OData path Product/SupplierID
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
        },

        fnStockOverview: function () {
          var oData = this.getView().getBindingContext().getObject();
          var oTarget = {
            semanticObject: "Material",
            action: "displayStockOverview",
          };

          var oParams = {
            Material: oData.Material,
            Plant: oData.Plant,
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

        ReceiptAdvances: function (oEvent) {
          var aPurchaseOrder = this.extensionAPI
            .getSelectedContexts()[0]
            .getProperty("PurchaseOrder"); // read PurchaseOrder from OData path
          var oCrossAppNavigator = sap.ushell.Container.getService(
            "CrossApplicationNavigation"
          ); // get a handle on the global XAppNav service
          var hash =
            (oCrossAppNavigator &&
              oCrossAppNavigator.hrefForExternal({
                target: {
                  semanticObject: "ZACR",
                  action: "manage",
                },
                params: {
                  PurchaseOrder: aPurchaseOrder,
                },
              })) ||
            ""; // generate the Hash to display a Receipt Advances

          oCrossAppNavigator.toExternal({
            target: {
              shellHash: hash,
            },
          }); // navigate to ReceiptAdvances application
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

        handleLinkPressObject: function (oEvent) {
          // var aMaterial = oEvent.getSource().getBindingContext().getProperty("matnr");
          // var aPlant    = this.getView().getBindingContext().getProperty("Plant");
          var that = this;
          var sPath = this.getView().getBindingContext().sPath;

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

        onOKPressed: function () {
          this._pDialog.then(
            function (oDialog) {
              //	this._configDialog(oButton, oDialog);
              oDialog.close();
            }.bind(this)
          );
        },

        handleGetValues: function () {
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

          // read values
          oDataModel.read("/ZPTP_C_RFQ_COST", {
            filters: aFilters,
            success: function (oDataResponse) {
              try {
                var aData = oDataResponse.results || [];

                // table instance
                var oTable = this.getView().byId("_idCost").getTable();

                // first row
                var oRow = oTable.getRows()[0];

                // row cells
                var aCells = oRow.getCells();

                // quantity
                aCells[0].setText(aData[0].Quantity);

                // unit cost
                aCells[1].setText(aData[0].UnitCost);

                // margin
                aCells[2].setText(aData[0].Margin);

                // message
                sap.m.MessageToast.show(
                  "Automatic cost calculation has updated cost table successfully"
                );
              } catch (error) {}
            }.bind(this),
            error: function (_oErrorResponse) {},
          });
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
              var oView = this.getView();
              var vFirstCost = parseFloat(oView.byId("idFirstCost").getValue());
              var vPPBCost = parseFloat(oView.byId("idPPBCost").getValue());
              var vFreightCost = parseFloat(oView.byId("idFreight").getValue());
              var vRoyalty = parseFloat(oView.byId("idRoyalty").getValue());
              var vDiscount = parseFloat(oView.byId("idDiscount").getValue());
              var vUnitSale = parseFloat(oView.byId("idUnitSale").getValue());
              var vRetailPrice = parseFloat(
                oView.byId("idRetailPrice").getValue()
              );

              // old logic
              // var vProductionCostTotal = vFirstCost + vPPBCost + vFreightCost;
              // var vRoyaltyValue = (vProductionCostTotal * vRoyalty) / 100;
              // var vTotalCost = vProductionCostTotal + vRoyaltyValue;
              // var vDiscountValue = (vRetailPrice * vDiscount) / 100;
              // var vTotalIncome = vUnitSale * (vRetailPrice - vDiscountValue);
              // var vFinalMargin = vTotalIncome - vTotalCost;

              // new logic
              var vProductionCostTotal = vFirstCost + vPPBCost + vFreightCost;
              var vRoyaltyCalc = (vProductionCostTotal * vRoyalty) / 100;
              var vTotalCost = vUnitSale * (vProductionCostTotal + vRoyaltyCalc);
              var vDiscountCalc = (vRetailPrice * vDiscount) / 100;
              var vTotalIncome = vUnitSale * (vRetailPrice - vDiscountCalc);
              var vMargin = vTotalIncome - vTotalCost;

              var oCells = oView
                .byId("_idCost")
                .getTable()
                .getRows()[0]
                .getCells();

              // quanity
              oCells[0].setText(vUnitSale);

              // unit cost
              oCells[1].setText(vTotalIncome.toFixed(2));

              // margin
              oCells[2].setText(vMargin.toFixed(2));

              // this._configDialog(oButton, oDialog);
              oDialog.close();
            }.bind(this)
          );
        },

        onButtonPress: function (oEvent) {
          var oButton = oEvent.getSource();
          this.byId("actionSheet").openBy(oButton);
        },

        _onObjectMatched: function (oEvent) {
          this._sPath = oEvent.getParameter("arguments").objectPath;
          if (this._sPath === undefined) {
            this._sPath = oEvent.mParameters.arguments.obejctPath;
          }
          this.onAfterMatched();
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
      }
    );
  }
);
