/**
* Controller handles user history of visited locations.
* 
*/
Ext.define('EatSense.controller.History', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.History', 'EatSense.view.VisitNew'],

	config: {
		refs: {
			mainView : 'lounge',
         placesOverview: 'placesoverview',
			dashboard : 'lounge dashboard',
			historyView : 'lounge history',
			historyList : 'lounge history list',
			backDetailButton : 'historydetail button[action=back]',
			// showHistoryButton: 'dashboard button[action=history]',
         toVisitButton: 'dashboard button[action=tovisit]',
			historyDetailView: 'lounge historydetail',
			historyDetailOrderList : 'historydetail #historyOrders',
         toVisitNewView: {
            selector: 'visitnew',
            xtype: 'visitnew',
            autoCreate: true
         }
		},
		control: {
			// showHistoryButton : {
			// 	tap: 'showHistoryButtonHandler'
			// },
         toVisitButton: {
            tap: 'promptForToVisitAction'
         },
			backDetailButton: {
				tap: 'backToHistory'
			},
			historyList : {
				itemtap : 'showHistoryDetail'
			},
         placesOverview: {
            show: 'showHistory',
            hide: 'hidePlaces'
         }
		}
	},	
   launch: function() {

      Ext.Viewport.on('userlogin', function(account) {
         this.loadVisits();
      }, this);

      //ToDo clear list on logout
   },
   /**
   * Tap eventhandler for show places button.
   * @param {Ext.Button} button
   *  Button from tap event
   */
   // showHistoryButtonHandler: function(button) {
   //    var mainView = this.getMainView();

   //    mainView.selectByAction('show-places');
   // },   
	/**
	* Event handler for history button.
	* Shows the history view.
	*/
	showHistory: function(button) {
		var me = this,
          placesOverview,
			 historyView = this.getHistoryView(),
          loggedIn = this.getApplication().getController('Account').isLoggedIn();

         // show history view    
         placesOverview = this.getPlacesOverview();
         if(!placesOverview) {
            console.error('History.showHistory: placesOverview does not exist, maybe has not been created?');
            return;
         }

         placesOverview.switchTo(historyView);

         //if user has no account or is not logged in show alert window
         //this already gets handled before
         if(!loggedIn) {
            Ext.Msg.show({
               message: i10n.translate('account.required'),
               buttons: [{
                  text: i10n.translate('ok'),
                  itemId: 'yes',
                  ui: 'action'
               }],
               scope: this
            });
         } 
         else {    
            //delay for faster rendering and prevent android from not showing the list on first access
            Ext.create('Ext.util.DelayedTask', function () {
               me.loadHistory();
            }).delay(300);                          
            
         }
	},

   /**
   * Hide event handler.
   * @param {Ext.Panel} placesOverview
   *  placesOverview throwing the hide event.
   */
   hidePlaces: function(placesOverview) {
      var historyList;

      if(!placesOverview) {
         console.error('History.hidePlaces: no placesOverview given');
         return;
      }

      historyList = placesOverview.down('history list');

      if(!historyList) {
         console.error('History.hidePlaces: no historyList not found');
         return;  
      }

       historyList.deselectAll();
   },

	/**
	* Jump back to dashboard.
	*/
   // showDashboard: function(options) {
	  //  var mainView = this.getMainView(),
   //        historyList = this.getHistoryList();

   //       mainView.selectByAction('show-dashboard');

   //       historyList.deselectAll();
   // },
   /**
   * Loads the history for logged in user.
   * History will be stored in historyStore.
   */
   loadHistory: function() {
   		var me = this,
             historyStore = Ext.StoreManager.lookup('historyStore'),
   			 historyList = this.getHistoryList(),
             descPanel = this.getHistoryView().down('#historyListDescPanel');

         console.log('History.loadHistory');

   		historyStore.loadPage(1, {
   			callback: function(records, operation, success) {
   				if(operation.error) {
   					me.getApplication().handleServerError({
							'error': operation.error,
							//accessToken invalid
							'userLogout': {403: true}
					   });

                  if(operation.error.status == 403) {
                     me.showDashboard();
                  }
   				} else {
                  if(records.length == 0) {
                     //show description when empty
                     descPanel.setHidden(false);
                     historyList.setHidden(true);
                  } else {
                     descPanel.setHidden(true);
                     historyList.setHidden(false);
                     historyList.refresh();               
                     
                  }
               }
   			}
   		});   		

   },

   //start history detail
   /**
   * Tap event handler for history list.
   * Loads all orders assigned to selected history element and shows them in a detail view.
   */
   showHistoryDetail: function(view, index, htmlElement, history) {
   		var me = this,
             placesOverview = this.getPlacesOverview(),
   			 historyDetailView,
   			 header,
   			 footer;

         historyDetailView = placesOverview.down('historydetail');

         if(!historyDetailView) {
            console.log('History.showHistoryDetail: historyDetailView not found');
            return;
         }

         header = historyDetailView.down('#header');
         footer = historyDetailView.down('#footer');

   		header.getTpl().overwrite(header.element, history.getData());
   		footer.getTpl().overwrite(footer.element, history.getData());

   		this.loadHistoryOrders(history);


   		placesOverview.switchTo(historyDetailView, 'left');
   },
   /**
   * Event handler for back button tap in history detail view.
   */
   backToHistoryButton: function(button) {
      this.backToHistory();
   },
   /**
   * Jump back to history overview.
   */
   backToHistory: function() {
   	var placesOverview = this.getPlacesOverview(),
   		 historyView = this.getHistoryView();

   	placesOverview.switchTo(historyView, 'right');      
   },
   /**
   * Loads all orders for given history.
   * @param history
   *	History to load orders for.
   */
   loadHistoryOrders: function(history) {
   		var me = this,
   			 list = this.getHistoryDetailOrderList();

         if(!history) {
            console.error('History.loadHistoryOrders: no history given');
            return;
         }

   		list.getStore().removeAll();

   		list.getStore().load({
   			params: {
   				'pathId' : history.get('businessId'),
   				'checkInId' : history.getId(),
   				'status' : appConstants.Order.COMPLETE
   			},
   			callback: function(records, operation, success) {
   				if(success) {
   					Ext.Array.each(records, function(order) {
   						order.calculate();
   					});
   					list.refresh();
   				} else {
   					me.getApplication().handleServerError({
							'error': operation.error,
							//accessToken invalid
							'userLogout': {403: true}
					   });

                  if(operation.error.status == 403) {
                     me.showDashboard();
                  }
   				}
   			}
   		});
   },

   //end history detail
   /**
   * Ask user if he wants to scan an existing cloobster lcoation or
   * add location details manually.
   * Requires a logged in user!
   *
   */
   promptForToVisitAction: function() {
      var me = this;
      
      Ext.Viewport.fireEvent('accountrequired', prompt);

      function prompt(success) {

         if(success) {
            Ext.Msg.show({
               message: i10n.translate('tovisit.actionprompt'),
               buttons: [
               {
                  text: i10n.translate('cancel'),
                  itemId: 'cancel',
                  ui: 'action'
               },
               {
                  text: i10n.translate('tovisit.action.scan'),
                  itemId: 'scan',
                  ui: 'action'
               }, {
                  text:  i10n.translate('tovisit.action.manual'),
                  itemId: 'manual',
                  ui: 'action'
               }],
               scope: me,
               fn: function(btnId, value, opt) {
                  if(btnId=='scan') {
                     //scan
                  } else if(btnId == 'manual') {
                     //manual
                     me.showToVisitNewView();
                  }
               }
            });
         }
      }    
   },

   showToVisitNewView: function() {
      var me = this,
          lounge =  this.getMainView(),
          view = this.getToVisitNewView(),
          form,
          backBt,
          createBt,
          // datePicker,
          gmap,
          values,
          toVisit,
          locationNameField,
          geoPos,
          visitStore = Ext.StoreManager.lookup('visitStore');;

      Ext.Viewport.add(view);
      // lounge.getContainer().add(view);
      view.show();

      //access position, async function
      this.getCurrentPosition(processPosition);

      form = view.down('formpanel');
      backBt = view.down('backbutton');
      createBt = view.down('button[action=create]');
      gmap = form.down('map');
      locationNameField = form.down('textfield[name=locationName]');
      // datePicker = form.down('datepickerfield');

      // if(datePicker) {

      // }

      //TODO add android backFn

      backBt.on({
         tap: cleanup,
         scope: this
      });

      createBt.on({
         tap: createToVisit,
         scope: this
      });

      view.on({
         hide: cleanup,
         scope: this
      });

      function createToVisit() {
         //TODO Validate

         //validate
         values = form.getValues();

         if(!values.locationName || values.locationName.trim().length == 0) {
            Ext.Msg.alert('', i10n.translate('tovisit.form.locationname.required'));
            return;
         }

         //create
         toVisit = Ext.create('EatSense.model.Visit', values);

         if(geoPos) {
            toVisit.set('geoLong', geoPos.coords.longitude);
            toVisit.set('geoLat', geoPos.coords.latitude);
         }

         if(values.visitDate) {
            toVisit.set('visitDate', values.visitDate.getTime());
         }

         appHelper.toggleMask('save', view);

         toVisit.setId('');

         //FR ST2-1 Bug in Writer.js with a null pointer in L.92, explicitly set time
         // toVisit.set('visitDate', date);

         toVisit.save({

            success: function(record, operation) {               
               appHelper.toggleMask(false, view);
               cleanup();
               visitStore.add(record);
            },
            failure: function(record, operation) {
               appHelper.toggleMask(false, view);
               me.getApplication().handleServerError({
                  'error': operation.error,
                  'forceLogout': {403: true}
               });
            },
            scope: this
         });

      }

      function processPosition(success, position) {
         if(success) {
            geoPos = position;

            var myLatlng = new google.maps.LatLng(geoPos.coords.latitude, geoPos.coords.longitude);
            gmap.getMap().setZoom(14);
            gmap.getMap().setCenter(myLatlng);            

               var marker = new google.maps.Marker({
                  map: gmap.getMap(),
                  position: myLatlng
               });   
         } else {
            //error, position contains error information
         }
      }

      function cleanup() {
         backBt.un({
            tap: cleanup,
            scope: this
         });  

         view.un({
            hide: cleanup,
            scope: this
         });   

         view.destroy();    
      }

   },
   /**
   * Load visits for logged in user.
   */
   loadVisits: function(account) {
      var visitStore = Ext.StoreManager.lookup('visitStore');

      //TODO error handling
      if(visitStore) {
         visitStore.load(); 
      }

   },

   /**
   * Get current coords. Async function.
   * @see http://docs.phonegap.com/en/2.7.0/cordova_geolocation_geolocation.md.html#Geolocation
   * @param {Function} callback
   *  Called with true and position on success, false and error otherwise.
   */
   getCurrentPosition: function(callback) {

      if(!appHelper.isFunction(callback)) {
         console.error('History.getCurrentPosition: no callback provided');
         return;
      }

      // onSuccess Callback
      //   This method accepts a `Position` object, which contains
      //   the current GPS coordinates
      //
      function onSuccess(position) {
         callback(true, position);
      }

      // onError Callback receives a PositionError object
      function onError(error) {         
         callback(false, error);
      }

      if(navigator && navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(onSuccess, onError);   
      } else {
         console.error('History.getCurrentPosition: no navigator.geolocation exists');
      }
      
   }

});