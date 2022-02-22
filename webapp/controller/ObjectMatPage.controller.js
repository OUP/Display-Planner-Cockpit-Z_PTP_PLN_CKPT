sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/Fragment",
        "oup/ptp/zptpplannerscockpit/model/formatter",
        "sap/ui/core/routing/History",
    ],
    function (Controller, Fragment, formatter, History) {
        "use strict";
        var _oMatListModel = null;
        var _sPath = null;
        return Controller.extend(
            "oup.ptp.zptpplannerscockpit.controller.ObjectMatPage",
            {
                formatter: formatter,
                onInit: function () {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    _oMatListModel = this.getOwnerComponent().getModel(
                        "MatList"
                    );

                    this.getView().setModel(_oMatListModel);

                    oRouter
                        .getRoute("ObjectMatPage")
                        .attachPatternMatched(this._onObjectMatched, this);
                },
                fullScreenToggledPress: function (oEvent) {
                    if (oEvent.getParameters().fullScreen) {
                        oEvent.getSource().getTable().setVisibleRowCount(14);
                    } else {
                        oEvent.getSource().getTable().setVisibleRowCount(5);
                    }
                },
                _onObjectMatched: function (oEvent) {
                    this._sPath = oEvent.getParameter(
                        "arguments"
                    ).obejctPathMat;
                    if (this._sPath === undefined) {
                        this._sPath =
                            oEvent.mParameters.arguments.obejctPathMat;
                    }
                    this.onAfterMatched();
                },
                onAfterMatched: function () {
                    var sPath = this._sPath;

                    this.getView().bindElement({
                        path: "/" + sPath,
                    });
                    this.getView()
                        .byId("_idpreviousReprintMat")
                        .getTable()
                        .bindRows("/" + sPath + "/to_PrePrnt", null, null);
                    // this.getView().byId("_idpreviousReprint").bindRows("/");
                    //var aPath = "/" + sPath + "/to_Forecast";
                    this.getView()
                        .byId("_idSalesIBPForecastMat")
                        .getTable()
                        .bindRows("/" + sPath + "/to_Forecast", null, null);
                    this.getView()
                        .byId("_idPTPRELREQMat")
                        .getTable()
                        .bindRows("/" + sPath + "/to_Relreq", null, null);
                    this.getView()
                        .byId("_idISBNTextMat")
                        .getTable()
                        .bindRows("/" + sPath + "/to_Description", null, null);
                    this.getView()
                        .byId("_idStockDetailsMat")
                        .getTable()
                        .bindRows("/" + sPath + "/to_StockOvp", null, null);
                    this.getView()
                        .byId("_idSalesIBPForecastMat")
                        .getItems()[1]
                        .attachBusyStateChanged(this._onBusyStateChanged);
                    this.getView()
                        .byId("_idpreviousReprintMat")
                        .getItems()[1]
                        .attachBusyStateChanged(this._onBusyStateChanged);

                    this.getView()
                        .byId("_idPTPRELREQMat")
                        .getItems()[1]
                        .attachBusyStateChanged(this._onBusyStateChanged);
                    this.getView()
                        .byId("_idStockDetailsMat")
                        .getItems()[1]
                        .attachBusyStateChanged(this._onBusyStateChanged);
                    this.fnDescriptionPack(sPath, "to_PackInfo");
                    this.fnDescriptionMarket(sPath, "to_Market");
                    this.fnDescriptionProductType(sPath, "to_ProductType");
                    //     this.fnDescriptionSeries(sPath, "to_Series");
                },
                fnDescriptionPack: function (sPath, aNav) {
                    var that = this;
                    var oDataModel = this.getView().getModel();
                    that.getView().byId("_iddescPackinfoMat").setText("");

                    oDataModel.read("/" + sPath + "/" + aNav, {
                        async: false,

                        success: function (oData) {
                            if (oData !== undefined) {
                                that.getView()
                                    .byId("_iddescPackinfoMat")
                                    .setText(
                                        oData.SAP_Description +
                                            "(" +
                                            oData.ZPACK_INFO +
                                            ")"
                                    );
                            }
                            //successful Read in the server
                        },
                        error: function (oError) {},
                    });
                },
                fnDescriptionMarket: function (sPath, aNav) {
                    var that = this;
                    var oDataModel = this.getView().getModel();
                    that.getView().byId("_IdMarketMat").setText("");

                    oDataModel.read("/" + sPath + "/" + aNav, {
                        async: false,

                        success: function (oData) {
                            if (oData !== undefined) {
                                that.getView()
                                    .byId("_IdMarketMat")
                                    .setText(
                                        oData.SAP_Description +
                                            "(" +
                                            oData.ZMARKET_SECTOR +
                                            ")"
                                    );
                            } //successful Read in the server
                        },
                        error: function (oError) {},
                    });
                },
                fnDescriptionProductType: function (sPath, aNav) {
                    var that = this;
                    var oDataModel = this.getView().getModel();
                    that.getView().byId("idProductTypeMat").setText("");

                    oDataModel.read("/" + sPath + "/" + aNav, {
                        async: false,

                        success: function (oData) {
                            if (oData !== undefined) {
                                that.getView()
                                    .byId("idProductTypeMat")
                                    .setText(
                                        oData.SAP_Description +
                                            "(" +
                                            oData.ZPRODUCT_TYPE +
                                            ")"
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
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(
                            this
                        );
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
                        .getProperty("BomComponent");
                    var aPlant = this.getView()
                        .getBindingContext()
                        .getProperty("Plant");
                    var aPath =
                        "zptp_c_mat_list(Product='" +
                        aISbn +
                        "',Plant='" +
                        aPlant +
                        "')";
                    oRouter.navTo("ObjectMatPage", {
                        obejctPathMat: aPath,
                    });
                },
                fnZINF: function (oEvent) {
                    var aMaterialNumber = this.getView()
                        .getBindingContext()
                        .getProperty("Product"); // read material number
                    var aPlant = this.getView()
                        .getBindingContext()
                        .getProperty("Plant"); // read Plant
                    var aSalesOrg = this.getView()
                        .getBindingContext()
                        .getProperty("ProductSalesOrg"); // read Sales Organisation
                    var aDistributionChannel = this.getView()
                        .getBindingContext()
                        .getProperty("ProductDistributionChnl"); // read Distribution Channel
                    var oCrossAppNavigator = sap.ushell.Container.getService(
                        "CrossApplicationNavigation"
                    ); // get a handle on the global XAppNav service

                    var oTarget = {
                        semanticObject: "MATINQ",
                        action: "manage",
                    };

                    var oParams = {
                        ISBN: aMaterialNumber,
                        Plant: aPlant,
                        SalesOrganization: aSalesOrg,
                        DistributionChannel: aDistributionChannel,
                        //
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
                    //                 SalesOrganization: aSalesOrg,
                    //                 DistributionChannel: aDistributionChannel,
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
                    var aPlant = this.getView()
                        .getBindingContext()
                        .getProperty("Plant");
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
                    //                 Product: aProduct,
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

                    //    var oCrossAppNavigator = sap.ushell.Container.getService(
                    //         "CrossApplicationNavigation"
                    //     ); // get a handle on the global XAppNav service
                    //     var hash =
                    //         (oCrossAppNavigator &&
                    //             oCrossAppNavigator.hrefForExternal({
                    //                 target: {
                    //                     semanticObject: "ZMaterial",
                    //                     action: "manage",
                    //                 },
                    //                 params: {
                    //                     Product: aMaterial,
                    //                 },
                    //             })) ||
                    //         ""; // generate the Hash to display a Supplier

                    //     oCrossAppNavigator.toExternal({
                    //         target: {
                    //             shellHash: hash,
                    //         },
                    //     }); // navigate to Supplier application
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
                        //
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
                    var aPlant = this.getView()
                        .getBindingContext()
                        .getProperty("Plant");
                    // var aMRPController = this.getView()
                    //     .getBindingContext()
                    //     .getProperty("MRPController");
                    var oTarget = {
                        semanticObject: "Material",
                        action: "manageStock",
                        //
                    };

                    var oParams = {
                        Material: aMaterial,
                        Plant: aPlant,
                        //           MRPArea: aMRPController,
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
                    //                 //           MRPArea: aMRPController,
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
                    var aPlant = this.getView()
                        .getBindingContext()
                        .getProperty("Plant");
                    var aPurchaseRequisition = this.getView()
                        .getBindingContext()
                        .getProperty("PurchaseRequisition");

                    var aPurchaseRequisitionItem = this.getView()
                        .getBindingContext()
                        .getProperty("PurchaseRequisitionItem");
                    // read PurchaseOrder from OData path Product/SupplierID
                    var oCrossAppNavigator = sap.ushell.Container.getService(
                        "CrossApplicationNavigation"
                    ); // get a handle on the global XAppNav service

                    var oTarget = {
                        semanticObject: "PurchaseRequisition",
                        action: "maintain",

                        //
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
                    // }); // navigate to Supplier application
                },
                fnCreateRequisition: function () {
                    var aMaterial = this.getView()
                        .getBindingContext()
                        .getProperty("Product"); // read PurchaseOrder from OData path Product/SupplierID
                    var oCrossAppNavigator = sap.ushell.Container.getService(
                        "CrossApplicationNavigation"
                    ); // get a handle on the global XAppNav service

                    var oTarget = {
                        semanticObject: "PurchaseRequisition",
                        action: "create",

                        //
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
                            oTpc = new sap.ui.table.TablePointerExtension(
                                oTable
                            );
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
                handleLinkPress: function (oEvent) {
                    var sPath = this.getView().getBindingContext().sPath;
                    var that = this;
                    if (!this._pDialog) {
                        this._pDialog = Fragment.load({
                            id: this.getView().getId(),
                            name:
                                "oup.ptp.zptpplannerscockpit.view.fragment.PackInfo",
                            controller: this,
                        }).then(function (oDialog) {
                            //oDialog.setModel(oView.getModel());
                            return oDialog;
                        });
                    }

                    this._pDialog.then(
                        function (oDialog) {
                            oDialog.setModel(that.getView().getModel());

                            var oSmartTableHeader = this.getView().byId(
                                "headPackInfo"
                            );

                            var oSmartTableItem = this.getView().byId(
                                "ItemPackInfo"
                            );

                            oSmartTableHeader
                                .getTable()
                                .bindRows(sPath + "/to_Header", null, null);
                            oSmartTableItem
                                .getTable()
                                .bindRows(sPath + "/to_Item", null, null);
                            oSmartTableItem
                                .getTable()
                                .attachBusyStateChanged(
                                    that._onBusyStateChanged
                                );

                            oSmartTableHeader
                                .getTable()
                                .attachBusyStateChanged(
                                    that._onBusyStateChanged
                                );

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
                onButtonPress: function (oEvent) {
                    var oButton = oEvent.getSource();
                    this.byId("actionSheet").openBy(oButton);
                },
            }
        );
    }
);
