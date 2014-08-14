/**
* StoreCard related logic. Mainly CRUD
* This controller omits Sencha REST logic and uses pure Ext.Ajax functionality.
* Purpose of this approach is to test whether this is easier and stable compared to Sencha functionality.
*/
Ext.define('EatSense.controller.StoreCard', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.view.storecard.StoreCard'],
	config: {
		refs: {
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

		//deprecated
        // Ext.Viewport.on('userlogin', loadStoreCards, this);        

        // function loadStoreCards(account) {
        //     me.loadStoreCards(account);
        // } 
	},

	storeCardShowHandler: function(area) {
		var me = this,
			view,
			checkInCtr = this.getApplication().getController('CheckIn'),
			store,
			custNumberField,
			scConfig,
			qrCodeImageElement,
			activeLocationId,
			scanBt;

		view = Ext.create('EatSense.view.storecard.StoreCard');		

		area.add(view);
		area.setActiveItem(0);

		//get elements
		custNumberField = view.down('textfield[name=customerNumber]');

		qrCodeImageElement = view.down('#generatedQr');
		scanBt = view.down('button[action=scan-barcode]');

		//set up store card object
		// store = Ext.StoreManager.lookup('storeCardStore');
		
		// store.each(function(sc) {
		// 	if(sc.get('locationId') == checkInCtr.getActiveBusiness().get('id')) {
		// 		me.setCurrentStoreCard(sc);
		// 		return false;
		// 	}
		// });
	
		scConfig = checkInCtr.getActiveBusiness().raw.configuration.storecard;	
		activeLocationId = checkInCtr.getActiveBusiness().get('id');

		me.loadStoreCardByLocationId(activeLocationId, function(success, sc) {
			if(success) {
				me.setCurrentStoreCard(sc);
				//encode barcode if this is an existing store card
				if(me.getCurrentStoreCard().cardNumber) {
					me.encodeCustomerNumberAsBarcode(me.getCurrentStoreCard().cardNumber, scConfig, qrCodeImageElement);
					//set data before registering events
					custNumberField.setValue(me.getCurrentStoreCard().cardNumber);
				}
			} else if(!success) {
				me.setupStoreCard(activeLocationId);
			}			
		}); 				


		//register events
		area.on({
			'hide': cleanup,
			scope: this
		});

		//call after field set

		custNumberField.on({
			'change': custNumberFieldHandler,
			scope: this
		});

		scanBt.on({
			'tap': scanBtHandler,
			scope: this
		});

		me.on('storecardchanged', storeCardChangedHandler, me);
		
		//event handler functions
		function custNumberFieldHandler(field, newVal, oldVal) {
			if(newVal && newVal.trim().length && newVal != oldVal) {
				if(me.validateStoreCard(newVal, scConfig.validationPattern)) {
					me.getCurrentStoreCard().cardNumber = newVal;
					me.saveStoreCard(me.getCurrentStoreCard(), function(success, storeCard) {
						me.setCurrentStoreCard(storeCard);
						// store.add(me.getCurrentStoreCard());
						// me.fireEvent('storecardchanged', me.getCurrentStoreCard());
						me.encodeCustomerNumberAsBarcode(newVal, scConfig, qrCodeImageElement);	
					});					
				} else {
					// field.setValue(oldVal);
					Ext.Msg.alert('',i10n.translate(i10n.translate('storecard.error.invalidpattern')));
				}
				
			} else if(me.getCurrentStoreCard()){
				//if user removed his storecard number, delete it
				me.deleteStoreCard(me.getCurrentStoreCard(), function() {
					// store.remove(me.getCurrentStoreCard());
					me.setCurrentStoreCard(null);
					me.setupStoreCard(activeLocationId);
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

		function storeCardChangedHandler(code) {
			encodeCustomerNumberAsBarcode(code, scConfig, qrCodeImageElement);
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

			me.un('storecardchanged', storeCardChangedHandler, me);

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
	saveStoreCard: function(storeCard, callback) {
		var me = this,
			saveUrl,
			httpMethod,
			accountCtr = this.getApplication().getController('Account');

		if(!storeCard) {
			console.log('StoreCard.saveStoreCard: no storeCard given');
			return;
		}

		if(storeCard.id) {
			//existing storecard
			httpMethod = 'PUT';
			saveUrl = appConfig.serviceUrl + '/c/accounts/' + accountCtr.getAccount().get('id') + '/storecards/' + storeCard.id;
		} else {
			//new storecard
			httpMethod = 'POST';
			saveUrl = appConfig.serviceUrl + '/c/accounts/' + accountCtr.getAccount().get('id') + '/storecards';
		}

		Ext.Ajax.request({
			url: saveUrl,
			method: httpMethod,
			jsonData: storeCard,
			success: function(response) {
				var sc = Ext.JSON.decode(response.responseText);
				if(appHelper.isFunction(callback)) {
					callback(true, sc);	
				}	
			},
			failure: function(response) {
				callback(false);
				me.getApplication().handleServerError({
					'error': response
				});
			}
		});

		// storeCard.save({
		// 	success: function(response, operation) {
		// 		if(appHelper.isFunction(callback)) {
		// 			callback();	
		// 		}				
		// 	},
	 //        failure: function(response, operation) {
	 //            me.getApplication().handleServerError({
	 //              'error': operation.error,
	 //              'forceLogout':{403 : true}
	 //    	    }); 
	 //        }
	 //    });
	},

	loadStoreCardByLocationId: function(locationId, callback) {
		var accountCtr = this.getApplication().getController('Account');

		//TODO add possibility to load by ID
		if(!appHelper.isFunction(callback)) {
			console.error('StoreCard.loadStoreCardByLocationId: no callback');
			return;
		}

		Ext.Ajax.request({
			url: appConfig.serviceUrl + '/c/accounts/' + accountCtr.getAccount().get('id') + '/storecards',
			method: 'GET',
			params: {
				'locationId' : locationId
			},
			success: function(response) {
				var sc = Ext.JSON.decode(response.responseText);
				if(Ext.isArray(sc)) {
					//service returns an array because we query the whole collection
					sc = sc[0];
				}				
				callback(true, sc);
			},
			failure: function(response) {
				if(response.status != 404) {
					me.getApplication().handleServerError({
    					'error': response
    				});
				} else {
					callback(false);
				}				
			}
		});
	},

	/**
	* Delete store card.
	* @param {EatSense.model.StoreCard} storeCard
	*	Store card to save.
	*/
	deleteStoreCard: function(storeCard, callback) {
		var me = this,
			accountCtr = this.getApplication().getController('Account');

		if(!storeCard) {
			console.log('StoreCard.deleteStoreCard: no storeCard given');
			return;
		}

		Ext.Ajax.request({
			url: appConfig.serviceUrl + '/c/accounts/' + accountCtr.getAccount().get('id') + '/storecards/'+storeCard.id,
			method: 'DELETE',
			success: function(response) {
				if(appHelper.isFunction(callback)) {
					callback();	
				}
			},
			failure: function(response) {
				if(response.status != 404) {
					me.getApplication().handleServerError({
    					'error': response
    				});
				} else {
					callback(false);
				}
			}
		});

		// storeCard.erase({
		// 	success: function() {
		// 		if(appHelper.isFunction(callback)) {
		// 			callback();	
		// 		}
		// 	},
	 //        failure: function(response, operation) {
	 //            me.getApplication().handleServerError({
	 //              'error': operation.error,
	 //              'forceLogout':{403 : true}
	 //    	    }); 
	 //        }
	 //    });
	},

	/**
	* Creates a new storeCard if not exists and sets currentLocation Id.
	*
	*/
	setupStoreCard: function(activeLocationId) {
		// var checkInCtr = this.getApplication().getController('CheckIn');

		// if(!this.getCurrentStoreCard()) {
		// 	this.setCurrentStoreCard(Ext.create('EatSense.model.StoreCard'));
		// }

		this.setCurrentStoreCard({
			'id': '',
			'locationId': activeLocationId,
			'cardNumber' : ''
		});

		// this.getCurrentStoreCard().set('locationId', checkInCtr.getActiveBusiness().get('id'));
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
	* Check if user entered card number is valid.
	* @param{String} code
	*	Code to check
	* @param{String} validationPattern
	*	Regex used to check code.
	* @return
	*	True if valid, false otherwise. Also returns true when no pattern is provided.
	*
	*/
	validateStoreCard: function(code, validationPattern) {
		var regexp;

		if(!code) {
			return false;
		}

		if(!validationPattern) {
			return true;
		}

		regexp = new RegExp(validationPattern);

		return code.match(regexp);
	},



	storeCardChangedHandler: function(code) {
		var scConfig = checkInCtr.getActiveBusiness().raw.configuration.storecard;

		encodeCustomerNumberAsBarcode(code, scConfig, element);
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

		if(!type || type == 'none') {
			console.log('StoreCard.encodeCustomerNumber: no type given');
			element.element.setHtml("");
			return;
		} 

		if(!element) {
			console.log('StoreCard.encodeCustomerNumber: no element given');
			return;
		}

		tmpl = new Ext.XTemplate(
			'<img style="margin-left: auto; margin-right: auto; display: block; width: auto; max-width: 100%;" height="100%" src="' + url + '">'
		);		

		tmpl.overwrite(element.element, {
			'url': url,
			'content' : encodeURIComponent(code),
			'type' : type
		});

	}

});