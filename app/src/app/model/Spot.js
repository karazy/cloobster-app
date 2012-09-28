Ext.define('EatSense.model.Spot', {
	extend : 'Ext.data.Model',
	requires: ['EatSense.model.PaymentMethod'],
	config : {
		idProperty : 'barcode',
		fields : [ {
			name : 'barcode',
			type : 'string'
		}, {
			name : 'business',
			type : 'string'
		}, {
			name : 'businessId',
			type : 'string'
		}, {
			name : 'name',
			type : 'string'
		},		
		{
			name: 'areaId'
		},
		{
			name: 'logoUrl',
			type: 'string',
			persist: false
		},
		{
			name: 'headerUrl',
			type: 'string',
			persist: false
		},
		{
			name: 'theme',
			type: 'string',
			defaultValue: 'default'
		}],
		 associations: [{
	            type: 'hasMany',
	            model: 'EatSense.model.PaymentMethod',
	            primaryKey: 'id',
	            name: 'payments',
	            //autoLoad: true,
	            associationKey: 'payments', // read child data from child_groups
	            store: {
	            	sorters: [
						{
							property: 'order',
							direction: 'ASC'
						}
	            	]
	            }
	        }],
		proxy : {
			type : 'rest',
			url : '/spots/',
			enablePagingParams: false,
			reader : {
				type : 'json',
			}
		}
	}
});