Ext.define('EatSense.model.Product', {
	extend : 'Ext.data.Model',
	config : {
		idProperty : 'id',
		fields : [ 
		{
			name : 'id',
			type : 'string'
		}, 
		{
			name : 'name',
			type : 'string'
		}, 
		{
			name : 'shortDesc',
			type : 'string'
		}, 
		{
			name : 'longDesc',
			type : 'string'
		}, 
		{
			name : 'price',
			type: 'number'
		}, 
		{
			name: 'order',
			type: 'number'
		}, 
		{ //dont change, gets set automatically
			name: 'price_calculated',
			persist: false,
			type: 'number'
		},
		{
			name: 'special',
			type: 'boolean'
		},
		{
			name: 'imageUrl',
			type: 'string'
		},
		{
			name: 'hideInDashboard',
			type: 'boolean'
		},
		{
			name: 'menuId'
		}],
		 associations: [
		 {
            type: 'hasMany',
            model: 'EatSense.model.Choice',
            primaryKey: 'id',
            name: 'choices',
            // autoLoad: true,
            associationKey: 'choices', // read child data from child_groups,
            store: {
            	syncRemovedRecords: false
        	}
	    }],
	    proxy: {
		   type: 'rest',
		   url : '/c/businesses/{pathId}/products',
		   enablePagingParams: false,
		   reader: {
			   type: 'json'
	   		},
	   		writer: {
	   			type: 'json',
	   			writeAllFields: true
	   		}
	   }
	},
	
	validate: function() {
		
	},
	/**
	 * Calculates total cost of this product including choices, returns it and
	 * stores it in priceCalculated.
	 * @param amount
	 * 		How often this product is ordered.
	 * 
	 */
	calculate: function(amount) {
		var _total = this.get('price'), _amount = 1;
		this.choices().each(function(choice, index) {
			_total += choice.calculate();
		});
		if(amount) {
			_amount = amount;
		}
		// _total = appHelper.roundPrice(_total*_amount);
		_total = _total*_amount;
		this.set('price_calculated', _total);
		return _total;
	},
	/**
	*	Returns a deep raw json representation of this product.
	*
	*/	
	getRawJsonData: function() {
		var rawJson = {},
			choicesCount = this.choices().getCount(),
			index = 0;
		
		rawJson.id = this.get('id');
		rawJson.name = this.get('name');
		rawJson.shortDesc = this.get('shortDesc');
		rawJson.longDesc = this.get('longDesc');
		rawJson.price = this.get('price');
		
		rawJson.choices = new Array(this.choices().data.length);
		
		for( ; index < choicesCount; index++) {
			rawJson.choices[index] = this.choices().getAt(index).getRawJsonData();
		}		
		return rawJson;
	},
	/**
	*	Sets the data of this object based on a raw json object.
	*	
	*/	
	setRawJsonData: function(rawData) {
		var index = 0,
			choicesCount = rawData.choices.length,
			choice;

		if(!rawData) {
			return false;
		}

		for( ; index < choicesCount; index++) {
			//check if an option with given id exists
			choice = this.choices().getById(rawData.choices[index].id);
			if(choice) {
				console.log('option with id ' + rawData.choices[index].id);
				if(!choice.setRawJsonData(rawData.choices[index])) {
					return false;
				}
			} 
		}

		this.set('id', rawData.id);
		this.set('name', rawData.name);
		this.set('shortDesc', rawData.shortDesc);
		this.set('longDesc', rawData.longDesc);
		this.set('price', rawData.price);
						
		return true;
	},
	debugData: function() {
		try {
			console.log('EatSense.model.Product: data '+ 
				'id:' + this.get('id') +
				' name:' + this.get('name') +
				' shortDesc:' + this.get('shortDesc') +
				' longDesc:' + this.get('longDesc') +
				' price:' + this.get('price')
				);	
		} catch(e) {
			console.log('EatSense.model.Product: failed to output debug data');
		}
		
	}
});