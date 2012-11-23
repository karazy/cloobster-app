/**
* Specifically handles actions relevant for Android.
*/
Ext.define('EatSense.controller.Android', {
	extend: 'Ext.app.Controller',
	config: {
		//Array of functions to execute when back button event is triggered
		androidBackHandler : new Array(),
		//when true, will exit application on next backbutton event
		exitOnBack: false,
		//if true won't remove a backhandler. Only used for message boxes. Setting this somewhere else won't have any effect.
		keepHandler: false
	},
	launch: function() {
		// var keepHandler = false;
		
		Ext.Viewport.element.on('tap', function() {
			this.setExitOnBack(false);
		},
		this, {
			delay: 50
		});

		//let the button also work on message boxes
		Ext.Msg.on('show', function() {
			var me = this;
			this.addBackHandler(function() {
				me.setKeepHandler(true);
				Ext.Msg.hide();
			});
		}, this);

		Ext.Msg.on('hide', function() {
			if(!this.getKeepHandler()) {
				this.removeLastBackHandler();
			};
			this.setKeepHandler(false);
		}, this);
	},

	addBackHandler: function(handler) {
		var _array = this.getAndroidBackHandler();
		// this.setExitOnBack(false);
		if(!appHelper.isArray(_array)) {
			console.log('Android.addBackHandler >  androidBackHandler container is not of type array');
			return;
		}

		if(appHelper.isFunction(handler)) {
			_array.push(handler);
		} else {
			console.log('Android.addBackHandler > handler is not of type function');
		};
	},

	removeLastBackHandler: function() {
		// this.setExitOnBack(false);
		if(appHelper.isArray(this.getAndroidBackHandler())) {
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
			msgBox;
		
		if(appHelper.isArray(this.getAndroidBackHandler()) &&  this.getAndroidBackHandler().length > 0) {
			console.log('Android Controller -> executeBackHandler');
			// this.setExitOnBack(false);
			handler = this.getAndroidBackHandler().pop();
			handler();
		} else {
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
					if(!appHelper.getAlertActive()) {
						msgBox.destroy();
					}					
				}), appConfig.msgboxHideLongTimeout, this);

				this.setExitOnBack(true);
			}
			
		}
	},
	/**
	* Clear current back handler and set it to an empty array.
	*/
	resetBackHandler: function() {
		this.setAndroidBackHandler(new Array());
	}
});