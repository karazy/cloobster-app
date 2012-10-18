/**
* Controller to handle submit, loading of feedback forms
* and ui actions in form views.
*/
Ext.define('EatSense.controller.Feedback', {
	extend: 'Ext.app.Controller',
	requires: ['EatSense.model.Feedback'],
	config: {
		refs: {
			//feedback button in request tab
			clubArea: 'clubarea',
			showFeedbackButton: 'clubarea clubdashboard button[action=show-feedback]',
			// feedbackLabel: 'clubdashboard #feedbackLabel',
			//feedback button in myorders tab
			showFeedbackLeaveButton: 'myorderstab button[action=feedback]',
			// requestNavview: 'requeststab navigationview',
			myordersNavview: 'myorderstab navigationview',
			feedback: {
				xtype: 'feedbackform',
				selector: 'feedbackform',
				autoCreate: true
			},
			questionsList: 'feedbackform dataview',
			emailField: 'feedbackform emailfield',
			commentField: 'feedbackform textareafield',
			submitFeedBackButton: 'feedbackform button[action=submit]',
			//back button in dashboard
			backButton: 'clubarea #feedback button[action=back]'
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
			},
			// requestNavview : {
			// 	back: 'navBackButtonTap'
			// },
			myordersNavview : {
				back: 'navBackButtonTap'
			},
			backButton : {
				tap: 'backToDashboard'
			}
		},

		/** Feedback object for this checkIn. */
		activeFeedback: null,
		/** The feedback form. */
		feedbackTemplate: null,
		//home if opened from dashboard, checkout otherwise
		feedbackOrigin: null
	},

	/**
	* Display feedback form from request tab.
	* @param button
	*	Button which fired tap event
	*/
	showFeedbackForm: function(button) {
		var me = this,
			clubArea = this.getClubArea();

		this.setFeedbackOrigin('home');
		//make sure feedback form exists
		this.getFeedback();
		this.propateFeedbackForm();

		//show feedback form
		clubArea.setActiveItem(1);

		this.getApplication().getController('Android').addBackHandler(function() {
            me.backToDashboard();
        });
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
		this.setFeedbackOrigin('checkout');

		//show feedback form
		myordersNavview.push(feedback);
		this.setActiveNavview(myordersNavview);

		this.getApplication().getController('Android').addBackHandler(function() {
            myordersNavview.pop();
        });
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
			    	if(success) {
			    		console.log('set question list');
			    		me.enableFeedback();

						me.setFeedbackTemplate(feedbackStore.getAt(0));

						me.getActiveFeedback().set('formId', me.getFeedbackTemplate().getId());

						//copy all questions and add them to answers of active feedback
						me.getFeedbackTemplate().questions().each(function(question) {
							me.getActiveFeedback().answers().add(question.copy(question.get('id')));
						});

						if(appHelper.isFunction(callbackFn)) {
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
			feedback = this.getFeedback(),
			// requestNavview = this.getRequestNavview(),
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
		if(this.getFeedbackOrigin() == 'home') {
			this.backToDashboard();			
		} else if(this.getFeedbackOrigin()) {
			this.getMyordersNavview().pop();
		} else {
			console.log('Feedback.submitFeedback > incorrect feedback origin provided: ' + this.getFeedbackOrigin());
		};

		this.setFeedbackOrigin(null);
		

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
		// this.getFeedbackLabel().setHidden(false);

		if(!this.getActiveFeedback() || !this.getActiveFeedback().get('id')) {
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
	},
	/**
	* 
	*/
	navBackButtonTap: function(button) {
        console.log('SettingsController.navBackButtonTap');
        this.setFeedbackOrigin(null);
        this.getApplication().getController('Android').removeLastBackHandler();
    },
    /**
	* Tap handler for backbutton.
	*/
	backButtonHandler: function(button) {
		this.backToDashboard();
		this.getApplication().getController('Android').removeLastBackHandler();
	},
    /**
    * Return to dashboard view.
    */
    backToDashboard: function(button) {
    	var me = this,
			clubArea = this.getClubArea();

		this.setFeedbackOrigin(null);
		clubArea.switchAnim('right');
		clubArea.setActiveItem(0);
		clubArea.switchAnim('left');
    }
});