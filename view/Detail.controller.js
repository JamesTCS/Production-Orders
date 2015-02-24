jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.mvc.Controller.extend("test4.view.Detail", {

	onInit: function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		if (sap.ui.Device.system.phone) {
			//Do not wait for the master when in mobile phone resolution
			this.oInitialLoadFinishedDeferred.resolve();
		} else {
			this.getView().setBusy(true);
			var oEventBus = this.getEventBus();
			oEventBus.subscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
			oEventBus.subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		}

		this.getRouter().attachRouteMatched(this.onRouteMatched, this);

		this.isHCB = false;
	},

	onMasterLoaded: function(sChannel, sEvent) {
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
	},

	onMetadataFailed: function() {
		this.getView().setBusy(false);
		this.oInitialLoadFinishedDeferred.resolve();
		this.showEmptyView();
	},

	onRouteMatched: function(oEvent) {
		var oParameters = oEvent.getParameters();

		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
			var oView = this.getView();

			// When navigating in the Detail page, update the binding context 
			if (oParameters.name !== "detail") {
				return;
			}

			var sEntityPath = "/" + oParameters.arguments.entity;
			this.bindView(sEntityPath);

            /*
			var oIconTabBar = oView.byId("idIconTabBar");
			oIconTabBar.getItems().forEach(function(oItem) {
				oItem.bindElement(oItem.getKey());
			});

			// Specify the tab being focused
			var sTabKey = oParameters.arguments.tab;
			this.getEventBus().publish("Detail", "TabChanged", {
				sTabKey: sTabKey
			});

			if (oIconTabBar.getSelectedKey() !== sTabKey) {
				oIconTabBar.setSelectedKey(sTabKey);
			}*/
		}, this));

	},

	bindView: function(sEntityPath) {
		var oView = this.getView();
		oView.bindElement(sEntityPath);

		//Check if the data is already on the client
		if (!oView.getModel().getData(sEntityPath)) {

			// Check that the entity specified was found.
			oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
				var oData = oView.getModel().getData(sEntityPath);
				if (!oData) {
					this.showEmptyView();
					this.fireDetailNotFound();
				} else {
					this.fireDetailChanged(sEntityPath);
				}
			}, this));

		} else {
			this.fireDetailChanged(sEntityPath);
		}

	},

	showEmptyView: function() {
		this.getRouter().myNavToWithoutHash({
			currentView: this.getView(),
			targetViewName: "test4.view.NotFound",
			targetViewType: "XML"
		});
	},

	fireDetailChanged: function(sEntityPath) {
		this.getEventBus().publish("Detail", "Changed", {
			sEntityPath: sEntityPath
		});
	},

	fireDetailNotFound: function() {
		this.getEventBus().publish("Detail", "NotFound");
	},

	onNavBack: function() {
		// This is only relevant when running on phone devices
		this.getRouter().myNavBack("main");
	},

	onDetailSelect: function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			entity: oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);
	},

	openActionSheet: function() {

		if (!this._oActionSheet) {
			this._oActionSheet = new sap.m.ActionSheet({
				buttons: new sap.ushell.ui.footerbar.AddBookmarkButton()
			});
			this._oActionSheet.setShowCancelButton(true);
			this._oActionSheet.setPlacement(sap.m.PlacementType.Top);
		}

		this._oActionSheet.openBy(this.getView().byId("actionButton"));
	},

	getEventBus: function() {
		return sap.ui.getCore().getEventBus();
	},

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onExit: function(oEvent) {
		var oEventBus = this.getEventBus();
		oEventBus.unsubscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);
		oEventBus.unsubscribe("Component", "MetadataFailed", this.onMetadataFailed, this);
		if (this._oActionSheet) {
			this._oActionSheet.destroy();
			this._oActionSheet = null;
		}
	},

	handleSaveOrderButtonPress: function(oEvent) {
		// show confirmation dialog
		/*	var bundle = this.getView().getModel("i18n").getResourceBundle();
		sap.m.MessageBox.confirm(bundle.getText("SaveOrderApproveDialogMsg"),
			function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					// notify user
					var successMsg = bundle
						.getText("SaveOrderDialogSuccessMsg");
					sap.m.MessageToast.show(successMsg);
					// TODO call proper service method and update model (not
					// part of this session)
				}
			}, bundle.getText("SaveOrderDialogTitle"));*/

		//debugger;
		var Orders = {
			"d": {
				"ProdOrderID": "000060003285",
				"DocType": "PP01",
				"StartDate": "20060926",
				"EndDate": "20061114",
				"Quanity": "200.000 ",
				"ScrapQty": "1.000 ",
				"PlantID": "1000",
				"PlannigPlant": "000060003285",
				"ProductID": "QS300",
				"Unit": "ST"
			}
		};

		//      debugger;	
					var docTy = this.byId("doc_type").getSelectedItem().getText();
					var quantity = this.byId("qty").getValue();
					var squantity = this.byId("sqty").getValue();
					var startDte = this.byId("start_date").getDateValue().toISOString();
					var endDate = this.byId("end_date").getDateValue().toISOString();
            //       debugger;
					Orders.d.DocType = docTy;
					Orders.d.Quanity = quantity;
					Orders.d.ScrapQty = squantity;
					Orders.d.StartDate = startDte;
					Orders.d.EndDate = endDate;
		//			debugger;

		var model = this.getView().getModel();
		//	debugger;
		model.create("/ProdOrderSet", Orders,null,function(oData){
                    sap.m.MessageToast.show("Production Order " + oData.ProdOrderID + " Created" );},
                     function(oData){  
                            sap.m.MessageToast.show("ERROR");});

		//	this.getView().getModel().create(ProdOrders);
	},

	handleOrderHistoryButtonPress: function(oEvent) {

		sap.ui.getCore().byId("__xmlview0--idAppControl").toDetail("OrderHistory");
	}

	/*		validateFields: function() {
					// var DocTypeField = this.getView().byId("doc_type");
					var QuantityField = this.getView().byId("qty");
					// var ScrapQuantityField = this.getView().byId("sqty");
					// var OrderStartField = this.getView().byId("start_date");
					// var OrderEndField = this.getView().byId("end_date");

					if (QuantityField.getValue() === "") {

						var bundle = this.getView().getModel("i18n").getResourceBundle();
						sap.m.MessageBox.alert(
							bundle.getText("QuantityRequiredDialogText"), function(oAction) {
								if (sap.m.MessageBox.Action.OK === oAction) {}
							}, bundle.getText("QuantityRequiredDialogTitle"));
					}
					// else if (ScrapQuantityFiel.getValue() === "") {
					// alert("Please enter scrap quantity.");
					// }
					// else if (DocTypeField.getValue() === "") {
					// alert("Please enter Document Type.");
					// }
					// else if (OrderStartField.getValue() === "") {
					// alert("Please enter Order Start Date.");
					// }
					// else if (OrderEndField.getValue() === "") {
					// alert("Please enter Order End Date.");
					// }
					else
						(this.handleSaveOrderButtonPress());

				}*/
	,

	changeTheme: function() {
		if (this.isHCB) {
			sap.ui.getCore().applyTheme("sap_bluecrystal");
			this.isHCB = false;
		} else {
			sap.ui.getCore().applyTheme("sap_hcb");
			this.isHCB = true;
		}
	}

});