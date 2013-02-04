/**
* Controller handles login, signup, facebook connect.
* Updates of account settings currently handled by Settings Controller.
*/
Ext.define('EatSense.controller.Account', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Login', 'EatSense.model.Account'],
	config: {
		refs: {
			mainView: 'mainview',
			loginView : {
				selector: 'login',
				xtype: 'login',
				autoCreate: true
			},
			settingsView: 'mainview settingsview',			
			showLoginButtonDashboard : 'dashboard button[action=show-login]',
			showSettingsButtonDashboard : 'dashboard button[action=profile]',
			settingsViewBackButton: 'mainview settingsview settings #backButton',
			logoutDashboardButton: 'settingsview button[action=logout]',
			loginViewBackButton : 'login button[action=back]',
			signupButton : 'login button[action=signup]',
			loginButton : 'login button[action=login]',
			requestPwButton : 'login button[action=request-password]',
			loginForm : 'login formpanel',
			passwordField: 'login passwordfield'
		},
		control: {
			showLoginButtonDashboard : {
				tap: 'showLoginView'
			},
			showSettingsButtonDashboard : {
				tap: 'showSettingsView'
			},
			settingsViewBackButton: {
				tap: 'settingsViewBackButtonHandler'
			},
			requestPwButton : {
				tap: 'requestPwButtonHandler'
			},
			logoutDashboardButton : {
				tap: 'logoutDashboardButtonHandler'
			},
			loginViewBackButton : {
				tap: 'loginViewBackButtonHandler'
			},
			signupButton : {
				tap: 'signupButtonHandler'
			},
			loginButton : {
				tap: 'loginButtonHandler'
			}
		},
		//user account if logged in
		account: null,
		//users profile if logged in
		profile: null
	},

	init: function() {
		//occurs when a user has an invalid login
		this.getApplication().on('userLogout', this.logout, this);
	},
	/**
	* Searches for accessToken in localstorage. If one is found
	* sets X-Auth in header and loads the corresponding account.
	*/
	checkAccessToken: function() {
		var accessToken,
			checkInCtr = this.getApplication().getController('CheckIn');

		accessToken = checkInCtr.getAppState().get('accessToken');
		      //If access token was found set it
      	if(accessToken) {
      		console.log('Account.checkAccessToken > found accessToken');
        	headerUtil.addHeader('X-Auth', accessToken);
        	//load users account
        	this.loadAccount(checkInCtr.getAppState().get('accountId'));
        	this.hideDashboardLoginButton();
		};
	},
	/**
	* Loads users account and sets it in Account Controller.
	* After successful account loading, loads the corresponding profile.
	* @param id
	*	Account id.
	*/
	loadAccount: function(id) {
		var me = this;

		EatSense.model.Account.load(id,{
			success: function(record, operation) {
				//set account to make it accesible for the application
				me.setAccount(record);
				me.loadProfile(record.get('profileId'));
			},
			failure: function(record, operation) {
    	    	me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': false,
					'userLogout' : true,
					'hideMessage':false,
					'message': {
                       	403: i10n.translate('error.account.credentials.invalid')
                    }
				});
			}
		});
	},
	/**
	* Loads users profile and sets it in Account Controller.
	* @param id
	*	Account id.
	*/
	loadProfile: function(id) {
		var me = this;

		EatSense.model.Profile.load(id,{
			success: function(record, operation) {
				me.setProfile(record);
			},
			failure: function(record, operation) {
    	    	me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': false,
					// 'userLogout' : true,
					'hideMessage':false
				});
			}
		});
	},
	/**
	* Show loginview.
	*/
	showLoginView: function(button) {
		var me = this,
			loginView = this.getLoginView(),
			androidCtr = this.getApplication().getController('Android');

		Ext.Viewport.add(loginView);
		loginView.show();
		androidCtr.addBackHandler(function() {
			me.hideLoginView()
		});
	},
	/**
	* Tap event handler for login backbutton.
	*/
	loginViewBackButtonHandler: function(button) {
		this.getApplication().getController('Android').removeLastBackHandler();
		this.hideLoginView();
	},
	/**
	* Hide loginview.
	*/
	hideLoginView: function(button) {
		this.getLoginView().hide();
		//make sure never to store password
		this.getPasswordField().setValue('');	
	},
	/**
	* Tap event handler for signupButton.
	*/
	signupButtonHandler: function() {
		this.showSignupConfimDialog();
	},
	/**
	* Shows a confirm signup dialog. If user confirms a cloobster account will be created.
	* @param fbdata
	*	(optional) indicates if this is a login/signup via facebook. If present will use fb data instead of the email/pw fields.
	*/
	showSignupConfimDialog: function(fbdata) {
		var me = this,
			loginView = this.getLoginView(),
			confirmMessage = (!fbdata) ? i10n.translate('account.signup.confirm.message') : i10n.translate('account.signupfb.confirm.message'),
			about;

	    Ext.Msg.show({
            title:  i10n.translate('account.signup.confirm.title') ,
            message:  confirmMessage,
            buttons: [{
                text: i10n.translate('yes'),
                itemId: 'yes',
                ui: 'action'
            }, {
                text: i10n.translate('no'),
                itemId: 'no',
                ui: 'action'
            },
            {
                text: i10n.translate('terms'),
                itemId: 'terms',
                ui: 'action',
                nohide: true
            }],
            scope: this,
			fn: function(btnId, value, opt) {
				if(btnId=='yes') {
					loginView.setMasked({
                		xtype: 'loadmask',
                		message: i10n.translate('general.processing')
                	});
                	this.signup(callback, fbdata);
                } else if(btnId=='terms') {
                	me.getApplication().getController('Settings').showPrivacy();
                }
            }
        }); 

	    //Called after succesful signup
        function callback(success) {
        	loginView.setMasked(false);

        	if(success) {
        		me.hideDashboardLoginButton();
	        	me.hideLoginView();
	        	me.getApplication().getController('Android').removeLastBackHandler();

	    		Ext.Msg.alert(i10n.translate('account.signup.success.title'),
	    	    	i10n.translate('account.signup.success.message')
	    	  	);
        	}        	
        };
	},
	/**
	* Signup for a cloubster account.
	* @param callback
	*	executed after request completes
	* @param fbdata
	* 	facebook data is set on a signup with facebook, otherwise it is a standard signup
	*/
	signup: function(callback, fbdata) {
		var me = this,
			form = this.getLoginForm(),
			formValues = form.getValues(),
			newAccount = Ext.create('EatSense.model.Account'),
			errMsg = "",
			checkInCtr = this.getApplication().getController('CheckIn'),
			appState = checkInCtr.getAppState(),
			responseError,
			responseErrorKey;

		//Bugfix on some devices textfield overlaps alert window on error message
		this.getPasswordField().blur();

		if(!fbdata) {
			//validate for password length and match regex
			//validate email
			newAccount.setData(formValues);

			//validate record
	        errors = newAccount.validate();

	        if(!errors.isValid()) {
	        	if(errors.getByField('email').length > 0) {
	        		errMsg = i10n.translate('error.account.email');
	        	}
	        	if(errors.getByField('password').length > 0) {
	        		if(errMsg.length > 0) {
	        			errMsg += '<br/>'
	        		};
	        		errMsg += i10n.translate('error.account.password');
	        	}
	        	callback(false);
	            Ext.Msg.alert(i10n.translate('error'), errMsg);
	            return;
	        }

	        if(formValues.password.length < 6) {
	        	callback(false);
	        	Ext.Msg.alert(i10n.translate('error'), i10n.translate('error.account.password'));
	            return;
	        }
		} else {
			console.log('Account.signup > fb user with data id='+fbdata.id+' email='+fbdata.email+' token='+fbdata.access_token);
			newAccount.set('email', fbdata.email);
			newAccount.set('fbUserId', fbdata.id);
			newAccount.set('fbAccessToken', fbdata.accessToken);
		}


        if(appState.get('nickname')) {
        	//save nickname in profile

        	appState.set('nickname', null);
        }

        //if user is already checked in, get the checkInId from appState
        //it is also possible to get the id from checkInController, but to avoid to much inter controller
        //dependencies this approach is used
        if(appState.get('checkInId')) {
        	newAccount.set('checkInId', appState.get('checkInId'));
        }

        //set generated sencha ID to null
        newAccount.id = null;
        newAccount.set('id',null);

        //do a post to create an account
		///POST /c/accounts
        newAccount.save({
        	success: function(record, operation) {
        		//set active Account in Application
        		//store accessToken in AppState
        		checkInCtr.getAppState().set('accessToken', record.get('accessToken'));
        		checkInCtr.getAppState().set('accountId', record.get('id'));
        		//Set default headers so that always credentials are send
				headerUtil.addHeader('X-Auth', record.get('accessToken'));
				//set account to make it accesible for the application
				me.setAccount(record);
				me.loadProfile(me.getAccount().get('profileId'));
				//reset fields
        		form.reset();
        		callback(true);
        	},
        	failure: function(record, operation) {
        		callback(false);
        		//"error.account.password" use correct error message
        		try {
        			responseError = Ext.JSON.decode(operation.error.responseText);
        			responseErrorKey = responseError.errorKey;
        			if(responseErrorKey == "validationError") {
        				responseErrorKey = "error.account.password";
        			};
        		} catch(e) {
        			console.log("Could not parse error response.")
        		};
        		
        		//handleerror
				//400 error.account.email.exists
				me.getApplication().handleServerError({
                    'error': operation.error,
                    'message': {
                        400: i10n.translate(responseErrorKey)
                    }
                }); 
        	}
        });
	},
	/**
	* Tap event handler for loginButton.
	* Calls Account.login()
	*/
	loginButtonHandler: function() {
		this.login();
	},
	/**
	* Tries to login the user.
	* @param fbdata
	* @return
	*	true on success
	*/
	login: function(fbdata, loginCallback) {
		var me = this,
			form = this.getLoginForm(),
			formValues = form.getValues(),
			errMsg = "",
			account,
			checkInCtr = this.getApplication().getController('CheckIn'),
			appState = checkInCtr.getAppState(),
			errorMessage,
			loginView = this.getLoginView(),
			timestamp = new Date().getTime();

		//Bgufix on some devices textfield overlaps alert window on error message
		this.getPasswordField().blur();

		if(headerUtil.getHeaderValue('X-Auth')) {
			//already logged in, skip			
			return;
		};

		Ext.Viewport.setMasked({
	    		xtype: 'loadmask',
	    		message: i10n.translate('general.processing')
	    });

		if(!fbdata) {

			if(!formValues.email || Ext.String.trim(formValues.email).length == 0 || !formValues.password || Ext.String.trim(formValues.password).length == 0) {
				//no credentials provided
				Ext.Msg.alert(i10n.translate('hint'), i10n.translate('error.account.nocredentials'));
				Ext.Viewport.setMasked(false);
				return;
			}			

	    	this.getAccessToken(formValues.email, formValues.password, onSuccess, onFailure);
		} else {

			this.getAccessTokenFb(fbdata.id, fbdata.accessToken, onSuccess, onFailure);
		}
		
		//success handler for ajax request
		function onSuccess(accountData) {
			if(fbdata) {
				console.log('Account.login > success found existing fb user ' + fbdata.id);	
			}
			
	    	Ext.Viewport.setMasked(false);

	    	//parse account, currently we only need the access token
	    	account = Ext.create('EatSense.model.Account', Ext.decode(accountData.responseText));
	    	//set account to make it accesible for the application
	    	me.setAccount(account);
			//Set default headers so that always credentials are send
			headerUtil.addHeader('X-Auth', account.get('accessToken'));

			checkInCtr.getAppState().set('accessToken', account.get('accessToken'));
			checkInCtr.getAppState().set('accountId', account.get('id'));
			
			me.hideDashboardLoginButton();
			me.hideLoginView();
			me.getApplication().getController('Android').removeLastBackHandler();

			me.loadProfile(account.get('profileId'));

			//delete nicknames in localstorage
	        if(appState.get('nickname')) {
    			appState.set('nickname', null);
    		};

    		//reset fields
    		form.reset();

    		if(loginCallback) {
    			loginCallback(true);
    		}
		}

		//error handler for ajax request
		function onFailure(accountData) {
			console.log('Account.login > failure ' + accountData.status);
	    	Ext.Viewport.setMasked(false);

			if(accountData.status) {
				//not authorized
				if(accountData.status == "401" || accountData.status == "403") {
					errorMessage = i10n.translate('general.credentials.invalid');
				} else if (accountData.status == "404") {
					errorMessage = i10n.translate('resourceNotAvailable');
				}
			};

	    	if(!fbdata || (accountData.status != "401" && accountData.status != "403")) {
	    		me.getApplication().handleServerError({
					'error': {
						'status': accountData.status,
						'statusText': accountData.statusText
					}, 
					'forceLogout': false, 
					'hideMessage':false,
					'message': errorMessage || null
				});
	    	}

	    	if(loginCallback) {
    			loginCallback(false);
    		}
		}
	},
	/**
	* Get an access token via POST /c/accounts with credentials to get access token
	* using email and password as credentials.
	*/
	getAccessToken: function(login, password, onSuccess, onFailure) {
		var timestamp = new Date().getTime();

		//for convenience the complete account object is transferred
		Ext.Ajax.request({
    	    url: appConfig.serviceUrl+'/c/accounts/tokens',
    	    method: 'POST',
    	    headers: {
				//provide credentials, they will be added to request header
				'login': login,
				'password': password
			},
			//submit a timestamp to prevent iOS6 from caching the POST request
			jsonData: timestamp,
    	    scope: this,
    	    success: function(response) {
    	    	onSuccess(response);
    	    },
    	    failure: function(response) {
    	    	onFailure(response)
    	    }
    	});
	},
	/**
	* Get an access token via POST /c/accounts with credentials to get access token
	* using facebook user id and access token as credentials.
	*/
	getAccessTokenFb: function(fbUserId, fbAccessToken, onSuccess, onFailure) {
			var timestamp = new Date().getTime();

			//for convenience the complete account object is transferred
			Ext.Ajax.request({
	    	    url: appConfig.serviceUrl+'/c/accounts/tokens',
	    	    method: 'POST',
	    	    headers: {
					//provide credentials, they will be added to request header
					'X-FBUserId': fbUserId,
					'X-FBAccessToken': fbAccessToken			
				},
				//submit a timestamp to prevent iOS6 from caching the POST request
				jsonData: timestamp,
	    	    scope: this,
	    	    success: function(response) {
	    	    	onSuccess(response);
	    	    },
	    	    failure: function(response) {
	    	    	onFailure(response)
	    	    }
	    	});
	},
	/**
	* Shows the settingsview from cloobster dashboard.
	*/
	showSettingsView: function(button) {
		var me = this;

		this.getApplication().getController('Settings').loadSettings(this.getSettingsView().down('#settingCards'));
		this.getMainView().switchTo(this.getSettingsView(), 'left');

		this.getApplication().getController('Android').addBackHandler(function() {
			me.hideSettingsView();
		});
	},
	/**
	* Tap event handler for settings view back button.
	*/
	settingsViewBackButtonHandler: function(button) {
		this.getApplication().getController('Android').removeLastBackHandler();
		this.hideSettingsView();
	},
	/**
	* Hide settingsview.
	*/
	hideSettingsView: function(button) {
		this.getMainView().switchTo(0, 'right');
	},
	/**
	* Tap event for logout button in dashboard settingsview.
	*/
	logoutDashboardButtonHandler:  function(button) {
		this.confirmUserLogout();
	},
	/**
	* Let user confirm has wish to logout. 
	*/
	confirmUserLogout: function() {
		Ext.Msg.show({
            title: i10n.translate('account.logout.confirm.title'),
            message: i10n.translate('account.logout.confirm.message'),
            buttons: [{
                text: i10n.translate('yes'),
                itemId: 'yes',
                ui: 'action'
            }, {
                text: i10n.translate('no'),
                itemId: 'no',
                ui: 'action'
            }],
            scope: this,
            fn: function(btnId, value, opt) {
                if(btnId=='yes') {
                	this.logout();
                	this.hideSettingsView();
                }
            }
        }); 
	},
	/**
	* Tap event handler for requestPwButton.
	*/
	requestPwButtonHandler: function() {
		this.requestNewPassword();
	},
	/**
	* Shows a prompt dialog and asks for users email.
	* Send a reset link to user.
	*/
	requestNewPassword: function() {
		var me = this;

		Ext.Msg.show({
            title: i10n.translate('login.button.pwforgot'),
            message: i10n.translate('account.passwordrequest.message'),
            prompt: true,
            buttons: [{
                text: i10n.translate('yes'),
                itemId: 'yes',
                ui: 'action'
            }, {
                text: i10n.translate('no'),
                itemId: 'no',
                ui: 'action'
            }],
            scope: this,
            fn: function(btnId, value, opt) {
                if(btnId=='yes') {
                	Ext.Ajax.request({
                		url: appConfig.serviceUrl+'/accounts/password-reset',
                		method: 'POST',
                		jsonData: { 'email' : value },
                		success: function(response) {
                			Ext.Msg.alert(i10n.translate('success'), i10n.translate('account.passwordrequest.success'));
                		},
                		failure: function(response) {
                			me.getApplication().handleServerError({
                				'error': {
									'status': response.status,
									'statusText': response.statusText
								},
								message: {
									400: i10n.translate('account.passwordrequest.notexisting')
								}
                			});
                		}                		
                	});
                	// me.hideLoginView();
                }               
            }
        });        
	},
	/**
	* Do a logout.
	*/
	logout: function() {
		var checkInCtr = this.getApplication().getController('CheckIn');

		headerUtil.resetHeaders(['X-Auth']);
		checkInCtr.getAppState().set('accessToken', null);
		checkInCtr.getAppState().set('accountId', null);

		//do facebook logout if it is a facebook user
		if(this.getAccount() && this.getAccount().get('fbUserId')) {
			this.getApplication().getController('Facebook').fbLogout();
		}

		this.setAccount(null);
		this.showDashboardLoginButton();
	},
	/**
	@USELESS? ;) 
	* @private
	* Updates logged in account with given checkinid
	* @param {String} checkInId
	*	Id to update account with
	*/
	updateAccountWithCheckIn: function(checkInId) {
		var account;

		if(!this.isLoggedIn()) {
			console.error('Account.updateAccountWithCheckIn: not logged in');
			return;
		}

		if(!this.getAccount()) {
			console.error('Account.updateAccountWithCheckIn: no account');
			return;
		}

		account = this.getAccount();

		account.set('checkInId', checkInId);
		account.save();
	},
	/**
	* Indicates if user is logged in. User is considered to be logged in
	* when an X-Auth is set.
	* @return
	*	true if logged in
	*/
	isLoggedIn: function() {
		return headerUtil.getHeaderValue('X-Auth') != null;
	},

	//ui actions start
	hideDashboardLoginButton: function() {
		this.getShowLoginButtonDashboard().disable();
		this.getShowLoginButtonDashboard().hide();
		this.getShowSettingsButtonDashboard().enable();
		this.getShowSettingsButtonDashboard().show();	
	},
	showDashboardLoginButton: function() {
		this.getShowLoginButtonDashboard().enable();
		this.getShowLoginButtonDashboard().show();	
		this.getShowSettingsButtonDashboard().disable();
		this.getShowSettingsButtonDashboard().hide();	
	}
	//ui actions end
});