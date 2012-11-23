/**
* This class holds conrete feedback from user.
* Whereas the FeedbackForm only acts as a template.
*
*/
Ext.define('EatSense.model.Feedback', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'id',
		fields: [
		{
			name: 'id',
			type: 'number'
		},
		{
			name: 'comment'
		},
		{
			name: 'email'
		},
		{
			name: 'formId'
		}
		],
		validations: [
		{
			type: 'email', field: 'email'
		}],
		associations: [{
            type: 'hasMany',
            model: 'EatSense.model.FeedbackQuestion',
            primaryKey: 'id',
            name: 'answers',
            // autoLoad: true,
            associationKey: 'answers'
	    }],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses/{pathId}/feedback',
	 		reader: {
	 			type: 'json'
	 		},
	 		writer: new EatSense.override.CustomJsonWriter({
				writeAllFields: true
				// root: 'answers' //Optional
			})
		}
	}
});