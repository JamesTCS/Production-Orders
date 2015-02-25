sap.ui.controller("test4.view.OrderHistory", {

	onInit: function() {
		// console.log("Hi");
		 sap.ui.getCore().Bundle = new Object();
		 
		 
	},
	


	handleNavButtonPress: function() {
		sap.ui.getCore().byId("__xmlview0--idAppControl").backDetail("detail");
	},
	
	handleManageOrderPress: function() {
	    location.assign("https://createpo4-s0012946252trial.dispatcher.hanatrial.ondemand.com/");
	},

	handlePastOrderPress: function(evt) {
		var oSelection = evt.getSource();
		var context = oSelection.getBindingContext().getPath();
		
		sap.ui.getCore().Bundle.context= context;

		// create action sheet only once
		if (!this.actionSheet) {
			this.actionSheet = sap.ui.xmlfragment(
				"test4.fragments.ActionSheet",
				this
			);
			this.getView();
		}

		this.actionSheet.openBy(oSelection);
	},

	handleViewOrderDetailsPress: function(evt) {

		sap.ui.getCore().byId("__xmlview0--idAppControl").toDetail("ViewOrderDetails");
        
		//   sap.ui.getCore().byId("__xmlview0--idAppControl").toDetail("ViewOrderDetails");
	},

	handlePrintOrderDetailsPress: function(evt) {

		sap.ui.getCore().byId("__xmlview0--idAppControl").toDetail("ViewOrderDetails");
	
		
		
		setTimeout(delay, 500);

		function delay() {
			window.print();

		}
	},

	handleChangeOrderPress: function(evt) {

		sap.ui.getCore().byId("__xmlview0--idAppControl").toDetail("ChangeOrder");

	},

	onSearch: function() {

		var filters = [];
		var searchString = this.getView().byId("searchField1").getValue();
		if (searchString && searchString.length > 0) {
			filters = [new sap.ui.model.Filter("ENTER_DATE",
				sap.ui.model.FilterOperator.Contains, searchString)];
		}
		// Update list binding
		this.getView().byId("idOrdersTable").getBinding("items").filter(filters);

		// update list binding
		var orderHistoryList = this.getView().byId("idOrdersTable");
		var binding = orderHistoryList.getBinding("items");
		binding.filter(filters, "null");
	}

});