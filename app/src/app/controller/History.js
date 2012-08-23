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
			showHistoryButton: 'dashboard button[action=history]',
			historyDetailView: {
				selector: 'historydetail',
				xtype: 'historydetail',
				autoCreate: true
			}
		},
		control: {
			showHistoryButton : {
				tap: 'showHistory'
			},
			backButton : {
				tap: 'showDashboard'
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

	   /**
    * CheckIn Process
    * Step 2 alt: cancel process
    */
   showDashboard: function(options) {
	   var dashboardView = this.getDashboard(),
	       mainView = this.getMainView();	 
	   	   
	   mainView.switchAnim('right');
	   mainView.setActiveItem(dashboardView);
   },

   loadHistory: function() {
   		var historyStore = Ext.StoreManager.lookup('historyStore'),
   			historyList = this.getHistoryList();

   		historyStore.load();

   		historyList.refresh();

   },

   showHistoryDetail: function(view, index, htmlElement, history) {
   		var historyView = this.getHistoryView(),
   			historyDetailView = this.getHistoryDetailView();

   		//setTitle() doesn't work for Sencha 2.0.0
   		historyDetailView.config.title = history.get('businessName');

   		historyView.push(historyDetailView);
   }

});