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
		},
		/**
		* @accessor
		* 	The current store card, that belongs to active location.
		*/
		currentStoreCard: null
	},

	launch: function() {
		var me = this;

        Ext.Viewport.on('userlogin', loadStoreCards, this);

        //refresh settings upon login
        function loadStoreCards(account) {
            //.down('#settingCards')
            me.loadStoreCards(account);
        } 
	},

	storeCardShowHandler: function(area) {
		var me = this,
			view,
			checkInCtr = this.getApplication().getController('CheckIn'),
			store,
			//fields
			custNumberField,
			qrTypeRadiofields;

		view = Ext.create('EatSense.view.storecard.StoreCard');		

		area.add(view);
		area.setActiveItem(0);

		custNumberField = view.down('textfield[name=customerNumber]');
		qrTypeRadiofields = view.down('radiofield[name=qrtype]');

		area.on({
			'hide': cleanup,
			scope: this
		});

		custNumberField.on({
			'change': custNumberFieldHandler,
			scope: this
		});

		store = Ext.StoreManager.lookup('storeCardStore');
		
		store.each(function(sc) {
			if(sc.get('locationId') == checkInCtr.getActiveBusiness().get('id')) {
				me.setCurrentStoreCard(sc);
				return false;
			}
		});

		if(!me.getCurrentStoreCard()) {
			me.setCurrentStoreCard(Ext.create('EatSense.model.StoreCard'));
		}

		me.getCurrentStoreCard().set('locationId', checkInCtr.getActiveBusiness().get('id'));

		function custNumberFieldHandler(field, newVal, oldVal) {
			me.getCurrentStoreCard().set('cardNumber', newVal);
			me.saveStoreCard(me.getCurrentStoreCard());
		}

		function cleanup() {

			area.un({
				'hide': cleanup,
				scope: this
			});

			custNumberField.un({
				'change': custNumberFieldHandler,
				scope: this
			});

			me.setCurrentStoreCard(null);

			area.remove(view);
			view.destroy();
		}
	},

	storeCardHideHandler: function(panel) {

	},

	saveStoreCard: function(storeCard) {
		// var storeCard = this.getCurrentStoreCard();

		if(!storeCard) {
			console.log('StoreCard.saveStoreCard: no storeCard given');
			return;
		}

		storeCard.save();

	},

	/**
	* Load account's store cards.
	* @param {EatSense.model.Account} account
	*	Account to load store cards for.
	*/
	loadStoreCards: function(account) {
		var store;

		if(!account) {
			console.log('StoreCard.loadStoreCards: no account given');
			//TODO show homescreen
			return;
		}

		//TODO add error handling if load fails and hide store card menu item?

		store = Ext.StoreManager.lookup('storeCardStore');
		store.load({
			params: {
				'accountId' : account.get('id')
			}
		});


	}

});