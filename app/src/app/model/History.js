Ext.define('EatSense.model.History', {
	extend: 'Ext.data.Model',
	fields: [
	{
		name: 'businessName'	
	},
	{
		name: 'billTime'
	},
	{
		name: 'billTotal'
	},
	{
		name: 'businessId'
	},
	{
		name: 'checkInId'
	}
	],

	proxy: {}
		type: 'rest',
 		enablePagingParams: true,
 		url : ' /c/checkins/history',
 		reader: {
 			type: 'json'
 		}
	}

});