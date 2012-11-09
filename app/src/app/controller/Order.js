	Ext.define('EatSense.controller.Order', {
	extend: 'Ext.app.Controller',
	requires: ['Ext.picker.Picker'],
	config: {
		refs: {
			main : 'mainview',			
			cartview : 'carttab',
			cartoverviewTotal: 'carttab #carttotalpanel label',
			myordersTotal : 'myorderstab #myorderstotalpanel label',
			myordersComplete: 'myorderstab #myorderscompletepanel',
			myordersCompleteButton: 'myorderstab button[action=complete]',
			menutab: 'menutab',
			orderlist : 'carttab #orderlist',
			cancelAllOrdersBt : 'carttab button[action="trash"]',
			submitOrderBt : 'carttab button[action="order"]',
			topToolbar : 'carttab #cartTopBar',
			productdetail : {
                selector: 'orderdetail',
                xtype: 'orderdetail',
                autoCreate: true
            },
			choicespanel : 'orderdetail #choicesPanel',
			editOrderBt : 'cartoverviewitem button[action=edit]',
			cancelOrderBt : 'cartoverviewitem button[action=cancel]',
			amountSpinner : 'orderdetail spinnerfield',
			prodDetailLabel :'orderdetail #prodDetailLabel' ,
			prodPriceLabel :'orderdetail #prodPriceLabel' ,
			closeOrderDetailBt: 'orderdetail button[action=close]',
			loungeview : 'lounge',
			//the orderlist shown in lounge in myorders tab lounge tab #myorderstab
			myorderlist: 'myorderstab list',
			myordersview: 'lounge myorderstab',
			// myordersTabBt: 'lounge button[title='+i10n.translate('myOrdersTabBt')+']',
			//TODO find a better way to select tab
			myordersTabBt: 'lounge #ext-tab-3',
			loungeTabBar: '#loungeTabBar',
			paymentButton: 'myorderstab button[action="pay"]',
			leaveButton: 'clubarea clubdashboard button[action="exit"]',
			confirmEditButton: 'orderdetail button[action="edit"]',
			undoEditButton: 'orderdetail button[action="undo"]',
			clubarea: 'clubarea',
			checkoutDescription: 'myorderstab #description',
			myordersShowCartButton: 'myorderstab button[action=show-cart]',
			myordersCartBackButton: 'myorderstab carttab button[action=back]'
		},
		control: {
			cancelAllOrdersBt : {
				 tap: 'dumpCart'
			 }, 
			 submitOrderBt : {
				 tap: 'submitOrders'
			 },
			 editOrderBt : {
				tap: 'showOrderDetail'
			 },
			 cancelOrderBt : {
			 	tap: 'cancelOrder'
			 },
             amountSpinner : {
            	 spin: 'amountChanged'
             },
             paymentButton: {
            	 tap: 'choosePaymentMethod'
             },
             myordersCompleteButton : {
            	 tap: 'completePayment'
             },
             leaveButton : {
            	 tap: 'leave'
             }, 
             closeOrderDetailBt: {
             	tap: 'closeOrderDetailButtonHandler'
             },
             confirmEditButton: {
             	tap: 'editOrder'
             },
             undoEditButton: {
             	tap: 'closeOrderDetailButtonHandler'
             }, 
             myorderlist: {
             	itemtap: 'toggleOrderDetail'
             },
             myordersview: {
             	activate: 'myordersviewActivated'
             },
             myordersShowCartButton: {
             	tap: 'myordersShowCartButtonHandler'
             },
             myordersCartBackButton : {
             	tap: 'myordersCartBackButtonHandler'
             }
		},
		/**
		*	Current active order.
		*/
		activeOrder: null,
		/**
		*	Current active bill.
		*/
		activeBill: null,
		//TODO remove
		cartNavigationFunctions : new Array(),
		myordersNavigationFunctions : new Array()
	},
	init: function() {
		//store retrieved models
		var	messageCtr = this.getApplication().getController('Message');

    	messageCtr.on('eatSense.order', this.handleOrderMessage, this);
    	messageCtr.on('eatSense.bill', this.handleBillMessage, this);
	},
	/**
    * Activate event handler for myordersview.
    */
	myordersviewActivated: function(tab, options) {
		tab.setActiveItem(0);
	},
	/**
	 * Load cart orders.
	 * @return
	 * 		<code>false</code> if cart is empty, <code>true</code> otherwise
	 */
	refreshCart: function() {
		console.log('Cart Controller -> showCart');
		var 
			// cartview = this.getCartview(), 
			cartviews = this.getLoungeview().query('carttab'),
			orderlists = this.getLoungeview().query('carttab #orderlist'),
			orderlist = this.getOrderlist(),
			orders = this.getApplication().getController('CheckIn').getActiveCheckIn().orders(),
			total = 0,
			currentList,
			currentTotal;
    	
    	total = this.calculateOrdersTotal(orders);	

		// orderlist.setStore(orders);
		Ext.Array.each(cartviews, function(view) {
			currentList = view.down('#orderlist');
			currentList.setStore(orders);
			currentList.refresh();
			currentTotal = view.down('#carttotalpanel label');
			currentTotal.getTpl().overwrite(currentTotal.element, {'price':total});
		});
		

		this.setActiveOrder(null);
			
		// this.getCartoverviewTotal().getTpl().overwrite(this.getCartoverviewTotal().element, {'price':total});
		this.updateCartButtons();
		// this.toggleCartButtons();
		return true;
	},
	/**
	 * Show menu.
	 */
	showMenu: function() {
		//TODO not used
		var lounge = this.getLoungeview(), menu = this.getMenutab();		
		lounge.setActiveItem(menu);
	},
	/**
	* 
	*/
	myordersShowCartButtonHandler: function(button) {
		var me = this,
			myordersview = this.getMyordersview(),
			cartview = myordersview.down('carttab');

		this.getApplication().getController('Order').refreshCart();
		myordersview.setActiveItem(cartview);
		// this.setActiveNavview(myordersNavview);

		this.getApplication().getController('Android').addBackHandler(function() {
            // myordersNavview.pop();
            me.backToMyorders();
        });
	},
	/**
	* Show my orders
	*/
	showMyorders: function() {
		var lounge = this.getLoungeview(), 
			view = this.getMyordersview();

		lounge.setActiveItem(view);

		//
		this.backToMyorders();
	},
	/**
	* Set Myordersview active in myorders tab cart layout.
	*/
	backToMyorders: function() {
		var myordersview = this.getMyordersview();

		myordersview.switchTo(0, 'right');
	},
	/**
	* Tap event handler for cart back button in myorders view.
	*/
	myordersCartBackButtonHandler: function(button) {
		this.getApplication().getController('Android').removeLastBackHandler();
		this.backToMyorders();
	},
	/**
	 * Remove all orders from cart and switch back to menu.
	 */
	dumpCart: function() {
		console.log('Cart.dumpCart');
		var me = this,
			activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn();
		
		Ext.Msg.show({
			title: i10n.translate('hint'),
			message: i10n.translate('dumpCart'),
			buttons: [{
				text: i10n.translate('yes'),
				itemId: 'yes',
				ui: 'action'
			}, {
				text:  i10n.translate('no'),
				itemId: 'no',
				ui: 'action'
			}],
			scope: this,
			fn: function(btnId, value, opt) {
			if(btnId=='yes') {
				//workaround, because view stays masked after switch to menu
				Ext.Msg.hide();
				//cart is empty jump back to previews menu view
				this.getApplication().getController('Menu').backToPreviousView();
				Ext.Ajax.request({				
			    	    url: appConfig.serviceUrl+'/c/checkins/'+activeCheckIn.get('userId')+'/cart/',
			    	    method: 'DELETE',
			    	    success: function(response) {
			    	    	//clear store				
							activeCheckIn.orders().removeAll();
							//reset badge text on cart button and switch back to menu
							me.refreshCart();
			    	    },
			    	    failure: function(response) {
							me.getApplication().handleServerError({
								'error': { 'status' : response.status, 'statusText' : response.statusText}, 
			                    'forceLogout': {403:true}
			                }); 
						}
			    });				
				}
			}
		});				
	},
	/**
	 * Submits orders to server.
	 */
	submitOrders: function() {
		console.log('Cart Controller -> submitOrders');
		var checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(), 
			orders = checkIn.orders(),
			checkInId = checkIn.get('userId'),
			businessId = checkIn.get('businessId'),
			errorIndicator = false,
			cartview = this.getCartview(),
			ajaxOrderCount = 0,
			ordersCount = orders.getCount(),
			menuCtr = this.getApplication().getController('Menu'),
			androidCtr = this.getApplication().getController('Android'),
			me = this;
		
		if(ordersCount > 0) {
			Ext.Msg.show({
				title: i10n.translate('hint'),
				message: i10n.translate('submitOrdersQuestion'),
				buttons: [{
					text: i10n.translate('yes'),
					itemId: 'yes',
					ui: 'action'
				}, {
					text: i10n.translate('no'),
					itemId: 'no',
					ui: 'action'
				}],
				scope: this,
				fn: function(btnId, value, opt) {
				if(btnId=='yes') {					
					// cartview.showLoadScreen(true);
					appHelper.toggleMask('submitOrderProcess');
					this.getSubmitOrderBt().disable();
					this.getCancelOrderBt().disable();
					
					Ext.Ajax.request({
						url: appConfig.serviceUrl+'/c/checkins/'+checkInId+'/cart',
						method: 'PUT',
						jsonData: {}, //empty object needed, otherwise 411 gets thrown
						success: function(response) {
			    	    	// cartview.showLoadScreen(false);
			    	    	appHelper.toggleMask(false);
			    	    	me.getSubmitOrderBt().enable();
			    	    	me.getCancelOrderBt().enable();
							orders.removeAll();
							me.refreshCart();
							me.refreshMyOrdersList();

							//initial view and no backhandlers left
							// me.setMyordersNavigationFunctions(new Array());
							androidCtr.removeAllBackHandlers();
							//show my ordes view
							me.showMyorders();
							//switch back to menu and remove previous backhandler
							menuCtr.backToMenu();

							// me.getLoungeview().switchTab(me.getMenutab() ,'left');

							//show success message
							Ext.Msg.show({
								title : i10n.translate('success'),
								message : i10n.translate('orderSubmit'),
								buttons : []
							});
							
							Ext.defer((function() {
								if(!appHelper.getAlertActive()) {
									Ext.Msg.hide();
								}
							}), appConfig.msgboxHideTimeout, this);
						},
						failure: function(response) {
							// cartview.showLoadScreen(false);
							appHelper.toggleMask(false);
			    	    	me.getSubmitOrderBt().enable();
			    	    	me.getCancelOrderBt().enable();
							// me.getOrderlist().setStore(orders);
							me.getApplication().handleServerError({
								'error': { 'status' : response.status, 'statusText' : response.statusText}, 
			                    'forceLogout': {403:true}
			                }); 
						}
					});
					}
				}
			});						
	}
	},
	/**
	 * Displays detailed information for an existing order (e.g. Burger)
	 * @param dataview
	 * @param order
	 */	 
	// showOrderDetail: function(dataview, order) {
	showOrderDetail: function(button, eventObj, eOpts) {
		console.log("Cart Controller -> showOrderDetail");		
		 var 	me = this,
		 		detail = this.getProductdetail(), 
		 		choicesPanel =  this.getChoicespanel(),
		 		order = button.getParent().getRecord(),		 				 		
		 		main = this.getMain(),
		 		titlebar = detail.down('titlebar'),
		 		menuCtr = this.getApplication().getController('Menu');

		this.setActiveOrder(order),

		me.getApplication().getController('Android').addBackHandler(function() {
			me.closeOrderDetail();
		});

		 //save state of order to undo changes
		 order.saveState();

		 choicesPanel.removeAll(false); 
		 //reset product spinner
		 this.getAmountSpinner().setValue(order.get('amount'));

		 //set title
		 titlebar.setTitle(order.get('productName'));

		 this.getProdDetailLabel().getTpl().overwrite(this.getProdDetailLabel().element, {order: order, amount: this.getAmountSpinner().getValue()});
		 this.getProdPriceLabel().getTpl().overwrite(this.getProdPriceLabel().element, {order: order, amount: this.getAmountSpinner().getValue()});
		 //dynamically add choices if present		 
		 if(typeof order.choices() !== 'undefined' && order.choices().getCount() > 0) {

		 	//render all main choices
		 	order.choices().queryBy(function(rec) {
		 	 	if(!rec.get('parent')) {
		 	 		return true;
		 	 	}}).each(function(choice) {
					var optionsDetailPanel = Ext.create('EatSense.view.OptionDetail'),
						choicePriceLabel = (choice.get('overridePrice') == 'OVERRIDE_FIXED_SUM') ? ' (+' + appHelper.formatPrice(choice.get('price')) + ')' : '';

					optionsDetailPanel.getComponent('choiceTextLbl').setHtml(choice.data.text + choicePriceLabel);
					menuCtr.createOptions(choice, optionsDetailPanel);
					choice.on('recalculate', function() {
						me.recalculate(order);
					});
					// menuCtr.createOptions.apply(me, [choice, optionsDetailPanel, null, order]);
					//process choices assigned to a this choice
					order.choices().queryBy(function(rec) {
						if(rec.get('parent') == choice.get('id')) {
							return true;
						}
					}).each(function(memberChoice) {
						memberChoice.setParentChoice(choice);
						menuCtr.createOptions(memberChoice, optionsDetailPanel, choice);
						choice.on('recalculate', function() {
							me.recalculate(order);
						});
						// menuCtr.createOptions.apply(me, [memberChoice, optionsDetailPanel, choice, order]);
					});

					choicesPanel.add(optionsDetailPanel);
		 	 });
		}
		 
		 
		 //insert comment field after options have been added so it is positioned correctly
		 choicesPanel.add({
				xtype: 'textareafield',
				label: i10n.translate('orderComment'),
				labelAlign: 'top',
				itemId: 'productComment',
				value: order.get('comment'),
				inputCls: 'comment-input',
				labelCls: 'comment'
			}
		);
		Ext.Viewport.add(detail);
		detail.getScrollable().getScroller().scrollToTop();
		detail.show();
	},
	/**
	 * Edit an existing order.
	 */
	editOrder : function(component, eOpts) {
		var me =this,
			order = this.getActiveOrder(),
			validationError = "", 
			validationResult = null,
			productIsValid = true,
			activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			detail = this.getProductdetail();
		
		order.getData(true);

		//validate choices 
		order.choices().each(function(choice) {
				validationResult = choice.validateChoice();

				if(!validationResult.valid) {
					productIsValid = false;
					validationError += validationResult.errMsgs;
				};
		});
		
		if(productIsValid) {
			this.getActiveOrder().set('comment', this.getChoicespanel().getComponent('productComment').getValue());	
		
			Ext.Ajax.request({				
	    	    url: appConfig.serviceUrl+'/c/businesses/'+activeCheckIn.get('businessId')+'/orders/'+order.getId(),
	    	    method: 'PUT',
	    	    jsonData: order.getRawJsonData(),
	    	    failure: function(response) {
					me.getApplication().handleServerError({
                    	'error': { 'status' : response.status, 'statusText' : response.statusText}, 
                    	'forceLogout': {403:true}
                    }); 
				}
			});

			detail.hide();
			this.refreshCart();
			return true;
		} else {
			//show validation error
			Ext.Msg.alert(i10n.translate('orderInvalid'),validationError, Ext.emptyFn, detail);
			if(component) {
				//component exists if this was called by hide listener
				component.show();
			}
			return false;
		}
		
	},

	/**
	*	Deletes a single order.
	* 	Called by cancelButton of an individual order.
	*
	*/
	cancelOrder: function(button, eventObj, eOpts) {
		var 	order = button.getParent().getRecord(),
				activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
				productName = order.get('productName');
			//delete item
			activeCheckIn.orders().remove(order);
			
			Ext.Ajax.request({
	    	    url: appConfig.serviceUrl+'/c/businesses/'+activeCheckIn.get('businessId')+'/orders/'+order.getId(),
	    	    method: 'DELETE',
	    	    failure: function(response) {
					me.getApplication().handleServerError({
	                	'error': { 'status' : response.status, 'statusText' : response.statusText}, 
	                	'forceLogout': {403:true}
	                }); 
				}
	    	});
			
			this.refreshCart();
			//if no orders are left jump back to menu view
			if(activeCheckIn.orders().getCount() == 0) {
				this.getApplication().getController('Menu').backToPreviousView();
			};
			
			//show success message and switch to next view
			Ext.Msg.show({
				title : i10n.translate('orderRemoved'),
				message : productName,
				buttons : []
			});
			//show short alert and then hide
			Ext.defer((function() {
				if(!appHelper.getAlertActive()) {
						Ext.Msg.hide();
				}
			}), appConfig.msgboxHideTimeout, this);
	},
	/**
	* Tap event handler for close button in order detail.
	*
	*/
	closeOrderDetailButtonHandler: function(button) {
		this.getApplication().getController('Android').removeLastBackHandler();
		this.closeOrderDetail();
	},
	/**
	* Close order detail and restore state of order.
	*/
	closeOrderDetail: function() {
		var detail = this.getProductdetail();
		
		this.getActiveOrder().restoreState();
		//try to avoid unecessary calculation, only needed to update price after cancelation
		this.recalculate(this.getActiveOrder());
		this.refreshCart();
		detail.hide();
	},
	/**
	 * Called when the product spinner value changes. 
	 * Recalculates the price.
	 * @param spinner
	 * @param value
	 * @param direction
	 */
	amountChanged: function(spinner, value, direction) {
		console.log('Cart Controller > amountChanged (value:'+value+')');
		this.getActiveOrder().set('amount', value);
		this.recalculate(this.getActiveOrder());
	},
	/**
	 * Recalculates the total price for the active product.
	 */
	recalculate: function(order) {
		console.log('Cart Controller -> recalculate');
		this.getProdPriceLabel().getTpl().overwrite(this.getProdPriceLabel().element, {order: order, amount: order.get('amount')});
	},
	/**
	 * Updates the badge text on cart buttons based on amount of orders.
	 * If no orders are present hide the button.
	 * Displays the number of orders.
	 * @param clear
	 *	true to set badge text to empty string
	 */
	updateCartButtons: function(clear) {
		var cartButtons = this.getLoungeview().query('button[action=show-cart]'),
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			menuCtr = this.getApplication().getController('Menu'),
			badgeText;
		
		if(clear == true) {
			Ext.Array.each(cartButtons, function(button) {
				button.setBadgeText("");	
			});

			menuCtr.showCartButtons(false);		
		} else {
			if(!checkIn || checkIn.orders().getCount() == 0 ) {
				badgeText = "";
				menuCtr.showCartButtons(false);				
			} else {
				badgeText = checkIn.orders().getCount();
				menuCtr.showCartButtons(true);
			}
			
			Ext.Array.each(cartButtons, function(button) {
				button.setBadgeText(badgeText);	
			});
		}
	},
	/**
	* Refresehes the badge text of myorders tab icon.
	* Displays the number of placed orders.
	*/
	refreshMyOrdersBadgeText: function(clear) {
		var button = this.getMyordersTabBt(),
			orderStore = Ext.StoreManager.lookup('orderStore'),
			badgeText;

		if(clear) {
			button.setBadgeText("");			
			if(orderStore && orderStore.getCount() > 0) {
				this.getCheckoutDescription().setHidden(true);
			}
		} else {

			if(orderStore && orderStore.getCount() > 0) {
				badgeText = orderStore.getCount();
				//hide description when checkout is empty
				this.getCheckoutDescription().setHidden(true);
			} else {
				badgeText = '';
				//show description when checkout is empty
				this.getCheckoutDescription().setHidden(false);
			}
			button.setBadgeText(badgeText);
		}
	},
	/**
	 * Refresh myorderlist and recalculate the total price.
	 */
	refreshMyOrdersList: function() {
		var 	me = this,
				myorderlist = me.getMyorderlist(),
				myordersStore = Ext.data.StoreManager.lookup('orderStore'),
				activeCheckIn = me.getApplication().getController('CheckIn').getActiveCheckIn(),
				payButton = me.getPaymentButton(),
				leaveButton = me.getLeaveButton();
		
		//remove all orders and reload to have a fresh state
		myordersStore.removeAll();
		
		myordersStore.load({
			scope   : this,			
			callback: function(records, operation, success) {
				try {
					if(success == true) {
						payButton.enable();
						me.toggleMyordersButtons();

						//WORKAROUND to make sure all data is available in data property
						//otherwise nested choices won't be shown
						Ext.each(records, function(order) {
							order.getData(true);
						});
						
						//refresh the order list
						total = me.calculateOrdersTotal(myordersStore);
						myorderlist.refresh();
						me.getMyordersTotal().getTpl().overwrite(me.getMyordersTotal().element, {'price': total});
						me.refreshMyOrdersBadgeText();
					} else {
						payButton.disable();			
						me.getApplication().handleServerError({
							'error': operation.error,
							'forceLogout': {403: true}
						});
					}	
				} catch(e) {
					
				}
				
				me.getMyordersview().showLoadScreen(false);
			}
		});
		
	},
	/**
	 * Calculates and returns the total price of all orders.
	 * 
	 * @param orderStore
	 * 		An order store instance for which to calculate the total price.
	 * 
	 * @return
	 * 		total price or 0 if an error occured or no orders exist.
	 */
	calculateOrdersTotal: function(orderStore) {
		var total = 0;
		
		if(orderStore != null && orderStore !== 'undefined') {
			orderStore.each(function(order) {
				total += order.calculate();
				total = Math.round(total * 100) / 100;
			});
		}
			
		return total;
	},
	//TODO remove dead code 19.10.2012
	// showMyOrderDetail: function(list, index, dataitem) {
	// 	var panel = Ext.create('Ext.Panel');
	// 	panel.setWidth(200);
	// 	panel.setHeight(200);
	// 	panel.setModal(true);
	// 	panel.setHideOnMaskTap(true);

	// 	panel.showBy(dataitem);
	// },
	/**
	 * Choose a payment method to issue the paymentRequest.
	 */
	choosePaymentMethod: function() {
		console.log('Order Controller -> choosePaymentMethod');
		var availableMethods = this.getApplication().getController('CheckIn').getActiveSpot().payments(),
			orderCount = this.getMyorderlist().getStore().getCount(),
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			picker,
			choosenMethod,
			me = this;
		
		if(orderCount>0 && checkIn.get('status') !== appConstants.PAYMENT_REQUEST && checkIn.get('status') !== appConstants.COMPLETE) {

			//create picker
			picker = Ext.create('Ext.Picker', {
				height: '45%',
				doneButton: {
					text: i10n.translate('ok'),
					listeners: {
						tap: function() {
							//TODO investigate if bug
							choosenMethod = picker.getValue()['null'];
							picker.hide();						
							me.paymentRequest(choosenMethod);
						}
					}
				},
				cancelButton: {
					text: i10n.translate('cancel'),
					listeners: {
						tap: function() {
							picker.destroy();					
						}
					}
				},
			    slots: [
			        {
			        	align: 'center',
			        	 valueField: 'name',
			             displayField: 'name',
			            title: i10n.translate('paymentPickerTitle'),
			            store: availableMethods
			        }
			    ]
			});

			me.getApplication().getController('Android').addBackHandler(function() {
				picker.destroy();	
			});
									
			Ext.Viewport.add(picker);
			picker.show();
		}
	},
	
	/**
	 * Request the payment.
	 * Creates a new bill object and sends via POST to the server. 
	 * CheckIn gets the status PAYMENT_REQUEST and no more orders can be issued.
	 * 
	 * @param paymentMethod
	 * 			The chose payment method.
	 * 
	 */
	paymentRequest: function(paymentMethod) {
		var bill = Ext.create('EatSense.model.Bill'),
			checkInCtr = this.getApplication().getController('CheckIn'),
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			myordersComplete = this.getMyordersComplete(),
			payButton = this.getPaymentButton(),
			menuCtr = this.getApplication().getController('Menu'),
			me = this,
			date = new Date();		

		bill.set('paymentMethod', paymentMethod);

		//FR ST2-1 Bug in Writer.js with a null pointer in L.92, explicitly set time
		bill.set('time', date);
		//workaround to prevent sencha from sending phantom id
		bill.setId('');
		//TODO show load mask to prevent users from issuing orders?!
		
		bill.save({
			scope: this,
			success: function(record, operation) {
					me.setActiveBill(record);
					checkInCtr.fireEvent('statusChanged', appConstants.PAYMENT_REQUEST);
					payButton.hide();
					myordersComplete.show();
					me.refreshMyOrdersBadgeText(true);
					menuCtr.showCartButtons(false);		
					me.getApplication().getController('Android').removeLastBackHandler();		
			},
			failure: function(record, operation) {
				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});
			}
		});

		//show success message to give user the illusion of success ;)
		Ext.Msg.show({
			title : i10n.translate('hint'),
			message : i10n.translate('paymentRequestSend'),
			buttons : []
		});
		
		Ext.defer((function() {
			if(!appHelper.getAlertActive()) {
				Ext.Msg.hide();
			}
		}), appConfig.msgboxHideLongTimeout, this);
	},
	/**
	 * Called when user checks in and wants to leave without issuing an order.
	 */
	leave: function() {
		var	me = this,
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			myordersStore = Ext.data.StoreManager.lookup('orderStore');

		if(checkIn.get('status') != appConstants.PAYMENT_REQUEST && myordersStore.getCount() ==  0) {
			Ext.Msg.show({
				title: i10n.translate('hint'),
				message: i10n.translate('clubdashboard.leave.message'),
				buttons: [{
					text: i10n.translate('yes'),
					itemId: 'yes',
					ui: 'action'
				}, {
					text: i10n.translate('no'),
					itemId: 'no',
					ui: 'action'
				}],
				fn: function(btnId) {
					if(btnId == "yes") {
						checkIn.erase( {
							failure: function(response, operation) {
								me.getApplication().handleServerError({
									'error': operation.error,
									'forceLogout': {403: true}
								});
							}
						}
						);
						me.getApplication().getController('CheckIn').fireEvent('statusChanged', appConstants.COMPLETE);
					}
				}
			});
			
		} else {
			this.getLoungeview().setActiveItem(this.getMyordersview());
		}			
	},
	/**
	 * Marks the process as complete and returns to home menu
	 */
	completePayment: function() {
		var myordersComplete = this.getMyordersComplete();
		
		myordersComplete.hide();
		this.getApplication().getController('CheckIn').fireEvent('statusChanged', appConstants.COMPLETE);
	},	
	//UI Actions
	/**
	 * @DEPRECATED
	 * Since cart only shows when not empty, since function is unecessary.
	 * Shows (cart is not empty) or hides (cart is empty) cart buttons (trash, order).
	 */
	toggleCartButtons: function() {
		var cartview = this.getCartview(),
			trashBt = cartview.down('button[action="trash"]'),	
			orderBt = cartview.down('button[action="order"]'),
			hidden = (this.cartCount() > 0) ? false : true;
		
		trashBt.setHidden(hidden);
		orderBt.setHidden(hidden);
	},
	/**
	 * Shows (issued orders are not empty and checkin status != PAYMENT_REQUEST) or hides (issued orders are empty) myorders buttons (pay).
	 */
	toggleMyordersButtons: function() {
		var payButton = this.getPaymentButton(),
			myordersStore = Ext.StoreManager.lookup('orderStore'),
			activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn();

		(activeCheckIn.get('status') != appConstants.PAYMENT_REQUEST && myordersStore.getCount() > 0) ? payButton.show() : payButton.hide();
	},
	toggleOrderDetail: function(view, index, htmlElement, order) {		
    // change the div plus to minu..
    // Get hold of the div with details class and animate
    	var el = htmlElement.element.select('div.myorder-detail'),
    		convert = Ext.get(el.elements[0]),
    		priceDiv = htmlElement.element.select('td.arrow');
    	
    	convert.toggleCls('hidden');
    	priceDiv.toggleCls('collapsed-arrow');
    	priceDiv.toggleCls('expanded-arrow');
	},
	//Utility methods
	/**
	 * Returns number of orders in cart.
	 */
	cartCount: function() {
		var orders = this.getApplication().getController('CheckIn').getActiveCheckIn().orders();
		
		if(orders == null) {
			return 0;
		}
		
		return orders.getCount();		
	},
	/**
	 * Returns number of issued orders.
	 * May not always reflect the current state!!
	 * 
	 * @returns
	 */
	myordersCount: function() {
		var myordersStore = Ext.data.StoreManager.lookup('orderStore');
		
		if(myordersStore == null) {
			return 0;
		}
		
		return myordersStore.getCount();		
	},
	/**
	*	Handles push notifications for orders.
	*/
	handleOrderMessage: function(action, updatedOrder) {
		var me = this,
			orderStore = Ext.StoreManager.lookup('orderStore'),
			oldOrder,
			total;

		if(action == "update") {
			oldOrder = orderStore.getById(updatedOrder.id);
			if(oldOrder) {
				oldOrder.setRawJsonData(updatedOrder, true)
				//refresh the order list
				total = me.calculateOrdersTotal(orderStore);
				me.getMyordersTotal().getTpl().overwrite(me.getMyordersTotal().element, {'price': total});
			} else {
				console.log('updatedOrder ' + updatedOrder.id + ' does not exist');
			}
		} else if(action == 'delete') {
			console.log('delete order with id ' + updatedOrder.id);

			oldOrder = orderStore.getById(updatedOrder.id);
			if(oldOrder) {
				orderStore.remove(oldOrder);
				total = me.calculateOrdersTotal(orderStore);
				me.getMyordersTotal().getTpl().overwrite(me.getMyordersTotal().element, {'price': total});
				me.refreshMyOrdersBadgeText();
				me.toggleMyordersButtons();

				Ext.Msg.show({
					title : i10n.translate('hint'),
					message : i10n.translate('orderCanceled', oldOrder.get('productName')),
					buttons : [{
						text : i10n.translate('continue'),
						ui: 'action'
					}]
				});
			}

		}
	},
	/**
	* Handles push notifications for bills.
	* @param action
	*	Message action like new, update...
	* @param billdata
	*	Object with bill data
	*/
	handleBillMessage: function(action, billdata) {
		var bill = Ext.create('EatSense.model.Bill'),
			// paymentMethod = Ext.create('EatSense.model.PaymentMethod'),
			checkInCtr =  this.getApplication().getController('CheckIn'),
			myordersComplete = this.getMyordersComplete(),
			payButton = this.getPaymentButton(),
			lounge = this.getLoungeview(), 
			tab = this.getMyordersview();				

		if(action == "new") {
			//this occurs when business manually completes a checkin
			console.log("Order.handleBillMessage > new bill arrived. Businesses completed checkin.");
			bill.set('id', bill.id);
			bill.set('checkInId', bill.checkInId);
			bill.set('paymentMethod', billdata.paymentMethod.name);
			this.setActiveBill(bill);						
			lounge.setActiveItem(tab);
			myordersComplete.show();
			this.refreshMyOrdersBadgeText(true);
			payButton.hide();
			
			
			checkInCtr.fireEvent('statusChanged', appConstants.PAYMENT_REQUEST);

			//show a message 
			Ext.Msg.alert(i10n.translate('hint'), i10n.translate('myorders.messages.billnew.message', bill.get('paymentMethod')));
		}
	},
	/**
	* Close windows, reset fields and so on...
	* E. g. used after a FORCE_LOGOUT
	*/
	cleanup: function() {
		var detail = this.getProductdetail(),
			myordersStore = Ext.data.StoreManager.lookup('orderStore');
		
		//clear orders
		myordersStore.removeAll();

		//close product detail
		detail.hide();
		detail.destroy();

		this.updateCartButtons(true);
      	this.refreshMyOrdersBadgeText(true);		
	}
});