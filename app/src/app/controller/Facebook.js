/**
* Controller acts as a wrapper for Facebook SDK.
*/
Ext.define('EatSense.controller.Facebook', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Login', 'EatSense.model.Account'],
	config: {
		refs: {
			settingsView : 'settingstab',
			connectFbClubButton : 'settings button[action=connect-fb]',
			fbWallpostClubButton: 'clubarea clubdashboard button[action="fb-wallpost"]'
		},
		control: {
			connectFbClubButton: {
				tap: 'connectFbClubButtonHandler'
			},
			fbWallpostClubButton: {
				tap: 'postCheckIn'
			}
		}
	},
	launch: function() {
		var me = this,
			accountCtr = this.getApplication().getController('Account'),
			checkInCtr = this.getApplication().getController('CheckIn');

		if (!window.cordova) {

		 window.fbAsyncInit = function() {
		 	console.log('Facebook.launch: init facebook');
	        window.facebookConnectPlugin.browserInit("359215437471990");	        
	      };
	      //load facebook sdk async
		 (function(d, s, id){
	         var js, fjs = d.getElementsByTagName(s)[0];
	         if (d.getElementById(id)) {return;}
	         js = d.createElement(s); js.id = id;
	         js.src = "//connect.facebook.net/en_US/sdk.js";
	         fjs.parentNode.insertBefore(js, fjs);
	       }(document, 'script', 'facebook-jssdk'));						
		}
		

		accountCtr.on({
			'userloginprovider': function(provider, callback) {
				if(provider == 'facebook') {						
					me.signupWithFacebook(callback);				
				}

			},
			scope: this
		});

		checkInCtr.on({
			'businessloaded' : this.manageFacebook,
			scope: this
		});
	},

 /**
  * Depending on location.features settings. Enables or disables facebook post.
  * @param {EatSense.model.Business} location
  */
  manageFacebook: function(location) {
  	var me = this,
  		features,
  		fbWallpostClubButton = this.getFbWallpostClubButton();


  	if(!location) {
  		console.error('Facebook.manageFacebook: no location given');
  		return;
  	}

  	if(!location.raw.features) {
  		console.log('Facebook.manageFacebook:  location contains no features. Enable FB by default.');
  		if(fbWallpostClubButton) {
			fbWallpostClubButton.setHidden(false);
		}
  		return;
  	}

  	features = location.raw.features;

  	//TODO if club dashboard is not pre created we this has to be handled differently
	if(typeof features['facebook-post'] != 'undefined') {
		if(fbWallpostClubButton) {
			fbWallpostClubButton.setHidden(!features['facebook-post']);
		}			
	}
  },
	/**
	* Signup via facebook. Lets user login to facebook
	* and creates an account with retrieved data.
	* @param {Function} loginCallback
	*  Executed on success. Gets passed facebook data.
	*/
	signupWithFacebook: function(loginCallback) {
		var me = this,
			authResponse;

	    appHelper.toggleMask('general.processing');

		console.log('Facebook.signupWithFacebook');
		window.facebookConnectPlugin.login(
			["email"],
	    	function(response) {
            	if (response.authResponse) {
	                // Fb login success.
	                // Now get user data.
	                authResponse = response.authResponse;

	                window.facebookConnectPlugin.api('/me',['email'], function(response) {
	                	console.log('Facebook.signupWithFacebook: retrieved fb user with id='+response.id);

	                	//code: 190
						// error_subcode: 467
						// message: "Error validating access token: The session is invalid because the user logged out."
						// type: "OAuthException"
	                	if(response.error) {
	                		appHelper.toggleMask(false);
	                		Ext.Msg.alert(i10n.translate('hint'), i10n.translate('facebook.connect.canceled'));
	                		return;
						}

	                	//add access token from authResponse
	                	response.accessToken = authResponse.accessToken;
	                	loginCallback(response);
	                	
		                }, function(error) {
		                	console.log('Facebook.signupWithFacebook: error ' + error);
		                });
		            } else {
		            	//no further interaction needed since the sdk does all the stuff
		                console.log('Facebook.signupWithFacebook: user canceled or did not finish.')
		                appHelper.toggleMask(false);
		            }
	        }, 
	        me.errorHandlerCallback
	        
        );
		//TODO does this make sense?
		//to prevent a locked screen after unforseeable error hide the mask
		Ext.defer((function() {
			appHelper.toggleMask(false);
		}), appConfig.msgboxHideTimeout, this);
	},
	/**
	* Tap event handler for connectFbClubButton in settingstab.
	*/
	connectFbClubButtonHandler: function() {
		this.showConfirmConnectFbMsgBox(this.getSettingsView());
	},
	/**
	* Show a confirmation and ask user to connect a fb account.
	* @callingview
	*	Settingsview from which this method was called
	*/
	showConfirmConnectFbMsgBox: function(callingview) {
		Ext.Msg.show({
			title: i10n.translate('hint'),
			message: i10n.translate('facebook.connect.confirm'),
			buttons: [{
				text: i10n.translate('yes'),
				itemId: 'yes',
				ui: 'action'
			}, {
				text:  i10n.translate('no'),
				itemId: 'no',
				ui: 'action'
			}],
			scope: this,
			fn: function(btnId, value, opt) {
				if(btnId == "yes") {
					this.connectWithFacebook(callingview);
				}
			}
		});
	},
	/**
	* Connects an existing account with facebook.
	* Tries to login user to facebook and saves account with retrieved userId.
	* @callingview
	*	Settingsview from which this method was called
	*/
	connectWithFacebook: function(callingview) {
		var me = this,
			accountCtr = this.getApplication().getController('Account'),
			settingsCtr = this.getApplication().getController('Settings'),
			account = accountCtr.getAccount(),
			authResponse,
			connectFbClubButton = this.getConnectFbClubButton();

		if(!account) {
			//show message that user is not logged in
			Ext.Msg.alert(i10n.translate('error'), i10n.translate('facebook.connect.notlogin'));
			return;
		};

		//mask Viewport
		Ext.Viewport.setMasked({
	    		xtype: 'loadmask',
	    		message: i10n.translate('general.processing')
	    });

		window.facebookConnectPlugin.login(
			['email'],
			function(response) {
	            if (response.authResponse) {
	                // Fb login success.
	                // Now get user data.
	                authResponse = response.authResponse;

	                window.facebookConnectPlugin.api('/me', function(response) {
	                	console.log('Facebook.connectWithFacebook > retrieved fb user with id='+response.id);

	                	//code: 190
						// error_subcode: 467
						// message: "Error validating access token: The session is invalid because the user logged out."
						// type: "OAuthException"
	                	if(response.error) {
	                		Ext.Viewport.unmask();
	                		Ext.Msg.alert(i10n.translate('hint'), i10n.translate('facebook.connect.canceled'));
	                		return;
						}

	                	//add access token from authResponse
	                	response.accessToken = authResponse.accessToken;

	                	account.set('fbUserId', response.id);
	                	account.set('fbAccessToken', response.accessToken);

	                	account.save({
	                		success: function(record, operation) {
	                			//unmask settings
	                			Ext.Viewport.unmask();
	                			Ext.Msg.alert(i10n.translate('success'), i10n.translate('facebook.connect.success'));
	                			settingsCtr.loadSettings(callingview);
	                		},
	                		failure: function(record, operation) {
								//unmask settings
								Ext.Viewport.unmask();
								me.getApplication().handleServerError({
					                'error': operation.error,
					                'forceLogout': {
					                	403 : true
					                }
					            }); 
	                		}
	                	});
	                }
	                ,me.errorHandlerCallback
	                );
	            } else {
	            	Ext.Viewport.unmask();
	                console.log('Facebook.connectWithFacebook > Fb login failed.')
	            }
            },
            me.errorHandlerCallback
        );
	
		//to prevent a locked screen after unforseeable error hide the mask
		Ext.defer((function() {
			Ext.Viewport.unmask();
		}), appConfig.msgboxHideTimeout, this);
	},
	/**
	* Do a post for the location (business) user has checked in.
	* No account needed for this action.
	*/
	postCheckIn: function(text) {
		var me = this,			
			business = this.getApplication().getController('CheckIn').getActiveBusiness(),
			// account = this.getApplication().getController('Account').getAccount(),
			logo,
			obj;

		if(!business) {
			console.log('Facebook.postCheckIn > Fail! No active business. ');
			return;
		}
		try {
			//access raw data because images are submitted as a map
			logo = business.raw.images.fbwallpost.url || '';
		} catch(e) {
			console.log('Facebook.postCheckIn > error business.raw.images.fbwallpost ' + e);
			logo = '';
		}

		if(!logo) {			
			if(!business.get('url')) {
				logo = 'http://www.cloobster.com/images/empty.png';
			}
		}
		
		console.log('Facebook.postCheckIn > logo = ' + logo);

		// calling the API ...
        obj = {
          method: 'feed',
          link: business.get('fbUrl') || business.get('url') || 'http://www.cloobster.com', //link to business
          picture: logo, //FB Business logo, as fallback don't include an image
          name: business.get('name'), //business name
          caption: business.get('slogan') || '', //slogan
          description: business.get('description') || ''
        };

		window.facebookConnectPlugin.getLoginStatus(function(response) {
			console.log('Facebook.postCheckIn > window.facebookConnectPlugin.getLoginStatus response = ' + response.status);
			// && response.authResponse && response.authResponse.userID
		  if (response.status === 'connected') {
		  		// var uid = response.authResponse.userID;
    			// var accessToken = response.authResponse.accessToken;
    			// console.log('Facebook.postCheckIn > uid = ' + uid + ' accessToken='+accessToken);
    			console.log('Facebook.postCheckIn: post (already logged in)');
		   		post();
		  } else {
			window.facebookConnectPlugin.login(
				['email'],
	            function(response) {
		            if (response.authResponse) {
		            	console.log('Facebook.postCheckIn: post after login');
		            	post();
		            } else {
		                console.log('Facebook.postCheckIn: Fb login failed.')
		            }
	            },
	            me.errorHandlerCallback	            
		    );
			}
		}, me.errorHandlerCallback);

        function callback(response) {
        }

        function post() {
        	window.facebookConnectPlugin.showDialog(obj, callback, me.errorHandlerCallback);	
        }
        
	},
	/**
	* Call window.facebookConnectPlugin.logout.
	* Reanable fb connect buttons.
	*/
	fbLogout: function() {
		console.log('Facebook.fbLogout');
		window.facebookConnectPlugin.logout();
	},
	/**
	* FB error handlercallback
	*
	*/
	errorHandlerCallback: function(status) {
		console.log('Facebook.errorHandlerCallback: status ' + status);
		Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('error.facebook'));	
	}
});