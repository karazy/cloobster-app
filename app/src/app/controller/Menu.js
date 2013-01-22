/**
 * The menu controller handles everything related to the menu.
 * - Navigation in menu structure
 * - choosing products and put them into the card
 * - configuring products e.g. choosing options
 */
Ext.define('EatSense.controller.Menu', {
    extend: 'Ext.app.Controller',
    config: {
		refs: {
	        main : 'mainview', 
        	menulist :'menuoverview list',        	
        	productlist :'productoverview list',        	
        	productoverview :'productoverview' ,
        	menuoverview :'menuoverview' ,	       
            productdetail: 'productdetail',
        	prodDetailLabel :'productdetail #prodDetailLabel',
        	prodDetailLabelImage :'productdetail #prodDetailLabelImage',
        	prodPriceLabel :'productdetail #prodPriceLabel',    
        	amountSpinner: 'productdetail spinnerfield',
        	createOrderBt :'productdetail button[action="cart"]',
        	closeProductDetailBt: 'productdetail button[action=close]',
        	menuview: 'menutab',
        	productcomment: 'carttab #productComment',
        	cartBackButton: 'menutab button[action=back]',
        	productBackButton: 'productoverview button[action=back]',
        	topToolbar: 'menutab #menuTopBar',
        	loungeview: 'lounge',
        	loungeTabBar: 'lounge tabbar',
        	showCartButton: 'menutab button[action=show-cart]',
        	cartView: 'menutab carttab',
        	clubdashboard: 'clubdashboard'
		},

		control: {
			menulist: {
             	select: 'showProductlist',
             	disclose: 'showProductlist'
             },
             productlist : {
            	select: 'loadProductDetail' 
             },
             createOrderBt : {
            	 tap: 'createOrder'
             },
             closeProductDetailBt: {
             	tap: 'closeProductDetailHandler'
             },
             productBackButton: {
             	tap: 'backToMenu'
             },
             cartBackButton: {
             	tap: 'cartBackButtonHandler'
             },
             amountSpinner : {
            	 spin: 'amountChanged'
             },
             showCartButton: {
             	tap: 'showCart'
             },
             menuview: {
             	activate: 'menuTabActivated'
             },
             clubdashboard: {
             	initialize: 'registerProductTeaserTap'
             }
		},
		/**
		*	Current selected menu.
		*/
		activeMenu: null,
		/**
		*	Current selected product.
		*/
		activeOrder: null,
		//used for back button logic, is either productoverview or menuoverview
		viewCallingCart: null,
		/* Android Back handlers */
		menuNavigationFunctions : new Array()
    },
    launch: function() {
    	var checkInCtr = this.getApplication().getController('CheckIn');
    	// menuStore = Ext.StoreManager.lookup('menuStore');

    	// menuStore.on('load', this.registerProductTeaserTap, this);
    	// this.registerProductTeaserTap();
    	checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.registerProductTeaserTap();
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.cleanup();
				this.registerProductTeaserTap(true);
			}
		}, this);
    },
    /**
    * @private
    * Register dashboardteaser tap event
    * @param {Boolean} unregister
    *	If true removes the listener
    */
    registerProductTeaserTap: function(unregister) {
    	var me = this,
    		loungeview = this.getLoungeview(),
    		teasers;

    	teasers = loungeview.query('dashboardteaser[type="product"]');

    	Ext.Array.each(teasers, function(teaser){
    		if(!unregister) {
	    		teaser.on('teasertapped', me.jumpToProductDetail, me);
    		} else {
    			teaser.un('teasertapped', me.jumpToProductDetail, me);
    		}
    	});
    },
    menuTabActivated: function(tab) {
    	var androidCtr = this.getApplication().getController('Android');
    	
    	androidCtr.setExitOnBack(false);
    	androidCtr.setAndroidBackHandler(this.getMenuNavigationFunctions());
    },
    /**
    * Shows product detail and product list no matter where the user is.
    * @param product
    *	Product to show.
    */
    jumpToProductDetail: function(product, teaser) {
    	var me = this,
    		menuStore = Ext.StoreManager.lookup('menuStore'),
    		parentMenu,
    		loungeview = this.getLoungeview(),
    		menuview = this.getMenuview();

    	if(!product) {
    		console.log('Menu.jumpToProductDetail: no product given');
    		return;
    	}

    	if(!product.get('menu_id')) {
    		console.log('Menu.jumpToProductDetail: product has no menu_id');
    		return;
    	}

    	parentMenu = menuStore.getById(product.get('menu_id'));
    	//show the product list
    	this.showProductlist(null, parentMenu);
    	loungeview.setActiveItem(menuview);
    	//show product detail by triggering the select
    	this.getProductlist().select(product);
    	
    },
    /**
     * Shows the products of a menuitem
     * e. g. Beverages, Drinks, Burgers
     */
    showProductlist: function(dataview, record) {
    	console.log("Menu Controller -> showProductlist");
    	var me = this,
    		pov = this.getProductoverview(),
    		prodStore = record.productsStore,
    		firstItem,
    		oldHeader = null,
    		titleLabel;

		this.getApplication().getController('Android').addBackHandler(function() {
			me.backToMenu();
		});

    	this.setActiveMenu(record);

    	this.getProductlist().setStore(prodStore);  
		this.getProductlist().refresh();
    	
    	titleLabel = pov.down('#titleLabel');

    	if(titleLabel) {
    		titleLabel.getTpl().overwrite(titleLabel.element, record.getData());
    	}

    	this.switchView(pov, "", "", 'left');
    },
    /**
    *	Load menus and products and selects menu card.
    *
    */
    showMenu: function() {
    	var me = this,
    	    menu = this.getMenuview(),
    		lounge = this.getLoungeview(),
    		main = this.getMain(),
    		checkInCtr = this.getApplication().getController('CheckIn'),
    		businessId = Ext.String.trim(checkInCtr.getActiveCheckIn().get('businessId')),
    		areaId = checkInCtr.getActiveSpot().get('areaId'),
    		menuStore = Ext.StoreManager.lookup('menuStore'),
    		titleLabel,
    		titleLabelTpl;
		
		if(businessId && businessId.toString().length != 0) {
			menuStore.load({
				scope   : this,
				params: {
					'includeProducts' : true,
					'pathId': businessId,
					'areaId' : areaId
				},
			    callback: function(records, operation, success) {
			    	if(operation.error) { 
                        me.getApplication().handleServerError({
                        	'error': operation.error, 
                        	'forceLogout': {403:true}
                        }); 
                    }

                    me.setupProductStore(menuStore);
			    }
			 });

			try {
				titleLabel = menu.down('#titleLabel');

				titleLabel.getTpl().overwrite(titleLabel.element, checkInCtr.getActiveSpot().getData());
			} catch(e) {
				console.log('Menu.showMenu > failed to set up titleLabel');
			}
			

            //always show menuoverview on first access
            menu.setActiveItem(0);       
		} else {
			console.log('Order.showMenu > no businessId in active checkInFound found! Was ' + businessId);
		}
    },
    /**
     * Shows the menu. At this point the store is already filled with data.
     */
	backToMenu: function() {
		var androidCtr = this.getApplication().getController('Android');

		this.switchView(this.getMenuoverview(), i10n.translate('menuTitle'), null, 'right');
		//directly remove handlers, because this function can be called from another controller
		//so the wrong context is set
		this.setMenuNavigationFunctions(new Array());
	},
	/**
	* Tap event handler for cart back button.
	*/
	cartBackButtonHandler: function(button) {
		this.getMenuNavigationFunctions().pop();
		this.backToPreviousView();
	},
	/**
	* Tap event handler for cart back button. Switches to previous displayed view.
	* This can either be menuoverview or productoverview.
	*/
	backToPreviousView: function() {
		if(this.getViewCallingCart()) {
			this.switchView(this.getViewCallingCart(), i10n.translate('menuTitle'), null, 'right');
			this.setViewCallingCart(null);			
		} else {
			console.log('Menu.backToPreviousView > called without viewCallingCart set')
		}	
	},
	/**
	 * Displays detailed information for a product (e.g. Burger). 
	 * Creates an order object which gests manipulated.
	 * @param dataview
	 * @param record
	 */
	loadProductDetail: function(dataview, record) {
		var me = this,
			detail = this.getProductdetail(), 
			main = this.getMain(), 
			menu = this.getMenuview(), 
			choicesPanel =  null,
			// choicesWrapper =  this.getProductdetail().getComponent('choicesWrapper'),
			// titlebar = detail.down('titlebar'),
			activeProduct,
			detailPanel,
			activeBusiness = this.getApplication().getController('CheckIn').getActiveBusiness(),
			order,
			titleLabel,
			prodDetailLabel = this.getProdDetailLabel(),
			prodDetailLabelImage = this.getProdDetailLabelImage();
	
			this.getApplication().getController('Android').addBackHandler(function() {
					me.closeProductDetail();
			});

		//DEBUG
		// if(record) {
		// 	record.debugData();
		// } else {
		// 	console.log('Menu.loadProductDetail: ERROR no record given');
		// }
		
		// console.log('Menu.loadProductDetail: 1');
		order = EatSense.model.Order.createOrder(record);
		this.setActiveOrder(order);
		// console.log('Menu.loadProductDetail: 2');

		choicesPanel =  this.getProductdetail().down('#choicesPanel');
		//fix for Ticket #397 sometimes product detail seems to be broken
		if(!choicesPanel) {
			detail.destroy();
			detail = null;
			detail = this.getProductdetail();
			choicesPanel =  this.getProductdetail().down('#choicesPanel');
			// titlebar = detail.down('titlebar');
			console.log('Menu.loadProductDetail: detail panel was null. generate new');
		}

		choicesPanel.removeAll(false);
		// console.log('Menu.loadProductDetail: 3');

		// titlebar.setTitle(order.get('productName'));

		titleLabel = detail.down('#titleLabel');
		detailPanel = detail.down('#productDetailPanel');

    	if(titleLabel) {
    		if(detailPanel.element.first('.productlist-header')) {
    			detailPanel.element.first('.productlist-header').destroy();
    		}    		
    		titleLabel.getTpl().insertFirst(detailPanel.element, order.getData());
    		// titleLabel.getTpl().overwrite(titleLabel.element, order.getData());

    	}

		// console.log('Menu.loadProductDetail: 4');
		this.getApplication().getController('CheckIn').activateWelcomeAndBasicMode(detail);
		// console.log('Menu.loadProductDetail: 5');
		//reset product spinner
		this.getAmountSpinner().setValue(1);


		// detailPanel.element.insertFirst
		// detailPanel.setStyle('background-image: url("http://www.whitegadget.com/attachments/pc-wallpapers/16215d1222951905-nature-photos-wallpapers-images-beautiful-pictures-nature-444-photos.jpg");'+
		// 			 'background-size: 100% auto;');
		// '<div style="background-image: url(\"http://www.whitegadget.com/attachments/pc-wallpapers/16215d1222951905-nature-photos-wallpapers-images-beautiful-pictures-nature-444-photos.jpg\");'+
		// 			 'background-size: 600px 200px;"></div>'

		//DEBUG
		// order.set('productImageUrl', 'res/images/background.jpg');

		if(!order.get('productImageUrl')) {
			//if no image exists display product text on the left of amount spinner
			prodDetailLabel.getTpl().overwrite(prodDetailLabel.element, {product: order, amount: this.getAmountSpinner().getValue()});
			prodDetailLabelImage.element.setHtml('');
			detailPanel.setStyle({
				'background-image': 'none'
			});			
		} else {
			//when an image exists, display the description beneath the amount spinner
			prodDetailLabelImage.getTpl().overwrite(prodDetailLabelImage.element, {product: order, amount: this.getAmountSpinner().getValue()});
			prodDetailLabel.element.setHtml('');			
			detailPanel.setStyle(
			{
				'background-image': 'url('+order.get('productImageUrl')+'=s720)',
				'background-size': '100%',
				'background-position': 'center'
			});
		}
		
		this.getProdPriceLabel().getTpl().overwrite(this.getProdPriceLabel().element, {order: order, amount: this.getAmountSpinner().getValue()});
		//if basic mode is active, hide amount spinner
		this.getAmountSpinner().setHidden(activeBusiness.get('basic'));
		// console.log('Menu.loadProductDetail: 6');

		// Ext.Viewport.add(detail);
		this.switchView(detail);

		detail.getScrollable().getScroller().scrollToTop();
		detail.show();
		// console.log('Menu.loadProductDetail: 7');
		detail.setMasked({
			xtype: 'loadmask',
			message: i10n.translate('menu.product.detail.loading')
		});
		// console.log('Menu.loadProductDetail: 8');
		Ext.defer((function() {
			//dynamically add choices
			if(typeof order.choices() !== 'undefined' && order.choices().getCount() > 0) {
			 	 //render all main choices
			 	 // console.log('Menu.loadProductDetail: 9');
			 	 order.choices().each(function(choice) {
						var optionsDetailPanel = Ext.create('EatSense.view.OptionDetail'),
							choicePriceLabel = "";

						if(choice.get('price') > 0) {
							choicePriceLabel = (choice.get('overridePrice') == 'OVERRIDE_FIXED_SUM') ? ' (+' + appHelper.formatPrice(choice.get('price')) + ')' : '';	
						}						

						optionsDetailPanel.getComponent('choiceTextLbl').setHtml(choice.data.text + choicePriceLabel);
						//recalculate when selection changes
						choice.clearListeners();
						choice.on('recalculate', function() {
							me.recalculate(order);
						});

						me.createOptions(choice, optionsDetailPanel);
						choicesPanel.add(optionsDetailPanel);
			 	 });		 	 
			};
			 // console.log('Menu.loadProductDetail: 10');
			//insert comment field after options have been added so it is positioned correctly
			choicesPanel.add({
				xtype: 'textareafield',
				label: i10n.translate('orderComment'),
				labelAlign: 'top',
				itemId: 'productComment',
				maxRows: 3,
				value: '',
				inputCls: 'comment-input',
				labelCls: 'comment'
			});

			detail.setMasked(false);
		}), 10, this);
	

		
		
	},
	/**
	* @private
	* Creates Ext.field.Radio and Ext.field.Checkbox option elements and adds them to given panel.
	* @param choice
	*	Choice containing options to create.
	* @param panel
	*	Panel to add options to
	*/
	createOptions: function(choice, panel) {
		if(!choice || !panel) {
			console.log('You have to provide options and panel')
			return;
		}

		var me = this,
			optionType = '',
			field,
			isChecked,
			optionPriceLabel,
			overrideMode = choice.get('overridePrice');

		if(choice.get('minOccurence') <= 1 && choice.get('maxOccurence') == 1) {
			optionType = 'Ext.field.Radio';
		} 
		else {//multiple choice
			optionType = 'Ext.field.Checkbox';					 
		}

		choice.options().each(function(opt) {
			if(overrideMode == 'NONE' && opt.get('price') > 0) {
				optionPriceLabel =  ' (+'+ appHelper.formatPrice(opt.get('price')) + ')';	
			} else if (overrideMode == 'OVERRIDE_SINGLE_PRICE' && choice.get('price') > 0) {
				optionPriceLabel =  ' (+'+ appHelper.formatPrice(choice.get('price')) + ')';
			} else {
				optionPriceLabel = '';
			}
		
			field = Ext.create(optionType, {
				 			name : "option_" + choice.get('id'),
				 			labelWidth: '80%',
							label : opt.get('name') + optionPriceLabel,
							checked: opt.get('selected'),
							cls: 'option',
							labelCls: 'option-label'
					}, me);							 
			field.addListener('check',function(cbox, event) {
			 	console.log('check');
				if(cbox.isXType('radiofield',true)) {		 	
					choice.options().each(function(innerOpt) {
						if(innerOpt != opt) {
					 		innerOpt.set('selected', false);	
					 	}
					});
					if(choice.get('minOccurence') == 0) {
				 	 	cbox.setChecked(!opt.get('selected'));
				 	 	opt.set('selected', !opt.get('selected'));
				 	} else {
				 		opt.set('selected', true);
				 	}
				 } else {
				 	opt.set('selected', true);	
				 }
				 choice.fireEvent('recalculate');
			 },me);

			 field.addListener('uncheck',function(cbox) {
			 	console.log('uncheck');
				 if(cbox.isXType('checkboxfield',true)) {
					 opt.set('selected', false);
				 }
				 choice.fireEvent('recalculate');				 
			 },me);
			 panel.getComponent('optionsPanel').add(field);
		});
	},
	/**
	* tap event handler for closeProductDetailBt.
	*/
	closeProductDetailHandler: function() {
		this.getApplication().getController('Android').removeLastBackHandler();
		this.closeProductDetail();
	},
	/**
	* Hides Product detail. Destroys the active order!! Only call this method
	* from close button of product detail.
	*/
	closeProductDetail: function() {
		var detail = this.getProductdetail(),
			productoverview = this.getProductoverview();
		
		// detail.hide();
		// detail.destroy();

		this.switchView(productoverview);

		//destroy the active order
		if(this.getActiveOrder()) {
			EatSense.model.Order.destroyOrder(this.getActiveOrder());
			this.setActiveOrder(null);
		}
	},
	/**
	 * Adds the current product to card.
	 * @param button
	 */
	createOrder: function(button) {
		//get active product and set choice values
		var me = this,	
			order = this.getActiveOrder(),
			order,
			validationError = "",
			validationResult = null,
			cartButtons = this.getLoungeview().query('button[action=show-cart]'),
			productIsValid = true,
			appState = this.getApplication().getController('CheckIn').getAppState(),
			appStateStore = Ext.StoreManager.lookup('appStateStore'),
			activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			detail = this.getProductdetail(),
			message,
			androidCtr = this.getApplication().getController('Android'),
			orderCtr = this.getApplication().getController('Order');
		
		//validate choices 
		order.choices().each(function(choice) {
				validationResult = choice.validateChoice();

				if(!validationResult.valid) {
					//coice is not valid
					productIsValid = false;
					validationError += validationResult.errMsgs;
				};
		});
		
		//if valid create order and attach to checkin
		if(productIsValid === true) {
			order.set('status','CART');			
			order.set('comment', this.getProductdetail().getComponent('choicesPanel').getComponent('productComment').getValue());
			
			Ext.Ajax.request({
	    	    url: appConfig.serviceUrl+'/c/businesses/'+activeCheckIn.get('businessId')+'/orders/',
	    	    method: 'POST',
	    	    jsonData: order.getRawJsonData(),
	    	    success: function(response, operation) {
	    	    	order.setId(response.responseText);
	    	    	order.phantom = false;	    	    	
					activeCheckIn.orders().add(order);
					orderCtr.updateCartButtons();
	    	    },
	    	    failure: function(response, operation) {
	    	    	//409 happens when e. g. product choices get deleted and a refresh of the menu is necessary
	    	    	if(response.status == 409) {
	    	    		appHelper.toggleAlertActive(true);
	    	    		Ext.Msg.alert(i10n.translate('error'),
	    	    			i10n.translate('error.menu.needsrefresh'),
	    	    			function() {
								appHelper.toggleAlertActive(false);
						});
	    	    		//clear the menu store, don't send clear event
	    	    		// Ext.StoreManager.lookup('menuStore').removeAll();
	    	    		// Ext.StoreManager.lookup('productStore').removeAll();
	    	    		me.clearMenuStores();
	    	    		me.clearProductStore();
	    	    		//refresh menu
	    	    		me.showMenu();

	    	    	} else {
		    	    	me.getApplication().handleServerError({
	                        	'error': { 'status' : response.status, 'statusText' : response.statusText}, 
	                        	'forceLogout': {403:true}
	                    });	
	    	    	}	
	    	    }
	    	});
									
			// detail.hide();
			// detail.destroy();
			me.switchView(this.getProductoverview());

			message = i10n.translate('productPutIntoCardMsg', this.getActiveOrder().get('productName'));
			this.setActiveOrder(null);
			
			androidCtr.removeLastBackHandler();

			if (message) {
				Ext.Msg.show({
					title : i10n.translate('orderPlaced'),
					'message' : message,
					buttons : []
				});
				//show short alert and then hide
				Ext.defer((function() {
					if(!appHelper.getAlertActive()) {
						Ext.Msg.hide();
					}					
				}), appConfig.msgboxHideTimeout, this);
			}
		} else {
			//show validation error
			//i10n.translate('orderInvalid')
			Ext.Msg.alert('',validationError, Ext.emptyFn);
		}
		
	},
	/**
	 * Switches to card view.
	 */
	showCart: function(button) {
		// var me = this,
		// 	menuview = this.getMenuview(),
		// 	cartView = this.getCartView(),
		// 	activePanel = menuview.getActiveItem(),
		// 	androidCtr = this.getApplication().getController('Android');

		
		// button.setDisabled(true);
		// Ext.defer((function() {
		// 	button.setDisabled(false);
		// }), 50, this);

		// menuview.switchTo(cartView, "left");
		// this.setViewCallingCart(activePanel);
		// this.getApplication().getController('Order').refreshCart();

		// androidCtr.addBackHandler(function() {
		// 	me.backToPreviousView();
		// });
		
		this.getApplication().getController('Order').showCart(button, this.getMenuview(), this.getLoungeview());		

	},
	/**
	* Shows or hides the product cart button.
	* @param show
	* 		true = show | false = hide
	*/
	showCartButtons: function(show) {
		var lounge = this.getLoungeview(),
			cartButtons;

		cartButtons = lounge.query('button[action=show-cart]');

		Ext.Array.each(cartButtons, function(button) {
			button.setHidden(!show);
		});
	},
	/**
	 * Switches to another view
	 * @param view
	 * 		new view
	 * @param title
	 * 			Toolbar title
	 * @param labelBackBt
	 * 			label of back button. If <code>null</code> back button will be hidden.
	 * @param direction
	 * 			Direction for switch animation.
	 */
	switchView: function(view, title, labelBackBt, direction) {
		var menu = this.getMenuview();
		
    	menu.switchMenuview(view, direction);
	},
	/**
	 * Recalculates the total price for the active product.
	 */
	recalculate: function(order) {
		console.log('Menu.recalculate');
		this.getProdPriceLabel().getTpl().overwrite(this.getProdPriceLabel().element, {order: order});
	},
	/**
	 * Called when the product spinner value changes. 
	 * Recalculates the price.
	 * @param spinner
	 * @param value
	 * @param direction
	 */
	amountChanged: function(spinner, value, direction) {
		console.log('MenuController > amountChanged (value:'+value+')');
		this.getActiveOrder().set('amount', value);
		this.recalculate(this.getActiveOrder());
	},

	/**
	* Close windows, reset fields and so on...
	* E. g. used after a FORCE_LOGOUT
	*/
	cleanup: function() {
		// var detail = this.getProductdetail();

		this.clearMenuStores();
		this.clearProductStore();
		
		//close product detail
		// detail.hide();
		// detail.destroy();
		//show menu first level
		this.switchView(this.getMenuoverview(), i10n.translate('menuTitle'), null, 'right');
	},
	/**
	* Clear Menu store and nested stores (product, choices, options).
	*/
	clearMenuStores: function() {
		var menuStore = Ext.StoreManager.lookup('menuStore');


		menuStore.each(function(menu) {
        menu.products().each(function(product) {
	        product.choices().each(function(choice) {
	            choice.options().removeAll(true);
	        });  
	    	    product.choices().removeAll(true);
	        });
	       	menu.products().removeAll(true);
	    });

	    //remove menu to prevent problems on reload
	    menuStore.removeAll(false);
	},
	/**
	* @private
	*	Extracts all nested products from given menuStore and adds them to productStore.
	* @param {Ext.data.Store} menuStore
	*/
	setupProductStore: function(menuStore) {
		var productStore = Ext.StoreManager.lookup('productStore');

		if(!menuStore) {
			return;
		}

		menuStore.each(function(menu) {
			menu.productsStore.each(function(product) {
				productStore.add(product);	
			})			
		});

		productStore.load();
	},
	/**
	* @private
	* Clear productStore
	*/
	clearProductStore: function() {
		var productStore = Ext.StoreManager.lookup('productStore');
		
		try {
			productStore.each(function(product) {
		        product.choices().each(function(choice) {
		            choice.options().removeAll(true);
		        });  
	    	    product.choices().removeAll(true);
	        });
		       
			productsStore.removeAll();
		}catch(e) {
			console.log('Menu.clearProductStore: failed to clear store. ' + e);
		}
	}

     	
});

