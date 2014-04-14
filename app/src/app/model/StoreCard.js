/**
* This class represents an StoreCard.
*
*/
Ext.define('EatSense.model.StoreCard', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'id',
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
		},
		{
			name: 'html'
		},
		{
			name: 'codeType'
		}
		],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/accounts/{accountId}/storecards'
		}
	}
});