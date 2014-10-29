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
			},
			{
				name: 'imageTransient',
				type: 'boolean',
				persist: false,
				defaultValue: false
			}
			// {
			// 	name: 'refId',
			// 	type: 'string'
			// }
		],
		imageBackup: null,
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
            // autoLoad: true,
            associationKey: 'image', // read child data from child_groups,
            store: {
            	syncRemovedRecords: false
        	}
	    }]
	},
	
	/**
	* Fill data from location.
	* @param {EatSense.model.Business} location
	*	Location to use data from
	*/
	fillByLocation: function(location) {
		var toVisit = this;

		if(!location) {
			console.error('EatSense.model.Visit: no location given');
			return;
		}

        toVisit.set('locationName', location.name);
        if(location.images && location.images.logo) {
           toVisit.set('imageUrl', location.images.logo);
        }
        toVisit.set('locationId', location.id);
        formattedAddress = appHelper.formatBusinessAddress(location);
        toVisit.set('locationCity', formattedAddress);
        toVisit.set('geoLat', location.geoLat);
        toVisit.set('geoLong', location.geoLong);  
	}


});

//id,account(parent), locationName, comment, createdOn, visitDate (optional), pictureUrl (if not cloobster), location (key if cloobster), geoLocation, refId (google places or foursquare)