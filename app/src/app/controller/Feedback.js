/**
* Controller to handle submit, loading of feedback forms
* and ui actions in form views.
*/
Ext.define('EatSense.controller.Feedback', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.model.Feedback'],
	config: {
		refs: {
			lounge: 'lounge',
			clubArea: 'clubarea',
			showFeedbackButton: 'clubarea clubdashboard button[action=show-feedback]',
			showFeedbackLeaveButton: 'myorderstab button[action=feedback]',
			myordersview: 'lounge myorderstab',
			feedbackform: 'feedbackform',
			emailField: 'feedbackform emailfield',
			commentField: 'feedbackform textareafield',
			submitFeedBackButton: 'feedbackform button[action=submit]',
			//back button in dashboard
			// backButton: 'clubarea feedbackform button[action=back]',
			//back button in myordersview
			backLeaveButton: 'myorderstab feedbackform button[action=back]',
			loungeFeedbackView: 'lounge #loungeFeedback'
		},
		control: {
			showFeedbackButton: {
				tap: 'showFeedbackButtonHandler'
			},
			submitFeedBackButton: {
				tap: 'submitFeedback'
			},
			showFeedbackLeaveButton: {
				tap: 'showFeedbackLeaveForm'
			},
			emailField: {
				change: 'saveEmail'
			},
			commentField: {
				change: 'saveComment'
			},
			// backButton : {
			// 	tap: 'backButtonHandler'
			// },
			backLeaveButton: {
				tap: 'backLeaveButtonHandler'
			},
			feedbackform: {
				show: 'showFeedbackForm'
			},
			myordersview: {
				show: 'myordersviewShowHandler'
			},
			loungeFeedbackView: {
				show: 'loungeFeedbackViewShowHandler'
			}
		},

		/** Feedback data object for this checkIn. */
		activeFeedback: null,
		/** The feedback form. */
		feedbackTemplate: null,
		/* "home" if opened from dashboard, "checkout" otherwise */
		feedbackOrigin: null,
		/* active feedback view */
		activeFeedbackView: null,
		/* Indicates if feedback has been submitted */
		submitted: false
	},
	init: function() {
		var me = this,
			checkInCtr = this.getApplication().getController('CheckIn');

		checkInCtr.on('statusChanged', function(status) {
			if(status == appConstants.CHECKEDIN) {
				this.setSubmitted(false);
				this.loadFeedbackTemplate(restoreFeedback);

			    function restoreFeedback() {
			      //restore existing feedback
			      if(checkInCtr.getAppState().get('feedbackId')) {
			      	me.setSubmitted(true);
			        me.loadFeedback(checkInCtr.getAppState().get('feedbackId'));
			      }
			    };
			}
			else if(status == appConstants.COMPLETE || status == appConstants.CANCEL_ALL || status == appConstants.FORCE_LOGOUT) {
				this.cleanup();
			}
		}, this);

		// this.getApplication().getController('CheckIn').on('basicmode', this.toggleInfoPageTeasers, this);
	},
	/**
	* Tap event handler for show feedback button on dashboard.
	*/
	showFeedbackButtonHandler: function(button) {
		var lounge = this.getLounge();
		lounge.getList().select(3);
	},
	/**
	* Show event handler for feedbackform.
	* @param panel
	*	The feedbackform
	*/
	showFeedbackForm: function(panel) {
		// var me = this,
		// 	lounge = this.getLounge(),
		// 	feedbackform = lounge.down('feedbackform');

		console.log('Feedback.showFeedbackForm');
		// this.setFeedbackOrigin('home');
		//make sure feedback form exists		
		this.setActiveFeedbackView(panel);

		// clubArea.switchTo(1, 'left');
		// lounge.getList().select(3);

		this.propateFeedbackForm();
					
		// this.getApplication().getController('Android').addBackHandler(function() {
  //           me.backToDashboard();
  //       });
	},

	/**
	* Tap event handler for feedback button in myordersview.
	* Display feedback form from myorders tab.
	* @param button
	*	Button which fired tap event
	*/
	showFeedbackLeaveForm: function(button) {
		var me = this,
			// feedback = this.getFeedback(),
			myordersview = this.getMyordersview(),
			feedbackform = myordersview.down('feedbackform');
		
		console.log('Feedback.showFeedbackLeaveForm');
		this.setFeedbackOrigin('checkout');
		// this.setActiveFeedbackView(feedbackform);

		//show feedback form
		myordersview.setActiveItem(1);
		// me.propateFeedbackForm();

		this.getApplication().getController('Android').addBackHandler(function() {
            me.backToMyOrders();
        });
	},
	/**
	* Show event handler for myordersview.
	*/
	myordersviewShowHandler: function() {
		this.toggleShowFeedbackLeaveButton(this.getSubmitted());
	},
	/**
	* Show event handler for feedback view called from slidenav.
	*/
	loungeFeedbackViewShowHandler: function() {
		this.setFeedbackOrigin('home');
	},
	/**
	* Load Feedback data from server.
	* @param callbackFn
	*	callback function executed upon successful template load
	*/
	loadFeedbackTemplate: function(callbackFn) {
		var me = this,
			feedbackStore = Ext.StoreManager.lookup('feedbackStore');

		//Feedback does not exist, create it and load feedback form template
		if(!this.getActiveFeedback()) {
			this.setActiveFeedback(Ext.create('EatSense.model.Feedback'));
			this.getActiveFeedback().setId('');

			feedbackStore.load({
			    callback: function(records, operation, success) {
			    	if(!operation.error) {
			    		me.enableFeedback();

						me.setFeedbackTemplate(feedbackStore.getAt(0));

						me.getActiveFeedback().set('formId', me.getFeedbackTemplate().getId());

						//copy all questions and add them to answers of active feedback
						me.getFeedbackTemplate().questions().each(function(question) {
							me.getActiveFeedback().answers().add(question.copy(question.get('id')));
						});

						if(callbackFn && appHelper.isFunction(callbackFn)) {
							callbackFn();	
						}
			    	}
			    	else {
			    		//no feedback form exists, hide feedback buttons
			    		if(operation.error.status == 404) {
			    			me.disableFeedback();
			    		} else {
			    			me.getApplication().handleServerError({
	                    		'error': operation.error, 
	                    		'forceLogout': {403:true}
	                    	});
			    		}
	                }
			    }
			});
		}
	},
	/**
	* Render feedback data to form.
	* Queries all places where the feedback form ist located an updates them.
	*/
	propateFeedbackForm: function() {
		var me = this,
			lounge = this.getLounge(),
			forms = lounge.query('feedbackform dataview'),
			emailfields = lounge.query('feedbackform emailfield'),
			textareafields = lounge.query('feedbackform textareafield');

		if(this.getActiveFeedback()) {

			Ext.Array.each(forms, function(form) {
				form.setStore(me.getActiveFeedback().answers());
			});

			Ext.Array.each(emailfields, function(field) {
				field.setValue(me.getActiveFeedback().get('email') || "");
			});

			Ext.Array.each(textareafields, function(field) {
				field.setValue(me.getActiveFeedback().get('comment') || "");
			});
		}
	},
	/**
	* Change handler for email field. Saves the value in feedback object.
	*/
	saveEmail: function(field, newVal, oldVal) {
		var activeFeedback = this.getActiveFeedback();

		activeFeedback.set('email', field.getValue());
	},
	/**
	* Change handler vor email field. Saves the value in feedback object.
	*/
	saveComment: function(field, newVal, oldVal) {
		var activeFeedback = this.getActiveFeedback();

		activeFeedback.set('comment', field.getValue());
	},
	/**
	* Reads feedback from feedback form and sends it to server.
	* @param button
	*	Submit feedback button
	* @see EatSense.model.Feedback~proxy for URL information
	*/
	submitFeedback: function(button) {
		var me = this,
			activeFeedback = this.getActiveFeedback(),
			feedbackTemplate = this.getFeedbackTemplate(),		
			activeFeedbackView = this.getActiveFeedbackView(),
			questions = activeFeedback.answers(),
			emailField = activeFeedbackView.down('#email'),
			commentField = activeFeedbackView.down('#comment'),
			currentAnswer,
			errors;

		console.log('submitting feedback');
		//1. set comment and email
		if(commentField) {
			activeFeedback.set('comment', commentField.getValue());	
		} else {
			console.error('Feedback.submitFeedback > no comment field found.');
		}

		if(emailField) {
			activeFeedback.set('email', emailField.getValue());
		} else {
			console.error('Feedback.submitFeedback > no email field found.');
		}
				

		if(activeFeedback.get('email') != null && activeFeedback.get('email') != "") {
			//if email provided check if valid
			errors = activeFeedback.validate();
			//we don't need to check a specific field because only email has a validation
			if(!errors.isValid()) {
	            Ext.Msg.alert(i10n.translate('error'), i10n.translate('newsletterInvalidEmail'));
	            return;
	        }
		}


		//1.1 Get the answers
		activeFeedback.answers().each(function(answer) {
			//Sencha Work arounds, prevents following fields from beeing send!
			delete answer.data.feedback_id;
			delete answer.data.feedbackform_id;
		});



		//2. submit data
		activeFeedback.save({
			success: function(record, operation) {
				me.saveFeedbackId(activeFeedback.get('id'));
			},
			failure: function(record, operation) {
				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});
			}
		});

		//3. back to previous view
		if(this.getFeedbackOrigin() == 'checkout') {
			this.backToMyOrders();			
		} else if(this.getFeedbackOrigin()) {
			this.backToDashboard();			
		} else {
			console.log('Feedback.submitFeedback > incorrect feedback origin provided: ' + this.getFeedbackOrigin());
		};

		this.setFeedbackOrigin(null);
		this.setActiveFeedbackView(null);

		this.setSubmitted(true);
		this.toggleShowFeedbackLeaveButton(true);		

		Ext.Msg.show({
			title : i10n.translate('feedbackCompleteTitle'),
			'message' : i10n.translate('feedbackCompleteMessage'),
			buttons : []
		});
		//show short alert and then hide
		Ext.defer((function() {
			if(!appHelper.getAlertActive()) {
				Ext.Msg.hide();
			}					
		}), appConfig.msgboxHideLongTimeout, this);

	},
	/**
	* @private
	* Enable feedback by displaying buttons.
	*/
	enableFeedback: function() {
		this.getShowFeedbackButton().setHidden(false);

		if(!this.getActiveFeedback() || !this.getActiveFeedback().get('id')) {
			this.toggleShowFeedbackLeaveButton(false);
		}
	},
	/**
	* @private
	* Disable feedback funtionality by hiding the buttons.
	*/
	disableFeedback: function() {
		//TODO
		return;
    	this.getShowFeedbackLeaveButton().setHidden(true);
		this.getShowFeedbackButton().setHidden(true);
	},
	/**
	* Loads an existing feedback form.
	* @param id
	*	Id of feedback.
	*/
	loadFeedback: function(id) {
		var me = this;

		if(!id) {
			console.log('Feedback.loadFeedback: no id given');
			return;
		}

		EatSense.model.Feedback.load(id, {
			success: function(record, operation) {
				me.setActiveFeedback(record);
				//when feedback exists hide button in orders view
				me.getShowFeedbackLeaveButton().setHidden(true);
			},
			failure: function(record, operation) {
				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});
			}
		})
	},
	/**
	* Deletes feedbackData.
	*/
	clearFeedback: function() {
		var lounge = this.getLounge(),
			emailfields = lounge.query('feedbackform emailfield'),
			textareafields = lounge.query('feedbackform textareafield');

		//clear email and password fields
		Ext.Array.each(emailfields, function(field) {
			field.setValue("");
		});

		Ext.Array.each(textareafields, function(field) {
			field.setValue("");
		});
		
		try {

			if(this.getActiveFeedback() && this.getActiveFeedback().answers()) {
				//destroy all answers otherwise they reappear in fucking sencha store with old values
				this.getActiveFeedback().answers().each(function(answer) {
					answer.destroy();
				});
				this.getActiveFeedback().answers().removeAll();
			}

			this.getActiveFeedback().destroy();
			this.setActiveFeedback(null);
		} catch(e) {
			console.log('Feedback.clearFeedback > error ' + e);
		}

		this.getShowFeedbackLeaveButton().setHidden(false);
	},
	/**
	* Save feedback Id for checkIn restore.
	* @param id
	*	Id of feedback to save
	*/
	saveFeedbackId: function(id) {
		var checkInCtr = this.getApplication().getController('CheckIn');

		checkInCtr.getAppState().set('feedbackId', id);
	},
    /**
	* Tap handler for backbutton.
	*/
	// backButtonHandler: function(button) {
	// 	this.backToDashboard();
	// 	this.getApplication().getController('Android').removeLastBackHandler();
	// },
    /**
    * Return to dashboard view.
    */
    backToDashboard: function(button) {
		var lounge = this.getLounge();
		lounge.getList().select(0);
    },
     /**
	* Tap handler for backbutton.
	*/
	backLeaveButtonHandler: function(button) {
		this.backToMyOrders();
		this.getApplication().getController('Android').removeLastBackHandler();
	},
    /**
    * Return to myorders view.
    */
    backToMyOrders: function(button) {
    	var me = this,
			myordersview = this.getMyordersview();

		this.setFeedbackOrigin(null);
		myordersview.switchTo(0, 'right');
    },
    /**
    * Show or hide the feedback button on leave.
    */
	toggleShowFeedbackLeaveButton: function(hide) {
		if(this.getShowFeedbackLeaveButton()) {
			this.getShowFeedbackLeaveButton().setHidden(hide);	
		} else {
			console.log('Feedback.toggleShowFeedbackLeaveButton: no button exists');
		}
	},
    /**
    * Cleanup 
    */
    cleanup: function() {
    	//clear feedbackId
    	this.setSubmitted(false);
      	this.getApplication().getController('CheckIn').getAppState().set('feedbackId', null);
      	this.clearFeedback();
    }
});