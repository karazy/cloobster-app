Ext.Loader.setConfig({
	enabled : true,
	//WORKAORUND related to Android 3x Bug and Webview URL handling
	disableCaching: Karazy.config.disableCaching
});

Ext.Loader.setPath('EatSense', 'app');

Ext.application({
	name : 'EatSense',
	controllers : [ 'CheckIn', 'Menu', 'Order', 'Settings', 'Request', 'Message', 'Android', 'Feedback', 'Styles', 'Account', 'History' ],
	models : [ 'CheckIn', 'User', 'Menu', 'Product', 'Choice', 'Option', 'Order', 'Cart', 'Spot', 'Bill', 
  'PaymentMethod', 'Request', 'Newsletter', 'FeedbackForm', 'Feedback', 'Account', 'History'],
	views : [ 'Main', 'Dashboard', 'Checkinconfirmation', 'CheckinWithOthers', 'MenuOverview', 'ProductOverview', 
    'ProductDetail', 'OrderDetail', 'OptionDetail', 'Cart', 'Menu', 'Lounge', 'Newsletter', 'Feedback', 'Login', 'History'], 
	stores : [ 'CheckIn', 'User', 'Spot', 'AppState', 'Menu', 'Product', 'Order', 'Bill', 'Request', 'Feedback', 'Styles', 'History'],
	phoneStartupScreen: 'res/images/startup.png',
	tabletStartupScreen: 'res/images/startup.png',
	requires: [
		//require most common types
		'Ext.Container',
		'Ext.Panel',
		'Ext.dataview.List',
		'Ext.Label',
		'Ext.TitleBar',
    'Ext.Anim',
    'Ext.MessageBox',
    'Ext.DateExtras',
    //util
    'EatSense.util.AjaxHeaderHelper',
    'EatSense.util.Constants',
    'EatSense.util.Helper',
    'EatSense.util.Configuration',
    'EatSense.util.Localization',
    'EatSense.util.Translations',
    'EatSense.util.Channel',
		//require custom types
		'EatSense.override.CustomRestProxy',
		'EatSense.override.OperationImprovement',
		'EatSense.override.RadioOverride',
    'EatSense.override.CustomSpinner',
		'EatSense.model.AppState',
    'EatSense.override.CustomJsonWriter'
	],
	launch : function() {
		console.log('App -> launch');		
    	this.launched = true;
        this.mainLaunch();
	},
	mainLaunch : function() {
		
    //Wait for phonegap to launch
		if (cordovaInit == false || !this.launched) {
     	return;
    }

		console.log('App -> mainLaunch');
		
		var me = this,
  			appStateStore = Ext.data.StoreManager.lookup('appStateStore'),
  	 		checkInCtr = this.getController('CheckIn'),
        settingsCtr = this.getController('Settings'),
        accountCtr = this.getController('Account'),
  	 		restoredCheckInId,
        //default ajax headers
        defaultHeaders = {}; 

  		//timeout for requests
  		Ext.Ajax.timeout = 1200000;

      //set Default headers object
      Ext.Ajax.setDefaultHeaders(defaultHeaders);

    //----- Launch functions start ------  	
    //TODO: Bug in current state. Controller launch function not executed in correct order. So this logic is moved here.
    //Android controller launch
		//Android specific behaviour
    if(Ext.os.is.Android) {
      	console.log('Android Controller -> setup android specific behaviour');
      	document.addEventListener('backbutton', onBackKeyDown, false);
        function onBackKeyDown() {            
              console.log('fire backbutton event');
              me.getController('Android').executeBackHandler();
      };
    }

    //----- Launch functions end ------
		
    	
	   	//create main screen
	   	Ext.create('EatSense.view.Main')

      //try to restore application state
	   	try {
        appStateStore.load();
	   	} catch (e) {
	   		appStateStore.removeAll();
	   	}
	     
	     
	   	if(appStateStore.getCount() == 1) {
	   		console.log('app state found');
		   	checkInCtr.setAppState(appStateStore.getAt(0));
	   		restoredCheckInId = checkInCtr.getAppState().get('checkInId');
        accountCtr.checkAccessToken();
	   	}


	   	 //found a valid checkIn Id. Restore state.
	   	 if(restoredCheckInId) {
        checkInCtr.showDashboard();
        //show loading mask, because it can take a while if server is not responding immediately
        checkInCtr.toggleDashboardMask('restoreStateLoading');

        defaultHeaders['checkInId'] = restoredCheckInId;

   			 //reload old state
   			 EatSense.model.CheckIn.load(restoredCheckInId, {
   				scope: this,
   				success : function(record, operation) {
   					console.log('found existing checkin '+record);
            checkInCtr.toggleDashboardMask(false);
   					checkInCtr.restoreState(record);  						   				
   				},
   				failure: function(record, operation) {
   					console.log('error restoring state');
            checkInCtr.toggleDashboardMask(false);

            delete defaultHeaders['checkInId'];

   					// appStateStore.removeAll();
   					// appStateStore.sync();
   					// appStateStore.add(checkInCtr.getAppState());

            //delete invalid checkInId in appState
            checkInCtr.getAppState().set('checkInId', '');

            checkInCtr.showDashboard();

            me.getApplication().handleServerError({
              'error': operation.error,
              'forceLogout': false,
              'message' : Karazy.i18n.translate('restoreStateFailed')
            });
   				}
        });
	   	 }	   		 	   	 	   	 
	   	 else {	   		 
	   		if (appStateStore.getCount() > 1){
		   	  console.log('Too many appStates! Clearing cache. this should never happen.');
		   	  appStateStore.removeAll();
          appStateStore.sync();
		   	} else {
		   		console.log('no app state found.');
		   	}
	   		 appStateStore.add(checkInCtr.getAppState());
	   		 checkInCtr.showDashboard();
	   	 }	
	},

	//Global utility methods
	/**
    *   Gloabl handler that can be used to handle errors occuring from server requests.
    *   @param options
    *       Configuration object
    *      
    *       error: error object containing status and statusText.
    *       forceLogout: a critical permission error occured and the user will be logged out
    *       true to logout on all errors 
    *       OR
    *       {errorCode : true|false} e.g. {403: true, 404: false}
    *       hideMessage: true if you don't want do display an error message
    *       message: message to show. If no message is set a default message will be displayed.
    *		can be either a common message for all status codes or a specialized message
    *		{403: 'message 1', 404: 'message 2'}
    */
    handleServerError: function(options) {
        var    errMsg,
               nestedError,
               error = options.error,
               forceLogout = options.forceLogout,
               hideMessage = options.hideMessage,
               message = options.message;
        if(error && typeof error.status == 'number') {
        	console.log('handle error: '+ error.status + ' ' + error.statusText);
        	if(!hideMessage) {
        		Karazy.util.toggleAlertActive(true);
        	}
            switch(error.status) {
                case 403:
                    //no permission
                    if(typeof message == "object" && message[403]) {
                    	errMsg = message[403];
                    } else {
                    	errMsg = (typeof message == "string") ? message : Karazy.i18n.translate('errorPermission');
                    }
                    
                    if(forceLogout && (forceLogout[403] === true || forceLogout === true)) {
                        this.fireEvent('statusChanged', Karazy.constants.FORCE_LOGOUT);
                    }
                    break;
                case 404:
                    //could not load resource or server is not reachable
                    if(typeof message == "object" && message[404]) {
                    	errMsg =  message[404];
                    } else {
                    	errMsg = (typeof message == "string") ? message : Karazy.i18n.translate('errorResource');
                    }
                    if(forceLogout && (forceLogout[404] === true || forceLogout === true)) {
                        this.fireEvent('statusChanged', Karazy.constants.FORCE_LOGOUT);
                    }
                    break;
                case 400: //entered data is not valid
                    if(typeof message == "object" && message[400]) {
                      errMsg =  message[400];
                    } else {
                      errMsg = (typeof message == "string") ? message : Karazy.i18n.translate('errorResource');
                    };
                    if(forceLogout && (forceLogout[400] === true || forceLogout === true)) {
                        this.fireEvent('statusChanged', Karazy.constants.FORCE_LOGOUT);
                    };
                    breakM
                case 0:
                	//communication failure, could not contact server
                	if(typeof message == "object" && message[0]) {
                		errMsg = message[0];
                    } else {
                    	errMsg = (typeof message == "string") ? message : Karazy.i18n.translate('errorCommunication');
                    }
                    if(forceLogout && (forceLogout[0] === true || forceLogout === true)) {
                        this.fireEvent('statusChanged', Karazy.constants.FORCE_LOGOUT);
                    }
                	break;
                default:
                    if(typeof message == "object" && message[500]) {
                    	errMsg = message[500];                    
                    } else {
                    	try {
                    		nestedError = Ext.JSON.decode(error.responseText);
                    		errMsg = Karazy.i18n.translate(nestedError.errorKey,nestedError.substitutions);
	                    } catch (e) {
	                        errMsg = (typeof message == "string") ? message : Karazy.i18n.translate('errorMsg');
	                    }
                    }
                    if(forceLogout && (forceLogout[500] === true || forceLogout === true)) {
                        this.fireEvent('statusChanged', Karazy.constants.FORCE_LOGOUT);
                    }
                    break;
            }
        }
        if(!hideMessage) {
        	Ext.Msg.alert(Karazy.i18n.translate('errorTitle'), errMsg, function() {
        		Karazy.util.toggleAlertActive(false);
        	});	
        }
    }
});

