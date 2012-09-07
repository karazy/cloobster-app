Ext.define('EatSense.model.History', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{
				name: 'businessName'	
			},
			{
				name: 'billTime',
				type : 'date',
				dateFormat : 'time'
			},
			{
				name: 'billTotal',
				type: 'number'
			},
			{
				name: 'paymentMethod'
			},
			{
				name: 'businessId'
			},
			{
				name: 'id'
			}
		],

	proxy: {
		type: 'rest',
 		enablePagingParams: true,
 		url : ' /c/checkins/history',
 		reader: {
 			type: 'json'
 		}
	}
	}


});