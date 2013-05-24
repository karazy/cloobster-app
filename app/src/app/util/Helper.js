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
   * @private
   * Expects a url with a barcode at the end. Separated by a #.
   * e. g. https://cloobster.com/get-app#ENCRYPTED_BARCODE
   * @return the extracted barcode
   */
   extractBarcode: function(url) {
    var indexHashTag = url.indexOf('#') + 1,
        code;

    try {
      code = (indexHashTag > -1) ?  url.substring(indexHashTag, url.length) : url;
    } catch(e) {
      console.log('Error extracting code: ' + e);
      code = url;
    }

    console.log('Code extracted ' + code + ' from ' +url);

    return code;
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
	* Returns device. e.g. iOS, Android, desktop
	*/
	getDevice: function() {
		var device;

		return (device) ? device.platform : 'desktop';
	},
	/**
	*
	*/
	takePicture: function(callback) {

		if(!navigator.camera) {
			console.error('Helper.takePicture: no camera');
			return;
		}

		navigator.camera.getPicture( cameraSuccess, cameraError, {
			 destinationType: Camera.DestinationType.FILE_URI,
			 quality: 49, //because of some iOS memory problems when higher then 50
			 saveToPhotoAlbum: true //save image and let user delete it manually
		});

		function cameraSuccess(imageUri) {
			callback(true, imageUri);
		}

		function cameraError() {
			callback(false);
		}
	},
	/**
	* Uploads an image to google blobstore.
	* @param {String} fileURI 
	*	url to local file from camera
	* @param {Function} callback
	* 	gets passed true|false depending on success and blob Url
	*/
	uploadImage: function(fileURI, callback) {
		var me = this,
			fileUploadUrl,
			ft;
		//1. Get fileUploadUrl /uploads/imagesurl
		//2. do upload

		if(typeof FileTransfer == 'undefined') {
			console.error('Helper.uploadImage: no FileTransfer exists. Not running in a phonegap environment.');
			return;
		}


		Ext.Ajax.request({
			url: appConfig.serviceUrl + '/uploads/imagesurl',
			method: 'GET',
			success: function(response, operation) {
				fileUploadUrl = encodeURI(response.responseText);
				console.log('Helper.uploadImage: to ' + fileUploadUrl);
				doUpload();
			}, 
			failure: function(response, operation) {
				callback(false);
				me.getApplication().handleServerError({
               	'error': response
             	});
			},
			scope: this
		});

		function doUpload() {
			var options = new FileUploadOptions(),
				ft = new FileTransfer();

            // options.fileKey="file";
            options.fileName='tovisit.jpg';
            // options.mimeType="image/jpeg";

			ft.upload(fileURI, fileUploadUrl, success, error, options);
		}

		function success(response) {
			console.log("Helper.uploadImage: response " + response.response);
			me.debugObject(response);
			me.debugObject(response.response);
			var imageObj = Ext.JSON.decode(response.response);
			callback(true, imageObj);
		}

		function error(error) {
			console.error("Helper.uploadImage: upload error source " + error.source);
            console.error("Helper.uploadImage: upload error target " + error.target);
			callback(false);
		}
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