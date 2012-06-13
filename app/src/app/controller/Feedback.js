Ext.define('EatSense.controller.Feedback', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.model.Feedback'],
	config: {
		refs: {
			showFeedbackButton: 'requeststab button[action=feedback]',
			requestNavview: 'requeststab navigationview',
			feedback: {
				xtype: 'feedback',
				selector: 'feedback',
				autoCreate: true
			},
			questionsList: 'feedback dataview',
			submitFeedBackButton: 'feedback button[action=submit]'
		},
		control: {
			showFeedbackButton: {
				tap: 'showFeedbackForm'
			},
			submitFeedBackButton: {
				tap: 'submitFeedback'
			}
		},

		/** Feedback object for this checkIn. */
		activeFeedback: null,
		/** The feedback form. */
		feedbackTemplate: null
	},

	/**
	* Display feedback form.
	* @param button
	*	Button which fired tap event
	*/
	showFeedbackForm: function(button) {
		var me = this,
			feedback = this.getFeedback(),
			questionsList = this.getQuestionsList(),
			feedbackStore = Ext.StoreManager.lookup('feedbackStore'),
			requestNavview = this.getRequestNavview();

		if(!this.getActiveFeedback()) {
			this.setActiveFeedback(Ext.create('EatSense.model.Feedback'));
			this.getActiveFeedback().setId('');
		}

		feedbackStore.load({
			    callback: function(records, operation, success) {
			    	if(success) {
			    		console.log('set question list');
			    		me.setFeedbackTemplate(feedbackStore.getAt(0))
			    		//because only one active form exists, we can directly access it
			    		questionsList.setStore(me.getFeedbackTemplate().questions());
			    	}
			    	else { 
                        me.getApplication().handleServerError({
                        	'error': operation.error, 
                        	'forceLogout': {403:true}
                        }); 
                    }
			    }
			 });

		requestNavview.push(feedback);
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
		//1. get Feedback Data from
		activeFeedback.set('formId', feedbackTemplate.getId());
		activeFeedback.set('comment', commentField.getValue());
		activeFeedback.set('email', emailField.getValue());
		//1.1 Get the answers

		questions.getStore().each(function(answer) {
			console.log(answer.get('question'));
			currentAnswer = activeFeedback.answers().getById(answer.get('id'));
			//answer exist, jsut update it
			if(currentAnswer) {
				currentAnswer.set('rating', answer.get('rating'));
			} else {
				//assign new answer
				currentAnswer = answer;
				activeFeedback.answers().add(currentAnswer);
				//Sencha Work arounds
				delete currentAnswer.data.feedback_id;
				delete currentAnswer.data.feedbackform_id;
				// currentAnswer.setId(currentAnswer.get('id'));
			}
		});

		//2. submit data
		activeFeedback.save({
			success: function(record, operation) {
				//4. clear feedback
				me.clearFeedback();
			},
			failure: function(record, operation) {
				me.getApplication().handleServerError({
					'error': operation.error,
					'forceLogout': {403: true}
				});
			}
		});

		//3. back to VIP view
		requestNavview.pop();

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
	* Deletes feedbackData.
	*/
	clearFeedback: function() {
		//override with new empty feedback object
		this.setActiveFeedback(Ext.create('EatSense.model.Feedback'));
		this.getActiveFeedback().setId('');
	}
});