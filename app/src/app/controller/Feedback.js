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

		this.loadFeedbackTemplate();

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

		this.loadFeedbackTemplate();

		//show feedback form
		myordersNavview.push(feedback);
		this.setActiveNavview(myordersNavview);
	},

	loadFeedbackTemplate: function() {
		var me = this,
			questionsList = this.getQuestionsList(),
			feedbackStore = Ext.StoreManager.lookup('feedbackStore');

		//Feedback does not exist, create it and load feedback form template
		if(!this.getActiveFeedback()) {
			this.setActiveFeedback(Ext.create('EatSense.model.Feedback'));
			this.getActiveFeedback().setId('');

			feedbackStore.load({
			    callback: function(records, operation, success) {
			    	if(success) {
			    		console.log('set question list');
						me.setFeedbackTemplate(feedbackStore.getAt(0));

						me.getActiveFeedback().set('formId', me.getFeedbackTemplate().getId());

						//copy all questions and add them to answers of active feedback
						me.getFeedbackTemplate().questions().each(function(question) {
							me.getActiveFeedback().answers().add(question.copy(question.get('id')));
						});
			    		//because only one active form exists, we can directly access it
			    		// questionsList.setStore(me.getFeedbackTemplate().questions());			    	
			    		questionsList.setStore(me.getActiveFeedback().answers());			    		
			    	}
			    	else {
	                    me.getApplication().handleServerError({
	                    	'error': operation.error, 
	                    	'forceLogout': {403:true}
	                    });
	                }
			    }
			});
		}	else {	
			//feedback exists, simply set the store
			questionsList.setStore(me.getActiveFeedback().answers());
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
			currentAnswer;

		console.log('submitting feedback');
		//1. set comment and email
		activeFeedback.set('comment', commentField.getValue());
		activeFeedback.set('email', emailField.getValue());
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
			title : Karazy.i18n.translate('feedbackCompleteTitle'),
			'message' : Karazy.i18n.translate('feedbackCompleteMessage'),
			buttons : []
		});
		//show short alert and then hide
		Ext.defer((function() {
			if(!Karazy.util.getAlertActive()) {
				Ext.Msg.hide();
			}					
		}), Karazy.config.msgboxHideLongTimeout, this);

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