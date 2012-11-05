/**
* This class represents an InfoPage.
*
*/
Ext.define('EatSense.model.InfoPage', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'id',
		fields: [
		{
			name: 'id',
			type: 'number'
		},
		{
			name: 'title'
		},
		{
			name: 'shortText'
		},
		{
			name: 'html'
		},
		{
			name: 'image'
		}
		],
		proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses/{pathId}/feedback',
		}
	}
});