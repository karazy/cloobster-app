/**
* Controller to handle submit and loading of feedback forms.
*
*/
Ext.define('EatSense.controller.Feedback', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.model.Feedback'],
	config: {
		refs: {
			//feedback button in request tab
			showFeedbackButton: 'requeststab button[action=feedback]',
			feedbackLabel: 'requeststab #feedbackLabel',
			//feedback button in myorders tab
			showFeedbackLeaveButton: 'myorderstab button[action=feedback]',
			requestNavview: 'requeststab navigationview',
			myordersNavview: 'myorderstab navigationview',
			feedback: {
				xtype: 'feedback',
				selector: 'feedback',
				autoCreate: true
			},
			questionsList: 'feedback dataview',
			emailField: 'feedback emailfield',
			commentField: 'feedback textareafield',
			submitFeedBackButton: 'feedback button[action=submit]'
		},
		control: {
			showFeedbackButton: {
				tap: 'showFeedbackForm'
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
			}
		},

		/** Feedback object for this checkIn. */
		activeFeedback: null,
		/** The feedback form. */
		feedbackTemplate: null,

		activeNavview: null
	},

	/**
	* Display feedback form from request tab.
	* @param button
	*	Button which fired tap event
	*/
	showFeedbackForm: function(button) {
		var me = this,
			feedback = this.getFeedback(),
			requestNavview = this.getRequestNavview();

		this.propateFeedbackForm();

		//show feedback form
		requestNavview.push(feedback);
		this.setActiveNavview(requestNavview);
	},

	/**
	* Display feedback form from myorders tab.
	* @param button
	*	Button which fired tap event
	*/
	showFeedbackLeaveForm: function(button) {
		var me = this,
			feedback = this.getFeedback(),
			myordersNavview = this.getMyordersNavview();

		this.propateFeedbackForm();

		//show feedback form
		myordersNavview.push(feedback);
		this.setActiveNavview(myordersNavview);
	},
	/**
	* Load Feedback data from server.
	*/
	loadFeedbackTemplate: function() {
		var me = this,
			feedbackStore = Ext.StoreManager.lookup('feedbackStore');

		//Feedback does not exist, create it and load feedback form template
		if(!this.getActiveFeedback()) {
			this.setActiveFeedback(Ext.create('EatSense.model.Feedback'));
			this.getActiveFeedback().setId('');

			feedbackStore.load({
			    callback: function(records, operation, success) {
			    	if(success) {
			    		console.log('set question list');
			    		me.enableFeedback();

						me.setFeedbackTemplate(feedbackStore.getAt(0));

						me.getActiveFeedback().set('formId', me.getFeedbackTemplate().getId());

						//copy all questions and add them to answers of active feedback
						me.getFeedbackTemplate().questions().each(function(question) {
							me.getActiveFeedback().answers().add(question.copy(question.get('id')));
						});		    		
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
	*/
	propateFeedbackForm: function() {
		if(this.getActiveFeedback()) {
			//feedback exists, simply set the store
			this.getQuestionsList().setStore(this.getActiveFeedback().answers());
			this.getEmailField().setValue(this.getActiveFeedback().get('email'));
			this.getCommentField().setValue(this.getActiveFeedback().get('comment'));
		}
	},
	/**
	* Change handler vor email field. Saves the value in feedback object.
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
			feedback = this.getFeedback(),
			requestNavview = this.getRequestNavview(),
			questions = this.getQuestionsList(),
			emailField = feedback.down('#email'),
			commentField = feedback.down('#comment'),
			currentAnswer,
			errors;

		console.log('submitting feedback');
		//1. set comment and email
		activeFeedback.set('comment', commentField.getValue());
		activeFeedback.set('email', emailField.getValue());

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
		questions.getStore().each(function(answer) {
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
		this.getActiveNavview().pop();
		this.setActiveNavview(null);

		//hide the feedback button after payment request when feedback has been submitted
		this.getShowFeedbackLeaveButton().setHidden(true);

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
		this.getFeedbackLabel().setHidden(false);

		if(!this.getActiveFeedback().get('id')) {
			this.getShowFeedbackLeaveButton().setHidden(false);
		}
	},
	/**
	* @private
	* Disable feedback funtionality by hiding the buttons.
	*/
	disableFeedback: function() {
    	this.getShowFeedbackLeaveButton().setHidden(true);
		this.getShowFeedbackButton().setHidden(true);
		this.getFeedbackLabel().setHidden(true);
	},
	/**
	* Loads an existing feedback form.
	* @param id
	*	Id of feedback.
	*/
	loadFeedback: function(id) {
		var me = this;

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
		//override with new empty feedback object
		this.setActiveFeedback(null);

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
	}
});