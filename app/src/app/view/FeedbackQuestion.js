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
			cls: 'feedback-label',
			margin: '-10 0 0 0'
		},
		/** An Ext.field.Slider used to rate.*/
		slider: {
			increment: 1,
			minValue: 0,
			maxValue: 4,
			flex: 5,
			cls: 'feedback-slider',
			value: 3
		},
		sliderValue: {
			flex: 1,
			height: 27,
			width: 27,
			src: 'res/images/feedback/smilie_happy_27px.png',
			margin: '-5 0 0 0'
		},
		dataMap: {
			getQuestion: {
				setHtml: 'question'
			}
	 	},
	 	layout: {
			type: 'hbox',
			align: 'center'
		},

		//holds filenames for the smilie graphics used for rating
		smilies: ['smilie_xsad_27px.png', 'smilie_sad_27px.png', 'smilie_neutral_27px.png', 'smilie_happy_27px.png', 'smilie_xhappy_27px.png']
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

	applySliderValue: function(config) {
		return Ext.factory(config, Ext.Img, this.getSliderValue());
	},

	updateSliderValue: function(newItem, oldItem) {
		if(newItem) {
			//set smilie based on rating
			// newItem.setSrc('res/images/feedback/'+this.getSmilies()[this.getRecord().get('rating')]);
			this.add(newItem);			
		}

		if(oldItem) {
			this.remove(oldItem);
		}
	},

	applySlider: function(config) {
		return Ext.factory(config, Ext.field.Slider, this.getSlider());
	},

	updateSlider: function(newItem, oldItem) {
		if(newItem) {
			// var smilies = ['smilie_xsad.png', 'smilie_sad.png', 'smilie_neutral.png', 'smilie_happy.png', 'smilie_xhappy.png'];

			// //set value of slider to value of record and corresponding smilie
			// newItem.setValue(this.getRecord().get('rating'));				

			newItem.on('change', function(me, slider, thumb, newVal, oldVal) {
					var val = me.getValue()[0];

					// console.log('EatSense.view.FeedbackQuestion.updateSlider -> setting new rating to ' + me.getValue());
					this.getRecord().set('rating', val);

					this.getSliderValue().setSrc('res/images/feedback/'+this.getSmilies()[val]);					
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
		this.getSlider().setValue(newRecord.get('rating'));		
		this.getSliderValue().setSrc('res/images/feedback/'+this.getSmilies()[newRecord.get('rating')]);
		

		this.callParent([newRecord]);	
	}

});