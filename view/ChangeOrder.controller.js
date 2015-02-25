sap.ui.controller("test4.view.ChangeOrder", {
    
    onInit: function() {
        
        this.getView().addEventDelegate({
            onBeforeShow: function(evt) {
                var context = sap.ui.getCore().Bundle.context;
    	        var form = evt.to.byId("DetailsForm");
    	        form.bindElement(context);
    	        
    	        //set Date for Date Pickers
    	        var startDate = evt.to.byId("startDate").getValue();
    	        var endDate = evt.to.byId("endDate").getValue();
    	        var year = startDate.substring(0,3);
    	        var month = startDate.substring(4,5);
    	        var day = startDate.substring(6,7);
    	        
    	        var date = new Date(year, month, day);
    	        debugger;
           }
        }); 
    },
    
   

	handleNavButtonPress: function(evt) {
		sap.ui.getCore().byId("__xmlview0--idAppControl").backDetail();
	},
    
	
	cancelBtn: function() {
	    sap.ui.getCore().byId("__xmlview0--idAppControl").backDetail();
	},
	
	saveBtn: function() {
	    var orders = {
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
        
        /*// getters for form values 
		var productOrderId = this.byId("productOrderId").getText();
		var docType = this.byId("docType").getText();
		var startDate = this.byId("startDate").getValue();
		var endDate = this.byId("endDate").getValue();
		var quantity = this.byId("quantity").getValue();
		var scrapQuantity = this.byId("scrapQuantity").getValue();
		var plantId = this.byId("plantId").getText();
		var planningPlant = this.byId("planningPlant").getText();
		var productId = this.byId("productId").getText();
		var unit = this.byId("unit").getText();
		*/
		
		//format end date
		var endDate = this.byId("endDate").getValue();
		var arrayDate = endDate.split("-");
		endDate = arrayDate[0] + arrayDate[1] + arrayDate[2]
		debugger;
					
        orders.d.ProdOrderID = this.byId("productOrderId").getText();
		orders.d.DocType = this.byId("docType").getText();
	    orders.d.StartDate = this.byId("startDate").getValue();
	    orders.d.EndDate = this.byId("endDate").getValue();
		orders.d.Quanity = this.byId("quantity").getValue();
		orders.d.ScrapQty = this.byId("scrapQuantity").getValue();
	    orders.d.PlantID = this.byId("plantId").getText();
	    orders.d.PlannigPlant = this.byId("planningPlant").getText();
	    orders.d.ProductID = this.byId("productId").getText();
	    orders.d.Unit = this.byId("unit").getText();
	    
	
        
		var model = this.getView().getModel();
		var path = sap.ui.getCore().Bundle.context;
		debugger;
		model.update(sap.ui.getCore().Bundle.context, orders, null, function(oData) {
                    sap.m.MessageToast.show("Production Order " + oData.ProdOrderID + " Created" );},
                     function(oData){  
                            sap.m.MessageToast.show("ERROR");});
                            
	}
});