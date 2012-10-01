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
    		settingsTab: 'lounge settingstab[tabName=settings]',
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
            // emailChangeView: {
            //     xtype: 'emailsetting',
            //     selector: 'emailsetting',
            //     autoCreate: true
            // },
            saveEmailBt: 'emailsetting button[action=save]',
            // passwordChangeView: {
            //     xtype: 'passwordsetting',
            //     selector: 'passwordsetting',
            //     autoCreate: true
            // },
            savePasswordBt: 'passwordsetting button[action=save]',
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
        this.loadSettings(tab.down('#settingCards'));
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
            emailChangeBt = null,
            emailLabel = null ,//this.getEmailLabel(),
            accountPanel = null; //this.getAccountPanel();

        //TODO check view xtype

        this.setCallingView(view);
        callingView = this.getCallingView();

        emailLabel = callingView.down('settings #accountEmail');
        accountPanel = callingView.down('settings #accountPanel');


        if(accountCtr.isLoggedIn()) {
            accountPanel.setHidden(false);
            //TODO check if account is loaded correctly!
            if(account) {
                emailLabel.getTpl().overwrite(emailLabel.element, account.getData());     
            };
            if(profile) {
                this.getNicknameField().setValue(profile.get('nickname'));    
            } ;
        } else {
            this.getNicknameField().setValue(appState.get('nickname'));
            //hide account settings
            //TODO show signup button
            accountPanel.setHidden(true);
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
            accountCtr.getProfile().set('nickname', newData);
            //TODO error handling?
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
        var about = Ext.create('EatSense.view.About');

        Ext.Viewport.add(about);
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
            navView = this.getSettingsNavView(),
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
                errMsg = i10n.translate('emailsetting.error.invalidmail');
                Ext.Msg.alert(i10n.translate('error'), errMsg);
                return;
            }
        };

        if(!password.getValue()) {
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
                me.loadSettings();

                //switch back to settings
                me.getCallingView().setActiveItem(0);
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
                headerUtil.resetHeaders(['login', 'password']);
                account.set('email', oldMail);

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
            navView = this.getSettingsNavView(),
            newPassword = passwordChangeView.down('#newPassword'),
            repeatPassword = passwordChangeView.down('#repeatPassword'),
            password = passwordChangeView.down('#oldPassword'),
            account = this.getApplication().getController('Account').getAccount(),
            errors,
            errMsg,
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
                me.getCallingView().setActiveItem(0);
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
                me.getApplication().handleServerError({
                    'error': operation.error, 
                    'forceLogout': false,
                    'message' : {403: i10n.translate('general.credentials.invalid')}
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

        this.getCallingView().getLayout().setAnimation({
            type: 'slide',
            direction: 'right'
        });
        
        this.getCallingView().setActiveItem(0);

        this.getCallingView().getLayout().setAnimation({
            type: 'slide',
            direction: 'left'
        });
    }
});