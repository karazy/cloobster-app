/**
 * Controller handles the checkin process.
 * This includes scanning of a barcode, choosing a nickname, checking in with others
 * and finally navigating to the menu.
 * Also handles the application state.
 */
Ext.define('EatSense.controller.CheckIn', {
    extend: 'Ext.app.Controller',

    /**
     * @event statusChanged
     * Fires whenever the checkin changed its status.
     * It is one of the list available under EatSense.util.Constants
     * @param {String} the status
     */

     /**
     * @event resumecheckin
     * Fires on resume of a checkin.
     * @param {EatSense.model.CheckIn} the checkin
     */

    /**
     * @event basicmode
     * Fires after the spot is loaded. 
     * @param {Boolean} True if basic mode is active, false otherwise.
     */

    /**
     * @event businessloaded
     * Fires when business data is loaded.
     * @param {EatSense.model.Business} the loaded business.
     */

     /**
     * @event spotswitched
     * Fires when a user switched spot inside a location
     * @param {EatSense.model.Spot} the new spot.
     * @param {EatSense.model.CheckIn} the new checkin.
     */


    requires: ['Ext.data.proxy.LocalStorage', 'EatSense.controller.Message', 'EatSense.view.SpotSelection'],
    config: {
        profile: Ext.os.deviceType.toLowerCase(),
    	refs: {
          main : 'mainview',
          checkinconfirmation : 'checkinconfirmation',
        	nickname : 'checkinconfirmation #nicknameTf',
        	checkinwithothers: 'checkinwithothers',
        	dashboard: 'dashboard',
        	settingsBt: 'dashboard button[action=settings]',
          aboutBt: 'dashboard button[action=about]',
        	// settingsBackBt: 'settings button[action=back]',
        	nicknameTogglefield: 'checkinconfirmation togglefield[action=toggle-nickname]',
        	nicknameSettingsField: 'settings #nicknameSetting',
        	settingsview: 'settings',
        	checkInDlg1Label1: 'checkinconfirmation #checkInDlg1Label1',    	       
        	checkInBtn: 'dashboard button[action=checkin]',
          //confirm checkn view
          cancelCheckInBt: 'checkinconfirmation button[action=cancel-checkin]',           
        	confirmCheckInBt : 'checkinconfirmation button[action=confirm-checkin]',
          regenerateNicknameBt : 'checkinconfirmation button[action=regenerate-nickname]',
          //checkIn w/ others
          userlist: '#checkinDlg2Userlist',
        	checkinDlg2Userlist: '#checkinDlg2Userlist',
        	checkinDlg2CancelBt : '#checkinDlg2CancelBt',
          //loungeview and tabs
          loungeview : 'lounge',
        	menuTab: 'menutab',
        	cartTab: 'carttab',
          settingsTab: 'settingstab',
          homeTab: 'clubarea',
          spotSelectionView : {
            selector: 'spotselection',
            xtype: 'spotselection',
            autoCreate: true
          }
    	},
    	control: {
    		checkInBtn: {
                tap: 'checkInIntent'
            },
            confirmCheckInBt: {
            	tap: 'checkIn'
            }, 
            checkinDlg2Userlist: {
            	select: 'linkToUser'
            },
            // checkinDlg2CancelBt: {
            // 	tap: 'showLounge'
            // },
            cancelCheckInBt: {
            	tap: 'showDashboard'
            },
            regenerateNicknameBt: {
            	tap: 'generateNickname'
            },
            aboutBt: {
              tap: 'showAbout'
            },
            settingsBt: {
            	tap: 'showSettings'
            },
            nicknameSettingsField: {            	
            	change: 'saveNickname'
            }
    	},
        /**
      	* Contains information to resume application state after the app was closed.
      	*/
      	appState : Ext.create('EatSense.model.AppState', {id: '1'}),
        /**
        *   Active checkIn for this session. Used througout whole application
        */
        activeCheckIn: null,
        /**
        *   The spot the activeCheckIn is currently checked in.
        */
        activeSpot: null,
        /* The active business. */
        activeBusiness: null,
        /* The area the user currently views. This does not mean he is checked in there. This is indicated by the activeSpot.*/
        activeArea: null
    },
    init: function() {
    	var messageCtr = this.getApplication().getController('Message'),
          loungeCtr = this.getApplication().getController('Lounge');
    	
      //register event handlers
    	this.on({
        'statusChanged' : this.handleStatusChange,
        scope: this 
      });

      this.getApplication().on('statusChanged', this.handleStatusChange, this);
    	messageCtr.on('eatSense.checkin', this.handleCheckInMessage, this);
      loungeCtr.on('areaswitched', function(area) {
        this.setActiveArea(area);
      }, this);
    },
    /**
     * Try to checkin by scanning a barcode.
     * @param {Ext.Button} button
     *  Button that triggered this tap event handler
     */    
    checkInIntent: function(button) {
    	console.log('CheckIn Controller -> checkIn');    	
    	var me = this,
          device,
          deviceId;
      
      deviceId = (device) ? device.platform : 'desktop';

      //disable button to prevent multiple checkins
      button.disable();
      barcode = this.scanBarcode(callback);

      function callback(barcode) {
        if(!barcode) {
         button.enable();
        } else {
          Ext.Viewport.setMasked({
            message : i10n.translate('loadingMsg'),
            xtype : 'loadmask'
          });
          me.doCheckInIntent(barcode, button, deviceId);
        }
      }	
   },
   /**
   * @private
   * Optains a barcode. In development (desktop, iPhone simulator) mode, shows a prompt, otherwise opens
   * the barcode scanner plugin.
   * 
   * @param {Function} callback
   *  Called after completion/cancelation of scanning. Gets passed the barcode as parameter.
   *  barcode is false when user cancelled
   */
   scanBarcode: function(callback) {
      var me = this,
          barcode;

      if(this.getProfile() == 'desktop' || !window.plugins || !window.plugins.barcodeScanner || (device && device.platform == "iPhone Simulator")) {
            Ext.Msg.show({
                title: i10n.translate('barcodePromptTitle'),
                message: i10n.translate('barcodePromptText'),
                buttons: [{
                    text: i10n.translate('yes'),
                    itemId: 'yes',
                    ui: 'action'
                }, {
                    text: i10n.translate('no'),
                    itemId: 'no',
                    ui: 'action'
                }],
                prompt : { maxlength : 50},
                scope: this,
                fn: function(btnId, value, opt) {
                    if(btnId=='yes') {
                        barcode = encodeURIComponent(Ext.String.trim(value));
                    } else {
                      barcode = false;
                    }

                    if(Ext.isFunction(callback)) {
                      callback(barcode);
                    }
                }
            }); 
      } else if(this.getProfile() == 'phone' || this.getProfile() == 'tablet') {
          window.plugins.barcodeScanner.scan(function(result) {
            if(!result.cancelled) {
              barcode =  me.extractBarcode(result.text);
            } else {
              barcode = false;
            }

            if(Ext.isFunction(callback)) {
              callback(barcode);
            }
        }, function(error) {
          Ext.Msg.alert("Scanning failed: " + error, Ext.emptyFn);
        });
      }
   },

   doCheckInIntent : function(barcode, button, deviceId) {         
      //validate barcode field
      if(barcode.length == 0) {
        Ext.Viewport.setMasked(false);
        button.enable();
        Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('checkInErrorBarcode'), Ext.emptyFn);
      } else {
          var me = this;
          EatSense.model.Spot.load(barcode, {
             success: function(record, operation) {
               me.setActiveSpot(record);
               me.setActiveArea(record.get('areaId'));
               me.checkInConfirm({model:record, deviceId : deviceId});                               
              },
              failure: function(record, operation) {                 
                me.getApplication().handleServerError({
                    'error': operation.error,
                    'message': {
                        404: i10n.translate('checkInErrorBarcode'),
                        403: i10n.translate('error.account.credentials.invalid')
                    },
                    userLogout : {
                      403: true
                    }
                }); 
              },
              callback: function() {
                Ext.Viewport.setMasked(false);
                button.enable();
              }
          });
      }
    },
   /**
   * @private
   * Expects a url with a barcode at the end. Separated by a #.
   * e. g. https://cloobster.com/get-app#ENCRYPTED_BARCODE
   * @return the extracted barcode
   */
   extractBarcode: function(url) {
    var indexHashTag = url.lastIndexOf('#') + 1,
        code;

    try {
      code = (indexHashTag > -1) ?  url.substring(indexHashTag, url.length) : url;
    } catch(e) {
      console.log('Error extracting code: ' + e);
      code = url;
    }

    console.log('Code extracted ' + code + ' from ' +url);

    return code;
   },
   /**
    * CheckIn Process
    * Step 2: User gets asked if he wants to check in. He can then choose a nickname used during his checkIn.
    * @param options
    */
   checkInConfirm: function(options) {
	  var checkInDialog = this.getCheckinconfirmation(), 
		    main = this.getMain(),
        nicknameToggle = this.getNicknameTogglefield(),
        nicknameField = this.getNickname(),
		    checkIn = Ext.create('EatSense.model.CheckIn'),
        accountCtr = this.getApplication().getController('Account'),
        profile = accountCtr.getProfile(),
        nicknameExists = false;
			
      //restore from profile
       if(accountCtr.isLoggedIn() && profile && profile.get('nickname') != null && Ext.String.trim(profile.get('nickname')) != '') {
          nicknameField.setValue(profile.get('nickname'));
          nicknameToggle.setValue(1);
       } 
        //restore from localstorage
        else if(this.getAppState().get('nickname') != null && Ext.String.trim(this.getAppState().get('nickname')) != '') {
          nicknameField.setValue(this.getAppState().get('nickname'));
          nicknameToggle.setValue(1);          
       } 
       
       if(nicknameField.getValue().length >= 3) {
          nicknameExists = true;  
        }
		
		checkIn.set('spotId', options.model.get('barcode'));
		checkIn.set('businessName', options.model.get('business'));
		checkIn.set('businessId', options.model.get('businessId'));
		checkIn.set('spot', options.model.get('name'));
		checkIn.set('status','INTENT');
		
		if(options.deviceId) {
			//store device uuid
			checkIn.set('deviceId',options.deviceId);
		}			
		this.setActiveCheckIn(checkIn);

    this.activateWelcomeMode(options.model.get('welcome') || options.model.get('master'));

      //user has to choose a nickname
		if(!nicknameExists) {
      main.switchTo(checkInDialog, 'left');
    } else {
      //user already has a stored nickname
      this.checkIn();
    }
		
   },
   /**
    * CheckIn Process
    * Step 3: User confirmed his wish to check in
    * @param options
    */
   checkIn: function() {
	   var me = this,
	       nickname = Ext.String.trim(this.getNickname().getValue()),
	       nicknameToggle = this.getNicknameTogglefield(),
         messageCtr = this.getApplication().getController('Message'),
         checkInDialog = this.getCheckinconfirmation(),
         accountCtr = this.getApplication().getController('Account'),
         profile = accountCtr.getProfile();

	 //get CheckIn Object and save it.	   
	   if(nickname.length < 3) {
		   Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('checkInErrorNickname',3,25), Ext.emptyFn);
	   } else {		   
          appHelper.toggleMask('loadingMsg');
		      this.getActiveCheckIn().set('nickname',nickname);		  	   
		      this.getActiveCheckIn().save(
					   {
					   	    success: function(response) {
                    appHelper.toggleMask(false);
  					   	    console.log("CheckIn Controller -> checkIn success");
                    //Set default headers so that always checkInId is send
                    headerUtil.addHeaders({
                      'checkInId' : response.get('userId'),
                      'pathId' : me.getActiveCheckIn().get('businessId')
                    });

                    me.fireEvent('statusChanged', appConstants.CHECKEDIN);
  					   	    me.loadBusiness(); 
  					   	    me.getAppState().set('checkInId', response.get('userId'));
  					   	     
  					//save nickname in settings
  					if(nicknameToggle.getValue() == 1) {
              if(accountCtr.isLoggedIn() && profile && profile.get('nickname') != nickname) {
                  profile.set('nickname', nickname);
                  profile.save();
              } else {
                  me.getAppState().set('nickname', nickname);
              }
              nicknameToggle.reset();
  					}
                   
               //open a channel for push messags
               try {
                    messageCtr.openChannel(response.get('userId'));
                } catch(e) {
                    console.log('could not open a channel ' + e);
                }
					},
				failure: function(response, operation) {
                    appHelper.toggleMask(false);
                    me.getApplication().handleServerError({
                      'error': operation.error, 
                      'forceLogout':{403 : true}
                    }); 
					   	    }
				}	   
			   );
	   }
   },
   /**
    * CheckIn Process
    * Step 2 alt: cancel process
    */
   showDashboard: function(options) {
	   var dashboardView = this.getDashboard(),
	       main = this.getMain(),
	       nicknameToggle = this.getNicknameTogglefield();
	   
	   this.setActiveCheckIn(null);
	   	   
	   main.switchTo(dashboardView, 'right');
	   nicknameToggle.reset();
		
	   //ensure that main is only added once to viewport
	   if(main.getParent() !== Ext.Viewport) {
		   Ext.Viewport.add(main);
	   }
   },
   /**
    * CheckIn Process
    * Step 4: List other users located at this spot
    * @param options
    */
   // showCheckinWithOthers: function(options) {
	  //  //TODO out of order
	  //  var checkinwithothersDlg = this.getCheckinwithothers(), 
	  //  main = this.getMain(),
	  //  spotId = this.getActiveCheckIn().get('spotId'),
	  //  checkInId = this.getActiveCheckIn().get('userId');
	   
	  //   var userListStore = Ext.create('Ext.data.Store', {
	  //  			   model: 'EatSense.model.User',
	  //  			   proxy: {
	  //  				   type: 'rest',
	  //  				   url : appConfig.serviceUrl+'/checkins/?spotId='+spotId+'&checkInId='+checkInId,
	  //  				   reader: {
	  //  					   type: 'json'
	  //  			   		}
	  //  			   }
	  //  		   });
	  //    //set list content in view	  
	  // 	 this.getUserlist().setStore(userListStore); 
	  // 	 this.getUserlist().getStore().load({
	  // 	     scope   : this,
	  // 	     callback: function(records, operation, success) {	  	    	 
			  	  
			// 	  	if(records.length > 0) {
			// 	  		main.switchTo(checkinwithothersDlg, 'left');
			// 	  	} else {
			// 	  		this.showLounge();
			// 	  	}
	  // 	     }
	  // 	 });	  		  	
   // },
   /**
    * CheckIn Process
    * Step 4-I: Link user to a chosen person 
    * @param dataview
    * @param record
    */
   // linkToUser: function(dataview, record) {
	  //  //TODO out of order
	  //  var checkIn = this.getActiveCheckIn(),
	  //  me = this;	   
	  //  checkIn.set('linkedCheckInId', record.get('userId'));
	   
	  //  checkIn.save({
		 //  scope: this,
		 //  success: function(record, operation) {
			//   me.showLounge();
		 //  },
		 //   failure: function(record, operation) {
   // 	    	if(operation.getError() != null && operation.getError().status != null && operation.getError().status == 500) {
   // 	    		var error = Ext.JSON.decode(response.statusText);
   // 	    		Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate(error.errorKey,error.substitutions), Ext.emptyFn);
   // 	    	} else {
   // 	    		Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('errorMsg'), Ext.emptyFn);
   // 	    	}
		 //   }
	  //  });
   // },
  /**
  * Shows an about screen.
  */
  showAbout: function() {
    this.getApplication().getController('Settings').showAbout();
  },
	/**
	 * Show settings screen.
	 * 
	 */
	showSettings: function() {
		var   main = this.getMain(),
		      settings = this.getSettingsview();
		
		this.getNicknameSettingsField().setValue(this.getAppState().get('nickname'));
		
		main.switchTo(settings, 'left');
	},
	/**
	 * Saves the application state in local store.
	 */
	saveNickname: function(component, newData, oldValue, eOpts) {
		this.getAppState().set('nickname', newData);
	},
	/**
   * @DEPRECATED
	 * Makes an ajax call to the server, retrieves a random nickname
	 * and sets the nickname field.
	 * 
	 * ®return
	 * 		the nickname
	 */
	generateNickname : function(callback) {
		Ext.Ajax.request({
    	    url: appConfig.serviceUrl+'/nicknames',
    	    method: 'GET',
    	    scope: this,
    	    params: {
    	        random: ""
    	    },
    	    success: function(response){
    	    	this.getNickname().setValue(response.responseText);
    	    }
    	});		
	},
	/**
	 * This method is called from launch function during application start 
	 * when an existing checkin was found. This could happen when a user exits
	 * the application during a checkin and restarts.
	 * The method makes sure that all relevant information is restored like products in cart,
	 * or the active spot.
	 * 
	 * @param checkin
	 * 		Restored checkin
	 */
	restoreState: function(checkIn) {
		var me = this,
        main = this.getMain(),
        messageCtr = this.getApplication().getController('Message');

        this.setActiveCheckIn(checkIn);
        //reload of application before hitting leave button
        if(checkIn.get('status') == appConstants.PAYMENT_REQUEST || checkIn.get('status') == appConstants.COMPLETE) {
            console.log('CheckIn in status '+checkIn.get('status')+'. Don\'t restore state!');
            this.handleStatusChange(appConstants.COMPLETE);
            this.setActiveCheckIn(null);
            return;
        }

		
        //Set default headers so that always checkInId is send
        headerUtil.addHeaders({
          'checkInId' : checkIn.get('userId'),
          'pathId' : checkIn.get('businessId')
        });

		//load active spot
		EatSense.model.Spot.load(encodeURIComponent(checkIn.get('spotId')), {
		scope: this,
   		 success: function(record, operation) {
   			 this.setActiveSpot(record);
         this.setActiveArea(record.get('areaId'));
         this.activateWelcomeMode(record.get('welcome'));
   			 this.loadBusiness(); 
   			    			
   			Ext.Viewport.add(main);

        me.fireEvent('resumecheckin', me.getActiveCheckIn());

        me.fireEvent('statusChanged', appConstants.CHECKEDIN);


         //open a channel for push messags
         try {
              messageCtr.openChannel(checkIn.get('userId'));
          } catch(e) {
              console.log('could not open a channel ' + e);
          }
  	    },
  	    failure: function(record, operation) {
  	    	me.getApplication().handleServerError({
                  'error':operation.error
          });        	    	
  	    }
		});
	},
  /**
  * @private
  * Loads the business by businessId of activeSpot.
  * Called during checkin.
  * Sets business related configuration like currency.
  */
  loadBusiness: function() {
    var me = this,
        spot = this.getActiveSpot(),
        business;

    if(!spot) {
      console.log('CheckIn.loadBusiness > no active spot! Load business failed.');
      return;
    }

    business = EatSense.model.Business.load(spot.get('businessId'), {
      success: function(record) {
        me.setActiveBusiness(record);
        me.activateBasicMode(record.get('basic'));
        me.fireEvent('businessloaded',record);
        //notify listeners about the basic mode
        me.fireEvent('basicmode',record.get('basic'));

        try {
          if(appConstants.Currency[me.getActiveBusiness().get('currency')]) {
            //if the business currency is available in app set it
            appConfig.currencyFormat = me.getActiveBusiness().get('currency');
          }          
        } catch(e) {
          console.log('CheckIn.loadBusiness > failed setting currency');
        }


      },
      failure: function(record, operation) {
        me.handleServerError({
          'error': operation.error
        });
      }
    });    
  },
  /**
  * Show a loading mask on the viewport or remove it.
  * @param messageKey
  *   MessageKey used to get messager for loading message.
  *   If this is not a string (e. g. boolean false), loading mask gets removed.
  */
  toggleDashboardMask: function(messageKey) {

    if(typeof messageKey == "string") {
      Ext.Viewport.setMasked({
        xtype: 'loadmask',
        message: i10n.translate(messageKey)
      });
    } else {
      Ext.Viewport.setMasked(false);
    }
  },
	/**
	 * This method handle status changes. It checks if valid transsions are made.
	 * E. g. You cannot switch from PAYMENT_REQUEST to ORDER_PLACED.
	 * It enables or disables certain functionalities depending on the status.
  * Furthermore resets ui states and does cleanups.
	 * Always use this method to change the application status. 
	 * @param status
   *  The new status to set.
	 */
	handleStatusChange: function(status) {
		console.log('CheckIn Controller -> handleStatusChange' + ' new status '+status);
    var accountCtr = this.getApplication().getController('Account'),
        appState = this.getAppState(),
        spotStore = Ext.StoreManager.lookup('spotStore');

    appState.set('prevStatus', appState.get('status'));
    appState.set('status', status);

		//TODO check status transitions, refactorshowInfoPagesButtonHandler
		if(status == appConstants.CHECKEDIN) {

    }
		else if(status == appConstants.PAYMENT_REQUEST) {	
			this.getActiveCheckIn().set('status', status);
		} else if (status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
			this.showDashboard();			
			// this.getLoungeview().setActiveItem(this.getMenuTab());      

      //clear checkInId
      this.getAppState().set('checkInId', null);
      
      headerUtil.resetHeaders(['checkInId','pathId']);

      this.getActiveBusiness().payments().each(function(pm) {
        pm.destroy();
      });
      this.getActiveBusiness().payments().removeAll();

      this.setActiveBusiness(null);
      this.setActiveSpot(null);
      this.setActiveArea(null);

      if(spotStore) {
        spotStore.each(function(spot) {
          spot.destroy();
        });

        spotStore.removeAll(true);
      }
      
      if(accountCtr.getAccount()) {
        //account can be null when no one is logged in
        accountCtr.getAccount().set('checkInId', null);  
      };
		}


    if(status == appConstants.CANCEL_ALL) {
        Ext.Msg.alert(i10n.translate('hint'), i10n.translate('checkInCanceled'), Ext.emptyFn);
    }
	},
    /**
    *   Handle push notifications for checkins.
    *
    */
    handleCheckInMessage: function(action, updatedCheckIn) {
        var     checkIn = this.getActiveCheckIn();

        if(action == "delete") {
            if(checkIn.get('userId') == updatedCheckIn.userId) {
                this.fireEvent('statusChanged', appConstants.CANCEL_ALL);
            }
        }
    },
    //start welcome and basic mode logic

    /**
     * Convenvience method. Reads welcome and basic mode from spot and business
     * and sets it on given view or loungeview
     * @param {Ext.Component} view (optional)
     *  If present, uses this view instead of loungeview
     */
    activateWelcomeAndBasicMode: function(view) {
       var viewToSetMode = view || this.getLoungeview();

       this.activateWelcomeMode(this.getActiveSpot().get('welcome'), viewToSetMode);
       this.activateBasicMode(this.getActiveBusiness().get('basic'), viewToSetMode);
    },

    /**
     * Sets welcome mode on {EatSense.view.component.BasicButton} elements.
     * Searches for all basicButtons in loungeview
     * @param {Boolean} welcome
     *    true or false
     * @param {Ext.Component} view (optional)
     *  If present, uses this view instead of loungeview
     */
    activateWelcomeMode: function(welcome, view) {
        var me = this,
            loungeview = view || this.getLoungeview(),
            buttons;

        // console.log('CheckIn.activateWelcomeMode: ' + welcome);

        buttons = loungeview.query('basicbutton');

        Ext.Array.each(buttons, function(button, index) {
            button.setWelcome(welcome);
        });

        buttons = loungeview.query('basictilebutton');

        Ext.Array.each(buttons, function(button, index) {
            button.setWelcome(welcome);
        });
    },
    /**
     * Sets basic mode on {EatSense.view.component.BasicButton} elements.
     * Searches for all basicButtons in loungeview
     * @param {Boolean} basic
     *    true or false
     * @param {Ext.Component} view (optional)
     *  If present, uses this view instead of loungeview
     */
    activateBasicMode: function(basic, view) {
        var me = this,
            loungeview = view || this.getLoungeview(),
            buttons;

        // console.log('CheckIn.activateBasicMode: ' + basic);

        buttons = loungeview.query('basicbutton');

        Ext.Array.each(buttons, function(button, index) {
            button.setBasic(basic);
            button.activateBasicMode(basic);
        });

        buttons = loungeview.query('basictilebutton');

        Ext.Array.each(buttons, function(button, index) {
            button.setBasic(basic);
            button.activateBasicMode(basic);
        });
    },
  /**
  * @private
  * Checks if the active spot belongs to active area.
  * This is mainly used to ensure orders can only be issued from active spot.
  * @param {EatSense.model.Spot} spot (optional)
  *   spot to check, if none provided uses active spot
  * @param {EatSense.model.Area} area (optional)
  *   area to check, if none provided uses active area
  * @return true if spot belongs to area, false otherwise
  */
  checkActiveSpotInActiveArea: function(spot, area) {
    var activeSpot = spot || this.getActiveSpot(),
        activeArea = area || this.getActiveArea();

    if(!activeSpot) {
      console.error('Order.checkActiveSpotInActiveArea: activeSpot not found.');
      return false;
    }

    if(!activeArea) {
      console.error('Order.checkActiveSpotInActiveArea: activeArea not found.');
      return true;
    }

    if(Ext.isNumber(activeArea) && activeSpot.get('areaId') == activeArea) {
      //initial area, we only have the id
      return true;
    }

    if(activeSpot.get('areaId') == activeArea.get('id')) {
      return true;
    }

    return false;
  },
  /**
  * Ask user if he wants to switch the spot based on the activeArea.
  * @param {Boolean} ordersExist
  *   if true then orders exist and checkin must be completed
  */
  confirmSwitchSpot: function(ordersExist) {
    var me = this,
        activeArea = this.getActiveArea(),
        orderCtr = this.getApplication().getController('Order'),
        ordersTotal,
        completeCheckInMessage,
        barcodeRequired;

    if(!activeArea) {
      console.error('CheckIn.loadSpotsForActiveArea');
      return;
    };

    if(Ext.isNumber(activeArea)) {
      //if we only have an area id always require a barcode
      barcodeRequired = true;
    } else {
      barcodeRequired = activeArea.get('barcodeRequired');
    }

    //if orders exist show alert and ask user to select payment method
    if(ordersExist) {
      ordersTotal = appHelper.formatPrice(orderCtr.calculateOrdersTotal(Ext.StoreManager.lookup('orderStore')), true);
      completeCheckInMessage = barcodeRequired ?
       i10n.translate('checkin.switchspot.orders.barcode', ordersTotal) : i10n.translate('checkin.switchspot.orders.list', ordersTotal);

      Ext.Msg.alert(i10n.translate('hint'), 
        completeCheckInMessage,
          function() {
            orderCtr.choosePaymentMethod(onChoose);
          }, this);

      function onChoose(paymentMethod) {
        me.switchSpot(activeArea, ordersExist, paymentMethod);
      }
    } else {
          Ext.Msg.show({
          title: i10n.translate('hint'),
          message: barcodeRequired ? i10n.translate('checkin.switchspot.barcode') : i10n.translate('checkin.switchspot.list'),
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
            if(btnId=='yes') {
              me.switchSpot(activeArea, ordersExist);
            }
          }
       }); 
    }
  },
  /**
  * @private
  * Called after successful user confirm in CheckIn.confirmSwitchSpot.
  * @param {EatSense.model.Area} area
  *   Gets passed the active area.
  * @param {Boolean} ordersExist
  *   if true then orders exist and we don't delete the checkin
  * @param {String} paymentMethod
  *   Payment method to used to create bill when orders exist
  */
  switchSpot: function(area, ordersExist, paymentMethod) {
    var me = this,
        activeArea = area,
        barcodeRequired,
        activeCheckIn = this.getActiveCheckIn(),
        newCheckIn = Ext.create('EatSense.model.CheckIn'),
        appState = this.getAppState(),
        orderCtr = this.getApplication().getController('Order');
        // switchFnSequence = Ext.Function.createInterceptor(doSwitch, checkAndFinalizeCheckIn);


      if(Ext.isNumber(activeArea)) {
      //if we only have an area id always require a barcode
        barcodeRequired = true;
      } else {
        barcodeRequired = activeArea.get('barcodeRequired');
      }

      //get barcode or spot
      if(barcodeRequired) {
        //scan barcode
        this.scanBarcode(doLoadSpot);
      } else {
        //or load spots
        this.showSpotSelection(area, function(newSpot) {
          checkAndFinalizeCheckIn(newSpot, doSwitch);
        });
      }

      //Sequence of functions
      // 1.loadSpot
      // 2.checkAndFinalizeCheckIn
      // 3.doSwitch
      // 4.doCheckIn -> fires spotswitched

      
      //load barcode and and proceed with doSwitch on success
      function doLoadSpot(barcode) {
        me.loadSpot(barcode, function(newSpot) {
          checkAndFinalizeCheckIn(newSpot, doSwitch);
        });
      }

      //verify switch, finalize checkin, returns true on success
      function checkAndFinalizeCheckIn(newSpot, onSuccess) {

        if(!newSpot) {
          console.error('CheckIn.switchSpot.checkAndFinalizeCheckIn: no spot given');
          return false;
        }

        //check business ids of new spot against old spot!
        if(newSpot.get('businessId') != me.getActiveSpot().get('businessId')) {
           Ext.Msg.alert(i10n.translate('hint'), i10n.translate('error.checkin.switchspot.businesses.mismatch'));
          return false;
        }

        //prevent switch to welcome spots
        if(newSpot.get('welcome') == true) {
          Ext.Msg.alert(i10n.translate('hint'), i10n.translate('error.checkin.switchspot.welcome'));
          return false;
        }

        //prevent switch to master spots
        if(newSpot.get('master') == true) {
          Ext.Msg.alert(i10n.translate('hint'), i10n.translate('error.checkin.switchspot.welcome'));
          return false;
        }

        //check that new spot belongs to selected area
        if(!me.checkActiveSpotInActiveArea(newSpot, area)) {
          Ext.Msg.alert(i10n.translate('hint'), i10n.translate('error.checkin.switchspot.area.mismatch'));
          return false;
        }

        //delete checkin
        if(!ordersExist) {          
          me.deleteActiveCheckIn(callback);
        } else {
          //save bill ... to complete checkin
          if(!paymentMethod) {
            console.error('CheckIn.switchSpot: no paymentMethod given');
            return false;
          }
          orderCtr.saveBillForCheckIn(paymentMethod, callback);
        }

        function callback(success) {
          if(success) {
            onSuccess(newSpot);
          }
        }
      }


      //set given spot as active on, save the new checkin 
      function doSwitch(newSpot) {
        //reset old checkInId in header
        headerUtil.resetHeaders(['checkInId']);
        //set new active spot
        me.setActiveSpot(newSpot);

        newCheckIn.set('userId', ''); //as always set sencha id to null
        newCheckIn.set('spotId', newSpot.get('barcode'));
        newCheckIn.set('businessName', newSpot.get('business'));
        newCheckIn.set('businessId', newSpot.get('businessId'));
        newCheckIn.set('spot', newSpot.get('name'));
        //nickname korrekt laden über neue generelle methode!
        newCheckIn.set('nickname', appState.get('nickname'));
        //we are already checked in, no intent
        newCheckIn.set('status', appConstants.INTENT);

        //save checkin
        me.saveCheckIn(newCheckIn, doCheckIn);

      }

      function doCheckIn(checkin) {
        me.setActiveCheckIn(checkin);
        //Set default headers so that always checkInId is send
        headerUtil.addHeaders({
          'checkInId' : checkin.get('userId'),
          'pathId' : checkin.get('businessId')
        });

        me.getAppState().set('checkInId', checkin.get('userId'));
        //deactivate welcome mode, since we can not switch to a welcome spot, this is always false
        me.activateWelcomeMode(false);
        //notify controllers after everything has finished to refresh state where necessary
        //clean up orderstore, cart, badge texts ...
        me.fireEvent('spotswitched', me.getActiveSpot(), checkin);
      }
  },
  /**
  * Load a spot via given barcode. Masks Viewport while loading. Also handles errors.
  * @param {String} barcode
  *   barcode identifiying spot
  * @param {Function} callback
  *   Executed on success. Gets spot as parameter.
  *
  */
  loadSpot: function(barcode, callback) {
    var me = this;

      if(!barcode || barcode.length == 0) {
        Ext.Viewport.setMasked(false);
        Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('checkInErrorBarcode'), Ext.emptyFn);
      } else {
          appHelper.toggleMask('loadingMsg');

          EatSense.model.Spot.load(barcode, {
             success: function(record, operation) {
               if(appHelper.isFunction(callback)) {
                  callback(record);
               }
              },
              failure: function(record, operation) {                 
                me.getApplication().handleServerError({
                    'error': operation.error,
                    'message': {
                        404: i10n.translate('checkInErrorBarcode'),
                        403: i10n.translate('error.account.credentials.invalid')
                    },
                    userLogout : {
                      403: true
                    }
                }); 
              },
              callback: function() {
                appHelper.toggleMask(false);
              }
          });
      }
  },
  /**
  * Display {@link EatSense.view.SpotSelection} with all avail. spots at given area.
  * @param {EatSense.model.Area|String} either an area model or area id
  * @param {Function} onSelect
  *   callback on spot selection, gets passed the selected spot
  */
  showSpotSelection: function(area, onSelect) {
    var me = this,
        spotSelectionView = this.getSpotSelectionView(),
        spotStore = Ext.StoreManager.lookup('spotStore'),
        backbutton,
        searchField,
        spotList,
        userTypes = null,
        searckKeyUpFn =  Ext.Function.createBuffered( filterSpotList, 50, this);

    //load all spots
    this.loadSpotsForArea(area);

    //register events
    backbutton = spotSelectionView.down('backbutton');
    searchField = spotSelectionView.down('searchfield');
    spotList = spotSelectionView.down('list');

    backbutton.on({
      tap: hideSpotSelectionView,
      single: true,
      scope: this
    });

    spotList.on({
      select: onListSelect
    });

    searchField.on({
      keyup: searchFieldKeyupHandler,
      clearicontap: clearSpotListFilter
    });

    //hide the spot selection view and deregister listeners
    function hideSpotSelectionView() {

      backbutton.un({
        tap: hideSpotSelectionView
      });

      spotList.un({
        select: onListSelect
      });

      searchField.un({
        keyup: searchFieldKeyupHandler,
        clearicontap: clearSpotListFilter
      });

      clearSpotListFilter();
      spotSelectionView.hide();
    }

    //list select handler
    function onListSelect(list, record) {

      hideSpotSelectionView();

      clearSpotListFilter();
      if(appHelper.isFunction(onSelect)) {
        onSelect(record);
      }
    }

    //key up handler
    function searchFieldKeyupHandler(field) {
      searckKeyUpFn(field.getValue());
    }

    //filter spot list by given value
    function filterSpotList(value) {
      spotStore.clearFilter(true);
      spotStore.filter('name', value);
      spotList.refresh();
    }

    //clear the spot list filter
    function clearSpotListFilter() {
      spotStore.clearFilter();
      spotList.refresh();
    }

    Ext.Viewport.add(spotSelectionView);
    spotSelectionView.show();
  },
  /**
  * Load all spots for active area. Only if area does not require a barcode.
  *
  */
  loadSpotsForArea: function(area) {
    var me = this,
        activeArea = area,
        spotStore = Ext.StoreManager.lookup('spotStore'),
        areaId;

    if(!activeArea) {
      console.error('CheckIn.loadSpotsForActiveArea: no area given');
      return;
    };

    if(!Ext.isNumber(activeArea) && activeArea.get('barcodeRequired')) {
      console.log('Order.loadSpotsForActiveArea: this area requires a barcode!');
      return;
    }

    areaId = Ext.isNumber(activeArea) ? activeArea : activeArea.get('id');

    spotStore.load({
      params: {
        'areaId' : areaId
      },
      callback: function(records, operation, success) { 
        if(!operation.error) {

        }
        else {
          me.getApplication().handleServerError({
                'error': operation.error, 
                'forceLogout': {403:true}
              });
          }
      }
    });
  },
    /**
    * Do a checkin by persisting it. While saving masks viewport, since this is a critical action.
    * @param {EatSense.model.CheckIn} checkIn
    *   CheckIn object used to checkin at location
    * @param {Function} onSuccess
    *   callback function, executed on success gets passed the persisted checkin
    */
   saveCheckIn: function(checkIn, onSuccess) {
     var me = this;
      
      if(!checkIn) {
        console.error('CheckIn.doCheckIn: no checkIn given');
        return;
      }

      appHelper.toggleMask('loadingMsg');      
      checkIn.save({
          success: function(response) {
            appHelper.toggleMask(false);            

            if(appHelper.isFunction(onSuccess)) {
              onSuccess(response);
            }
          },
        failure: function(response, operation) {
            appHelper.toggleMask(false);
            me.getApplication().handleServerError({
              'error': operation.error, 
              'forceLogout':{403 : true}
            }); 
          }
      });     
   },
   /**
   * Deletes the active checkIn
   * @param {Function} callback
   *    Called after delete returns. Gets passed true or false depending on success.
   */
   deleteActiveCheckIn: function(callback) {
    var activeCheckIn = this.getActiveCheckIn();


    if(!activeCheckIn) {
      console.error('CheckIn.deleteCheckIn: no active checkIn exists.');
      if(appHelper.isFunction(callback)) {
        callback(false);
      }
      return false;
    }

    //additional checks? checkIn.get('status') != appConstants.PAYMENT_REQUEST

    activeCheckIn.erase({
        success: function() {
          callback(true);
        },
        failure: function(response, operation) {
          me.getApplication().handleServerError({
            'error': operation.error,
            'forceLogout': {403: true}
          });
          callback(false);
        }
      });
   }


    //end welcome and basic mode logic
});

