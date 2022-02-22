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
        return Controller.extend(
            "oup.ptp.zptpplannerscockpit.controller.Main",
            {
                formatter: formatter,

                onInit: function () {
                    _oView = this.getView();
                    _oRadioGroup = _oView.byId("reportTypeId");
                    _oDynamicContainer = _oView.byId("dynamicTableId");

                    _oDynamicFilterContainer = _oView.byId(
                        "dynamicTableIdFilter"
                    );
                    _oReqWlkListModel = this.getOwnerComponent().getModel(
                        "ReqWlkList"
                    );
                    _oMatListModel = this.getOwnerComponent().getModel(
                        "MatList"
                    );
                    _oCombinationModel = this.getOwnerComponent().getModel(
                        "Combination"
                    );
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
                    var _oDynamicRadioBtnContainer = this.getView().byId(
                        "dynamicRadioBtn"
                    );
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
                        oContentTable.attachBusyStateChanged(
                            that._onBusyStateChanged
                        );
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
                    var sText = oEvent
                        .getSource()
                        .getButtons()
                        [iSelectedIndex].getText();
                    var sFragmentName =
                        "oup.ptp.zptpplannerscockpit.view.fragment.";
                    var sFragmentFilterName =
                        "oup.ptp.zptpplannerscockpit.view.fragment.";

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
                        oContentTable.attachBusyStateChanged(
                            that._onBusyStateChanged
                        );
                    });
                },
                handleLinkPress: function (oEvent) {
                    var sPath = oEvent.getSource().getBindingContext().sPath;
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
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    var oItem = oEvent.getSource();
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    var index = oItem.getSelectedIndex();
                    if (index >= 0) {
                        var aPurchaseRequisition = oEvent
                            .getSource()
                            .getParent()
                            .getTable()
                            .getContextByIndex(index)
                            .getProperty("PurchaseRequisition");

                        if (aPurchaseRequisition !== "") {
                            oRouter.navTo("ObjectCombPage", {
                                obejctPath: oItem.getBinding().aKeys[index],
                            });
                            //oItem.getParent().removeSelections();
                        } else {
                            var aProduct = oEvent
                                .getSource()
                                .getParent()
                                .getTable()
                                .getContextByIndex(index)
                                .getProperty("Product");
                            var aPlant = oEvent
                                .getSource()
                                .getParent()
                                .getTable()
                                .getContextByIndex(index)
                                .getProperty("Plant");

                            var sPath =
                                "ZPTP_C_PLN_COMB(Product='" +
                                aProduct +
                                "',Plant='" +
                                aPlant +
                                "')";
                            oRouter.navTo("ObjectCombPage", {
                                obejctPath: sPath,
                            });
                        }
                    }
                },
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
                fnColumnResize: function (oEvent) {
                    oEvent
                        .getSource()
                        .attachBusyStateChanged(this._onBusyStateChanged);
                    var a = 10;
                },
            }
        );
    }
);
