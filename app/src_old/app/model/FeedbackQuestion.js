/**
* Feedback model.
*/
Ext.define('EatSense.model.FeedbackQuestion', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'id',
		fields: [
			{
				name: 'id'
			},
			{
				name: 'question'
			},
			{
				name: 'rating',
				type: 'number'
			},
			{	//ignore auto generated field from sencha
				name: 'feedback_id',
				persist: false
			},
			{	//ignore auto generated field from sencha
				name:'feedbackform_id',
				persist: false
			}
		]
	}
});