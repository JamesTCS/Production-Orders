sap.ui.core.mvc.Controller.extend("test4.view.Master", {

	onInit : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();

		var oEventBus = this.getEventBus();
		oEventBus.subscribe("Detail", "TabChanged", this.onDetailTabChanged, this);

		var oList = this.getView().byId("list");
	    oList.attachEvent("updateFinished", function() {
			this.oInitialLoadFinishedDeferred.resolve();
			oEventBus.publish("Master", "InitialLoadFinished");
		}, this);
		
		//On phone devices, there is nothing to select from the list. There is no need to attach events.
		if (sap.ui.Device.system.phone) {
			return;
		}

		this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);

		oEventBus.subscribe("Detail", "Changed", this.onDetailChanged, this);
		oEventBus.subscribe("Detail", "NotFound", this.onNotFound, this);
	},

	onRouteMatched : function(oEvent) {
		var sName = oEvent.getParameter("name");

		if (sName !== "main") {
			return;
		}

		//Load the detail view in desktop
		this.loadDetailView();

		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function () {

			//On the empty hash select the first item
			this.selectFirstItem();

		});

	},

	onDetailChanged : function (sChanel, sEvent, oData) {
		var sEntityPath = oData.sEntityPath;
		//Wait for the list to be loaded once
		this.waitForInitialListLoading(function () {
			var oList = this.getView().byId("list");

			var oSelectedItem = oList.getSelectedItem();
			// The correct item is already selected
			if(oSelectedItem && oSelectedItem.getBindingContext().getPath() === sEntityPath) {
				return;
			}

			var aItems = oList.getItems();

			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getBindingContext().getPath() === sEntityPath) {
					oList.setSelectedItem(aItems[i], true);
					break;
				}
			}
		});
	},

	onDetailTabChanged : function (sChanel, sEvent, oData) {
		this.sTab = oData.sTabKey;
	},
	
	loadDetailView : function(){
		this.getRouter().myNavToWithoutHash({ 
			currentView : this.getView(),
			targetViewName : "test4.view.Detail",
			targetViewType : "XML"
		});
	},

	waitForInitialListLoading : function (fnToExecute) {
		jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(fnToExecute, this));
	},

	onNotFound : function () {
		this.getView().byId("list").removeSelections();
	},

	selectFirstItem : function() {
		var oList = this.getView().byId("list");
		var aItems = oList.getItems();
		if (aItems.length) {
			oList.setSelectedItem(aItems[0], true);
    		//Load the detail view in desktop
            this.loadDetailView();
    		oList.fireSelect({"listItem" : aItems[0]});
		}
		else {
    		this.getRouter().myNavToWithoutHash({ 
    			currentView : this.getView(),
    			targetViewName : "test4.view.NotFound",
    			targetViewType : "XML"
        	});
		}
	},

	onSearch : function() {
		this.oInitialLoadFinishedDeferred = jQuery.Deferred();
		// Add search filter
		var filters = [];
		var searchString = this.getView().byId("searchField").getValue();
		if (searchString && searchString.length > 0) {
			filters = [ new sap.ui.model.Filter("ProductID", sap.ui.model.FilterOperator.Contains, searchString) ];
		}
		// Update list binding
		this.getView().byId("list").getBinding("items").filter(filters);
		
		//On phone devices, there is nothing to select from the list
		if (sap.ui.Device.system.phone) {
			return;
		}

		//Wait for the list to be reloaded
		this.waitForInitialListLoading(function () {
			//On the empty hash select the first item
			this.selectFirstItem();
		});
	},

	onSelect : function(oEvent) {
		// Get the list item either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode)
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	showDetail : function(oItem) {
		// If we're on a phone device, include nav in history
		var bReplace = jQuery.device.is.phone ? false : true;
		this.getRouter().navTo("detail", {
			from: "master",
			entity: oItem.getBindingContext().getPath().substr(1),
			tab: this.sTab
		}, bReplace);
	},
	
	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	},

	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	
	onExit : function(oEvent){
		var oEventBus = this.getEventBus();
		oEventBus.unsubscribe("Detail", "TabChanged", this.onDetailTabChanged, this);
		oEventBus.unsubscribe("Detail", "Changed", this.onDetailChanged, this);
		oEventBus.unsubscribe("Detail", "NotFound", this.onNotFound, this);
	},
	
	onAfterRendering : function(oEvent) {
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("test4.fragments.Dialog", this);
		}

		this._oDialog.setModel(this.getView().getModel());
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
				this._oDialog);
		this._oDialog.open();
	},

	handleSelectPPButtonPress : function(oEvent) {
		if (!this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("test4.view.Dialog", this);
		}

		this._oDialog.setModel(this.getView().getModel());
		// toggle compact style
		jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
				this._oDialog);
		this._oDialog.open();
	},

	handlePlantSearch : function(oEvent) {
		var sValue = oEvent.getParameter("value");
		var oFilter = new sap.ui.model.Filter("PlantID",
				sap.ui.model.FilterOperator.Contains, sValue);
		var oBinding = oEvent.getSource().getBinding("items");
		oBinding.filter([ oFilter ]);
	},

	handlePlantClose : function(oEvent) {

		jQuery.sap.require("sap.m.MessageToast");
		var aContexts = oEvent.getParameter("selectedContexts");
	//	this.getView().setBindingContext(aContexts).byId("masterPage");
		//var select = oEvent.getObject("selectedContexts").byId("masterPage").setTitle(select);
		if (aContexts.length) {
			sap.m.MessageToast.show("You have chosen PlantID "
					+ aContexts.map(function(oContext) {
						return oContext.getObject().PlantID;
					}).join(", "));
		}
        
		oEvent.getSource().getBinding("items").filter([]);
	},
		goHome: function() {
		location.assign("https://appholderdashboardfinal-s0012946255trial.dispatcher.hanatrial.ondemand.com");
	}
});