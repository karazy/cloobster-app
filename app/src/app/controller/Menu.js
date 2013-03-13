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
        	createOrderBt :'productdetail button[action="cart"]',
        	closeProductDetailBt: 'productdetail button[action=back]',
        	menuview: 'menutab',
        	productcomment: 'carttab #productComment',
        	cartBackButton: 'menutab button[action=back]',
        	productBackButton: 'productoverview button[action=back]',
        	topToolbar: 'menutab #menuTopBar',
        	loungeview: 'lounge',
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
             showCartButton: {
             	tap: 'showCart'
             },
             menuview: {
             	activate: 'menuviewActivated'
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
    	var checkInCtr = this.getApplication().getController('CheckIn'),
    		loungeCtr = this.getApplication().getController('Lounge');

    	checkInCtr.on('statusChanged', function(status, activeCheckIn) {
			if(status == appConstants.CHECKEDIN) {
				this.registerProductTeaserTap();
				this.showMenu();
				//add area filter to product store before loading
                this.addProductAreaFilter(checkInCtr.getActiveSpot().raw.areaMenuIds);
				this.loadProducts(activeCheckIn);
				loungeCtr.on('areaswitched', doAreaFiltering, this);
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.cleanup();
				this.registerProductTeaserTap(true);
				loungeCtr.un('areaswitched', doAreaFiltering, this);
			}
		}, this);

		function doAreaFiltering(area) {
			this.filterMenuBasedOnArea(area);
			this.addProductAreaFilter(area.raw.menuIds, true);
			this.backToMenu();
		}
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
    	//get all associated data!
    	product.getData(true);

    	if(!product.get('menuId')) {
    		console.log('Menu.jumpToProductDetail: product has no menuId');
    		return;
    	}

    	parentMenu = menuStore.getById(product.get('menuId'));

    	//TODO error meldung
    	if(!parentMenu) {
    		console.log('Menu.jumpToProductDetail: menu not found. perhabs load is pending!');
    		return;
    	}

    	//show the product list
    	this.showProductlist(null, parentMenu);
    	loungeview.selectByAction('show-menu');
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
    	this.filterProductStore(record); 
		this.getProductlist().refresh();
    	
    	titleLabel = pov.down('#titleLabel');

    	if(titleLabel) {
    		titleLabel.getTpl().overwrite(titleLabel.element, record.getData());
    	}

    	this.switchView(pov, 'left');
    },
    /**
    * Activate event handler for menuview.
    * Always jumps back to first menu level.
    * @param {Ext.Component} view
    */
    menuviewActivated: function(view) {
    	this.backToMenu();
    },
    /**
    *	Load menus and products and selects menu card.
    *
    */
    showMenu: function() {
    	var me = this,
    	    menu = this.getMenuview(),
    		// lounge = this.getLoungeview(),
    		main = this.getMain(),
    		checkInCtr = this.getApplication().getController('CheckIn'),
    		businessId = Ext.String.trim(checkInCtr.getActiveCheckIn().get('businessId')),
    		activeSpot = checkInCtr.getActiveSpot(),
    		areaId = checkInCtr.getActiveSpot().get('areaId'),
    		menuStore = Ext.StoreManager.lookup('menuStore'),
    		titleLabel,
    		titleLabelTpl;
		
		if(businessId && businessId.toString().length != 0) {

			//remove old eventually existing filters, e.g. left overs from Menu.filterMenuBasedOnArea
            menuStore.clearFilter(true);

			menuStore.load({
				scope   : this,
				params: {
					// 'includeProducts' : true,
					'pathId': businessId
				},
			    callback: function(records, operation, success) {
			    	if(operation.error) { 
                        me.getApplication().handleServerError({
                        	'error': operation.error, 
                        	'forceLogout': {403:true}
                        }); 
                    }

                    // me.setupProductStore(menuStore, activeSpot.raw.areaMenuIds);                    
                    //only display assigned menus
			    	menuStore.filter([
				    	{
				    		filterFn: function(menu) {
				    			if(Ext.Array.contains(activeSpot.raw.areaMenuIds, menu.get('id'))) {
				    				return true;
				    			}
				    		}
				    	}
			    	]);
			    }
			 });

			try {
				titleLabel = menu.down('#titleLabel');
				titleLabel.getTpl().overwrite(titleLabel.element, [checkInCtr.getActiveSpot().get('areaName')]);
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
    * Updates the menu label with the given title.
    * @param {String} areaName
    *	Name of area to set as title
    *
    */
    updateMenuLabel: function(areaName) {
    	var titleLabel,
    	 	menu = this.getMenuview();

		try {
			titleLabel = menu.down('#titleLabel');

			titleLabel.getTpl().overwrite(titleLabel.element, [areaName]);
		} catch(e) {
			console.log('Menu.showMenu > failed to set up titleLabel');
		}

    },
    /**
    * Filter the menu assigned to given area.
    * @param {EatSense.model.Area} area
    *	area to filter menus with
    */
    filterMenuBasedOnArea: function(area) {
    	var menuStore = Ext.StoreManager.lookup('menuStore');
    	
    	if(!area) {
    		console.error('Menu.filterMenuBasedOnArea: no area given');	
    		return;
    	}

    	if(!area.raw.menuIds) {
    		console.error('Menu.filterMenuBasedOnArea: area has no assigned menus array');	
    		return;
    	}

    	if(area.raw.menuIds.length == 0) {
    		console.log('Menu.filterMenuBasedOnArea: has no assigned menus');
    	}
    	
    	menuStore.clearFilter(true);
	    menuStore.filter([
	    	{
	    		filterFn: function(menu) {
	    			if(!area || !area.raw || !area.raw.menuIds || area.raw.menuIds.length == 0) {
						return false;
	    			}

	    			if(Ext.Array.contains(area.raw.menuIds, menu.get('id'))) {
	    				return true;
	    			}

	    			return false;
	    		}
	    	}
    	]);

    	this.updateMenuLabel(area.get('name'));
    },
    /**
     * Shows the menu. At this point the store is already filled with data.
     */
	backToMenu: function() {
		var androidCtr = this.getApplication().getController('Android');

		this.switchView(this.getMenuoverview(), 'right');
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
			this.switchView(this.getViewCallingCart(), 'right');
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
			activeProduct,
			detailPanel,		
			activeBusiness = this.getApplication().getController('CheckIn').getActiveBusiness(),
			order,
			titleLabel,
			prodDetailLabel = this.getProdDetailLabel(),
			prodDetailLabelImage = this.getProdDetailLabelImage(),
			commentField,
			amountField;
	
			this.getApplication().getController('Android').addBackHandler(function() {
				me.closeProductDetail();
			});

		//DEBUG
		// if(record) {
		// 	record.debugData();
		// } else {
		// 	console.log('Menu.loadProductDetail: ERROR no record given');
		// }

		order = EatSense.model.Order.createOrder(record);
		this.setActiveOrder(order);

		choicesPanel =  this.getProductdetail().down('#choicesPanel');
		//fix for Ticket #397 sometimes product detail seems to be broken
		if(!choicesPanel) {
			detail.destroy();
			detail = null;
			detail = this.getProductdetail();
			choicesPanel =  this.getProductdetail().down('#choicesPanel');
			console.log('Menu.loadProductDetail: detail panel was null. generate new');
		}

		choicesPanel.removeAll(false);

		titleLabel = detail.down('#titleLabel');
		detailPanel = detail.down('#productDetailPanel');
		amountField = detail.down('#amountField');

    	if(titleLabel) {
    		if(detailPanel.element.first('.productlist-header')) {
    			detailPanel.element.first('.productlist-header').destroy();
    		}    		
    		titleLabel.getTpl().insertFirst(detailPanel.element, order.getData());
    	}

    	//remove existing background images
    	detailPanel.setStyle({
			'background-image': 'none'
		});

		
		this.getApplication().getController('CheckIn').activateWelcomeAndBasicMode(detail);
		
		//reset product amount
		amountField.setDisabled(true);
		// amountField.suspendEvents();
		amountField.setValue(1);

		//register listener for amount field
		amountField.un({
			change: me.amoundFieldChanged,
			scope: this
		});

		amountField.on({
			change: me.amoundFieldChanged,
			scope: this
		});

		detail.on({
			'show' : showDetailHandler,
			'showdetaildelayed' : createOptionsDelayed,
			single: true,
			scope: this
		});

		//show detail
		this.switchView(detail);

		//handler for detail show event
		function showDetailHandler() {
			//mask detail
			detail.setMasked({
				xtype: 'loadmask',
				message: i10n.translate('menu.product.detail.loading')
			});
			//delay creation of options to pretend quicker reaction
			Ext.create('Ext.util.DelayedTask', function () {
                detail.fireEvent('showdetaildelayed');
            }).delay(200);
		}

		//create the detail options
		function createOptionsDelayed() {

		//DEBUG
		// order.set('productImageUrl', 'res/images/background.png');		

			if(!order.get('productImageUrl')) {
				//if no image exists display product text on the left of amount field
				prodDetailLabel.getTpl().overwrite(prodDetailLabel.element, {product: order, amount: amountField.getValue()});
				prodDetailLabelImage.element.setHtml('');
				detailPanel.setStyle({
					'background-image': 'none'
				});
				//prevents the box from having the height of the long desc
				amountField.setHeight('100%');
			} else {
				//when an image exists, display the description beneath the amount field
				prodDetailLabelImage.getTpl().overwrite(prodDetailLabelImage.element, {product: order, amount: amountField.getValue()});
				prodDetailLabel.element.setHtml('');			
				detailPanel.setStyle(
				{
					'background-image': 'url('+order.get('productImageUrl')+'=s720)', 
					//DEBUG
					// 'background-image': 'url('+order.get('productImageUrl')+')', 
					'background-size': '100% auto',
					'background-position': 'center top',
					'min-height': '150px',
					'background-repeat': 'no-repeat'
				});

				amountField.setHeight('');
			}
		
			this.getProdPriceLabel().getTpl().overwrite(this.getProdPriceLabel().element, {order: order, amount: amountField.getValue()});
			//if basic mode is active, hide amount field
			//TODO 24.01.2013 how to deal with this. always show amount otherwise when 0€ product an ugly gray bar is displayed
			// this.getAmountSpinner().setHidden(activeBusiness.get('basic'));

			detail.getScrollable().getScroller().scrollToTop();
			//dynamically add choices
			if(typeof order.choices() !== 'undefined' && order.choices().getCount() > 0) {
			 	 //render all main choices
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

			//insert comment field after options have been added so it is positioned correctly
			commentField = Ext.create('Ext.field.TextArea', {
				label: i10n.translate('orderComment'),
				labelAlign: 'top',
				itemId: 'productComment',
				maxRows: 3,
				value: '',
				inputCls: 'comment-input',
				labelCls: 'comment'
			});			

			//TODO 24.10.2013 check if no problems occur not adding the comment field in basic mode
			commentField.setHidden(activeBusiness.get('basic'));

			//WORKAROUND prevent the focus event from propagating to textarea triggering keyboard popup
			choicesPanel.add(commentField);
			commentField.setDisabled(true);			

			//TODO Workaround because input gets focus
			//http://www.sencha.com/forum/showthread.php?258560-Input-gets-false-focus-after-switching-to-card!&p=946604#post946604
			Ext.create('Ext.util.DelayedTask', function () {
				amountField.setDisabled(false);
				commentField.setDisabled(false);
				detail.setMasked(false);             
            }).delay(200);            
		}
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
			checkInCtr = this.getApplication().getController('CheckIn'),
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
		

		if(!checkInCtr.checkActiveSpotInActiveArea() || !checkInCtr.checkActiveSpotEligibleForAction()) {
			console.log('Menu.createOrder: active spot belongs not to active area');
			//TODO refresh  myorders for actual state?!
			checkInCtr.confirmSwitchSpot(false, this.createOrder, this);
			return;
		}
			


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
	 * @param direction
	 * 			Direction for switch animation.
	 */
	switchView: function(view, direction) {
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

	amoundFieldChanged: function(field, newVal, oldVal) {
		console.log('Menu.amoundFieldChanged: ' + newVal);

		if(newVal != oldVal) {
			//TODO validation
			if(!Ext.isNumeric(newVal) || newVal < 1 || newVal > 10) {
				//reset old value
				field.suspendEvents();
				field.setValue(oldVal);
				field.resumeEvents();
				return;
			}

			this.getActiveOrder().set('amount', newVal);
			this.recalculate(this.getActiveOrder());
		}
	},

	/**
	* Close windows, reset fields and so on...
	* E. g. used after a FORCE_LOGOUT
	*/
	cleanup: function() {
		// var detail = this.getProductdetail();

		this.clearMenuStores();
		this.clearProductStore();

		//show menu first level
		this.switchView(this.getMenuoverview(), 'right');
	},
	/**
	* Clear Menu store and nested stores (product, choices, options).
	*/
	clearMenuStores: function() {
		var menuStore = Ext.StoreManager.lookup('menuStore');

		menuStore.clearFilter(true);
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
	* Filter the product store.
	* @param {EatSense.model.Menu} menu
	*	show products for given menu
	* @param {Boolean} clear
	*	True to remove existing filters.
	*/
	filterProductStore: function(menu, clear) {
		var productStore = Ext.StoreManager.lookup('productStore');

		if(clear) {
			productStore.clearFilter(true);	
		}

		if(menu) {
			productStore.data.removeFilters(['menuId']);

			productStore.filter([
				{
					property: 'menuId',
					value: menu.get('id')
				}
			]);
		}		
	},
	/**
	* @private
	* Adds a filter to product store hiding all menus, not belonging to current area.
	* @param {Array<Number>} menuIds
	*	Array of menuIds belonging to current area.
	* @param {Boolean} clear
	*	True to remove existing filters.
	*/
	addProductAreaFilter: function(menuIds, clear) {
 		var productStore = Ext.StoreManager.lookup('productStore');
 
 		if(clear) {
 			productStore.clearFilter(true);	
 		}

		if(menuIds) {
			productStore.filter([
		    	{
		    		filterFn: function(product) {
		    			if(Ext.Array.contains(menuIds, product.get('menuId'))) {
		    				return true;
		    			}
		    		}
		    	}
    		]);
		}		
 	},

	/**
	* @private
	* Load products for activeCheckIn.
	*
	*/
	loadProducts: function() {
		var productStore = Ext.StoreManager.lookup('productStore');

		productStore.load({
			callback: function(records, operation, success) {
		    	if(operation.error) { 
                    me.getApplication().handleServerError({
                    	'error': operation.error, 
                    	'forceLogout': {403:true}
                    }); 
                }
		    }
		});
	},

	/**
	* @private
	* Clear productStore.
	*/
	clearProductStore: function() {
		var productStore = Ext.StoreManager.lookup('productStore');
		
		try {
			productStore.clearFilter(true);
			productStore.each(function(product) {
		        product.choices().each(function(choice) {
		            choice.options().removeAll(true);
		        });  
	    	    product.choices().removeAll(true);
	    	    product.destroy();
	        });
		       
			productStore.removeAll();
		}catch(e) {
			console.log('Menu.clearProductStore: failed to clear store. ' + e);
		}
	}

     	
});

