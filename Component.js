jQuery.sap.declare("test4.Component");
jQuery.sap.require("test4.MyRouter");

sap.ui.core.UIComponent.extend("test4.Component", {
	metadata : {
		name : "test4",
		version : "1.0",
		includes : [],
		dependencies : {
			libs : ["sap.m", "sap.ui.layout"],
			components : []
		},

		rootView : "test4.view.App",

		config : {
			resourceBundle : "i18n/Text.properties",
			serviceConfig : {
				name: "ZPROD_CRUDQ_SRV",
				serviceUrl: "/sap/opu/odata/sap/ZPROD_CRUDQ_SRV/"
			}
		},

		routing : {
			config : {
				routerClass : test4.MyRouter,
				viewType : "XML",
				viewPath : "test4.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : "{entity}/:tab:",
							name : "detail",
							view : "Detail"
						},
						{
							pattern : "/ProdOrderSet",
							name : "history",
							view : "OrderHistory"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound",
							transition : "show"
						}
					]
				}
			]
		}
	},

	init : function() {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var mConfig = this.getMetadata().getConfig();

		// Always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var oRootPath = jQuery.sap.getModulePath("test4");

		// Set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [oRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");

		var sServiceUrl = mConfig.serviceConfig.serviceUrl;

		//This code is only needed for testing the application when there is no local proxy available
		var bIsMocked = jQuery.sap.getUriParameters().get("responderOn") === "true";
		// Start the mock server for the domain model
		if (bIsMocked) {
			this._startMockServer(sServiceUrl);
		}

		// Create and set domain model to the component
		var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true, "girish", "Welcome@2");
		oModel.attachMetadataFailed(function(){
            this.getEventBus().publish("Component", "MetadataFailed");
		},this);
		this.setModel(oModel);

		// Set device model
		var oDeviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		oDeviceModel.setDefaultBindingMode("OneWay");
		this.setModel(oDeviceModel, "device");

        var oProdModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROD_CRUDQ_SRV/");
	    this.setModel(oProdModel, "Orders");

          var orderHistoryView = new sap.ui.xmlview("OrderHistory", "test4.view.OrderHistory");
          sap.ui.getCore().byId("__xmlview0--idAppControl").addDetailPage(orderHistoryView, false);
          
          var changeOrderView = new sap.ui.xmlview("ChangeOrder", "test4.view.ChangeOrder");
          sap.ui.getCore().byId("__xmlview0--idAppControl").addDetailPage(changeOrderView, false);
          
           var detailsView = new sap.ui.xmlview("ViewOrderDetails", "test4.view.ViewOrderDetails");
          sap.ui.getCore().byId("__xmlview0--idAppControl").addDetailPage(detailsView, false);
         //   debugger;
		this.getRouter().initialize();
	},

	_startMockServer : function (sServiceUrl) {
		jQuery.sap.require("sap.ui.core.util.MockServer");
		var oMockServer = new sap.ui.core.util.MockServer({
			rootUri: sServiceUrl
		});

		var iDelay = +(jQuery.sap.getUriParameters().get("responderDelay") || 0);
		sap.ui.core.util.MockServer.config({
			autoRespondAfter : iDelay
		});

		oMockServer.simulate("model/metadata.xml", "model/");
		oMockServer.start();


		sap.m.MessageToast.show("Running in demo mode with mock data.", {
			duration: 4000
		});
	},

	getEventBus : function () {
		return sap.ui.getCore().getEventBus();
	}
});