	Ext.define('EatSense.controller.Order', {
	extend: 'Ext.app.Controller',
	requires: ['Ext.picker.Picker', 'EatSense.util.Helper'],
	config: {
		refs: {		
			cartview : 'carttab',
			cartoverviewTotal: 'carttab #carttotalpanel label',
			myordersTotal : 'myorderstab #myorderstotalpanel label',
			myordersComplete: 'myorderstab #myorderscompletepanel',
			myordersCompleteButton: 'myorderstab button[action=complete]',
			menutab: 'menutab',
			orderlist : 'carttab #orderlist',
			topToolbar : 'carttab #cartTopBar',
            productdetail: 'myorderstab orderdetail',
			choicespanel : 'orderdetail #choicesPanel',
			loungeview : 'lounge',
			//the orderlist shown in lounge in myorders tab lounge tab #myorderstab
			myorderlist: 'myorderstab list',
			myordersview: 'lounge myorderstab',
			paymentButton: 'myorderstab button[action="pay"]',
			leaveButton: 'lounge button[action="exit"]',
			clubarea: 'clubarea',
			checkoutDescription: 'myorderstab #description',
			myordersShowCartButton: 'myorderstab button[action=show-cart]',
			myordersCartBackButton: 'myorderstab carttab button[action=back]',
			homeButton: 'myorderstab homebutton'
		},
		control: {
             paymentButton: {
            	 tap: 'choosePaymentMethod'
             },
             myordersCompleteButton : {
            	 tap: 'completePayment'
             },
             leaveButton : {
            	 tap: 'leave'
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
             },
             loungeview: {
             	activeitemchange: 'toggleQuickLeaveMode'
             },
             'clubarea clubdashboard' : {
             	'tilesrendered' : 'updateDashboardMenuTiles'
             }
		},
		/**
		*	Current active order.
		*/
		activeOrder: null,
		/**
		*	Current active bill.
		*/
		activeBill: null
	},
	launch: function() {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');

		checkInCtr.on({
			'statusChanged': function(status) {
				if(status == appConstants.CHECKEDIN) {
					//show homebutton
					if(me.getHomeButton()) {
						me.getHomeButton().setHidden(false);	
					}

					this.getLoungeview().on({
	                    delegate: 'menutab',
	                    show: this.updateCartButtons,
	                    single: true,
	                    scope: this
	                });

	                this.getLoungeview().on({
	                    delegate: 'myorderstab',
	                    show: this.updateCartButtons,
	                    single: true,
	                    scope: this
	                });
					
					
				} else if(status == appConstants.PAYMENT_REQUEST) {
					//show homebutton
					if(me.getHomeButton()) {
						me.getHomeButton().setHidden(true);	
					}
					//trigger leave on backbutton, otherwise user gets thrown to club dashboard although this is forbidden
					//remove handler is not required as they reset on status change
					me.getApplication().getController('Android').addBackFn(function() {
						me.completePayment();
					});
				}
				else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
					this.cleanup();
				}
			},
			'resumecheckin': function(checkIn){
				this.loadExistingOrders(checkIn);
				this.loadMyOrders(function() {
					me.refreshMyOrdersBadgeText();
				});
			}, 
			'spotswitched': function(newSpot, newCheckIn) {
				this.cleanup();
				this.refreshCart();
				// this.doDumpCart(newCheckIn);
			},
			'basicmode': this.toggleQuickLeaveMode,
			scope: this
		});
	},
	/**
	* @private
	* Activates a quick leave mode when business is a basic one.
	* Quick leave means that instead of displaying the myorders screen
	* User directly gets asked if he wants to check out.
	* @param {Boolean} basicMode
	*	indicates the state of the basic mode
	*/
	toggleQuickLeaveMode: function(basicMode) {
		var me = this,
			loungeview = this.getLoungeview(),
			listItem;

		if(loungeview) {
			listItem = loungeview.getItemByAction('show-myorders');
			//if basic mode is active hack the slide nav list and add a quick leave funtion
			if(!listItem) {
				return;
			}

			if(basicMode) {
				listItem.raw.basicFn = function() {
					me.leave();
					return;
				}
			} else {
				listItem.raw.basicFn = null;
				delete listItem.raw.basicFn;
			}
		}
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
	myordersviewActivated: function(view, options) {
		view.setActiveItem(0);
		Ext.create('Ext.util.DelayedTask', function () {
            this.refreshMyOrdersList();
	    }, this).delay(300);
	},
	/**
	 * Load cart orders.
	 * @return
	 * 		<code>false</code> if cart is empty, <code>true</code> otherwise
	 */
	refreshCart: function() {
		console.log('Order.refreshCart');
		var cartviews = this.getLoungeview().query('carttab'),
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
			
		this.updateCartButtons();
		return true;
	},
	/**
	* @private
	* Tap event handler for myordersShowCartButton 
	*/
	myordersShowCartButtonHandler: function(button) {
        this.showCart(button, this.getMyordersview(), this.getLoungeview());
	},
	/**
	 * Switches to cart view {@link EatSense.view.Cart}. Wires up all button events dynamically.
	 * This is done because of this view used in different cart views.
	 * @param {Ext.Button} button
	 *	button that called this method after its tap event
	 * @param {Ext.Panel} cardview
	 *	Panel with card layout. e.g. {@link EatSense.view.Menu}
	 * @param {Ext.tab.Panel} globalContainer
	 *	The main tab container. Used to react on tab changes.
	 */
	showCart: function(button, cardview, globalContainer) {
		var me = this,
			//active panel
			prevActiveView,
			//cartview to set
			cartView,
			//back button of cart view
			backButton,
			//dump cart button of cart view
			dumpCartButton,
			cancelOrderButtons,
			editOrderButtons,
			androidCtr = this.getApplication().getController('Android');

		if(!cardview) {
			console.log('Order.showCart: no cardview given');
			return;
		}

		prevActiveView = cardview.getActiveItem();
		cartView = cardview.down('carttab');

		//prevent multiple taps by disabling button
		button.setDisabled(true);

		Ext.defer((function() {
			button.setDisabled(false);
		}), 50, this);

		cardview.switchTo(cartView, "left");
		this.refreshCart();

		backButton = cartView.down('backbutton');
		dumpCartButton = cartView.down('button[action="trash"]');
		submitOrdersButton = cartView.down('button[action="order"]');
		cancelOrderButtons = cartView.query('cartoverviewitem button[action=cancel]');
		editOrderButtons = cartView.query('cartoverviewitem button[action=edit]');
		

		//wire up all event handlers

		//register back button
		backButton.on({
			single: true,
			tap: backToPreviousView
		});

		//register submit order button
		submitOrdersButton.on({
			tap: submitOrdersButtonTapEvent
		});

		//register dump cartbutton
		dumpCartButton.on({
			tap: dumpCartSuccesCallback
		});

		//register order cancel buttons
		Ext.Array.each(cancelOrderButtons, function(cancelBt) {
			cancelBt.on({
				tap: cancelButtonTapEvent
			});
		});

		//register edit order buttons
		Ext.Array.each(editOrderButtons, function(editBt) {
			editBt.on({
				tap: editButtonTapEvent
			});
		});

		//gets fired when all orders in cart are deleted
		me.on({
			cartcleared: backToPreviousView
		});

		//on tap change switch back to previous view
		if(globalContainer) {
			globalContainer.on({
				single: true,
				activeitemchange: backToPreviousView
			});
		}

		//switch back to previous view, could be menuoverview, productoverview or myordersview
		//unregister all not needed listeners
		function backToPreviousView() {

			me.un({
				cartcleared: backToPreviousView
			});

			//switch view
			cardview.switchTo(prevActiveView, "right");
			//remove dumpCart tap listener
			dumpCartButton.un({
				tap: dumpCartSuccesCallback
			});

			submitOrdersButton.un({
				tap: submitOrdersButtonTapEvent
			});
			//remove cancel button listeners
			Ext.Array.each(cancelOrderButtons, function(cancelBt) {
				cancelBt.un({
					tap: cancelButtonTapEvent
				});
			});

			Ext.Array.each(editOrderButtons, function(editBt) {
				editBt.un({
					tap: editButtonTapEvent
				});
			});

			backButton.un({
				single: true,
				tap: backToPreviousView
			});

			if(globalContainer) {
				globalContainer.un({
					activeitemchange: backToPreviousView
				});
			}
		}

		function dumpCartSuccesCallback() {
			me.dumpCart(backToPreviousView);
		}

		function cancelButtonTapEvent(button) {
			me.cancelOrder(button, button.getParent().getRecord(), backToPreviousView);
		}

		function submitOrdersButtonTapEvent(button) {
			me.submitOrders(cartView);
		}

		function editButtonTapEvent(button) {
			me.showOrderDetail(button, cardview);
		} 

		androidCtr.addBackHandler(function() {
			// me.backToPreviousView();
			backToPreviousView();
		});
	},
	/**
	* Show orders (leave) tab.
	*/
	showMyorders: function() {
		var lounge = this.getLoungeview()

		if(lounge.getContainer().getActiveItem() != this.getMyordersview()) {
			lounge.selectByAction('show-myorders');
		}
		
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
	 * Removes all orders from cart.
	 * @param {Function} callback (optional)
	 *	executed on succesful request
	 */
	dumpCart: function(callback) {
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
					//WORKAROUND, because view stays masked after switch to menu
					Ext.Msg.hide();
					me.doDumpCart(activeCheckIn, callback);				
				}
			}
		});				
	},
	/**
	 * Delete all orders from cart.
	 * @param {Function} callback (optional)
	 *	executed after 
	 */
	doDumpCart: function(checkIn, callback) {
		var me = this;

		if(!checkIn) {
			console.error('Order.doDumpCart: no checkIn given');
			return;
		}

		Ext.Ajax.request({				
	    	    url: appConfig.serviceUrl+'/c/checkins/'+checkIn.get('userId')+'/cart/',
	    	    method: 'DELETE',
	    	    success: function(response) {
	    	    	//clear store				
					checkIn.orders().removeAll();
					//reset badge text on cart button and switch back to menu
					me.refreshCart();
					me.fireEvent('cartcleared');
					if(EatSense.util.Helper.isFunction(callback)) {
						callback();
					}
	    	    },
	    	    failure: function(response) {
					me.getApplication().handleServerError({
						'error': response, 
	                    'forceLogout': {403:true}
	                }); 
				}
	    });
	},
	/**
	 * Submits orders to server.
	 * @param {EatSense.view.Cart} cartview 
	 *	
	 */
	submitOrders: function(cartview) {
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
			me = this,
			loungeview = this.getLoungeview(),
			myordersview = this.getMyordersview(),
			submitOrderBt,
			cancelOrderBt;

		if(!cartview) {
			console.log('Order.submitOrders: no cartview given');
			return;
		}

		Ext.Viewport.fireEvent('accountrequired', doSubmitOrders);


		function doSubmitOrders(success) {
	
		if(!success) {
			console.log('Order.submitOrders: doSubmitOrders user cancelled login');
			return;
		}

		submitOrderBt = cartview.down('button[action="order"]');
		cancelOrderBt = cartview.down('button[action="trash"]');
		
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
				scope: me,
				fn: function(btnId, value, opt) {
				if(btnId=='yes') {					
					appHelper.toggleMask('submitOrderProcess');
					submitOrderBt.disable();
					cancelOrderBt.disable();
					
					Ext.Ajax.request({
						url: appConfig.serviceUrl+'/c/checkins/'+checkInId+'/cart',
						method: 'PUT',
						jsonData: {}, //empty object needed, otherwise 411 gets thrown
						success: function(response) {
			    	    	appHelper.toggleMask(false);
			    	    	submitOrderBt.enable();
			    	    	cancelOrderBt.enable();
							
			    	    	//TODO ST 2.1 Workaround http://www.sencha.com/forum/showthread.php?249230-ST-2.1-Store-remove-record-fails-with-Cannot-call-method-hasOwnProperty-of-null&p=912339#post912339
							//because of that we manually have to call destroy
							//remove all orders and nested objects and reload to have a fresh state
							orders.each(function(order) {
					        order.choices().each(function(choice) {
						    	    choice.options().removeAll(true);
						    	    choice.destroy();
						        });					        	
						       	order.choices().removeAll(true);
						       	order.destroy();
						    });

						    orders.removeAll(false);

							me.refreshCart();
							//FR 20121109 Only refresh list when called from myordersview. since we show myorders gets called automatically
							//otherwise will load orders two times, since options don't have an id they are duplicated
							if(loungeview.getContainer() && loungeview.getContainer().getActiveItem() == myordersview) {								
								me.refreshMyOrdersList();	
							}
							

							//initial view and no backhandlers left
							androidCtr.removeAllBackHandlers();
							//show my orders view
							me.showMyorders();	
							
							//switch back to menu and remove previous backhandler
							menuCtr.backToMenu();


							//show success message
							// Ext.Msg.show({
							// 	title : i10n.translate('success'),
							// 	message : i10n.translate('orderSubmit'),
							// 	buttons : []
							// });
							
							// Ext.defer((function() {
							// 	if(!appHelper.getAlertActive()) {
							// 		Ext.Msg.hide();
							// 	}
							// }), appConfig.msgboxHideTimeout, this);
						},
						failure: function(response) {
							appHelper.toggleMask(false);
			    	    	submitOrderBt.enable();
			    	    	cancelOrderBt.enable();

							me.getApplication().handleServerError({
								'error': response, 
			                    'forceLogout': {403:true}
			                }); 
						}
					});
					}
				}
			});						
		}
		}
	},
	/**
	 * Displays detailed information for an existing order (e.g. Burger). Wires up all
	 * event handlers for actions. This is done here because this view gets called from multiple card panels.
	 * @param {Ext.Button} button
	 *	Button executing the tap event and holding the record
	 * @param {Ext.Panel} view with card layout
	 *	The card panel from which the view was called.
	 */	 
	showOrderDetail: function(button, cardview) {
		console.log("Cart Controller -> showOrderDetail");		
		 var 	me = this,
		 		detail,
		 		choicesPanel,
		 		order = button.getParent().getRecord(),
		 		detailPanel,
		 		titleLabel,
		 		prodDetailLabel,
				prodPriceLabel,
				undoButton,
				prevActiveView,
				amountField,
				commentField,
		 		menuCtr = this.getApplication().getController('Menu'),
		 		activeBusiness = this.getApplication().getController('CheckIn').getActiveBusiness();

		this.setActiveOrder(order);

		me.getApplication().getController('Android').addBackHandler(function() {
			me.closeOrderDetail();
		});

		 //save state of order to undo changes
		order.saveState();

		detail = cardview.down('orderdetail');
		choicesPanel = detail.down('#choicesPanel');
		titleLabel = detail.down('#titleLabel');
		detailPanel = detail.down('#productDetailPanel');
		prodDetailLabel = detail.down('#prodDetailLabel');
		prodPriceLabel = detail.down('#prodPriceLabel');
		amountField = detail.down('#amountField');
		prevActiveView = cardview.getActiveItem();

		undoButton = detail.down('button[action="undo"]');
		confirmButton = detail.down('button[action="edit"]');

		if(undoButton) {
			undoButton.on({
				single: true,
				tap: undoButtonTapHandler
			});
		} else {
			console.log('Order.showOrderDetail: undoButton does not exist');
		}

		function undoButtonTapHandler() {
			cardview.switchTo(prevActiveView);
			order.restoreState();
			me.closeOrderDetail(order, prodPriceLabel);
		}

		if(confirmButton) {
			confirmButton.on({
				tap: confirmButtonTapHandler
			});
		} else {
			console.log('Order.showOrderDetail: confirmButton does not exist');
		}

		function confirmButtonTapHandler() {
			if(me.editOrder(detail)) {
				cardview.switchTo(prevActiveView);	
			}			
		}

		if(amountField) {
			//set amount field
			amountField.setValue(order.get('amount'));

			//disable because of focus bug
			amountField.setDisabled(true);

			amountField.on({
				change: amountChanged
			});

			function amountChanged(field, newVal, oldVal) {

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

					me.getActiveOrder().set('amount', newVal);
					me.recalculate(me.getActiveOrder(), prodPriceLabel);
				}
			}
		}


		me.on('cartcleared', cleanup);

		detail.on('hide', cleanup);

		detail.on({
			'show' : showDetailHandler,
			'showdetaildelayed' : createOptionsDelayed,
			single: true,
			scope: this
		});

		//remove listeners and unecessary objects...
		function cleanup() {
			// console.log('Order.showOrderDetail: orderdetail cleanup');

			if(amountField) {
				amountField.un({
					change: amountChanged
				});
			}

			if(confirmButton) {
				confirmButton.un({
					tap: confirmButtonTapHandler
				});
			}

			if(undoButton) {
				undoButton.un({
					tap: undoButtonTapHandler
				});
			}

			me.un('cartcleared', cleanup);

			detail.un('hide', cleanup);
		}

		 choicesPanel.removeAll(false);

		 //set title
		 // titlebar.setTitle(order.get('productName'));

    	if(titleLabel) {
    		if(detailPanel.element.first('.productlist-header')) {
    			detailPanel.element.first('.productlist-header').destroy();
    		}
    		titleLabel.getTpl().insertFirst(detailPanel.element, order.getData());
    	}

    	//clear old price
    	prodPriceLabel.element.setHtml('');
    	//clear old prod descriptions otherwise the text of prev prod is visible
    	prodDetailLabel.element.setHtml('');

    	//remove existing background images
    	detailPanel.setStyle({
			'background-image': 'none',
			'min-height' : '0px'
		});

    	cardview.switchTo(detail); 

    	//handler for detail show event
		function showDetailHandler() {
			//delay creation of options to pretend quicker reaction
			Ext.create('Ext.util.DelayedTask', function () {
                detail.fireEvent('showdetaildelayed');
            }).delay(150);
		}

		function createOptionsDelayed() {
			//set order description
			prodDetailLabel.getTpl().overwrite(prodDetailLabel.element, order.getData(true));

	    	if(order.get('productImageUrl')) {	
				detailPanel.setStyle(
				{
					'background-image': 'url('+order.get('productImageUrl')+'=s720)',
					'background-size': '100% auto',
					'background-position': 'center top',
					'min-height': '150px',
					'background-repeat': 'no-repeat'
				});
			}			

			 //dynamically add choices if present		 
			if(typeof order.choices() !== 'undefined' && order.choices().getCount() > 0) {
		 		order.choices().each(function(choice) {
					var optionsDetailPanel = Ext.create('EatSense.view.OptionDetail'),
						choicePriceLabel = (choice.get('overridePrice') == 'OVERRIDE_FIXED_SUM') ? ' (+' + appHelper.formatPrice(choice.get('price')) + ')' : '';

					optionsDetailPanel.getComponent('choiceTextLbl').setHtml(choice.data.text + choicePriceLabel);
					//recalculate when selection changes
					choice.clearListeners();
					choice.on('recalculate', function() {
						me.recalculate(order, prodPriceLabel);
					});

					menuCtr.createOptions.apply(me, [choice, optionsDetailPanel]);

					choicesPanel.add(optionsDetailPanel);
			 	 });
			}
		 
		 
			 //insert comment field after options have been added so it is positioned correctly
			commentField = Ext.create('Ext.field.TextArea', {
					// label: i10n.translate('orderComment'),
					// labelAlign: 'top',
					itemId: 'productComment',
					maxRows: 3,
					value: order.get('comment'),
					inputCls: 'comment-input',
					// labelCls: 'comment'
					placeHolder: i10n.translate('orderComment'),
					margin: '5 20 15 10'
				});

			//TODO 24.10.2013 check if no problems occur not adding the comment field in basic mode
			commentField.setHidden(activeBusiness.get('basic'));

			//WORKAROUND prevent the focus event from propagating to textarea triggering keyboard popup
			//known ST Bug
			choicesPanel.add(commentField);
			commentField.setDisabled(true);

			detail.getScrollable().getScroller().scrollToTop();

			this.recalculate(order, prodPriceLabel);

			

			Ext.create('Ext.util.DelayedTask', function () {
				amountField.setDisabled(false);
				commentField.setDisabled(false); 
            }).delay(300);

		}

	},
	/**
	 * Submits edited order.
	 * @param view
	 *		{@link EatSense.view.OrderDetail}
	 * @return true on valid changes, false otherwise
	 */
	editOrder: function(view) {
		var me = this,
			order = this.getActiveOrder(),
			validationError = "", 
			validationResult = null,
			productIsValid = true,
			activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			androidCtr = this.getApplication().getController('Android'),
			productComment;
		
		order.getData(true);

		if(!view) {
			console.log('Order.editOrder: no orderdetail view given');
			return;
		}

		productComment = view.down('#productComment');

		//validate choices 
		order.choices().each(function(choice) {
				validationResult = choice.validateChoice();

				if(!validationResult.valid) {
					productIsValid = false;
					validationError += validationResult.errMsgs;
				};
		});
		
		if(productIsValid) {
			order.set('comment', productComment.getValue());	
		
			Ext.Ajax.request({
	    	    url: appConfig.serviceUrl+'/c/businesses/'+activeCheckIn.get('businessId')+'/orders/'+order.getId(),
	    	    method: 'PUT',
	    	    jsonData: order.getRawJsonData(),
	    	    failure: function(response) {
					me.getApplication().handleServerError({
                    	'error': response, 
                    	'forceLogout': {403:true}
                    }); 
				}
			});

			androidCtr.removeLastBackHandler();
			// detail.hide();
			this.refreshCart();
			return true;
		} else {
			//show validation error
			Ext.Msg.alert('',validationError, Ext.emptyFn, view);
			return false;
		}
		
	},

	/**
	* Deletes a single order.
	* Called by cancelButton of an individual order.
	* @param {Ext.Button} button
	* @param {EatSense.mode.Order} order
	*	Order to delete
	* @param {Function} onStoreEmptyCallback
	* 	Executed when order store is empty
	*/
	cancelOrder: function(button, order, onStoreEmptyCallback) {
		var 	me = this,
				order = button.getParent().getRecord(),
				activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
				productName = order.get('productName'),
				index;

			//delete item
			activeCheckIn.orders().remove(order);
			//TODO ST 2.1 Workaround http://www.sencha.com/forum/showthread.php?249230-ST-2.1-Store-remove-record-fails-with-Cannot-call-method-hasOwnProperty-of-null&p=912339#post912339
			order.destroy();
			
			Ext.Ajax.request({
	    	    url: appConfig.serviceUrl+'/c/businesses/'+activeCheckIn.get('businessId')+'/orders/'+order.getId(),
	    	    method: 'DELETE',	    	    
	    	    success: function(response) {
	    	    	//TODO 22.01.2012 test better success and failure handling
	    	    	// order.destroy();
	    	    },
	    	    failure: function(response) {
					me.getApplication().handleServerError({
	                	'error': response, 
	                	'forceLogout': {403:true}
	                }); 
				}
	    	});
			
			this.refreshCart();
			//if no orders are left jump back to menu view
			if(activeCheckIn.orders().getCount() == 0 && EatSense.util.Helper.isFunction(onStoreEmptyCallback)) {
				onStoreEmptyCallback();
				me.fireEvent('cartcleared');
				// this.getApplication().getController('Menu').backToPreviousView();
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
	* @DEPRECATED
	*/
	// closeOrderDetailButtonHandler: function(button) {
	// 	this.getApplication().getController('Android').removeLastBackHandler();
	// 	this.closeOrderDetail();
	// },
	/**
	* Close order detail and restore state of order.
	*/
	closeOrderDetail: function(order, prodPriceLabel) {
		
		if(!order) {
			console.log('Order.closeOrderDetail: no order given');
			return;
		}

		if(!prodPriceLabel) {
			console.log('Order.closeOrderDetail: no prodPriceLabel given');
			return;
		}		
		//try to avoid unecessary calculation, only needed to update price after cancelation
		this.recalculate(order, prodPriceLabel);
		this.refreshCart();
	},
	/**
	 * Recalculates the total price for the active product.
	 */
	recalculate: function(order, prodPriceLabel) {
		// console.log('Cart.recalculate');
		order.calculate();
		prodPriceLabel.getTpl().overwrite(prodPriceLabel.element, {order: order});
	},
	/**
	 * Updates the badge text on cart buttons and dashboard menu button based on amount of orders.
	 * If no orders are present hide the button.
	 * Displays the number of orders.
	 * @param clear
	 *	true to set badge text to empty string
	 */
	updateCartButtons: function(clear) {
		var cartButtons = this.getLoungeview().query('button[action=show-cart]'),
			clubarea = this.getClubarea(),
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			badgeText,
			myordersShowCartButton = this.getMyordersShowCartButton();

		if(clear == true) {
			Ext.Array.each(cartButtons, function(button) {
				button.setBadgeText("");	
			});

			this.showCartButtons(false);	
			//clear dashboard menu button
			this.updateDashboardMenuTiles(clear);

		} else {
			if(!checkIn || checkIn.orders().getCount() == 0 ) {
				badgeText = "";
				this.showCartButtons(false);				
			} else {
				badgeText = checkIn.orders().getCount();
				this.showCartButtons(true);
			}
			
			Ext.Array.each(cartButtons, function(button) {
				button.setBadgeText(badgeText);	
			});

			//TODO 20130405 Bug  Query in lounge only finds cartbutton in menu- and productoverview
			if(myordersShowCartButton) {
				myordersShowCartButton.setBadgeText(badgeText);	
			}

			//set dashboard menu button
			this.updateDashboardMenuTiles(clear);
		}
	},
	/**
	* Shows or hides the product cart button.
	* @param show
	* 		true = show | false = hide
	*/
	showCartButtons: function(show) {
		var lounge = this.getLoungeview(),
			cartButtons,
			myordersShowCartButton = this.getMyordersShowCartButton();

		cartButtons = lounge.query('cartbutton');

		Ext.Array.each(cartButtons, function(button) {
			button.setHidden(!show);
		});

		//TODO 20130405 Bug  Query in lounge only finds cartbutton in menu- and productoverview
		if(myordersShowCartButton) {
			myordersShowCartButton.setHidden(!show);
		}

	},

	/**
	 * Updates the badge text on dashboard menu tiles based of order amount.
	 * @param clear
	 *	true to hide badge text
	 */
	updateDashboardMenuTiles: function(clear) {
		var clubarea = this.getClubarea(),
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			badgeText,
			dashboardMenuTiles;

		if(clubarea) {
			dashboardMenuTiles = clubarea.query('clubdashboard button[action="show-menu"]');
			if(!dashboardMenuTiles || dashboardMenuTiles.length == 0) {
				console.log('Order.updateDashboardMenuButtons: no tiles exist');	
				return;
			}
		} else {
			console.log('Order.updateDashboardMenuButtons: clubarea null');
		}

		if(clear === true) {
			Ext.Array.each(dashboardMenuTiles, function(tile) {
				tile.setBadgeText("");	
			});
		} else {
			if(!checkIn || checkIn.orders().getCount() == 0 ) {
				badgeText = "";	
			} else {
				badgeText = checkIn.orders().getCount();
			}

			Ext.Array.each(dashboardMenuTiles, function(tile) {
				tile.setBadgeText(badgeText);	
			});
		}

	},
	/**
	* Refresehes the badge text of myorders navigation item.
	* Displays the number of placed orders.
	* @param {Boolean} clear
	*	true to remove badgeText
	*/
	refreshMyOrdersBadgeText: function(clear) {
		var loungeview = this.getLoungeview(),
			button,
			orderStore = Ext.StoreManager.lookup('orderStore'),
			badgeText,
			description = this.getCheckoutDescription();

		
		button = loungeview.getItemByAction('show-myorders');

		if(!button) {
			console.log('Order.refreshMyOrdersBadgeText: button not found');
			return;
		}

		if(clear) {
			button.set('badgeText', badgeText);		
			if(orderStore && orderStore.getCount() > 0) {
				this.getCheckoutDescription().setHidden(true);
			}
		} else {

			if(orderStore && orderStore.getCount() > 0) {
				badgeText = orderStore.getCount();
				//hide description when checkout is empty
				if(description) {
					description.setHidden(true);	
				}
				
			} else {
				badgeText = '';
				//show description when checkout is empty
				if(description) {
					description.setHidden(false);	
				}
			}
			// button.setBadgeText(badgeText);
			button.set('badgeText', badgeText);
		}
	},
	/**
	 * Refresh myorderlist and recalculate the total price.
	 */
	refreshMyOrdersList: function() {
		var 	me = this,
				myorderlist = this.getMyorderlist(),
				myordersStore = Ext.data.StoreManager.lookup('orderStore'),
				activeCheckIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
				payButton = this.getPaymentButton(),
				myordersview = this.getMyordersview(),
				leaveButton;
		
		if(myordersview) {
			leaveButton = myordersview.down('button[action=exit]');
			// myordersview.showLoadScreen(true);
		} else {
			console.log('Order.refreshMyOrdersList > myordersview not found');
		}

		this.loadMyOrders(callback);

		function callback(records, operation, success) {
			try {
				if(!operation.error) {
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

					if(leaveButton) {
						if(records && records.length > 0) {
							leaveButton.setDisabled(true);
							leaveButton.setHidden(true);
						} else {
							leaveButton.setDisabled(false);
							leaveButton.setHidden(false);
						}
					}
					

					} else {
						payButton.disable();			
						me.getApplication().handleServerError({
							'error': operation.error,
							'forceLogout': {403: true}
						});
					}	
				} catch(e) {
					console.log('Order.refreshMyOrdersList > error ' + e);
				}

			// if(myordersview) {
			// 	myordersview.showLoadScreen(false);
			// }
		}
	},
	loadMyOrders: function(callback) {
		var 	me = this,
				myordersStore = Ext.data.StoreManager.lookup('orderStore');

		//TODO ST 2.1 Workaround http://www.sencha.com/forum/showthread.php?249230-ST-2.1-Store-remove-record-fails-with-Cannot-call-method-hasOwnProperty-of-null&p=912339#post912339
		//because of that we manually have to call destroy
		//remove all orders and nested objects and reload to have a fresh state
		myordersStore.each(function(order) {
        order.choices().each(function(choice) {
	    	    choice.options().removeAll(false);
	    	    choice.destroy();
	        });
	       	order.choices().removeAll(false);
	       	order.destroy();
	    });

		//fire clear event so the list updates correctly
	    myordersStore.removeAll(false);
		
		myordersStore.load({
			scope   : this,			
			callback: function(records, operation, success) {
				if(appHelper.isFunction(callback)) {
					callback(records, operation, success);
				}
			}
		});
	},
	/**
	 * Calculates and returns the total price of all orders.
	 * 
	 * @param {Ext.data.Store} orderStore
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
	/**
	 * Choose a payment method to issue the paymentRequest.
	 * @param {Function} onChoose (optional)
	 *	Callback executed when user hits ok. Gets passed payment method.
	 *	If no callback provided calls Order.paymentRequest
	 */
	choosePaymentMethod: function(onChoose) {
		var availableMethods = this.getApplication().getController('CheckIn').getActiveBusiness().payments(),
			orderStore = Ext.StoreManager.lookup('orderStore'),
			checkIn = this.getApplication().getController('CheckIn').getActiveCheckIn(),
			picker,
			choosenMethod,
			me = this;

		orderCount = orderStore.getCount();
		
		if(orderCount>0 && checkIn.get('status') !== appConstants.PAYMENT_REQUEST && checkIn.get('status') !== appConstants.COMPLETE) {

			//create picker
			picker = Ext.create('Ext.Picker', {
				height: 260,
				showAnimation: null,
				hideAnimation: null,
				listeners: {
					hide: function(comp) {
						try {
							//Fix for #576
							Ext.create('Ext.util.DelayedTask', function () {
								comp.destroy();
	        				}).delay(500);							
							me.getApplication().getController('Android').removeBackFn(destroyPicker);
						} catch(e) {
							console.error('Order.choosePaymentMethod: failed to destroy ' + e);
						}
					}
				},
				doneButton: {
					text: i10n.translate('ok'),
					//remove hide animation, to prevent Ticket 576, destroying the picker 
					// hideAnimation: null,
					listeners: {
						tap: function() {
							try {
								//FR 20121109 this is weird behaviour of picker component
								choosenMethod = picker.getValue()['null'];
								//Since ST2.1 if user does not select anything no value is set
								//so we chosse the first value in the store
								if(!choosenMethod) {
									choosenMethod = availableMethods.getAt(0).get('name');
								}
								//20130215 destroy picker to prevent duplicates
								//a bug existed that caused checkin to fail because picker tried to refresh
								//on business load
								picker.hide(false);								
								if(appHelper.isFunction(onChoose)) {
									onChoose(choosenMethod);
								} else {
									me.paymentRequest(choosenMethod);	
								}
								// destroyPicker();
							} catch(e) {
								console.error('Order.choosePaymentMethod: Picker tap error ' + e);
							}							
						}						
					}
				},
				cancelButton: {
					text: i10n.translate('cancel'),
					listeners: {
						tap: function() {
							picker.hide(false);			
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

			me.getApplication().getController('Android').addBackFn(destroyPicker);

			function destroyPicker() {
				picker.hide(false);
			}

			//this fixed the problem on HTC One S, instead of adding to Viewport
			me.getLoungeview().getContainer().add(picker);
			picker.show();
		}
	},
	/**
	* Creates and saves a bill for given checkin.
	* @param {String} paymentMethod
	*	Payment method to set in bill.
	* @param {Function} callback
	*	called after the save was performed. gets passed true/false 
	*	based on success/failure
	*/
	saveBillForCheckIn: function(paymentMethod, callback) {
		var bill = Ext.create('EatSense.model.Bill'),
			date = new Date();


		bill.set('paymentMethod', paymentMethod);

		//FR ST2-1 Bug in Writer.js with a null pointer in L.92, explicitly set time
		bill.set('time', date);
		//workaround to prevent sencha from sending phantom id
		bill.setId('');
		

		bill.save({
			scope: this,
			success: function(record, operation) {
				if(appHelper.isFunction(callback)) {
					callback(true);
				}
			},
			failure: function(record, operation) {
				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});

				callback(false);
			}
		});
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
			me = this,
			myordersView = this.getMyordersview(),			
			date = new Date();		

		bill.set('paymentMethod', paymentMethod);

		//FR ST2-1 Bug in Writer.js with a null pointer in L.92, explicitly set time
		bill.set('time', date);
		//workaround to prevent sencha from sending phantom id
		bill.setId('');

		
		bill.save({
			scope: this,
			success: function(record, operation) {
				payButton.hide();						
				me.setActiveBill(record);
				
				Ext.create('Ext.util.DelayedTask', function () {
					appHelper.toggleMask(false, myordersView);

					//double delay to prevent problems with slide nav button staying visible
					Ext.create('Ext.util.DelayedTask', function () {
						myordersComplete.show();
						me.refreshMyOrdersBadgeText(true);
						me.showCartButtons(false);

						checkInCtr.fireEvent('statusChanged', appConstants.PAYMENT_REQUEST);							
					}).delay(300);
				}).delay(1000);
    				
			},
			failure: function(record, operation) {
				appHelper.toggleMask(false, myordersView);

				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});
			}
		});


		appHelper.toggleMask('paymentRequestSend', myordersView);

		// Ext.Msg.show({
		// 	title : "",
		// 	message : i10n.translate('paymentRequestSend'),
		// 	buttons : []
		// });
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
						checkIn.erase({
							failure: function(response, operation) {
								//fail silent 
								me.getApplication().handleServerError({
									'error': operation.error,
									'hideMessage': true
								});
							}
						});
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
	 * Since cart only shows when not empty, function is unecessary.
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
	/**
	* Itemtap event handler for myorders list.
	* Show/hide details in myordes view.
	*/
	toggleOrderDetail: function(view, index, htmlElement, order) {
    	order.set('showDetail', !order.get('showDetail'));
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
	 * May not always reflect the current state!
	 * 
	 * @returns
	 */
	getMyordersCount: function() {
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
			console.log('Order.handleOrderMessage: delete order with id ' + updatedOrder.id);

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
			checkInCtr =  this.getApplication().getController('CheckIn'),
			myordersComplete = this.getMyordersComplete(),
			payButton = this.getPaymentButton(),
			lounge = this.getLoungeview();			

		if(action == "new") {
			//this occurs when business manually completes a checkin
			console.log("Order.handleBillMessage: Bill was created. Businesses completed checkin.");
			bill.set('id', bill.id);
			bill.set('checkInId', bill.checkInId);
			bill.set('paymentMethod', billdata.paymentMethod.name);
			this.setActiveBill(bill);			
			this.showMyorders();
			myordersComplete.show();
			this.refreshMyOrdersBadgeText(true);
			payButton.hide();

			checkInCtr.fireEvent('statusChanged', appConstants.PAYMENT_REQUEST);

			//show a message 
			Ext.Msg.alert(i10n.translate('hint'), i10n.translate('myorders.messages.billnew.message', bill.get('paymentMethod')));
		}
	},
	/**
	* Loads existig orders placed in cart for given check-in.
	* Refreshes cart and myorderslist afterwards.
	* @param checkIn
	*	CheckIn to load orders for.
	*/
	loadExistingOrders: function(checkIn) {
		var me = this;
		   			//after spot information is restored and stores are initialized load orders
   			
   			if(!checkIn) {
   				console.log('Order.loadExistingOrders: no checkIn given');
   				return;
   			}

   			checkIn.orders().load({
   				scope: this,
   				params: {
   					'status': appConstants.Order.CART
   				},
   				callback: function(records, operation, success) {
   					if(!operation.error) {
   						me.refreshCart();
   					}
   				}
   			});
	},
	/**
	* Do cleanup and provide a fresh order state.
	* E. g. used after a FORCE_LOGOUT
	*/
	cleanup: function() {
		var myordersStore = Ext.data.StoreManager.lookup('orderStore'),
			homeButton = this.getHomeButton();
		
		try {
			//clear orders
			myordersStore.removeAll();

			this.updateCartButtons(true);
	      	this.refreshMyOrdersBadgeText(true);		

	      	//show homebutton
	      	if(homeButton) {
	      		homeButton.setHidden(false);
	      	}
		} catch (e) {
			console.error('Order.cleanup: failed ' + e);
		}
	}
});