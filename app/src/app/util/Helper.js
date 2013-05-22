Ext.define('EatSense.util.Helper', {
	requires: ['EatSense.util.Constants', 'EatSense.util.Configuration'],
	alternateClassName: ['appHelper'],
	requires: [],
	singleton: true,

	config: {
		alertActive: false
	},

  /** 
   * Optains a barcode. In development (desktop, iPhone simulator) mode, shows a prompt, otherwise opens
   * the barcode scanner plugin.
   * 
   * @param {Function} callback
   *  Called after completion/cancelation of scanning. Gets passed the barcode as parameter.
   *  barcode is false when user cancelled
   */
   scanBarcode: function(callback) {
      var me = this,
      	  os = Ext.os.deviceType.toLowerCase(),
          barcode;

      if(os == 'desktop' || !window.plugins || !window.plugins.barcodeScanner || (device && device.platform == "iPhone Simulator")) {
            Ext.Msg.show({
                // title: i10n.translate('barcodePromptTitle'),
                message: i10n.translate('barcodePromptText'),
                buttons: [{
                    text: i10n.translate('yes'),
                    itemId: 'yes',
                    ui: 'action'
                }, {
                    text: i10n.translate('no'),
                    itemId: 'no',
                    ui: 'action'
                }],
                prompt : { maxlength : 50},
                scope: this,
                fn: function(btnId, value, opt) {
                    if(btnId=='yes') {
                        barcode = encodeURIComponent(Ext.String.trim(value));
                    } else {
                      barcode = false;
                    }

                    if(Ext.isFunction(callback)) {
                      callback(barcode);
                    }
                }
            }); 
      } else if(os == 'phone' || os == 'tablet') {
          window.plugins.barcodeScanner.scan(function(result) {
            if(!result.cancelled) {
              barcode =  encodeURIComponent(Ext.String.trim(me.extractBarcode(result.text)));
            } else {
              barcode = false;
            }
            if(Ext.isFunction(callback)) {
              callback(barcode);
            }
        }, function(error) {
          Ext.Msg.alert("Scanning failed: " + error, Ext.emptyFn);
        });
      }
   },

	/**
	 * Shortens the given string (like substring). 
	 * 
	 * @param text
	 * 		Text to shorten
	 * @param length
	 * 		Length of returned string.
	 * @param appendDots
	 * 		Append 3 dots at the end. E. g. "Beef Burg..."
	 * @returns
	 * 		shortened string
	 */
	shorten : function(text, length, appendDots) {
		var _textLength = text.trim().length;
		if(_textLength > length) {
			return text.substring(0, length) + ((appendDots === true) ? "..." : "");
		} else {
			return text;
		}			
	},
	/**
	*	Checks if the given argument is of type function.
	*
	*/
	isFunction: function(functionToCheck) {
	 	var getType = {};
	 	return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
	},
	/**
	*	Checks if the given argument is of type Array.
	*
	*/
	isArray: function(functionToCheck) {
	 	var getType = {};
	 	return functionToCheck && getType.toString.call(functionToCheck) == '[object Array]';
	},
	/**
	*	Rounds a price to number of given decimals.
	*	@param price
	*		Price to round
	*	@param decimal
	*		number of decimals, defaults to 2	
	*/
	roundPrice: function(price, decimal) {
		var 	_decimal = (decimal) ? decimal : 2,
				_factor = Math.pow(10, _decimal),
				_result;

		_result = Math.round(price*_factor)/_factor;

		return _result;
	},
	/**
	*	Takes a price and formats it in the configured currency
	*	@param price
	*		price to format
	*	@param returnZero
	*		True to return a zero formatted string when price is 0 = 0,00-€
	*/
	formatPrice: function(price, returnZero) {
		var 	priceRegExp = /([0123456789]+)\.([0123456789]*)/,
				fixedPrice,
				matcher = appConstants.Currency[appConfig.currencyFormat],
				formattedPrice = "";

		//don't show a price of 0 && price == null
		if(!price && !returnZero) { 
			return "";
		}		

		try {
			fixedPrice = price.toFixed(2);
			formattedPrice = fixedPrice.replace(priceRegExp, matcher);
		} catch(e) {
			console.log('price formatting failed reason:' + e);
		}


		return (formattedPrice != "") ? formattedPrice : price;
	},

	/**
	* True to indicate that an alert message is active.
	* Can be used to prevent automatic message box hiding.
	*/
	toggleAlertActive: function(active) {
		this.setAlertActive(active);
	},
	/**
	* Show hide loading mask on viewport to prevent user actions and show an ongoing progress.
	* @param messageKey
	*	If messagekey is of type string, shows the loading mask with the given message. Otherwise hides the mask.
	*/
	toggleMask: function(messageKey, view) {
		var viewToMask = view || Ext.Viewport;

	    if(typeof messageKey == "string") {
	      viewToMask.setMasked({
	        xtype: 'loadmask',
	        message: i10n.translate(messageKey)
	      });
	    } else {
	      viewToMask.setMasked(false);
	    };
  	},

  	/**
	* Displays a non modal messagebox at the bottom of the screen.
	* @param {String} message to display
	* @param {number} timeout (optional)
	*	Hide after given timeout
	* 
	*/
	showNotificationBox: function(message, timeout) {
		var me = this,
			msgBox,
			hideAfter = timeout || appConfig.msgboxHideLongTimeout,
			config = {
				modal: false,
				centered: false,
				style: {
					'max-width' : 'none'
				},
				bottom: '10px',
				right: '3%',
				left: '3%',
				'message' : message,	
				buttons: []
			};


		msgBox = Ext.create('Ext.MessageBox', config);
		msgBox.show();

		Ext.defer(function() {
			hideActivationHint();
		}, hideAfter, this);


		function hideActivationHint() {
			if(!EatSense.util.Helper.getAlertActive()) {
				msgBox.destroy();
			}
		};
	},
  	/**
  	* Iterate over an object and sysout its properties.
  	* @param {Object} obj
  	*	Object to sysout
  	*/
  	debugObject: function(obj) {
  		if(!obj) {
  			return;
  		}

  		try {
	  		for (var key in obj) {
			  if (obj.hasOwnProperty(key)) {
			  	console.log(key + ' -> ' + obj[key]);
			  }
			}
  		} catch(e) {
  			console.error('EatSense.util.Helper.debugObject: failed to debug object ' + e);
  		}

  	}
});