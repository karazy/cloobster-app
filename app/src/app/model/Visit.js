Ext.define('EatSense.model.Visit', {
	extend: 'Ext.data.Model',
	config: {
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
				type: 'date'
			},
			{
				name: 'visitDate',
				type: 'date'
			},
			{
				name: 'pictureUrl',
				type: 'string'
			},
			{
				name: 'refId',
				type: 'string'
			}
		],
		proxy: {
			type: 'rest',
	 		enablePagingParams: true,
	 		url : '/c/visits'
		}
	}


});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)