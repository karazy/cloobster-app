Ext.define('EatSense.util.Helper', {
	requires: ['EatSense.util.Constants', 'EatSense.util.Configuration'],
	alternateClassName: ['appHelper'],
	requires: [],
	singleton: true,

	config: {
		alertActive: false
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

  	},
  	/**
	* Register a tap event for image to zoom it.
	* @param {Ext.Component} panel
	*	Panel used to fire events.
	* @param {Ext.dom.Element} imageElement
	*	
	* @param {String} url (optional)
	*	url to image. If none provided uses url of image tag
	*/
	registerImageZoomTap: function(panel, imageElement, url) {
		var image;

		image = imageElement;

		if(image) {
			//if an image exists, add tap listener
			image.on({
				tap: function(ele) {
					console.log('InfoPageDetail.registerImageZoomTap: image tap');					

					var img = new Image(),
						imgPanel,
						viewportW,
						viewportH,
						panelW = '',
						panelH = '',
						imageH = 'auto',
						imageW = 'auto';

					imgPanel = Ext.create('Ext.Panel', {
						height: '50%',
						width: '50%',
						centered: true,
						hideOnMaskTap: true,
						modal: true,
						// floatingCls: '',
						// style: {
						// 	'background-color' : 'white'
						// },
						listeners: {
							hide: function() {
								imgPanel.destroy();
							}
						}
					});

					imgPanel.element.on({
						tap: function() {
							imgPanel.hide();
							//notify listeners that image panel close
							panel.fireEvent('imagezoomclose', imgPanel);
							Ext.Viewport.fireEvent('removebackhandler', doHidePanel);
						}
					});					

					Ext.Viewport.add(imgPanel);
					appHelper.toggleMask('loadingMsg', imgPanel);

					//notify listeners that an image panel is open
					panel.fireEvent('imagezoomopen', imgPanel);	
					Ext.Viewport.fireEvent('addbackhandler', doHidePanel);

					function doHidePanel() {
						imgPanel.hide();
					}	



					img.onload = function() {
						var ratio = this.width / this.height;

						if(!imgPanel) {
							console.log('EatSense.view.InfoPageDetail: panel destroyed before image finished loading');
							return;
						}

						try {
							appHelper.toggleMask(false, imgPanel);

							viewportW = window.innerWidth;
							viewportH = window.innerHeight;

							//more wide then tall
							if(ratio >= 2/3 ) {
								imageW = "100%";

								if(this.width > viewportW * 0.95) {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 1');
									panelW  = viewportW * 0.95;
									panelH = panelW / ratio;
								} else {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 2');
									panelW = this.width;
									panelH = this.height;
								}
							} else {
								imageH = "100%";

								if(this.height > viewportH * 0.95) {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 3');
									panelH  = viewportH * 0.66;
									//add 4 pixels because of margins
									panelW = panelH * ratio + 4;
								} else {
									// console.log('EatSense.view.InfoPageDetail.registerImageZoomTap: 4');
									panelH = this.height;
								}
							}
							
							imgPanel.setWidth(panelW);
							imgPanel.setHeight(panelH);
							imgPanel.setHtml('<img src="'+img.src+'" width="'+imageW+'" height="'+imageH+'"/>');

						} catch(e) {
							console.log('EatSense.view.InfoPageDetail: failed to load image ' + e);
						}
					}

					img.src = url;
					
				}
			});
		}
	}
});