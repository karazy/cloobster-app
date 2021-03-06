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
			},
			{
				name: 'geoLat'
			},
			{
				name: 'geoLong'
			},
			{
				name: 'distance'
			}
			//contains raw.features which list all avail features for this business		
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
		        	//TODO ST 2.1 Workaround http://www.sencha.com/forum/showthread.php?249230-ST-2.1-Store-remove-record-fails-with-Cannot-call-method-hasOwnProperty-of-null&p=912339#post912339
            		destroyRemovedRecords: false,
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
	},

	/**
	* Checks if a given feature is enabled.
	* @param {String} feature
	*	Feature to check enabled state for.
	* @param {Boolean} hideWhenNotExists
	*	When true will return false if no configuration for this feature exsits.
	* @return
	*	True if enabled. If no features exist or key is not found always returns true.
	*/
	isFeatureEnabled: function(feature, hideWhenNotExists) {
		var _hideWhenNotExists = (hideWhenNotExists) ? false : true;
		
		if(this.raw && this.raw.features) {
			if(this.raw.features.hasOwnProperty(feature)) {
				return this.raw.features[feature];
			} else {
				return _hideWhenNotExists;
			}
		} else {
			return _hideWhenNotExists;
		}
	}
});