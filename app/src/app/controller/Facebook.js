/**
* Controller acts as a wrapper for Facebook SDK.
*/
Ext.define('EatSense.controller.Facebook', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Login', 'EatSense.model.Account'],
	config: {
		refs: {
			settingsview: 'settingsview',
			settingsTab: 'lounge settingstab',
			signupFbButton : 'login button[action=signup-fb]',
			connectFbDashboardButton : 'settingsview settings button[action=connect-fb]',
			connectFbClubButton : 'lounge settings button[action=connect-fb]',
			fbWallpostClubButton: 'clubarea clubdashboard button[action="fb-wallpost"]'
		},
		control: {
			signupFbButton: {
				tap: 'signupFbButtonHandler'
			},
			connectFbDashboardButton: {
				tap: 'connectFbDashboardButtonHandler'
			},
			connectFbClubButton: {
				tap: 'connectFbClubButtonHandler'
			},
			fbWallpostClubButton: {
				tap: 'postCheckIn'
			}
		}
	},
	/**
	* Tap event handler for signupFb button.
	* Calls the fb login method.
	*/
	signupFbButtonHandler: function() {
		var me = this,
			accountCtr = this.getApplication().getController('Account'),
			authResponse;

		Ext.Viewport.setMasked({
	    		xtype: 'loadmask',
	    		message: i10n.translate('general.processing')
	    });

		console.log('Facebook.signupFbButtonHandler');
		FB.login(function(response) {
            if (response.authResponse) {


                // Fb login success.
                // Now get user data.
                authResponse = response.authResponse;

                FB.api('/me', function(response) {
                	console.log('Facebook.signupFbButtonHandler > retrieved fb user with id='+response.id);

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

                	accountCtr.login(response, callback);
                	//unmask will be called from login method!
                	function callback() {
                		//user does not exist, ask user to create account
	                	if(!accountCtr.getAccount()) {
	                		accountCtr.showSignupConfimDialog(response);	
	                	}
                	}
                	
                });
            } else {
            	//no further interaction needed since the sdk does all the stuff
                console.log('Facebook.signupFbButtonHandler > user canceled or did not finish.')
                Ext.Viewport.unmask();
            }
            },
                { scope: "email" }
        );
		
		//to prevent a locked screen after unforseeable error hide the mask
		Ext.defer((function() {
			Ext.Viewport.unmask();
		}), appConfig.msgboxHideTimeout, this);
	},
	/**
	* Tap event handler for connectFbClubButton in settingstab.
	*/
	connectFbClubButtonHandler: function() {
		this.showConfirmConnectFbMsgBox(this.getSettingsTab());
	},
	/**
	* Tap event handler for connectFbClubButton in settingsview.
	*/
	connectFbDashboardButtonHandler: function() {
		this.showConfirmConnectFbMsgBox(this.getSettingsview());
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
			connectFbDashboardButton = this.getConnectFbDashboardButton(),
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

		FB.login(function(response) {
            if (response.authResponse) {
                // Fb login success.
                // Now get user data.
                authResponse = response.authResponse;

                FB.api('/me', function(response) {
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
                			me.toggleConnectWithFbButtons(false);
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
                });
            } else {
            	Ext.Viewport.unmask();
                console.log('Facebook.connectWithFacebook > Fb login failed.')
            }
            },
                { scope: "email" }
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

		FB.getLoginStatus(function(response) {
			console.log('Facebook.postCheckIn > FB.getLoginStatus response = ' + response.status);
		  if (response.status === 'connected' && response.authResponse && response.authResponse.userID) {
		  		// var uid = response.authResponse.userID;
    			// var accessToken = response.authResponse.accessToken;
    			// console.log('Facebook.postCheckIn > uid = ' + uid + ' accessToken='+accessToken);
		   		post();
		  } else {
			FB.login(function(response) {
		            if (response.authResponse) {
		            	post();
		            } else {
		                console.log('Facebook.postCheckIn > Fb login failed.')
		            }
	            },
	            { 
	            	scope: "email" 
	            }
		    );
			}
		});

        function callback(response) {
        }

        function post() {
        	FB.ui(obj, callback);	
        }
        
	},
	/**
    * Show or hide connect with fb buttons.
    * This is useful when the account auth is handled via facebook or google.
    * @param show
    *   true to show, false to hide
    */
	toggleConnectWithFbButtons: function(show) {
		var connectFbDashboardButton = this.getConnectFbDashboardButton(),
			connectFbClubButton = this.getConnectFbClubButton();

		connectFbDashboardButton.setHidden(!show);
		connectFbDashboardButton.setDisabled(!show);
		connectFbClubButton.setHidden(!show);
		connectFbClubButton.setDisabled(!show);
	},
	/**
	* Call FB.logout.
	* Reanable fb connect buttons.
	*/
	fbLogout: function() {
		var connectFbDashboardButton = this.getConnectFbDashboardButton(),
			connectFbClubButton = this.getConnectFbClubButton();

		this.toggleConnectWithFbButtons(true);

		console.log('Facebook.fbLogout');
		FB.logout();
	}
});