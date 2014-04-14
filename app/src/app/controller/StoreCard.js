/**
* StoreCard related logic.
*
*/
Ext.define('EatSense.controller.StoreCard', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.storecard.StoreCard'],
	config: {
		refs: {
			// eventsArea : 'slidenavcontainer[action=show-ztix-events]',
			storecardContainer: 'slidenavcontainer[action=show-storecard]'
		},
		control: {
			storecardContainer: {
				show: 'storeCardShowHandler',
				hide: 'storeCardHideHandler'
			}
		}
	},

	launch: function() {
		var me = this,
            // checkInCtr = this.getApplication().getController('CheckIn'),
            accountCtr = this.getApplication().getController('Account');

        accountCtr.on('userlogin', loadStoreCards, this);

        //refresh settings upon login
        function loadStoreCards(account) {
            //.down('#settingCards')
            me.loadStoreCards(account);
        } 
	},

	storeCardShowHandler: function(panel) {

	},

	storeCardHideHandler: function(panel) {

	}

	loadStoreCards: function(account) {
		var store;

		if(!account) {
			console.log('StoreCard.loadStoreCards: no account given');
			//TODO show homescreen
			return;
		}

		store = Ext.StoreManager.lookup('storeCardStore');		
		store.load({
			params: {
				'accountId' : account.get('id')
			}
		});


	}

});