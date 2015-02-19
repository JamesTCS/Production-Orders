sap.ui.controller("test4.view.ChangeOrder", {		
	
	handleNavButtonPress : function (evt) { 
		sap.ui.getCore().byId("__xmlview0--idAppControl").backDetail("OrderHistory");
	},
			
	  _fragments: {},

	  _getFormFragment: function (sName) {
	    if (!this._fragments[sName]) {
	      this._fragments[sName] = sap.ui.xmlfragment("test4.fragments." + sName, this);
	    }
	    return this._fragments[sName];
	  },

	  onExit : function () {
	    jQuery.each(this._fragments, function (i, oFrag) {
	      oFrag.destroy();
	    });
	  },

	  onInit: function (oEvent) {

       //  var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROD_CRUDQ_SRV/");
	  //  this.getView().setModel(oModel);
	    
	   // var oModel = sap.ui.getCore().getModel("Orders");
	   // this.getView().setModel(oModel);
        
	    // Set the initial form to be the change one
	    var oForm = this._getFormFragment("Change");
	    this.getView().byId("idFormContainer").insertContent(oForm);
	    this.getView().bindElement("/ProdOrderSet");
	  },

	  handleFooterBarButtonPress: function (oEvent) {

	    // Derive action from the button pressed
	    var bEditAction = /idButtonSave$/.test(oEvent.getSource().getId());

	    // Show the appropriate action buttons
	    this.getView().byId("idButtonSave").setVisible(! bEditAction);
	    this.getView().byId("idButtonCancel").setVisible(! bEditAction);
	    this.getView().byId("idButtonEdit").setVisible(bEditAction);

	    // Set the right form type
	    //oForm = this._getFormFragment(bEditAction ? "Display" : "Change");
	   var oForm = this._getFormFragment(!bEditAction ? "Change" : "Display");
	    var oContainer = this.getView().byId("idFormContainer");
	    oContainer.removeContent(0);
	    oContainer.insertContent(oForm);
	  }
});