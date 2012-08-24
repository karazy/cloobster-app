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

	showHistory: function(button) {
		var mainView = this.getMainView(),
			historyView = this.getHistoryView();

			mainView.switchAnim('left');
			mainView.setActiveItem(historyView);

			this.loadHistory();
	},


   showDashboard: function(options) {
	   var dashboardView = this.getDashboard(),
	       mainView = this.getMainView(),
	       historyView = this.getHistoryView();	 
	   
	   	mainView.switchAnim('right');
	   	mainView.setActiveItem(dashboardView);
   },

   loadHistory: function() {
   		var historyStore = Ext.StoreManager.lookup('historyStore'),
   			historyList = this.getHistoryList();

   		historyStore.loadPage(1);

   		historyList.refresh();

   },

   //start history detail

   showHistoryDetail: function(view, index, htmlElement, history) {
   		var mainView = this.getMainView(),
   			historyDetailView = this.getHistoryDetailView(),
   			header = historyDetailView.down('#header'),
   			footer = historyDetailView.down('#footer');

   		//setTitle() doesn't work for Sencha 2.0.0
   		// historyDetailView.config.title = history.get('businessName');
   		// historyView.push(historyDetailView);

   		header.getTpl().overwrite(header.element, history.getData());
   		footer.getTpl().overwrite(footer.element, history.getData());

   		this.loadHistoryOrders(history);

   		mainView.switchAnim('left');
		mainView.setActiveItem(historyDetailView);

		
   },

   backToHistory: function(button) {
   		var mainView = this.getMainView(),
   		historyView = this.getHistoryView();
   		mainView.switchAnim('right');
		mainView.setActiveItem(historyView);
   },

   loadHistoryOrders: function(history) {
   		var	list = this.getHistoryDetailOrderList();
   		console.log('load history for checkInId ' + history.get('checkInId'));

   		list.getStore().removeAll();

   		list.getStore().load({
   			params: {
   				'pathId' : history.get('businessId'),
   				'checkInId' : history.get('checkInId'),
   				'status' : appConstants.Order.COMPLETE
   			},
   			callback: function(records, operation, success) {
   				if(success) {
   					Ext.Array.each(records, function(order) {
   						//TODO remove maybe later and store calculated price in backend
   						order.calculate();
   					});
   					list.refresh();
   				}
   			}
   		});
   }

   //end history detail

});