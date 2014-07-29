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
		currentStoreCard: null,

		// validTokens: //,
		/**
		* @accessor
		* 	Url to 3rd party service from zxing. Includes qr code size.
		*/
		zxingBarcodeServiceUrl: 'http://zxing.org/w/chart?cht=qr&chs=150x150&chl=',
		/**
		* @accessor
		* 	Url to custom barcode service hosted on aws.
		*/
		awsBarcodeServiceUrl: 'http://54.76.228.227:8080/BarcodeService/rest/barcodes'
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

		var scConfig = checkInCtr.getActiveBusiness().raw.configuration.storecard;

		me.getCurrentStoreCard().set('locationId', checkInCtr.getActiveBusiness().get('id'));

		//encode barcode if this is an existing store card
		// && me.getCurrentStoreCard().get('codeType')
		if(me.getCurrentStoreCard().get('cardNumber')) {
			me.encodeCustomerNumberAsBarcode(me.getCurrentStoreCard().get('cardNumber'), scConfig, qrCodeImageElement);
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
		
		//event handler functions
		function custNumberFieldHandler(field, newVal, oldVal) {
			if(newVal && newVal.trim().length && newVal != oldVal) {
				if(me.validateStoreCard(newVal, scConfig.validationPattern)) {
					me.getCurrentStoreCard().set('cardNumber', newVal);
					me.saveStoreCard(me.getCurrentStoreCard());
					me.encodeCustomerNumberAsBarcode(newVal, scConfig, qrCodeImageElement);	
				} else {
					field.setValue(oldVal);
					Ext.Msg.alert(i10n.translate(i10n.translate('storecard.error.invalid')));
						//TODO set old value
				}
				
			} else if(me.getCurrentStoreCard()){
				//if user removed his storecard number, delete it
				me.deleteStoreCard(me.getCurrentStoreCard(), function() {
					me.setCurrentStoreCard(null);
					qrCodeImageElement.element.setHtml("");
				});
			}
			
		}

		function scanBtHandler(button) {
			//scan code and set customer number
			appHelper.scanBarcode(function(code) {
				if(code) {
					custNumberField.setValue(code);
				}
			});
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

			scanBt.un({
				'tap': scanBtHandler,
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
	* Delete store card.
	* @param {EatSense.model.StoreCard} storeCard
	*	Store card to save.
	*/
	deleteStoreCard: function(storeCard, callback) {
		var me = this;

		if(!storeCard) {
			console.log('StoreCard.deleteStoreCard: no storeCard given');
			return;
		}

		storeCard.erase({
			success: function() {
				callback();				
			},
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
	* Check if user entered card number is valid
	*
	*/
	validateStoreCard: function(code, validationPattern) {
		var regexp;

		if(!code) {
			return false;
		}

		if(!validationPattern) {
			return false;
		}

		regexp = new RegExp(validationPattern);

		return code.match(regexp);
	},


	/**
	* Encode and display barcode. 
	* @param {String} code
	* 	Data to encode
	* @param {Object} config
	*	StoreCard configuration
	* @param {Ext.Element} element
	*	Element where to display barcode.
	*
	*/
	encodeCustomerNumberAsBarcode: function(code, config, element) {

		var me = this,
			tmpl,
			type = config.barcodeType,
			validationPattern = config.validationPattern,
			url = config.urlTemplate;

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

		// switch(type) {
		// 	case "qr":
		// 	//Use 3rd party zxing server
		// 	url = me.getZxingBarcodeServiceUrl();
		// 	tmpl = new Ext.XTemplate(
		// 		'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="{url}{content}">'
		// 	);
		// 	break;

		// 	default:
		// 	url = me.getAwsBarcodeServiceUrl();		
		// 	//otherwise always use BarcodeService on AWS e.g. code39
		// 	tmpl = new Ext.XTemplate(
		// 		'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="{url}/{type}/{content}">'
		// 	);

		// 	break;			

		// 	// default:
		// 	// 	tmpl = new Ext.XTemplate(
		// 	// 		'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="http://zxing.org/w/chart?cht=qr&chs=150x150&chl={content}">'
		// 	// 	);
		// 	// break;
		// }		
	

		tmpl = new Ext.XTemplate(
			'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="auto" src="' + url + '">'
		);		

		tmpl.overwrite(element.element, {
			'url': url,
			'content' : code,
			'type' : type
		});

	}

});