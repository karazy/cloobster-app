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
				name : 'id',
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
			}			
		],
	    proxy: {
			type: 'rest',
			enablePagingParams: false,
	 		url : '/c/businesses'
		}
	}
});