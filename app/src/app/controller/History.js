/**
* Controller handles user history of visited locations.
* 
*/
Ext.define('EatSense.controller.History', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.History'],

	config: {
		refs: {
			mainView : 'lounge',
         placesOverview: 'placesoverview',
			dashboard : 'lounge dashboard',
			historyView : 'lounge history',
			historyList : 'lounge history list',
			backButton : 'history button[action=back]',
			backDetailButton : 'historydetail button[action=back]',
			showHistoryButton: 'dashboard button[action=history]',			
			historyDetailView: 'lounge historydetail',
			historyDetailOrderList : 'historydetail #historyOrders'
		},
		control: {
         mainView: {
            show: 'initHistory'
         },
			showHistoryButton : {
				tap: 'showHistoryButtonHandler'
			},
			backButton : {
				tap: 'showDashboard'
			},
			backDetailButton: {
				tap: 'backToHistory'
			},
			historyList : {
				itemtap : 'showHistoryDetail'
			},
         placesOverview: {
            show: 'showHistory'
         }
		}
	},	

   /**
   * Does some initialization stuff after main container is shown.
   */
   initHistory: function() {
      var me = this,
          mainView = this.getMainView(),
          historyItem;


      if(mainView) {
         historyItem = mainView.getItemByAction('show-places');

         if(historyItem) {
            historyItem.raw.preCondition = function() {
               //add login check to item
               return me.promptForLogin();
            }
         }
      }
   },

   /**
   * If user is not logged in, shows login prompt.
   * @return
   *  true if user is logged in, false otherwise
   */
   promptForLogin: function() {
      var loggedIn = this.getApplication().getController('Account').isLoggedIn();

      Ext.Viewport.fireEvent('accountrequired', function(success) {
         return success;
      });
       //if user has no account or is not logged in show alert window
      // if(!loggedIn) {

      //    Ext.Msg.show({
      //       message: i10n.translate('history.noaccount'),
      //       buttons: [{
      //          text: i10n.translate('account.register.yes'),
      //          itemId: 'yes',
      //          ui: 'action'
      //       }, {
      //          text:  i10n.translate('account.register.no'),
      //          itemId: 'no',
      //          ui: 'action'
      //       }],
      //       scope: this,
      //       fn: function(btnId, value, opt) {
      //       if(btnId=='yes') {
      //             this.getApplication().getController('Account').showLoginView();
      //          }
      //       }
      //    }); 
      //    return false; 
      // }

      // return true;
   },
   /**
   * Tap eventhandler for show places button.
   * @param {Ext.Button} button
   *  Button from tap event
   */
   showHistoryButtonHandler: function(button) {
      var mainView = this.getMainView();

      mainView.selectByAction('show-places');
   },
	/**
	* Event handler for history button.
	* Shows the history view.
	*/
	showHistory: function(button) {
		var me = this,
          // mainView = this.getMainView(),
          placesOverview,
			 historyView = this.getHistoryView(),
          loggedIn = this.getApplication().getController('Account').isLoggedIn();

         //if user has no account or is not logged in show alert window
         // if(!loggedIn) {

         //    Ext.Msg.show({
         //       message: i10n.translate('history.noaccount'),
         //       buttons: [{
         //          text: i10n.translate('account.register.yes'),
         //          itemId: 'yes',
         //          ui: 'action'
         //       }, {
         //          text:  i10n.translate('account.register.no'),
         //          itemId: 'no',
         //          ui: 'action'
         //       }],
         //       scope: this,
         //       fn: function(btnId, value, opt) {
         //       if(btnId=='yes') {
         //             this.getApplication().getController('Account').showLoginView();
         //          }
         //       }
         //    });   
         // } else {
            //show history view            
            // mainView.selectByAction('show-places');

            placesOverview = this.getPlacesOverview();
            if(!placesOverview) {
               console.error('History.showHistory: placesOverview does not exist, maybe has not been created?');
               return;
            }

            placesOverview.switchTo(historyView);
            this.loadHistory();

         // }
	},

	/**
	* Jump back to dashboard.
	*/
   showDashboard: function(options) {
	   var mainView = this.getMainView(),
	       historyView = this.getHistoryView(),
          historyList = this.getHistoryList();
	     
	   	// mainView.switchTo(dashboardView, 'right');

         mainView.selectByAction('show-dashboard');

         historyList.deselectAll();
   },
   /**
   * Loads the history for logged in user.
   * History will be stored in historyStore.
   */
   loadHistory: function() {
   		var me = this,
             historyStore = Ext.StoreManager.lookup('historyStore'),
   			 historyList = this.getHistoryList(),
             descPanel = this.getHistoryView().down('#historyListDescPanel');

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

   	mainView.switchTo(historyView, 'right');      
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
   }

   //end history detail

});