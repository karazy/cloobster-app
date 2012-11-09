/**
* Represents a form used to gather user feedback.
* It only possible to load forms. Forms are saved via 
* a new Feedback object.
*/
Ext.define('EatSense.model.FeedbackForm', {
	extend: 'Ext.data.Model',
	requires: ['EatSense.model.FeedbackQuestion'],
	config: {
		idProperty: 'id',
		fields: [
		{
			name: 'id'
		},
		{
			name: 'title'
		},
		{
			name: 'description'
		}
		],
		associations: [{
	            type: 'hasMany',
	            model: 'EatSense.model.FeedbackQuestion',
	            primaryKey: 'id',
	            name: 'questions',
	            autoLoad: true,
	            associationKey: 'questions'
	    }],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses/{pathId}/feedbackforms',
	 		reader: {
	 			type: 'json'
	 		}
		}

	}
});