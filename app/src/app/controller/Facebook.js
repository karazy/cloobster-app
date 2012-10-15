/**
* Controller acts as a wrapper for Facebook SDK.
*/
Ext.define('EatSense.controller.Facebook', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Login', 'EatSense.model.Account'],
	config: {
		refs: {
			signupFbButton : 'login button[action=signup-fb]',
			connectFbDashboardButton : 'settingsview settings button[action=connect-fb]',
			connectFbClubButton : 'lounge settings button[action=connect-fb]',
		},
		control: {
			signupFbButton: {
				tap: 'signupFbButtonHandler'
			},
			connectFbDashboardButton: {
				tap: 'connectFbButtonHandler'
			},
			connectFbClubButton: {
				tap: 'connectFbButtonHandler'
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

		console.log('Facebook.signupFbButtonHandler');
		FB.login(function(response) {
            if (response.authResponse) {
                // Fb login success.
                // Now get user data.
                authResponse = response.authResponse;

                FB.api('/me', function(response) {
                	console.log('Facebook.signupFbButtonHandler > retrieved fb user with id='+response.id);

                	//add access token from authResponse
                	response.accessToken = authResponse.accessToken;

                	accountCtr.login(response, callback);

                	function callback() {
                		//user does not exist, ask user to create account
	                	if(!accountCtr.getAccount()) {
	                		accountCtr.showSignupConfimDialog(response);	
	                	}
                	}
                	
                });
            } else {
                console.log('Facebook.signupFbButtonHandler > Fb login failed.')
                // handle failed fb login here.
            }
            },
                { scope: "email" }
        );
	},
	/**
	* Tap event handler for connect fb button in settingstab.
	*/
	connectFbButtonHandler: function() {
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
					this.connectWithFacebook();
				}
			}
		});
	},
	/**
	* Connects an existing account with facebook.
	* 
	*/
	connectWithFacebook: function() {
		var me = this,
			accountCtr = this.getApplication().getController('Account'),
			account = accountCtr.getAccount(),
			authResponse;

		if(!account) {
			//show message that user is not logged in
			Ext.MSg.alert(i10n.translate('error'), i10n.translate('facebook.connect.notlogin'));
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

                	//add access token from authResponse
                	response.accessToken = authResponse.accessToken;

                	account.set('fbUserId', response.id);
                	account.set('fbAccessToken', response.accessToken);

                	account.save({
                		success: function(record, operation) {
                			//unmask settings
                			Ext.Viewport.unmask();
                			Ext.MSg.alert(i10n.translate('success'), i10n.translate('facebook.connect.success'));
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
	},
	/**
	* Does a simple facebook wall post for the logged in user.
	*/
	postOnWall: function(text) {
  		 // calling the API ...
        var obj = {
          method: 'feed',
          link: 'http://www.cloobster.com',
          // picture: 'http://fbrell.com/f8.jpg',
          name: 'cloobster CheckIn',
          caption: 'Service at its peak.',
          description: text
        };

        function callback(response) {
          // document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
        }

        FB.ui(obj, callback);
	},
	/**
	*
	*/
	fbLogout: function() {
		console.log('Facebook.fbLogout');
		FB.logout();
	}
});