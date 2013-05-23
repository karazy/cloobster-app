Ext.define('EatSense.model.Visit', {
	extend: 'Ext.data.Model',
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
			}
			// {
			// 	name: 'refId',
			// 	type: 'string'
			// }
		],
		proxy: {
			type: 'rest',
	 		enablePagingParams: true,
	 		url : '/c/visits'
		}
	}


});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)