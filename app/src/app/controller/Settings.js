/**
*	Handles save and restore of application settings.
*   Register for newsletter.
*/
Ext.define('EatSense.controller.Settings', {
    extend: 'Ext.app.Controller',
    requires: ['EatSense.view.NewsletterPopup', 'EatSense.view.Newsletter'],
    config: {
    	refs: {
            //settings accessed from lounge when checked-in
    		settingsTab: 'lounge settingstab',
            //settings accessed from mainview
            settingsView: 'mainview settingsview',
            // settingsNavView: 'settingstab navigationview',
    		nicknameField: 'settings #nickname',
            // newsletterView: 'settings newsletter',
            // registerNewsletterBt: 'settings newsletter button[action=register]',
            aboutBt: 'settings button[action=about]',
            //account related stuff
            accountPanel: 'settings #accountPanel',
            //event handler for settings called from dashboard settingsview
            emailChangeDashboardBt: 'settingsview settings button[action=email-change]',
            emailBackDashboardBt: 'settingsview emailsetting button[action=back]',
            passwordChangeDashboardBt: 'settingsview settings button[action=password-change]',
            passwordBackDashboardBt: 'settingsview passwordsetting button[action=back]',
            //event handler for settings called from lounge tabbar
            emailChangeClubBt: 'lounge settings button[action=email-change]',
            emailBackClubBt: 'lounge emailsetting button[action=back]',
            passwordChangeClubBt: 'lounge settings button[action=password-change]',
            passwordBackClubBt: 'lounge passwordsetting button[action=back]',            

            emailLabel: 'settings #accountEmail',
            saveEmailBt: 'emailsetting button[action=save]',
            savePasswordBt: 'passwordsetting button[action=save]',
            aboutCloseBt: 'about button[action=close]',
            privacyCloseBt: 'privacy button[action=close]'
    	},

    	control: {
    		settingsTab : {
    			activate: 'settingsTabActivated'
    		},
    		nicknameField : {
    			change: 'saveNickname'
    		},
            registerNewsletterBt: {
                tap: 'registerNewsletterBtTap'
            },
            aboutBt: {
                tap: 'showAbout'
            },
            emailChangeDashboardBt: {
                tap: 'showEmailChangeView'
            },
            emailBackDashboardBt: {
                tap: 'backButtonHandler'
            },
            passwordChangeDashboardBt: {
                tap: 'showPasswordChangeView'
            },
            passwordBackDashboardBt: {
                tap: 'backButtonHandler'
            },
            emailChangeClubBt: {
                tap: 'showEmailChangeView'
            },
            emailBackClubBt: {
                tap: 'backButtonHandler'
            },
            passwordChangeClubBt: {
                tap: 'showPasswordChangeView'
            },
            passwordBackClubBt: {
                tap: 'backButtonHandler'
            },
            saveEmailBt: {
                tap: 'saveEmail'
            },
            savePasswordBt: {
                tap: 'savePassword'
            },
            settingsNavView: {
                back: 'navBackButtonTap'
            },
            aboutCloseBt: {
                tap: 'aboutCloseBtHandler'
            },
            privacyCloseBt: {
                tap: 'privacyCloseBtHandler'
            }
    	},
        //android back handler
        settingsNavigationFunctions : new Array(),
        //used for back button logic, dynamically wiring button tap events ...
        callingView : null
    },
    /**
    * Activate event handler for settingstab.
    */
    settingsTabActivated: function(tab, options) {
        var androidCtr = this.getApplication().getController('Android');
                
        this.loadSettings(tab.down('#settingCards'));

        androidCtr.setExitOnBack(false);    
        androidCtr.setAndroidBackHandler(this.getSettingsNavigationFunctions());
    },
    /**
    *	Loads the settings and sets the corresponding fields.
    * @param view
    *       a card panel with the settings, emailsetting and passwordsetting xtypes
    */
    loadSettings: function(view) {
    	var checkInCtr = this.getApplication().getController('CheckIn'),
    		appState = checkInCtr.getAppState(),
            accountCtr = this.getApplication().getController('Account'),
            account = this.getApplication().getController('Account').getAccount(),
            profile = this.getApplication().getController('Account').getProfile(),
            callingView = null,
            nicknameField = null,
            emailChangeBt = null,
            emailLabel = null,
            fbConnectedLabel = null,
            accountPanel = null; 

        if(!view) {
            console.log('Settings.loadSettings > Abort! no view given');
            return;
        }

        if(!view.down('settings')) {
            console.log('Settings.loadSettings > Abort! calling view has no settings panel');
            return;
        }

        this.setCallingView(view);
        callingView = this.getCallingView();

        nicknameField = callingView.down('settings #nickname');
        emailLabel = callingView.down('settings #accountEmail');
        accountPanel = callingView.down('settings #accountPanel');
        connectWithFbButton = callingView.down('settings button[action=connect-fb]');        
        fbConnectedLabel = callingView.down('settings #accountFbStatus');


        if(accountCtr.isLoggedIn()) {
            accountPanel.setHidden(false);
            //TODO check if account is loaded correctly!
            if(account) {
                emailLabel.setHidden(false);
                emailLabel.getTpl().overwrite(emailLabel.element, account.getData());
                if(account.get('fbUserId')) {
                    this.toggleEmailAndPwButtons(false);
                    connectWithFbButton.disable();
                    connectWithFbButton.hide();
                    fbConnectedLabel.show();
                } else {
                    this.toggleEmailAndPwButtons(true);
                    fbConnectedLabel.hide();
                }
            }

            if(profile) {
                nicknameField.setValue(profile.get('nickname'));    
            }
        } else {
            nicknameField.setValue(appState.get('nickname'));
            //hide account settings
            //TODO show signup button
            accountPanel.setHidden(true);
            emailLabel.setHidden(true);
        }
        
    },

    /**
	 * Saves the nickname. If user has an account save Nickname in Datastore.
     * Otherwise in localstorage.
	 */
	saveNickname: function(component, newData, oldValue, eOpts) {
    	var checkInCtr = this.getApplication().getController('CheckIn'),
            accountCtr = this.getApplication().getController('Account'),
    		appState = checkInCtr.getAppState();

        if(accountCtr.isLoggedIn()) {

            if(accountCtr.getProfile()) {
                accountCtr.getProfile().set('nickname', newData);            
                accountCtr.getProfile().save({

                    failure: function(record, operation) {
                        me.getApplication().handleServerError({
                            'error': operation.error, 
                            'forceLogout': false,
                            'userLogout' : false,
                            'message' : {403: i10n.translate('general.credentials.invalid')}
                        });     
                    }
                });
                appState.set('nickname', null);
            } else {
                console.log('Settings.saveNickname > no profile found!');
            }
            
        } else {
            appState.set('nickname', newData);
        }		
	},
    /**
    * @deprecated
    *   Tap handler for register newsletter button.
    */
    registerNewsletterBtTap: function(button) {
        var me = this,
            newsletter = this.getNewsletterView(),
            values = newsletter.getValues();

        //force keyboard to hide, due to a bug in Android 4.0 the textfield is visible above the popup
        newsletter.down('emailfield').blur();

        this.registerNewsletter(values);
    },
    /**
    * @deprecated
    * Submits the form to register a new newsletter.
    * @param record
    *   newsletter data to submit
    * @param successCallback
    *   callback function called on success
    */
    registerNewsletter: function(data, successCallback) {
        var me = this,
            checkInCtr = this.getApplication().getController('CheckIn'),
            appState = checkInCtr.getAppState(),
            record = Ext.create('EatSense.model.Newsletter'),
            errors;

        record.setData(data);
        //validate record
        errors = record.validate();

        if(!errors.isValid()) {
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('newsletterInvalidEmail'));
            return;
        }

        record.save({
            success: function(record, operation) {
                //ensure PUT is always used when saving the mail
                record.phantom = true;

                appState.set('newsletterRegistered', true);
                
                if(appHelper.isFunction(successCallback)) {
                    successCallback();    
                }
                
                //show short success message
                Ext.Msg.show({
                    title : i10n.translate('hint'),
                    'message' : i10n.translate('newsletterRegisterSuccess', record.get('email')),
                    buttons : []
                });
                //show short alert and then hide
                Ext.defer((function() {
                    if(!appHelper.getAlertActive()) {
                        Ext.Msg.hide();
                    }                   
                }), appConfig.msgboxHideTimeout, this);
            },
            failure: function(record, operation) {
                me.getApplication().handleServerError({
                    'error': operation.error, 
                    'forceLogout': false,
                    'message' : {500: i10n.translate('newsletterDuplicateEmail')}
                }); 
            }
        });
    },

    /**
    * Shows an about screen.
    */
    showAbout: function() {
        var about = Ext.create('EatSense.view.About', {
                    zIndex: 100
                });
                    
        this.getApplication().getController('Android').addBackHandler(function() {
            Ext.Viewport.remove(about);
        });

        Ext.Viewport.add(about);
    },
    /**
    * Tap event handler for close button in about panel.
    */
    aboutCloseBtHandler: function(button) {
        Ext.Viewport.remove(button.getParent());
        this.getApplication().getController('Android').removeLastBackHandler();
    },
    /**
    * Shows a privacy screen.
    */
    showPrivacy: function() {
        var privacy = Ext.create('EatSense.view.Privacy', {
                    zIndex: 110
                });
                    
        this.getApplication().getController('Android').addBackHandler(function() {
            Ext.Viewport.remove(privacy);
        });

        Ext.Viewport.add(privacy);
    },    
    /**
    * Tap event handler for close button in privacy panel.
    */
    privacyCloseBtHandler: function(button) {
        Ext.Viewport.remove(button.getParent());
        this.getApplication().getController('Android').removeLastBackHandler();
    },

    //Account actions start

    /**
    * Show change email dialog.
    * 
    */
    showEmailChangeView: function() {
        var me = this,
            emailView = this.getCallingView().down('emailsetting');

        console.log('Settings.showEmailChangeView');
        this.getCallingView().setActiveItem(emailView);

        this.getApplication().getController('Android').addBackHandler(function() {
            me.backToSettings();
        });
    },
    /**
    * Save new email adress.
    *
    */
    saveEmail: function() {
        var me = this,
            callingView = this.getCallingView(),
            emailChangeView = callingView.down('emailsetting'),
            form = emailChangeView.down('formpanel'),
            // navView = this.getSettingsNavView(),
            newMail = emailChangeView.down('#newMail'),
            repeatMail = emailChangeView.down('#repeatMail'),
            password = emailChangeView.down('passwordfield'),
            account = this.getApplication().getController('Account').getAccount(),
            errors,
            errMsg,
            oldMail = account.get('email'),
            xauth = headerUtil.getHeaderValue('X-Auth'),
            checkInId = headerUtil.getHeaderValue('checkInId');

        if(!newMail.getValue()) {
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('emailsetting.error.noemail'));
            return;
        };

        if(!repeatMail.getValue() || newMail.getValue() != repeatMail.getValue()) {
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('emailsetting.error.emailmatch'));
            return;  
        };

        account.set('email', newMail.getValue());

        //validate record
        errors = account.validate();

        if(!errors.isValid()) {
            if(errors.getByField('email').length > 0) {
                //restore old mail
                account.set('email', oldMail);
                errMsg = i10n.translate('emailsetting.error.invalidmail');
                Ext.Msg.alert(i10n.translate('error'), errMsg);
                return;
            }
        };

        if(!password.getValue()) {
            //restore old mail
            account.set('email', oldMail);
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('emailsetting.error.nopassword'));
            return;
        };

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: i10n.translate('general.processing')
        });

        headerUtil.resetHeaders(['X-Auth', 'checkInId']);
        headerUtil.addHeaders({
            'login': oldMail,
            'password' : password.getValue()
        });


        account.save({
            success: function(record, operation) {
                headerUtil.addHeaders({
                    'X-Auth': xauth,
                    'checkInId' : checkInId
                });

                headerUtil.resetHeaders(['login', 'password']);
                Ext.Viewport.setMasked(false);
                me.loadSettings(callingView);

                //switch back to settings
                me.backToSettings();
                me.getApplication().getController('Android').removeLastBackHandler();
                //clear form values
                form.reset();

                //show success message
                Ext.Msg.show({
                    title : i10n.translate('success'),
                    message : i10n.translate('emailsetting.success'),
                    buttons : []
                });
                
                Ext.defer((function() {
                    if(!appHelper.getAlertActive()) {
                        Ext.Msg.hide();
                    }
                }), appConfig.msgboxHideLongTimeout, this);
            },
            failure: function(record, operation) {
                headerUtil.addHeaders({
                    'X-Auth': xauth,
                    'checkInId' : checkInId
                });
                //restore old mail
                account.set('email', oldMail);
                headerUtil.resetHeaders(['login', 'password']);

                Ext.Viewport.setMasked(false);
                me.getApplication().handleServerError({
                    'error': operation.error, 
                    'forceLogout': false,
                    'message' : {403: i10n.translate('general.credentials.invalid')}
                }); 
            }
        });
    },

    /**
    * Change user password.
    */
    showPasswordChangeView: function() {
        var me = this,
            passwordView = this.getCallingView().down('passwordsetting');

        this.getCallingView().setActiveItem(passwordView);

        this.getApplication().getController('Android').addBackHandler(function() {
            me.backToSettings();
        });
    },

    savePassword: function() {
        var me = this,
            callingView = this.getCallingView(),
            passwordChangeView = callingView.down('passwordsetting'),
            form = passwordChangeView.down('formpanel'),
            // navView = this.getSettingsNavView(),
            newPassword = passwordChangeView.down('#newPassword'),
            repeatPassword = passwordChangeView.down('#repeatPassword'),
            password = passwordChangeView.down('#oldPassword'),
            account = this.getApplication().getController('Account').getAccount(),
            errors,
            errMsg,
            responseError,
            responseErrorKey,
            email = account.get('email'),
            xauth = headerUtil.getHeaderValue('X-Auth'),
            checkInId = headerUtil.getHeaderValue('checkInId');

        if(!newPassword.getValue()) {
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('passwordsetting.error.newpassword'));
            return;
        };

        if(!repeatPassword.getValue() || newPassword.getValue() != repeatPassword.getValue()) {
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('passwordsetting.error.passwordmatch'));
            return;  
        };

        account.set('password', newPassword.getValue());

        //validate record
        errors = account.validate();

        if(!errors.isValid()) {
            if(errors.getByField('password').length > 0) {
                errMsg = i10n.translate('error.account.password');
                Ext.Msg.alert(i10n.translate('error'), errMsg);
                return;
            }
        };

        //Don't check old password. Users with an fb account may not have one
        if(!password.getValue()) {
            Ext.Msg.alert(i10n.translate('error'), i10n.translate('passwordsetting.error.nopassword'));
            return;
        };

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: i10n.translate('general.processing')
        });

        headerUtil.resetHeaders(['X-Auth', 'checkInId']);
        headerUtil.addHeaders({
            'login': email,
            'password' : password.getValue()
        });


        account.save({
            success: function(record, operation) {
                headerUtil.addHeaders({
                    'X-Auth': xauth,
                    'checkInId' : checkInId
                });

                headerUtil.resetHeaders(['login', 'password']);
                Ext.Viewport.setMasked(false);
                //clear form
                form.reset();
                //switch back to settings
                me.backToSettings();
                me.getApplication().getController('Android').removeLastBackHandler();
                //show success message
                Ext.Msg.show({
                    title : i10n.translate('success'),
                    message : i10n.translate('passwordsetting.success'),
                    buttons : []
                });
                
                Ext.defer((function() {
                    if(!appHelper.getAlertActive()) {
                        Ext.Msg.hide();
                    }
                }), appConfig.msgboxHideLongTimeout, this);
            },
            failure: function(record, operation) {
                headerUtil.addHeaders({
                    'X-Auth': xauth,
                    'checkInId' : checkInId
                });
                headerUtil.resetHeaders(['login', 'password']);

                Ext.Viewport.setMasked(false);

                try {
                    responseError = Ext.JSON.decode(operation.error.responseText);
                    responseErrorKey = responseError.errorKey;
                    if(responseErrorKey == "validationError") {
                        responseErrorKey = "error.account.password";
                    } else if(!responseErrorKey) {
                        responseErrorKey = 'errorMsg';
                    }
                } catch(e) {
                    console.log("Could not parse error response.");
                    responseErrorKey = 'errorMsg';
                };

                me.getApplication().handleServerError({
                    'error': operation.error, 
                    'forceLogout': false,
                    'message' : {
                        403: i10n.translate('general.credentials.invalid'),
                        400: i10n.translate(responseErrorKey)
                    }
                }); 
            }
        });
    },
    /**
    * Tap event handler called from back buttons in emailsetting or passwordsetting views.
    */
    backButtonHandler: function(button) {
        this.backToSettings();
        this.getApplication().getController('Android').removeLastBackHandler();
    },
    /**
    * Show or hide email and pw change buttons.
    * This is useful when the account auth is handled via facebook or google.
    * @param show
    *   true to show, false to hide
    */
    toggleEmailAndPwButtons: function(show) {
        var emailChangeDashboardBt = this.getEmailChangeDashboardBt(),
            emailChangeClubBt = this.getEmailChangeClubBt(),
            passwordChangeDashboardBt = this.getPasswordChangeDashboardBt(),
            passwordChangeClubBt = this.getPasswordChangeClubBt(),
            changeSectionLabel = this.getCallingView().down('#changeSectionLabel');

        emailChangeDashboardBt.setDisabled(!show);
        emailChangeClubBt.setDisabled(!show);
        passwordChangeDashboardBt.setDisabled(!show);
        passwordChangeClubBt.setDisabled(!show);
        emailChangeDashboardBt.setHidden(!show);
        emailChangeClubBt.setHidden(!show);
        passwordChangeDashboardBt.setHidden(!show);
        passwordChangeClubBt.setHidden(!show);

        if(changeSectionLabel) {
            changeSectionLabel.setHidden(!show);
        }
    },
    /**
    * Switches back to settings and removes inserted passwords.
    */
    backToSettings: function() {
        var passwordFields = this.getCallingView().query('passwordfield');

        //make sure to empty password fields!
        //works on all pw fields in emailsetting and passwordsetting
        passwordFields.every(function(field) {
            field.setValue("");
            //true to iterate over all elements
            return true;
        });

        this.getCallingView().animateActiveItem(0, {type: 'slide', direction: 'right'});
    }
});