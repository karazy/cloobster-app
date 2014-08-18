/**
* This class represents an StoreCard.
* @Decprecated
*/
Ext.define('EatSense.model.StoreCard', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'id',
		identifier: {
			type: 'none'
		},
		fields: [
		{
			name: 'id',
			type: 'number'
		},
		{
			name: 'cardNumber'
		},
		{
			name: 'locationId',
			type: 'number'
		}
		],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/accounts/{accountId}/storecards'
		}
	}
});