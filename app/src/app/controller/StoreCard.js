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
				show: 'storeCardShowHandler'
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

        function loadStoreCards(account) {
            me.loadStoreCards(account);
        } 
	},

	storeCardShowHandler: function(area) {
		var me = this,
			view,
			checkInCtr = this.getApplication().getController('CheckIn'),
			store,
			custNumberField,
			qrTypeRadiofields;

		view = Ext.create('EatSense.view.storecard.StoreCard');		

		area.add(view);
		area.setActiveItem(0);

		//get elements
		custNumberField = view.down('textfield[name=customerNumber]');

		//set up store card object
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

		//encode barcode if this is an existing store card
		if(me.getCurrentStoreCard().get('cardNumber') && me.getCurrentStoreCard().get('codeType')) {
			me.encodeCustomerNumberAsBarcode(me.getCurrentStoreCard().get('cardNumber'), me.getCurrentStoreCard().get('codeType'));
		}

		//set data before registering events
		custNumberField.setValue(me.getCurrentStoreCard().get('cardNumber'));


		//register events
		area.on({
			'hide': cleanup,
			scope: this
		});

		custNumberField.on({
			'change': custNumberFieldHandler,
			scope: this
		});

		view.on({
			'delegate' : 'radiofield[name=qrtype]',
			'check': qrTypeRadiofieldsHandler,
			scope: this
		});
		
		//event handler functions
		function custNumberFieldHandler(field, newVal, oldVal) {
			me.getCurrentStoreCard().set('cardNumber', newVal);
			me.saveStoreCard(me.getCurrentStoreCard());
		}

		function qrTypeRadiofieldsHandler(chkBox) {
			var cN = me.getCurrentStoreCard().get('cardNumber'),
				type = chkBox.getValue();

			me.getCurrentStoreCard().set('codeType', type);

			//only save if a cardNumber has been issued
			if(cN && cN.length > 0) {
				me.saveStoreCard(me.getCurrentStoreCard());
				me.encodeCustomerNumberAsBarcode(cN, type);
			}
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

			view.un({
				'delegate' : 'radiofield[name=qrtype]',
				'check': qrTypeRadiofieldsHandler,
				scope: this
			});

			me.setCurrentStoreCard(null);

			area.remove(view);
			view.destroy();
		}
	},


	/**
	* Save or update store card.
	* @param {EatSense.model.StoreCard} storeCard
	*	Store card to save.
	*/
	saveStoreCard: function(storeCard) {
		var me = this;

		if(!storeCard) {
			console.log('StoreCard.saveStoreCard: no storeCard given');
			return;
		}

		storeCard.save({
	        failure: function(response, operation) {
	            me.getApplication().handleServerError({
	              'error': operation.error,
	              'forceLogout':{403 : true}
	    	    }); 
	        }
	    });
	},

	/**
	* Load account's store cards.
	* @param {EatSense.model.Account} account
	*	Account to load store cards for.
	*/
	loadStoreCards: function(account) {
		var me = this,
			store;

		if(!account) {
			console.log('StoreCard.loadStoreCards: no account given');
			//TODO show homescreen
			return;
		}

		store = Ext.StoreManager.lookup('storeCardStore');
		store.load({
			params: {
				'accountId' : account.get('id')
			},
			callback: function(response, operation) {
				if(operation.error) {
		            me.getApplication().handleServerError({
		              'error': operation.error,
		              'forceLogout':{403 : true}
		    	    }); 
	        	}
	        }
		});
	},

	/**
	*
	*
	*
	*/
	encodeCustomerNumberAsBarcode: function(code, type) {

		if(!code) {
			console.log('StoreCard.encodeCustomerNumber: no code given');
			return;
		}

		appHelper.encodeBarcode(code, type, function(success, image) {
			if(success) {
				console.log('StoreCard.encodeCustomerNumberAsBarcode: success');
				appHelper.debugObject(success);
				appHelper.debugObject(image);
				
			} else {
				appHelper.showNotificationBox(i10n.translate('storecard.error.encoding'));
			}
		});
	}

});