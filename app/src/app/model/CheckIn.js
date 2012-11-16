Ext.define('EatSense.model.CheckIn', {
	extend : 'Ext.data.Model',
	config : {
		idProperty : 'userId',
		fields : [ {
			name : 'status',
			type : 'string'
		}, {
			name : 'businessName',
			type : 'string'
		}, {
			name : 'businessId',
			type : 'string'
		},
		{
			name : 'spot',
			type : 'string'
		}, {
			name : 'spotId',
			type : 'string'
		}, {
			name : 'userId',
			type : 'string'
		},
		{
			name : 'linkedCheckInId',
			type : 'string'
		},
		{
			name : 'nickname',
			type : 'string'
		}, {
			name : 'deviceId',
			type : 'string'
		} ],
		proxy : {
			type : 'rest',
			url : '/c/checkins/',
			enablePagingParams: false,
			reader : {
				type : 'json',
			}
		},
		associations: [{
	            type: 'hasMany',
	            model: 'EatSense.model.Order',
	            name: 'orders',
	            store: {
	            	syncRemovedRecords: false,
            		//TODO ST 2.1 Workaround http://www.sencha.com/forum/showthread.php?249230-ST-2.1-Store-remove-record-fails-with-Cannot-call-method-hasOwnProperty-of-null&p=912339#post912339
            		destroyRemovedRecords: false
	            }
	    }]
	}

});