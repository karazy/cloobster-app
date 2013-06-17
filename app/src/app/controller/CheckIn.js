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
     * Fires whenever the checkin changed its status. This is the MAIN event.
     * Most actions start after user checked-in.
     * @param {String} the status
     *  One out of the list available under EatSense.util.Constants
     * @param {EatSense.model.CheckIn} activeCheckIn
     *  On CHECKEDIN the active checkin is provided
     */

     /**
     * @event resumecheckin
     * Fires on resume of a checkin.
     * @param {EatSense.model.CheckIn} the checkin
     */

     /**
     * @event applaunched
     * Fires on a normal app startup (without checkin restore).
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

     /**
     * @event checkinwithspot
     * Fires on Ext.Viewport. Indicates that a checkin should be made with given spot.
     * @param {EatSense.model.Spot} spot to use for checkin
     */

     /**
     * @event launchwithqrcode
     * Fires on Ext.Viewport. Indicates that a checkin should be made with given barcode.
     * Normally gets called by invokin cloobster via an url scheme.
     * @param {String} qrcode to use for checkin
     */

     /**
     * @event democheckin
     * Fires on Ext.Viewport. Indicates that a checkin should be made with demo spot.
     */     


    requires: ['Ext.data.proxy.LocalStorage', 'EatSense.controller.Message', 'EatSense.view.SpotSelection'],
    config: {
        profile: Ext.os.deviceType.toLowerCase(),
    	refs: {
          main : 'lounge',
          cloobsterArea: 'cloobsterarea',
          checkinconfirmation : 'checkinconfirmation',
        	nickname : 'checkinconfirmation #nicknameTf',
        	dashboard: 'dashboard',
        	settingsBt: 'dashboard button[action=settings]',
        	nicknameTogglefield: 'checkinconfirmation togglefield[action=toggle-nickname]',
        	nicknameSettingsField: 'settings #nicknameSetting',
        	settingsview: 'settings',  	       
        	checkInBtn: 'dashboard button[action=checkin]',
          toVisitCheckInBtn: 'visitdetail button[action=scan]',
          //confirm checkn view
          cancelCheckInBt: 'checkinconfirmation backbutton',           
        	confirmCheckInBt : 'checkinconfirmation button[action=confirm-checkin]',
          //loungeview and tabs
          loungeview : 'lounge',
        	menuTab: 'menutab',
        	cartTab: 'carttab',
          settingsTab: 'settingstab',
          spotSelectionView : {
            selector: 'spotselection',
            xtype: 'spotselection',
            autoCreate: true
          }
          // demoButton: 'dashboard button[action=demo-checkin]'
    	},
    	control: {
    		checkInBtn: {
                tap: 'checkInIntent'
        },
        toVisitCheckInBtn: {
          tap: 'checkInIntent'
        },
        confirmCheckInBt: {
        	tap: 'confirmCheckInBtHandler'
        }, 
        cancelCheckInBt: {
        	tap: 'cancelCheckInBtHandler'
        },
        settingsBt: {
        	tap: 'showSettings'
        },
        nicknameSettingsField: {            	
        	change: 'saveNickname'
        },
        'clubarea clubdashboard' : {
          'tilesrendered' : function(dashboard) {
            this.activateWelcomeAndBasicMode(dashboard);
          },
          scope: this
        },
        cloobsterArea: {
          activate: 'cloobsterAreaActivated'
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
          loungeCtr = this.getApplication().getController('Lounge'),
          device;
    	
      //register event handlers
    	this.on({
        'statusChanged' : this.handleStatusChange,
        scope: this 
      });

      this.getApplication().on('statusChanged', function(status) {
        this.fireEvent('statusChanged', status);
      }, this);

    	messageCtr.on('eatSense.checkin', this.handleCheckInMessage, this);
      loungeCtr.on('areaswitched', function(area) {
        this.setActiveArea(area);
      }, this);

      Ext.Viewport.on({
        'checkinwithspot': function(spot) {
          this.setActiveSpot(spot);
          this.setActiveArea(spot.get('areaId'));
          this.checkInConfirm({model:spot, deviceId : appHelper.getDevice()});
        },
        'launchwithqrcode': function(qr) {
            this.launchwithqrcode(qr);
        },
        'democheckin' : function() {
          this.demoCheckIn();
        },
        scope: this
      });
    },
    /**
    * Activated event handler for cloobster area
    * @param {Ext.Container}
    *   the cloobster area
    */
    cloobsterAreaActivated: function(panel) {
      panel.switchTo(0);
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
      barcode = appHelper.scanBarcode(callback);

      function callback(barcode) {
        if(!barcode) {
         button.enable();
        } else {
          me.doCheckInIntent(barcode, button, deviceId);
        }
      }	
   },
   doCheckInIntent : function(barcode, button, deviceId) {         
      var me = this,
          main = this.getMain();
      //validate barcode field
      if(barcode.length == 0) {
        // Ext.Viewport.setMasked(false);
        if(button) {
          button.enable();  
        }
        
        Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('checkInErrorBarcode'), Ext.emptyFn);
      } else {
          appHelper.toggleMask('loadingMsg', main);
          //TODO 20130407 use loadSpot!
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
                // Ext.Viewport.setMasked(false);
                appHelper.toggleMask(false, main);
                if(button) {
                  button.enable();  
                }
              }
          });
      }
    },
   /**
    * CheckIn Process
    * Step 2: User gets asked if he wants to check in. He can then choose a nickname used during his checkIn.
    * @param options
    */
   checkInConfirm: function(options) {
	  var checkInDialog = this.getCheckinconfirmation(), 
		    cloobsterArea = this.getCloobsterArea(),
        nicknameToggle = this.getNicknameTogglefield(),
        nicknameField = this.getNickname(),
        nickname,
		    checkIn = Ext.create('EatSense.model.CheckIn'),
        accountCtr = this.getApplication().getController('Account'),
        profile = accountCtr.getProfile();

     nickname = this.loadNickname();
		
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

    this.activateWelcomeMode(options.model.get('welcome'));

    //user has to choose a nickname
    if(!nickname) {
      cloobsterArea.switchTo(checkInDialog, 'left');
    } else {
      //user already has a stored nickname
      this.checkIn(nickname);
    }
   },
   /**
   * Tap event handler for confirmCheckInBt
   *
   */
   confirmCheckInBtHandler: function(button) {
    this.checkIn();
   },
   /**
    * CheckIn Process
    * Step 3: User confirmed his wish to check in
    * @param {String} savedNickname
    */
   checkIn: function(savedNickname) {
	   var me = this,
	       nickname = savedNickname || Ext.String.trim(this.getNickname().getValue()),
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
        this.getActiveCheckIn().save({
				success: function(response) {                    
  					   	    console.log("CheckIn:checkIn: success");
                    appHelper.toggleMask(false);
                    //Set default headers so that always checkInId is send
                    headerUtil.addHeaders({
                      'checkInId' : response.get('userId'),
                      'pathId' : me.getActiveCheckIn().get('businessId')
                    });

                    me.fireEvent('statusChanged', appConstants.CHECKEDIN, me.getActiveCheckIn());
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
                //ATTENTION hide mask after loadBusiness
                // appHelper.toggleMask(false);
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
   * Request demo barcode from server and do a checkIn @ demo location.
   */
   demoCheckIn: function(button) {
    var me = this,
        device,
        deviceId;

    deviceId = (device) ? device.platform : 'desktop';

    Ext.Msg.show({
      message: i10n.translate('checkin.demo.msg'),
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
          doDemoCheckIn();
        }
      }
    });  

    function doDemoCheckIn() {
      // button.disable();
      Ext.Ajax.request({
        url: appConfig.serviceUrl + '/spots/',
        method: 'GET',
        // disableCaching: false,
        params: {
          'demo' : true
        },
        success: function(response) {
          me.doCheckInIntent(response.responseText, null, deviceId);
        },
        failure: function(response) {
          // button.enable();
          me.getApplication().handleServerError({
            'error': response 
            // 'message': i10n.translate('channelTokenError')
          });
        },
        scope: this
      });
    }
   },
   /**
   * CheckIn via given qrCode. Prompt user to trigger the normal checkIn process but skipping scanning
   * or add a toVisit.
   * @param {String} qrCode
   *  Code used for checkIn.
   */
   launchwithqrcode: function(qrCode) {
      var extractedCode,
          hideCheckInBtn = (this.getActiveCheckIn()) ? true : false;

      if(!qrCode) {
        console.error('CheckIn.launchwithqrcode: no qrCode given');
        return;
      }

      Ext.Msg.show({
        title: '',
        message: (hideCheckInBtn) ? i10n.translate('urlscheme.handle.visitonly') : i10n.translate('urlscheme.handle'),
        buttons: [{
          text: i10n.translate('urlscheme.checkin'),
          itemId: 'checkin',
          ui: 'action',
          hidden: hideCheckInBtn
        }, 
        {
          text: i10n.translate('urlscheme.tovisit'),
          itemId: 'tovisit',
          ui: 'action'
        },
        {
          text:  i10n.translate('cancel'),
          itemId: 'no',
          ui: 'action'
        }],
        scope: this,
        fn: function(btnId, value, opt) {
          //url scheme is cloobster://spot/spotID
          extractedCode = appHelper.extractBarcode(qrCode, 'spot/');
          if(btnId=='checkin') {            
            if(!this.getActiveCheckIn()) {
              this.doCheckInIntent(extractedCode, null, appHelper.getDevice());
            }          
          } else if(btnId == 'tovisit') {
            Ext.Viewport.fireEvent('addtovisit', extractedCode);
          }
        }
      });
    },
   /**
   * Returns the current nickname.
   * If user is logged in gets the nickname saved in the profile.
   * Otherwise tries to get the nickname from local storage.
   * @return
   *    Nickname or empty string if none is found.
   */
   loadNickname: function() {
    var savedNickname = "",
        accountCtr = this.getApplication().getController('Account'),
        profile = accountCtr.getProfile();

        if(accountCtr.isLoggedIn() && profile && profile.get('nickname') != null && Ext.String.trim(profile.get('nickname')) != '') {
            //restore from profile
            savedNickname = profile.get('nickname');
       } else if(this.getAppState().get('nickname') != null && Ext.String.trim(this.getAppState().get('nickname')) != '') {
            //restore from localstorage
            savedNickname = this.getAppState().get('nickname');
       } 

       return savedNickname;
   },
   /**
   * Cancel the check-in and jump back to dashboard.
   */
   cancelCheckInBtHandler: function(button) {
      var cloobsterArea = this.getCloobsterArea(),
          nicknameToggle = this.getNicknameTogglefield();
       
       this.setActiveCheckIn(null);
       cloobsterArea.switchTo(0);
       nicknameToggle.reset();
   },
   /**
   * Called from application mainLaunch. Create the mainview container.
   */
  initMainView: function() {

    Ext.create('EatSense.view.Lounge');
    Ext.Viewport.fireEvent('applaunched');
    this.checkFirstDashboardView(this.getAppState());
    this.genSkylineBg();
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
	 * This method is called from launch function during application start 
	 * when an existing checkin was found. This could happen when a user exits
	 * the application during a checkin and restarts.
	 * The method makes sure that all relevant information is restored like products in cart,
	 * or the active spot.
	 * 
	 * @param restoredCheckInId
	 * 		Id of checkIn to restore
	 */
	restoreState: function(restoredCheckInId) {
		var me = this,
        dashboard = this.getDashboard(),
        messageCtr = this.getApplication().getController('Message');

        headerUtil.addHeader('checkInId', restoredCheckInId);

        me.loadCheckIn(restoredCheckInId, processCheckIn); 

        

        //check retrieved checkin
        function processCheckIn(checkIn, success) {           
          
          if(success) {
            Ext.fly('appLoadingWrapper').destroy();
            Ext.create('EatSense.view.Lounge', {
              //directly select cloobster area
              firstSelect: 3
            });

            main = me.getMain();
            dashboard = main.down('clubdashboard');
            //mask gets removed after clubdashboard has been build or on error
            appHelper.toggleMask('restoreStateLoading', dashboard);

              me.setActiveCheckIn(checkIn);
              //occurs on reload of application before hitting leave button
              if(checkIn.get('status') == appConstants.PAYMENT_REQUEST || checkIn.get('status') == appConstants.COMPLETE || checkIn.get('status') == appConstants.WAS_INACTIVE) {
                    console.log('CheckIn.restoreState: processCheckIn failed: status '+checkIn.get('status')+'. Don\'t restore state!');
                    appHelper.toggleMask(false, dashboard);
                    main.selectByAction('show-dashboard');
                    me.handleStatusChange(appConstants.COMPLETE);
                    if(checkIn.get('status') == appConstants.WAS_INACTIVE) {
                      Ext.Msg.alert(i10n.translate('hint'), i10n.translate('checkin.restore.inactive'));  
                    }                    
                    return;
                }
            
              //Set default headers so that always checkInId is send
              headerUtil.addHeaders({
                'checkInId' : checkIn.get('userId'),
                'pathId' : checkIn.get('businessId')
              });
              //TODO 20130406 use loadSpot method
              // me.loadSpot(encodeURIComponent(checkIn.get('spotId'), doRestore)

            //load active spot
            EatSense.model.Spot.load(encodeURIComponent(checkIn.get('spotId')), {
              scope: me,
               success: function(record, operation) {                
                 me.setActiveSpot(record);
                 me.setActiveArea(record.get('areaId'));
                 me.activateWelcomeMode(record.get('welcome'));
                 me.loadBusiness(); 
                                          
                me.fireEvent('resumecheckin', me.getActiveCheckIn());

                me.fireEvent('statusChanged', appConstants.CHECKEDIN, me.getActiveCheckIn());

                 //open a channel for push messags
                 try {
                      messageCtr.openChannel(checkIn.get('userId'));
                  } catch(e) {
                      console.log('could not open a channel ' + e);
                  }
                },
                failure: function(record, operation) {
                  appHelper.toggleMask(false, dashboard);
                  me.handleStatusChange(appConstants.COMPLETE);
                  me.getApplication().handleServerError({
                          'error':operation.error
                  });               
                }
            });

          } else {
            //restore failed because checkin loading failed, load Method will show an error msg
            me.initMainView();
            headerUtil.resetHeaders(['checkInId']);
            me.getAppState().set('checkInId', '');
          }
        }

        //TODO 20130406 use loadSpot method, see further above
        // function doRestore(spot) {
        //   me.setActiveSpot(spot);
        //  me.setActiveArea(spot.get('areaId'));
        //  me.activateWelcomeMode(spot.get('welcome'));
        //  me.loadBusiness(); 
                  
        //   appHelper.toggleMask(false, main);
        //   me.fireEvent('resumecheckin', me.getActiveCheckIn());
        //   me.fireEvent('statusChanged', appConstants.CHECKEDIN, me.getActiveCheckIn());


        //  //open a channel for push messags
        //  try {
        //       messageCtr.openChannel(me.getActiveCheckIn().get('userId'));
        //   } catch(e) {
        //       console.log('could not open a channel ' + e);
        //   }
        // }

	},

  /**
  * Load a checkIn.
  * @param {String} checkInId
  * Id of checkIn to load
  * @param {Function} callback
  *  Called after load returns. Gets passed record on success and true/false as second param.
  */
  loadCheckIn: function(checkInId, callback) {
    var me = this;

     //reload old state
     EatSense.model.CheckIn.load(checkInId, {
      scope: this,
      success : function(record, operation) {
        // console.log('CheckIn.loadCheckIn: found existing checkin ' + record);
        callback(record, true);
      },
      failure: function(record, operation) {

        callback(null, false)

        me.getApplication().handleServerError({
          'error': operation.error,
          'forceLogout': false,
          'message' : {
            403: i10n.translate('restoreStateFailed'),
            404: i10n.translate('restoreStateFailed')
          }
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
        busines

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

        // appHelper.toggleMask(false);
      },
      failure: function(record, operation) {
        me.handleServerError({
          'error': operation.error
        });
      }
    });    
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
		console.log('CheckIn.handleStatusChange:' + ' new status '+status);
    var accountCtr = this.getApplication().getController('Account'),
        appState = this.getAppState(),
        spotStore = Ext.StoreManager.lookup('spotStore');

    appState.set('prevStatus', appState.get('status'));
    appState.set('status', status);

    try {
  		if(status == appConstants.CHECKEDIN) {

      }
  		else if(status == appConstants.PAYMENT_REQUEST) {	
  			this.getActiveCheckIn().set('status', status);
  		} else if (status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT || status == appConstants.WAS_INACTIVE) {
        // Ext.Viewport.fireEvent('showdashboard');

        this.setActiveCheckIn(null);		     

        //clear checkInId
        this.getAppState().set('checkInId', null);
        
        headerUtil.resetHeaders(['checkInId','pathId']);

        if(this.getActiveBusiness()) {
          this.getActiveBusiness().payments().each(function(pm) {
              pm.destroy();
            });
          this.getActiveBusiness().payments().removeAll(); 
          this.getActiveBusiness().destroy();
        }

        this.setActiveBusiness(null);

        if(this.getActiveSpot()) {
          this.getActiveSpot().destroy();  
        }
        
        this.setActiveSpot(null);

        this.setActiveArea(null);

        if(spotStore) {
          spotStore.each(function(spot) {
            spot.destroy();
          });

          spotStore.removeAll();
        }
        
        if(accountCtr.getAccount()) {
          //account can be null when no one is logged in
          accountCtr.getAccount().set('checkInId', null);  
        };
  		}

      if(status == appConstants.CANCEL_ALL) {
          Ext.Msg.alert(i10n.translate('hint'), i10n.translate('checkInCanceled'), Ext.emptyFn);
      }

    } catch(e) {
      console.error('CheckIn.handleStatusChange: failed ' + e);
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
       if(this.getActiveBusiness()) {
        this.activateBasicMode(this.getActiveBusiness().get('basic'), viewToSetMode); 
       }
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
  * Checks if the active spot is eligible for actions (order, vip call, feedback)
  * @return
  *     true if action is permitted
  */  
  checkActiveSpotEligibleForAction: function() {
    var activeSpot = this.getActiveSpot(),
        activeArea = this.getActiveArea();

    //TODO maybe enhance to define action types to be more granular

    //master spot is not allowed to do actions
    if(activeSpot.get('master') == true) {
        return false;
    }

    //welcome spots should have been deactivated in the first place!
    if(activeSpot.get('welcome') == true) {
        console.error('Order.checkActiveSpotEligibleForAction: welcome spot tried to execute an action');
        return false;
    }

    return true;
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
  * Ask user if he wants to switch the spot.
  * @param {Boolean} useActiveSpot (optional)
  *   if true, get area from active spot instead of using the active area
  */
  confirmSwitchSpot: function(useActiveSpot, onSwitch, onSwitchScope) {
    var me = this,
        activeSpot = this.getActiveSpot(),
        activeArea = this.getActiveArea(),
        areaStore = Ext.StoreManager.lookup('areaStore'),
        //used to store area temporary
        tmpArea,
        orderCtr = this.getApplication().getController('Order'),
        ordersTotal,
        spotSwitchMessage,
        barcodeRequired,
        ordersExist;

    if(useActiveSpot) {
        activeArea = areaStore.getById(activeSpot.get('areaId'));
    }

    if(!activeArea) {
      console.error('CheckIn.loadSpotsForActiveArea');
      return;
    };

      if(Ext.isNumber(activeArea)) {
        //if we only have an area id try to load the area object
        tmpArea = areaStore.getById(activeArea);
        if(tmpArea) {
            activeArea = tmpArea;
            barcodeRequired = activeArea.get('barcodeRequired');
        } else {
            barcodeRequired = true;
        }        
      } else {
        //already an area object
        barcodeRequired = activeArea.get('barcodeRequired');
      }

    //check if orders exist
    ordersExist = orderCtr.getMyordersCount() > 0;

    //if orders exist show alert and ask user to select payment method
    if(ordersExist) {
      ordersTotal = appHelper.formatPrice(orderCtr.calculateOrdersTotal(Ext.StoreManager.lookup('orderStore')), true);
      spotSwitchMessage = barcodeRequired ?
       i10n.translate('checkin.switchspot.orders.barcode', ordersTotal, activeSpot.get('areaName'), activeArea.get('name')) : 
       i10n.translate('checkin.switchspot.orders.list', ordersTotal, activeSpot.get('areaName'), activeArea.get('name'));

      Ext.Msg.show({
          title: i10n.translate('checkin.switchspot.msgtitle'),
          message: spotSwitchMessage,
          buttons: [{
            text: i10n.translate('checkin.switchspot.switch'),
            itemId: 'yes',
            ui: 'action'
          }, {
            text:  i10n.translate('checkin.switchspot.stay'),
            itemId: 'no',
            ui: 'action'
          }],
          scope: this,
          fn: function(btnId, value, opt) {
            if(btnId=='yes') {
              orderCtr.choosePaymentMethod(onChoose);
            }
          }
       }); 

      function onChoose(paymentMethod) {
        me.switchSpot({
            'area' : activeArea, 
            'ordersExist' : ordersExist, 
            'barcodeRequired' : barcodeRequired,
            'paymentMethod' : paymentMethod,
            'onSwitch' : onSwitch,
            'onSwitchScope' : onSwitchScope
        });
      }
    } else {
        //show special message depending on spot type
        if(!activeSpot.get('master')) {
          spotSwitchMessage = barcodeRequired ? i10n.translate('checkin.switchspot.barcode', activeSpot.get('areaName'), activeArea.get('name')) : 
          i10n.translate('checkin.switchspot.list', activeSpot.get('areaName'), activeArea.get('name'));
        } else {
          spotSwitchMessage = barcodeRequired ? i10n.translate('checkin.switchmasterspot.barcode', activeSpot.get('areaName'), activeArea.get('name')) : 
          i10n.translate('checkin.switchmasterspot.list', activeSpot.get('areaName'), activeArea.get('name'));
        }

        Ext.Msg.show({
          title: i10n.translate('checkin.switchspot.msgtitle'),
          message: spotSwitchMessage,
          buttons: [{
            text: i10n.translate('checkin.switchspot.switch'),
            itemId: 'yes',
            ui: 'action'
          }, {
            text:  i10n.translate('checkin.switchspot.stay'),
            itemId: 'no',
            ui: 'action'
          }],
          scope: this,
          fn: function(btnId, value, opt) {
            if(btnId=='yes') {
              me.switchSpot({
                'area' : activeArea, 
                'ordersExist' : ordersExist, 
                'barcodeRequired' : barcodeRequired,
                'onSwitch' : onSwitch,
                'onSwitchScope' : onSwitchScope
            });
            }
          }
       }); 
    }
  },
  /**
  * @private
  * Called after successful user confirm in CheckIn.confirmSwitchSpot.
  * @param {{area : EatSense.model.Area, ordersExist: Boolean, barcodeRequired: Boolean, paymentMethod : String}} options
  * options.area
  *   Gets passed the active area.
  * optionsordersExist
  *   if true then orders exist and we don't delete the checkin
  * options.paymentMethod
  *   Payment method to used to create bill when orders exist
  * options.barcodeRequired
  *     Indicates if a list of spots gets shown, or user has to scan the barcode
  *  options.onSwitch
  */
  switchSpot: function(options) {
    if(!options) {
        console.error('CheckIn.switchSpot: no options given');
    }

    var me = this,
        activeArea = options.area,
        barcodeRequired = options.barcodeRequired,
        paymentMethod = options.paymentMethod,
        ordersExist = options.ordersExist,
        activeCheckIn = this.getActiveCheckIn(),
        newCheckIn = Ext.create('EatSense.model.CheckIn'),
        appState = this.getAppState(),
        orderCtr = this.getApplication().getController('Order'),
        transientNickname;

      //get barcode or spot
      if(barcodeRequired) {
        //scan barcode
        appHelper.scanBarcode(doLoadSpot);
      } else {
        //or load spots
        this.showSpotSelection(activeArea, function(newSpot) {
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
        //false when user cancelled scanning
        if(barcode !== false) {
          me.loadSpot(barcode, function(newSpot) {
            checkAndFinalizeCheckIn(newSpot, doSwitch);
          });  
        }        
      }

      //verify switch, finalize checkin, returns true on success
      function checkAndFinalizeCheckIn(newSpot, onSuccess) {

        if(!newSpot) {
          console.error('CheckIn.switchSpot.checkAndFinalizeCheckIn: no spot given');
          return false;
        }

        //check business ids of new spot against old spot!
        if(newSpot.get('businessId') != me.getActiveSpot().get('businessId')) {
           Ext.Msg.alert(i10n.translate('checkin.switchspot.msgtitle'), i10n.translate('error.checkin.switchspot.businesses.mismatch'));
          return false;
        }

        //prevent switch to welcome spots
        if(newSpot.get('welcome') == true) {
          Ext.Msg.alert(i10n.translate('checkin.switchspot.msgtitle'), i10n.translate('error.checkin.switchspot.welcome'));
          return false;
        }

        //prevent switch to master spots
        if(newSpot.get('master') == true) {
          Ext.Msg.alert(i10n.translate('checkin.switchspot.msgtitle'), i10n.translate('error.checkin.switchspot.welcome'));
          return false;
        }

        //check that new spot belongs to selected area
        if(!me.checkActiveSpotInActiveArea(newSpot, activeArea)) {
          Ext.Msg.alert(i10n.translate('checkin.switchspot.msgtitle'), i10n.translate('error.checkin.switchspot.area.mismatch'));
          return false;
        }

        //temporarily store old transient nickname
        transientNickname = activeCheckIn.get('nickname');

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
        newCheckIn.set('nickname', me.loadNickname() || transientNickname);
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
        //execute onSwitch callback if exists
        if(appHelper.isFunction(options.onSwitch)) {
          if(options.onSwitchScope) {
            options.onSwitch.call(options.onSwitchScope);
          } else {
            options.onSwitch();  
          }
        }
        //notify controllers after everything has finished to refresh state where necessary
        //clean up orderstore, cart, badge texts ...
        me.fireEvent('spotswitched', me.getActiveSpot(), checkin);
      }
  },
  /**
  * Load a spot via given barcode. Does handles errors.
  * @param {String} barcode
  *   barcode identifiying spot
  * @param {Function} callback
  *   Executed on success. Gets spot as parameter.
  *
  */
  loadSpot: function(barcode, callback) {
    var me = this;

      if(!barcode || barcode.length == 0) {
        // Ext.Viewport.setMasked(false);
        Ext.Msg.alert(i10n.translate('errorTitle'), i10n.translate('checkInErrorBarcode'), Ext.emptyFn);
      } else {
          // appHelper.toggleMask('loadingMsg');

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
                // appHelper.toggleMask(false);
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
        searckKeyUpFn =  Ext.Function.createBuffered( filterSpotList, 50, this),
        androidCtr = this.getApplication().getController('Android');

    //register events
    backbutton = spotSelectionView.down('backbutton');
    searchField = spotSelectionView.down('searchfield');
    spotList = spotSelectionView.down('list');

    androidCtr.addBackFn(hideSpotSelectionView);

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

    spotSelectionView.on({
      painted: doLoadSpotsForAreas,
      scope: this
    });

    Ext.Viewport.add(spotSelectionView);
    spotSelectionView.show();

    function doLoadSpotsForAreas() {
      //load all spots
      this.loadSpotsForArea(area, refreshList);
    }

    function refreshList(success) {
      if(success && Ext.os.is.Android) {
        Ext.create('Ext.util.DelayedTask', function () {        
          spotList.refresh(); 
        }).delay(300);        
      }      
    }

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

      spotSelectionView.un({
        painted: doLoadSpotsForAreas,
        scope: this
      });

      androidCtr.removeBackFn(hideSpotSelectionView);

      clearSpotListFilter();
      spotSelectionView.hide();
    }

    //list select handler
    function onListSelect(list, record) {

      Ext.Msg.show({
        title: i10n.translate('checkin.switchspot.msgtitle'),
        message: i10n.translate('checkin.switchspot.confirmselected', record.get('name')),
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
            hideSpotSelectionView();

            clearSpotListFilter();
            if(appHelper.isFunction(onSelect)) {
              onSelect(record);
            }
          }
        }
      });  
    }

    //key up handler
    function searchFieldKeyupHandler(field) {
      searckKeyUpFn(field.getValue());
    }

    //filter spot list by given value
    function filterSpotList(value) {
      spotStore.clearFilter(true);
      spotStore.filter('name', value, true);
      spotList.refresh();
    }

    //clear the spot list filter
    function clearSpotListFilter() {
      spotStore.clearFilter();
      spotList.refresh();
    }    
  },
  /**
  * Load all spots for active area. Only if area does not require a barcode.
  * @param {EatSense.model.Area|Number} area or areaId
  * @param {Function} callback
  *   Called after ajax request returns. Gets passed true or false.
  */
  loadSpotsForArea: function(area, callback) {
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
          if(appHelper.isFunction(callback)) {
            callback(true);
          }
        }
        else {
          if(appHelper.isFunction(callback)) {
            callback(false);
          }
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
    var me = this,
        activeCheckIn = this.getActiveCheckIn();


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
   },
   /**
   * Checks if this is the first time user sees the dashboard.
   * Displays a helping text in an overlay.
   * @param {EatSense.model.AppState} appState
   *    Application state information.
   */
   checkFirstDashboardView: function(appState) {
    var helpPanel;

     if(appState.get('firstDashboardView')) { 
          //20130610 deactivated because help is directly displayed in tovisit list        
          // helpPanel = Ext.create('EatSense.view.DashboardHelp');
          // Ext.Viewport.add(helpPanel);
          appState.set('firstDashboardView', false);
        }
   },


    //end welcome and basic mode logic

    genSkylineBg: function(){

      var canvas,
          ctx,
          WIDTH = window.innerWidth,
          HEIGHT = window.innerHeight * .2;

      // canvas = this.getDashboard().down('#skylinecanvas');
      canvas = document.getElementById('skylinecanvas');
      if(!canvas) {
        return;
      }
      ctx = canvas.getContext('2d');
      

      var genSkyline = function(){
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        var maxWidth = WIDTH / 15;
        var minWidth = maxWidth / 10;
        var maxHeight = HEIGHT / 1.2; 
        var minHeight = maxHeight / 5;
        var amount = random(WIDTH/20,WIDTH/10);
              

        var pos = 0;
        while(pos < WIDTH + maxWidth){          
          var currWidth = random(minWidth,maxWidth),
              triangle = random(100, 0);

          drawSkyscraper(pos, currWidth, random(minHeight,maxHeight), triangle);
          pos += currWidth;
        }
      };
      var drawSkyscraper = function(pos,scraper_width,scraper_height, triangle){
        var rColor = '#31689C';// getRandomColor();

        ctx.beginPath();   
        ctx.rect(pos, HEIGHT-scraper_height,scraper_width, scraper_height);
        ctx.stroke();
        ctx.strokeStyle = rColor;
        ctx.fillStyle = rColor;
        ctx.fill();
        console.log('TRIANGLE ' + triangle);
        if(triangle < 20 && scraper_width > 5) {

          ctx.beginPath();
          // Start from the top-left point.
          ctx.moveTo(pos, HEIGHT-scraper_height); // give the (x,y) coordinates
          ctx.lineTo(pos + scraper_width, HEIGHT-scraper_height);
          ctx.lineTo(pos + scraper_width/2, HEIGHT-scraper_height - scraper_width/2);
          ctx.moveTo(pos, HEIGHT-scraper_height);
          ctx.strokeStyle = rColor;
          ctx.fillStyle = rColor;
          
          // Done! Now fill the shape, and draw the stroke.
          // Note: your shape will not be visible until you call any of the two methods.
          ctx.fill();
          ctx.stroke();
          ctx.closePath();

        }
      };

      var bindEventHandlers = function(){
        window.onresize = resize;
     canvas.addEventListener('click',genSkyline,false);
      };
      var resize = function(){
        canvas.width = WIDTH = window.innerWidth * .8;
        canvas.height = HEIGHT = window.innerHeight * .4;
        genSkyline();
      };

      var random = function(a,b) {
        return Math.random() * (b - a) + a;
      };

      function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
      }

    return color;
}

      genSkyline();
      // return {
      //   init : init
      // };
    }
});


