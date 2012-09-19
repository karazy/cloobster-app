/**
*	Handles save and restore of application settings.
*   Register for newsletter.
*/
Ext.define('EatSense.controller.Settings', {
    extend: 'Ext.app.Controller',
    requires: ['EatSense.view.NewsletterPopup', 'EatSense.view.Newsletter'],
    config: {
    	refs: {
    		settingsTab: 'lounge settingstab[tabName=settings]',
            settingsNavView: 'settingstab navigationview',
    		nicknameField: 'settingstab #nickname',
            newsletterView: 'settingstab newsletter',
            registerNewsletterBt: 'settingstab newsletter button[action=register]',
            aboutBt: 'settingstab button[action=about]',
            //account related stuff
            accountPanel: 'settingstab #accountPanel',
            emailChangeBt: 'settingstab button[action=email-change]',
            passwordChangeBt: 'settingstab button[action=password-change]',
            emailLabel: 'settingstab #accountEmail',
            emailChangeView: {
                xtype: 'emailsetting',
                selector: 'emailsetting',
                autoCreate: true
            },
            saveEmailBt: 'emailsetting button[action=save]',
            passwordChangeView: {
                xtype: 'passwordsetting',
                selector: 'passwordsetting',
                autoCreate: true
            },
            savePasswordBt: 'passwordsetting button[action=save]',
    	},

    	control: {
    		settingsTab : {
    			activate: 'loadSettings'
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
            emailChangeBt: {
                tap: 'showEmailChangeView'
            },
            passwordChangeBt: {
                tap: 'showPasswordChangeView'
            },
            saveEmailBt: {
                tap: 'saveEmail'
            },
            savePasswordBt: {
                tap: 'savePassword'
            }
    	}
    },
    /**
    *	Loads the settings and sets the corresponding fields.
    */
    loadSettings: function(tab, options) {
    	var checkInCtr = this.getApplication().getController('CheckIn'),
    		appState = checkInCtr.getAppState(),
            accountCtr = this.getApplication().getController('Account'),
            account = this.getApplication().getController('Account').getAccount(),
            profile = this.getApplication().getController('Account').getProfile(),
            emailLabel = this.getEmailLabel(),
            accountPanel = this.getAccountPanel();

    	

        if(accountCtr.isLoggedIn()) {
            accountPanel.setHidden(false);
            //TODO check if account is loaded correctly!
            emailLabel.getTpl().overwrite(emailLabel.element, account.getData()); 
            if(profile) {
                this.getNicknameField().setValue(profile.get('nickname'));    
            } 
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
        } else {
            appState.set('nickname', newData);
        }		
	},
    /**
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
            emailChangeView = this.getEmailChangeView(),
            navView = this.getSettingsNavView();

        
        navView.push(emailChangeView);
    },
    /**
    * Save new email adress.
    *
    */
    saveEmail: function() {
        var me = this,
            emailChangeView = this.getEmailChangeView(),
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
                navView.pop();
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
            passwordChangeView = this.getPasswordChangeView(),
            navView = this.getSettingsNavView();

        
        navView.push(passwordChangeView);
    },

    savePassword: function() {
        var me = this,
            passwordChangeView = this.getPasswordChangeView(),
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
                //switch back to settings
                navView.pop();
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

    //Account actions end

    /**
    * Shows a popup to user asking for his email to register for newsletter.
    */
    // registerNewsletterOnLeaving: function() {
    //     var me = this,
    //         checkInCtr = this.getApplication().getController('CheckIn'),
    //         appState = checkInCtr.getAppState(),
    //         popup = Ext.create('EatSense.view.NewsletterPopup');

    //     //setup button handler
    //     popup.on({
    //         delegate: 'button[action=register]',
    //         tap: function() {
    //              //force keyboard to hide, due to a bug in Android 4.0 the textfield is visible above the popup
    //             popup.down('newsletter').down('emailfield').blur();
    //             me.registerNewsletter(popup.down('newsletter').getValues(), 
    //                 //remove on success
    //             function() {
    //                 Ext.Viewport.remove(popup);
    //             });
    //         }
            
    //     });

    //     popup.on({
    //         delegate: 'button[action=dont-ask]',
    //         tap: function() {
    //             appState.set('newsletterRegistered', true);
    //            Ext.Viewport.remove(popup);
    //         }
    //     });

    //     popup.on('hide', function() {
    //          Ext.Viewport.remove(popup);
    //     });

    //     Ext.Viewport.add(popup);
    //     popup.show();

    // }
});