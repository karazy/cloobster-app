/**
* A business profile.
* Also Contains images assigned to profile. Accesible via raw.images.IDENTIFIER
*/
Ext.define('EatSense.model.Business', {
	extend: 'Ext.data.Model',
	requires: [], //'EatSense.model.Image'
	config: {
		fields: [
			{
				name : 'id'
			}, 
			{
				name : 'name',
				type : 'string'
			},
			{
				name: 'slogan'
			},
			{
				name: 'description'
			},
			{
				name: 'url'
			},
			{
				name: 'fbUrl'
			},
			{
				name: 'city'
			},
			{
				name: 'address'
			},
			{
				name: 'postcode'
			},
			{
				name: 'phone'
			},
			{
				name: 'currency',
				type: 'string'
			},
			{
				name: 'theme',
				type: 'string',
				defaultValue: 'default'
			},
			{
				name: 'basic',
				type: 'bool'
			}			
		],
		associations: [{
		        type: 'hasMany',
		        model: 'EatSense.model.PaymentMethod',
		        primaryKey: 'id',
		        name: 'payments',
		        //autoLoad: true,
		        associationKey: 'paymentMethods', // read child data from child_groups
		        store: {
		        	syncRemovedRecords: false,
		        	sorters: [
						{
							property: 'order',
							direction: 'ASC'
						}
		        	]
		        }
		    }],
	    proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses'
		}
	}
});