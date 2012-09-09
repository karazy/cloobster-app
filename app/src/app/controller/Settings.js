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
    		nicknameField: 'settingstab #nickname',
            newsletterView: 'settingstab newsletter',
            registerNewsletterBt: 'settingstab newsletter button[action=register]',
            aboutBt: 'settingstab button[action=about]',
            //account related stuff
            emailField: 'settingstab emailfield',
            passwordField: 'settingstab passwordfield',
            emailChangeBt: 'settingstab button[action=email-change]',
            passwordChangeBt: 'settingstab button[action=password-change]'
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
                tap: 'changeEmail'
            }
    	}
    },
    launch: function() {
        var me = this;

    },
    /**
    *	Loads the settings and sets the corresponding fields.
    */
    loadSettings: function(tab, options) {
    	var checkInCtr = this.getApplication().getController('CheckIn'),
    		appState = checkInCtr.getAppState()
            account = this.getApplication().getController('Account').getAccount();

    	this.getNicknameField().setValue(appState.get('nickname'));
        this.getEmailField().setValue(account.get('email'));
    },

    /**
	 * Saves the nickname in local store.
	 */
	saveNickname: function(component, newData, oldValue, eOpts) {
    	var 	checkInCtr = this.getApplication().getController('CheckIn'),
		appState = checkInCtr.getAppState();

		appState.set('nickname', newData);
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
    * Change user email.
    * 
    */
    changeEmail: function() {
        var me = this,
            newEmail = this.getEmailField().getValue(),
            account = this.getApplication().getController('Account').getAccount();

        account.set('email', newEmail);
        
        //TODO validate email!
        //TODO ask for password?
        account.save({
            failure: function(record, operation) {
                me.getApplication().handleServerError({
                    'error': operation.error, 
                    'forceLogout': false,
                    // 'message' : {500: i10n.translate('newsletterDuplicateEmail')}
                }); 
            }
        });

    },
    /**
    * Change user password.
    */
    changePassword: function() {

    }
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