var cordovaInit = true;
Ext.Loader.setConfig({
	enabled : true,
	//WORKAORUND related to Android 3x Bug and Webview URL handling
	disableCaching: true
});

Ext.Loader.setPath('EatSense', 'app');

Ext.application({
	name : 'EatSense',
	controllers : [ 'CheckIn', 'Menu', 'Order', 'Settings', 'Request', 'Message', 
  'Android', 'Feedback', 'Styles', 'Account', 'History', 'Lounge', 'Facebook', 'InfoPage' ],
	models : [ 'CheckIn', 'User', 'Menu', 'Product', 'Choice', 'Option', 'Order', 'Cart', 'Spot', 'Business', 'Bill', 
  'PaymentMethod', 'Request', 'Newsletter', 'FeedbackForm', 'Feedback', 'Account', 'History', 'Profile', 'InfoPage'],
	views : [ 'Main', 'Dashboard', 'Checkinconfirmation', 'CheckinWithOthers', 'MenuOverview', 'ProductOverview', 
    'ProductDetail', 'OrderDetail', 'OptionDetail', 'Cart', 'Menu', 'Lounge', 'Newsletter', 'FeedbackForm', 'Login', 'History', 'HistoryDetail',
    'EatSense.view.BackButton', 'EatSense.view.SettingsView', 'About', 'Privacy'], 
	stores : [ 'CheckIn', 'User', 'Spot', 'AppState', 'Menu', 'Product', 'Order', 'Bill', 'Request', 'Feedback', 'Styles', 'History', 'InfoPage'],
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
		// 'EatSense.override.OperationImprovement',
		'EatSense.override.RadioOverride',
    'EatSense.override.CustomSpinner',
		'EatSense.model.AppState',
    'EatSense.override.CustomJsonWriter',
    'EatSense.override.MessageBox'
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

      //start set some app defaults
  		//timeout for requests
  		Ext.Ajax.timeout = 1200000;

      //On some devices. Sometimes MsgBoxes disappear behind other floating panels.
      //Give the message box a high zIndex to prevent hidden alerts!
      Ext.Msg.defaultAllowedConfig.zIndex = 100;

      //end set some app defaults

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
			   	
      // Destroy the #appLoadingIndicator and #cloobsterLoadingText elements
      Ext.fly('appLoadingWrapper').destroy();
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
        //Checks for existing access token. It exists when a user is logged in.
        accountCtr.checkAccessToken();
	   	}


	   	 //found a valid checkIn Id. Restore state.
	   	 if(restoredCheckInId) {
        checkInCtr.showDashboard();
        //show loading mask, because it can take a while if server is not responding immediately
        EatSense.util.Helper.toggleMask('restoreStateLoading');

        defaultHeaders['checkInId'] = restoredCheckInId;

   			 //reload old state
   			 EatSense.model.CheckIn.load(restoredCheckInId, {
   				scope: this,
   				success : function(record, operation) {
   					console.log('found existing checkin '+record);            
   					checkInCtr.restoreState(record);
            EatSense.util.Helper.toggleMask(false);   				
   				},
   				failure: function(record, operation) {
   					console.log('error restoring state');
            EatSense.util.Helper.toggleMask(false);

            delete defaultHeaders['checkInId'];

            //delete invalid checkInId in appState
            checkInCtr.getAppState().set('checkInId', '');

            checkInCtr.showDashboard();



            me.getApplication().handleServerError({
              'error': operation.error,
              'forceLogout': false,
              'message' : i10n.translate('restoreStateFailed')
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
    *       forceLogout: a critical permission error occured and the checkIn will be terminated
    *       true to logout on all errors 
    *       OR
    *       {errorCode : true|false} e.g. {403: true, 404: false}
    *       invalidAccessToken: same as forceLogout but in case of an invalid logged in user and not checkIn
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
               invalidAccessToken = options.userLogout,
               hideMessage = options.hideMessage,
               message = options.message,
               code = error.status,
               defaultErrorKey = null;

        if(typeof code != 'number') {
          console.log('App.handleServerError: code ' + code + ' not of type number. Set code to 500');
          code = 500;
        }

        	console.log('handle error: '+ code + ' ');
        	if(!hideMessage) {
        		EatSense.util.Helper.toggleAlertActive(true);
        	}
            switch(code) {
                case 403:
                  defaultErrorKey = 'errorPermission';
                  break;
                case 404:
                  defaultErrorKey = 'errorResource';
                  break;
                case 400: 
                  defaultErrorKey = 'errorResource';
                  break;
                case 0:
                  defaultErrorKey = 'errorCommunication';
                	break;
                default:
                  code = 500
                  defaultErrorKey = 'errorMsg';
                  break;
            };


            if(message && typeof message == "object" && message[code]) {
              errMsg = message[code];
            } else {
              try {
                nestedError = Ext.JSON.decode(error.responseText);
                errMsg = i10n.translate(nestedError.errorKey, nestedError.substitutions);

                if(!errMsg) {
                  if(typeof message == "string") {
                    errMsg = message;
                  } else {
                    errMsg = i10n.translate(defaultErrorKey);
                  }  
                }
              } catch (e) {
                  errMsg = (typeof message == "string") ? message : i10n.translate(defaultErrorKey);
              }
            }
            //handle checkIn logout                    
            if(forceLogout && (forceLogout[code] === true || forceLogout === true)) {
                this.fireEvent('statusChanged', appConstants.FORCE_LOGOUT);                        
            }
            //handle user logout
            if(invalidAccessToken && (invalidAccessToken[code] === true || invalidAccessToken === true)) {
              this.fireEvent('userLogout');
            }

        if(!hideMessage) {
        	Ext.Msg.alert(i10n.translate('errorTitle'), errMsg, function() {
        		EatSense.util.Helper.toggleAlertActive(false);
        	});	
        }
    }
});

