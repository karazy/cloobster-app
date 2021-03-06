/**
*	Handles customer requests like "Call Waiter" and ui actions in request view.
*	
*/
Ext.define('EatSense.controller.Request',{
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			lounge: 'lounge',
			clubArea: 'clubarea',
			callWaiterButton: 'requeststab button[action=waiter]',
			callWaiterLabel: 'requeststab #callWaiterLabel',
			accountLabel: 'requeststab #accountLabel'
		},
		control: {
			callWaiterButton: {
				tap: 'toggleCallWaiterRequest'
			},
			requeststab: {
				show: 'showRequestViewHandler',
				single: true
			}
		},

		requestNavigationFunctions : new Array()
	},
	launch: function() {
		var messageCtr = this.getApplication().getController('Message'),
			checkInCtr = this.getApplication().getController('CheckIn');

		messageCtr.on('eatSense.request', this.handleRequestMessage, this);

		checkInCtr.on({
			'statusChanged': function(status) {
				if(status == appConstants.CHECKEDIN) {
					
				} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
					this.resetAllRequests();
				}
			},
			'resumecheckin': this.loadRequests,
			'spotswitched': this.resetAllRequests,
			scope: this
		});
	},
	/**
	* @private
	*/
	showRequestViewHandler: function() {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn'),
			requestStore = Ext.StoreManager.lookup('requestStore'),
			label = this.getCallWaiterLabel(); 

		this.refreshAccountLabel(checkInCtr.getActiveCheckIn());  

		requestStore.each((function(rec) {
    		if(rec.get('type') ==  appConstants.Request.CALL_WAITER) {
    			me.getCallWaiterButton().mode = 'cancel';
    			label.setHtml(i10n.translate('callWaiterCancelHint'));
				me.getCallWaiterButton().setText(i10n.translate('cancelCallWaiterRequest'));
    		}
    	}));
	},
	/**
	* Send or cancel a vip call.
	*/
	toggleCallWaiterRequest: function(button, event) {
		var checkInCtr = this.getApplication().getController('CheckIn');

		if(!checkInCtr.checkActiveSpotEligibleForAction()) {			
			checkInCtr.confirmSwitchSpot(true);
			return;
		}

		if(!button.mode || button.mode == 'call') {
			this.sendCallWaiterRequest(button, event);
		} else if (button.mode == 'cancel'){
			this.cancelCallWaiterRequest(button, event);
		}
	},
	/**
	*	Sends a call waiter request.
	*/
	sendCallWaiterRequest: function(button, event) {
		var 	me = this,
				request = Ext.create('EatSense.model.Request'),
				requestStore = Ext.StoreManager.lookup('requestStore'),
				label = this.getCallWaiterLabel(),
				checkInId = this.getApplication().getController('CheckIn').getActiveCheckIn().getId();
		
		console.log('Request.sendCallWaiterRequest');

		button.disable();
		button.mode = 'cancel';
		me.getCallWaiterButton().setText(i10n.translate('cancelCallWaiterRequest'));
		label.setHtml(i10n.translate('callWaiterCancelHint'));
		
		//TODO validate!?!?!

		request.set('type', appConstants.Request.CALL_WAITER);
		//workaround to prevent sencha from sending phantom id
		request.setId('');

		requestStore.add(request);
		// requestStore.sync();

		request.save({
			success: function(record, operation) {
				button.enable();				
			},
			failure: function(record, operation) {				
				button.enable();
				button.mode = 'call';
				me.getCallWaiterButton().setText(i10n.translate('callWaiterButton'));
				label.setHtml(i10n.translate('callWaiterCallHint'));

				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});
			}
		});
	},
	cancelCallWaiterRequest: function(button, event) {
		var me = this,
			label = this.getCallWaiterLabel(),
			requestStore = Ext.StoreManager.lookup('requestStore'),
			request;

		console.log('Request Controller -> cancelCallWaiterRequest');

		request = requestStore.findRecord('type', appConstants.Request.CALL_WAITER, false, true, true);

		if(request) {
			button.disable();
			button.mode = 'call';
			me.getCallWaiterButton().setText(i10n.translate('callWaiterButton'));
			label.setHtml(i10n.translate('callWaiterCallHint'));

			// requestStore.setSyncRemovedRecords(true);
			// requestStore.remove(request);
			// requestStore.sync();
			// requestStore.setSyncRemovedRecords(false);

			//try catch is due to android aborting the action because sencha throws a warning which causes and undefined error
			try {
				request.erase({
					callback: function(record, operation) {
						button.enable();
					},
					failure: function(record, operation) {
						if(operation.error.status != 404) {
							button.enable();
							button.mode = 'cancel';
							me.getCallWaiterButton().setText(i10n.translate('cancelCallWaiterRequest'));
							label.setHtml(i10n.translate('callWaiterCancelHint'));

							me.getApplication().handleServerError({
								'error': operation.error,
								'forceLogout': {403: true}
							});
						} else {
							console.log('Tried to revoke an already confirmed request. Maybe channel communication is offline.');
						}
					}
				});
			} catch(e) {
				console.log('Request Controller -> cancelCallWaiterRequest error: '+ e);
				button.enable();
			}
		}
	},
	
	/**
	* Load existing requests for this checkin.
	*/
	loadRequests: function() {
		var me = this,
			label = this.getCallWaiterLabel(),
			requestStore = Ext.StoreManager.lookup('requestStore');

		console.log('Request.loadRequests');

		requestStore.load({
			callback: function(records, operation, success) {
			   	if(operation.error) { 
                    me.getApplication().handleServerError({
                       	'error': operation.error, 
                     	'forceLogout': {403:true}
                    });
                 } 
                else {
       //          	Ext.each(records,(function(rec) {
       //          		if(rec.get('type') ==  appConstants.Request.CALL_WAITER) {
       //          			me.getCallWaiterButton().mode = 'cancel';
       //          			label.setHtml(i10n.translate('callWaiterCancelHint'));
							// me.getCallWaiterButton().setText(i10n.translate('cancelCallWaiterRequest'));
       //          		}
       //          	}));
                }
            }
		})
	},
	/*
	* Used for cleanup methods. Resets the state of button to call mode.
	*/
	resetAllRequests: function() {
		var requestStore = Ext.StoreManager.lookup('requestStore'),
			label = this.getCallWaiterLabel(),
			callWaiterButton = this.getCallWaiterButton();

		requestStore.removeAll();

		if(!callWaiterButton) {
			console.log('Request.resetAllRequests: callWaiterButton not found. Maybe view was never shown.');
			return;
		}

		if(!label) {
			console.log('Request.resetAllRequests: label not found. Maybe view was never shown.');
			return;
		}

		callWaiterButton.mode = 'call';
		callWaiterButton.setText(i10n.translate('callWaiterButton'));
		label.setHtml(i10n.translate('callWaiterCallHint'));

		
	},
	/**
	* Handle push messages for requests.
	*/
	handleRequestMessage: function(action, data) {
		var me = this,
			requestStore = Ext.StoreManager.lookup('requestStore'),
			label = this.getCallWaiterLabel(),
			request;

		request = requestStore.getById(data.id);
		if(request) {
			if(action == 'delete' && data.type == appConstants.Request.CALL_WAITER) {
				requestStore.remove(request);
				this.getCallWaiterButton().mode = 'call';
				this.getCallWaiterButton().setText(i10n.translate('callWaiterButton'));
				label.setHtml(i10n.translate('callWaiterCallHint'));
			}
		}
	},


	/*
	*	Sets the account label in request tab displaying nickname of current checkin
	*/
	refreshAccountLabel: function(checkIn) {
		var accountLabel = this.getAccountLabel();

		accountLabel.setHtml(i10n.translate('vipGreetingMessage', checkIn.get('nickname')));
	}
});