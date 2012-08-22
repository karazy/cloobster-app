/**
 * Contains all information to restore application state, such as which orders
 * are in the cart. Furthermore used to store user settings.
 * 
 */
Ext.define('EatSense.model.AppState', {
	extend : 'Ext.data.Model',
	config : 
		{
		fields : [ {
			name : 'id'
		}, 
		{
			name : 'nickname',
			type : 'string'
		}, 
		{
			name : 'checkInId',
			type : 'string'
		}, 
		{
			name: 'accessToken',
			type: 'string'
		},
		{
			name: 'newsletterRegistered',
			type: 'boolean'
		}, 
		{
			name: 'feedbackId',
			type: 'number'
		} ]
	}
});