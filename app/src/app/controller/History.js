/**
* Controller handles user history of visited locations.
* 
*/
Ext.define('EatSense.controller.History', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.History'],

	config: {
		refs: {
			mainView : 'mainview',
			dashboard : 'mainview dashboard',
			historyView : 'mainview history',
			historyList : 'mainview history list',
			backButton : 'history button[action=back]',
			backDetailButton : 'historydetail button[action=back]',
			showHistoryButton: 'dashboard button[action=history]',
			// historyDetailView: {
			// 	selector: 'historydetail',
			// 	xtype: 'historydetail',
			// 	autoCreate: true
			// },
			historyDetailView: 'mainview historydetail',
			historyDetailOrderList : 'historydetail #historyOrders'
		},
		control: {
			showHistoryButton : {
				tap: 'showHistory'
			},
			backButton : {
				tap: 'showDashboard'
			},
			backDetailButton: {
				tap: 'backToHistory'
			},
			historyList : {
				itemtap : 'showHistoryDetail'
			}
		}
	},	
	/**
	* Event handler for history button.
	* Shows the history view.
	*/
	showHistory: function(button) {
		var me = this,
          mainView = this.getMainView(),
			 historyView = this.getHistoryView(),
          loggedIn = this.getApplication().getController('Account').isLoggedIn(),
          androidCtr = this.getApplication().getController('Android');

         //if user has no account or is not logged in show alert window
         if(!loggedIn) {
            Ext.Msg.alert(i10n.translate('hint'), i10n.translate('history.noaccount'));
         } else {
            //show history view
            mainView.switchAnim('left');
            mainView.setActiveItem(historyView);
            androidCtr.addBackHandler(function(){
               me.showDashboard();
            });
            this.loadHistory();
         }
	},

	/**
	* Jump back to dashboard.
	*/
   showDashboard: function(options) {
	   var dashboardView = this.getDashboard(),
	       mainView = this.getMainView(),
	       historyView = this.getHistoryView();	 
	     
         //also this method can be called from different points, we can savely remove the handler it is always the last
         this.getApplication().getController('Android').removeLastBackHandler();
	   	mainView.switchAnim('right');
	   	mainView.setActiveItem(dashboardView);
   },
   /**
   * Loads the history for logged in user.
   * History will be stored in historyStore.
   */
   loadHistory: function() {
   		var me = this,
             historyStore = Ext.StoreManager.lookup('historyStore'),
   			 historyList = this.getHistoryList();

   		historyStore.loadPage(1, {
   			callback: function(records, operation, success) {
   				if(!success) {
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

   		historyList.refresh();

   },

   //start history detail
   /**
   * Tap event handler for history list.
   * Loads all orders assigned to selected history element and shows them in a detail view.
   */
   showHistoryDetail: function(view, index, htmlElement, history) {
   		var me = this,
             mainView = this.getMainView(),
   			 historyDetailView = this.getHistoryDetailView(),
   			 header = historyDetailView.down('#header'),
   			 footer = historyDetailView.down('#footer'),
             androidCtr = this.getApplication().getController('Android');

   		header.getTpl().overwrite(header.element, history.getData());
   		footer.getTpl().overwrite(footer.element, history.getData());

   		this.loadHistoryOrders(history);

         androidCtr.addBackHandler(function(){
            me.backToHistory();
         });
   		mainView.switchAnim('left');
		   mainView.setActiveItem(historyDetailView);
   },
   /**
   * Event handler for back button tap in history detail view.
   */
   backToHistoryButton: function(button) {
      this.backToHistory();
      this.getApplication().getController('Android').removeLastBackHandler();
   },
   /**
   * Jump back to history overview.
   */
   backToHistory: function() {
   	var mainView = this.getMainView(),
   		historyView = this.getHistoryView();
   		mainView.switchAnim('right');
		      
      mainView.setActiveItem(historyView);
   },
   /**
   * Loads all orders for given history.
   * @param history
   *	History to load orders for.
   */
   loadHistoryOrders: function(history) {
   		var	me = this,
   			list = this.getHistoryDetailOrderList();
   		console.log('load history for checkInId ' + history.get('checkInId'));

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
   						//TODO remove maybe later and store calculated price in backend
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