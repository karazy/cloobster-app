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
			showLoginButtonDashboard : 'dashboard button[action=login]',
			showLogoutButtonDashboard : 'dashboard button[action=logout]',
			backButton : 'login button[action=back]',
			signupButton : 'login button[action=signup]',
			loginButton : 'login button[action=login]',
			loginForm : 'login formpanel'
		},
		control: {
			showLoginButtonDashboard : {
				tap: 'showLoginView'
			},
			showLogoutButtonDashboard : {
				tap: 'confirmUserLogout'
			},
			backButton : {
				tap: 'hideLoginView'
			},
			signupButton : {
				tap: 'showSignupConfimDialog'
			},
			loginButton : {
				tap: 'login'
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
				me.setAccount(record);
				me.loadProfile(record.get('profileId'));
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

	showLoginView: function(button) {
		var loginView = this.getLoginView();

		// mainView.switchAnim('left');
		// mainView.setActiveItem(loginView);	
		Ext.Viewport.add(loginView);
		loginView.show();
	},

	hideLoginView: function(button) {		
		// mainView.switchAnim('right');
		// mainView.setActiveItem(0);

		// Ext.Viewport.remove(this.getLoginView());

		this.getLoginView().hide();
	},

	showSignupConfimDialog: function(button) {
		var me = this;

	    Ext.Msg.show({
            title: i10n.translate('account.signup.confirm.title'),
            message: i10n.translate('account.signup.confirm.message'),
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
                	this.signup(callback);
                }
            }
        }); 

	    //Called after succesful signup
        function callback() {
        	me.hideDashboardLoginButton();
        	me.hideLoginView();

    		Ext.Msg.alert(i10n.translate('account.signup.success.title'),
    	    	i10n.translate('account.signup.success.message')
    	  	);
        };
	},

	signup: function(callback) {
		var me = this,
			form = this.getLoginForm(),
			formValues = form.getValues(),
			newAccount = Ext.create('EatSense.model.Account'),
			errMsg = "",
			checkInCtr = this.getApplication().getController('CheckIn'),
			appState = checkInCtr.getAppState(),
			responseError,
			responseErrorKey;

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
            Ext.Msg.alert(i10n.translate('error'), errMsg);
            return;
        };

        if(appState.get('nickname')) {
        	//save nickname in profile

        	appState.set('nickname', null);
        };

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
        		callback();
        	},
        	failure: function(record, operation) {
        		try {
        			responseError = Ext.JSON.decode(operation.error.responseText);
        			responseErrorKey = responseError.errorKey;
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

	login: function(button) {
		var me = this,
			form = this.getLoginForm(),
			formValues = form.getValues(),
			errMsg = "",
			account,
			checkInCtr = this.getApplication().getController('CheckIn'),
			appState = checkInCtr.getAppState(),
			errorMessage;

		if(headerUtil.getHeaderValue('X-Auth')) {
			//already logged in, skip
			return;
		};

		//POST /c/accounts with credentials to get access token
		//for ceonvenience the complete account object is transferred
		Ext.Ajax.request({
    	    url: appConfig.serviceUrl+'/c/accounts/tokens',
    	    method: 'POST',
    	    headers: {
				//provide credentials, they will be added to request header
				'login': formValues.email,
				'password': formValues.password
			},
    	    scope: this,
    	    success: function(response) {
    	    	//parse account, currently we only need the access token
    	    	account = Ext.create('EatSense.model.Account', Ext.decode(response.responseText));
    	    	me.setAccount(account);
				//Set default headers so that always credentials are send
				headerUtil.addHeader('X-Auth', account.get('accessToken'));

				checkInCtr.getAppState().set('accessToken', account.get('accessToken'));
				checkInCtr.getAppState().set('accountId', account.get('id'));
				
				me.hideDashboardLoginButton();
				me.hideLoginView();

				me.loadProfile(account.get('profileId'));

				//delete nicknames in localstorage
		        if(appState.get('nickname')) {
        			appState.set('nickname', null);
        		};
    	    },
    	    failure: function(response) {

				if(response.status) {
					//not authorized
					if(response.status == "401" || response.status == "403") {
						errorMessage = i10n.translate('general.credentials.invalid');
					} else if (response.status == "404") {
						errorMessage = i10n.translate('resourceNotAvailable');
					}
				};

				(!errorMessage || errorMessage == "") ?	errorMessage = i10n.translate('general.credentials.invalid') : errorMessage;

    	    	me.getApplication().handleServerError({
						'error': {
							'status': response.status,
							'statusText': response.statusText
						}, 
						'forceLogout': false, 
						'hideMessage':false,
						'message': errorMessage
				});
	   	    }
		});
	},

	confirmUserLogout: function(button) {
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
                }
            }
        }); 
	},

	logout: function() {
		var checkInCtr = this.getApplication().getController('CheckIn');

		headerUtil.resetHeaders(['X-Auth']);
		checkInCtr.getAppState().set('accessToken', null);
		checkInCtr.getAppState().set('accountId', null);
		this.setAccount(null);
		this.showDashboardLoginButton();
	},

	isLoggedIn: function() {
		return headerUtil.getHeaderValue('X-Auth') != null;
	},

	//ui actions start
	hideDashboardLoginButton: function() {
		this.getShowLoginButtonDashboard().disable();
		this.getShowLoginButtonDashboard().hide();
		this.getShowLogoutButtonDashboard().enable();
		this.getShowLogoutButtonDashboard().show();	
	},
	showDashboardLoginButton: function() {
		this.getShowLoginButtonDashboard().enable();
		this.getShowLoginButtonDashboard().show();	
		this.getShowLogoutButtonDashboard().disable();
		this.getShowLogoutButtonDashboard().hide();	
	}
	//ui actions end
});