var cordovaInit = true;
Ext.Loader.setConfig({
	enabled : true,
	//WORKAORUND related to Android 3x Bug and Webview URL handling
	disableCaching: true
});

Ext.Loader.setPath({
  'EatSense' : 'app',
  'GT': 'app'
});

Ext.application({
	name : 'EatSense',

  /**
   * @event whitelabelmode
   * Fires when a whitelabel configuration was found.
   * @param {String} Name of the whitelabel
   */

	controllers : [ 'CheckIn', 'Lounge', 'Menu', 'Order', 'Settings', 'Request', 'Message', 
  'Android', 'Feedback', 'Styles', 'Account', 'History', 'Facebook', 'InfoPage', 'ContactInfo', 'Ztix', 
  'StoreCard',
  'GeoSearch'],
	models : [ 'CheckIn', 'User', 'Menu', 'Product', 'Choice', 'Option', 'Order', 'Cart', 
    'Spot', 
    'Business', 
    'Bill', 
    'PaymentMethod', 
    'Request', 
    'FeedbackForm', 
    'Feedback', 
    'Account', 
    'History', 
    'Profile', 
    'InfoPage', 
    'Area', 
    'DashboardItem', 
    'Visit', 
    'ZtixEvent',
    'LocationLight'],
	views : ['Dashboard', 'Checkinconfirmation', 'MenuOverview', 'ProductOverview', 
    'ProductDetail', 'OrderDetail', 'OptionDetail', 'Cart', 'Menu', 'Lounge', 'FeedbackForm', 'Login', 'History', 'HistoryDetail',
    'EatSense.view.BackButton', 'About', 'Privacy'], 
	stores : ['CheckIn', 'User', 'Spot', 'AppState', 'Menu', 'Product', 'Order', 
          'Bill', 'Request', 'Feedback', 'Styles', 'History', 'InfoPage', 'Area', 
          'DashboardItem', 'Visit', 'ZtixEvent', 'ZtixCoupon',
          'LocationSearch'],
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
    'Ext.util.DelayedTask',
    //util
    'EatSense.util.AjaxHeaderHelper',
    'EatSense.util.Constants',
    'EatSense.util.Helper',
    'EatSense.util.Configuration',
    'EatSense.util.Localization',
    'EatSense.util.Translations',
    'EatSense.util.Channel',
    'EatSense.util.EventBus',
    'Ext.data.identifier.None',
		//require custom types
		'EatSense.override.CustomRestProxy',
		// 'EatSense.override.OperationImprovement',
    'EatSense.override.AssociationsStore',
		'EatSense.override.RadioOverride',
    'EatSense.override.CustomSpinner',
		'EatSense.model.AppState',
    'EatSense.override.CustomJsonWriter',
    'EatSense.override.MessageBox',
    'GT.override.FixedButton',
    'EatSense.ux.slidenavigation.collapsible.View'
	],
	launch : function() {
		console.log('App.launch');		
    	this.launched = true;
      this.mainLaunch();
	},
	mainLaunch : function() {
		var me = this;
    //Wait for phonegap to launch
		if (Ext.os.deviceType.toLowerCase() != "desktop" && (cordovaInit == false || !this.launched)) {
     	return;
    }        
		
	  console.log('App.mainLaunch');
    if(!console.error) {
      console.log('Console.error not available. Redirecting to console.log');
      console.error = console.log;
    }

    //Toolbar iOS 7 Workaround https://druckit.wordpress.com/category/javascript/sencha-touch-2/
    if (Ext.os.is.iOS) {
      if (Ext.os.version.major >= 7) {
         // if (EatSense.app.isNative) // manual flag to denote "native" mode
          Ext.Viewport.setHeight(Ext.Viewport.getWindowHeight() - 20);
         // }
      }
    }
    
    //check for whitelabel configurations and then proceed
    try {
      this.initConfiguration(proceedWithLaunch);
    } catch(e) {
      proceedWithLaunch();
      console.error('Application.mainLaunch: error initializing configuration, proceed with launch ' + e);
    }
    

    function proceedWithLaunch() {
      //check if a network state exists when cordova is runnning
    //only proceed if a network connection is detected
      if(navigator && navigator.network) {        
        me.checkConnection(me.initCloobster);
      } else {
        me.initCloobster();
      }
    }
	},
  /**
  * Checks the network connection state. 
  * If no connection exists ask user to retry. If he denies the app will exit (only on Android).
  * @param {Function} callback
  *   Executed when on successful connection check or if no check is possible
  */
  checkConnection: function(callback) {
    var me = this,
        networkState = navigator.connection.type;
      //since cordova 2.2 network.connection is decprecated
      //simply use connection (http://docs.phonegap.com/en/2.4.0/cordova_connection_connection.md.html#Connection)

    //possible states
    // Connection.UNKNOWN
    // Connection.ETHERNET
    // Connection.WIFI
    // Connection.CELL_2G
    // Connection.CELL_3G
    // Connection.CELL_4G
    // Connection.NONE

    console.log('App.checkConnection: type=' + networkState);


    if(networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
      Ext.Msg.show({
        title: i10n.translate('error'),
        message: i10n.translate('errorCommunication'),
        buttons: [{
          text: i10n.translate('retry'),
          itemId: 'yes',
          ui: 'action'
        }, {
          text:  i10n.translate('leave'),
          itemId: 'no',
          ui: 'action',
          //set hidden on iOS because Apple does not allow app closing
          hidden: Ext.os.is.iOS
        }],
        scope: this,
        fn: function(btnId, value, opt) {
        if(btnId == 'yes') {
            //retry
            Cloobster.asyncJsapiLoad();
            me.checkConnection(callback);
        } else {
          //close the app
          navigator.app.exitApp();
        }
        }
      });  
    } else if(networkState == Connection.CELL_2G && Ext.os.is.Android) {
      //only Android reports the state correctly for cellular data
      //http://docs.phonegap.com/en/2.2.0/cordova_connection_connection.md.html#connection.type
      Ext.Msg.show({
        title: i10n.translate('hint'),
        message: i10n.translate('network.slow'),
        buttons: [{
          text: i10n.translate('ok'),
          itemId: 'yes',
          ui: 'action'
        }],
        scope: this,
        fn: function(btnId, value, opt) {          
          callback.apply(me);
        }
      });  
    } else {
      callback.apply(me);
    }
  },
  /**
  * Do initialization. Check the localstorage for existing checkIns or an account.
  */
  initCloobster: function() {
      var me = this,
        appStateStore = Ext.data.StoreManager.lookup('appStateStore'),
        checkInCtr = this.getController('CheckIn'),
        accountCtr = this.getController('Account'),
        restoredCheckInId,
        //default ajax headers
        defaultHeaders = {}; 

        //start set some app defaults
        //timeout for requests, also set in EatSense.override.CustomRestProxy
        Ext.Ajax.setTimeout(90000);

        //On some devices. Sometimes MsgBoxes disappear behind other floating panels.
        //Give the message box a high zIndex to prevent hidden alerts!
        Ext.Msg.defaultAllowedConfig.zIndex = 100;

        //end set some app defaults

        headerUtil.addHeader('cloobster-api', appConfig.cloobsterApi);

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
          checkInCtr.restoreState(restoredCheckInId);
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
         Ext.fly('appLoadingWrapper').destroy();
         checkInCtr.initMainView();
       }  
  },

	/**
    *   Gloabl handler that can be used to handle errors occuring from server requests.
    *   @param options
    *       Configuration object
    *      
    *       error: error object containing status and responseText.
    *       forceLogout: a critical permission error occured and the checkIn will be terminated
    *       true to logout on all errors 
    *       OR
    *       {errorCode : true|false} e.g. {403: true, 404: false}
    *       invalidAccessToken: same as forceLogout but in case of an invalid logged in user and not checkIn
    *       hideMessage: true if you don't want do display an error message
    *       message: message to show. If no message is set a default message will be displayed.
    *		    can be either a common message for all status codes or a specialized message
    *		    {403: 'message 1', 404: 'message 2'}
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

        	console.log('App.handleServerError: '+ code + ' Message: ' + message);
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
                case 460:
                  defaultErrorKey = 'error.version';
                  break;
                case 401:
                  defaultErrorKey = 'error.account.required';
                  break;
                case 503:
                  //AppEngine problems
                  defaultErrorKey = 'error.appengine';
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
    },
    /**
    * Initializes the global app configuration.
    * This includes the check if a whitelabel configuration exists.
    * If this is the case, merge it with {@link EatSense.util.Configuration}.
    * @param {Function} callback
    *
    */
    initConfiguration: function(callback) {
      var whitelabelConfig = null,
          configName;

      if(!appConfig.whitelabelConfig || 
          appConfig.whitelabelConfig.length == 0 ||
          appConfig.whitelabelConfig == 'cloobster') {
        callback();
        return;
      }

      configName = appConfig.whitelabelConfig;

      Ext.Ajax.request({
        url: 'whitelabel/' + configName + '/Configuration.json',
        success: function(response) {          
          try {
            whitelabelConfig = Ext.JSON.decode(response.responseText);
            console.log('Application.initConfiguration: load whitelabel configuration for ' + whitelabelConfig);
            Ext.merge(appConfig, whitelabelConfig);
          } catch(e) {
            console.error('Application.initConfiguration: could not decode whitelabel configuration ' + e);
          }
          //Submit the whitelabel with each request, so that the server side can react accordingly
          headerUtil.addHeader('cloobster-whitelabel', configName);
          callback();
          Ext.Viewport.fireEvent('whitelabelmode', configName);
        },
        failure: function(response) {
          callback();
          if(response.status == 404) {
             console.error('Application.initConfiguration: no whitelabel configuration found');
          } else {
             console.error('Application.initConfiguration: error ' + response.status);
          }
        }
      });

    }
});

