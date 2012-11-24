/**
*	Represents a question of a feedback form.
*/
Ext.define('EatSense.view.FeedbackQuestion', {
	extend: 'Ext.dataview.component.DataItem',
	requires: ['EatSense.view.StarsInput'],
	xtype: 'feedbackquestion',
	config: {

		/** An Ext.Label displaying question text. */
		question: {
			// flex: 1,
			cls: 'feedback-label'
		},
		stars: {
			// flex: 1
		},
		dataMap: {
			getQuestion: {
				setHtml: 'question'
			}
	 	},
	 	layout: {
			type: 'vbox',
			align: 'center',
			pack: 'start'
		},
	},

	applyQuestion: function(config) {
		return Ext.factory(config, Ext.Label, this.getQuestion());
	},

	updateQuestion: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applyStars: function(config) {
		return Ext.factory(config, EatSense.view.StarsInput, this.getStars());
	},

	updateStars: function(newItem, oldItem) {
		if(newItem) {
			

			newItem.on('starvaluechanged', function(button, rating) {
					// console.log('EatSense.view.FeedbackQuestion.updateStars -> setting new rating to ' + rating);
					this.getRecord().set('rating', rating);

				},
			this);
			this.add(newItem);
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	},

	updateRecord: function(newRecord) {
		if(!newRecord) {
			return;
		};

		// console.log('EatSense.view.FeedbackQuestion.updateRecord > rating=' + newRecord.get('rating'));
		this.getStars().letTheStarsShine(newRecord.get('rating'));

		this.callParent([newRecord]);	
	}

});