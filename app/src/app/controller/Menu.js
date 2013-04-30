/**
 * The menu controller handles everything related to the menu.
 * - Navigation in menu structure
 * - choosing products and put them into the card
 * - configuring products e.g. choosing options
 */
Ext.define('EatSense.controller.Menu', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.util.Filter'],
    config: {
		refs: {            
        	menulist :'menuoverview list',        	
        	productlist :'productoverview list',        	
        	productoverview :'productoverview' ,
        	menuoverview :'menuoverview' ,	       
            productdetail: 'productdetail',
        	prodDetailLabel :'productdetail #prodDetailLabel',
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
             'dashboardteaser': {
                'teasertapped.products' : 'jumpToProductDetail'
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
		viewCallingCart: null
    },
    launch: function() {
    	var checkInCtr = this.getApplication().getController('CheckIn'),
    		loungeCtr = this.getApplication().getController('Lounge');

    	checkInCtr.on('statusChanged', function(status, activeCheckIn) {
			if(status == appConstants.CHECKEDIN) {
				this.showMenu();

                this.getLoungeview().on({
                    delegate: 'menutab',
                    show: menuPageOverviewShown,
                    single: true,
                    scope: this
                });

                function menuPageOverviewShown(panel) {                    
                    try {
                        //no area switch occured
                        if(Ext.isNumber(checkInCtr.getActiveArea())) {                            
                            this.updateMenuLabel(checkInCtr.getActiveSpot().get('areaName'));
                        } else {
                            this.updateMenuLabel(checkInCtr.getActiveArea().get('name'));
                        }
                    } catch(e) {
                        console.error('Menu.launch: menuPageOverviewShown failed to set title label ' + e);
                    }
                }

				//add area filter to product store before loading
                this.addProductAreaFilter(checkInCtr.getActiveSpot().raw.areaMenuIds);
                this.setSorterForMenuBasedOnIdArray(checkInCtr.getActiveSpot().raw.areaMenuIds, true);
				this.loadProducts(activeCheckIn);
				loungeCtr.on('areaswitched', doAreaFiltering, this);
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.cleanup();
				// this.registerProductTeaserTap(true);
				loungeCtr.un('areaswitched', doAreaFiltering, this);
			}
		}, this);

		function doAreaFiltering(area) {
			//set sorter before filtering
			this.setSorterForMenuBasedOnIdArray(area.raw.menuIds);
			this.filterMenuBasedOnArea(area);
			this.addProductAreaFilter(area.raw.menuIds, true);
            this.refreshProductTeasers();
			this.backToMenu();
		}
    },
    /**
    * @Deprecated
    * @private
    * Register dashboardteaser tap event
    * @param {Boolean} unregister
    *	If true removes the listener
    */
    registerProductTeaserTap: function(unregister) {
    	var me = this,
    		loungeview = this.getLoungeview(),
    		teasers;

    	teasers = loungeview.query('dashboardteaser[type="products"]');

        // if(!unregister) {
        //     Ext.Viewport.on('teasertapped.products', me.jumpToProductDetail, me);
        // } else {
        //     Ext.Viewport.un('teasertapped.products', me.jumpToProductDetail, me);
        // }

    	Ext.Array.each(teasers, function(teaser){
    		if(!unregister) {
	    		teaser.on('teasertapped.products', me.jumpToProductDetail, me);
    		} else {
    			teaser.un('teasertapped.products', me.jumpToProductDetail, me);
    		}
    	});
    },
    /**
    * @private
    * Forces product teasers to refresh themselfs and pulling a new product from store.
    */
    refreshProductTeasers: function() {
    	   var me = this,
    		loungeview = this.getLoungeview(),
    		teasers;

    	teasers = loungeview.query('dashboardteaser[type="products"]');

    	Ext.Array.each(teasers, function(teaser){
    		teaser.fireEvent('refresh');
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

    	//TODO error message
    	if(!parentMenu) {
    		console.log('Menu.jumpToProductDetail: menu not found. perhabs load is pending!');
    		return;
    	}

    	//show the product list
        loungeview.selectByAction('show-menu');
    	this.showProductlist(null, parentMenu);    	
    	//show product detail by triggering the select
    	this.getProductlist().select(product);
    	
    },
    /**
     * Shows the products of a menuitem
     * e. g. Beverages, Drinks, Burgers
     */
    showProductlist: function(dataview, record) {
    	console.log("Menu.showProductlist");
    	var me = this,
    		pov = this.getProductoverview(),
    		firstItem,
    		oldHeader = null,
    		titleLabel;

		this.switchView(pov, 'left');

    	this.setActiveMenu(record);
    	this.filterProductStore(record); 
		this.getProductlist().refresh();
    	
    	titleLabel = pov.down('#titleLabel');

    	if(titleLabel) {
    		titleLabel.getTpl().overwrite(titleLabel.element, record.getData());
    	}    	
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
                        return;                   
                    }
                    console.log('Menu.showMenu: load success');
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

            //always show menuoverview on first access
            // menu.setActiveItem(0);       
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
            if(titleLabel) {
                titleLabel.getTpl().overwrite(titleLabel.element, [areaName]);    
            }			
		} catch(e) {
			console.log('Menu.updateMenuLabel: failed to set up titleLabel');
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
    * Sets sorters for the menu based on given array.
    * The actual sort has to be called afterswars.
    * @param {Array<number>} array of menu ids
    *	area to sort menus with
    * @param {Boolean} sort
    *	true to sort right away
    */
    setSorterForMenuBasedOnIdArray: function(menuIds, sort) {
    	var menuStore = Ext.StoreManager.lookup('menuStore');
    	
    	if(!menuIds) {
    		console.error('Menu.setSorterForMenuBasedOnIdArray: no ids given');	
    		return;
    	}

    	if(!Ext.isArray(menuIds)) {
    		console.error('Menu.setSorterForMenuBasedOnIdArray: menuIds is no array');	
    		return;
    	}

    	if(menuIds.length == 0) {
    		console.log('Menu.setSorterForMenuBasedOnIdArray: array contains no valuers');
    	}

    	menuStore.data.setAutoSort(false);
    	menuStore.setSorters([
	    	{
	    		sorterFn: function(menu1, menu2) {
	    			var indexOf1,
	    				indexOf2;

	    			if(!menuIds || !Ext.isArray(menuIds) || menuIds.length == 0) {
						return false;
	    			}

	    			indexOf1 = menuIds.indexOf(menu1.get('id'));
	    			indexOf2 = menuIds.indexOf(menu2.get('id'));

	    			if(indexOf1 < indexOf2) {
	    				return -1;
	    			}

	    			if(indexOf1 > indexOf2) {
	    				return 1;
	    			}

	    			//should not occur
	    			return 0;

	    		}	
	    	}
    	]);
    	menuStore.data.setAutoSort(true);

    	if(sort) {
    		menuStore.sort();
    	}
    },

    /**
     * Shows the menu. At this point the store is already filled with data.
     */
	backToMenu: function() {
		this.switchView(this.getMenuoverview(), 'right');
	},
	/**
	* Tap event handler for cart back button.
	*/
	cartBackButtonHandler: function(button) {
		// this.getMenuNavigationFunctions().pop();
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
			console.log('Menu.backToPreviousView: called without viewCallingCart set')
		}	
	},
	/**
	 * Displays detailed information for a product (e.g. Burger). 
	 * Creates an independent order object for manipulation.
	 * @param dataview
	 * @param record
	 */
	loadProductDetail: function(dataview, record) {
		var me = this,
			detail, 
			menu = this.getMenuview(), 
			choicesPanel =  null,
			activeProduct,
			detailPanel,		
			activeBusiness = this.getApplication().getController('CheckIn').getActiveBusiness(),
			order,
			titleLabel,
			prodDetailLabel = this.getProdDetailLabel(),
			prodPriceLabel,
			commentField,
			amountField;
	

		//DEBUG
		// if(record) {
		// 	record.debugData();
		// } else {
		// 	console.log('Menu.loadProductDetail: ERROR no record given');
		// }

		order = EatSense.model.Order.createOrder(record);
		this.setActiveOrder(order);

		detail = menu.down('productdetail');

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
		prodPriceLabel = detail.down('#prodPriceLabel');

		//set title
    	if(titleLabel) {
    		if(detailPanel.element.first('.productlist-header')) {
    			detailPanel.element.first('.productlist-header').destroy();
    		}    		
    		titleLabel.getTpl().insertFirst(detailPanel.element, order.getData());
    	}

    	//clear old prod descriptions otherwise the text of prev prod is visible
    	prodDetailLabel.element.setHtml('');

    	//remove existing background images
    	detailPanel.setStyle({
			'background-image': 'none',
             'min-height': '0px'
		});

		
		this.getApplication().getController('CheckIn').activateWelcomeAndBasicMode(detail);
		
		//reset product amount
		amountField.setValue(1);
		//disable because of focus bug
		amountField.setDisabled(true);
		
        //if basic mode is active, hide amount field
        if(activeBusiness.get('basic')) {
            amountField.setHidden(true);
        } else {
            amountField.setHidden(false);
            //register listener for amount field
            amountField.un({
                change: me.amoundFieldChanged,
                scope: this
            });

            amountField.on({
                change: me.amoundFieldChanged,
                scope: this
            });
        }

        if(prodPriceLabel) {
            me.recalculate(order);
        }


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
			//delay creation of options to pretend quicker reaction
			Ext.create('Ext.util.DelayedTask', function () {
                detail.fireEvent('showdetaildelayed');
            }).delay(150);
		}

		//create the detail options
		function createOptionsDelayed() {
        	//DEBUG
        	// order.set('productImageUrl', 'res/images/background.png');

            //set product description
            prodDetailLabel.getTpl().overwrite(prodDetailLabel.element, order.getData());

			if(order.get('productImageUrl')) {
				detailPanel.setStyle(
    				{
    					'background-image': 'url('+order.get('productImageUrl')+'=s720)', 
    					'background-size': '100% auto',
    					'background-position': 'center top',
    					'min-height': '150px',
    					'background-repeat': 'no-repeat'
    				}
                );

			}			
			
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
				// label: i10n.translate('orderComment'),
				// labelAlign: 'top',
				itemId: 'productComment',
				maxRows: 3,
				value: '',
				inputCls: 'comment-input',
				// labelCls: 'comment',
                placeHolder: i10n.translate('orderComment'),
                margin: '5 20 15 10'
			});			

			//TODO 24.10.2013 check if no problems occur not adding the comment field in basic mode
			commentField.setHidden(activeBusiness.get('basic'));

			//WORKAROUND prevent the focus event from propagating to textarea triggering keyboard popup
			choicesPanel.add(commentField);			
			commentField.setDisabled(true);

			detail.getScrollable().getScroller().scrollToTop();			

			//TODO Workaround because input gets focus
			//http://www.sencha.com/forum/showthread.php?258560-Input-gets-false-focus-after-switching-to-card!&p=946604#post946604
			Ext.create('Ext.util.DelayedTask', function () {
				amountField.setDisabled(false);
				commentField.setDisabled(false);          
            }).delay(300);            
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
							cls: 'options',
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
	    	    		me.clearMenuStores();
	    	    		me.clearProductStore();
	    	    		//refresh menu
	    	    		me.showMenu();

	    	    	} else {
		    	    	me.getApplication().handleServerError({
	                        	'error': response, 
	                        	'forceLogout': {403:true}
	                    });	
	    	    	}	
	    	    }
	    	});

			me.switchView(this.getProductoverview());

			message = i10n.translate('productPutIntoCardMsg', this.getActiveOrder().get('productName'));
			this.setActiveOrder(null);
			

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
	 * Switches to another view
	 * @param view
	 * 		new view
	 * @param direction
	 * 			Direction for switch animation.
	 */
	switchView: function(view, direction) {
		var menu = this.getMenuview();
		
        if(menu && view) {
            menu.switchMenuview(view, direction);    
        }
    	
	},
	/**
	 * Recalculates the total price for the active product.
	 */
	recalculate: function(order) {		
        var price,
            pLabel = this.getProdPriceLabel();

        if(!order) {
            console.error('Menu.recalculate: no order given');
            return;
        }

        if(!pLabel) {
            console.error('Menu.recalculate: no product price label found');
            return;   
        }

        price = order.calculate();

        if(price > 0) {
            pLabel.getTpl().overwrite(pLabel.element, {order: order});    
            pLabel.setHidden(false);
        } else {
            pLabel.setHidden(true);
        }
		
	},

	amoundFieldChanged: function(field, newVal, oldVal) {
		console.log('Menu.amoundFieldChanged: ' + newVal);

		if(newVal != oldVal) {
			
			if(!Ext.isNumeric(newVal)) {
				//reset old value
				field.suspendEvents();
				field.setValue(oldVal);
				field.resumeEvents();
				return;
			}

            if(newVal < 1) {
                field.suspendEvents();
                field.setValue(1);
                newVal = 1;
                field.resumeEvents();
            }

            if(newVal > 100) {
                field.suspendEvents();
                field.setValue(100);
                newVal = 100;
                field.resumeEvents();
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
        try {
            this.clearMenuStores();
            this.clearProductStore();

            //show menu first level
            this.switchView(this.getMenuoverview(), 'right');
        } catch(e) {
            console.error('Menu.cleanup: failed ' + e);
        }		
	},
	/**
	* Clear Menu store and nested stores (product, choices, options).
	*/
	clearMenuStores: function() {
		var menuStore = Ext.StoreManager.lookup('menuStore');

		menuStore.clearFilter();
		//clear sorters
		menuStore.data.setAutoSort(false);
		menuStore.setSorters([]);
		menuStore.data.setAutoSort(true);
		
		menuStore.each(function(menu) {
			//removed the hasMany relation in menu model
       		// menu.products().each(function(product) {
	        // product.choices().each(function(choice) {
	        //     choice.options().removeAll(true);
	        // });  
	    	   //  product.choices().removeAll(true);
	        // });
	       	// menu.products().removeAll(true);
	       	menu.destroy();
	    });

	    //remove menu to prevent problems on reload
	    menuStore.removeAll(); 
	},

	/**
	* Filter and sort the product store.
	* @param {EatSense.model.Menu} menu
	*	show products for given menu
	* @param {Boolean} clear
	*	True to remove existing filters.
	*/
	filterProductStore: function(menu, clear) {
		var productStore = Ext.StoreManager.lookup('productStore'),
			menuFilter;

		if(clear) {
			productStore.clearFilter(true);	
		}

		if(menu) {

			menuFilter = new Ext.util.Filter({
		    	root : 'data',
		    	property: 'menuId',
		    	value: menu.get('id'),
		    	exactMatch: true
			});

			productStore.data.removeFilters(['menuId']);
			productStore.data.setAutoSort(false);
			productStore.setSorters([
		    	{
		    		sorterFn: function(product1, product2) {
		    			var indexOf1,
		    				indexOf2;
		    			if(!menu || !menu.raw || !menu.raw.productIds || menu.raw.productIds.length == 0) {
							return false;
		    			}

		    			indexOf1 = menu.raw.productIds.indexOf(product1.get('id'));
		    			indexOf2 = menu.raw.productIds.indexOf(product2.get('id'));

		    			if(indexOf1 < indexOf2) {
		    				return -1;
		    			}

		    			if(indexOf1 > indexOf2) {
		    				return 1;
		    			}

		    			//should not occur
		    			return 0;
		    		}	
		    	}
	    	]);
	    	productStore.data.setAutoSort(true);

			productStore.filter(menuFilter);	
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
                } else {
                    console.log('Menu.loadProducts: load success');
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
			productStore.clearFilter();
			//clear sorters
			productStore.data.setAutoSort(false);
			productStore.setSorters([]);
			productStore.data.setAutoSort(true);

			productStore.each(function(product) {
		        product.choices().each(function(choice) {
		            choice.options().removeAll(true);
		        });  
	    	    product.choices().removeAll(true);
	    	    product.destroy();
	        });
		       
			productStore.removeAll();
			
		} catch(e) {
			console.log('Menu.clearProductStore: failed to clear store. ' + e);
		}
	}

     	
});

