/**
*	Represents a question of a feedback form.
*/
Ext.define('EatSense.view.FeedbackQuestion', {
	extend: 'Ext.dataview.component.DataItem',
	xtype: 'feedbackquestion',
	config: {

		/** An Ext.Label displaying question text. */
		question: {
			flex: 4,
			cls: 'general-label'
		},
		/** An Ext.field.Slider used to rate.*/
		slider: {
			// increment: 1,
			minValue: 0,
			maxValue: 5,
			flex: 5,
			cls: 'feedback-slider'
		},
		sliderValue: {
			flex: 1
		},
		dataMap: {
			getQuestion: {
				setHtml: 'question'
			}
	 	},
	 	layout: {
			type: 'hbox',
			// pack: 'end',
			// align: 'center'
		}
	},

	applyQuestion: function(config) {
		console.log('applyQuestion');
		return Ext.factory(config, Ext.Label, this.getQuestion());
	},

	updateQuestion: function(newItem, oldItem) {
		console.log('updateQuestion');
		if(newItem) {
			this.add(newItem);
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applySliderValue: function(config) {
		return Ext.factory(config, Ext.Label, this.getSliderValue());
	},

	updateSliderValue: function(newItem, oldItem) {
		if(newItem) {
			this.add(newItem);
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applySlider: function(config) {
		console.log('applySlider');
		return Ext.factory(config, Ext.field.Slider, this.getSlider());
	},

	updateSlider: function(newItem, oldItem) {
		console.log('updateSlider');
		if(newItem) {			
			newItem.on('change', function(me, slider, thumb, newVal, oldVal) {
					var val = me.getValue()[0];
					console.log('FeedbackQuestion.updateSlider -> setting new rating to ' + me.getValue());
					this.getRecord().set('rating', val);
					this.getSliderValue().setHtml('<h2>'+val+'</h2>');	
				},
			this);

			this.add(newItem);
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	}

});