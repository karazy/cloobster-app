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
			feedbackContainer: 'feedbackcontainer',
			feedbackform: 'feedbackform',
			emailField: 'feedbackform emailfield',
			commentField: 'feedbackform textareafield',
			submitFeedBackButton: 'feedbackform button[action=submit]',
			// backLeaveButton: 'myorderstab feedbackform button[action=back]',
			loungeFeedbackView: 'lounge #loungeFeedback'
		},
		control: {
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
			// backLeaveButton: {
			// 	tap: 'backLeaveButtonHandler'
			// },
			feedbackform: {
				show: 'showFeedbackForm'
			},
			feedbackContainer: {
				show: 'showFeedbackContainer'
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

		checkInCtr.on({
			'statusChanged': function(status) {
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
			},
			'spotswitched' : this.resetActiveFeedback,
			scope: this
		})
	},
	/**
	* Show event handler for feedbackform.
	* @param panel
	*	The feedbackform
	*/
	showFeedbackForm: function(panel) {
		var me = this;

		this.setActiveFeedbackView(panel);

		Ext.create('Ext.util.DelayedTask', function () {
            me.propateFeedbackForm();
        }).delay(300);
		
	},

	/**
	* Show event handler for feedbackContainer.
	* @param panel
	*	The feedbackContainer
	*/
	showFeedbackContainer: function(panel) {
		var me = this;

		this.setActiveFeedbackView(panel.getActiveItem());

		Ext.create('Ext.util.DelayedTask', function () {
            me.propateFeedbackForm();
        }).delay(300);
		
	},

	/**
	* Tap event handler for feedback button in myordersview.
	* Display feedback form from myorders tab.
	* @param button
	*	Button which fired tap event
	*/
	showFeedbackLeaveForm: function(button) {
		var me = this,
			myordersview = this.getMyordersview(),
			feedbackform = myordersview.down('feedbackform'),
			backButton;
		
		console.log('Feedback.showFeedbackLeaveForm');
		this.setFeedbackOrigin('checkout');
		

		backButton = feedbackform.down('backbutton');

		if(backButton) {
			backButton.on({
				tap: backButtonHandler,
				single: true,
				scope: this
			});
		}
		

		//show feedback form
		myordersview.setActiveItem(1);
		//explicit setting of back handler, because another explicit handler is set for completing payment
		Ext.Viewport.fireEvent('addbackhandler', backButtonHandler);

		function backButtonHandler() {
			me.backToMyOrders();
			cleanup();
		}

		function cleanup() {

			Ext.Viewport.fireEvent('removebackhandler', backButtonHandler);

			if(backButton) {
				backButton.un({
					tap: backButtonHandler,
					scope: this
				});
			}
		}
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
			    	} else {
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
			console.log('Feedback.submitFeedback: incorrect feedback origin provided ' + this.getFeedbackOrigin());
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
		var showFeedbackButton = this.getShowFeedbackButton();

		if(showFeedbackButton) {
			showFeedbackButton.setHidden(false);
		}

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
				if(operation.error.status != 404)  {
	    			me.getApplication().handleServerError({
                		'error': operation.error, 
                		'forceLogout': {403:true}
                	});
	    		} else {
	    			//Feedback not found, wrong feedback id in appstate
	    			console.error('Feedback.loadFeedback: could not load feedback ' + id );
	    		}
			}
		})
	},
	/**
	* Deletes feedbackData.
	*/
	clearFeedback: function() {
		var lounge = this.getLounge(),
			emailfields = lounge.query('feedbackform emailfield'),
			textareafields = lounge.query('feedbackform textareafield'),
			showFeedbackLeaveButton = this.getShowFeedbackButton(),
			activeFeedback = this.getActiveFeedback();

		//clear email and password fields
		Ext.Array.each(emailfields, function(field) {
			field.setValue("");
		});

		Ext.Array.each(textareafields, function(field) {
			field.setValue("");
		});
		
		if(activeFeedback) {
			if(activeFeedback.answers()) {
				//destroy all answers otherwise they reappear in fucking sencha store with old values
				activeFeedback.answers().each(function(answer) {
					answer.destroy();
				});
				activeFeedback.answers().removeAll();
			}

			activeFeedback.destroy();
		}

		this.setActiveFeedback(null);
		
		if(showFeedbackLeaveButton) {
			showFeedbackLeaveButton.setHidden(false);
		}

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
    * Return to dashboard view.
    */
    backToDashboard: function(button) {
		var lounge = this.getLounge();
		lounge.selectByAction('show-clubdashboard');
    },
     /**
	* Tap handler for backbutton.
	*/
	// backLeaveButtonHandler: function(button) {
	// 	this.backToMyOrders();
	// },
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
    	try {
    		this.setSubmitted(false);
    		//clear feedbackId
      		this.getApplication().getController('CheckIn').getAppState().set('feedbackId', null);
      		this.clearFeedback();
    	} catch(e) {
      		console.error('Feedback.cleanup: failed ' + e);
    	}
    },
    /**
	* Reset all active feedback to default.
	*/
	resetActiveFeedback: function() {
		var me = this,
			lounge = this.getLounge(),
			forms = lounge.query('feedbackform dataview'),
			emailfields = lounge.query('feedbackform emailfield'),
			textareafields = lounge.query('feedbackform textareafield');

		if(!this.getActiveFeedback()) {
			console.error('Feedback.resetActiveFeedback: no active feedback');
			return;
		}

		if(!this.getFeedbackTemplate()) {
			console.error('Feedback.resetActiveFeedback: no feedback template');
			return;
		}

		//copy all questions and add them to answers of active feedback
		me.getFeedbackTemplate().questions().each(function(question) {
			me.getActiveFeedback().answers().add(question.copy(question.get('id')));
		});

		Ext.Array.each(emailfields, function(field) {
			field.setValue("");
		});

		Ext.Array.each(textareafields, function(field) {
			field.setValue("");
		});

	}
});