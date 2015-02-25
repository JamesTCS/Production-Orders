sap.ui.controller("test4.view.ViewOrderDetails", {
    
    onInit: function() {
        this.form = this.byId("DetailsForm");
        this.getView().addEventDelegate({
            onBeforeShow: function(evt) {
                var context = sap.ui.getCore().Bundle.context;
    	        var form = evt.to.byId("DetailsForm");
    	        form.bindElement(context);
           }
        }); 
    },


	handleNavButtonPress: function(evt) {
		sap.ui.getCore().byId("__xmlview0--idAppControl").backDetail("OrderHistory");
	},

	handlePrintDetails: function(evt) {
		window.print();
	},

	/*
	onBeforeRendering : function(){
	     var oModel = this.getView().getModel(); // not needed just to debug ODataModel
	     var context = sap.ui.getCore().Bundle.context;
	     var form = this.byId("DetailsForm");
	     //form.sPath = context;
	     form.bindElement(context);
	     debugger;
	     //this.byId("test").setBindingContext(sap.ui.getCore().Bundle.context);
	    //this.getview().byId("test").
	    
	     //this.getView().byId("DetailsForm").setModel(oModel);
	     //this.getView().byId("DetailsForm").setBindingContext(context);
	     
	},*/

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