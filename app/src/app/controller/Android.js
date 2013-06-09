/**
* Specifically handles actions relevant for Android.
*/
Ext.define('EatSense.controller.Android', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.util.Helper', 'EatSense.util.EventBus'],
	config: {
		refs: {
			loungeview: 'lounge'
		},
		//Array of functions to execute when back button event is triggered
		androidBackHandler : new Array(),
		//when true, will exit application on next backbutton event
		exitOnBack: false,
		//if true won't use the android bugfix to resolve resizing problem
		skipHideKeyboardEvent: false
	},
	launch: function() {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');

		console.log('Android.launch: setup');	

		this.resetBackHandler();
		
		Ext.Viewport.element.on('tap', function() {
			this.setExitOnBack(false);
		},
		this, {
			delay: 50
		});

		//add backhandler for message boxes
		Ext.Msg.on('show', function() {
			this.addBackFn(hideMsgBox);

		}, this);

		Ext.Msg.on('hide', function() {
			this.removeBackFn(hideMsgBox);
		}, this);

		function hideMsgBox() {
			Ext.Msg.hide();	
		}

		checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.resetBackHandler();
			} else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				me.resetBackHandler();
			}
		}, this);

		if(Ext.os.is.Android) {
          console.log('Android.launch: setup android specific behaviour');
          document.addEventListener('backbutton', onBackKeyDown, false);
          	function onBackKeyDown() {
                me.executeBackHandler();
        	};
        	
		    document.addEventListener("hidekeyboard", function() {
		    	if(!me.getSkipHideKeyboardEvent()) {
		    		me.forceKeyboardHide();
		    	}
		    	
		    }, false);

		    //listen for global addbackhandler and removebackhandler events
		    Ext.Viewport.on({
	    		'addbackhandler': this.addBackFn,
	    		'removebackhandler': this.removeBackFn,
	    		'applaunched': this.checkForIntents,
	    		'resumecheckin': this.checkForIntents,
	    		'skiphidekeyboardevent' : function(skip) {
	    			var _skip = (skip === true) ? true : false;
	    			this.setSkipHideKeyboardEvent(_skip);
	    			console.log('Android: set hidekeyboard handling on|off: ' + _skip);
	    		},
	    		scope: this	
	    	});		    		   
      	}   	
	},
	/**
	* Add function to stack auf back handlers.
	* @param {Function} backFn
	*	Function to add
	*/
	addBackFn: function(backFn) {
		if(!EatSense.util.Helper.isFunction(backFn)) {
			console.log('Android.addBackFn:  backFn is no function');
			return;
		}
		this.getAndroidBackHandler().push(backFn);
		this.setExitOnBack(false);
	},
	/**
	* Remove function from stack auf backhandlers.
	* Removes the top most if none is given.
	* @param {Function} backFn (optional)
	*	If not null removes given function
	*/
	removeBackFn: function(backFn) {
		var fnIndex = -1;
		if(!appHelper.isArray(this.getAndroidBackHandler())) {
			console.error('Android.removeBackFn: getAndroidBackHandler returned no array');
			return
		}
		//DEBUG
		// console.log('Android.removeBackFn');
		
		if(EatSense.util.Helper.isFunction(backFn)) {
			for (var i = this.getAndroidBackHandler().length - 1; i >= 0; i--) {
				if(this.getAndroidBackHandler()[i] == backFn) {
					fnIndex = i;
					break;
				}
			};
			console.log('Android.removeBackFn: backFn found index '+ fnIndex);
			if(fnIndex > -1) {
				this.getAndroidBackHandler().splice(fnIndex, 1);				
			}
			return;
		}

		if(this.getAndroidBackHandler().length > 0) {
			//DEBUG
			// console.log('Android.removeBackFn: remove fn on top');
			this.getAndroidBackHandler().pop();	
		}
		
		
	},
	/**
	* @Deprecated
	*/
	addBackHandler: function(handler) {
		return;
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
	/**
	* @Deprecated
	*/
	removeLastBackHandler: function() {
		return;
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
	/**
	* Execute the latest backhandler in the follwing precedence.
	* 1. explicitly defined backhandler functions
	* 2. search backbutton in active card view
	* 3. jump back to dashboard
	* 4. exit logic (tap twice)
	*
	*/
	executeBackHandler: function() {
		var handler,
			msgBox,
			backbutton,
			loungeview = this.getLoungeview(),
			activeview,
			backbutton,
			homebutton,
			dashboardRecord;

			//Backhandler execution order
			//1. explicitly defined backhandler functions
			//2. search backbutton/homebutton in active card view
			//3. jump back to dashboard
			//4. exit logic
			

			if(EatSense.util.Helper.isArray(this.getAndroidBackHandler()) &&  this.getAndroidBackHandler().length > 0) {
				console.log('Android.executeBackHandler: number of handlers ' + this.getAndroidBackHandler().length);
				handler = this.getAndroidBackHandler().pop();
				handler();
				return;
			}	

			//get activeItem of loungeview.container which is a card layout,
			//then getActiveItem of activeItem which should be a card layout as well
			//look for a backbutton
			if(loungeview && loungeview.getContainer() && loungeview.getContainer().getActiveItem()) {
				activeview = loungeview.getContainer().getActiveItem().getActiveItem();
				if(activeview) {

					backbutton = activeview.down('backbutton');
					if(backbutton) {
						backbutton.fireEvent('tap', backbutton);
						return;
					}

					homebutton = activeview.down('homebutton');
					if(homebutton) {
						homebutton.fireEvent('tap', homebutton);
						return;
					}
				}
			}

			// no backbuttons or backhandlers
			//ask user before exiting the app
			if(this.getExitOnBack()) {
				console.log('Android.executeBackHandler: exit app');
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
	* Checks if app was started via an qr code intent.
	* This function should be called on startup and only when running under Android.
	*/
	checkForIntents: function() {
		//check for intent extras
	    if(window.plugins.webintent) {
			window.plugins.webintent.getUri(function(url) {
			    if(url !== "") {
			        // url is the url the intent was launched with
			        var qrcode;
			        console.log('Android.checkForIntents: found intent url ' + url);
			        qrcode = appHelper.extractBarcode(url);			        			       
			        if(qrcode) {
			        	Ext.Viewport.fireEvent('launchwithqrcode', qrcode);
		        	}
				}
			});
	    }
	},
	/**
	* Clear current back handler and set it to an empty array.
	*/
	resetBackHandler: function() {
		this.setAndroidBackHandler(new Array());
	},

	forceKeyboardHide: function() {
		//20130222 dirty lirty hack. fixes the resizing problem. normally 
    	//source: http://stackoverflow.com/questions/8335834/how-can-i-hide-the-android-keyboard-using-javascript
    	//with android:windowSoftInputMode="adjustPan" keyboard covers input elements
    	//with android:windowSoftInputMode="adjustResize" screen does not resize correctly
    	//after keyboard gets hidden
		try {
			Ext.defer(function() {
	        	var field = document.createElement('input');
				field.setAttribute('type', 'text');
				document.body.appendChild(field);
				setTimeout(function() {
				    field.focus();
				    setTimeout(function() {
				        field.setAttribute('style', 'display:none;');
				        document.body.removeChild(field);
				    }, 10);

				}, 10);
	        }, 25);
    	} catch(e) {
    		console.error('Android.forceKeyboardHide: keyboard hide error ' + e);
    	}
	}
});