Ext.define('EatSense.model.Menu', {
	extend: 'Ext.data.Model',
	requires: ['EatSense.model.Product','EatSense.model.Choice','EatSense.model.Option'],
	config : {
		idProperty: 'id',
		syncRemovedRecords: false,
		fields: [
		    {	
		    	name: 'id', 
		    	type: 'string'
			},
			{
				name: 'title', 
				type: 'string'}
			,
			{
				name: 'order',
				type: 'number'
			},
			{
				name: 'description',
				type: 'string'
			},
			{
				name: 'imageUrl',
				type: 'string'
			}
		],
		proxy: {
		   type: 'rest',
		   url : '/c/businesses/{pathId}/menus',
		   enablePagingParams: false,
		   reader: {
			   type: 'json'
	   		}
	 	}
	}
});