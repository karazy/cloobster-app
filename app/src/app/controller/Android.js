/**
* Specifically handles actions relevant for Android.
*/
Ext.define('EatSense.controller.Android', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.util.Helper'],
	config: {
		refs: {
			loungeview: 'lounge'
		},
		//Array of functions to execute when back button event is triggered
		androidBackHandler : new Array(),
		//when true, will exit application on next backbutton event
		exitOnBack: false,
		//if true won't remove a backhandler. Only used for message boxes. Setting this somewhere else won't have any effect.
		keepHandler: false,

		msgBoxVisible: false,

		rootContainer: null
	},
	launch: function() {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');
		// var keepHandler = false;

		this.resetBackHandler(new Array());
		
		Ext.Viewport.element.on('tap', function() {
			this.setExitOnBack(false);
		},
		this, {
			delay: 50
		});

		//let the button also work on message boxes
		Ext.Msg.on('show', function() {
			var me = this;
			this.setMsgBoxVisible(true);
		}, this);

		Ext.Msg.on('hide', function() {
			this.setMsgBoxVisible(false);
		}, this);

		checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.resetBackHandler();
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				me.resetBackHandler();
			}
		}, this);
	},

	addBackHandler: function(handler) {
		var _array = this.getAndroidBackHandler();
		// this.setExitOnBack(false);
		if(!EatSense.util.Helper.isArray(_array)) {
			console.log('Android.addBackHandler >  androidBackHandler container is not of type array');
			return;
		}

		if(EatSense.util.Helper.isFunction(handler)) {
			_array.push(handler);
		} else {
			console.log('Android.addBackHandler > handler is not of type function');
		};
	},

	removeLastBackHandler: function() {
		// this.setExitOnBack(false);
		if(EatSense.util.Helper.isArray(this.getAndroidBackHandler())) {
			console.log('Android Controller -> removeLastBackHandler');
			this.getAndroidBackHandler().pop();
		}		
	},

	removeAllBackHandlers: function() {
		var handlers = this.getAndroidBackHandler();

		if(appHelper.isArray(handlers)) {
			console.log('Android Controller -> removeLastBackHandler');
			while(handlers.length > 0) {
				handlers.pop();
			}
		}
	},

	executeBackHandler: function() {
		var handler,
			msgBox,
			backbutton,
			loungeview = this.getLoungeview(),
			activeview,
			backbutton,
			dashboardRecord;

			//Backhandler execution order
			//1. Message Boxes
			//2. explicitly defined Functions
			//3. search backbutton in active card view
			//4. jump back to dashboard
			//5. exit logic
			
			//close open message box
			if(this.getMsgBoxVisible()) {
				this.setMsgBoxVisible(false);
				Ext.Msg.hide();	
				return;
			}

			if(loungeview && loungeview.getContainer() && loungeview.getContainer().getActiveItem()) {
				if(loungeview.getContainer().getActiveItem().getActiveItem()) {
					activeview = loungeview.getContainer().getActiveItem().getActiveItem();
					backbutton = activeview.down('backbutton');
					if(backbutton) {
						backbutton.fireEvent('tap', backbutton);
						return;
					}					
				}
			}

			dashboardRecord = loungeview.getItemByAction('show-clubdashboard');

			if(dashboardRecord && loungeview.getList().getSelection()[0] != dashboardRecord) {
				loungeview.selectByAction('show-clubdashboard');
				return;
			}
			

			//1. check if back handlers exist and execute it

			// if(EatSense.util.Helper.isArray(this.getAndroidBackHandler()) &&  this.getAndroidBackHandler().length > 0) {
			// 	console.log('Android Controller -> executeBackHandler');
			// 	handler = this.getAndroidBackHandler().pop();
			// 	handler();
			// } else {						

			//2. if backbutton exists do a tap
			// if(this.getRootContainer()) {
			// 	backbutton = this.getRootContainer().down('backbutton');
			// 	if(backbutton) {
			// 		//trigger tap on the back button
			// 		backbutton.doTap(backbutton);
			// 		return;
			// 	}				
			// }

			// no backbuttons or backhandlers
			//ask user before exiting the app
			if(this.getExitOnBack()) {
				console.log('Android Controller -> executeBackHandler: exit app');
				navigator.app.exitApp();
			} else {
				//make it to look like android toast message
				msgBox = Ext.create('Ext.MessageBox', {
					modal: false,
					centered: false,
					bottom: '5%',
					right: '3%',
					left: '3%',
					'message' : i10n.translate('android.backbutton.exit'),
					buttons : []
				});

				msgBox.show();

				//show short alert and then hide
				Ext.defer((function() {
					if(!EatSense.util.Helper.getAlertActive()) {
						msgBox.destroy();
					}					
				}), appConfig.msgboxHideLongTimeout, this);

				this.setExitOnBack(true);
			}
			
		// }
	},
	/**
	* Clear current back handler and set it to an empty array.
	*/
	resetBackHandler: function() {
		this.setAndroidBackHandler(new Array());
	}
});