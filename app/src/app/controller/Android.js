/**
* Specifically handles actions relevant for Android.
*/
Ext.define('EatSense.controller.Android', {
	extend: 'Ext.app.Controller',
	config: {
		//Array of functions to execute when back button event is triggered
		androidBackHandler : null,
		//when true, will exit application on next backbutton event
		exitOnBack: false
	},
	launch: function() {

	},
	addBackHandler: function(handler) {
		if(appHelper.isFunction(handler) && appHelper.isArray(this.getAndroidBackHandler())) {
			console.log('Android Controller -> addBackHandler');
			this.getAndroidBackHandler().push(handler);	
		} else {
			console.log('handler is not of type function');
		}
	},
	removeLastBackHandler: function() {		
		if(appHelper.isArray(this.getAndroidBackHandler())) {
			console.log('Android Controller -> removeLastBackHandler');
			this.getAndroidBackHandler().pop();
		}		
	},
	executeBackHandler: function() {
		var handler,
			msgBox;
		
		if(appHelper.isArray(this.getAndroidBackHandler()) &&  this.getAndroidBackHandler().length > 0) {
			console.log('Android Controller -> executeBackHandler');
			this.setExitOnBack(false);
			handler = this.getAndroidBackHandler().pop();
			handler();
		} else {			
			if(this.getExitOnBack()) {
				console.log('Android Controller -> executeBackHandler: exit app');
				navigator.app.exitApp();
			} else {
				msgBox = Ext.create('Ext.MessageBox', {
					modal: false,
					centered: false,
					bottom: '5%',
					'message' : i10n.translate('android.backbutton.exit'),
					buttons : []
				});

				msgBox.show();

				//show short alert and then hide
				Ext.defer((function() {
					if(!appHelper.getAlertActive()) {
						msgBox.destroy();
					}					
				}), appConfig.msgboxHideTimeout, this);

				this.setExitOnBack(true);	
			}
			
		}
	}
});