Ext.define('EatSense.model.Menu', {
	extend: 'Ext.data.Model',
	requires: ['EatSense.model.Product','EatSense.model.Choice','EatSense.model.Option'],
	config : {
		idProperty: 'id',
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
			}
		],
		proxy: {
		   type: 'rest',
		   url : '/c/businesses/{pathId}/menus',
		   enablePagingParams: false,
		   reader: {
			   type: 'json'
	   		}
	 	},
		hasMany: {
			model: 'EatSense.model.Product',
			name: 'products',
			store: {
				sorters: [
			     			{
			    				property: 'order',
			    				direction: 'ASC'
			    			},
			    			{
			    				property: 'name',
			    				direction: 'ASC'
			    			}
			    	    ]
			} 
		}
	}
});