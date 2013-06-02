Ext.define('EatSense.model.Visit', {
	extend: 'Ext.data.Model',
	requires: ['EatSense.model.Image'],
	config: {
		identifier: {
			type: 'none'
		},
		fields: [
			{
				name: 'id'	
			},
			{
				name: 'locationName',
				type : 'string'
			},
			{
				name: 'locationId',
				type : 'string'
			},
			{
				name: 'comment',
				type: 'string'
			},
			{
				name: 'createdOn',
				type: 'date',
				dateFormat: 'time',
				persist: false
			},
			{
				name: 'geoLat'
			},
			{
				name: 'geoLong'
			},
			{
				name: 'visitDate',
				type: 'date',
				dateFormat: 'time'
			},
			{
				name: 'locationCity',
				type: 'string'
			},
			{
				name: 'imageUrl',
				type: 'string'
			},
			{
				name: 'image_id',
				persist: false
			}
			// {
			// 	name: 'refId',
			// 	type: 'string'
			// }
		],
		proxy: {
			type: 'rest',
	 		enablePagingParams: true,
	 		url : '/c/visits',
	 		writer: new EatSense.override.CustomJsonWriter(
	 		{
	   			type: 'json',
	   			writeAllFields: true
	   		})
		},
		associations: [
		 {
            type: 'hasOne',
            model: 'EatSense.model.Image',
            primaryKey: 'id',
            name: 'image',
            autoLoad: true,
            associationKey: 'image', // read child data from child_groups,
            store: {
            	syncRemovedRecords: false
        	}
	    }]
	}


});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)