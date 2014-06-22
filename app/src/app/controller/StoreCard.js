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
			qrCodeImageElement,
			scanBt;

		view = Ext.create('EatSense.view.storecard.StoreCard');		

		area.add(view);
		area.setActiveItem(0);

		//get elements
		custNumberField = view.down('textfield[name=customerNumber]');

		qrCodeImageElement = view.down('#generatedQr');
		scanBt = view.down('button[action=scan-barcode]');

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

		var barcodeType = checkInCtr.getActiveBusiness().raw.configuration.storecard.barcodeType;

		me.getCurrentStoreCard().set('locationId', checkInCtr.getActiveBusiness().get('id'));

		//encode barcode if this is an existing store card
		// && me.getCurrentStoreCard().get('codeType')
		if(me.getCurrentStoreCard().get('cardNumber')) {
			me.encodeCustomerNumberAsBarcode(me.getCurrentStoreCard().get('cardNumber'), barcodeType, qrCodeImageElement);
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

		scanBt.on({
			'tap': scanBtHandler,
			scope: this
		});

		// view.on({
		// 	'delegate' : 'radiofield[name=qrtype]',
		// 	'check': qrTypeRadiofieldsHandler,
		// 	scope: this
		// });
		
		//event handler functions
		function custNumberFieldHandler(field, newVal, oldVal) {
			me.getCurrentStoreCard().set('cardNumber', newVal);
			me.saveStoreCard(me.getCurrentStoreCard());
			me.encodeCustomerNumberAsBarcode(newVal, barcodeType, qrCodeImageElement);
		}

		function scanBtHandler(button) {
			//scan code and set customer number
			appHelper.scanBarcode(function(code) {
				if(code) {
					custNumberField.setValue(code);
				}
			});
		}

		// function qrTypeRadiofieldsHandler(chkBox) {
		// 	var cN = me.getCurrentStoreCard().get('cardNumber'),
		// 		type = chkBox.getValue();

		// 	me.getCurrentStoreCard().set('codeType', type);

		// 	//only save if a cardNumber has been issued
		// 	if(cN && cN.length > 0) {
		// 		me.saveStoreCard(me.getCurrentStoreCard());
		// 		me.encodeCustomerNumberAsBarcode(cN, type, qrCodeImageElement);
		// 	}
		// }

		function cleanup() {

			area.un({
				'hide': cleanup,
				scope: this
			});

			custNumberField.un({
				'change': custNumberFieldHandler,
				scope: this
			});

			scanBt.un({
				'tap': scanBtHandler,
				scope: this
			});

			// view.un({
			// 	'delegate' : 'radiofield[name=qrtype]',
			// 	'check': qrTypeRadiofieldsHandler,
			// 	scope: this
			// });

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
	* Encode and display barcode. 
	* @param {String} code
	* 	Data to encode
	* @param {String} type
	*	Barcode type
	* @param {Ext.Element} element
	*	Element where to display barcode.
	*
	*/
	encodeCustomerNumberAsBarcode: function(code, type, element) {

		var tmpl,
			url;

		if(!code) {
			console.log('StoreCard.encodeCustomerNumber: no code given');
			return;
		}

		if(!type) {
			console.log('StoreCard.encodeCustomerNumber: no type given');
			return;
		}

		if(!element) {
			console.log('StoreCard.encodeCustomerNumber: no element given');
			return;
		}

		switch(type) {
			case "qr":
			//Use 3rd party zxing server
			tmpl = new Ext.XTemplate(
				'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="http://zxing.org/w/chart?cht=qr&chs=150x150&chl={content}">'
			);
			break;

			case "code39":
			//access BarcodeService on AWS
			tmpl = new Ext.XTemplate(
				'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="http://54.72.245.119:8080/BarcodeService/rest/barcodes/{type}/{content}">'
			);

			break;			

			default:
				tmpl = new Ext.XTemplate(
					'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="http://zxing.org/w/chart?cht=qr&chs=150x150&chl={content}">'
				);
			break;
		}		

		// tmpl = new Ext.XTemplate(
		// 	'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="res/images/kundenkarte_code39.png">'
		// );			

		tmpl.overwrite(element.element, {
			'content' : code,
			'type' : type
		});

	}

});