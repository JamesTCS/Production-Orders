sap.ui.controller("test4.view.ViewOrderDetails", {

	handleNavButtonPress: function(evt) {
		sap.ui.getCore().byId("__xmlview0--idAppControl").backDetail("OrderHistory");
	},

	handlePrintDetails: function(evt) {
		window.print();
	},

	_fragments: {},

	_getFormFragment: function(sName) {
		if (!this._fragments[sName]) {
			this._fragments[sName] = sap.ui.xmlfragment("test4.fragments." + sName, this);
		}
		return this._fragments[sName];
	},

	onExit: function() {
		jQuery.each(this._fragments, function(i, oFrag) {
			oFrag.destroy();
		});
	},

	onInit: function(oEvent) {


	   // var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROD_CRUDQ_SRV/");
	   // this.getView().setModel(oModel);
	//    debugger;
      //  var oModel = this.getView().getModel("Orders");
	//    this.setModel(oModel);
	  //  console.log(oModel);
	    

		// Set the initial form to be the change one
		var oForm = this._getFormFragment("Display");
		this.getView().byId("idFormContainer").insertContent(oForm);
		this.getView().bindElement("/ProdOrderSet");

	},

	handleBarButtonPress: function(oEvent) {

		// Derive action from the button pressed
		var bEditAction = /idButtonEdit$/.test(oEvent.getSource().getId());

		// Show the appropriate action buttons
		this.getView().byId("idButtonEdit").setVisible(!bEditAction);
		this.getView().byId("idButtonSave").setVisible(bEditAction);
		this.getView().byId("idButtonCancel").setVisible(bEditAction);

		// Set the right form type
		var oForm = this._getFormFragment(bEditAction ? "Change" : "Display");
		var oContainer = this.getView().byId("idFormContainer");
		oContainer.removeContent(0);
		oContainer.insertContent(oForm);
	}

});