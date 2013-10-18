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
   * Expects a url with a barcode at the end. Separated by a # or given seperator.
   * e. g. https://cloobster.com/get-app#ENCRYPTED_BARCODE
   * @param {String} url
   * @param {String} seperator (optional)
   * @return the extracted barcode or url if nothing found
   */
   extractBarcode: function(url, seperator) {
    var _seperator = seperator || '#',
    	indexHashTag = url.indexOf(_seperator) + _seperator.length,
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
		//remove toolbar because it takes ob unused space!
		msgBox.remove(msgBox.down('toolbar'));
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
			 quality: 49 //because of some iOS memory problems when higher then 50
			 // saveToPhotoAlbum: true //save image and let user delete it manually
		});

		function cameraSuccess(imageUri) {
			callback(true, imageUri);
		}

		function cameraError(error) {
			console.log('Helper.takePicture: cameraError ' + error);
			if(error.trim() == 'no image selected') {
				callback(true);
			} else {
				callback(false);	
			}			
		}
	},
	/**
	* Uploads an image to google blobstore.
	* @param {String} fileURI 
	*	url to local file from camera
	* @param {String} picId
	*	Identifier used to save the picture, gets appended a time in ms
	* @param {Function} callback
	* 	gets passed true|false depending on success and blob Url
	*/
	uploadImage: function(fileURI, picId, callback) {
		var me = this,
			fileUploadUrl,
			ft;
		//1. Get fileUploadUrl /uploads/imagesurl
		//2. do upload

		if(typeof FileTransfer == 'undefined') {
			console.error('Helper.uploadImage: no FileTransfer exists. Not running in a phonegap environment.');
			return;
		}

		console.log('Helper.uploadImage');


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

			console.log('Helper.uploadImage: doUpload');

            // options.fileKey="file";
            options.fileName=picId+'_'+(new Date()).getTime()+'.jpg';
            // options.mimeType="image/jpeg";

			ft.upload(fileURI, fileUploadUrl, success, failure, options);
		}

		function success(response) {
			console.log("Helper.uploadImage: success");
			me.debugObject(response);
			var imageObj = Ext.JSON.decode(response.response);
			callback(true, imageObj);
		}

		function failure(err) {			
			console.error("Helper.uploadImage: upload error source " + err.source);
            console.error("Helper.uploadImage: upload error target " + err.target);			
            callback(false);
		}
	},
	/**
	* Deletes given file from filesystem.
	* @param {String} fileToDelete
	* @param {Function} callback
	*/
	deleteFile: function(fileToDelete, callback) {
		var hasCallback = this.isFunction(callback);

		if(!fileToDelete) {
			console.error('EatSense.util.Helper.deleteFile: no file given');
			return;
		}

		console.log('EatSense.util.Helper.deleteFile: ' + fileToDelete);

		window.resolveLocalFileSystemURI(fileToDelete, fileFound, fail);

		function fail(evt) { 
		    console.log("EatSense.util.Helper.deleteFile: fail " + evt.target.error.code); 
		    if(hasCallback) {
				callback(false);
			}
		} 

		function fileFound(fileEntry) {
			console.log('EatSense.util.Helper.deleteFile: fileFound');
			fileEntry.remove(function() {
				if(hasCallback) {
					callback(true);
				}
			}, function(fileError) {
				if(hasCallback) {
					callback(false);
				}
			});

			/*
			FileError.NOT_FOUND_ERR
			FileError.SECURITY_ERR
			FileError.ABORT_ERR
			FileError.NOT_READABLE_ERR
			FileError.ENCODING_ERR
			FileError.NO_MODIFICATION_ALLOWED_ERR
			FileError.INVALID_STATE_ERR
			FileError.SYNTAX_ERR
			FileError.INVALID_MODIFICATION_ERR
			FileError.QUOTA_EXCEEDED_ERR
			FileError.TYPE_MISMATCH_ERR
			FileError.PATH_EXISTS_ERR
			*/
		}
	},
	/**
	* Returns a formatted address based on data in given business.
	* @param {Object} business data
	*	Used to get address data.
	* @return the formatted addressm empty string if non given
	*/
	formatBusinessAddress: function(business) {
		var formattedAddress = '';

		if(!business) {
			return '';
		}

		formattedAddress = business.address;
	    if(business.postcode) {
	       formattedAddress += (formattedAddress.length > 0) ? ', ' + business.postcode : business.postcode;
	    }
	    if(business.city) {
	       formattedAddress += (formattedAddress.length > 0 && !business.postcode) ? ', ' + business.city : ' ' + business.city;
	    }

	    return formattedAddress;
	},
  /**
   * Set a marker on a googleMap, based on given position.
   * @return the created Marker
   */
   setMapMarker: function(position, gmap, markerToClear) {
      var geoPos = position,
         myLatlng;

      if(!geoPos) {
         return;
      }

      if(!gmap) {
         return;
      }

      if(markerToClear) {
         markerToClear.setMap(null);
      }

      myLatlng = new google.maps.LatLng(geoPos.latitude, geoPos.longitude);

      gmap.getMap().setZoom(16);
      gmap.getMap().setCenter(myLatlng);           

      var marker = new google.maps.Marker({
         map: gmap.getMap(),
         position: myLatlng
      });

      //#613 for ios
  //     Ext.create('Ext.util.DelayedTask', function () {
		// gmap.getMap().panTo(myLatlng);
	 //  }, this).delay(100); 

      return marker;
   },
   /**
   * Get current coords. Async function.
   * @see http://docs.phonegap.com/en/2.7.0/cordova_geolocation_geolocation.md.html#Geolocation
   * @param {Function} callback
   *  Called with true and position on success, false and error otherwise.
   */
   getCurrentPosition: function(callback) {
      if(!appHelper.isFunction(callback)) {
         console.error('History.getCurrentPosition: no callback provided');
         return;
      }

      // onSuccess Callback
      //   This method accepts a `Position` object, which contains
      //   the current GPS coordinates
      //
      function onSuccess(position) {
         callback(true, position);
      }

      // onError Callback receives a PositionError object
      function onError(error) {     
         callback(false, error);
      }

      if(navigator && navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(onSuccess, onError,
            {maximumAge: Infinity, timeout: 20000, enableHighAccuracy:true});   
      } else {
         callback(false);
         console.error('History.getCurrentPosition: no navigator.geolocation exists');
      }      
   },
   /**
   * Centers given map to germany.
   * @param {Ext.Map} gmap
   */
   centerMapOnGermany: function(gmap) {
      var myLatlng = new google.maps.LatLng(51.165, 10.455278);

      gmap.getMap().setZoom(4);
      gmap.getMap().setCenter(myLatlng); 
   },

   /**
   * Checks if given URL is valid. An url is considered valid when it starts with http://
   * or https://. If url is not valid, will append an http://
   * @param {String} urlToCheck
   * @return checked and validated url. Empty String if non provided.
   *
   */
   createValidUrl: function(urlToCheck) {
   	var validUrl = urlToCheck || '';


	if(urlToCheck && urlToCheck.trim().length > 0) {
		//if url does not start with http or https add it
		if(urlToCheck.indexOf('http://')  < 0 && urlToCheck.indexOf('https://') < 0) {
			validUrl = 'http://' + urlToCheck;
		}
	}

	return validUrl;
   },
   /**
   * Looks for a elements and forces to open them in a seperate window.
   * @param {Ext.dom.Element} element
   */
   redirectUrls: function(element) {
   		if(!element) {
   			return;
   		}

   		try {
   			Ext.Array.each(element.query('a'), function(lnk) {				    		
	    		lnk.addEventListener("click",function(e){
		        	e.preventDefault();
		        	window.open(lnk.href, '_system');									        	
		        });
			});         			
		} catch(e) {
			console.error('EatSense.util.Helper.redirectUrls: failed');
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

  		console.log('EatSense.util.Helper.debugObject');

  		try {
	  		for (var key in obj) {
			  if (obj.hasOwnProperty(key)) {
			  	console.log('### ' + key + ' -> ' + obj[key]);
			  }
			}
  		} catch(e) {
  			console.error('EatSense.util.Helper.debugObject: failed to debug object ' + e);
  		}

  	},

  	/**
	* Return value of a query parameter.
	* http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
	* @param {String} name
	* Name of parameter.
	* @return value
	*/
  	getQueryParameter: function(name) {
  		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  			results;

  		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        results = regex.exec(location.search);

    	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  	}
});