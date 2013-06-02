/**
* Controller handles login, signup, facebook connect.
* Updates of account settings currently handled by Settings Controller.
*/
Ext.define('EatSense.controller.Account', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.Login', 'EatSense.model.Account'],

	 /**
     * @event userloginprovider
     * Fires when user tries to login via an external provider (facebook, google).
     * @param {String} provider
     *	External provider e.g. facebook
     * @param {Function} callback
     *	Callback fn getting passed the response
     */

    /**
     * @event userlogin
     * Event fired on Ext.Viewport when user successfully logged in.
     * @param {EatSense.model.Account} account
     *	User account object
     */

     /**
     * @event accountrequired
     * Event fired on Ext.Viewport for actions that require an account.
     * Prompts for login if user is not logged in.
     * @param {Function} callback
     * 	Gets passed success (true|false) and account object.
     *
     */

	config: {
		refs: {
			mainView: 'lounge',
			loginView : {
				selector: 'login',
				xtype: 'login',
				autoCreate: true
			},	
			showLoginBt : 'button[action=show-login]',
			logoutDashboardButton: 'settings button[action=logout]'
		},
		control: {
			showLoginBt : {
				tap: 'showLoginBtHandler'
			},
			logoutDashboardButton : {
				tap: 'logoutDashboardButtonHandler'
			}
		},
		//user account if logged in
		account: null,
		//users profile if logged in
		profile: null
	},
	/**
	* Initialization.
	*/
	init: function() {
		//occurs when a user has an invalid login
		this.getApplication().on('userLogout', this.logout, this);
	},
	/**
	* Initialization.
	*/
	launch: function() {

		Ext.Viewport.on({
			'accountrequired' : this.promptForLogin,
			scope: this
		});
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
        	// this.hideDashboardLoginButton();
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

				Ext.Viewport.fireEvent('userlogin', record);
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
	* Tap event handler for show login button.
	* Calls showLoginView
	* @param {Ext.Button} button 
	*/
	showLoginBtHandler: function(button) {
		this.showLoginView(function(success, account) {
			if(success) {
				Ext.Viewport.fireEvent('showdashboard');
			}
		});
	},
	/**
	* Tap event handler for show login button.
	* Show loginview and wires up all events dynamically.
	* @param {Function} callback
    * 	Gets passed success (true|false) and account object.
	*/
	showLoginView: function(callback) {
		var me = this,
			//gets auto created
			loginView = this.getLoginView(),
			backButton,
			signupButton,
			loginButton,
			requestPwButton,
			fbSignupButton,
			androidCtr = this.getApplication().getController('Android');
		
		backButton = loginView.down('backbutton');
		signupButton = loginView.down('button[action=signup]');
		loginButton = loginView.down('button[action=login]');
		requestPwButton = loginView.down('button[action=request-password]');
		fbSignupButton = loginView.down('button[action=signup-fb]');
		passwordfield = loginView.down('passwordfield');

		//wire up events
		backButton.on({
			tap: closeLogin,
			single: true
		});

		signupButton.on({
			tap: signupButtonHandler
		});

		loginButton.on({
			tap: loginButtonHandler
		});

		requestPwButton.on({
			tap: requestPwButtonHandler
		});

		fbSignupButton.on({
			tap: fbSignupButtonHandler
		});

		androidCtr.addBackFn(closeLogin);

		//handle successful login
		// me.on('userlogin', userLoggedIn, this);
		Ext.Viewport.on({
			'userlogin' : userLoggedIn,
			scope: this,
			single: true
		});


		//handler functions
		function signupButtonHandler() {
			me.showSignupConfirmDialog(loginView, signupCallback);
		}

		function loginButtonHandler() {
			me.login(loginView);
		}

		function requestPwButtonHandler() {
			me.requestNewPassword();
		}
		//signup with facebook
		function fbSignupButtonHandler() {			
			me.fireEvent('userloginprovider', 'facebook', fbLoginCallback);
		}

		function fbLoginCallback(fbData) {
			me.login(loginView, fbData, function(success) {
				if(!success){
					//no fb account exists so signup via fb
					me.showSignupConfirmDialog(loginView, signupCallback, fbData);
				}
			});
		}

		function signupCallback(success) {
        	if(success) {

	    		Ext.Msg.alert(i10n.translate('account.signup.success.title'),
	    	    	i10n.translate('account.signup.success.message')
	    	  	);
        	} 
		}

		function userLoggedIn() {
			appHelper.toggleMask(false);
			closeLogin();		
		}

		//remove all events
		function cleanup() {
			Ext.Viewport.un('userlogin', userLoggedIn, me);

			backButton.un({
				tap: closeLogin
			});

			signupButton.un({
				tap: signupButtonHandler
			});

			loginButton.un({
				tap: loginButtonHandler
			});

			requestPwButton.un({
				tap: requestPwButtonHandler
			});

			fbSignupButton.un({
				tap: fbSignupButtonHandler
			});

			androidCtr.removeBackFn();			
		}

		//close login view and reset password field
		function closeLogin() {
			//just in case I forgot to remove the mask somewhere else
			appHelper.toggleMask(false);
			cleanup();
			loginView.hide();
			//make sure never to store password
			passwordfield.setValue('');
			if(appHelper.isFunction(callback)) {
				if(me.isLoggedIn()) {
					callback(true, me.getAccount());
				} else {
					callback(false);
				}
			}
		}

		Ext.Viewport.add(loginView);
		loginView.show();
	},
	/**
	* Shows a confirm signup dialog. If user confirms a cloobster account will be created.
	* @param {EatSense.view.Login} view
	*	The loginview containing the loginform.
	* @param {Function} callback
	*	executed after request completes, called with true|false depending on success (gets passed through to Account.signup)
	* @param fbdata
	*	(optional) indicates if this is a login/signup via facebook. If present will use fb data instead of the email/pw fields.
	*/
	showSignupConfirmDialog: function(view, callback, fbdata) {
		var me = this,
			loginView = view,
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
                	this.signup(view, callback, fbdata);
                } else if(btnId=='terms') {
                	me.getApplication().getController('Settings').showPrivacy();
                }
            }
        }); 
	},
	/**
	* Signup for a cloubster account.
	* @param {EatSense.view.Login} view
	*	The loginview containing the loginform.
	* @param {Function} callback
	*	executed after request completes, called with true|false depending on success
	* @param fbdata
	* 	facebook data is set on a signup with facebook, otherwise it is a standard signup
	*/
	signup: function(view, callback, fbdata) {
		var me = this,
			form,
			formValues,
			passwordfield,
			newAccount = Ext.create('EatSense.model.Account'),
			errMsg = "",
			checkInCtr = this.getApplication().getController('CheckIn'),
			appState = checkInCtr.getAppState(),
			responseError,
			responseErrorKey;

		if(!view) {
			console.error('Login.signup: no view given');
			return;
		}

		appHelper.toggleMask('general.processing');	

		form = view.down('formpanel');
		formValues = form.getValues();
		passwordfield = view.down('passwordfield');

		//Bugfix on some devices textfield overlaps alert window on error message
		passwordfield.blur();

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
	        	appHelper.toggleMask(false);
	        	callback(false);
	            Ext.Msg.alert(i10n.translate('error'), errMsg);
	            return;
	        }

	        if(formValues.password.length < 6) {
	        	appHelper.toggleMask(false);
	        	callback(false);
	        	Ext.Msg.alert(i10n.translate('error'), i10n.translate('error.account.password'));
	            return;
	        }
		} else {
			// console.log('Account.signup > fb user with data id='+fbdata.id+' email='+fbdata.email+' token='+fbdata.access_token);
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
        		appHelper.toggleMask(false);
        		callback(true);
        		Ext.Viewport.fireEvent('userlogin', record);
        	},
        	failure: function(record, operation) {
        		appHelper.toggleMask(false);
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
	* Tries to login the user.
	* @param {EatSense.view.Login} view
	*	The loginview containing the loginform.
	* @param fbdata
	* @param {Function} loginCallback (optional)
	*	called after login finished. Get passed true/false depending on success
	*	Especially useful for external providers when trying to login with an connected account.
	*/
	login: function(view, fbdata, loginCallback) {
		var me = this,
			form,
			formValues,
			errMsg = "",
			account,
			checkInCtr = this.getApplication().getController('CheckIn'),
			appState = checkInCtr.getAppState(),
			errorMessage,
			loginView = this.getLoginView(),
			timestamp = new Date().getTime();

		if(!view) {
			console.error('Login.signup: no view given');
			return;
		}

		form = view.down('formpanel');
		formValues = form.getValues();

		passwordfield = view.down('passwordfield');
		//Bgufix on some devices textfield overlaps alert window on error message
		passwordfield.blur();


		if(headerUtil.getHeaderValue('X-Auth')) {
			//already logged in, skip			
			return;
		};

		appHelper.toggleMask('general.processing', view);

		if(!fbdata) {
			if(!formValues.email || Ext.String.trim(formValues.email).length == 0 || !formValues.password || Ext.String.trim(formValues.password).length == 0) {
				//no credentials provided
				Ext.Msg.alert(i10n.translate('hint'), i10n.translate('error.account.nocredentials'));
				appHelper.toggleMask(false, view);
				return;
			}			
	    	this.getAccessToken(formValues.email, formValues.password, onSuccess, onFailure);
		} else {
			this.getAccessTokenFb(fbdata.id, fbdata.accessToken, onSuccess, onFailure);
		}
		
		//success handler for ajax request
		function onSuccess(accountData) {
			if(fbdata) {
				console.log('Account.login: success found existing fb user ' + fbdata.id);	
			}
			
			appHelper.toggleMask(false, view);

	    	//parse account, currently we only need the access token
	    	account = Ext.create('EatSense.model.Account', Ext.decode(accountData.responseText));
	    	//set account to make it accesible for the application
	    	me.setAccount(account);
			//Set default headers so that always credentials are send
			headerUtil.addHeader('X-Auth', account.get('accessToken'));
			//TODO checkInCtr should take data from fired userlogin event
			checkInCtr.getAppState().set('accessToken', account.get('accessToken'));
			checkInCtr.getAppState().set('accountId', account.get('id'));


			me.loadProfile(account.get('profileId'));

			//delete nicknames in localstorage
	        if(appState.get('nickname')) {
    			appState.set('nickname', null);
    		};

    		//reset fields
    		form.reset();

    		Ext.Viewport.fireEvent('userlogin', account);

    		if(loginCallback) {
    			loginCallback(true);
    		}
		}

		//error handler for ajax request
		function onFailure(accountData) {
			console.log('Account.login: failure ' + accountData.status);
			var error;
			appHelper.toggleMask(false, view);

	    	//TODO 20130218 this is dirty lirty aber wat solls. REFACTORING
	    	try {
	    		//an errorkey exsists when account is inactive
	    		error = Ext.JSON.decode(accountData.responseText);	
	    	} catch(e) {
	    		if(accountData.status) {
					//not authorized
					if(accountData.status == "401" || accountData.status == "403") {
						errorMessage = i10n.translate('general.credentials.invalid');
					} else if (accountData.status == "404") {
						errorMessage = i10n.translate('resourceNotAvailable');
					}
				};
	    	}
	    	//if this is a facebook login and no permission denied is thrown
	    	// don't show an error message. since no account exists
	    	if(!fbdata || (accountData.status != "401" && accountData.status != "403")) {
	    		me.getApplication().handleServerError({
					'error': {
						'status': accountData.status,
						'responseText': accountData.responseText
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
	* @param {String} login
	*	username
	* @param {String} password
	* @param {Function} onSuccess
	*	success callback, gets passed response
	* @param {Function} onFailure
	*	failure callback, gets passed response
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
	* @param {String} fbUserId
	*	facebook user id
	* @param {String} fbAccessToken
	*	Access Token used by facebook
	* @param {Function} onSuccess
	*	success callback, gets passed response
	* @param {Function} onFailure
	*	failure callback, gets passed response
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
	* Tap event for logout button in dashboard settingsview.
	*/
	logoutDashboardButtonHandler:  function(button) {
		this.confirmUserLogout();
	},
	/**
	* Let user confirm his wish to logout. 
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
                	Ext.Viewport.fireEvent('showdashboard');
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
                				'error': response,
								message: {
									400: i10n.translate('account.passwordrequest.notexisting')
								}
                			});
                		}                		
                	});
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
		checkInCtr.getAppState().set('nickname', null);

		//do facebook logout if it is a facebook user
		if(this.getAccount() && this.getAccount().get('fbUserId')) {
			this.getApplication().getController('Facebook').fbLogout();
		}

		this.setAccount(null);
		this.setProfile(null);

		Ext.Viewport.fireEvent('userlogout');
	},
	/**
	* Show a login prompt.
	* @param {Function} callback
	*  gets passed success (true|false) and account when successful
	*/
	promptForLogin: function(callback) {
		if(!callback) {
			console.log('Account.promptForLogin: in general this fn should be called with a callback');
		}

		if(!this.isLoggedIn()) {
			

			Ext.Msg.on({
				'show' : function() {
					//remove default msg box backhandler
					Ext.Viewport.fireEvent('removebackhandler');
					Ext.Viewport.fireEvent('addbackhandler', backButtonCanel);
				},
				scope: this
			});


			Ext.Msg.show({
	            message: i10n.translate('account.required'),
	            buttons: [{
	               text: i10n.translate('account.register.yes'),
	               itemId: 'yes',
	               ui: 'action'
	            }, {
	               text:  i10n.translate('account.register.no'),
	               itemId: 'no',
	               ui: 'action'
	            }],
	            scope: this,
	            fn: function(btnId, value, opt) {
	            	Ext.Viewport.fireEvent('removebackhandler', backButtonCanel);

	            	if(btnId=='yes') {
	            	  //null is the button
	                  this.showLoginView(callback);
	                } else {
	                	if(appHelper.isFunction(callback)) {
	                		callback(false);
	                	}
	                	
	                }
	            }
        	 }); 
		} else {
			if(appHelper.isFunction(callback)) {
				callback(true, this.getAccount());
			}			
		}

		function backButtonCanel() {
			// console.log('Account.promptForLogin: backButtonCanel');
			Ext.Msg.hide();	
			callback(false);
		}
	},
	/**
	* Indicates if user is logged in. User is considered to be logged in
	* when an X-Auth is set.
	* @return
	*	true if logged in
	*/
	isLoggedIn: function() {
		return headerUtil.getHeaderValue('X-Auth') != null;
	}
});